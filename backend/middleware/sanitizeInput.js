/**
 * Middleware to sanitize user input and prevent XSS attacks
 * Escapes HTML entities and removes potentially dangerous characters
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Escape HTML entities
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove null bytes
    .replace(/\0/g, '')
    // Trim whitespace
    .trim();
};

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  return obj;
};

/**
 * Sanitize request body fields
 * @param {string[]} fields - Array of field names to sanitize (optional)
 */
const sanitizeInput = (fields = null) => {
  return (req, res, next) => {
    if (!req.body) {
      return next();
    }
    
    if (fields && Array.isArray(fields)) {
      // Sanitize only specified fields
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          req.body[field] = sanitizeObject(req.body[field]);
        }
      });
    } else {
      // Sanitize entire body
      req.body = sanitizeObject(req.body);
    }
    
    next();
  };
};

module.exports = sanitizeInput;
