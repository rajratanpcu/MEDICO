// SymptomChecker.jsx
// Main component for symptom checking and disease prediction

import React, { useState, useCallback } from 'react'
import { AlertCircle, CheckCircle2, Info, Loader, XCircle } from 'lucide-react'
import SymptomSelector from './SymptomSelector'
import DiseaseResults from './DiseaseResults'
import { useSymptomChecker } from '@/hooks/useSymptomChecker'

/**
 * SymptomChecker Component
 * 
 * Main orchestrator for symptom checking workflow:
 * 1. Symptom selection
 * 2. Form validation
 * 3. API submission
 * 4. Results display
 * 
 * @param {Object} props
 * @param {string} props.userId - Current user ID
 * @param {function} props.onResultsSubmitted - Callback when results saved
 */
const SymptomChecker = ({ userId, onResultsSubmitted }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [submissionError, setSubmissionError] = useState(null)
  const [stage, setStage] = useState('input') // input | submitting | results | error

  const { checkSymptoms, predictions, isLoading, error, reset } = useSymptomChecker()

  /**
   * Handle symptom toggle (select/deselect)
   */
  const handleSymptomToggle = useCallback((symptom) => {
    setSelectedSymptoms((prev) => {
      const isSelected = prev.some((s) => s.id === symptom.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== symptom.id)
      } else {
        return [...prev, symptom]
      }
    })
  }, [])

  /**
   * Validate selected symptoms
   */
  const validateSymptoms = useCallback(() => {
    if (selectedSymptoms.length === 0) {
      setSubmissionError('Please select at least one symptom')
      return false
    }

    if (selectedSymptoms.length > 10) {
      setSubmissionError('Please select a maximum of 10 symptoms')
      return false
    }

    return true
  }, [selectedSymptoms])

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setSubmissionError(null)

    if (!validateSymptoms()) {
      setStage('input')
      return
    }

    try {
      setStage('submitting')

      const result = await checkSymptoms(
        selectedSymptoms.map((s) => s.id),
        { userId }
      )

      if (result && result.predictions) {
        setStage('results')
      } else {
        setSubmissionError('No predictions returned from server')
        setStage('error')
      }
    } catch (err) {
      setSubmissionError(err.message || 'Failed to check symptoms')
      setStage('error')
    }
  }, [selectedSymptoms, validateSymptoms, checkSymptoms, userId])

  /**
   * Handle reset to start over
   */
  const handleReset = useCallback(() => {
    setSelectedSymptoms([])
    setSubmissionError(null)
    setStage('input')
    reset()
  }, [reset])

  /**
   * Save results and callback
   */
  const handleSaveResults = useCallback(async () => {
    if (onResultsSubmitted) {
      await onResultsSubmitted({
        symptoms: selectedSymptoms,
        predictions: predictions,
        timestamp: new Date().toISOString()
      })
    }
    handleReset()
  }, [selectedSymptoms, predictions, onResultsSubmitted, handleReset])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Symptom Checker
          </h1>
          <p className="text-lg text-gray-600">
            Describe your symptoms to get health insights
          </p>
        </div>

        {/* Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {stage === 'input' && (
            <InputStage
              selectedSymptoms={selectedSymptoms}
              onSymptomToggle={handleSymptomToggle}
              onSubmit={handleSubmit}
              submissionError={submissionError}
            />
          )}

          {stage === 'submitting' && <SubmittingStage />}

          {stage === 'results' && (
            <ResultsStage
              predictions={predictions}
              selectedSymptoms={selectedSymptoms}
              onReset={handleReset}
              onSaveResults={handleSaveResults}
            />
          )}

          {stage === 'error' && (
            <ErrorStage
              error={submissionError || error}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer Information */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <InfoBox
            icon={<Info className="w-5 h-5" />}
            title="Accurate Input"
            description="Be as detailed as possible when describing your symptoms"
          />
          <InfoBox
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Instant Results"
            description="Get health insights based on your symptoms"
          />
          <InfoBox
            icon={<AlertCircle className="w-5 h-5" />}
            title="Medical Advice"
            description="Always consult a healthcare professional for diagnosis"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * DisclaimerBanner Component
 * Medical disclaimer shown at top
 */
const DisclaimerBanner = () => (
  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-semibold text-amber-900 mb-1">Medical Disclaimer</p>
      <p className="text-sm text-amber-800">
        This Symptom Checker provides general health information and is not a
        substitute for professional medical advice, diagnosis, or treatment.
        Always consult with a qualified healthcare provider for medical concerns.
        In case of emergencies, call 911 or visit an emergency room immediately.
      </p>
    </div>
  </div>
)

/**
 * InputStage Component
 * Symptom selection and submission form
 */
const InputStage = ({
  selectedSymptoms,
  onSymptomToggle,
  onSubmit,
  submissionError
}) => (
  <div className="p-8">
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Symptom Selector */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Select Your Symptoms
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Choose all symptoms you're currently experiencing (1-10 symptoms)
        </p>
        <SymptomSelector
          selectedSymptoms={selectedSymptoms}
          onSymptomToggle={onSymptomToggle}
        />
      </div>

      {/* Error Alert */}
      {submissionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{submissionError}</p>
        </div>
      )}

      {/* Selected Symptoms Summary */}
      {selectedSymptoms.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Selected Symptoms ({selectedSymptoms.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom.id}
                className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm"
              >
                {symptom.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={selectedSymptoms.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
          selectedSymptoms.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        Check Symptoms
      </button>
    </form>
  </div>
)

/**
 * SubmittingStage Component
 * Loading state during API call
 */
const SubmittingStage = () => (
  <div className="p-12 flex flex-col items-center justify-center min-h-96">
    <div className="mb-4">
      <Loader className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Analyzing Your Symptoms
    </h3>
    <p className="text-gray-600 text-center max-w-sm">
      Our AI is reviewing your symptoms and checking against our medical database.
      This typically takes 5-10 seconds.
    </p>
  </div>
)

/**
 * ResultsStage Component
 * Display predicted diseases
 */
const ResultsStage = ({
  predictions,
  selectedSymptoms,
  onReset,
  onSaveResults
}) => (
  <div className="p-8 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Health Insights Based on Your Symptoms
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Based on your {selectedSymptoms.length} selected symptom
          {selectedSymptoms.length !== 1 ? 's' : ''}
        </p>
      </div>
      <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
    </div>

    {/* Results */}
    <DiseaseResults predictions={predictions} />

    {/* Action Buttons */}
    <div className="flex gap-4 pt-4 border-t">
      <button
        onClick={onReset}
        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Check Different Symptoms
      </button>
      <button
        onClick={onSaveResults}
        className="flex-1 py-3 px-4 bg-green-600 rounded-lg font-semibold text-white hover:bg-green-700 transition-colors"
      >
        Save Results
      </button>
    </div>
  </div>
)

/**
 * ErrorStage Component
 * Error display
 */
const ErrorStage = ({ error, onReset }) => (
  <div className="p-8">
    <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-red-900 mb-1">Something Went Wrong</h3>
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    </div>

    <button
      onClick={onReset}
      className="w-full py-3 px-4 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
)

/**
 * InfoBox Component
 * Information card for footer
 */
const InfoBox = ({ icon, title, description }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex items-start gap-3 mb-2">
      <div className="text-blue-600">{icon}</div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

export default SymptomChecker
