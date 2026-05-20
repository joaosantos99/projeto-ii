import GreenSpaces from '../database/models/GreenSpaces.js';
import Reports from '../database/models/Reports.js';

const REPORT_TYPES = {
  INCIDENT: 'incident',
  COMMENT: 'comment',
};

/**
 * Service for the reports routes.
 */
class ReportsService {

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

    const report = await Reports.create({
      green_space_id: spaceId,
      green_spaces_zone_id: data.green_spaces_zone_id,
      user_id: data.user_id,
      updated_by: data.user_id,
      name: data.name,
      description: data.description,
      type,
      status: data.status ?? null,
    });

    return report;
  }

  /**
   * Creates an incident report for a given space.
   * @param {string} spaceId - The green space UUID.
   * @param {Object} data - The incident payload.
   * @returns {Promise<Reports>} The created incident.
   */
  static async createIncident(spaceId, data) {
    return this.#createReport(spaceId, REPORT_TYPES.INCIDENT, data);
  }

  /**
   * Creates a comment report for a given space.
   * @param {string} spaceId - The green space UUID.
   * @param {Object} data - The comment payload.
   * @returns {Promise<Reports>} The created comment.
   */
  static async createComment(spaceId, data) {
    return this.#createReport(spaceId, REPORT_TYPES.COMMENT, data);
  }
}

export default ReportsService;