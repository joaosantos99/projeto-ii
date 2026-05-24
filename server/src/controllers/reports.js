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
   * Generate a new report.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async generateReport(req, res) {
    try {
      const { type, greenSpaceId } = req.body ?? {};
      const allowedTypes = ['operational', 'environmental'];
      const errors = {};

      if (!type) {
        errors.type = ['Type is mandatory.'];
      } else if (!allowedTypes.includes(type)) {
        errors.type = ['Type must be one of operational, environmental.'];
      }

      if (!greenSpaceId) errors.greenSpaceId = ['greenSpaceId is mandatory.'];

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const report = await ReportsService.generateReport({ type, greenSpaceId }, req.user.id);

      res.status(200).json({
        id: report.id,
        greenSpaceId: report.green_space_id,
        type: report.type,
        status: report.status,
        url: '',
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
}

export default ReportsController;
