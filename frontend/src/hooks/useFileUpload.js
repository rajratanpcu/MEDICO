import { useState, useCallback } from 'react'

export const useFileUpload = () => {
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState({})
  const [errors, setErrors] = useState({})

  const addFiles = useCallback((newFiles) => {
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((fileName) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName))
    setProgress((prev) => {
      const updated = { ...prev }
      delete updated[fileName]
      return updated
    })
  }, [])

  const updateProgress = useCallback((fileName, percent) => {
    setProgress((prev) => ({
      ...prev,
      [fileName]: percent,
    }))
  }, [])

  const addError = useCallback((fileName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fileName]: error,
    }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const reset = useCallback(() => {
    setFiles([])
    setProgress({})
    setErrors({})
  }, [])

  return {
    files,
    progress,
    errors,
    addFiles,
    removeFile,
    updateProgress,
    addError,
    clearErrors,
    reset,
  }
}

export default useFileUpload
