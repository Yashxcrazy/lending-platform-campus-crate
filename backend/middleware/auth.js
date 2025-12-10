const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    // Populate req.user with decoded JWT payload for middleware that needs it (e.g., isAdmin)
    // Backward compatibility: if email/role not in JWT, set to undefined (admin middleware will reject)
    req.user = { 
      id: decoded.userId, 
      email: decoded.email || undefined, 
      role: decoded.role || 'user' 
    };
    next();
  });
};

module.exports = authenticateToken;