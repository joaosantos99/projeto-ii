/**
 * Middleware factory. Requires requireAuth to run first (req.user must exist).
 * Returns 403 if the authenticated user's role does not include the given permission.
 * @param {string} permission - The permission string to check (e.g. 'users:read').
 */
export default function requirePermission(permission) {
  return (req, res, next) => {
    const permissions = req.user?.role?.permissions ?? [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({ description: 'Sem permissões para aceder a este recurso' });
    }

    next();
  };
}
