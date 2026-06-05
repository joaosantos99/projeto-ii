import { Op } from 'sequelize';

import Reports from '../database/models/Reports.js';
import GreenSpaces from '../database/models/GreenSpaces.js';

const GENERATED_STATUSES = ['generated', 'scheduled'];

const REPORT_TYPES = {
  INCIDENT: 'incident',
  COMMENT: 'comment',
};

/**
 * Service for the reports routes.
 */
class ReportsService {
  /**
   * Return the generated/scheduled reports history (paginated).
   * Excludes citizen incident/comment reports.
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.limit
   * @returns {Promise<Object>} Reports array and total count.
   */
  static async getReports({ page = 1, limit = 20, type, status } = {}) {
    const offset = (page - 1) * limit;

    const where = type
      ? { type }
      : { status: { [Op.in]: GENERATED_STATUSES } };

    if (status) where.status = status;

    const { count: total, rows: reports } = await Reports.findAndCountAll({
      where,
      include: [{ model: GreenSpaces, as: 'greenSpace', attributes: ['name'], required: false }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { reports, total };
  }

  /**
   * Validates that the given space exists.
   * @param {string} spaceId - The green space UUID.
   * @throws {Error} If the space is not found.
   */
  static async #validateSpace(spaceId) {
    const space = await GreenSpaces.findByPk(spaceId);
    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }
  }

  /**
   * Creates a report for a given space.
   * @param {string} spaceId - The green space UUID.
   * @param {string} type - The report type ('incident' or 'comment').
   * @param {Object} data - The report payload from the request body.
   * @returns {Promise<Reports>} The created report.
   */
  static async #createReport(spaceId, type, data) {
    await this.#validateSpace(spaceId);

    const description = (data.description ?? '').trim();
    if (!description) {
      const error = new Error('A descrição é obrigatória');
      error.statusCode = 400;
      throw error;
    }

    const defaultName = type === REPORT_TYPES.INCIDENT ? 'Incidente' : 'Feedback';

    const report = await Reports.create({
      green_space_id: spaceId,
      green_spaces_zone_id: data.green_spaces_zone_id || null,
      user_id: data.user_id || null,
      updated_by: data.user_id || null,
      name: (data.name ?? '').trim() || defaultName,
      description,
      type,
      status: data.status || null,
    });

    return report;
  }

  /**
   * Get a single report by id.
   * @param {string} reportId - The report UUID.
   * @returns {Promise<Reports>} The report.
   */
  static async getReportById(reportId) {
    const report = await Reports.findByPk(reportId, {
      include: [{ model: GreenSpaces, as: 'greenSpace', attributes: ['name'], required: false }],
    });

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    return report;
  }

  /**
   * Creates a report for a space. The `type` discriminator comes from the body.
   * @param {string} spaceId - The green space UUID.
   * @param {Object} data - The report payload, including `type`.
   * @returns {Promise<Reports>} The created report.
   */
  static async createReport(spaceId, data) {
    const type = data.type;
    if (!Object.values(REPORT_TYPES).includes(type)) {
      const error = new Error(`Invalid type. Must be one of: ${Object.values(REPORT_TYPES).join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    return this.#createReport(spaceId, type, data);
  }
}

export default ReportsService;
