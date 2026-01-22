// DiseaseResults.jsx
// Display predicted diseases with confidence levels and information

import React, { useState } from 'react'
import { AlertCircle, Info, TrendingUp, ChevronDown } from 'lucide-react'

/**
 * DiseaseResults Component
 * 
 * Displays predicted diseases ranked by confidence:
 * - Confidence percentage with visual bar
 * - Disease severity level
 * - Brief description
 * - When to see a doctor
 * - Expandable detailed information
 * 
 * @param {Array} predictions - Array of predicted diseases with confidence
 */
const DiseaseResults = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800">
          No disease predictions available. Please try different symptoms.
        </p>
      </div>
    )
  }

  // Sort by confidence descending
  const sortedPredictions = [...predictions].sort(
    (a, b) => b.confidence - a.confidence
  )

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">
            Based on your symptoms, we found {sortedPredictions.length} possible condition
            {sortedPredictions.length !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-blue-800 mt-1">
            The conditions below are ranked by likelihood. This is not a medical diagnosis.
          </p>
        </div>
      </div>

      {/* Disease Predictions */}
      <div className="space-y-3">
        {sortedPredictions.map((prediction, index) => (
          <DiseaseCard
            key={prediction.diseaseId}
            prediction={prediction}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Important Note */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 mt-6">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-900 mb-1">Important</p>
          <p className="text-sm text-red-800">
            This tool provides general health information only. A medical professional must
            provide a proper diagnosis. If you have severe symptoms, seek immediate medical
            attention or call emergency services.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * DiseaseCard Component
 * Individual disease prediction card
 */
const DiseaseCard = ({ prediction, rank }) => {
  const [isExpanded, setIsExpanded] = useState(rank === 1) // First result expanded by default

  const severityColor = {
    critical: 'text-red-600 bg-red-50 border-red-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    moderate: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-green-600 bg-green-50 border-green-200'
  }

  const severityLabel = {
    critical: 'Critical - Seek Immediate Care',
    high: 'High - See Doctor Soon',
    moderate: 'Moderate - Schedule Appointment',
    low: 'Low - Monitor Symptoms'
  }

  const color = severityColor[prediction.severity] || severityColor.moderate

  return (
    <div className={`border-2 rounded-lg overflow-hidden transition-all ${
      isExpanded ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
    }`}>
      {/* Card Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 text-left">
          {/* Rank and Disease Name */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-gray-400">#{rank}</span>
            <h3 className="text-xl font-bold text-gray-900">
              {prediction.diseaseName}
            </h3>
          </div>

          {/* Severity Badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${color} mb-3`}>
            {severityLabel[prediction.severity]}
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Confidence</span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(prediction.confidence)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getConfidenceColor(prediction.confidence)}`}
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
          </div>

          {/* Brief Description */}
          <p className="text-sm text-gray-700 mt-3">
            {prediction.description}
          </p>
        </div>

        {/* Expand Arrow */}
        <ChevronDown
          className={`w-6 h-6 text-gray-400 flex-shrink-0 ml-4 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-white p-4 space-y-4">
          {/* Symptoms Matching */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Your Matching Symptoms
            </h4>
            <ul className="space-y-1">
              {prediction.matchingSymptoms?.map((symptom, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* When to See Doctor */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              When to See a Doctor
            </h4>
            <p className="text-sm text-blue-800">
              {prediction.whenToSeeDoctorText}
            </p>
          </div>

          {/* Self-Care Tips */}
          {prediction.selfCareTips && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Self-Care Tips
              </h4>
              <ul className="space-y-1">
                {prediction.selfCareTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Factors */}
          {prediction.riskFactors && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Risk Factors
              </h4>
              <ul className="space-y-1">
                {prediction.riskFactors.map((factor, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">⚠</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Information */}
          {prediction.additionalInfo && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                More Information
              </h4>
              <p className="text-sm text-gray-700">
                {prediction.additionalInfo}
              </p>
            </div>
          )}

          {/* Learn More Link */}
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Learn more about {prediction.diseaseName}
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Get color for confidence bar based on percentage
 */
const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return 'bg-red-500'
  if (confidence >= 60) return 'bg-orange-500'
  if (confidence >= 40) return 'bg-amber-500'
  return 'bg-green-500'
}

export default DiseaseResults
