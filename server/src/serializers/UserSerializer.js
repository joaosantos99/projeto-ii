import BaseSerializer from "./BaseSerializer.js";
import RolesSerializer from "./RoleSerializer.js";

/**
 * Serializer for the User model.
 */
class UserSerializer extends BaseSerializer {

  /**
   * Serialize a single user.
   * @param {Object} user - The user to serialize.
   * @param {Object} extraData - The extra data to serialize.
   * @param {Object} extraData.roles - The roles to serialize.
   * @returns {Object} The serialized user.
   */
  static serializeOne(user, extraData = {}) {
    this.baseValidation(user);

    let roles = null;
    let permissions = null;
    if (extraData?.roles) {
      roles = RolesSerializer.serialize(extraData?.roles);
      permissions = new Set(roles.flatMap(role => role.permissions));
    }

    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      roles,
      createdAt: new Date(user.created_at).toISOString(),
      hasPermission: (permission) => {
        if (!roles && !permissions)  {
          throw new Error({ statusCode: 500, message: "Roles are not loaded!" });
        };

        return permissions.has(permission);
      },
    };
  }
}

export default UserSerializer;
