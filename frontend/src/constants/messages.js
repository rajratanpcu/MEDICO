export const ERROR_MESSAGES = {
  // Auth Errors
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_USER_NOT_FOUND: 'User not found',
  AUTH_USER_ALREADY_EXISTS: 'User already exists',
  AUTH_TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  AUTH_UNAUTHORIZED: 'You are not authorized to perform this action',
  AUTH_FORBIDDEN: 'Access denied',

  // Validation Errors
  VALIDATION_REQUIRED: 'This field is required',
  VALIDATION_EMAIL_INVALID: 'Please enter a valid email',
  VALIDATION_PASSWORD_WEAK: 'Password must be at least 8 characters',
  VALIDATION_PHONE_INVALID: 'Please enter a valid phone number',
  VALIDATION_DATE_INVALID: 'Please enter a valid date',

  // File Upload Errors
  FILE_SIZE_TOO_LARGE: 'File size exceeds maximum allowed size',
  FILE_TYPE_NOT_ALLOWED: 'File type is not allowed',
  FILE_UPLOAD_FAILED: 'Failed to upload file',
  FILE_NOT_FOUND: 'File not found',

  // Patient Errors
  PATIENT_NOT_FOUND: 'Patient not found',
  PATIENT_ALREADY_EXISTS: 'Patient already registered',
  PATIENT_DELETE_FAILED: 'Cannot delete patient',

  // Report Errors
  REPORT_NOT_FOUND: 'Report not found',
  REPORT_ANALYSIS_FAILED: 'Failed to analyze report',
  REPORT_GENERATION_FAILED: 'Failed to generate report',

  // Network Errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',

  // Generic
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NOT_FOUND: 'Resource not found',
}

export const SUCCESS_MESSAGES = {
  // Auth
  AUTH_LOGIN_SUCCESS: 'Login successful',
  AUTH_REGISTER_SUCCESS: 'Registration successful',
  AUTH_LOGOUT_SUCCESS: 'Logout successful',

  // Patient
  PATIENT_CREATED: 'Patient created successfully',
  PATIENT_UPDATED: 'Patient updated successfully',
  PATIENT_DELETED: 'Patient deleted successfully',

  // Report
  REPORT_UPLOADED: 'Report uploaded successfully',
  REPORT_ANALYZED: 'Report analysis completed',
  REPORT_DELETED: 'Report deleted successfully',

  // Prescription
  PRESCRIPTION_CREATED: 'Prescription created successfully',
  PRESCRIPTION_UPDATED: 'Prescription updated successfully',
  PRESCRIPTION_REFILLED: 'Prescription refilled successfully',

  // Emergency Access
  ACCESS_REQUESTED: 'Emergency access requested',
  ACCESS_APPROVED: 'Access approved',
  ACCESS_REJECTED: 'Access rejected',
}

export default { ERROR_MESSAGES, SUCCESS_MESSAGES }
