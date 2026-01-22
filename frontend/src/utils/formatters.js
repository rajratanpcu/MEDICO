/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  const formats = {
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
  }

  return formats[format] || formats['MM/DD/YYYY']
}

/**
 * Format time to readable string
 */
export const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Format datetime to readable string
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return ''
  const d = new Date(datetime)
  return `${formatDate(d)} ${formatTime(d.toTimeString().split(' ')[0])}`
}

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

/**
 * Convert camelCase to Title Case
 */
export const camelCaseToTitleCase = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Get initials from full name
 */
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  formatFileSize,
  formatPercent,
  truncateText,
  capitalize,
  camelCaseToTitleCase,
  getInitials,
}
