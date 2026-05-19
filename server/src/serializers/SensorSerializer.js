import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Space model.
 */
class SpaceSerializer extends BaseSerializer {

  /**
   * Serialize a single user.
   * @param {Object} space - The user to serialize.
   * @param {Object} extraData - The extra data to serialize.
   * @returns {Object} The serialized space.
   */
  static serializeOne(space) {
    this.baseValidation(space);

    return {
      id: space.id,
      name: space.name,
      city: space.city,
      postal_code: space.postal_code,
      latitude: space.latitude,
      longitude: space.longitude,
      createdAt: new Date(space.created_at).toISOString(),
    };
  }
}

export default SpaceSerializer;
