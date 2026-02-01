// endpoints.js
// Centralized API endpoints configuration

import apiClient from './apiClient'

/**
 * Authentication API endpoints
 */
export const authApi = {
  // Login
  login: (credentials) => 
    apiClient.post('/auth/login', credentials),
  
  // Register
  register: (userData) => 
    apiClient.post('/auth/register', userData),
  
  // Logout
  logout: () => 
    apiClient.post('/auth/logout'),
  
  // Refresh token
  refreshToken: (refreshToken) => 
    apiClient.post('/auth/refresh', { refreshToken }),
  
  // Get current user
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
  
  // Forgot password
  forgotPassword: (email) => 
    apiClient.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, newPassword) => 
    apiClient.post('/auth/reset-password', { token, newPassword }),
  
  // Change password
  changePassword: (currentPassword, newPassword) => 
    apiClient.post('/auth/change-password', { currentPassword, newPassword })
}

/**
 * Patient API endpoints
 */
export const patientApi = {
  // Get all patients (with pagination and filters)
  getAll: (params = {}) => 
    apiClient.get('/patients', { params }),
  
  // Get patient by ID
  getById: (id) => 
    apiClient.get(`/patients/${id}`),
  
  // Create patient
  create: (patientData) => 
    apiClient.post('/patients', patientData),
  
  // Update patient
  update: (id, patientData) => 
    apiClient.put(`/patients/${id}`, patientData),
  
  // Delete patient
  delete: (id) => 
    apiClient.delete(`/patients/${id}`),
  
  // Search patients
  search: (query, filters = {}) => 
    apiClient.get('/patients/search', { params: { q: query, ...filters } }),
  
  // Get patient reports
  getReports: (id) => 
    apiClient.get(`/patients/${id}/reports`),
  
  // Get patient prescriptions
  getPrescriptions: (id) => 
    apiClient.get(`/patients/${id}/prescriptions`)
}

/**
 * Doctor API endpoints
 */
export const doctorApi = {
  // Get all doctors
  getAll: (params = {}) => 
    apiClient.get('/doctors', { params }),
  
  // Get doctor by ID
  getById: (id) => 
    apiClient.get(`/doctors/${id}`),
  
  // Create doctor
  create: (doctorData) => 
    apiClient.post('/doctors', doctorData),
  
  // Update doctor
  update: (id, doctorData) => 
    apiClient.put(`/doctors/${id}`, doctorData),
  
  // Delete doctor
  delete: (id) => 
    apiClient.delete(`/doctors/${id}`),
  
  // Get doctor's patients
  getPatients: (id) => 
    apiClient.get(`/doctors/${id}/patients`),
  
  // Search doctors by specialty
  searchBySpecialty: (specialty) => 
    apiClient.get('/doctors/search', { params: { specialty } })
}

/**
 * Medical Report API endpoints
 */
export const reportApi = {
  // Get all reports
  getAll: (params = {}) => 
    apiClient.get('/reports', { params }),
  
  // Get report by ID
  getById: (id) => 
    apiClient.get(`/reports/${id}`),
  
  // Create report
  create: (reportData) => 
    apiClient.post('/reports', reportData),
  
  // Update report
  update: (id, reportData) => 
    apiClient.put(`/reports/${id}`, reportData),
  
  // Delete report
  delete: (id) => 
    apiClient.delete(`/reports/${id}`),
  
  // Upload report file
  uploadFile: (formData, onUploadProgress) => 
    apiClient.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    }),
  
  // Download report file
  downloadFile: (id) => 
    apiClient.get(`/reports/${id}/download`, { responseType: 'blob' }),
  
  // Analyze report with AI
  analyzeWithAI: (id) => 
    apiClient.post(`/reports/${id}/analyze`)
}

/**
 * Prescription API endpoints
 */
export const prescriptionApi = {
  // Get all prescriptions
  getAll: (params = {}) => 
    apiClient.get('/prescriptions', { params }),
  
  // Get prescription by ID
  getById: (id) => 
    apiClient.get(`/prescriptions/${id}`),
  
  // Create prescription
  create: (prescriptionData) => 
    apiClient.post('/prescriptions', prescriptionData),
  
  // Update prescription
  update: (id, prescriptionData) => 
    apiClient.put(`/prescriptions/${id}`, prescriptionData),
  
  // Delete prescription
  delete: (id) => 
    apiClient.delete(`/prescriptions/${id}`)
}

/**
 * Emergency Access API endpoints
 */
export const emergencyApi = {
  // Request emergency access
  requestAccess: (requestData) => 
    apiClient.post('/emergency/request', requestData),
  
  // Approve emergency access
  approveAccess: (requestId) => 
    apiClient.post(`/emergency/${requestId}/approve`),
  
  // Deny emergency access
  denyAccess: (requestId, reason) => 
    apiClient.post(`/emergency/${requestId}/deny`, { reason }),
  
  // Get pending requests
  getPendingRequests: () => 
    apiClient.get('/emergency/pending'),
  
  // Get request history
  getHistory: (params = {}) => 
    apiClient.get('/emergency/history', { params })
}

/**
 * AI Service API endpoints
 */
export const aiApi = {
  // OCR - Extract text from medical document
  extractText: (formData) => 
    apiClient.post('/ai/ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Check symptoms and predict diseases
  checkSymptoms: (symptomData) => 
    apiClient.post('/ai/check-symptoms', symptomData),
  
  // Chat with medical AI
  chat: (message, conversationId = null) => 
    apiClient.post('/ai/chat', { message, conversationId }),
  
  // Analyze medical report
  analyzeReport: (reportId) => 
    apiClient.post('/ai/analyze-report', { reportId }),
  
  // Get analysis history
  getAnalysisHistory: (params = {}) => 
    apiClient.get('/ai/analysis-history', { params })
}

/**
 * Notification API endpoints
 */
export const notificationApi = {
  // Get all notifications
  getAll: (params = {}) => 
    apiClient.get('/notifications', { params }),
  
  // Get unread count
  getUnreadCount: () => 
    apiClient.get('/notifications/unread-count'),
  
  // Mark as read
  markAsRead: (id) => 
    apiClient.put(`/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () => 
    apiClient.put('/notifications/read-all'),
  
  // Delete notification
  delete: (id) => 
    apiClient.delete(`/notifications/${id}`)
}

/**
 * Analytics API endpoints
 */
export const analyticsApi = {
  // Get dashboard statistics
  getDashboardStats: () => 
    apiClient.get('/analytics/dashboard'),
  
  // Get patient statistics
  getPatientStats: (params = {}) => 
    apiClient.get('/analytics/patients', { params }),
  
  // Get report statistics
  getReportStats: (params = {}) => 
    apiClient.get('/analytics/reports', { params }),
  
  // Get activity logs
  getActivityLogs: (params = {}) => 
    apiClient.get('/analytics/activity-logs', { params })
}

/**
 * File Management API endpoints
 */
export const fileApi = {
  // Upload file
  upload: (formData, onUploadProgress) => 
    apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    }),
  
  // Download file
  download: (fileId) => 
    apiClient.get(`/files/${fileId}/download`, { responseType: 'blob' }),
  
  // Delete file
  delete: (fileId) => 
    apiClient.delete(`/files/${fileId}`),
  
  // Get file metadata
  getMetadata: (fileId) => 
    apiClient.get(`/files/${fileId}/metadata`)
}

// Export all APIs
export default {
  auth: authApi,
  patient: patientApi,
  doctor: doctorApi,
  report: reportApi,
  prescription: prescriptionApi,
  emergency: emergencyApi,
  ai: aiApi,
  notification: notificationApi,
  analytics: analyticsApi,
  file: fileApi
}
