import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
          Something went wrong
        </h3>
        <p className="text-red-700 dark:text-red-300 mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
