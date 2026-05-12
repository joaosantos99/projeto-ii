import Sessions from '../database/models/Sessions.js';
import Users from '../database/models/Users.js';
import Roles from '../database/models/Roles.js';

/**
 * Auth middleware. Validates the Bearer token in the Authorization header
 * against an active (non-expired) session and attaches `req.session` and
 * `req.user` (with role eager-loaded) to the request.
 *
 * Responds 401 with `{ description: "Token inválido ou expirado" }` when the
 * token is missing, unknown, or expired.
 */
export default async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ description: 'Token inválido ou expirado' });
    }

    const session = await Sessions.findOne({
      where: { token },
      include: [
        {
          model: Users,
          as: 'user',
          include: [{ model: Roles, as: 'role' }],
        },
      ],
    });

    if (!session || !session.user) {
      return res.status(401).json({ description: 'Token inválido ou expirado' });
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      return res.status(401).json({ description: 'Token inválido ou expirado' });
    }

    req.session = session;
    req.user = session.user;
    next();
  } catch (_error) {
    res.status(401).json({ description: 'Token inválido ou expirado' });
  }
}
