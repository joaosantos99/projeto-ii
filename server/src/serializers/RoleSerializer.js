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
      permissionsDump: role.permissions ?? [],
      userCount: role.getDataValue?.('userCount') ?? 0,
      createdAt: role.created_at ? new Date(role.created_at).toISOString() : null,
    };
  }

  /**
   * Serialize a single role with HATEOAS links.
   * @param {Object} role - The role to serialize.
   * @returns {Object} The serialized role with links.
   */
  static serializeWithLinks(role) {
    return {
      data: this.serializeOne(role),
      _links: {
        self: { href: `/api/roles/${role.id}` },
      },
    };
  }

  /**
   * Serialize the (unpaginated) roles collection.
   * @param {Array} roles - The roles array.
   * @returns {Object} Serialized collection response.
   */
  static serializeCollection(roles) {
    return {
      data: this.serialize(roles),
      meta: { total: roles.length },
      _links: {
        self: { href: '/api/roles' },
      },
    };
  }
}

export default RoleSerializer;
