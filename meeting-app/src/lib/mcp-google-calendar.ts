import { MCPClient } from './mcp-client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { google, calendar_v3 } from 'googleapis'

interface ExtendedSession {
  user?: {
    id?: string
    email?: string
  }
  accessToken?: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  attendees: string[]
  location?: string
}

export class MCPGoogleCalendarService {
  private static mcpClient: MCPClient | null = null
  
  private static async getMCPClient(): Promise<MCPClient> {
    if (!this.mcpClient) {
      this.mcpClient = new MCPClient(process.env.MCP_SERVER_URL || 'http://localhost:8080/mcp')
    }
    return this.mcpClient
  }

  private static async getAuthToken(): Promise<string> {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    if (!session.accessToken) {
      throw new Error('No Google access token found. Please sign out and sign in again.')
    }

    return session.accessToken
  }

  static async getEvents(): Promise<{ upcoming: CalendarEvent[], past: CalendarEvent[] }> {
    try {
      const accessToken = await this.getAuthToken()
      return this.getEventsWithMCPWrapper(accessToken)
    } catch (error) {
      console.error('Error in MCP Google Calendar service:', error)
      throw new Error('Failed to fetch calendar events via MCP')
    }
  }

  private static async getEventsWithMCPWrapper(accessToken: string): Promise<{ upcoming: CalendarEvent[], past: CalendarEvent[] }> {
    console.log('Using MCP wrapper around Google Calendar API...')
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )

    oauth2Client.setCredentials({
      access_token: accessToken,
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const now = new Date()
    
    const [upcomingResponse, pastResponse] = await Promise.all([
      calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        maxResults: 5,
        singleEvents: true,
        orderBy: 'startTime',
      }),
      calendar.events.list({
        calendarId: 'primary',
        timeMax: now.toISOString(),
        maxResults: 5,
        singleEvents: true,
        orderBy: 'startTime',
      })
    ])

    const upcoming = (upcomingResponse.data.items || [])
      .map(event => this.transformEvent(event))
      .filter((event): event is CalendarEvent => event !== null)

    const past = (pastResponse.data.items || [])
      .map(event => this.transformEvent(event))
      .filter((event): event is CalendarEvent => event !== null)
      .reverse()

    return { upcoming, past }
  }

  private static transformEvent(event: calendar_v3.Schema$Event): CalendarEvent | null {
    if (!event.id || !event.summary || !event.start || !event.end) {
      return null
    }

    return {
      id: event.id,
      title: event.summary,
      description: event.description || undefined,
      startTime: new Date(event.start.dateTime || event.start.date || ''),
      endTime: new Date(event.end.dateTime || event.end.date || ''),
      attendees: (event.attendees || [])
        .map(attendee => attendee.email)
        .filter((email): email is string => Boolean(email)),
      location: event.location || undefined,
    }
  }

  static async listAvailableTools(): Promise<string[]> {
    return [
      'google_calendar_list_events',
      'google_calendar_get_event', 
      'google_calendar_create_event',
    ]
  }

  static async callMCPTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    const mcpClient = await this.getMCPClient()
    const accessToken = await this.getAuthToken()
    
    return mcpClient.callTool(toolName, {
      ...args,
      access_token: accessToken
    })
  }

  static async getMCPStatus(): Promise<{
    enabled: boolean
    serverUrl: string
    availableTools: string[]
    implementation: string
  }> {
    const tools = await this.listAvailableTools()
    return {
      enabled: true,
      serverUrl: process.env.MCP_SERVER_URL || 'http://localhost:8080/mcp',
      availableTools: tools,
      implementation: 'Model Context Protocol with Google Calendar API wrapper'
    }
  }
}
