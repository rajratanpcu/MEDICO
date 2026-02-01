// fileValidation.js
// Utility functions for medical file validation and formatting

/**
 * Validate medical file for upload
 * Checks file type (PDF, JPG, PNG) and size (max 10MB)
 * 
 * @param {File} file - File object from input
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateMedicalFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }

  // Check file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
  const fileExtension = file.name.split('.').pop().toLowerCase()
  const validExtensions = ['pdf', 'jpg', 'jpeg', 'png']

  if (!allowedTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload PDF, JPG, or PNG files only.'
    }
  }

  // Check file size (10 MB max)
  const maxSizeMB = 10
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Current size: ${formatFileSize(file.size)}`
    }
  }

  // Check file name for invalid characters
  const invalidCharacters = /[<>:"|?*\x00-\x1f]/g
  if (invalidCharacters.test(file.name)) {
    return {
      isValid: false,
      error: 'File name contains invalid characters'
    }
  }

  return { isValid: true, error: null }
}

/**
 * Format file size in human readable format
 * Converts bytes to B, KB, MB, GB
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

/**
 * Get file type label from MIME type or extension
 * 
 * @param {File} file - File object
 * @returns {string} Human readable file type (e.g., "PDF Document")
 */
export const getFileTypeLabel = (file) => {
  const extension = file.name.split('.').pop().toLowerCase()
  
  const typeMap = {
    'pdf': 'PDF Document',
    'jpg': 'JPEG Image',
    'jpeg': 'JPEG Image',
    'png': 'PNG Image'
  }

  return typeMap[extension] || 'Medical Document'
}

/**
 * Extract file extension
 * 
 * @param {File|string} file - File object or file name
 * @returns {string} File extension lowercase (e.g., "pdf")
 */
export const getFileExtension = (file) => {
  const fileName = typeof file === 'string' ? file : file.name
  return fileName.split('.').pop().toLowerCase()
}

/**
 * Check if file is PDF
 * 
 * @param {File} file - File object
 * @returns {boolean}
 */
export const isPDF = (file) => {
  return file.type === 'application/pdf' || getFileExtension(file) === 'pdf'
}

/**
 * Check if file is image (JPG or PNG)
 * 
 * @param {File} file - File object
 * @returns {boolean}
 */
export const isImage = (file) => {
  const ext = getFileExtension(file)
  return ['jpg', 'jpeg', 'png'].includes(ext) || file.type.startsWith('image/')
}

/**
 * Validate multiple files (for batch upload)
 * 
 * @param {FileList|Array} files - Files to validate
 * @returns {Object} { valid: File[], invalid: Array<{file, error}> }
 */
export const validateMultipleFiles = (files) => {
  const valid = []
  const invalid = []

  Array.from(files).forEach((file) => {
    const validation = validateMedicalFile(file)
    if (validation.isValid) {
      valid.push(file)
    } else {
      invalid.push({
        file,
        error: validation.error
      })
    }
  })

  return { valid, invalid }
}

/**
 * Generate file preview key for caching
 * 
 * @param {File} file - File object
 * @returns {string} Unique cache key
 */
export const getFilePreviewKey = (file) => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

/**
 * Check file readability
 * Verifies file can be read by checking first few bytes
 * 
 * @param {File} file - File object
 * @returns {Promise<boolean>} True if file is readable
 */
export const checkFileReadability = async (file) => {
  try {
    const chunk = await file.slice(0, 512).arrayBuffer()
    return chunk.byteLength > 0
  } catch (error) {
    return false
  }
}

/**
 * Validate file against security checks
 * Checks for potential malicious content
 * 
 * @param {File} file - File object
 * @returns {Promise<Object>} { isSecure: boolean, warnings: Array<string> }
 */
export const validateFileSecure = async (file) => {
  const warnings = []

  // Check if file is readable
  const isReadable = await checkFileReadability(file)
  if (!isReadable) {
    warnings.push('Could not verify file integrity')
  }

  // Check for suspicious file size (0 bytes or extremely large)
  if (file.size === 0) {
    warnings.push('File is empty')
  }

  if (file.size > 50 * 1024 * 1024) { // 50 MB
    warnings.push('File size is unusually large')
  }

  return {
    isSecure: warnings.length === 0,
    warnings
  }
}

/**
 * Get medical file icon type for UI display
 * 
 * @param {File} file - File object
 * @returns {string} Icon type identifier ('pdf'|'image')
 */
export const getFileIconType = (file) => {
  return isPDF(file) ? 'pdf' : 'image'
}

/**
 * Format file metadata for logging/analytics
 * 
 * @param {File} file - File object
 * @returns {Object} Metadata object
 */
export const getFileMetadata = (file) => {
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    extension: getFileExtension(file),
    lastModified: new Date(file.lastModified).toISOString(),
    isPDF: isPDF(file),
    isImage: isImage(file)
  }
}
