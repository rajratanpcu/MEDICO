import apiClient from './api'

const emergencyService = {
  // Request emergency access
  requestEmergencyAccess: async (requestData) => {
    const response = await apiClient.post('/emergency-access/request', requestData)
    return response.data
  },

  // Get pending access requests
  getPendingRequests: async () => {
    const response = await apiClient.get('/emergency-access/pending')
    return response.data
  },

  // Approve access request
  approveRequest: async (requestId) => {
    const response = await apiClient.post(`/emergency-access/${requestId}/approve`)
    return response.data
  },

  // Reject access request
  rejectRequest: async (requestId, reason) => {
    const response = await apiClient.post(`/emergency-access/${requestId}/reject`, {
      reason: reason,
    })
    return response.data
  },

  // Get access history
  getAccessHistory: async (patientId) => {
    const response = await apiClient.get(`/emergency-access/history/${patientId}`)
    return response.data
  },

  // Get my access requests
  getMyRequests: async () => {
    const response = await apiClient.get('/emergency-access/my-requests')
    return response.data
  },
}

export default emergencyService
