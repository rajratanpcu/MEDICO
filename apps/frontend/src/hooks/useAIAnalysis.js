// useAIAnalysis.js
// Custom hook for triggering and managing AI analysis of medical reports

import { useState, useCallback } from 'react'
import { apiClient } from '../services/apiClient'

/**
 * useAIAnalysis Hook
 * Triggers AI analysis of uploaded reports and manages analysis state
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Request timeout in ms (default: 120000 for 2 min)
 * @returns {Object} { analyzeReport, analysisResult, isLoading, error, clearError }
 */
export const useAIAnalysis = (options = {}) => {
  const { timeout = 120000 } = options

  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Trigger AI analysis of a report
   * POST /api/ai/analyze-report
   * 
   * @param {string} fileId - ID of uploaded file to analyze
   * @param {Object} options - Additional options
   * @param {string} options.patientId - Patient ID for context
   * @param {string} options.reportType - Type of report (e.g., 'blood-test', 'x-ray')
   * @returns {Promise<Object>} Analysis result with findings and abnormal values
   */
  const analyzeReport = useCallback(async (fileId, options = {}) => {
    if (!fileId) {
      throw new Error('File ID is required for analysis')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.post(
        '/ai/analyze-report',
        {
          fileId,
          patientId: options.patientId,
          reportType: options.reportType
        },
        {
          timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      // Transform API response to display format
      const result = transformAnalysisResult(response.data)
      setAnalysisResult(result)
      setIsLoading(false)

      return result
    } catch (err) {
      const message = err.response?.data?.message || 
                     err.message || 
                     'Analysis failed. Please try again.'
      
      setError(message)
      setIsLoading(false)
      throw new Error(message)
    }
  }, [timeout])

  /**
   * Transform raw API response to display format
   * Adds severity levels, simple language interpretation, etc.
   * 
   * @param {Object} rawData - Raw response from AI service
   * @returns {Object} Formatted analysis result
   */
  const transformAnalysisResult = (rawData) => {
    return {
      // Basic info
      summary: rawData.summary || 'Analysis complete',
      confidence: rawData.confidence || 90,
      
      // Abnormal values with severity
      abnormalValues: (rawData.abnormal_values || []).map((value) => {
        const isHigh = value.direction === 'high'
        const isOutOfRange = Math.abs(
          (value.result - value.reference_range.min) /
          (value.reference_range.max - value.reference_range.min)
        ) > 2
        
        return {
          testName: value.test_name,
          result: parseFloat(value.result),
          unit: value.unit,
          referenceRange: {
            min: parseFloat(value.reference_range.min),
            max: parseFloat(value.reference_range.max)
          },
          severity: isOutOfRange ? 'critical' : 'warning',
          direction: value.direction,
          interpretation: getSimpleInterpretation(value.test_name, isHigh),
          recommendation: getRecommendation(value.test_name, isHigh)
        }
      }),

      // Key findings
      findings: (rawData.findings || []).map((finding) => ({
        title: finding.title,
        description: finding.description,
        details: finding.details,
        severity: finding.severity || 'info',
        trend: finding.trend || null
      })),

      // Recommendations
      recommendations: rawData.recommendations || [
        'Schedule a follow-up appointment with your doctor',
        'Maintain a healthy diet and exercise routine',
        'Take medications as prescribed'
      ]
    }
  }

  /**
   * Get simple language interpretation of abnormal value
   * 
   * @param {string} testName - Name of medical test
   * @param {boolean} isHigh - Is value high or low
   * @returns {string} Simple language interpretation
   */
  const getSimpleInterpretation = (testName, isHigh) => {
    const interpretations = {
      'Glucose': {
        high: 'Your blood sugar is higher than normal, which may indicate diabetes risk',
        low: 'Your blood sugar is lower than normal, which can cause weakness and dizziness'
      },
      'Hemoglobin': {
        high: 'Your red blood cell count is higher than normal',
        low: 'Your red blood cell count is lower than normal, which may indicate anemia'
      },
      'Cholesterol': {
        high: 'Your cholesterol level is elevated, increasing risk for heart disease',
        low: 'Your cholesterol level is unusually low'
      },
      'Sodium': {
        high: 'Your sodium level is higher than normal',
        low: 'Your sodium level is lower than normal, affecting fluid balance'
      },
      'Potassium': {
        high: 'Your potassium level is elevated, which can affect heart rhythm',
        low: 'Your potassium level is low, which can cause muscle weakness'
      },
      'Creatinine': {
        high: 'Your creatinine level suggests possible kidney problems',
        low: 'Your creatinine level is lower than normal'
      },
      'ALT': {
        high: 'Your liver enzyme level is elevated, suggesting liver stress',
        low: 'Your liver enzyme level is lower than normal'
      },
      'Blood Pressure': {
        high: 'Your blood pressure is elevated, increasing cardiovascular risk',
        low: 'Your blood pressure is low, which may cause dizziness'
      },
      'Triglycerides': {
        high: 'Your triglyceride level is high, increasing heart disease risk',
        low: 'Your triglyceride level is very low'
      }
    }

    const test = interpretations[testName] || {}
    const direction = isHigh ? 'high' : 'low'
    
    return test[direction] || 
           `Your ${testName} value is ${direction} and outside normal range`
  }

  /**
   * Get medical recommendation for abnormal value
   * 
   * @param {string} testName - Name of medical test
   * @param {boolean} isHigh - Is value high or low
   * @returns {string} Recommended action
   */
  const getRecommendation = (testName, isHigh) => {
    const recommendations = {
      'Glucose': {
        high: 'Contact your doctor. Consider diabetes screening and dietary changes.',
        low: 'Eat something with sugar/carbs. Contact doctor if symptoms persist.'
      },
      'Hemoglobin': {
        high: 'Consult your doctor for evaluation and possible treatment.',
        low: 'Increase iron intake (spinach, red meat) and consult your doctor.'
      },
      'Cholesterol': {
        high: 'Reduce saturated fats, exercise regularly, and consult your doctor.',
        low: 'Consult your doctor to ensure adequate nutrition.'
      },
      'Sodium': {
        high: 'Reduce salt intake and consult your doctor.',
        low: 'Increase sodium intake slightly and contact your doctor.'
      },
      'Potassium': {
        high: 'Consult your doctor. May need medication adjustment.',
        low: 'Eat potassium-rich foods (bananas, potatoes) and see your doctor.'
      },
      'Creatinine': {
        high: 'Consult your doctor for kidney function evaluation.',
        low: 'Consult your doctor for possible muscle issues.'
      },
      'ALT': {
        high: 'Avoid alcohol and certain medications. Contact your doctor immediately.',
        low: 'Consult your doctor to assess liver health.'
      },
      'Blood Pressure': {
        high: 'Reduce salt and stress, exercise, and contact your doctor urgently.',
        low: 'Increase water intake and consult your doctor if symptoms occur.'
      },
      'Triglycerides': {
        high: 'Exercise regularly, reduce sugar, and consult your doctor.',
        low: 'Consult your doctor to ensure adequate nutrition.'
      }
    }

    const test = recommendations[testName] || {}
    const direction = isHigh ? 'high' : 'low'
    
    return test[direction] || 
           'Consult your doctor to discuss this result and next steps.'
  }

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setAnalysisResult(null)
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    analyzeReport,
    analysisResult,
    isLoading,
    error,
    clearError,
    reset
  }
}

export default useAIAnalysis
