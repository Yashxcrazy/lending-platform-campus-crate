const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const authenticateToken = require('../middleware/auth');

// Get user profile by ID
router.get('/:userId', async (req, res) => {
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
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, campus, studentId, profileImage } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (campus) user.campus = campus;
    if (studentId) user.studentId = studentId;
    if (profileImage) user.profileImage = profileImage;

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
