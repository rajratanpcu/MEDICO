export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',

  // Patients
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id) => `/patients/${id}`,
  PATIENT_REPORTS: (id) => `/reports/patient/${id}`,
  PATIENT_PRESCRIPTIONS: (id) => `/prescriptions/patient/${id}`,

  // Doctors
  DOCTORS: '/doctors',
  DOCTOR_BY_ID: (id) => `/doctors/${id}`,
  DOCTOR_PATIENTS: (id) => `/doctors/${id}/patients`,

  // Reports
  REPORTS: '/reports',
  REPORT_BY_ID: (id) => `/reports/${id}`,
  REPORT_UPLOAD: '/reports',
  REPORT_ANALYZE: (id) => `/reports/${id}/analyze`,
  REPORT_DOWNLOAD: (id) => `/reports/${id}/download`,

  // Prescriptions
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION_BY_ID: (id) => `/prescriptions/${id}`,
  PRESCRIPTION_REFILL: (id) => `/prescriptions/${id}/refill`,

  // Emergency Access
  EMERGENCY_REQUEST: '/emergency-access/request',
  EMERGENCY_PENDING: '/emergency-access/pending',
  EMERGENCY_APPROVE: (id) => `/emergency-access/${id}/approve`,
  EMERGENCY_REJECT: (id) => `/emergency-access/${id}/reject`,
  EMERGENCY_HISTORY: (id) => `/emergency-access/history/${id}`,

  // AI Services
  AI_ANALYZE_REPORT: (id) => `/ai/analyze-report/${id}`,
  AI_SYMPTOM_CHECK: '/ai/symptom-check',
  AI_CHAT: '/ai/chat',
  AI_OCR: (id) => `/ai/ocr/${id}`,
  AI_INSIGHTS: (id) => `/ai/insights/${id}`,
  AI_PREDICT_RISKS: (id) => `/ai/predict-risks/${id}`,

  // Health
  HEALTH_CHECK: '/actuator/health',
  METRICS: '/actuator/prometheus',
}

export default API_ENDPOINTS
