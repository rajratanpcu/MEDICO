import apiClient from './api'

const patientService = {
  // Get all patients
  getPatients: async () => {
    const response = await apiClient.get('/patients')
    return response.data
  },

  // Get patient by ID
  getPatientById: async (id) => {
    const response = await apiClient.get(`/patients/${id}`)
    return response.data
  },

  // Create new patient
  createPatient: async (patientData) => {
    const response = await apiClient.post('/patients', patientData)
    return response.data
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(`/patients/${id}`, patientData)
    return response.data
  },

  // Get patient reports
  getPatientReports: async (patientId) => {
    const response = await apiClient.get(`/reports/patient/${patientId}`)
    return response.data
  },

  // Upload medical report
  uploadReport: async (reportData) => {
    const response = await apiClient.post('/reports', reportData)
    return response.data
  },

  // Get prescriptions for patient
  getPrescriptions: async (patientId) => {
    const response = await apiClient.get(`/prescriptions/patient/${patientId}`)
    return response.data
  },
}

export default patientService
