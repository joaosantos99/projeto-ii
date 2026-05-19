import Reports from '../database/models/Reports.js';

/**
 * Service for the reports routes.
 */
class ReportsService {
  /**
   * Get all reports.
   * @returns {Promise<Array<User>>} - The reports.
   */
  static async getReports(spaceId) {
    const reports = await Reports.findAll({
        where: { green_space_id: spaceId }
    });

    if (!reports.length) {
      const error = new Error('No reports found');
      error.statusCode = 404;
      throw error;
    }

    return reports;
  }

  /**
   * Get a commnet.
   * @returns {Promise<Array<User>>} - The report.
   */
  static async getReportById(commentId) {
    const report = await Reports.findByPk(commentId)

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    return report;
  }
  
  /**
   * Delete a report.
   * @returns {Promise<Array<GreenSpaceZones>>} - The reports.
   */
  static async deleteReport(commentId) {
    const report = await Reports.findByPk(commentId);

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    await report.destroy();
  }

}

export default ReportsService;
