/**
 * Validates email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? null : 'Invalid email format'
}

/**
 * Validates password strength
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain uppercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain number'
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain special character'
  }
  return null
}

/**
 * Validates required field
 */
export const validateRequired = (value) => {
  return value && value.trim() ? null : 'This field is required'
}

/**
 * Validates phone number
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
  return phoneRegex.test(phone.replace(/\s/g, '')) ? null : 'Invalid phone number'
}

/**
 * Validates date is not in past
 */
export const validateFutureDate = (date) => {
  return new Date(date) > new Date() ? null : 'Date must be in the future'
}

/**
 * Validates age is within range
 */
export const validateAge = (dob, minAge = 0, maxAge = 120) => {
  const age = calculateAge(new Date(dob))
  if (age < minAge || age > maxAge) {
    return `Age must be between ${minAge} and ${maxAge}`
  }
  return null
}

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob) => {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

export default {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePhone,
  validateFutureDate,
  validateAge,
  calculateAge,
}
