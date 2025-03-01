# Synaxis

Synaxis is a modern, all-in-one platform designed to reimagine how communities and events come together. It’s a space where brands and users connect—brands create vibrant communities and events, while users discover immersive, tailored experiences. From live interactions to powerful automations, Synaxis blends sophisticated functionality with an engaging UI to empower creators and attendees alike.

## Features

### Core Functionality
- **Events**: Host and manage both virtual and in-real-life (IRL) gatherings with ease.
- **Communities**: Brands can build dedicated spaces for their audiences to connect and engage.
- **Website Builder**: A drag-and-drop editor (inspired by TipTap) lets brands design custom event pages or marketing fronts, hosted at unique URLs.
- **Live Polls**: Real-time polling for interactive sessions—engage attendees instantly.
- **Live Chat Rooms**: Dynamic, real-time conversations within communities and events.

### Automation & Workflows
- **Automations**: Trigger actions based on user behavior—e.g., send a welcome message when someone joins a community or notify attendees post-RSVP.
- **Custom Workflows**: Brands define their own automation sequences for seamless engagement.

### Discovery & Insights
- **Recommendation System**: AI-driven engine curates events for users based on interests and interactions—ingest events, log user actions, fetch personalized recommendations, and search with similarity matching.
- **Analytics**: Detailed insights for brands—track community growth, event traction, and engagement metrics.
- **Map System**: Geolocation for IRL events—find and navigate to gatherings with an integrated map view.

### Extensibility
- **Bring Your Own Payment Links**: Brands integrate custom payment solutions for ticket purchases—no platform lock-in.
- **Integrations**: Hook into external tools and services to extend functionality.

### User Experience
- **Sophisticated UI**: Immersive, responsive design with a black `#000000` signature color, animated transitions, and a premium feel.
- **Mobile App Potential**: Foundation laid for a future mobile companion.

### Communication
- **Audio Calls**: Real-time audio sessions for AMAs or live discussions—scalable and concurrent.

---

## Technology Stack

Synaxis is built with a modern, scalable tech stack to handle its ambitious feature set. Here’s what powers it:

### Frontend
- **TypeScript**: Strict typing for robust, maintainable code.
- **Next.js**: Server-side rendering, static site generation, and API routes for a fast, SEO-friendly frontend.
- **Tailwind CSS**: Utility-first styling for a consistent, customizable UI with a black `#000000` base and blue `#0066FF` accents.

### Backend & Data
- **PostgreSQL**: Core relational database—supports vector extensions for embedding storage (via Supabase).
- **Redis**: High-speed caching and pub/sub for interservice communication.
- **Upstash Vector**: Vector storage for recommendation embeddings (alternative: Supabase with PostgreSQL vector support).
- **QStash**: Lightweight queue for interservice messaging and async tasks.
- **Go**: Custom chat server leveraging Go’s concurrency model for real-time messaging.
- **Erlang (or Go + NATS + Coturn)**: Exploring Erlang for audio calls (WhatsApp-style scalability) or sticking with Go, NATS, and Coturn for WebRTC-based audio.

### AI & Recommendations
- **OpenAI Text Embedding (Large/Small)**: Generates vectors for events and user interactions (alternative: Google Text Embedding Model 004—free up to 1M tokens).
- **PoemAI Text Embedding (Ada/Small)**: Additional vector generation option for flexibility.

### Infrastructure
- **Vercel**: Hosting for Next.js frontend and API routes—fast deploys and scaling.
- **Cloudflare**: DNS, CDN, and edge security for global performance.
- **Uploadthing**: Lightweight asset storage—profile pictures, small files.
- **Cloudflare R2**: Media storage for larger assets like event images or recordings.
- **Trigger.dev**: Background job processing—e.g., event ingestion, automation triggers.

### Security & Monitoring
- **Arcjet**: API security—rate limiting, bot protection, and fraud prevention.
- **Better Auth**: Authentication system—secure, flexible user management.
- **PostHog**: Analytics tracking—user behavior and platform usage insights.
- **Sentry**: Error logging and performance monitoring—catch and fix issues fast.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v15+)
- Redis (v7+)
- Go (v1.23+)
- Vercel CLI
- API keys: OpenAI/Google (embeddings), Upstash, Cloudflare, Uploadthing, Arcjet, PostHog, Sentry

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/synaxis.git
   cd synaxis
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Running Locally
- Frontend + API: `http://localhost:3000`
- Chat Server (Go): `go run cmd/chat/main.go`
- Test an event: Hit `POST /api/events/ingest` with `{ "title": "LAN Party", "tags": ["gaming"] }`.

---

## Architecture Overview

- **Frontend**: Next.js handles UI and API routes—events, pages, and automations are rendered server-side or statically.
- **Backend**: Go-powered chat server runs separately; QStash and Redis manage interservice comms.
- **Data**: PostgreSQL stores events, users, and pages; Upstash Vector (or Supabase) holds embeddings.
- **AI**: Recommendation engine ingests events and interactions, generates embeddings, and serves curated IDs.
- **Infra**: Vercel hosts the app, Cloudflare secures and speeds it up, R2/Uploadthing manage assets.

---

## Roadmap
- [ ] Launch MVP: Events, communities, recommendations, basic UI.
- [ ] Add automation builder and website editor.
- [ ] Integrate live polls and chat rooms.
- [ ] Roll out map system and audio calls.
- [ ] Explore mobile app feasibility.

---

## Contributing
Got ideas? Open an issue or PR—Synaxis is built for creators, by creators.
