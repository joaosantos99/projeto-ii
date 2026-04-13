import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for the Role model.
 */
class RoleSerializer extends BaseSerializer {

  /**
   * Serialize a single role.
   * @param {Object} role - The role to serialize.
   * @returns {Object} The serialized role.
   */
  static serializeOne(role) {
    this.baseValidation(role);

    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions ?? JSON.parse(role.permissions_dump ?? '[]'),
      createdAt: new Date(role.created_at).toISOString(),
    };
  }
}

export default RoleSerializer;
