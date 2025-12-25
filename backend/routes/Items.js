const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Message = require('../models/Message');
const authenticateToken = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const sanitizeInput = require('../middleware/sanitizeInput');

// Get all items with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      availability,
      search,
      campus,
      owner,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    // Support owner=me for getting current user's items
    if (owner === 'me') {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          query.owner = decoded.userId;
        } catch (err) {
          return res.status(401).json({ message: 'Invalid token' });
        }
      } else {
        return res.status(401).json({ message: 'Authentication required' });
      }
    } else if (owner) {
      query.owner = owner;
    }

    if (category) query.category = category;
    if (availability) query.availability = availability;
    if (campus) query['location.campus'] = campus;
    if (minPrice || maxPrice) {
      query.dailyRate = {};
      if (minPrice) query.dailyRate.$gte = Number(minPrice);
      if (maxPrice) query.dailyRate.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const items = await Item.find(query)
      .populate('owner', 'name profileImage rating campus')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalItems: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single item
router.get('/:id', validateObjectId(), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name profileImage rating reviewCount campus phone email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.viewCount += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create item
router.post('/', authenticateToken, sanitizeInput(['title', 'description', 'tags']), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      images,
      condition,
      dailyRate,
      securityDeposit,
      location,
      tags,
      minLendingPeriod,
      maxLendingPeriod
    } = req.body;

    const item = new Item({
      owner: req.userId,
      title,
      description,
      category,
      images,
      condition,
      dailyRate,
      securityDeposit,
      location,
      tags,
      minLendingPeriod,
      maxLendingPeriod
    });

    await item.save();
    await item.populate('owner', 'name profileImage rating');

    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item
router.put('/:id', authenticateToken, validateObjectId(), sanitizeInput(['title', 'description', 'tags']), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Only allow updating specific fields (security)
    const allowedUpdates = [
      'title',
      'description',
      'category',
      'images',
      'condition',
      'dailyRate',
      'securityDeposit',
      'availability',
      'location',
      'tags',
      'minLendingPeriod',
      'maxLendingPeriod'
    ];

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        item[key] = updates[key];
      }
    });

    await item.save();
    await item.populate('owner', 'name profileImage rating');

    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete item
router.delete('/:id', authenticateToken, validateObjectId(), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    item.isActive = false;
    await item.save();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's items
router.get('/user/:userId', validateObjectId('userId'), async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.params.userId,
      isActive: true
    }).populate('owner', 'name profileImage rating');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for an item (between current user and item owner)
router.get('/:id/messages', authenticateToken, validateObjectId(), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const messages = await Message.find({
      itemId: req.params.id,
      $or: [
        { senderId: req.userId, recipientId: item.owner._id },
        { senderId: item.owner._id, recipientId: req.userId }
      ]
    })
    .populate('senderId', 'name')
    .sort({ createdAt: 1 });

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      content: msg.content,
      senderId: msg.senderId._id,
      senderName: msg.senderId.name,
      createdAt: msg.createdAt,
      isOwnMessage: msg.senderId._id.toString() === req.userId
    }));

    res.json({ messages: formattedMessages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a message about an item
router.post('/:id/messages', authenticateToken, validateObjectId(), sanitizeInput(['content']), async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const item = await Item.findById(req.params.id).populate('owner');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Determine recipient (if sender is owner, can't message themselves)
    const recipientId = item.owner._id.toString() === req.userId 
      ? null // Owner can't message themselves
      : item.owner._id;

    if (!recipientId) {
      return res.status(400).json({ message: 'Cannot message yourself about your own item' });
    }

    const message = new Message({
      itemId: req.params.id,
      senderId: req.userId,
      recipientId: recipientId,
      content: content.trim()
    });

    await message.save();
    await message.populate('senderId', 'name');

    res.json({
      message: {
        id: message._id,
        content: message.content,
        senderId: message.senderId._id,
        senderName: message.senderId.name,
        createdAt: message.createdAt,
        isOwnMessage: true
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;