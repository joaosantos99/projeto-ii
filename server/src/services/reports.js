import { fn, col } from 'sequelize';
import Reports from '../database/models/Reports.js';
import GreenSpaces from '../database/models/GreenSpaces.js';
import GreenSpaceZones from '../database/models/GreenSpaceZones.js';

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

  /**
   * Return the distribution of reports across the three known types:
   * operational, environmental, incidents. Always includes all three
   * entries, even when a type has zero reports.
   * @returns {Promise<Array<{ type: string, total: number }>>}
   */
  static async getDistribution() {
    const types = ['operational', 'environmental', 'incidents'];

    const counts = await Promise.all(
      types.map((type) => Reports.count({ where: { type } })),
    );

    return types.map((type, i) => ({ type, total: counts[i] }));
  }

  /**
   * Generate a new report for a green space.
   * @param {Object} data - type, greenSpaceId.
   * @param {string} createdBy - The authenticated user's uuid.
   * @returns {Promise<Report>} - The created report.
   */
  static async generateReport(data, createdBy) {
    const greenSpace = await GreenSpaces.findByPk(data.greenSpaceId);
    if (!greenSpace) {
      const error = new Error('Espaço verde não encontrado');
      error.statusCode = 404;
      throw error;
    }

    const zone = await GreenSpaceZones.findOne({
      where: { green_spaces_id: greenSpace.id },
      order: [['created_at', 'ASC']],
    });
    if (!zone) {
      const error = new Error('Espaço verde não encontrado');
      error.statusCode = 404;
      throw error;
    }

    const report = await Reports.create({
      user_id: createdBy,
      green_space_id: greenSpace.id,
      green_spaces_zone_id: zone.id,
      name: `Relatório ${data.type} - ${greenSpace.name}`,
      type: data.type,
      description: '',
      status: 'generated',
      updated_by: createdBy,
    });

    return report;
  }
}

export default ReportsService;
