'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Calendar, LogOut, User, Sparkles } from 'lucide-react'
import MeetingCard from '@/components/MeetingCard'
import Loading from '@/components/Loading'
import ErrorMessage from '@/components/ErrorMessage'

interface Meeting {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  attendees: string[]
  location?: string
  duration: string
  summary?: string
}

interface MeetingsData {
  upcoming: Meeting[]
  past: Meeting[]
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [meetings, setMeetings] = useState<MeetingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMeetings = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/meetings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch meetings')
      }
      
      const data = await response.json()
      
      // Parse dates from strings
      const parsedData: MeetingsData = {
        upcoming: data.upcoming.map((meeting: any) => ({
          ...meeting,
          startTime: new Date(meeting.startTime),
          endTime: new Date(meeting.endTime),
        })),
        past: data.past.map((meeting: any) => ({
          ...meeting,
          startTime: new Date(meeting.startTime),
          endTime: new Date(meeting.endTime),
        })),
      }
      
      setMeetings(parsedData)
    } catch (err) {
      console.error('Error fetching meetings:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchMeetings()
    }
  }, [session])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={fetchMeetings}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Meeting Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {session?.user?.name || 'User'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>{session?.user?.email}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upcoming Meetings
          </h2>
          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
            {meetings?.upcoming.length || 0}
          </span>
        </div>
        
        {meetings?.upcoming.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No upcoming meetings
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your calendar is clear for the next few days.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {meetings?.upcoming.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </div>

      {/* Past Meetings */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Past Meetings
          </h2>
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
            {meetings?.past.length || 0}
          </span>
          {meetings?.past.some(m => m.summary) && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3 w-3" />
              <span>AI Summaries</span>
            </div>
          )}
        </div>
        
        {meetings?.past.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No past meetings
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your recent meetings will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {meetings?.past.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} isPast />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
