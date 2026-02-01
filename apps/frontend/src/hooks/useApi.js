// useApi.js
// Custom React hook for API calls with loading and error states

import { useState, useCallback } from 'react'
import { getErrorMessage, logError, createErrorNotification } from '../utils/errorHandler'

/**
 * Custom hook for making API calls with loading and error states
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    initialData = null,
    showErrorNotification = true
  } = options
  
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  /**
   * Execute the API call
   */
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await apiFunction(...args)
      
      setData(result)
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      // Log error
      logError(err, { apiFunction: apiFunction.name, args })
      
      // Set error state
      setError(err)
      
      // Call error callback
      if (onError) {
        onError(err)
      }
      
      // Show error notification if enabled
      if (showErrorNotification) {
        const notification = createErrorNotification(err)
        // Dispatch to notification system (implement based on your notification library)
        console.error(notification.title, notification.message)
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction, onSuccess, onError, showErrorNotification])
  
  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(initialData)
    setLoading(false)
    setError(null)
  }, [initialData])
  
  return {
    data,
    loading,
    error,
    execute,
    reset,
    errorMessage: error ? getErrorMessage(error) : null
  }
}

/**
 * Custom hook for queries (GET requests)
 * Automatically fetches on mount
 */
export const useQuery = (apiFunction, options = {}) => {
  const {
    enabled = true,
    params = null,
    ...restOptions
  } = options
  
  const { data, loading, error, execute, reset, errorMessage } = useApi(apiFunction, restOptions)
  
  // Auto-fetch on mount if enabled
  useState(() => {
    if (enabled) {
      execute(params)
    }
  }, [enabled, params, execute])
  
  /**
   * Refetch data
   */
  const refetch = useCallback(() => {
    return execute(params)
  }, [execute, params])
  
  return {
    data,
    loading,
    error,
    errorMessage,
    refetch,
    reset
  }
}

/**
 * Custom hook for mutations (POST, PUT, DELETE)
 * Doesn't fetch automatically
 */
export const useMutation = (apiFunction, options = {}) => {
  const { data, loading, error, execute, reset, errorMessage } = useApi(apiFunction, options)
  
  return {
    data,
    loading,
    error,
    errorMessage,
    mutate: execute,
    reset
  }
}

/**
 * Custom hook for file uploads with progress tracking
 */
export const useFileUpload = (apiFunction, options = {}) => {
  const [progress, setProgress] = useState(0)
  const { data, loading, error, execute, reset, errorMessage } = useApi(apiFunction, options)
  
  /**
   * Upload file with progress tracking
   */
  const upload = useCallback(async (file, additionalData = {}) => {
    const formData = new FormData()
    formData.append('file', file)
    
    // Append additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    // Upload with progress callback
    return execute(formData, (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      setProgress(percentCompleted)
    })
  }, [execute])
  
  /**
   * Reset including progress
   */
  const resetUpload = useCallback(() => {
    setProgress(0)
    reset()
  }, [reset])
  
  return {
    data,
    loading,
    error,
    errorMessage,
    progress,
    upload,
    reset: resetUpload
  }
}

// Export hooks
export default {
  useApi,
  useQuery,
  useMutation,
  useFileUpload
}
