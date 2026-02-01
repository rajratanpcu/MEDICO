export const APP_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  API_TIMEOUT: 30000,
  
  // JWT Configuration
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  
  // File Upload Configuration
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  
  // Caching
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  // Report Types
  REPORT_TYPES: ['BLOOD_TEST', 'X_RAY', 'CT_SCAN', 'MRI', 'ULTRASOUND', 'LAB_REPORT'],
  
  // Patient Status
  PATIENT_STATUS: ['ACTIVE', 'INACTIVE', 'CRITICAL'],
  
  // Toast Notifications
  TOAST_DURATION: 3000,
  
  // Theme
  DEFAULT_THEME: 'light',
  THEMES: ['light', 'dark'],
}

export default APP_CONFIG
