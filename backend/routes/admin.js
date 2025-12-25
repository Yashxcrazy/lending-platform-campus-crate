const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Review = require('../models/Review');
const isAdmin = require('../middleware/isAdmin');
const validateObjectId = require('../middleware/validateObjectId');

// GET /api/admin/users - list users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, users });
  } catch (err) {
    console.error('GET /admin/users error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/admin/users/:id/role - change user role (admin only)
router.put('/users/:id/role', isAdmin, validateObjectId(), async (req, res) => {
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
  } catch (err) {
    console.error('PUT /admin/users/:id/role error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/admin/users/:id/verify - mark user verified (admin only)
router.put('/users/:id/verify', isAdmin, validateObjectId(), async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, error: 'User not found' });

    target.isVerified = true;
    await target.save();

    res.json({ success: true, user: { _id: target._id, name: target.name, email: target.email, role: target.role, isVerified: target.isVerified } });
  } catch (err) {
    console.error('PUT /admin/users/:id/verify error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;

// Deactivate a user (admin only)
router.put('/users/:id/deactivate', isAdmin, validateObjectId(), async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, error: 'User not found' });

    // Prevent removing the last admin account if target is admin
    if (target.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, error: 'Cannot deactivate the last active admin' });
      }
    }

    target.isActive = false;
    await target.save();
    res.json({ success: true, user: { _id: target._id, name: target.name, email: target.email, role: target.role, isActive: target.isActive } });
  } catch (err) {
    console.error('PUT /admin/users/:id/deactivate error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// List all items (admin only)
router.get('/items', isAdmin, async (req, res) => {
  try {
    const { isActive, page = 1, limit = 20 } = req.query;
    const query = {};
    if (typeof isActive !== 'undefined') {
      query.isActive = isActive === 'true';
    }
    const items = await Item.find(query)
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();
    const count = await Item.countDocuments(query);
    res.json({ success: true, items, totalItems: count, totalPages: Math.ceil(count / Number(limit)) });
  } catch (err) {
    console.error('GET /admin/items error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Deactivate an item (admin only)
router.put('/items/:id/deactivate', isAdmin, validateObjectId(), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    item.isActive = false;
    await item.save();
    res.json({ success: true, item: { _id: item._id, title: item.title, isActive: item.isActive } });
  } catch (err) {
    console.error('PUT /admin/items/:id/deactivate error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete a review (admin only)
router.delete('/reviews/:id', isAdmin, validateObjectId(), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    const revieweeId = review.reviewee;
    await review.deleteOne();
    // Recalculate reviewee rating and count
    const reviews = await Review.find({ reviewee: revieweeId });
    const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await User.findByIdAndUpdate(revieweeId, { rating: avgRating, reviewCount: reviews.length });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /admin/reviews/:id error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
