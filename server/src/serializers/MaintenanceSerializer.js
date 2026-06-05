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
   * Serialize a single task with HATEOAS links.
   * @param {Object} task - The task to serialize.
   * @returns {Object} The serialized task with links.
   */
  static serializeWithLinks(task) {
    return {
      data: this.serializeOne(task),
      _links: {
        self: { href: `/api/maintenance/${task.id}` },
      },
    };
  }

  /**
   * Serialize maintenance tasks (paginated).
   * @param {Array} tasks - The tasks array.
   * @param {Object} pagination - Pagination metadata.
   * @returns {Object} Serialized paginated response.
   */
  static serializePaginated(tasks, { page, limit, total }) {
    return {
      data: this.serialize(tasks),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      _links: {
        self: { href: `/api/maintenance?page=${page}&limit=${limit}` },
      },
    };
  }

  /**
   * Serialize the space-scoped (unpaginated) task collection.
   * @param {Array} tasks - The tasks array.
   * @param {string} spaceId - The owning space id.
   * @returns {Object} Serialized collection response.
   */
  static serializeForSpace(tasks, spaceId) {
    return {
      data: this.serialize(tasks),
      meta: { total: tasks.length },
      _links: {
        self: { href: `/api/spaces/${spaceId}/maintenance` },
      },
    };
  }

  /**
   * Serialize maintenance summary.
   * @param {Object} summary - The summary data.
   * @returns {Object} Serialized summary.
   */
  static serializeSummary(summary) {
    return {
      totalActiveRules: summary.totalActiveRules,
      totalInProgressTasks: summary.totalInProgressTasks,
      totalCriticalTasks: summary.totalCriticalTasks,
      totalLateTasks: summary.totalLateTasks,
    };
  }
}

export default MaintenanceSerializer;
