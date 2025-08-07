import { format } from 'date-fns'
import { Calendar, Clock, Users, MapPin, FileText } from 'lucide-react'

interface MeetingCardProps {
  meeting: {
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
  isPast?: boolean
}

export default function MeetingCard({ meeting, isPast = false }: MeetingCardProps) {
  const {
    title,
    description,
    startTime,
    attendees,
    location,
    duration,
    summary
  } = meeting

  const formatTime = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy • h:mm a')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {formatTime(startTime)}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            {duration}
          </div>
        </div>
        {isPast && (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
            Past
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="mb-4">
          <div className="flex items-start">
            <FileText className="h-4 w-4 mr-2 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {description}
            </p>
          </div>
        </div>
      )}

      {/* Location */}
      {location && (
        <div className="mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {location}
            </p>
          </div>
        </div>
      )}

      {/* Attendees */}
      {attendees.length > 0 && (
        <div className="mb-4">
          <div className="flex items-start">
            <Users className="h-4 w-4 mr-2 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {attendees.slice(0, 3).map((attendee, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {attendee.split('@')[0]}
                </span>
              ))}
              {attendees.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  +{attendees.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Summary for past meetings */}
      {isPast && summary && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                AI Summary
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
