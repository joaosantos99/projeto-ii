import { fn, col } from 'sequelize';
import Reports from '../database/models/Reports.js';

/**
 * Service for the reports routes.
 */
class ReportsService {
  /**
   * Return a statistical summary of platform reports.
   * - total: all non-deleted reports
   * - generated: reports with status='generated'
   * - scheduled: reports with status='scheduled'
   * - lastCreatedAt: ISO timestamp of the most recent report (null if none)
   * @returns {Promise<{ total, generated, scheduled, lastCreatedAt }>}
   */
  static async getSummary() {
    const [total, generated, scheduled, last] = await Promise.all([
      Reports.count(),
      Reports.count({ where: { status: 'generated' } }),
      Reports.count({ where: { status: 'scheduled' } }),
      Reports.findOne({
        attributes: [[fn('MAX', col('created_at')), 'last_created_at']],
        raw: true,
      }),
    ]);

    const lastCreatedAt = last?.last_created_at
      ? new Date(last.last_created_at).toISOString()
      : null;

    return { total, generated, scheduled, lastCreatedAt };
  }
}

export default ReportsService;
