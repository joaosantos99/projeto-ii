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
  static serializeOne(space, extraData = {}) {
    this.baseValidation(space);

    const result = {
      id: space.id,
      name: space.name,
      parish: space.parish,
      postal_code: space.postal_code,
      imageUrl: space.image_url ?? null,
      latitude: space.latitude,
      longitude: space.longitude,
      createdAt: new Date(space.created_at).toISOString(),
    };

    if (extraData.includeZones && space.zones) {
      result.zones = space.zones.map((z) => ({
        id: z.id,
        name: z.name,
        sensors: extraData.includeSensors && z.sensors
          ? z.sensors.map((s) => ({
              id: s.id,
              type: s.type,
              parameter: s.parameter,
              unit: s.unit,
              isActive: s.is_active,
            }))
          : undefined,
      }));
    }

    if (extraData.includeReports && space.reports) {
      result.reports = space.reports.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        description: r.description,
        status: r.status,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : null,
      }));
    }

    return result;
  }
}

export default SpaceSerializer;
