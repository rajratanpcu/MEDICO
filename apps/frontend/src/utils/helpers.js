/**
 * Sleep for specified milliseconds
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = (func, delay) => {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func(...args)
    }
  }
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects
 */
export const mergeObjects = (obj1, obj2) => {
  return { ...obj1, ...obj2 }
}

/**
 * Group array by property
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const groupKey = item[key]
    groups[groupKey] = groups[groupKey] || []
    groups[groupKey].push(item)
    return groups
  }, {})
}

/**
 * Remove duplicates from array
 */
export const removeDuplicates = (array, key) => {
  const seen = new Set()
  return array.filter((item) => {
    const value = key ? item[key] : item
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * Sort array of objects by property
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1
    } else {
      return a[key] < b[key] ? 1 : -1
    }
  })
}

/**
 * Filter array by multiple conditions
 */
export const filterBy = (array, filters) => {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(value)) {
        return value.includes(item[key])
      }
      return item[key] === value
    })
  })
}

/**
 * Get unique values from array
 */
export const getUnique = (array, key) => {
  return [...new Set(array.map((item) => (key ? item[key] : item)))]
}

/**
 * Check if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get query parameters from URL
 */
export const getQueryParams = (searchString) => {
  const params = new URLSearchParams(searchString)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
  return new URLSearchParams(params).toString()
}

export default {
  sleep,
  debounce,
  throttle,
  deepClone,
  mergeObjects,
  groupBy,
  removeDuplicates,
  sortBy,
  filterBy,
  getUnique,
  isValidEmail,
  getQueryParams,
  buildQueryString,
}
