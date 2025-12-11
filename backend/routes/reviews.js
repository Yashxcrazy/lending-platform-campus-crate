const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const LendingRequest = require('../models/LendingRequest');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

// Create a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookingId, toUserId, rating, comment, categories } = req.body;

    // Verify the lending request exists and user is part of it
    const lendingRequest = await LendingRequest.findById(bookingId);
    if (!lendingRequest) {
      return res.status(404).json({ message: 'Lending request not found' });
    }

    // Verify user is part of this transaction
    if (lendingRequest.borrower.toString() !== req.userId && 
        lendingRequest.lender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to review this transaction' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      lendingRequest: bookingId,
      reviewer: req.userId,
      reviewee: toUserId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this transaction' });
    }

    // Determine review type
    const type = lendingRequest.lender.toString() === req.userId ? 'Borrower' : 'Lender';

    const review = new Review({
      lendingRequest: bookingId,
      reviewer: req.userId,
      reviewee: toUserId,
      item: lendingRequest.item,
      rating,
      comment,
      type,
      categories
    });

    await review.save();

    // Update user's rating
    const reviews = await Review.find({ reviewee: toUserId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(toUserId, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    await review.populate(['reviewer', 'reviewee', 'item']);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
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
