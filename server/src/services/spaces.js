import { Op, fn, col, literal } from 'sequelize';

import GreenSpaces from '../database/models/GreenSpaces.js';
import GreenSpaceZones from '../database/models/GreenSpaceZones.js';
import Sensors from '../database/models/Sensors.js';
import SensorReadingMetas from '../database/models/SensorReadingMetas.js';
import Alerts from '../database/models/Alerts.js';
import Reports from '../database/models/Reports.js';
import { SENSOR_TYPES } from '../lib/units.js';

/** Display metric keys derived from a sensor's parameter/type. */
const METRIC_KEYS = ['soilMoisture', 'temperature', 'co2', 'noise'];

/**
 * Map a sensor to its display metric key, by `parameter` first then `type`.
 * @param {{type?: string, parameter?: string}} sensor
 * @returns {string|null} The metric key, or null when the sensor maps to none.
 */
function metricForSensor(sensor) {
  const param = String(sensor.parameter ?? '').toLowerCase();
  if (param.includes('soil') && param.includes('moist')) return 'soilMoisture';
  if (param.includes('co2')) return 'co2';
  if (param.includes('noise') || param.includes('sound')) return 'noise';
  if (sensor.type === 'temperature') return 'temperature';
  if (sensor.type === 'sound') return 'noise';
  return null;
}

/**
 * Service for the spaces routes.
 */
class SpacesService {
  /**
   * Get paginated and filtered spaces.
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.perPage
   * @param {string} [options.query]
   * @param {string} [options.parish]
   * @returns {Promise<{spaces: Array<Object>, total: number}>}
   */
  static async getSpaces({ page = 1, perPage = 10, query, parish } = {}) {
    const where = {};

    if (query) {
      const q = `%${query.toLowerCase()}%`;
      where[Op.or] = [
        literal(`LOWER(name) LIKE ${GreenSpaces.sequelize.escape(q)}`),
        literal(`LOWER(parish) LIKE ${GreenSpaces.sequelize.escape(q)}`),
        literal(`LOWER(postal_code) LIKE ${GreenSpaces.sequelize.escape(q)}`),
      ];
    }

    if (parish) {
      where.parish = parish;
    }

    const { count, rows } = await GreenSpaces.findAndCountAll({
      where,
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [['name', 'ASC']],
    });

    if (rows.length === 0) {
      return { spaces: [], total: count };
    }

    const ids = rows.map((s) => s.id);

    const [zoneCounts, sensorCounts, alertCounts] = await Promise.all([
      GreenSpaceZones.findAll({
        attributes: ['green_spaces_id', [fn('COUNT', col('id')), 'count']],
        where: { green_spaces_id: { [Op.in]: ids } },
        group: ['green_spaces_id'],
        raw: true,
      }),
      Sensors.findAll({
        attributes: [
          [col('greenSpaceZone.green_spaces_id'), 'green_spaces_id'],
          [fn('COUNT', col('Sensors.id')), 'count'],
        ],
        include: [
          {
            model: GreenSpaceZones,
            as: 'greenSpaceZone',
            attributes: [],
            required: true,
            where: { green_spaces_id: { [Op.in]: ids } },
          },
        ],
        group: ['greenSpaceZone.green_spaces_id'],
        raw: true,
      }),
      Alerts.findAll({
        attributes: ['green_space_id', [fn('COUNT', col('id')), 'count']],
        where: { green_space_id: { [Op.in]: ids } },
        group: ['green_space_id'],
        raw: true,
      }),
    ]);

    const zoneMap = new Map(zoneCounts.map((r) => [r.green_spaces_id, Number(r.count)]));
    const sensorMap = new Map(sensorCounts.map((r) => [r.green_spaces_id, Number(r.count)]));
    const alertMap = new Map(alertCounts.map((r) => [r.green_space_id, Number(r.count)]));

    const spaces = rows.map((space) => ({
      id: space.id,
      name: space.name,
      parish: space.parish,
      postal_code: space.postal_code,
      image_url: space.image_url,
      latitude: space.latitude,
      longitude: space.longitude,
      created_at: space.created_at,
      zonesCount: zoneMap.get(space.id) ?? 0,
      sensorsCount: sensorMap.get(space.id) ?? 0,
      activeAlerts: alertMap.get(space.id) ?? 0,
    }));

    return { spaces, total: count };
  }

  static async getSpaceById(spaceId, { includeZones = false, includeSensors = false, includeReports = false } = {}) {
    const include = [];

    if (includeZones) {
      const zoneInclude = { model: GreenSpaceZones, as: 'zones' };
      if (includeSensors) {
        zoneInclude.include = [{ model: Sensors, as: 'sensors' }];
      }
      include.push(zoneInclude);
    }

    if (includeReports) {
      include.push({ model: Reports, as: 'reports' });
    }

    const space = await GreenSpaces.findByPk(spaceId, include.length > 0 ? { include } : {});

    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    return space;
  }

  /**
   * Aggregate a space's sensors into per-metric summaries. Each metric reports
   * sensor count, active count, the canonical unit, the configured operating
   * range (min of min_value, max of max_value) and the latest actual reading
   * (`latestValue` / `latestUnit` / `latestAt`, sourced from the most recent
   * `sensor_reading_metas.dump`).
   *
   * Metrics are matched by sensor `parameter` first, then by `type`.
   * Metrics with no matching sensor are omitted.
   * @param {string} spaceId
   * @returns {Promise<Object>} Map of metric key to its summary.
   */
  static async getSensorsSummary(spaceId) {
    const [sensors, latestMap] = await Promise.all([
      Sensors.findAll({
        attributes: ['type', 'parameter', 'unit', 'min_value', 'max_value', 'is_active'],
        include: [
          {
            model: GreenSpaceZones,
            as: 'greenSpaceZone',
            attributes: [],
            required: true,
            where: { green_spaces_id: spaceId },
          },
        ],
        raw: true,
      }),
      this.getLatestReadingsBySpaceIds([spaceId]),
    ]);

    const summary = {};

    for (const sensor of sensors) {
      const metric = metricForSensor(sensor);
      if (!metric) continue;

      const bucket = summary[metric] ?? {
        count: 0,
        activeCount: 0,
        unit: sensor.unit ?? null,
        minValue: null,
        maxValue: null,
      };

      bucket.count += 1;
      if (sensor.is_active) bucket.activeCount += 1;
      if (sensor.unit && !bucket.unit) bucket.unit = sensor.unit;
      if (sensor.min_value != null) {
        bucket.minValue = bucket.minValue == null ? sensor.min_value : Math.min(bucket.minValue, sensor.min_value);
      }
      if (sensor.max_value != null) {
        bucket.maxValue = bucket.maxValue == null ? sensor.max_value : Math.max(bucket.maxValue, sensor.max_value);
      }

      summary[metric] = bucket;
    }

    // Fold in the latest actual reading per metric.
    const latest = latestMap.get(spaceId) ?? {};
    for (const [metric, reading] of Object.entries(latest)) {
      if (!summary[metric]) continue;
      summary[metric].latestValue = reading.value;
      summary[metric].latestUnit = reading.unit;
      summary[metric].latestAt = reading.recordedAt;
    }

    return summary;
  }

  /**
   * Latest actual reading value per metric, per space, sourced from the most
   * recent `sensor_reading_metas.dump` for each sensor. For every (space,
   * metric) the reading with the greatest `recorded_at` wins.
   * @param {Array<string>} ids - Green space ids.
   * @returns {Promise<Map<string, Object>>} Map of space id to a
   *   `{metric: {value, unit, recordedAt}}` object (metrics with no reading omitted).
   */
  static async getLatestReadingsBySpaceIds(ids) {
    const result = new Map();
    if (!ids || ids.length === 0) return result;
    for (const id of ids) result.set(id, {});

    // Latest reading time per (space, sensor) — bounded by the sensor count.
    const maxes = await SensorReadingMetas.findAll({
      attributes: [
        'green_space_id',
        'sensor_id',
        [fn('MAX', col('recorded_at')), 'last_reading_at'],
      ],
      where: { green_space_id: { [Op.in]: ids } },
      group: ['green_space_id', 'sensor_id'],
      raw: true,
    });
    if (maxes.length === 0) return result;

    // Fetch the dump of each latest row (matched on the exact recorded_at).
    const rows = await SensorReadingMetas.findAll({
      attributes: ['green_space_id', 'sensor_id', 'recorded_at', 'dump'],
      where: {
        [Op.or]: maxes.map((m) => ({
          green_space_id: m.green_space_id,
          sensor_id: m.sensor_id,
          recorded_at: m.last_reading_at,
        })),
      },
      raw: true,
    });

    const sensorIds = [...new Set(rows.map((r) => r.sensor_id))];
    const sensors = sensorIds.length
      ? await Sensors.findAll({
          attributes: ['id', 'type', 'parameter'],
          where: { id: { [Op.in]: sensorIds } },
          raw: true,
        })
      : [];
    const sensorMap = new Map(sensors.map((s) => [s.id, s]));

    // Pick the latest reading per (space, metric).
    const picked = new Map();
    for (const row of rows) {
      const sensor = sensorMap.get(row.sensor_id);
      if (!sensor) continue;
      const metric = metricForSensor(sensor);
      if (!metric) continue;
      const value = row.dump?.value;
      if (value == null) continue;

      const key = `${row.green_space_id}|${metric}`;
      const current = picked.get(key);
      if (!current || new Date(row.recorded_at) > new Date(current.recordedAt)) {
        picked.set(key, { value, unit: row.dump?.unit ?? null, recordedAt: row.recorded_at });
      }
    }

    for (const id of ids) {
      const metrics = {};
      for (const metric of METRIC_KEYS) {
        const hit = picked.get(`${id}|${metric}`);
        if (hit) {
          metrics[metric] = {
            value: hit.value,
            unit: hit.unit,
            recordedAt: new Date(hit.recordedAt).toISOString(),
          };
        }
      }
      result.set(id, metrics);
    }

    return result;
  }

  static async createSpace(data, createdBy) {
    const newSpace = await GreenSpaces.create({
      ...data,
      created_by: createdBy,
      updated_by: createdBy,
    });
    return newSpace;
  }

  /**
   * Soft-delete a space and cascade the soft-delete to its paranoid children
   * (zones, sensors, reports) so space-scoped routes stop returning them. The
   * space row is retained (deleted_at set), so foreign keys stay valid and the
   * non-paranoid children (alerts, maintenance tasks, sensor readings) remain
   * linked and reappear if the space is restored. Runs in one transaction.
   * @param {string} spaceId
   */
  static async deleteSpace(spaceId) {
    const space = await GreenSpaces.findByPk(spaceId);

    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    await GreenSpaces.sequelize.transaction(async (transaction) => {
      const zones = await GreenSpaceZones.findAll({
        attributes: ['id'],
        where: { green_spaces_id: spaceId },
        transaction,
        raw: true,
      });
      const zoneIds = zones.map((z) => z.id);

      await Reports.destroy({ where: { green_space_id: spaceId }, transaction });
      if (zoneIds.length > 0) {
        await Sensors.destroy({ where: { green_space_zone_id: { [Op.in]: zoneIds } }, transaction });
      }
      await GreenSpaceZones.destroy({ where: { green_spaces_id: spaceId }, transaction });
      await space.destroy({ transaction });
    });
  }

  static async getParishes() {
    const rows = await GreenSpaces.findAll({
      attributes: [[fn('DISTINCT', col('parish')), 'parish']],
      order: [['parish', 'ASC']],
      raw: true,
    });
    return rows.map((r) => r.parish).filter(Boolean);
  }

  static async count(options = {}) {
    return GreenSpaces.count(options);
  }

  /**
   * Per-space status of each sensor type, derived from the latest reading.
   *
   * For every space and every sensor type, the sensor with the most recent
   * reading (max recorded_at) wins; its `is_active` flag becomes the type's
   * status. Types with no readings report `isActive: false` / `lastReadingAt: null`.
   * @param {Array<string>} ids - Green space ids.
   * @returns {Promise<Map<string, Object>>} Map of space id to a `{type: {isActive, lastReadingAt}}` object.
   */
  static async getSensoresStatusBySpaceIds(ids) {
    const statusMap = new Map();
    if (!ids || ids.length === 0) return statusMap;

    // Last reading time per (space, sensor) — bounded by the number of sensors.
    const lastReadings = await SensorReadingMetas.findAll({
      attributes: [
        'green_space_id',
        'sensor_id',
        [fn('MAX', col('recorded_at')), 'last_reading_at'],
      ],
      where: { green_space_id: { [Op.in]: ids } },
      group: ['green_space_id', 'sensor_id'],
      raw: true,
    });

    const sensorIds = [...new Set(lastReadings.map((r) => r.sensor_id))];
    const sensors = sensorIds.length
      ? await Sensors.findAll({
          attributes: ['id', 'type', 'is_active'],
          where: { id: { [Op.in]: sensorIds } },
          raw: true,
        })
      : [];
    const sensorMap = new Map(sensors.map((s) => [s.id, s]));

    // Pick the latest-read sensor per (space, type).
    const picked = new Map();
    for (const row of lastReadings) {
      const sensor = sensorMap.get(row.sensor_id);
      if (!sensor) continue;
      const key = `${row.green_space_id}|${sensor.type}`;
      const current = picked.get(key);
      if (!current || new Date(row.last_reading_at) > new Date(current.recordedAt)) {
        picked.set(key, { recordedAt: row.last_reading_at, isActive: Boolean(sensor.is_active) });
      }
    }

    for (const id of ids) {
      const status = {};
      for (const type of SENSOR_TYPES) {
        const hit = picked.get(`${id}|${type}`);
        status[type] = {
          isActive: hit ? hit.isActive : false,
          lastReadingAt: hit ? new Date(hit.recordedAt).toISOString() : null,
        };
      }
      statusMap.set(id, status);
    }

    return statusMap;
  }
}

export default SpacesService;
