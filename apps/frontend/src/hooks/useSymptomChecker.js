// useSymptomChecker.js
// Custom hook for symptom checking and disease prediction API integration

import { useState, useCallback } from 'react'
import { apiClient } from '@/services/apiClient'

/**
 * useSymptomChecker Hook
 * 
 * Manages symptom checking workflow:
 * - Sends symptoms to backend AI service
 * - Receives disease predictions
 * - Handles errors and loading states
 * - Formats predictions for display
 * 
 * @returns {Object} { checkSymptoms, predictions, isLoading, error, reset }
 */
export const useSymptomChecker = () => {
  const [predictions, setPredictions] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Check symptoms and get predictions
   * 
   * @param {Array<string>} symptomIds - Selected symptom IDs
   * @param {Object} options - Additional options
   * @param {string} options.userId - User ID for tracking
   * @returns {Promise<Object>} Predictions result
   */
  const checkSymptoms = useCallback(async (symptomIds, options = {}) => {
    if (!symptomIds || symptomIds.length === 0) {
      throw new Error('At least one symptom is required')
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call backend API
      const response = await apiClient.post(
        '/ai/check-symptoms',
        {
          symptomIds,
          userId: options.userId,
          timestamp: new Date().toISOString()
        },
        {
          timeout: 30000
        }
      )

      // Format and validate predictions
      const formattedPredictions = formatPredictions(response.data.predictions)
      setPredictions(formattedPredictions)
      setIsLoading(false)

      return {
        predictions: formattedPredictions,
        confidence: response.data.confidence,
        analysisId: response.data.analysisId
      }
    } catch (err) {
      const message = parseError(err)
      setError(message)
      setIsLoading(false)
      throw new Error(message)
    }
  }, [])

  /**
   * Format predictions from API response
   */
  const formatPredictions = (rawPredictions) => {
    if (!Array.isArray(rawPredictions)) return []

    return rawPredictions.map((prediction) => ({
      diseaseId: prediction.disease_id || prediction.id,
      diseaseName: prediction.disease_name || prediction.name,
      confidence: parseFloat(prediction.confidence) || 0,
      severity: getSeverity(prediction.confidence),
      description: prediction.description || '',
      matchingSymptoms: prediction.matching_symptoms || [],
      whenToSeeDoctorText: getWhenToSeeDoctorText(
        prediction.disease_name || prediction.name,
        prediction.severity
      ),
      selfCareTips: prediction.self_care_tips || getDefaultSelfCareTips(prediction.disease_name || prediction.name),
      riskFactors: prediction.risk_factors || [],
      additionalInfo: prediction.additional_info || ''
    }))
  }

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setPredictions(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    checkSymptoms,
    predictions,
    isLoading,
    error,
    reset
  }
}

/**
 * Determine severity level based on confidence
 */
const getSeverity = (confidence) => {
  if (confidence >= 80) return 'critical'
  if (confidence >= 60) return 'high'
  if (confidence >= 40) return 'moderate'
  return 'low'
}

/**
 * Get when to see doctor text for a disease
 */
const getWhenToSeeDoctorText = (diseaseName, severity) => {
  const textMap = {
    'Common Cold': 'See a doctor if symptoms last more than 10 days or worsen significantly.',
    'Influenza': 'See a doctor if you have high fever, severe body aches, or difficulty breathing. Seek emergency care if symptoms are severe.',
    'COVID-19': 'See a doctor if you have difficulty breathing, persistent chest pain, or severe symptoms. Call emergency services if symptoms are life-threatening.',
    'Headache': 'See a doctor if headaches are severe, persistent, or accompanied by fever, stiff neck, or vision changes.',
    'Migraine': 'See a doctor if migraines are frequent or worsening. Consider preventive treatment options.',
    'Fever': 'See a doctor if fever is above 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms.',
    'Cough': 'See a doctor if cough is persistent (more than 3 weeks), produces blood, or is accompanied by chest pain.',
    'Sore Throat': 'See a doctor if sore throat is severe, lasts more than a week, or is accompanied by fever and difficulty swallowing.',
    'Nausea': 'See a doctor if nausea is persistent, accompanied by vomiting, or lasts more than 24 hours.',
    'Diarrhea': 'See a doctor if diarrhea is severe, lasts more than 2 days, or is accompanied by blood or severe dehydration signs.'
  }

  return textMap[diseaseName] || 
         'Consult a healthcare professional for a proper diagnosis and treatment plan.'
}

/**
 * Get default self-care tips for a disease
 */
const getDefaultSelfCareTips = (diseaseName) => {
  const tipsMap = {
    'Common Cold': [
      'Get adequate rest and sleep',
      'Stay hydrated with water and warm beverages',
      'Use over-the-counter pain relievers for discomfort',
      'Gargle with warm salt water for sore throat',
      'Use a humidifier to ease congestion'
    ],
    'Influenza': [
      'Rest for at least 24 hours after fever subsides',
      'Stay hydrated with water and clear broths',
      'Use antiviral medications if prescribed',
      'Isolate yourself to avoid spreading the flu',
      'Avoid smoking and secondhand smoke'
    ],
    'COVID-19': [
      'Isolate from others for at least 5 days',
      'Stay hydrated and maintain good nutrition',
      'Monitor symptoms closely',
      'Take over-the-counter medications for symptoms',
      'Consider antiviral treatment if eligible'
    ],
    'Headache': [
      'Rest in a quiet, dark room',
      'Apply a cold or warm compress to your head',
      'Stay hydrated',
      'Try relaxation techniques',
      'Avoid screens and bright lights'
    ],
    'Fever': [
      'Rest and let your body fight the infection',
      'Stay hydrated with water and electrolyte drinks',
      'Take acetaminophen or ibuprofen as directed',
      'Use lightweight clothing',
      'Maintain a cool room temperature'
    ]
  }

  return tipsMap[diseaseName] || [
    'Rest and get adequate sleep',
    'Stay hydrated by drinking plenty of water',
    'Eat nutritious food to support recovery',
    'Avoid smoking and secondhand smoke',
    'Practice good hygiene to prevent spread'
  ]
}

/**
 * Parse error message from API response
 */
const parseError = (err) => {
  if (err.response?.data?.message) {
    return err.response.data.message
  }

  if (err.response?.status === 400) {
    return 'Invalid symptoms provided. Please check your selection.'
  }

  if (err.response?.status === 408 || err.code === 'ECONNABORTED') {
    return 'Request timed out. The server is taking too long to respond. Please try again.'
  }

  if (err.response?.status === 500) {
    return 'Server error. The AI service is temporarily unavailable. Please try again later.'
  }

  if (err.message === 'Network Error') {
    return 'Network error. Please check your internet connection and try again.'
  }

  return err.message || 'Failed to check symptoms. Please try again.'
}

export default useSymptomChecker
