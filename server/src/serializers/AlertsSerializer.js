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

  /**
   * Serialize alerts summary.
   * @param {Object} summary - The summary data.
   * @returns {Object} Serialized summary.
   */
  static serializeSummary(summary) {
    return {
      data: {
        totalActiveRules: summary.totalActiveRules,
        totalToRecognize: summary.totalToRecognize,
        totalCriticalAlerts: summary.totalCriticalAlerts,
        totalAlerts: summary.totalAlerts,
      },
      _links: {
        self: { href: '/api/alerts/summary' },
      },
    };
  }
}

export default AlertsSerializer;
