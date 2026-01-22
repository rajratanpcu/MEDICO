import { ERROR_MESSAGES } from '../constants/messages'

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.message) {
    return error.message
  }
  return ERROR_MESSAGES.SOMETHING_WENT_WRONG
}

/**
 * Map HTTP status codes to user-friendly messages
 */
export const getErrorMessageByStatus = (status) => {
  const statusMessages = {
    400: ERROR_MESSAGES.VALIDATION_REQUIRED,
    401: ERROR_MESSAGES.AUTH_UNAUTHORIZED,
    403: ERROR_MESSAGES.AUTH_FORBIDDEN,
    404: ERROR_MESSAGES.NOT_FOUND,
    408: ERROR_MESSAGES.TIMEOUT_ERROR,
    413: ERROR_MESSAGES.FILE_SIZE_TOO_LARGE,
    500: ERROR_MESSAGES.SERVER_ERROR,
    502: ERROR_MESSAGES.SERVER_ERROR,
    503: ERROR_MESSAGES.SERVER_ERROR,
  }
  return statusMessages[status] || ERROR_MESSAGES.SOMETHING_WENT_WRONG
}

/**
 * Handle API errors
 */
export const handleApiError = (error) => {
  if (!error.response) {
    // Network error
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  const status = error.response.status
  const message = getErrorMessage(error)

  // Log error for debugging
  console.error(`[API Error ${status}]`, message, error.response.data)

  return message || getErrorMessageByStatus(status)
}

/**
 * Validate API response
 */
export const validateResponse = (response) => {
  if (!response) {
    throw new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG)
  }
  if (response.error) {
    throw new Error(response.error)
  }
  return response
}

/**
 * Retry logic with exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelay = 1000
) => {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}

export default {
  getErrorMessage,
  getErrorMessageByStatus,
  handleApiError,
  validateResponse,
  retryWithBackoff,
}
