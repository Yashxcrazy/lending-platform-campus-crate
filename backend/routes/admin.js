const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(isAdmin);

// GET /api/admin/users - list users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json({ success: true, users });
  } catch (error) {
    console.error('GET /admin/users error', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/admin/users/:id/role - change user role (admin only)
router.put('/users/:id/role', async (req, res) => {
  try {
    const targetId = req.params.id;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ success: false, error: 'User not found' });

    // Prevent self-demotion
    if (req.user.id === String(target._id) && role === 'user') {
      return res.status(400).json({ success: false, error: 'Admins cannot demote themselves' });
    }

    // Prevent removing the last admin
    if (role === 'user' && target.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, error: 'Cannot remove the last admin' });
      }
    }

    target.role = role;
    await target.save();

    res.json({ success: true, user: { _id: target._id, name: target.name, email: target.email, role: target.role } });
  } catch (error) {
    console.error('PUT /admin/users/:id/role error', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
