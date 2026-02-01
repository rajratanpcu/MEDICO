// MEDICAL REPORT UPLOAD - INTEGRATION GUIDE
// Complete example of using all AI components together

/**
 * COMPONENT HIERARCHY
 * 
 * ReportUploader (Main Component)
 * ├── FileDropZone (File Selection)
 * ├── SelectedFileCard (Selected File Preview)
 * ├── UploadProgress (Upload Progress Bar)
 * ├── AnalyzingState (Loading Spinner)
 * └── AnalysisResults (Results Display)
 *     └── AbnormalValueHighlight (Individual Abnormal Values)
 */

// ============================================================================
// EXAMPLE 1: Basic Usage in a Page Component
// ============================================================================

import React from 'react'
import ReportUploader from '@/components/ai/ReportUploader'

export function PatientReportPage() {
  const patientId = '123e4567-e89b-12d3-a456-426614174000' // UUID from auth

  const handleAnalysisComplete = (result) => {
    console.log('Analysis complete:', result)
    // Save results to database
    // Send notification to doctor
    // Show success message
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Upload Medical Report</h1>
      <p className="text-gray-600 mb-6">
        Upload your medical report (PDF or image) for AI analysis
      </p>

      <ReportUploader 
        patientId={patientId}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: Custom Integration with Error Handling
// ============================================================================

import { ReportUploader } from '@/components/ai'
import { useNotification } from '@/hooks/useNotification'
import { usePatientContext } from '@/context/PatientContext'

export function ClinicianDashboard() {
  const { patient } = usePatientContext()
  const { showNotification } = useNotification()

  const handleAnalysisComplete = (result) => {
    // Show success notification
    showNotification({
      type: 'success',
      title: 'Analysis Complete',
      message: `Found ${result.abnormalValues.length} abnormal values`,
      duration: 5000
    })

    // Log to analytics
    analytics.track('report_analyzed', {
      patientId: patient.id,
      abnormalCount: result.abnormalValues.length,
      confidence: result.confidence
    })

    // Sync with backend
    saveAnalysisResults(patient.id, result)
  }

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <ReportUploader 
        patientId={patient.id}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 3: Using Custom Hooks Directly (Advanced)
// ============================================================================

import { useFileUpload } from '@/hooks/useFileUpload'
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import FileDropZone from '@/components/ai/FileDropZone'
import UploadProgress from '@/components/ai/UploadProgress'
import AnalysisResults from '@/components/ai/AnalysisResults'

export function CustomReportAnalyzer() {
  const { uploadFile, progress, uploadError } = useFileUpload()
  const { analyzeReport, analysisResult, isLoading } = useAIAnalysis()
  const [selectedFile, setSelectedFile] = React.useState(null)
  const [stage, setStage] = React.useState('select') // 'select'|'uploading'|'analyzing'|'results'

  const handleFileSelect = (file) => {
    // Validate (optional - ReportUploader does this)
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    try {
      setStage('uploading')
      const uploadResult = await uploadFile(selectedFile, 'patient-123')
      
      // Trigger analysis
      setStage('analyzing')
      await analyzeReport(uploadResult.fileId, {
        patientId: 'patient-123'
      })
      
      setStage('results')
    } catch (error) {
      console.error('Error:', error)
      setStage('select')
    }
  }

  return (
    <div className="space-y-6">
      {stage === 'select' && (
        <FileDropZone 
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
      )}

      {stage === 'uploading' && (
        <UploadProgress 
          fileName={selectedFile.name}
          progress={progress}
        />
      )}

      {stage === 'analyzing' && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600">Analyzing your report...</p>
          <p className="text-sm text-gray-500 mt-2">This typically takes 10-30 seconds</p>
        </div>
      )}

      {stage === 'results' && analysisResult && (
        <AnalysisResults result={analysisResult} />
      )}
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: File Validation Integration
// ============================================================================

import { validateMedicalFile, formatFileSize } from '@/utils/fileValidation'

export function FileUploadWithValidation() {
  const [error, setError] = React.useState(null)

  const handleFileSelect = (file) => {
    const validation = validateMedicalFile(file)
    
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    setError(null)
    // Proceed with upload
    console.log(`Uploading ${file.name} (${formatFileSize(file.size)})`)
  }

  return (
    <div>
      <FileDropZone onFileSelect={handleFileSelect} />
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXAMPLE 5: Displaying Analysis Results
// ============================================================================

import AnalysisResults from '@/components/ai/AnalysisResults'

// Sample analysis result structure
const sampleResult = {
  summary: 'Your blood test shows generally normal results with a few values requiring attention.',
  confidence: 92,
  
  abnormalValues: [
    {
      testName: 'Glucose',
      result: 145,
      unit: 'mg/dL',
      referenceRange: { min: 70, max: 100 },
      severity: 'warning',
      direction: 'high',
      interpretation: 'Your blood sugar is higher than normal, which may indicate diabetes risk',
      recommendation: 'Contact your doctor to discuss diet modifications and possible testing for diabetes'
    },
    {
      testName: 'Cholesterol',
      result: 250,
      unit: 'mg/dL',
      referenceRange: { min: 0, max: 200 },
      severity: 'warning',
      direction: 'high',
      interpretation: 'Your cholesterol level is elevated, increasing risk for heart disease',
      recommendation: 'Reduce saturated fats, increase exercise, and schedule a follow-up appointment'
    }
  ],
  
  findings: [
    {
      title: 'Elevated Fasting Glucose',
      description: 'Blood sugar level is above normal range',
      details: 'Consider dietary changes and increased physical activity. Your doctor may recommend glucose tolerance testing.',
      severity: 'warning',
      trend: 'worsening'
    },
    {
      title: 'Borderline High Cholesterol',
      description: 'Total cholesterol exceeds recommended levels',
      details: 'Focus on heart-healthy foods, regular exercise, and weight management.',
      severity: 'warning',
      trend: null
    }
  ],
  
  recommendations: [
    'Schedule an appointment with your doctor within the next 2 weeks',
    'Increase daily physical activity to at least 30 minutes of moderate exercise',
    'Reduce sugar and saturated fat intake in your diet',
    'Monitor your weight and aim for a healthy BMI',
    'Avoid smoking and limit alcohol consumption'
  ]
}

export function ResultsExample() {
  return <AnalysisResults result={sampleResult} />
}

// ============================================================================
// EXAMPLE 6: Integration with React Query (Server State)
// ============================================================================

import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'

export function ReportAnalysisWithQuery() {
  // Upload report mutation
  const uploadReportMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post('/reports/upload', formData)
      return response.data
    }
  })

  // Analyze report mutation
  const analyzeReportMutation = useMutation({
    mutationFn: async (fileId) => {
      const response = await apiClient.post('/ai/analyze-report', { fileId })
      return response.data
    }
  })

  const handleAnalyze = async (file) => {
    try {
      const uploadResult = await uploadReportMutation.mutateAsync(file)
      await analyzeReportMutation.mutateAsync(uploadResult.fileId)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  return (
    <div>
      <button 
        onClick={() => handleAnalyze(file)}
        disabled={uploadReportMutation.isPending || analyzeReportMutation.isPending}
      >
        {uploadReportMutation.isPending && 'Uploading...'}
        {analyzeReportMutation.isPending && 'Analyzing...'}
        {!uploadReportMutation.isPending && !analyzeReportMutation.isPending && 'Analyze Report'}
      </button>
    </div>
  )
}

// ============================================================================
// EXPECTED API RESPONSES
// ============================================================================

/**
 * POST /api/reports/upload
 * 
 * Request:
 *   - Method: POST
 *   - Headers: Authorization: Bearer <token>, Content-Type: multipart/form-data
 *   - Body: FormData with 'file' and 'patientId'
 * 
 * Response (200 OK):
 * {
 *   "fileId": "550e8400-e29b-41d4-a716-446655440000",
 *   "fileName": "blood_test.pdf",
 *   "fileSize": 245821,
 *   "fileType": "application/pdf",
 *   "uploadedAt": "2024-01-15T10:30:00Z",
 *   "patientId": "123e4567-e89b-12d3-a456-426614174000"
 * }
 * 
 * Errors:
 *   400: Invalid file type or size
 *   401: Unauthorized (missing/invalid token)
 *   413: File too large
 */

/**
 * POST /api/ai/analyze-report
 * 
 * Request:
 * {
 *   "fileId": "550e8400-e29b-41d4-a716-446655440000",
 *   "patientId": "123e4567-e89b-12d3-a456-426614174000" (optional),
 *   "reportType": "blood-test" (optional)
 * }
 * 
 * Response (200 OK):
 * {
 *   "summary": "Your test results show...",
 *   "confidence": 92,
 *   "abnormal_values": [
 *     {
 *       "test_name": "Glucose",
 *       "result": "145",
 *       "unit": "mg/dL",
 *       "reference_range": { "min": "70", "max": "100" },
 *       "direction": "high"
 *     }
 *   ],
 *   "findings": [...],
 *   "recommendations": [...]
 * }
 * 
 * Errors:
 *   400: Invalid file ID
 *   408: Analysis timeout (usually > 60 seconds)
 *   500: AI service error
 */

// ============================================================================
// STYLING & CUSTOMIZATION
// ============================================================================

/**
 * Color Scheme (TailwindCSS):
 * - Primary: blue-600 (upload, active states)
 * - Success: green-500 (complete, normal values)
 * - Warning: amber-500 (warnings, caution values)
 * - Critical: red-600 (errors, critical values)
 * - Neutral: gray-500 (text, borders)
 * 
 * Spacing:
 * - Cards: p-6 (padding-6)
 * - Sections: space-y-6 (margin-bottom)
 * - Icons: w-6 h-6 (24x24px)
 * 
 * Typography:
 * - Headers: font-semibold text-gray-900
 * - Body: text-gray-700
 * - Secondary: text-gray-600
 * - Captions: text-xs text-gray-500
 * 
 * Animations:
 * - Progress bar: transition-all duration-300
 * - Drag state: scale-up, color change
 * - Loading: animate-spin (Lucide icons)
 */

// ============================================================================
// ACCESSIBILITY FEATURES
// ============================================================================

/**
 * WCAG 2.1 AA Compliance:
 * - FileDropZone: aria-label on hidden input, keyboard support
 * - UploadProgress: aria-live for progress updates
 * - AnalysisResults: Semantic HTML (h1-h4), proper color contrast
 * - AbnormalValueHighlight: Color + icons for color-blind users
 * - All buttons: Keyboard focusable, visible focus state
 * - All interactions: Keyboard accessible (Enter, Space)
 */

// ============================================================================
// ERROR HANDLING GUIDE
// ============================================================================

/**
 * Common Errors & Solutions:
 * 
 * 1. File Size Error
 *    - Message: "File size exceeds 10MB limit"
 *    - Solution: Compress PDF or image, use lower resolution
 * 
 * 2. File Type Error
 *    - Message: "Invalid file type. Please upload PDF, JPG, or PNG"
 *    - Solution: Convert file to supported format
 * 
 * 3. Network Error
 *    - Message: "Upload failed. Please check your connection"
 *    - Solution: Check internet connection, retry upload
 * 
 * 4. Analysis Timeout
 *    - Message: "Analysis timed out. Please try again"
 *    - Solution: Large files may take longer, wait or try smaller file
 * 
 * 5. Authentication Error
 *    - Message: "Unauthorized - Please log in again"
 *    - Solution: Token expired, user needs to re-authenticate
 * 
 * 6. AI Service Error
 *    - Message: "Analysis failed. Server error"
 *    - Solution: AI service temporarily unavailable, retry later
 */

export {}
