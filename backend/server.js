console.log('Starting server...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

console.log('Loading environment variables...');
dotenv.config();

console.log('Creating Express app...');
const app = express();

app.set('trust proxy', 1);

console.log('Setting up middleware...');
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    // Base allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://campus-crate-zeta.vercel.app',
      'https://campus-crate-git-main-yashxcrazys-projects.vercel.app',
      'https://campus-crate-jog4fiqpd-yashxcrazys-projects.vercel.app'
    ];
    
    // Add Replit domain if present
    const replitDomain = process.env.REPLIT_DEV_DOMAIN;
    if (replitDomain) {
      allowedOrigins.push(`https://${replitDomain}`);
    }
    
    // Add custom allowed origins from environment variable (comma-separated)
    const customOrigins = process.env.ALLOWED_ORIGINS;
    if (customOrigins) {
      allowedOrigins.push(...customOrigins.split(',').map(o => o.trim()));
    }
    
    // Allow requests with no origin (e.g., mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

console.log('Connecting to MongoDB...');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not set — running in DEGRADED MODE (no database)');
  console.warn('⚠️  Database-dependent endpoints will fail');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('Note: If using MongoDB Atlas, ensure your IP is whitelisted (use 0.0.0.0/0 to allow all IPs)');
      console.warn('⚠️  Server running in DEGRADED MODE (database unavailable)');
    });
}

console.log('Loading routes...');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/Items');
const lendingRoutes = require('./routes/Lending');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const authenticateToken = require('./middleware/auth');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/lending', lendingRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Campus Crate API is running',
    timestamp: new Date() 
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Campus Crate API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      items: '/api/items',
      lending: '/api/lending',
      admin: '/api/admin',
      users: '/api/users',
      reviews: '/api/reviews'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

const PORT = process.env.BACKEND_PORT || 3001;

console.log('Starting server on port', PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

console.log('Server setup complete!');
