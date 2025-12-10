const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: String,
  campus: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  trustScore: { type: Number, default: 100 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastActive: Date,
  // Add role field (default 'user'). Allowed values: 'user' | 'admin'
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
