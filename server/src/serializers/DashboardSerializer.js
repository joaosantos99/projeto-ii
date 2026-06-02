import BaseSerializer from "./BaseSerializer.js";

class DashboardSerializer extends BaseSerializer {

  /**
   * Serialize citizen incidents (paginated).
   * @param {Array} incidents - The incidents array.
   * @param {Object} pagination - Pagination metadata.
   * @returns {Object} Serialized paginated response.
   */
  static serializeCitizenIncidents(incidents, { page, limit, total }) {
    return {
      data: incidents.map((incident) => ({
        id: incident.id,
        greenSpaceId: incident.green_space_id,
        greenSpaceZoneId: incident.green_spaces_zone_id,
        type: incident.type,
        name: incident.name,
        description: incident.description,
        status: incident.status ?? null,
        createdAt: new Date(incident.created_at).toISOString(),
        createdBy: incident.created_by,
        updatedAt: new Date(incident.updated_at).toISOString(),
        updatedBy: incident.updated_by,
      })),
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
      _links: {
        self: { href: `/api/dashboard/citizen-incidents?page=${page}&limit=${limit}` },
        next: page < Math.ceil(total / limit)
          ? { href: `/api/dashboard/citizen-incidents?page=${page + 1}&limit=${limit}` }
          : null,
        prev: page > 1
          ? { href: `/api/dashboard/citizen-incidents?page=${page - 1}&limit=${limit}` }
          : null,
      },
    };
  }
}

export default DashboardSerializer;