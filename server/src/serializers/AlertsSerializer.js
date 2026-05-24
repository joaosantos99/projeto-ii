import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Alerts model.
 */
class AlertsSerializer extends BaseSerializer {

  /**
   * Serialize a single alert.
   * @param {Object} alert - The alert to serialize.
   * @returns {Object} The serialized alert.
   */
  static serializeOne(alert) {
    this.baseValidation(alert);

    return {
      id: alert.id,
      sensorId: alert.sensor_id,
      spaceId: alert.green_space_id,
      greenSpaceId: alert.green_space_id,
      severity: alert.severity,
      message: alert.message,
      isNotified: alert.is_notified,
      status: alert.status ?? null,
      updatedAt: alert.updated_at ? new Date(alert.updated_at).toISOString() : null,
      updatedBy: alert.updated_by ?? null,
      createdAt: new Date(alert.created_at).toISOString(),
      createdBy: alert.created_by,
      created: new Date(alert.created_at).toDateString(),
    };
  }

  /**
   * Serialize the acknowledge response.
   * @param {Object} alert - The acknowledged alert.
   * @returns {Object} The serialized acknowledge response.
   */
  static serializeAcknowledge(alert) {
    this.baseValidation(alert);

    return {
      id: alert.id,
      status: alert.status,
      updatedAt: new Date(alert.updated_at).toISOString(),
      updatedBy: alert.updated_by,
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
