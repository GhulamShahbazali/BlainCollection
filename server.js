const express = require('express');
const database = require('./database');
const router = require('./Routes/routers');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Configure CORS for production and development
const corsOptions = {
  origin: [
    'https://blain-collection.vercel.app',
    'http://localhost:9000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Enhanced body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database connection
database().catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// File upload handling - remove this for Vercel deployment
// app.use('/uploadImages', express.static('uploadImages'));

// Routes
app.use('/auth', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Server is up and running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;