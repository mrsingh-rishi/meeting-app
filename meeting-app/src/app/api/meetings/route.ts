import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MCPGoogleCalendarService, type CalendarEvent as MCPCalendarEvent } from '@/lib/mcp-google-calendar'
import { OpenAIService } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch events from Google Calendar via MCP
    const { upcoming, past } = await MCPGoogleCalendarService.getEvents()

    // Store meetings in database and generate summaries for past meetings
    const upcomingMeetings = await Promise.all(
      upcoming.map(async (event: MCPCalendarEvent) => {
        const meeting = await upsertMeeting(event, session.user.id || session.user.email!)
        return {
          ...meeting,
          duration: calculateDuration(meeting.startTime, meeting.endTime),
          summary: null
        }
      })
    )

    const pastMeetings = await Promise.all(
      past.map(async (event: MCPCalendarEvent) => {
        const meeting = await upsertMeeting(event, session.user.id || session.user.email!)
        
        // Check if we already have a summary
        let existingSummary = await prisma.summary.findFirst({
          where: { meetingId: meeting.id }
        })

        if (!existingSummary) {
          // Generate AI summary for past meetings
          const summaryContent = await OpenAIService.generateMeetingSummary(
            meeting.title,
            meeting.description || undefined,
            meeting.attendees
          )

          existingSummary = await prisma.summary.create({
            data: {
              content: summaryContent,
              meetingId: meeting.id,
            }
          })
        }

        return {
          ...meeting,
          duration: calculateDuration(meeting.startTime, meeting.endTime),
          summary: existingSummary.content
        }
      })
    )

    return NextResponse.json({
      upcoming: upcomingMeetings,
      past: pastMeetings,
    })

  } catch (error) {
    console.log(error);
    console.error('Error fetching meetings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetings' }, 
      { status: 500 }
    )
  }
}

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  attendees: string[]
  location?: string
}

async function upsertMeeting(event: CalendarEvent, userId: string) {
  return await prisma.meeting.upsert({
    where: { googleId: event.id },
    update: {
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      attendees: event.attendees,
      location: event.location,
    },
    create: {
      googleId: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      attendees: event.attendees,
      location: event.location,
      userId,
    },
  })
}

function calculateDuration(start: Date, end: Date): string {
  const durationMs = end.getTime() - start.getTime()
  const minutes = Math.floor(durationMs / (1000 * 60))
  
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}
