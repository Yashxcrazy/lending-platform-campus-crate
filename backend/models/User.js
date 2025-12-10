const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
