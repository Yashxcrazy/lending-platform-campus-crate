const express = require('express');
const router = express.Router();
const LendingRequest = require('../models/LendingRequest');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const sanitizeInput = require('../middleware/sanitizeInput');

const requireVerified = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let isVerifiedFlag = typeof req.user?.isVerified !== 'undefined' ? req.user.isVerified : undefined;

    if (typeof isVerifiedFlag === 'undefined') {
      const userDoc = await User.findById(req.userId).select('isVerified');
      if (!userDoc) {
        return res.status(404).json({ message: 'User not found' });
      }
      isVerifiedFlag = userDoc.isVerified;
    }

    if (!isVerifiedFlag) {
      return res.status(403).json({ message: 'Account verification required to borrow, lend, or chat.' });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create lending request
router.post('/request', authenticateToken, requireVerified, sanitizeInput(['message']), async (req, res) => {
  try {
    const { itemId, startDate, endDate, message } = req.body;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Check if start date is in the past
    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    // Check if end date is after start date
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check for reasonable rental period (max 1 year)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days > 365) {
      return res.status(400).json({ message: 'Rental period cannot exceed 1 year' });
    }

    const item = await Item.findById(itemId).populate('owner');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.availability !== 'Available') {
      return res.status(400).json({ message: 'Item is not available' });
    }

    if (item.owner._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot borrow your own item' });
    }
    const totalCost = days * item.dailyRate;

    const lendingRequest = new LendingRequest({
      item: itemId,
      borrower: req.userId,
      lender: item.owner._id,
      startDate,
      endDate,
      totalCost,
      securityDeposit: item.securityDeposit,
      message
    });

    await lendingRequest.save();
    await lendingRequest.populate(['item', 'borrower', 'lender']);

    const notification = new Notification({
      user: item.owner._id,
      type: 'LendingRequest',
      title: 'New Lending Request',
      message: `${lendingRequest.borrower.name} wants to borrow your ${item.title}`,
      relatedId: lendingRequest._id,
      link: `/lending/${lendingRequest._id}`
    });
    await notification.save();

    res.status(201).json({
      message: 'Lending request created successfully',
      lendingRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all lending requests for user
router.get('/my-requests', authenticateToken, requireVerified, async (req, res) => {
  try {
    const { type = 'all', status } = req.query;

    let query = {};
    if (type === 'borrowing') {
      query.borrower = req.userId;
    } else if (type === 'lending') {
      query.lender = req.userId;
    } else {
      query.$or = [{ borrower: req.userId }, { lender: req.userId }];
    }

    if (status) {
      query.status = status;
    }

    const requests = await LendingRequest.find(query)
      .populate('item')
      .populate('borrower', 'name profileImage rating')
      .populate('lender', 'name profileImage rating')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single lending request
router.get('/:id', authenticateToken, requireVerified, validateObjectId(), async (req, res) => {
  try {
    const request = await LendingRequest.findById(req.params.id)
      .populate('item')
      .populate('borrower', 'name profileImage rating reviewCount campus phone email')
      .populate('lender', 'name profileImage rating reviewCount campus phone email');

    if (!request) {
      return res.status(404).json({ message: 'Lending request not found' });
    }

    if (request.borrower._id.toString() !== req.userId && 
        request.lender._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept lending request
router.post('/:id/accept', authenticateToken, requireVerified, validateObjectId(), async (req, res) => {
  try {
    const request = await LendingRequest.findById(req.params.id)
      .populate('item')
      .populate('borrower');

    if (!request) {
      return res.status(404).json({ message: 'Lending request not found' });
    }

    if (request.lender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Request cannot be accepted. Current status: ' + request.status });
    }

    // Update request status
    request.status = 'Accepted';
    await request.save();

    // Update item availability
    const item = await Item.findById(request.item._id);
    if (item) {
      item.availability = 'Rented';
      await item.save();
    }

    // Create notification
    const notification = new Notification({
      user: request.borrower._id,
      type: 'RequestAccepted',
      title: 'Request Accepted',
      message: `Your request to borrow ${request.item.title} has been accepted`,
      relatedId: request._id,
      link: `/lending/${request._id}`
    });
    await notification.save();

    // Re-populate after save
    await request.populate(['item', 'borrower', 'lender']);

    res.json({
      message: 'Request accepted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject lending request
router.post('/:id/reject', authenticateToken, requireVerified, validateObjectId(), sanitizeInput(['reason']), async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await LendingRequest.findById(req.params.id)
      .populate('item')
      .populate('borrower');

    if (!request) {
      return res.status(404).json({ message: 'Lending request not found' });
    }

    if (request.lender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending requests can be rejected. Current status: ' + request.status });
    }

    // Update request status
    request.status = 'Rejected';
    request.cancellationReason = reason;
    await request.save();

    // Create notification
    const notification = new Notification({
      user: request.borrower._id,
      type: 'RequestRejected',
      title: 'Request Rejected',
      message: `Your request to borrow ${request.item.title} was declined`,
      relatedId: request._id
    });
    await notification.save();

    // Re-populate after save
    await request.populate(['item', 'borrower', 'lender']);

    res.json({
      message: 'Request rejected',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Complete lending
router.post('/:id/complete', authenticateToken, requireVerified, validateObjectId(), async (req, res) => {
  try {
    const request = await LendingRequest.findById(req.params.id)
      .populate('item')
      .populate(['borrower', 'lender']);

    if (!request) {
      return res.status(404).json({ message: 'Lending request not found' });
    }

    if (request.lender.toString() !== req.userId && 
        request.borrower.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'Accepted' && request.status !== 'Active') {
      return res.status(400).json({ message: 'Only accepted or active requests can be completed. Current status: ' + request.status });
    }

    // Update request status and return date
    request.status = 'Completed';
    request.actualReturnDate = new Date();

    // Calculate late fees if applicable
    const expectedReturn = new Date(request.endDate);
    const actualReturn = new Date(request.actualReturnDate);
    
    if (actualReturn > expectedReturn) {
      const lateDays = Math.ceil((actualReturn - expectedReturn) / (1000 * 60 * 60 * 24));
      request.lateReturnDays = lateDays;
      request.lateFee = lateDays * request.item.dailyRate * 1.5;
    }

    await request.save();

    // Update item availability back to Available
    const item = await Item.findById(request.item._id);
    if (item) {
      item.availability = 'Available';
      await item.save();
    }

    // Re-populate after save
    await request.populate(['item', 'borrower', 'lender']);

    res.json({
      message: 'Lending completed successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a lending request (anonymous chat)
router.get('/:id/messages', authenticateToken, requireVerified, validateObjectId(), async (req, res) => {
  try {
    const request = await LendingRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Lending request not found' });

    const isParticipant =
      request.borrower.toString() === req.userId || request.lender.toString() === req.userId;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const messages = await Message.find({ request: req.params.id })
      .sort({ createdAt: 1 });

    const shaped = messages.map((m) => ({
      id: m._id,
      content: m.content,
      createdAt: m.createdAt,
      isOwnMessage: m.sender.toString() === req.userId,
    }));

    res.json({ data: shaped });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message for a lending request
router.post('/:id/messages', authenticateToken, requireVerified, validateObjectId(), sanitizeInput(['content']), async (req, res) => {
  try {
    const { content } = req.body || {};
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const request = await LendingRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Lending request not found' });

    const isParticipant =
      request.borrower.toString() === req.userId || request.lender.toString() === req.userId;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const message = new Message({
      request: req.params.id,
      sender: req.userId,
      content: content.trim(),
    });
    await message.save();

    // Notify the other participant
    const otherUser = request.borrower.toString() === req.userId ? request.lender : request.borrower;
    const notification = new Notification({
      user: otherUser,
      type: 'Message',
      title: 'New message',
      message: 'You have a new chat message',
      relatedId: req.params.id,
      link: `/lending/${req.params.id}/chat`
    });
    await notification.save();

    res.status(201).json({
      message: 'Message sent',
      data: {
        id: message._id,
        content: message.content,
        createdAt: message.createdAt,
        isOwnMessage: true,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;