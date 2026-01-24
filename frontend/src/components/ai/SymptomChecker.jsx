import React, { useState } from 'react'
import { AlertCircle, CheckCircle, MessageCircle, Loader } from 'lucide-react'

/**
 * SymptomChecker Component
 * Interactive symptom assessment tool with AI-powered predictions
 * Features: Multi-symptom selection, severity rating, confidence scores
 */
export default function SymptomChecker({ patientId, onAnalysisComplete }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [duration, setDuration] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [notes, setNotes] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const COMMON_SYMPTOMS = [
    'Fever',
    'Cough',
    'Headache',
    'Fatigue',
    'Sore Throat',
    'Chest Pain',
    'Shortness of Breath',
    'Dizziness',
    'Nausea',
    'Vomiting',
    'Abdominal Pain',
    'Rash',
  ]

  // Toggle symptom selection
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  // Handle analysis
  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom')
      return
    }

    if (!duration) {
      setError('Please specify symptom duration')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      // Import apiClient at the top if not already imported
      const apiClient = (await import('../../services/api')).default

      const response = await apiClient.post('/ai/predict/symptoms', {
        symptoms: selectedSymptoms,
        demographics: {
          duration,
          severity
        },
        vitals: {
          notes
        }
      })

      const data = response.data
      setAnalysis(data)

      if (onAnalysisComplete) {
        onAnalysisComplete(data)
      }
    } catch (err) {
      console.error('Symptom analysis error:', err)
      setError(err.response?.data?.message || 'Failed to analyze symptoms. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setSelectedSymptoms([])
    setDuration('')
    setSeverity('moderate')
    setNotes('')
    setAnalysis(null)
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-50 to-neutral-50 p-6 border-b border-neutral-200">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-6 h-6 text-medical-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-h3 font-bold text-neutral-900 mb-1">Symptom Checker</h2>
            <p className="text-body-sm text-neutral-600">
              Describe your symptoms for AI-powered health insights
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* No Analysis - Show Form */}
        {!analysis && (
          <>
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-body-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Symptoms Selection */}
            <div className="mb-8">
              <label className="block text-label font-semibold text-neutral-900 mb-4">
                Select your symptoms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COMMON_SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-3 rounded-lg border-2 transition-all text-body-sm font-medium text-center ${selectedSymptoms.includes(symptom)
                        ? 'border-medical-500 bg-medical-50 text-medical-700'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-medical-200'
                      }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="block text-label font-semibold text-neutral-900 mb-3">
                How long have you had these symptoms?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-medical-500 focus:ring-4 focus:ring-medical-100 text-neutral-900 transition-colors"
              >
                <option value="">Select duration...</option>
                <option value="less-than-1-day">Less than 1 day</option>
                <option value="1-3-days">1-3 days</option>
                <option value="4-7-days">4-7 days</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="more-than-2-weeks">More than 2 weeks</option>
              </select>
            </div>

            {/* Severity */}
            <div className="mb-8">
              <label className="block text-label font-semibold text-neutral-900 mb-4">
                How severe are your symptoms?
              </label>
              <div className="space-y-2">
                {['mild', 'moderate', 'severe'].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level}
                      checked={severity === level}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-4 h-4 text-medical-500 border-neutral-300 focus:ring-2 focus:ring-medical-200"
                    />
                    <span className="text-body-md text-neutral-700 capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <label htmlFor="notes" className="block text-label font-semibold text-neutral-900 mb-3">
                Additional notes (optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information about your symptoms..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-medical-500 focus:ring-4 focus:ring-medical-100 placeholder-neutral-400 text-neutral-900 transition-colors"
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing || selectedSymptoms.length === 0}
              className="w-full bg-medical-500 text-white py-3 rounded-lg font-semibold hover:bg-medical-600 active:bg-medical-700 focus:ring-4 focus:ring-medical-200 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Health Insights'
              )}
            </button>
          </>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div>
            {/* Success Message */}
            <div className="mb-6 bg-calm-50 border border-calm-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-calm-600 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-calm-700">
                Analysis complete. Please consult with a healthcare provider for medical advice.
              </p>
            </div>

            {/* Analysis Results */}
            <div className="space-y-6">
              {/* Top Conditions */}
              {analysis.conditions && analysis.conditions.length > 0 && (
                <div>
                  <h3 className="text-h4 font-bold text-neutral-900 mb-4">Possible Conditions</h3>
                  <div className="space-y-3">
                    {analysis.conditions.map((condition, index) => (
                      <div key={index} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-neutral-900">{condition.name}</h4>
                          <span className="bg-medical-100 text-medical-700 px-3 py-1 rounded-full text-caption font-medium">
                            {Math.round(condition.confidence * 100)}% match
                          </span>
                        </div>
                        <p className="text-body-sm text-neutral-600">{condition.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="text-h4 font-bold text-neutral-900 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex gap-3 text-body-sm text-neutral-700">
                        <span className="text-medical-500 font-bold">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When to Seek Care */}
              {analysis.urgency && (
                <div className={`rounded-lg p-4 border-2 ${analysis.urgency === 'emergency'
                    ? 'bg-red-50 border-red-200'
                    : analysis.urgency === 'urgent'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-calm-50 border-calm-200'
                  }`}>
                  <p className={`font-semibold mb-2 ${analysis.urgency === 'emergency'
                      ? 'text-red-900'
                      : analysis.urgency === 'urgent'
                        ? 'text-amber-900'
                        : 'text-calm-900'
                    }`}>
                    When to Seek Medical Care
                  </p>
                  <p className={`text-body-sm ${analysis.urgency === 'emergency'
                      ? 'text-red-800'
                      : analysis.urgency === 'urgent'
                        ? 'text-amber-800'
                        : 'text-calm-800'
                    }`}>
                    {analysis.urgencyDescription || 'Monitor your symptoms and seek care if they worsen.'}
                  </p>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="mt-6 w-full px-6 py-3 rounded-lg border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-neutral-50 border-t border-neutral-200 p-4">
        <p className="text-caption text-neutral-600">
          <strong>Disclaimer:</strong> This tool is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for diagnosis and treatment.
        </p>
      </div>
    </div>
  )
}
