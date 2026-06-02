import { Op } from 'sequelize';

import MaintenanceTasks from '../database/models/MaintenanceTasks.js';

const TASK_STATUS = {
  IN_PROGRESS: 'in_progress',
  CRITICAL: 'critical',
  COMPLETED: 'completed',
};

const REQUIRED_FIELDS = ['type', 'description'];

/**
 * Service for the maintenance task routes.
 */
class MaintenanceService {
  /**
   * Get all maintenance tasks for a space.
   * @returns {Promise<Array<MaintenanceTasks>>} - The maintenance tasks.
   */
  static async getTasksBySpace(spaceId) {
    return MaintenanceTasks.findAll({
      where: { green_spaces_id: spaceId },
      order: [['scheduled_date', 'DESC']],
    });
  }

  /**
   * Delete a maintenance task.
   */
  static async deleteTask(maintenanceId) {
    const task = await MaintenanceTasks.findByPk(maintenanceId);

    if (!task) {
      const error = new Error('Maintenance task not found');
      error.statusCode = 404;
      throw error;
    }

    await task.destroy();
  }

  /**
   * Validates that required fields are present in the payload.
   * @param {Object} data - The request body.
   * @throws {Error} 400 if any required field is missing.
   */
  static #validateRequiredFields(data) {
    const errors = {};

    for (const field of REQUIRED_FIELDS) {
      if (!data[field]) {
        errors[field] = [`${field} is mandatory.`];
      }
    }

    if (Object.keys(errors).length > 0) {
      const error = new Error('Invalid request parameters.');
      error.statusCode = 400;
      error.errors = errors;
      throw error;
    }
  }

  /**
   * Find a task by ID or throw a 404.
   * @param {string} taskId - The task UUID.
   * @returns {Promise<MaintenanceTasks>} The found task.
   */
  static async #findTaskOrFail(taskId) {
    const task = await MaintenanceTasks.findByPk(taskId);

    if (!task) {
      const error = new Error('Maintenance task not found');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  /**
   * Create a new maintenance task.
   * @param {Object} data - The request body.
   * @returns {Promise<MaintenanceTasks>} The created task.
   */
  static async createTask(data) {
    this.#validateRequiredFields(data);

    const task = await MaintenanceTasks.create({
      green_spaces_id: data.green_spaces_id,
      type: data.type,
      description: data.description,
      status: data.status ?? 'scheduled',
      scheduled_date: data.scheduled_date,
      completed_at: null,
      created_by: data.created_by,
      updated_by: data.created_by,
    });

    return task;
  }

  /**
   * Build the Sequelize `where` clause for a status filter.
   * The synthetic `atraso` status maps to overdue, not-yet-completed tasks;
   * any other value filters by the literal status column.
   * @param {string} [status] - The status filter, or undefined for no filter.
   * @returns {Object|undefined} The where clause, or undefined when unfiltered.
   */
  static #statusWhere(status) {
    if (!status) return undefined;

    if (status === 'atraso') {
      return {
        scheduled_date: { [Op.lt]: new Date() },
        completed_at: null,
      };
    }

    return { status };
  }

  /**
   * Get all maintenance tasks (paginated).
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.limit
   * @param {string} [options.status] - Filter by status (`atraso` = overdue).
   * @returns {Promise<Object>} Tasks array and total count.
   */
  static async getTasks({ page = 1, limit = 20, status } = {}) {
    const offset = (page - 1) * limit;

    const { count: total, rows: tasks } = await MaintenanceTasks.findAndCountAll({
      where: this.#statusWhere(status),
      order: [['scheduled_date', 'ASC']],
      limit,
      offset,
    });

    return { tasks, total };
  }

  /**
   * Average response time, in minutes, between a task's scheduled date and its
   * completion, across all completed tasks. Returns 0 when none completed.
   * @returns {Promise<number>} The average response time in minutes.
   */
  static async getAverageResponseTime() {
    const tasks = await MaintenanceTasks.findAll({
      where: { status: TASK_STATUS.COMPLETED, completed_at: { [Op.ne]: null } },
      attributes: ['scheduled_date', 'completed_at'],
    });

    if (tasks.length === 0) return 0;

    const totalMinutes = tasks.reduce((sum, task) => {
      const scheduled = new Date(task.scheduled_date).getTime();
      const completed = new Date(task.completed_at).getTime();
      return sum + Math.max(0, (completed - scheduled) / 60000);
    }, 0);

    return Math.round(totalMinutes / tasks.length);
  }

  /**
   * Update the status of a maintenance task.
   * Sets completed_at automatically when status is 'completed'.
   * @param {string} taskId - The task UUID.
   * @param {string} status - The new status value.
   * @param {string} userId - The user performing the update.
   * @returns {Promise<MaintenanceTasks>} The updated task.
   */
  static async updateTaskStatus(taskId, status, userId) {
    if (!status) {
      const error = new Error('Invalid task id');
      error.statusCode = 400;
      throw error;
    }

    const task = await this.#findTaskOrFail(taskId);

    await task.update({
      status,
      completed_at: status === TASK_STATUS.COMPLETED ? new Date() : task.completed_at,
      updated_at: new Date(),
      updated_by: userId,
    });

    return task;
  }

  /**
   * Replace a maintenance task (full update).
   * @param {string} taskId - The task UUID.
   * @param {Object} data - The full task payload.
   * @returns {Promise<MaintenanceTasks>} The updated task.
   */
  static async updateTask(taskId, data) {
    this.#validateRequiredFields(data);

    const task = await this.#findTaskOrFail(taskId);

    await task.update({
      green_spaces_id: data.green_spaces_id ?? task.green_spaces_id,
      type: data.type,
      description: data.description,
      status: data.status ?? task.status,
      scheduled_date: data.scheduled_date ?? task.scheduled_date,
      completed_at: data.completed_at ?? task.completed_at,
      updated_at: new Date(),
      updated_by: data.updated_by,
    });

    return task;
  }

  /**
   * Get a summary of maintenance tasks.
   * @returns {Promise<Object>} The maintenance summary.
   */
  static async getSummary() {
    const now = new Date();

    const totalInProgressTasks = await MaintenanceTasks.count({
      where: { status: TASK_STATUS.IN_PROGRESS },
    });

    const totalCriticalTasks = await MaintenanceTasks.count({
      where: { status: TASK_STATUS.CRITICAL },
    });

    const totalLateTasks = await MaintenanceTasks.count({
      where: {
        scheduled_date: { [Op.lt]: now },
        completed_at: null,
      },
    });

    return {
      totalActiveRules: 0,
      totalInProgressTasks,
      totalCriticalTasks,
      totalLateTasks,
    };
  }
}

export default MaintenanceService;
