import ReportSerializer from '../serializers/ReportSerializer.js';
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
  static async getReports(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);
      const type = req.query.type;
      const status = req.query.status;

      const { reports, total } = await ReportsService.getReports({ page, limit, type, status });

      res.json(ReportSerializer.serializePaginated(reports, { page, limit, total }));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Export a report (returns download metadata).
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async exportReport(req, res) {
    try {
      const report = await ReportsService.getReportById(req.params.reportId);

      res.status(200).json({
        id: report.id,
        greenSpaceId: report.green_space_id,
        type: report.type,
        status: report.status,
        url: `https://s3.amazonaws.com/bucket/${report.id}.pdf`,
        createdAt: new Date(report.created_at).toISOString(),
        createdBy: report.user_id,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

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
