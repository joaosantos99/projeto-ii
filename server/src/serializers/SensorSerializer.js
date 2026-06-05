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

    const zone = sensor.greenSpaceZone || sensor.get?.('greenSpaceZone');
    const space = zone?.greenSpace || zone?.get?.('greenSpace');

    return {
      id: sensor.id,
      zoneId: sensor.green_space_zone_id,
      greenSpaceZoneId: sensor.green_space_zone_id,
      zoneName: zone?.name ?? null,
      spaceId: zone?.green_spaces_id ?? null,
      spaceName: space?.name ?? null,
      type: sensor.type,
      parameter: sensor.parameter,
      unit: sensor.unit ?? null,
      minValue: sensor.min_value,
      maxValue: sensor.max_value,
      isActive: sensor.is_active,
      createdAt: sensor.created_at ? new Date(sensor.created_at).toISOString() : null,
      createdBy: sensor.created_by,
      updatedAt: sensor.updated_at ? new Date(sensor.updated_at).toISOString() : null,
    };
  }

  /**
   * Serialize a single sensor with HATEOAS links.
   * @param {Object} sensor - The sensor to serialize.
   * @returns {Object} The serialized sensor with links.
   */
  static serializeWithLinks(sensor) {
    return {
      data: this.serializeOne(sensor),
      _links: {
        self: { href: `/api/sensors/${sensor.id}` },
      },
    };
  }

  /**
   * Serialize the space-scoped (unpaginated) sensor collection.
   * @param {Array} sensors - The sensors array.
   * @param {string} spaceId - The owning space id.
   * @returns {Object} Serialized collection response.
   */
  static serializeForSpace(sensors, spaceId) {
    return {
      data: this.serialize(sensors),
      meta: { total: sensors.length },
      _links: {
        self: { href: `/api/spaces/${spaceId}/sensors` },
      },
    };
  }

  /**
   * Serialize a paginated list of sensors.
   * @param {Array} sensors - The sensors array.
   * @param {Object} pagination - Pagination metadata.
   * @param {Object} [extras] - Optional global stats to embed.
   * @param {Object} [extras.summary] - Sensor stats summary.
   * @param {Object} [extras.distribution] - Sensor distribution by status.
   * @returns {Object} Serialized paginated response.
   */
  static serializePaginated(sensors, { page, limit, total }, extras = {}) {
    const body = {
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

    if (extras.summary) {
      body.summary = {
        totalSensors: extras.summary.totalSensors,
        totalActive: extras.summary.totalActive,
        totalNeedsAttention: extras.summary.totalNeedsAttention,
        lowBattery: extras.summary.lowBattery,
      };
    }

    if (extras.distribution) {
      body.distribution = {
        online: extras.distribution.online,
        degraded: extras.distribution.degraded,
        offline: extras.distribution.offline,
        totalSensors: extras.distribution.totalSensors,
      };
    }

    return body;
  }
}

export default SensorSerializer;
