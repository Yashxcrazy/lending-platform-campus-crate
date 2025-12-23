const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Apply authentication and admin check to all routes
router.use(authenticateToken);
router.use(isAdmin);

// GET /api/admin/users - Get all users (password omitted)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    // Prevent self-demotion (compare as strings to handle ObjectId)
    if (id.toString() === req.user.id && role === 'user') {
      return res.status(400).json({ message: 'Cannot demote yourself from admin' });
    }

    // Check if this is the last admin
    if (role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove the last admin' });
      }
    }

    // Update the user role
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
