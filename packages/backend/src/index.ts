import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth, WithAuthProp } from '@clerk/clerk-sdk-node';
import { Pool } from 'pg';
import Stripe from 'stripe';
import itCostRoutes from './routes/itCostRoutes';

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

// IT Cost routes
app.use('/api/it-costs', itCostRoutes);

// Protected route example
const requireAuth = ClerkExpressRequireAuth({});

// Type assertion to handle the auth property
const protectedHandler = (req: Request, res: Response) => {
  const authReq = req as WithAuthProp<Request>;
  res.json({ message: 'This is a protected route', user: authReq.auth });
};

app.get('/api/protected', requireAuth, protectedHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 