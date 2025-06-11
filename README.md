# TreeCleaner SaaS Application

A full-stack SaaS application built with Vite + React (frontend) and Express + PostgreSQL (backend).

## Tech Stack

- Frontend:
  - Vite + React
  - TypeScript
  - Tailwind CSS
  - Clerk (Authentication)
  - Stripe (Payments)
  - React Router
  - Zustand (State Management)

- Backend:
  - Express
  - TypeScript
  - PostgreSQL
  - Clerk (Authentication)
  - Stripe (Payments)

## Project Structure

```
treecleaner/
├── packages/
│   ├── frontend/     # React frontend application
│   ├── backend/      # Express backend server
│   └── shared/       # Shared TypeScript types
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:

   Create `.env` files in both frontend and backend packages:

   Backend (.env):
   ```
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/treecleaner
   CLERK_SECRET_KEY=your_clerk_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

   Frontend (.env):
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:3001
   ```

4. Set up the database:
   ```bash
   # Create PostgreSQL database
   createdb treecleaner
   ```

5. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately
   npm run dev:frontend
   npm run dev:backend
   ```

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:3001

## Building for Production

```bash
npm run build
```

## License

MIT
