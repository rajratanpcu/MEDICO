// AnalysisResults.jsx
// Displays AI analysis results with interpretation and highlights

import React, { useState } from 'react'
import { AlertCircle, Info, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import AbnormalValueHighlight from './AbnormalValueHighlight'

/**
 * AnalysisResults Component
 * 
 * Displays AI analysis results in simple, patient-friendly language
 * Highlights abnormal values with medical interpretation
 * Shows confidence scores and recommendations
 * 
 * @param {Object} result - Analysis result from AI service
 * @param {string} result.summary - Simple language summary
 * @param {Array} result.findings - Array of extracted findings
 * @param {Array} result.abnormalValues - Array of abnormal values found
 * @param {Array} result.recommendations - Array of recommendations
 * @param {number} result.confidence - Overall confidence score (0-100)
 */
const AnalysisResults = ({ result }) => {
  const [expandedFinding, setExpandedFinding] = useState(null)

  if (!result) return null

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      {result.summary && (
        <SummaryCard summary={result.summary} confidence={result.confidence} />
      )}

      {/* Abnormal Values Section */}
      {result.abnormalValues && result.abnormalValues.length > 0 && (
        <AbnormalValuesSection abnormalValues={result.abnormalValues} />
      )}

      {/* Key Findings Section */}
      {result.findings && result.findings.length > 0 && (
        <FindingsSection 
          findings={result.findings}
          expandedFinding={expandedFinding}
          onToggle={setExpandedFinding}
        />
      )}

      {/* Recommendations Section */}
      {result.recommendations && result.recommendations.length > 0 && (
        <RecommendationsSection recommendations={result.recommendations} />
      )}

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  )
}

/**
 * SummaryCard Component
 * Shows overall analysis summary and confidence
 */
const SummaryCard = ({ summary, confidence = 95 }) => (
  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-blue-200 rounded-full">
        <Activity className="w-6 h-6 text-blue-700" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-2">Analysis Summary</h3>
        <p className="text-gray-700 leading-relaxed mb-4">{summary}</p>
        
        {/* Confidence Score */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {confidence}% Confidence
          </span>
        </div>
      </div>
    </div>
  </div>
)

/**
 * AbnormalValuesSection Component
 * Highlights abnormal values with severity indicators
 */
const AbnormalValuesSection = ({ abnormalValues }) => {
  // Group by severity
  const critical = abnormalValues.filter(v => v.severity === 'critical')
  const warning = abnormalValues.filter(v => v.severity === 'warning')

  return (
    <div className="bg-white border border-red-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <h3 className="font-semibold text-gray-900">
          Abnormal Values ({abnormalValues.length})
        </h3>
      </div>

      <div className="space-y-3">
        {/* Critical Values */}
        {critical.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2">
              ⚠️ Critical Findings
            </h4>
            <div className="space-y-2">
              {critical.map((value, idx) => (
                <AbnormalValueHighlight
                  key={idx}
                  value={value}
                  severity="critical"
                />
              ))}
            </div>
          </div>
        )}

        {/* Warning Values */}
        {warning.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-amber-700 mb-2">
              ⚡ Warning Values
            </h4>
            <div className="space-y-2">
              {warning.map((value, idx) => (
                <AbnormalValueHighlight
                  key={idx}
                  value={value}
                  severity="warning"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Items */}
      <div className="mt-4 p-3 bg-red-50 rounded border border-red-100">
        <p className="text-sm text-red-700">
          💬 <strong>Recommend contacting your doctor</strong> to discuss 
          these abnormal values and next steps.
        </p>
      </div>
    </div>
  )
}

/**
 * FindingsSection Component
 * Displays key findings in expandable cards
 */
const FindingsSection = ({ findings, expandedFinding, onToggle }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <h3 className="font-semibold text-gray-900">Key Findings</h3>
      <p className="text-sm text-gray-600 mt-1">
        {findings.length} finding{findings.length !== 1 ? 's' : ''} identified
      </p>
    </div>

    <div className="divide-y divide-gray-200">
      {findings.map((finding, idx) => (
        <FindingItem
          key={idx}
          index={idx}
          finding={finding}
          isExpanded={expandedFinding === idx}
          onToggle={() => onToggle(expandedFinding === idx ? null : idx)}
        />
      ))}
    </div>
  </div>
)

/**
 * FindingItem Component
 * Single expandable finding
 */
const FindingItem = ({ index, finding, isExpanded, onToggle }) => {
  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingDown className="w-4 h-4 text-green-600" />
    if (trend === 'worsening') return <TrendingUp className="w-4 h-4 text-red-600" />
    return null
  }

  return (
    <div className="p-4 hover:bg-gray-50 cursor-pointer" onClick={onToggle}>
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div className={`
          flex-shrink-0 w-3 h-3 rounded-full mt-1.5
          ${finding.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}
        `} />

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{finding.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
            </div>
            {finding.trend && getTrendIcon(finding.trend)}
          </div>

          {/* Expanded Details */}
          {isExpanded && finding.details && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
              {finding.details}
            </div>
          )}
        </div>

        {/* Expand Arrow */}
        <button className="text-gray-400 hover:text-gray-600">
          {isExpanded ? '−' : '+'}
        </button>
      </div>
    </div>
  )
}

/**
 * RecommendationsSection Component
 * Shows recommended next steps
 */
const RecommendationsSection = ({ recommendations }) => (
  <div className="bg-white rounded-lg border border-green-200 p-6">
    <div className="flex items-center gap-2 mb-4">
      <Info className="w-6 h-6 text-green-600" />
      <h3 className="font-semibold text-gray-900">Recommendations</h3>
    </div>

    <ul className="space-y-2">
      {recommendations.map((rec, idx) => (
        <li key={idx} className="flex items-start gap-3 text-gray-700">
          <span className="text-green-600 font-bold mt-0.5">✓</span>
          <span>{rec}</span>
        </li>
      ))}
    </ul>
  </div>
)

/**
 * DisclaimerCard Component
 * Important medical disclaimer
 */
const DisclaimerCard = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <p className="text-xs text-amber-800">
      <strong>Disclaimer:</strong> This AI analysis is for informational purposes 
      only and is not a substitute for professional medical advice. Always consult 
      with your healthcare provider for diagnosis and treatment decisions.
    </p>
  </div>
)

export default AnalysisResults
