import apiClient from './api'

const aiService = {
  // Analyze medical report with AI
  analyzeReport: async (reportId) => {
    const response = await apiClient.post(`/ai/analyze-report/${reportId}`)
    return response.data
  },

  // Check symptoms with AI
  checkSymptoms: async (symptoms) => {
    const response = await apiClient.post('/ai/symptom-check', {
      symptoms: symptoms,
    })
    return response.data
  },

  // Get AI chat response
  sendChatMessage: async (message) => {
    const response = await apiClient.post('/ai/chat', {
      message: message,
    })
    return response.data
  },

  // OCR text extraction from report
  extractReportText: async (reportId) => {
    const response = await apiClient.post(`/ai/ocr/${reportId}`)
    return response.data
  },

  // Generate medical insights
  generateInsights: async (patientId) => {
    const response = await apiClient.post(`/ai/insights/${patientId}`)
    return response.data
  },

  // Predict health risks
  predictRisks: async (patientId) => {
    const response = await apiClient.post(`/ai/predict-risks/${patientId}`)
    return response.data
  },
}

export default aiService
