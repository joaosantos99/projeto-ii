import ReportSerializer from '../serializers/ReportSerializer.js';
import ReportsService from '../services/reports.js';

/**
 * Controller for the reports routes.
 */
class ReportsController {

  /**
   * Create an incident for a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createIncident(req, res) {
    try {
      const report = await ReportsService.createIncident(req.params.spaceId, req.body);

      res.status(201).json(ReportSerializer.serialize(report));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Create a comment for a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createComment(req, res) {
    try {
      const report = await ReportsService.createComment(req.params.spaceId, req.body);

      res.status(201).json(ReportSerializer.serialize(report));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default ReportsController;