const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const validateObjectId = require('../middleware/validateObjectId');
const sanitizeInput = require('../middleware/sanitizeInput');

// POST /api/reports - Create a new report
router.post('/', authenticateToken, sanitizeInput(['reason', 'description']), async (req, res) => {
  try {
    const { reportedItem, reportedUser, reason, description } = req.body;

    if (!reportedItem && !reportedUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Either reportedItem or reportedUser must be provided' 
      });
    }

    if (!reason || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Reason and description are required' 
      });
    }

    const report = new Report({
      reporter: req.userId,
      reportedItem,
      reportedUser,
      reason,
      description
    });

    await report.save();
    await report.populate([
      { path: 'reporter', select: 'name email' },
      { path: 'reportedItem', select: 'title' },
      { path: 'reportedUser', select: 'name email' }
    ]);

    res.status(201).json({ 
      success: true,
      message: 'Report submitted successfully',
      report 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET /api/reports/my-reports - Get current user's reports
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.userId })
      .populate('reportedItem', 'title')
      .populate('reportedUser', 'name email')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ 
      success: true,
      reports 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET /api/reports - Admin: Get all reports
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .populate('reportedItem', 'title')
      .populate('reportedUser', 'name email')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ 
      success: true,
      reports 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// PUT /api/reports/:id/resolve - Admin: Resolve a report
router.put('/:id/resolve', authenticateToken, isAdmin, validateObjectId(), sanitizeInput(['adminNotes']), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['Resolved', 'Dismissed'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Status must be either Resolved or Dismissed' 
      });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ 
        success: false,
        message: 'Report not found' 
      });
    }

    report.status = status;
    report.adminNotes = adminNotes || report.adminNotes;
    report.resolvedBy = req.userId;
    report.resolvedAt = new Date();

    await report.save();
    await report.populate([
      { path: 'reporter', select: 'name email' },
      { path: 'reportedItem', select: 'title' },
      { path: 'reportedUser', select: 'name email' },
      { path: 'resolvedBy', select: 'name' }
    ]);

    res.json({ 
      success: true,
      message: 'Report resolved successfully',
      report 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// DELETE /api/reports/:id - Admin: Delete a report
router.delete('/:id', authenticateToken, isAdmin, validateObjectId(), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ 
        success: false,
        message: 'Report not found' 
      });
    }

    await report.deleteOne();

    res.json({ 
      success: true,
      message: 'Report deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
