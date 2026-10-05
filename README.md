# OUTZI.AI 🌆
> **AI Real-World Outing & Experience Planner for Urban India**  
> Don’t just find a place. Plan the whole experience.

OUTZI.AI turns *"What should we do today?"* into realistic, constraint-aware itineraries across major Indian metros using Google Gemini 3.8 Flash intelligence, real-world Google Maps grounding, transit time calculations, and an explicit zero-hallucination protocol.

---

## 🚀 Quick Start for Developers

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd outzi-ai
npm install
```

---

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and add your Google Gemini API Key:

```env
GEMINI_API_KEY="your_actual_gemini_api_key"
PORT=3000
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

> **Security Note:** The `.env` file is ignored by `.gitignore`. The Gemini API Key is loaded on the server only (`server.ts`) and is never leaked or bundled into the client-side JavaScript.

---

### 3. Run in Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.  
In development mode, `server.ts` mounts Vite's SPA middleware with on-demand module compilation.

---

### 4. Build & Run in Production Mode

To test or deploy the production build:

```bash
# 1. Build the Vite production bundle into /dist
npm run build

# 2. Run the production server
NODE_ENV=production npm start
```

The production server serves pre-built static assets from `/dist` and all backend API endpoints via Express.

---

## 🛠️ Project Structure

```text
├── package.json                   # Scripts, dependencies, and type definitions
├── tsconfig.json                  # Strict TypeScript configuration
├── vite.config.ts                 # Vite bundler configuration with Tailwind CSS v4
├── metadata.json                  # AI Studio metadata & server capabilities
├── .gitignore                     # Excludes node_modules, dist, logs, and .env files
├── .env.example                   # Template for required environment variables
├── index.html                     # HTML5 entry point with OpenGraph & Twitter tags
├── server.ts                      # Full-stack Express server (Gemini 3.8 Flash, APIs, Vite middleware)
└── src/
    ├── main.tsx                   # React 19 root mounting
    ├── index.css                  # Global Tailwind CSS imports
    ├── App.tsx                    # Root routing, state, and modal orchestrator
    ├── types/
    │   └── index.ts               # Core TypeScript definitions (Plans, Venues, Cities, Users)
    ├── lib/
    │   ├── api.ts                 # Type-safe API client for /api/* backend routes
    │   ├── storage.ts             # LocalStorage persistence for user profile & saved plans
    │   ├── calendar.ts            # One-click Google Calendar integration links
    │   └── notifications.ts       # Browser push & reminder notification manager
    ├── components/
    │   ├── Navbar.tsx             # Responsive header with city selector & auth menu
    │   ├── Footer.tsx             # Footer with city coverage & privacy constitution
    │   ├── CitySelectorModal.tsx  # Searchable Indian cities modal with coming-soon triggers
    │   ├── AgeVerificationModal.tsx # Zero-retention ID / DOB verification modal
    │   └── TimelineView.tsx       # Chronological stops, transit times & Google Maps navigation
    └── views/
        ├── LandingPage.tsx        # Hero banner, quick starters, and how it works
        ├── DashboardView.tsx      # User hub with saved plans & bookmarked venues
        ├── PlannerView.tsx        # Core AI planning workflow + natural language adjustments
        ├── EventsExploreView.tsx  # Confirmed Indian events with "Use in my plan"
        ├── SavedPlansView.tsx     # Private saved itineraries with calendar export
        ├── SavedPlacesView.tsx    # Bookmarked venues with Google Maps access
        ├── SettingsView.tsx       # User preferences, travel distance & privacy settings
        ├── AdminView.tsx          # Dynamic questions, city registry, feature flags & moderation
        └── PlanDetailView.tsx     # Detail view & anonymous public plan viewer (/share/:token)
```

---

## 🌟 Key Features

1. **Hybrid Planning Engine**: Combines natural-language prompts with structured constraint cards (Intent, Metro, Area, Budget in INR, Vibe, Duration, Group Size).
2. **Server-Side Gemini 3.8 Flash**: Grounded with real Indian venues, realistic travel times, and an explicit *"Why this plan?"* explanation.
3. **2 Distinct Alternatives**: Generates two alternative outing options alongside the primary recommendation with one-click preview.
4. **Natural Language Adjustments**: Supports quick prompts like *"Make it cheaper"*, *"I only have 2 hours"*, or *"Change the café"* without losing other settings.
5. **Real-World Grounding**: 11 supported Indian metros (Bengaluru, Delhi NCR, Greater Noida, Mumbai, Hyderabad, Pune, Kolkata, Chennai, Jaipur, Ahmedabad, Chandigarh).
6. **Strict Age Gating**: Romantic and date outings are restricted to adults 18+ on both client and server API endpoints.
7. **Zero Social Network**: No public profiles, no follower counts, and zero personal data leakage in public `/share/:token` links.
8. **Google Calendar Export**: Generates pre-formatted Google Calendar links for stops or whole outings.

---

## 🔒 Security & Privacy

- **No API Keys in Client**: All Gemini AI SDK calls execute strictly in `server.ts`.
- **Zero Document Retention**: Any age verification documents uploaded in `AgeVerificationModal.tsx` are evaluated client-side in memory and immediately discarded.
- **Anonymous Shared Links**: Public share links strip the user's name, email, and private preferences.

---

## 📜 Available Scripts

- `npm run dev`: Runs the full-stack development server with Vite middleware on port 3000.
- `npm run build`: Builds the production-ready client bundle in `/dist`.
- `npm run start`: Runs the Node production server using `server.ts`.
- `npm run lint`: Checks TypeScript types with `tsc --noEmit`.
- `npm run clean`: Removes build artifacts (`/dist`).
