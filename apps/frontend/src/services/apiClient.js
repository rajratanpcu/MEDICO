// apiClient.js
// Centralized Axios-based API client for Spring Boot backend communication

import axios from 'axios'

// Environment-based API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000

// Create Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - Inject JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('accessToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request timestamp for logging
    config.metadata = { startTime: new Date() }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
    }
    
    return config
  },
  (error) => {
    // Handle request error
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime
    
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data
      })
    }
    
    // Return response data directly
    return response.data
  },
  async (error) => {
    // Calculate request duration if available
    const duration = error.config?.metadata?.startTime 
      ? new Date() - error.config.metadata.startTime 
      : 0
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        duration: `${duration}ms`,
        error: error.response?.data || error.message
      })
    }
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          handleUnauthorized()
          return Promise.reject({
            type: 'UNAUTHORIZED',
            message: data.message || 'Your session has expired. Please login again.',
            status: 401,
            originalError: error
          })
        
        case 403:
          // Forbidden - No permission
          return Promise.reject({
            type: 'FORBIDDEN',
            message: data.message || 'You do not have permission to access this resource.',
            status: 403,
            originalError: error
          })
        
        case 404:
          // Not Found
          return Promise.reject({
            type: 'NOT_FOUND',
            message: data.message || 'The requested resource was not found.',
            status: 404,
            originalError: error
          })
        
        case 408:
          // Request Timeout
          return Promise.reject({
            type: 'TIMEOUT',
            message: data.message || 'Request timeout. Please try again.',
            status: 408,
            originalError: error
          })
        
        case 409:
          // Conflict
          return Promise.reject({
            type: 'CONFLICT',
            message: data.message || 'A conflict occurred with the request.',
            status: 409,
            details: data.details,
            originalError: error
          })
        
        case 422:
          // Unprocessable Entity - Validation errors
          return Promise.reject({
            type: 'VALIDATION_ERROR',
            message: data.message || 'Validation failed.',
            status: 422,
            errors: data.errors || data.details,
            originalError: error
          })
        
        case 429:
          // Too Many Requests
          return Promise.reject({
            type: 'RATE_LIMIT',
            message: data.message || 'Too many requests. Please try again later.',
            status: 429,
            retryAfter: error.response.headers['retry-after'],
            originalError: error
          })
        
        case 500:
          // Internal Server Error
          return Promise.reject({
            type: 'SERVER_ERROR',
            message: data.message || 'An unexpected server error occurred.',
            status: 500,
            originalError: error
          })
        
        case 503:
          // Service Unavailable
          return Promise.reject({
            type: 'SERVICE_UNAVAILABLE',
            message: data.message || 'Service temporarily unavailable. Please try again later.',
            status: 503,
            originalError: error
          })
        
        default:
          // Other errors
          return Promise.reject({
            type: 'API_ERROR',
            message: data.message || `Request failed with status ${status}`,
            status,
            originalError: error
          })
      }
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'Network error. Please check your internet connection.',
        originalError: error
      })
    } else {
      // Something else happened
      return Promise.reject({
        type: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred.',
        originalError: error
      })
    }
  }
)

// Handle unauthorized access (401)
const handleUnauthorized = () => {
  // Clear stored tokens
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  
  // Redirect to login page
  // Use setTimeout to avoid redirect during API call
  setTimeout(() => {
    window.location.href = '/login'
  }, 100)
}

// Token management functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

export const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

export const clearAuthToken = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

// Refresh token function
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken
    })
    
    const { accessToken } = response.data
    setAuthToken(accessToken)
    
    return accessToken
  } catch (error) {
    clearAuthToken()
    throw error
  }
}

// Export configured API client
export default apiClient
