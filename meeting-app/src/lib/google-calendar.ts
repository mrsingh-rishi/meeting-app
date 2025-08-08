import { google, calendar_v3 } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Session } from 'next-auth'

// Extend the session type locally if not already done
interface ExtendedSession extends Session {
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

export class GoogleCalendarService {
  private static async getOAuth2Client() {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    if (!session.accessToken) {
      throw new Error('No Google access token found. Please sign out and sign in again.')
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )

    oauth2Client.setCredentials({
      access_token: session.accessToken,
    })

    return oauth2Client
  }

  static async getEvents(): Promise<{ upcoming: CalendarEvent[], past: CalendarEvent[] }> {
    try {
      const auth = await this.getOAuth2Client()
      const calendar = google.calendar({ version: 'v3', auth })

      const now = new Date()
      
      // Get upcoming events
      const upcomingResponse = await calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        maxResults: 5,
        singleEvents: true,
        orderBy: 'startTime',
      })

      // Get past events
      const pastResponse = await calendar.events.list({
        calendarId: 'primary',
        timeMax: now.toISOString(),
        maxResults: 5,
        singleEvents: true,
        orderBy: 'startTime',
      })

      const upcoming = (upcomingResponse.data.items || []).map((event) => this.transformEvent(event)).filter((event): event is CalendarEvent => event !== null)
      const past = (pastResponse.data.items || []).map((event) => this.transformEvent(event)).filter((event): event is CalendarEvent => event !== null)

      return { upcoming, past: past.reverse() }
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      throw new Error('Failed to fetch calendar events')
    }
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
      attendees: (event.attendees || []).map((attendee) => attendee.email).filter((email): email is string => Boolean(email)),
      location: event.location || undefined,
    }
  }
}
