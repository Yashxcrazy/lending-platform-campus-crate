/**
 * isAdmin middleware assumes req.user is populated by your auth middleware.
 * It responds with 401 if not authenticated and 403 if not admin.
 */
module.exports = function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin only' });
  }
  return next();
};
