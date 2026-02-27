# Rival Assessment: Secure Blog Platform

This is a production-ready blog platform featuring user authentication, complete blog management with private and public access, a global feed, and interactive functionalities. 

## 🛠️ Tech Stack
**Frontend:** Next.js 15 (App Router), TypeScript, shadcn/ui.
**Backend:** NestJS 11, TypeScript (strict mode), PostgreSQL, Prisma ORM.

## 🚀 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd rival
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend/` directory:
     ```env
     DATABASE_URL="postgres://<user>:<password>@localhost:5432/<dbname>"
     JWT_SECRET="your_super_secret_key"
     ```
   - Initialize and seed the database:
     ```bash
     npx prisma generate
     npx prisma db push
     ```
   - Start the NestJS backend:
     ```bash
     npm run start:dev
     ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   - Create a `.env` file in the `frontend/` directory:
     ```env
     NEXT_PUBLIC_API_URL="http://localhost:3000"
     ```
   - Start the Next.js development server:
     ```bash
     npm run dev
     ```

## 🏗️ Architecture Explanation

The application follows a standard Next.js (Frontend) / NestJS (Backend) architecture with a clean separation of concerns.

### Backend Architecture (NestJS)
- **Controllers & Routing:** Built around domains (Auth, Blog, Like, Comment) keeping endpoints neatly separated.
- **DTOs & Validation:** Utilizes `class-validator` for strict payload checking on incoming requests to secure API boundaries.
- **Service Layer:** Houses the business logic, interacting with the database via Prisma ORM for efficient SQL queries.
- **Guards:** Custom AuthGuards protect private endpoints using stateless JWTs.

### Frontend Architecture (Next.js)
- **App Router:** Fully embraces Next.js 15 Server and Client component boundaries.
- **Features/Services Layer:** Centralizes Axios API requests per feature (`auth.service.ts`, `blog.service.ts`), providing separation between UI components and data fetching.
- **State Management:** Utilizes Zustand for simple, prop-drilling-free global client state (like the authenticated User).
- **Styling:** Tailwind CSS combined with shadcn/ui for accessible, consistent component structures.

## ⚖️ Tradeoffs Made

- **JWT in LocalStorage vs. HttpOnly Cookies:** Currently uses LocalStorage/Custom interceptors to manage token usage. While HttpOnly cookies protect against standard XSS, they can introduce complex CORS situations during the early MVP phase. This tradeoff favors development speed for the assignment but would require modification for production.
- **Synchronous Actions:** Operations like `Like` and `Comment` write synchronously to the main database and return. For a scalable system, these tasks (especially aggregation) might be decoupled entirely using event-driven architectures (message queues).
- **Pagination logic:** Offset-based pagination was favored over cursor-based pagination for ease of querying, although cursor-based is generally faster for very large datasets on the `GET /public/feed` route.

## 💡 What To Improve

- **Real-time Notifications:** Add WebSockets (`socket.io` with NestJS) for live-updating the UI when a user receives a new like or comment.
- **Security Enhancements:** Move to rotating Refresh/Access token cycles and HttpOnly cookie implementations. Add request rate-limiting (e.g., `nestjs-throttler`) to combat brute force and abuse on public endpoints.
- **Full Text Search:** Utilize Postgres text-search features or an external engine (like Typesense or Algolia) to filter blogs interactively instead of standard ILIKE matches.
- **Rich Text Editor:** Add an MDX or TipTap editor integration instead of plaintext markdown components on the frontend.
- **Test Coverage:** Build full E2E journeys using Playwright and expand unit test coverage on critical Auth and Blog services using Jest.

## 🌍 Scaling to 1 Million Users

If traffic surges to 1M Users, I would restructure using the following approaches:

1. **Database Scaling (Read/Write Separation):**
   - **Read Replicas:** The `GET /public/feed` and `GET /public/blog/:slug` endpoints will have very high traffic compared to updates. I'd configure Prisma to route read queries to PostgreSQL read-replicas, keeping the primary database unblocked for fast Write/Update operations.
   - **Connection Pooling:** Introduce `PgBouncer` (or use Neon's built-in pooling) to avoid exhausting DB connections due to high worker concurrency.

2. **Caching Strategy (Redis):**
   - Set up **Redis** globally for the backend.
   - Cache results from the public feed and individual public web pages to prevent DB load. NestJS CacheModule and interceptors would serve repeated valid GET requests instantly from Memory.

3. **CDN Integration (Next.js Edge Delivery):**
   - Host Next.js on Vercel leveraging ISR (Incremental Static Regeneration). Heavily accessed blog post routes could be statically generated and revalidated in the background, minimizing the trips directly to the backend API altogether.

4. **Asynchronous Job Processing (BullMQ):**
   - "Liking" or "Commenting" triggers queue insertions via Redis/BullMQ. Workers process these events in batches asynchronously to prevent lock contention and smooth out massive traffic spikes.
