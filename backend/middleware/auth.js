const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    
    // Populate req.user for admin middleware
    try {
      const user = await User.findById(decoded.userId).select('-password');
      req.user = user ? { id: user._id.toString(), role: user.role, email: user.email, name: user.name } : null;
    } catch (error) {
      console.error('Error populating user:', error);
    }
    
    next();
  });
};

module.exports = authenticateToken;