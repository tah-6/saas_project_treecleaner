const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Vercel serverless function!' });
});

// Export for Vercel
module.exports = app; 