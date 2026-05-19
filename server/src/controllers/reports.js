import ReportsSerializer from '../serializers/ReportsSerializer.js';
import ReportsService from '../services/reports.js';

/**
 * Controller for the reports routes.
 */
class ReportsController {
  /**
   * Get all reports.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getReports(req, res) {
    try {
      const reports = await ReportsService.getReports(req.params.spaceId);

      res.json(ReportsSerializer.serialize(reports));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Delete a report.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async deleteReport(req, res) {
    try {
      await ReportsService.deleteReport(req.params.commentId);
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
  
}

export default ReportsController;
