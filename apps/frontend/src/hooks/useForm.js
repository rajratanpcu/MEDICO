import { useState, useCallback } from 'react'

export const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }, [])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    if (validate && validate[name]) {
      const error = validate[name](values[name])
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }, [values, validate])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        // Validate all fields
        const newErrors = {}
        if (validate) {
          Object.entries(validate).forEach(([field, validator]) => {
            const error = validator(values[field])
            if (error) {
              newErrors[field] = error
            }
          })
        }

        if (Object.keys(newErrors).length === 0) {
          await onSubmit(values)
        } else {
          setErrors(newErrors)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validate, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  }
}

export default useForm
