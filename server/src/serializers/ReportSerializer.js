import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Report model.
 */
class ReportSerializer extends BaseSerializer {

  /**
   * Serialize a single report (incident or comment).
   * @param {Object} report - The report to serialize.
   * @returns {Object} The serialized report.
   */
  static serializeOne(report) {
    this.baseValidation(report);

    return {
      id: report.id,
      name: report.name,
      type: report.type,
      description: report.description,
      status: report.status ?? null,
      greenSpaceId: report.green_space_id,
      greenSpaceZoneId: report.green_spaces_zone_id,
      createdAt: new Date(report.created_at).toISOString(),
    };
  }

  /**
   * Serialize a generated report row for the history list.
   * @param {Object} report - The report (with greenSpace association).
   * @returns {Object} The serialized row.
   */
  static serializeRow(report) {
    this.baseValidation(report);

    return {
      id: report.id,
      name: report.name,
      description: report.description,
      type: report.type,
      status: report.status,
      scope: report.greenSpace?.name ?? null,
      greenSpaceId: report.green_space_id,
      createdAt: new Date(report.created_at).toISOString(),
    };
  }

  /**
   * Serialize the generated reports history (paginated).
   * @param {Array} reports - The reports array.
   * @param {Object} pagination - Pagination metadata.
   * @returns {Object} Serialized paginated response.
   */
  static serializePaginated(reports, { page, limit, total }) {
    return {
      data: reports.map((report) => this.serializeRow(report)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      _links: {
        self: { href: `/api/reports?page=${page}&limit=${limit}` },
      },
    };
  }
}

export default ReportSerializer;