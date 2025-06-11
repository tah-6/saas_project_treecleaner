import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth, WithAuthProp } from '@clerk/clerk-sdk-node';
import { Pool } from 'pg';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Stripe setup
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Protected route example
app.get(
  '/api/protected',
  ClerkExpressRequireAuth({}),
  (req: WithAuthProp<Request>, res: Response) => {
    res.json({ message: 'This is a protected route', user: req.auth });
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 