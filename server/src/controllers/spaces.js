import SpaceSerializer from '../serializers/SpaceSerializer.js';
import SensorsService from '../services/sensors.js';
import SpacesService from '../services/spaces.js';
import ZonesService from '../services/zones.js';

/**
 * Controller for the spaces routes.
 */
class SpacesController {
  /**
   * Get paginated and filtered spaces.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSpaces(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const perPage = Math.max(1, parseInt(req.query.perPage, 10) || 10);
      const { query, city } = req.query;
      const includeSummary = req.query.summary === 'true';

      const { spaces, total } = await SpacesService.getSpaces({ page, perPage, query, city });
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      const body = {
        spaces: spaces.map((space) => ({
          id: space.id,
          name: space.name,
          city: space.city,
          postalCode: space.postal_code,
          latitude: space.latitude,
          longitude: space.longitude,
          zonesCount: space.zonesCount,
          sensorsCount: space.sensorsCount,
          activeAlerts: space.activeAlerts,
          createdAt: space.created_at ? new Date(space.created_at).toISOString() : null,
        })),
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };

      if (includeSummary) {
        body.summary = await SpacesController.buildSummary();
      }

      res.json(body);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSpaceById(req, res) {
    try {
      const space = await SpacesService.getSpaceById(req.params.spaceId);

      res.json(SpaceSerializer.serialize(space));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Create a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createSpace(req, res) {
    try {
      const { name, city, postalCode, postal_code, latitude, longitude } = req.body ?? {};
      const errors = {};

      if (!name) errors.name = ['Nome é obrigatório.'];
      if (!city) errors.city = ['Cidade é obrigatória.'];
      const code = postalCode ?? postal_code;
      if (!code) errors.postalCode = ['Código postal é obrigatório.'];
      if (latitude === undefined || latitude === null || Number.isNaN(Number(latitude))) {
        errors.latitude = ['Latitude inválida.'];
      }
      if (longitude === undefined || longitude === null || Number.isNaN(Number(longitude))) {
        errors.longitude = ['Longitude inválida.'];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const newSpace = await SpacesService.createSpace(
        {
          name,
          city,
          postal_code: code,
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        req.user.id,
      );

      res.status(201).json(SpaceSerializer.serialize(newSpace));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Build a statistical summary of spaces.
   * @returns {Promise<{spacesCount, zonesCount, activeCount, districtsCount, cities}>}
   */
  static async buildSummary() {
    const [spacesCount, zonesCount, activeCount, districtsCount, cities] = await Promise.all([
      SpacesService.count(),
      ZonesService.count(),
      SensorsService.count({ where: { is_active: true } }),
      SpacesService.count({ distinct: true, col: 'city' }),
      SpacesService.getCities(),
    ]);

    return {
      spacesCount,
      zonesCount,
      activeCount,
      districtsCount,
      cities,
    };
  }

  /**
   * Update a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateSpace(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }

      const space = await SpacesService.getSpaceById(req.params.spaceId);
      const { name, city, postal_code, postalCode, latitude, longitude } = req.body;
      const updatedSpace = await space.update({
        name,
        city,
        postal_code: postal_code ?? postalCode,
        latitude,
        longitude,
        updated_by: req.user.id,
      });

      res.json(SpaceSerializer.serialize(updatedSpace));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

}

export default SpacesController;
