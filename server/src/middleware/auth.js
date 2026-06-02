import Sessions from '../database/models/Sessions.js';
import Users from '../database/models/Users.js';
import Roles from '../database/models/Roles.js';
import CacheService from '../services/cache.js';

const sessionCache = new CacheService({
  namespace: 'session',
  indexNamespace: 'user-sessions',
  label: 'session-cache',
});

/** Minimal cached payload the middleware exposes as `req.user`. */
function serializeSessionUser(user) {
  const role = user.role;
  return {
    id: user.id,
    role_id: user.role_id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
    role: role
      ? { id: role.id, name: role.name, permissions: role.permissions ?? [] }
      : null,
  };
}

export default async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ description: 'Token inválido ou expirado' });
    }

    const cached = await sessionCache.get(token);
    if (cached) {
      if (new Date(cached.expires_at).getTime() <= Date.now()) {
        return res.status(401).json({ description: 'Token inválido ou expirado' });
      }

      req.session = { token, expires_at: cached.expires_at, user: cached.user };
      req.user = cached.user;
      return next();
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

    const ttlSec = Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000);
    await sessionCache.setIndexed(
      token,
      {
        user: serializeSessionUser(session.user),
        expires_at: new Date(session.expires_at).toISOString(),
      },
      ttlSec,
      session.user.id,
    );

    req.session = session;
    req.user = session.user;
    next();
  } catch (_error) {
    res.status(401).json({ description: 'Token inválido ou expirado' });
  }
}
