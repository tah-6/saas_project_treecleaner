const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const subscriptionsRouter = require('./routes/subscriptions');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true, // Reflect request origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.options('*', cors()); // Enable pre-flight for all routes
app.use(express.json());

// Routes
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/users', usersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced successfully');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
}); 