import BaseSerializer from "./BaseSerializer.js";

/**
 * Serializer for permission identifiers.
 * Shape: { id: 'users:read', resource: 'users', action: 'read' }.
 */
class PermissionSerializer extends BaseSerializer {

  /**
   * Serialize a single permission identifier.
   * @param {string} id - The permission identifier (e.g. 'users:read').
   * @returns {Object} The serialized permission.
   */
  static serializeOne(id) {
    const [resource, action] = id.split(':');
    return { id, resource, action };
  }

  /**
   * Serialize the (unpaginated) permissions collection.
   * @param {Array<string>} ids - The permission identifiers.
   * @returns {Object} Serialized collection response.
   */
  static serializeCollection(ids) {
    return {
      data: this.serialize(ids),
      meta: { total: ids.length },
      _links: {
        self: { href: '/api/permissions' },
      },
    };
  }
}

export default PermissionSerializer;
