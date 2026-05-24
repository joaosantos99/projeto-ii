import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Sensor model.
 */
class SensorSerializer extends BaseSerializer {
  static serializeOne(sensor) {
    this.baseValidation(sensor);

    const zone = sensor.greenSpaceZone || sensor.get?.('greenSpaceZone');

    return {
      id: sensor.id,
      zoneId: sensor.green_space_zone_id,
      zoneName: zone?.name ?? null,
      spaceId: zone?.green_spaces_id ?? null,
      type: sensor.type,
      parameter: sensor.parameter,
      minValue: sensor.min_value,
      maxValue: sensor.max_value,
      isActive: sensor.is_active,
      createdAt: sensor.created_at ? new Date(sensor.created_at).toISOString() : null,
      updatedAt: sensor.updated_at ? new Date(sensor.updated_at).toISOString() : null,
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
