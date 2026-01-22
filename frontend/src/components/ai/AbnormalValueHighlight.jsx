// AbnormalValueHighlight.jsx
// Component for highlighting abnormal medical values with interpretation

import React from 'react'
import { AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react'

/**
 * AbnormalValueHighlight Component
 * 
 * Displays a single abnormal value with:
 * - Severity color coding
 * - Test name and result
 * - Reference range
 * - Simple language interpretation
 * - Doctor recommendation
 * 
 * @param {Object} value - The abnormal value object
 * @param {string} value.testName - Name of the medical test (e.g., "Glucose")
 * @param {number} value.result - The patient's result value
 * @param {Object} value.referenceRange - Reference range info
 * @param {number} value.referenceRange.min - Minimum normal value
 * @param {number} value.referenceRange.max - Maximum normal value
 * @param {string} value.unit - Unit of measurement (e.g., "mg/dL")
 * @param {string} value.severity - 'critical' | 'warning'
 * @param {string} value.direction - 'high' | 'low' 
 * @param {string} value.interpretation - Simple language explanation
 * @param {string} value.recommendation - What to do next
 */
const AbnormalValueHighlight = ({ value, severity = 'warning' }) => {
  const isCritical = severity === 'critical'
  const isHigh = value.direction === 'high'

  // Color schemes based on severity
  const borderColor = isCritical ? 'border-red-300' : 'border-amber-300'
  const bgColor = isCritical ? 'bg-red-50' : 'bg-amber-50'
  const headerBg = isCritical ? 'bg-red-100' : 'bg-amber-100'
  const headerText = isCritical ? 'text-red-900' : 'text-amber-900'
  const badgeBg = isCritical ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
  const trendIcon = isHigh ? 
    <TrendingUp className="w-4 h-4 text-red-600" /> : 
    <TrendingDown className="w-4 h-4 text-blue-600" />

  return (
    <div className={`border-l-4 ${isCritical ? 'border-l-red-600' : 'border-l-amber-600'} 
                     ${bgColor} ${borderColor} rounded p-4 space-y-3`}>
      
      {/* Header with test name and severity badge */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className={`font-semibold ${headerText}`}>
            {value.testName}
          </h4>
          <p className="text-sm text-gray-600 mt-0.5">
            {value.interpretation}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {trendIcon}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBg}`}>
            {isHigh ? 'HIGH' : 'LOW'}
          </span>
        </div>
      </div>

      {/* Result vs Reference */}
      <div className="bg-white rounded p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Your Result:</span>
          <span className="font-bold text-lg text-gray-900">
            {value.result.toFixed(1)} {value.unit}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          Normal Range: {value.referenceRange.min} − {value.referenceRange.max} {value.unit}
        </div>

        {/* Visual Range Bar */}
        <RangeBar 
          value={value.result}
          min={value.referenceRange.min}
          max={value.referenceRange.max}
          isHigh={isHigh}
          isCritical={isCritical}
        />
      </div>

      {/* Medical Context */}
      <MedicalContext testName={value.testName} />

      {/* Recommendation */}
      <div className={`flex gap-3 p-3 rounded ${isCritical ? 'bg-red-100' : 'bg-amber-100'}`}>
        <AlertCircle className={`flex-shrink-0 w-5 h-5 ${isCritical ? 'text-red-700' : 'text-amber-700'} mt-0.5`} />
        <div>
          <p className={`text-sm font-medium ${isCritical ? 'text-red-900' : 'text-amber-900'}`}>
            Recommended Action:
          </p>
          <p className={`text-sm ${isCritical ? 'text-red-800' : 'text-amber-800'} mt-0.5`}>
            {value.recommendation}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * RangeBar Component
 * Visual representation of value position within reference range
 */
const RangeBar = ({ value, min, max, isHigh, isCritical }) => {
  // Calculate position percentage
  const range = max - min
  let position = ((value - min) / range) * 100
  
  // Clamp to 0-100 for display
  position = Math.max(0, Math.min(100, position))

  const barColor = position < 0 || position > 100 
    ? (isCritical ? 'bg-red-500' : 'bg-amber-500')
    : 'bg-green-500'

  return (
    <div className="mt-2">
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
        {/* Normal range highlight (lighter green background) */}
        <div className="absolute inset-0 bg-green-100" />

        {/* Value indicator */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-1 h-6 ${barColor} rounded-full`}
          style={{ left: `${position}%` }}
        >
          <div className={`absolute left-1/2 -translate-x-1/2 -top-6 px-2 py-1 
                          rounded text-xs font-bold whitespace-nowrap
                          ${isCritical ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}`}>
            {position.toFixed(0)}%
          </div>
        </div>

        {/* Min/Max labels */}
        <div className="absolute inset-0 flex justify-between items-end px-2 pb-1">
          <span className="text-xs text-gray-600 font-medium">{min}</span>
          <span className="text-xs text-gray-600 font-medium">{max}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * MedicalContext Component
 * Shows what the test measures in simple terms
 */
const MedicalContext = ({ testName }) => {
  // Map of common tests to simple explanations
  const testContext = {
    'Glucose': 'Blood sugar level - affects energy and metabolism',
    'Hemoglobin': 'Oxygen-carrying protein in red blood cells',
    'Cholesterol': 'Fat in your blood - high levels increase heart disease risk',
    'Sodium': 'Electrolyte that helps regulate fluid balance',
    'Potassium': 'Mineral important for heart rhythm and muscle function',
    'Creatinine': 'Waste product from muscles - shows kidney function',
    'ALT': 'Enzyme that indicates liver health',
    'Blood Pressure': 'Force of blood against artery walls',
    'Triglycerides': 'Type of fat in blood - high levels raise health risks',
    'TSH': 'Thyroid hormone - controls metabolism and energy'
  }

  const context = testContext[testName] || `Measures your ${testName} levels`

  return (
    <div className="flex gap-2 p-2.5 bg-blue-50 rounded border border-blue-200">
      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-blue-800">
        <strong>What it means:</strong> {context}
      </p>
    </div>
  )
}

export default AbnormalValueHighlight
