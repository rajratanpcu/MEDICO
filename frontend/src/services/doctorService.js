import apiClient from './api'

const doctorService = {
  // Get all doctors
  getDoctors: async (filters = {}) => {
    const response = await apiClient.get('/doctors', { params: filters })
    return response.data
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    const response = await apiClient.get(`/doctors/${id}`)
    return response.data
  },

  // Create new doctor
  createDoctor: async (doctorData) => {
    const response = await apiClient.post('/doctors', doctorData)
    return response.data
  },

  // Update doctor
  updateDoctor: async (id, doctorData) => {
    const response = await apiClient.put(`/doctors/${id}`, doctorData)
    return response.data
  },

  // Delete doctor
  deleteDoctor: async (id) => {
    const response = await apiClient.delete(`/doctors/${id}`)
    return response.data
  },

  // Get doctor's patients
  getDoctorPatients: async (doctorId) => {
    const response = await apiClient.get(`/doctors/${doctorId}/patients`)
    return response.data
  },
}

export default doctorService
