import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the MaintenanceTasks model.
 */
class MaintenanceSerializer extends BaseSerializer {

  /**
   * Serialize a single maintenance task.
   * @param {Object} task - The task to serialize.
   * @returns {Object} The serialized maintenance task.
   */
  static serializeOne(task) {
    this.baseValidation(task);

    return {
      id: task.id,
      spaceId: task.green_spaces_id,
      greenSpaceId: task.green_spaces_id,
      type: task.type,
      description: task.description,
      status: task.status,
      scheduledDate: new Date(task.scheduled_date).toISOString(),
      completedAt: task.completed_at ? new Date(task.completed_at).toISOString() : null,
    };
  }

  /**
   * Serialize maintenance summary.
   * @param {Object} summary - The summary data.
   * @returns {Object} Serialized summary.
   */
  static serializeSummary(summary) {
    return {
      data: {
        totalActiveRules: summary.totalActiveRules,
        totalInProgressTasks: summary.totalInProgressTasks,
        totalCriticalTasks: summary.totalCriticalTasks,
        totalLateTasks: summary.totalLateTasks,
      },
      _links: {
        self: { href: '/api/maintenance/summary' },
      },
    };
  }
}

export default MaintenanceSerializer;
