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
      greenSpaceName: alert.greenSpace?.name ?? null,
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
   * Serialize a paginated list of alerts.
   * @param {Array} alerts - The alerts array.
   * @param {Object} pagination - Pagination metadata.
   * @returns {Object} Serialized paginated response.
   */
  static serializePaginated(alerts, { page, limit, total }) {
    return {
      data: this.serialize(alerts),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      _links: {
        self: { href: `/api/alerts?page=${page}&limit=${limit}` },
      },
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
      isNotified: alert.is_notified,
      status: alert.status ?? null,
      updatedAt: alert.updated_at ? new Date(alert.updated_at).toISOString() : null,
      updatedBy: alert.updated_by ?? null,
    };
  }

  /**
   * Serialize alerts summary.
   * @param {Object} summary - The summary data.
   * @returns {Object} Serialized summary.
   */
  static serializeSummary(summary) {
    return {
      totalActiveRules: summary.totalActiveRules,
      totalToRecognize: summary.totalToRecognize,
      totalCriticalAlerts: summary.totalCriticalAlerts,
      totalAlerts: summary.totalAlerts,
    };
  }
}

export default AlertsSerializer;
