/**
 * LocalStorage wrapper with error handling
 */
class StorageManager {
  constructor(prefix = 'medical_') {
    this.prefix = prefix
  }

  /**
   * Set item in localStorage
   */
  setItem(key, value) {
    try {
      const prefixedKey = this.prefix + key
      const serialized = JSON.stringify(value)
      localStorage.setItem(prefixedKey, serialized)
      return true
    } catch (error) {
      console.error(`Error setting localStorage[${key}]:`, error)
      return false
    }
  }

  /**
   * Get item from localStorage
   */
  getItem(key, defaultValue = null) {
    try {
      const prefixedKey = this.prefix + key
      const item = localStorage.getItem(prefixedKey)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error getting localStorage[${key}]:`, error)
      return defaultValue
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      const prefixedKey = this.prefix + key
      localStorage.removeItem(prefixedKey)
      return true
    } catch (error) {
      console.error(`Error removing localStorage[${key}]:`, error)
      return false
    }
  }

  /**
   * Clear all items with prefix
   */
  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  /**
   * Get all items with prefix
   */
  getAll() {
    try {
      const items = {}
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const cleanKey = key.replace(this.prefix, '')
          items[cleanKey] = this.getItem(cleanKey)
        }
      })
      return items
    } catch (error) {
      console.error('Error getting all localStorage items:', error)
      return {}
    }
  }

  /**
   * Check if item exists
   */
  hasItem(key) {
    const prefixedKey = this.prefix + key
    return localStorage.getItem(prefixedKey) !== null
  }
}

export const storageManager = new StorageManager()

export default StorageManager
