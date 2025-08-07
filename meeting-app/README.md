# Meeting Collaboration Platform (MCP)

A modern, production-grade meeting dashboard that connects to Google Calendar and provides AI-powered meeting summaries. Built for the **Katalyst Founding Engineer** take-home assignment.

## 🚀 Live Demo

**Deployment Link:** [https://meeting-app-katalyst.vercel.app](https://meeting-app-katalyst.vercel.app)

## 📋 Features

### Core Features
- ✅ **Google OAuth Authentication** via NextAuth.js
- ✅ **Google Calendar Integration** - Fetches 5 upcoming and 5 past meetings
- ✅ **AI-Powered Meeting Summaries** using OpenAI GPT-3.5 Turbo
- ✅ **Clean, Professional UI** with Tailwind CSS and TypeScript
- ✅ **PostgreSQL Database** with Prisma ORM
- ✅ **Responsive Design** - Mobile and desktop optimized
- ✅ **Real-time Loading States** and error handling
- ✅ **Production-ready** error handling and security

### Meeting Display
- **Meeting Cards** showing title, time, duration, attendees, description
- **Upcoming Meetings** section with green badges
- **Past Meetings** section with purple badges and AI summaries
- **Elegant hover effects** and clean separation
- **Professional color scheme** inspired by Linear, Notion, and Superhuman

## 🛠 Tech Stack

- **Frontend:** React (Next.js 15), Tailwind CSS, TypeScript
- **Backend:** Next.js API routes
- **Authentication:** NextAuth.js with Google OAuth
- **Database:** PostgreSQL with Prisma ORM
- **AI/LLM:** OpenAI GPT-3.5 Turbo
- **Calendar:** Google Calendar API via googleapis
- **Hosting:** Vercel
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 📁 Project Structure

```
/meeting-app
├── /src/app
│   ├── /api
│   │   ├── /auth/[...nextauth]/route.ts    # NextAuth API handler
│   │   └── /meetings/route.ts               # Meetings API endpoint
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
│   └── openai.ts                          # OpenAI integration
├── /src/types
│   └── next-auth.d.ts                     # NextAuth type extensions
├── /prisma
│   └── schema.prisma                      # Database schema
├── .env                                   # Environment variables
├── .env.example                           # Environment template
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
```

### 3. Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Google Calendar API**
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Secret to your `.env`

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Run Development Server
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

## 🧪 API Endpoints

### `GET /api/meetings`
Fetches user's calendar events and returns structured meeting data with AI summaries.

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

The project follows a professional Git workflow with descriptive commit messages:

- `feat: setup Next.js with Tailwind and TypeScript`
- `chore: setup Prisma schema for meetings and summaries`
- `feat: add Google OAuth with NextAuth`
- `feat: fetch and display calendar events`
- `feat: integrate OpenAI for meeting summaries`
- `style: responsive UI with Tailwind`
- `docs: update README and add .env.example`

## 👤 Author

**[Your Name]**
- GitHub: [your-github-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-profile)

---

Built with ❤️ for Katalyst's Founding Engineer position. This project demonstrates production-ready full-stack development with modern web technologies, clean code practices, and thoughtful user experience design.
