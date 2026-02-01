// FileDropZone.jsx
// Drag-and-drop file input with visual feedback

import React, { useRef, useState } from 'react'
import { Upload, FileText, Image } from 'lucide-react'

/**
 * FileDropZone Component
 * 
 * Provides drag-and-drop interface for file selection
 * Accepts PDF and image files (JPG, PNG)
 * Shows visual feedback for drag state
 * 
 * @param {Function} onFileSelect - Callback when file is selected
 * @param {File} selectedFile - Currently selected file (for visual state)
 */
const FileDropZone = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  /**
   * Handle drag over - show visual feedback
   */
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  /**
   * Handle drag leave
   */
  const handleDragLeave = () => {
    setIsDragging(false)
  }

  /**
   * Handle drop - extract file from event
   */
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  /**
   * Trigger file input click
   */
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload medical report"
      />

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-102' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${selectedFile ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {/* Upload Icon */}
        <div className="flex justify-center mb-4">
          <div className={`
            p-3 rounded-full transition-colors
            ${isDragging ? 'bg-blue-100' : 'bg-gray-200'}
          `}>
            <Upload className={`
              w-8 h-8
              ${isDragging ? 'text-blue-600' : 'text-gray-600'}
            `} />
          </div>
        </div>

        {/* Text Content */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            {isDragging ? 'Drop your file here' : 'Upload Medical Report'}
          </h3>
          <p className="text-sm text-gray-600">
            Drag and drop your PDF or image file, or click to browse
          </p>
        </div>

        {/* Supported Formats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium mb-3">Supported Formats</p>
          <div className="flex justify-center gap-4">
            <FileFormat icon={FileText} label="PDF" />
            <FileFormat icon={Image} label="JPG/PNG" />
          </div>
        </div>

        {/* File Size Info */}
        <p className="text-xs text-gray-400 mt-4">
          Maximum file size: 10 MB
        </p>
      </div>
    </div>
  )
}

/**
 * FileFormat Badge Component
 */
const FileFormat = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1 text-xs text-gray-600">
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </div>
)

export default FileDropZone
