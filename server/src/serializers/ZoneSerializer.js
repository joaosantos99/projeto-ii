import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Zone model.
 */
class ZoneSerializer extends BaseSerializer {

  /**
   * Serialize a single zone.
   * @param {Object} space - The zone to serialize.
   * @param {Object} extraData - The extra data to serialize.
   * @returns {Object} The serialized zone.
   */
  static serializeOne(zone) {
    this.baseValidation(zone);

    return {
      id: zone.id,
      name: zone.name,
      spaceId: zone.green_spaces_id,
      createdAt: new Date(zone.created_at).toISOString(),
      updatedAt: new Date(zone.updated_at).toISOString()
    };
  }
}

export default ZoneSerializer;
