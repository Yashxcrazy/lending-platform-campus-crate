/**
 * authController.js
 * NOTE: This is a safe example update — merge with your existing auth controller as needed.
 * It ensures role is included in JWT payload and in responses, and provides a /auth/me handler.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'replace_with_secret', { expiresIn: '7d' });
}

// Example login handler (adjust to match your password verification)
exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    // TODO: verify password here (bcrypt.compare etc.)
    const token = signToken(user);
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// /api/auth/me handler - returns current user (requires auth middleware to populate req.user)
exports.me = async function (req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.user.id, { password: 0 }).lean();
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('me error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
