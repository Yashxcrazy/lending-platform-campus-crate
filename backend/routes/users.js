const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const authenticateToken = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const sanitizeInput = require('../middleware/sanitizeInput');

// Get preferences for current user
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('notificationPreferences privacyPreferences');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      notificationPreferences: user.notificationPreferences,
      privacyPreferences: user.privacyPreferences,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update preferences for current user
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { notificationPreferences, privacyPreferences } = req.body || {};
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (notificationPreferences && typeof notificationPreferences === 'object') {
      const np = notificationPreferences;
      if (typeof np.email === 'boolean') user.notificationPreferences.email = np.email;
      if (typeof np.sms === 'boolean') user.notificationPreferences.sms = np.sms;
    }
    if (privacyPreferences && typeof privacyPreferences === 'object') {
      const pp = privacyPreferences;
      if (typeof pp.showEmail === 'boolean') user.privacyPreferences.showEmail = pp.showEmail;
      if (typeof pp.showPhone === 'boolean') user.privacyPreferences.showPhone = pp.showPhone;
    }

    await user.save();
    res.json({
      message: 'Preferences updated',
      preferences: {
        notificationPreferences: user.notificationPreferences,
        privacyPreferences: user.privacyPreferences,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Soft delete current user account
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    // Optionally clear PII on deactivation
    user.phone = undefined;
    user.profileImage = undefined;
    await user.save();

    res.json({ message: 'Account deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile by ID
router.get('/:userId', validateObjectId('userId'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, sanitizeInput(['name', 'campus', 'studentId']), async (req, res) => {
  try {
    const { name, phone, campus, studentId, profileImage } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields only
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (campus !== undefined) user.campus = campus;
    if (studentId !== undefined) user.studentId = studentId;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviews for a user
router.get('/:userId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name profileImage')
      .populate('item', 'title')
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
