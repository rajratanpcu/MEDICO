// ReportUploader.jsx
// Main component for medical report upload and AI analysis

import React, { useState, useCallback } from 'react'
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import FileDropZone from './FileDropZone'
import UploadProgress from './UploadProgress'
import AnalysisResults from './AnalysisResults'
import { validateMedicalFile, formatFileSize } from '../utils/fileValidation'
import { useFileUpload } from '../hooks/useFileUpload'
import { useAIAnalysis } from '../hooks/useAIAnalysis'

/**
 * ReportUploader Component
 * 
 * Manages complete workflow:
 * 1. File selection/validation
 * 2. Upload with progress
 * 3. AI analysis with loading state
 * 4. Results display with interpretation
 * 
 * @component
 */
const ReportUploader = ({ patientId, onAnalysisComplete }) => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [stage, setStage] = useState('select') // select | uploading | analyzing | results
  
  // Custom hooks for file upload and AI analysis
  const { uploadFile, progress, uploadError: uploadErr } = useFileUpload()
  const { analyzeReport, analysisResult, isLoading, error: analysisError } = useAIAnalysis()

  /**
   * Handle file selection from drop zone or input
   * Validates file type and size before selection
   */
  const handleFileSelect = useCallback((file) => {
    setUploadError(null)
    
    // Validate file
    const validation = validateMedicalFile(file)
    if (!validation.isValid) {
      setUploadError(validation.error)
      return
    }

    setSelectedFile(file)
    setStage('select')
  }, [])

  /**
   * Handle upload initiation
   * Uploads file and triggers analysis on success
   */
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    setStage('uploading')
    setUploadError(null)

    try {
      // Upload file to backend
      const uploadResponse = await uploadFile(selectedFile, patientId)
      
      if (!uploadResponse.success) {
        setUploadError(uploadResponse.error || 'Upload failed')
        setStage('select')
        return
      }

      // Move to analysis stage
      setStage('analyzing')

      // Trigger AI analysis with uploaded file
      const result = await analyzeReport({
        fileId: uploadResponse.fileId,
        reportType: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
        fileName: selectedFile.name
      })

      if (result.success) {
        setStage('results')
        onAnalysisComplete?.(result)
      } else {
        setUploadError(result.error || 'Analysis failed')
        setStage('select')
      }
    } catch (err) {
      setUploadError(err.message || 'An error occurred')
      setStage('select')
    }
  }, [selectedFile, uploadFile, analyzeReport, patientId, onAnalysisComplete])

  /**
   * Reset uploader to initial state
   */
  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setUploadError(null)
    setStage('select')
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Medical Report Analysis</h2>
        <p className="text-gray-600 mt-1">
          Upload a medical report for AI-powered analysis and insights
        </p>
      </div>

      {/* Error Alert */}
      {(uploadError || uploadErr || analysisError) && (
        <ErrorAlert 
          message={uploadError || uploadErr || analysisError}
          onDismiss={() => setUploadError(null)}
        />
      )}

      {/* Stage: File Selection */}
      {stage === 'select' && (
        <div className="space-y-4">
          <FileDropZone 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />

          {selectedFile && (
            <SelectedFileCard 
              file={selectedFile}
              onRemove={() => setSelectedFile(null)}
              onUpload={handleUpload}
            />
          )}
        </div>
      )}

      {/* Stage: Uploading */}
      {stage === 'uploading' && (
        <UploadProgress 
          fileName={selectedFile?.name}
          progress={progress}
        />
      )}

      {/* Stage: Analyzing */}
      {stage === 'analyzing' && (
        <AnalyzingState fileName={selectedFile?.name} />
      )}

      {/* Stage: Results */}
      {stage === 'results' && analysisResult && (
        <div className="space-y-4">
          <AnalysisResults result={analysisResult} />
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Upload Another Report
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * SelectedFileCard Component
 * Shows selected file info with upload button
 */
const SelectedFileCard = ({ file, onRemove, onUpload }) => (
  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium text-gray-900">{file.name}</span>
        </div>
        <p className="text-sm text-gray-600">
          Size: {formatFileSize(file.size)} • Type: {file.type.split('/')[1].toUpperCase()}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
      >
        Remove
      </button>
    </div>
    
    <button
      onClick={onUpload}
      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
    >
      Analyze Report
    </button>
  </div>
)

/**
 * ErrorAlert Component
 */
const ErrorAlert = ({ message, onDismiss }) => (
  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h3 className="font-medium text-red-900">Error</h3>
      <p className="text-sm text-red-700 mt-1">{message}</p>
    </div>
    <button
      onClick={onDismiss}
      className="text-red-600 hover:text-red-700 text-xl font-bold"
    >
      ×
    </button>
  </div>
)

/**
 * AnalyzingState Component
 * Shows loading animation during AI analysis
 */
const AnalyzingState = ({ fileName }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Report</h3>
    <p className="text-gray-600">
      {fileName && `Analyzing "${fileName}"...`}
    </p>
    <p className="text-sm text-gray-500 mt-2">This usually takes 10-30 seconds</p>
  </div>
)

export default ReportUploader
