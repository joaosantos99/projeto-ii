import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Alerts model.
 */
class AlertsSerializer extends BaseSerializer {

  /**
   * Serialize a single alert.
   * @param {Object} alert - The alert to serialize.
   * @param {Object} extraData - The extra data to serialize.
   * @returns {Object} The serialized alert.
   */
  static serializeOne(alert) {
    this.baseValidation(alert);

    return {
      id: alert.id,
      spaceId: alert.green_space_id,
      sensorId: alert.sensor_id,
      severity: alert.severity,
      message: alert.message,
      isNotified: alert.is_notified,
      created: new Date(alert.created_at).toDateString()
    };
  }
}

export default AlertsSerializer;
