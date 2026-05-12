import ReportsService from '../services/reports.js';

/**
 * Controller for the reports routes.
 */
class ReportsController {
  /**
   * Get a statistical summary of platform reports.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSummary(req, res) {
    try {
      const summary = await ReportsService.getSummary();
      res.json(summary);
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Get the distribution of reports by type.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getDistribution(req, res) {
    try {
      const distribution = await ReportsService.getDistribution();
      res.json(distribution);
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default ReportsController;
