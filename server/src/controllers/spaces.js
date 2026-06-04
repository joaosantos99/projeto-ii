import SpaceSerializer from '../serializers/SpaceSerializer.js';
import SensorsService from '../services/sensors.js';
import SpacesService from '../services/spaces.js';
import ZonesService from '../services/zones.js';
import { uploadObject } from '../lib/storage.js';

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
      const { query, parish } = req.query;
      const includeSummary = req.query.summary === 'true';
      const includeSensoresStatus = req.query.sensoresStatus === 'true';

      const { spaces, total } = await SpacesService.getSpaces({ page, perPage, query, parish });
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      const body = {
        spaces: spaces.map((space) => ({
          id: space.id,
          name: space.name,
          parish: space.parish,
          postalCode: space.postal_code,
          imageUrl: space.image_url ?? null,
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

      if (includeSensoresStatus) {
        const statusMap = await SpacesService.getSensoresStatusBySpaceIds(
          body.spaces.map((s) => s.id),
        );
        body.spaces.forEach((s) => {
          s.sensoresStatus = statusMap.get(s.id) ?? null;
        });
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
      const includeZones = req.query.includeZones === 'true';
      const includeSensors = req.query.includeSensors === 'true';
      const includeReports = req.query.includeReports === 'true';
      const includeSensorsSummary = req.query.sensorsSummary === 'true';
      const space = await SpacesService.getSpaceById(req.params.spaceId, {
        includeZones,
        includeSensors,
        includeReports,
      });

      const body = SpaceSerializer.serialize(space, { includeZones, includeSensors, includeReports });

      if (includeSensorsSummary) {
        body.sensorsSummary = await SpacesService.getSensorsSummary(req.params.spaceId);
      }

      res.json(body);
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
      const { name, parish, postalCode, postal_code, latitude, longitude } = req.body ?? {};
      const errors = {};

      if (!name) errors.name = ['Nome é obrigatório.'];
      if (!parish) errors.parish = ['Freguesia é obrigatória.'];
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
          parish,
          postal_code: code,
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        req.user.id,
      );

      // An image is optional on create; attach it once the space exists.
      if (req.file) {
        const ext = EXTENSION_BY_MIME[req.file.mimetype] ?? 'bin';
        const key = `spaces/${newSpace.id}/${Date.now()}.${ext}`;
        const imageUrl = await uploadObject({
          key,
          body: req.file.buffer,
          contentType: req.file.mimetype,
        });
        await newSpace.update({ image_url: imageUrl });
      }

      res.status(201).json(SpaceSerializer.serialize(newSpace));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Build a statistical summary of spaces.
   * @returns {Promise<{spacesCount, zonesCount, activeCount, parishCount, parishes}>}
   */
  static async buildSummary() {
    const [spacesCount, zonesCount, activeCount, parishCount, parishes] = await Promise.all([
      SpacesService.count(),
      ZonesService.count(),
      SensorsService.count({ where: { is_active: true } }),
      SpacesService.count({ distinct: true, col: 'parish' }),
      SpacesService.getParishes(),
    ]);

    return {
      spacesCount,
      zonesCount,
      activeCount,
      parishCount,
      parishes,
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
      const { name, parish, postal_code, postalCode, latitude, longitude } = req.body;
      const updatedSpace = await space.update({
        name,
        parish,
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

const EXTENSION_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export default SpacesController;
