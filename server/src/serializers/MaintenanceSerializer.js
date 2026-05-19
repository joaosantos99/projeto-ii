import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the MaintenanceTasks model.
 */
class MaintenanceSerializer extends BaseSerializer {

  /**
   * Serialize a single maintenance task.
   * @param {Object} task - The task to serialize.
   * @param {Object} extraData - The extra data to serialize.
   * @returns {Object} The serialized maintenance task.
   */
  static serializeOne(task) {
    this.baseValidation(task);

    return {
      id: task.id,
      spaceId: task.green_spaces_id,
      type: task.type,
      description: task.description,
      status: task.status,
      scheduledDate: new Date(task.scheduled_date).toISOString(),
      completedAt: task.completed_at ? new Date(task.completed_at).toISOString() : null
    };
  }
}

export default MaintenanceSerializer;
