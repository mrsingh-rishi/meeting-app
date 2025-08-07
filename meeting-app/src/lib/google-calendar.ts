import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    })

    if (!account?.access_token) {
      throw new Error('No Google access token found')
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
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

      const upcoming = (upcomingResponse.data.items || []).map(this.transformEvent).filter(Boolean) as CalendarEvent[]
      const past = (pastResponse.data.items || []).map(this.transformEvent).filter(Boolean) as CalendarEvent[]

      return { upcoming, past: past.reverse() }
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      throw new Error('Failed to fetch calendar events')
    }
  }

  private static transformEvent(event: any): CalendarEvent | null {
    if (!event.id || !event.summary || !event.start || !event.end) {
      return null
    }

    return {
      id: event.id,
      title: event.summary,
      description: event.description || undefined,
      startTime: new Date(event.start.dateTime || event.start.date),
      endTime: new Date(event.end.dateTime || event.end.date),
      attendees: (event.attendees || []).map((attendee: any) => attendee.email).filter(Boolean),
      location: event.location || undefined,
    }
  }
}
