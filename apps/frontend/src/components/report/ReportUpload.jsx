import React, { useState } from 'react'
import { AlertCircle, CheckCircle, Upload, X, Loader } from 'lucide-react'

/**
 * ReportUpload Component
 * Drag-drop file upload for medical reports with progress and validation
 * Supports: PDF, images, max 10MB
 */
export default function ReportUpload({ patientId, onUploadComplete }) {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [error, setError] = useState(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

  // Validate files
  const validateFiles = (newFiles) => {
    const errors = []

    newFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only PDF and images allowed.`)
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large. Maximum 10MB.`)
      }
    })

    return errors
  }

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type !== 'dragleave')
  }

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const errors = validateFiles(droppedFiles)

    if (errors.length > 0) {
      setError(errors[0])
      return
    }

    setFiles((prev) => [
      ...prev,
      ...droppedFiles.map((file) => ({
        file,
        id: Math.random().toString(36),
        progress: 0,
        uploaded: false,
      })),
    ])
    setError(null)
  }

  // Handle file input
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const errors = validateFiles(selectedFiles)

    if (errors.length > 0) {
      setError(errors[0])
      return
    }

    setFiles((prev) => [
      ...prev,
      ...selectedFiles.map((file) => ({
        file,
        id: Math.random().toString(36),
        progress: 0,
        uploaded: false,
      })),
    ])
    setError(null)
  }

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('No files selected')
      return
    }

    setUploading(true)

    for (const fileItem of files) {
      try {
        const formData = new FormData()
        formData.append('file', fileItem.file)
        formData.append('patientId', patientId)

        // Simulate file upload with progress
        setUploadProgress((prev) => ({
          ...prev,
          [fileItem.id]: 0,
        }))

        // Simulate progress
        for (let i = 0; i < 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setUploadProgress((prev) => ({
            ...prev,
            [fileItem.id]: i,
          }))
        }

        // Mock API call
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/patients/${patientId}/reports`,
          {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, uploaded: true, progress: 100 } : f
          )
        )

        setUploadProgress((prev) => ({
          ...prev,
          [fileItem.id]: 100,
        }))
      } catch (err) {
        setError(`Failed to upload ${fileItem.file.name}`)
      }
    }

    setUploading(false)

    // Clear successful uploads after 2 seconds
    setTimeout(() => {
      setFiles((prev) => prev.filter((f) => !f.uploaded))
      if (onUploadComplete) {
        onUploadComplete()
      }
    }, 2000)
  }

  // Remove file
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white border-2 border-dashed border-neutral-300 rounded-lg p-8 transition-colors">
        {/* Drag Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`transition-colors ${
            dragActive ? 'bg-medical-50 border-medical-500' : 'hover:bg-neutral-50'
          }`}
        >
          {/* Upload Icon */}
          <div className="flex justify-center mb-4">
            <Upload
              className={`w-12 h-12 ${
                dragActive ? 'text-medical-500' : 'text-neutral-400'
              }`}
            />
          </div>

          {/* Text */}
          <p className="text-center text-body-md font-medium text-neutral-900 mb-2">
            Drag and drop files here
          </p>
          <p className="text-center text-body-sm text-neutral-600 mb-6">
            or click the button below
          </p>

          {/* File Input */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="px-6 py-3 bg-medical-500 text-white rounded-lg font-semibold hover:bg-medical-600 transition-colors inline-block">
                Select Files
              </span>
            </label>
          </div>

          {/* File Restrictions */}
          <p className="text-center text-caption text-neutral-500 mt-4">
            PDF and image files only, up to 10MB per file
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-body-sm text-red-700">{error}</p>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-label font-semibold text-neutral-900">
              Files ({files.length})
            </p>

            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="bg-neutral-50 border border-neutral-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-body-sm font-medium text-neutral-900">
                      {fileItem.file.name}
                    </p>
                    <p className="text-caption text-neutral-600">
                      {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    disabled={uploading}
                    className="p-2 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      fileItem.uploaded ? 'bg-calm-500' : 'bg-medical-500'
                    }`}
                    style={{
                      width: `${uploadProgress[fileItem.id] || 0}%`,
                    }}
                  />
                </div>

                {/* Status */}
                <div className="mt-2 flex items-center gap-2">
                  {fileItem.uploaded ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-calm-500" />
                      <span className="text-caption text-calm-700">Uploaded</span>
                    </>
                  ) : (
                    <span className="text-caption text-neutral-600">
                      {uploadProgress[fileItem.id] || 0}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && !uploading && (
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-medical-500 text-white py-3 rounded-lg font-semibold hover:bg-medical-600 active:bg-medical-700 focus:ring-4 focus:ring-medical-200 transition-colors"
          >
            Upload {files.length} File{files.length !== 1 ? 's' : ''}
          </button>
        )}

        {/* Uploading State */}
        {uploading && (
          <div className="mt-6 flex items-center justify-center gap-3 py-3">
            <Loader className="w-5 h-5 text-medical-500 animate-spin" />
            <span className="text-body-md text-neutral-600">Uploading files...</span>
          </div>
        )}
      </div>
    </div>
  )
}
