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
}

export default ReportSerializer;