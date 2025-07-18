const express = require('express');
const database = require('./database');
const router = require('./Routes/routers');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

// Initialize database connection
database();

// Middleware for parsing JSON
app.use(express.json({ limit: '10mb' }));

// Enable CORS (adjust origins as needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// File upload handling (commented out for Vercel)
// app.use('/uploadImages', express.static('uploadImages'));

// Routes
app.use('/auth', router);

// Basic health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'running', db: dbStatus });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error y dhko '+err.message });
});

module.exports = app;