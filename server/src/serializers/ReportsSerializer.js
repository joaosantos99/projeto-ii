import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Reports model.
 */
class ReportsSerializer extends BaseSerializer {

  /**
   * Serialize a single report.
   * @param {Object} report - The report to serialize.
   * @param {Object} extraData - The extra data to serialize.
   * @returns {Object} The serialized report.
   */
  static serializeOne(report) {
    this.baseValidation(report);

    return {
      id: report.id,
      spaceId: report.green_space_id,
      zoneId: report.green_spaces_zone_id,
      name: report.name,
      type: report.type,
      description: report.description,
      status: report.status,
      createdAt: new Date(report.created_at).toDateString()
    };
  }
}

export default ReportsSerializer;
