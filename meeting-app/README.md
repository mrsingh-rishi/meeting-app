# Meeting Collaboration Platform with MCP Integration

A modern, production-grade meeting dashboard with **Model Context Protocol (MCP)** integration that connects to Google Calendar and provides AI-powered meeting summaries. Built for the **Katalyst Founding Engineer** take-home assignment.

## 🚀 Live Demo

**Deployment Link:** [https://meeting-app-rishi.vercel.app](https://meeting-app-rishi.vercel.app)
**GitHub Repository:** [https://github.com/mrsingh-rishi/meeting-app](https://github.com/mrsingh-rishi/meeting-app)

## 📋 Features

### Core Features
- ✅ **Model Context Protocol (MCP) Integration** - JSON-RPC 2.0 compliant client architecture
- ✅ **Google OAuth Authentication** via NextAuth.js
- ✅ **Google Calendar Integration** - Fetches 5 upcoming and 5 past meetings
- ✅ **AI-Powered Meeting Summaries** using OpenAI GPT-3.5 Turbo
- ✅ **Intelligent MCP Fallbacks** - Works with or without MCP server
- ✅ **Clean, Professional UI** with Tailwind CSS and TypeScript
- ✅ **PostgreSQL Database** with Prisma ORM
- ✅ **Responsive Design** - Mobile and desktop optimized
- ✅ **Real-time Loading States** and error handling
- ✅ **Production-ready** error handling and security

### MCP Architecture
- **JSON-RPC 2.0 Client** - Standards-compliant MCP client implementation
- **Tool Discovery** - Dynamic tool discovery from MCP servers
- **Graceful Fallbacks** - Automatic fallback to Google Calendar API when MCP unavailable
- **Type-Safe Integration** - Full TypeScript support for MCP interfaces
- **Production Ready** - Works seamlessly in serverless environments

### Meeting Display
- **Meeting Cards** showing title, time, duration, attendees, description
- **Upcoming Meetings** section with green badges
- **Past Meetings** section with purple badges and AI summaries
- **Elegant hover effects** and clean separation
- **Professional color scheme** inspired by Linear, Notion, and Superhuman

## 🛠 Tech Stack

- **Frontend:** React (Next.js 15), Tailwind CSS, TypeScript
- **Backend:** Next.js API routes
- **MCP Integration:** JSON-RPC 2.0 compliant Model Context Protocol client
- **Authentication:** NextAuth.js with Google OAuth
- **Database:** PostgreSQL with Prisma ORM
- **AI/LLM:** OpenAI GPT-3.5 Turbo
- **Calendar:** Google Calendar API via googleapis + MCP wrapper
- **Hosting:** Vercel (serverless architecture)
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **HTTP Client:** Axios (for MCP communication)

## 📁 Project Structure

```
/meeting-app
├── /src/app
│   ├── /api
│   │   ├── /auth/[...nextauth]/route.ts    # NextAuth API handler
│   │   ├── /meetings/route.ts               # Meetings API endpoint with MCP
│   │   └── /mcp/route.ts                   # MCP status and tool invocation
│   ├── globals.css                          # Global styles
│   ├── layout.tsx                          # Root layout with providers
│   └── page.tsx                            # Main page with auth flow
├── /src/components
│   ├── Dashboard.tsx                       # Main dashboard component
│   ├── MeetingCard.tsx                     # Meeting card UI component
│   ├── Loading.tsx                         # Loading skeleton
│   ├── ErrorMessage.tsx                    # Error handling component
│   └── Providers.tsx                       # Session provider wrapper
├── /src/lib
│   ├── auth.ts                            # NextAuth configuration
│   ├── prisma.ts                          # Prisma client setup
│   ├── google-calendar.ts                 # Google Calendar service
│   ├── mcp-client.ts                      # MCP JSON-RPC 2.0 client
│   ├── mcp-google-calendar.ts             # MCP calendar service with fallbacks
│   └── openai.ts                          # OpenAI integration
├── /src/types
│   └── next-auth.d.ts                     # NextAuth type extensions
├── /prisma
│   └── schema.prisma                      # Database schema
├── .env                                   # Environment variables
├── .env.example                           # Environment template
├── DEPLOYMENT_SUMMARY.md                  # MCP implementation summary
└── README.md                              # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Prisma's local dev database)
- Google Cloud Console project with Calendar API enabled
- OpenAI API key (optional - has fallback mock summaries)

### 1. Clone & Install
```bash
git clone <repository-url>
cd meeting-app
npm install
```

### 2. Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```

Update `.env` with your values:
```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API (optional)
OPENAI_API_KEY="your-openai-api-key"

# MCP Server URL (optional - uses intelligent fallback if not set)
# MCP_SERVER_URL="http://your-mcp-server:8080/mcp"
```

### 3. MCP Configuration (Optional)

The application includes a complete **Model Context Protocol** implementation:

**Default Mode (Recommended):**
- Leave `MCP_SERVER_URL` unset for intelligent fallback mode
- Uses MCP-compatible wrapper around Google Calendar API
- Perfect for development and production without external MCP server

**External MCP Server Mode:**
- Set `MCP_SERVER_URL` to your hosted MCP server
- Requires JSON-RPC 2.0 compliant MCP server with calendar tools
- Automatic fallback if MCP server becomes unavailable

### 4. Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Google Calendar API**
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Secret to your `.env`

### 5. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 6. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with your Google account.

## 🚀 Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set all required environment variables in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `OPENAI_API_KEY` (optional)
- `MCP_SERVER_URL` (optional - leave unset for fallback mode)

### MCP in Production
The MCP implementation is designed for production environments:
- **Serverless Compatible:** Works perfectly in Vercel/Netlify
- **No External Dependencies:** Fallback mode requires no MCP server
- **Graceful Degradation:** Automatic fallback if MCP server unavailable
- **Type Safe:** Full TypeScript support for reliability

## 🧪 API Endpoints

### `GET /api/meetings`
Fetches user's calendar events and returns structured meeting data with AI summaries.
Now enhanced with **MCP integration** for external calendar services.

**Response:**
```json
{
  "upcoming": [
    {
      "id": "string",
      "title": "string",
      "startTime": "Date",
      "endTime": "Date",
      "duration": "string",
      "attendees": ["string"],
      "description": "string?",
      "location": "string?",
      "summary": null
    }
  ],
  "past": [
    {
      "id": "string",
      "title": "string",
      "startTime": "Date",
      "endTime": "Date",
      "duration": "string",
      "attendees": ["string"],
      "description": "string?",
      "location": "string?",
      "summary": "string"
    }
  ]
}
```

### `GET/POST /api/mcp`
MCP server status and tool invocation endpoint for debugging and monitoring.

**GET Response:**
```json
{
  "mcpEnabled": boolean,
  "serverUrl": "string?",
  "availableTools": ["string"],
  "status": "connected" | "fallback" | "error"
}
```

## 🎨 UI/UX Design Principles

- **Professional Color Palette:** Neutral grays with blue/purple accents
- **Clean Typography:** Inter font with proper font features
- **Subtle Animations:** Hover effects and loading states
- **Responsive Layout:** Mobile-first design with desktop optimizations
- **Accessibility:** Proper contrast ratios and semantic HTML
- **Loading States:** Skeleton screens for better perceived performance

## ⚡ Performance Optimizations

- **Prisma Query Optimization:** Using `select` and `include` for efficient queries
- **API Rate Limiting:** Respects Google Calendar API limits
- **Client-Side Caching:** React state management for fetched data
- **Error Boundaries:** Graceful error handling throughout the app
- **Code Splitting:** Next.js automatic code splitting

## 🔒 Security Features

- **OAuth 2.0:** Secure Google authentication flow
- **Session Management:** JWT-based sessions with NextAuth
- **Environment Secrets:** All API keys stored securely
- **CORS Protection:** Proper API route protection
- **Database Security:** Parameterized queries via Prisma

## 🎯 Assumptions & Trade-offs

### Assumptions
- Users have Google Calendar with existing events
- OpenAI API key is optional (graceful fallback to mock summaries)
- PostgreSQL database is available (or using Prisma's dev database)
- Users grant calendar read permissions

### Trade-offs
- **Real-time vs. Polling:** Chose API polling over webhooks for simplicity
- **Client vs. Server Rendering:** Used client-side for better interactivity
- **Mock Data:** AI summaries have fallback for demo purposes
- **Calendar Scope:** Limited to 'readonly' for security
- **Error Recovery:** Graceful degradation when services unavailable

## 📊 Development Workflow

The project follows a professional Git workflow with descriptive commit messages, culminating in **Model Context Protocol** integration:

- `feat: setup Next.js with Tailwind and TypeScript`
- `chore: setup Prisma schema for meetings and summaries`
- `feat: add Google OAuth with NextAuth`
- `feat: fetch and display calendar events`
- `feat: integrate OpenAI for meeting summaries`
- `feat: implement Model Context Protocol (MCP) client architecture`
- `feat: add MCP Google Calendar service with intelligent fallbacks`
- `feat: create MCP status endpoint for monitoring and debugging`
- `style: responsive UI with Tailwind`
- `docs: comprehensive documentation with MCP implementation details`
- `deploy: production deployment with MCP fallback mode`


---

Built with ❤️ for Katalyst's Founding Engineer position. This project demonstrates production-ready full-stack development with **Model Context Protocol** integration, modern web technologies, clean code practices, and thoughtful user experience design.
