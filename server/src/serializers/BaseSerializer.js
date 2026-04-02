
/**
 * Base class for all serializers.
 * All serializers should extend this class.
 */
class BaseSerializer {

  /**
   * Serialize a list of items.
   * @param {Array} plainData - The list of items to serialize.
   * @returns {Array} The serialized list of items.
   */
  static serialize(plainData) {
    if (Array.isArray(plainData)) {
      return plainData.map((item) => this.serializeOne(item));
    }
    return this.serializeOne(plainData);
  }

  /**
   * Base validation for all serializers.
   * @param {Object} data - The data to validate.
   * @returns {Object} The validated data.
   */
  static baseValidation(data) {
    if (!data || typeof data !== 'object') {
      throw new Error({ statusCode: 400, message: "Invalid data" });
    };
  }

  /**
   * Base serialization for all serializers.
   * @param {Object} data - The data to serialize.
   * @returns {Object} The serialized data.
   */
  static baseSerialization() {
    throw new Error({ statusCode: 500, message: "Not implemented" });
  }
}

export default BaseSerializer;
