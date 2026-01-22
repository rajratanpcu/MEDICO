// UploadProgress.jsx
// Shows file upload progress with visual indicators

import React from 'react'
import { Upload, CheckCircle } from 'lucide-react'

/**
 * UploadProgress Component
 * 
 * Displays:
 * - Progress bar with percentage
 * - File name being uploaded
 * - Upload speed (if available)
 * - Estimated time remaining (if available)
 * 
 * @param {string} fileName - Name of file being uploaded
 * @param {number} progress - Progress percentage (0-100)
 * @param {number} uploadSpeed - Upload speed in bytes/sec (optional)
 * @param {number} timeRemaining - Estimated time remaining in seconds (optional)
 */
const UploadProgress = ({
  fileName,
  progress = 0,
  uploadSpeed = null,
  timeRemaining = null
}) => {
  // Determine progress stage
  const isComplete = progress === 100
  const isStarting = progress < 10

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {isComplete ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <div className="p-2 bg-blue-100 rounded-full">
            <Upload className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">
            {isComplete ? 'Upload Complete' : 'Uploading File'}
          </h3>
          <p className="text-sm text-gray-600">{fileName}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-600">Progress</label>
          <span className="text-sm font-semibold text-gray-900">{progress}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div
            className={`
              h-full rounded-full transition-all duration-300 ease-out
              ${isComplete 
                ? 'bg-green-500 w-full' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }
            `}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Information */}
      <div className="grid grid-cols-2 gap-4">
        {uploadSpeed && (
          <InfoItem 
            label="Upload Speed"
            value={formatUploadSpeed(uploadSpeed)}
          />
        )}
        {timeRemaining && !isComplete && (
          <InfoItem 
            label="Time Remaining"
            value={formatTimeRemaining(timeRemaining)}
          />
        )}
        {isStarting && (
          <InfoItem 
            label="Status"
            value="Preparing upload..."
          />
        )}
        {isComplete && (
          <InfoItem 
            label="Status"
            value="Uploaded successfully"
            highlight="success"
          />
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Keep this window open until upload is complete. 
          {uploadSpeed && ' Do not close the browser.'}
        </p>
      </div>
    </div>
  )
}

/**
 * InfoItem Component
 * Small info display
 */
const InfoItem = ({ label, value, highlight = 'default' }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className={`
      text-sm font-semibold
      ${highlight === 'success' ? 'text-green-600' : 'text-gray-900'}
    `}>
      {value}
    </p>
  </div>
)

/**
 * Format upload speed (bytes/sec) to human-readable format
 */
const formatUploadSpeed = (bytesPerSec) => {
  if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`
  if (bytesPerSec < 1024 * 1024) {
    return `${(bytesPerSec / 1024).toFixed(1)} KB/s`
  }
  return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`
}

/**
 * Format time remaining (seconds) to human-readable format
 */
const formatTimeRemaining = (seconds) => {
  if (seconds < 60) return `${Math.ceil(seconds)}s`
  const minutes = Math.ceil(seconds / 60)
  return `${minutes}m`
}

export default UploadProgress
