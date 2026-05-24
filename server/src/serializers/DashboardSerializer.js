import BaseSerializer from "./BaseSerializer.js";

class DashboardSerializer extends BaseSerializer {

  /**
   * Serialize the dashboard summary.
   * @param {Object} summary - The summary data.
   * @returns {Object} Serialized summary.
   */
  static serializeSummary(summary) {
    return {
      data: {
        totalAlerts: summary.totalAlerts,
        totalLateMaintenance: summary.totalLateMaintenance,
        totalOfflineSensors: summary.totalOfflineSensors,
        averageResponseTime: summary.averageResponseTime,
      },
      _links: {
        self: { href: '/api/dashboard/summary' },
      },
    };
  }
}

export default DashboardSerializer;