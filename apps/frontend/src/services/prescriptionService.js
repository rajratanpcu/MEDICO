import apiClient from './api'

const prescriptionService = {
  // Get all prescriptions
  getPrescriptions: async (filters = {}) => {
    const response = await apiClient.get('/prescriptions', { params: filters })
    return response.data
  },

  // Get prescription by ID
  getPrescriptionById: async (id) => {
    const response = await apiClient.get(`/prescriptions/${id}`)
    return response.data
  },

  // Get patient's prescriptions
  getPatientPrescriptions: async (patientId) => {
    const response = await apiClient.get(`/prescriptions/patient/${patientId}`)
    return response.data
  },

  // Create prescription
  createPrescription: async (prescriptionData) => {
    const response = await apiClient.post('/prescriptions', prescriptionData)
    return response.data
  },

  // Update prescription
  updatePrescription: async (id, prescriptionData) => {
    const response = await apiClient.put(`/prescriptions/${id}`, prescriptionData)
    return response.data
  },

  // Delete prescription
  deletePrescription: async (id) => {
    const response = await apiClient.delete(`/prescriptions/${id}`)
    return response.data
  },

  // Mark as refilled
  markAsRefilled: async (id) => {
    const response = await apiClient.post(`/prescriptions/${id}/refill`)
    return response.data
  },
}

export default prescriptionService
