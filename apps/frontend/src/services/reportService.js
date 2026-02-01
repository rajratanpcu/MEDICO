import apiClient from './api'

const reportService = {
  // Get all reports
  getReports: async (filters = {}) => {
    const response = await apiClient.get('/reports', { params: filters })
    return response.data
  },

  // Get report by ID
  getReportById: async (id) => {
    const response = await apiClient.get(`/reports/${id}`)
    return response.data
  },

  // Upload medical report
  uploadReport: async (reportData) => {
    const formData = new FormData()
    formData.append('patientId', reportData.patientId)
    formData.append('reportType', reportData.reportType)
    formData.append('file', reportData.file)
    formData.append('description', reportData.description || '')

    const response = await apiClient.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: reportData.onProgress,
    })
    return response.data
  },

  // Get patient's reports
  getPatientReports: async (patientId) => {
    const response = await apiClient.get(`/reports/patient/${patientId}`)
    return response.data
  },

  // Analyze report with AI
  analyzeReport: async (reportId) => {
    const response = await apiClient.post(`/reports/${reportId}/analyze`)
    return response.data
  },

  // Delete report
  deleteReport: async (id) => {
    const response = await apiClient.delete(`/reports/${id}`)
    return response.data
  },

  // Download report
  downloadReport: async (id) => {
    const response = await apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob',
    })
    return response.data
  },
}

export default reportService
