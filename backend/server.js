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
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://campus-crate-zeta.vercel.app',
      'https://campus-crate-git-main-yashxcrazys-projects.vercel.app',
      'https://campus-crate-jog4fiqpd-yashxcrazys-projects.vercel.app'
    ];
    
    const replitDomain = process.env.REPLIT_DEV_DOMAIN;
    if (replitDomain) {
      allowedOrigins.push(`https://${replitDomain}`);
    }
    
    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true);
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
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Note: If using MongoDB Atlas, ensure your IP is whitelisted (use 0.0.0.0/0 to allow all IPs)');
  });

console.log('Loading routes...');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/Items');
const lendingRoutes = require('./routes/Lending');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/lending', lendingRoutes);

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
      lending: '/api/lending'
    }
  });
});

app.use((err, req, res, next) => {
  // Log full error details server-side
  console.error('=== Error Details ===');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Status:', err.status || 500);
  if (err.name) console.error('Error Name:', err.name);
  if (err.code) console.error('Error Code:', err.code);
  console.error('====================');
  
  // Return safe JSON response based on error type
  const statusCode = err.status || (err.name === 'ValidationError' ? 400 : 500);
  
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
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
