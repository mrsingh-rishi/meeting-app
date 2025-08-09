# Meeting Collaboration Platform - MCP Integration

This project implements a **Meeting Collaboration Platform** using **Model Context Protocol (MCP)** for Google Calendar integration, built for the Katalyst Founding Engineer assessment.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth (JWT sessions)
- **Calendar Integration**: Model Context Protocol (MCP) with Google Calendar API
- **AI Integration**: OpenAI for meeting summaries
- **Database**: PostgreSQL with Prisma ORM (deployed on Neon)
- **Deployment**: Vercel

### MCP Implementation

The application uses **Model Context Protocol (MCP)** for Google Calendar integration:

#### 1. MCP Client (`src/lib/mcp-client.ts`)
- Implements JSON-RPC 2.0 protocol for MCP communication
- Handles tool initialization and execution
- Provides type-safe interfaces for MCP requests/responses

#### 2. MCP Google Calendar Service (`src/lib/mcp-google-calendar.ts`)
- **Primary Mode**: Direct MCP server communication
- **Fallback Mode**: MCP wrapper around Google Calendar API
- Implements MCP tools:
  - `google_calendar_list_events`
  - `google_calendar_get_event`
  - `google_calendar_create_event`

#### 3. MCP API Endpoint (`/api/mcp`)
- Exposes MCP status and available tools
- Allows direct MCP tool invocation
- Returns integration health information

## 🚀 Features

### Core Functionality
- **OAuth Authentication**: Secure Google OAuth with proper calendar scopes
- **MCP Calendar Integration**: Fetches calendar events via Model Context Protocol
- **AI-Powered Summaries**: Generates meeting summaries using OpenAI
- **Real-time Dashboard**: Shows upcoming and past meetings with insights
- **Responsive Design**: Works on desktop and mobile devices

### MCP-Specific Features
- **Protocol Compliance**: Follows MCP specification (2024-11-05)
- **Tool Discovery**: Lists available MCP tools dynamically
- **Fallback Handling**: Graceful degradation when MCP server is unavailable
- **Status Monitoring**: Real-time MCP integration health checks

## 🔧 Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Database
DATABASE_URL="your-postgresql-connection-string"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# MCP Server (optional - defaults to fallback mode)
MCP_SERVER_URL="http://localhost:8080/mcp"
```

## 📊 MCP Integration Details

### Protocol Flow
1. **Initialization**: MCP client connects to server with protocol version
2. **Tool Discovery**: Lists available calendar tools
3. **Authentication**: Passes Google OAuth tokens to MCP tools
4. **Execution**: Invokes calendar operations via MCP protocol
5. **Response Processing**: Transforms MCP responses to application format

### Fallback Strategy
When MCP server is unavailable:
- Wraps Google Calendar API calls in MCP-compatible format
- Maintains same interface and logging
- Provides seamless user experience
- Reports status via `/api/mcp` endpoint

## 🧪 Testing MCP Integration

### Check MCP Status
```bash
curl http://localhost:3000/api/mcp
```

### Response Example
```json
{
  "mcpIntegration": {
    "enabled": true,
    "serverUrl": "http://localhost:8080/mcp",
    "availableTools": [
      "google_calendar_list_events",
      "google_calendar_get_event",
      "google_calendar_create_event"
    ],
    "implementation": "Model Context Protocol with Google Calendar API wrapper",
    "message": "Model Context Protocol integration for Google Calendar"
  }
}
```

## 🚀 Deployment

The application is configured for automatic deployment on Vercel:

1. **Database**: PostgreSQL on Neon (persistent)
2. **Environment**: All variables configured in Vercel
3. **Build**: Optimized production build with MCP integration
4. **Monitoring**: Built-in health checks for MCP connectivity

## 📝 MCP Protocol Compliance

- **JSON-RPC 2.0**: Full compliance with MCP protocol specification
- **Tool Management**: Dynamic tool discovery and execution
- **Error Handling**: Proper MCP error responses and fallback mechanisms
- **Authentication**: Secure token passing to MCP tools
- **Logging**: Comprehensive MCP operation logging

## 🔄 Development Workflow

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
git push origin main
```

---

**Note**: This implementation demonstrates both direct MCP integration and intelligent fallback mechanisms, ensuring robust calendar functionality regardless of MCP server availability while maintaining protocol compliance.
