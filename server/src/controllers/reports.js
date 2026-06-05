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
   * Get a single report by id.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getReportById(req, res) {
    try {
      const report = await ReportsService.getReportById(req.params.reportId);
      res.json(ReportSerializer.serializeWithLinks(report));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Create a report for a space. The `type` (incident|comment) comes from the body.
   * POST /api/spaces/:spaceId/reports
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createReport(req, res) {
    try {
      const report = await ReportsService.createReport(req.params.spaceId, req.body);

      res.status(201).json(ReportSerializer.serializeWithLinks(report));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default ReportsController;
