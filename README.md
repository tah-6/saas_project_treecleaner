Tree Cleaner

A dashboard for tracking dev overhead and codebase hygiene.

Why I Built This?
I noticed that between Vercel, OpenAI API credits, and various SaaS subscriptions, my "hobby" coding costs were creeping up without me realizing it. I wanted a single place to see my monthly burn rate versus my annual commitments, so I built Tree Cleaner to act as a centralized health check for my development ecosystem.

Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Serverless Functions (Vercel), PostgreSQL
- Auth: Clerk (Middleware protected routes)
- Deployment: Vercel

Key Features
- Cost Visualization: Breaks down spending by category (Cloud, AI, Tools) to show where money is actually going.
- Subscription Logic: Handles the difference between monthly and annual billing cycles.
- Multi-Tenancy: Uses a relational schema where users are isolated; I learned a lot about Row Level Security (RLS) building this.

One Cool Technical Detail
The hardest part was standardizing billing cycles. Some tools charge on the 1st, others on the signup date. I ended up writing a normalization utility in TypeScript that converts everything into a standard "Monthly Burn" metric so the charts are actually accurate comparisons.

Running Locally
1. Clone the repo
2. Install dependencies: npm install
3. Add your .env keys (Clerk & Postgres URL)
4. Run dev server: npm run dev
