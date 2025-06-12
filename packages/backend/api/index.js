const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running!', 
    endpoints: [
      'GET / - This message',
      'GET /api/health - Health check',
      'GET /api/test - Test endpoint'
    ]
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Vercel serverless function!' });
});

// Catch all other routes
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    availableEndpoints: ['/', '/api/health', '/api/test']
  });
});

// Export for Vercel
module.exports = app; 