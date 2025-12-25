const mongoose = require('mongoose');

/**
 * Middleware to validate MongoDB ObjectId format
 * Prevents CastError crashes from invalid IDs
 * 
 * Usage:
 * router.get('/:id', validateObjectId('id'), async (req, res) => {...})
 * router.put('/:userId/role', validateObjectId('userId'), async (req, res) => {...})
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(400).json({ 
        success: false,
        error: `Missing ${paramName} parameter` 
      });
    }
    
    // Check if valid 24-character hex string (MongoDB ObjectId format)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: `Invalid ${paramName} format` 
      });
    }
    
    next();
  };
};

module.exports = validateObjectId;
