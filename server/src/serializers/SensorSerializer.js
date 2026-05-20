import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Sensor model.
 */
class SensorSerializer extends BaseSerializer {

  /**
   * Serialize a single sensor.
   * @param {Object} sensor - The sensor to serialize.
   * @returns {Object} The serialized sensor.
   */
  static serializeOne(sensor) {
    this.baseValidation(sensor);

    return {
      id: sensor.id,
      greenSpaceZoneId: sensor.green_space_zone_id,
      type: sensor.type,
      parameter: sensor.parameter,
      minValue: sensor.min_value,
      maxValue: sensor.max_value,
      isActive: sensor.is_active,
      createdAt: new Date(sensor.created_at).toISOString(),
      createdBy: sensor.created_by,
    };
  }

  /**
   * Serialize a paginated list of sensors.
   * @param {Array} sensors - The sensors array.
   * @param {Object} pagination - Pagination metadata.
   * @param {number} pagination.page - Current page.
   * @param {number} pagination.limit - Items per page.
   * @param {number} pagination.total - Total number of items.
   * @returns {Object} Serialized paginated response.
   */
  static serializePaginated(sensors, { page, limit, total }) {
    return {
      data: this.serialize(sensors),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      _links: {
        self: { href: `/api/sensors?page=${page}&limit=${limit}` },
      },
    };
  }

  /**
   * Serialize the sensors summary.
   * @param {Object} summary - The summary data.
   * @returns {Object} The serialized summary.
   */
  static serializeSummary(summary) {
    return {
      data: {
        totalSensors: summary.totalSensors,
        totalActive: summary.totalActive,
        totalNeedsAttention: summary.totalNeedsAttention,
        lowBattery: summary.lowBattery,
      },
      _links: {
        self: { href: '/api/sensors/summary' },
      },
    };
  }

  /**
   * Serialize the sensors distribution.
   * @param {Object} distribution - The distribution data.
   * @returns {Object} The serialized distribution.
   */
  static serializeDistribution(distribution) {
    return {
      data: {
        online: distribution.online,
        degraded: distribution.degraded,
        offline: distribution.offline,
        totalSensors: distribution.totalSensors,
      },
      _links: {
        self: { href: '/api/sensors/distribution' },
      },
    };
  }
}

export default SensorSerializer;