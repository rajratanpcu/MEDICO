import React, { useState, useEffect } from 'react'

const Toast = ({ message, type = 'info', duration = 3000, onClose = () => {} }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const types = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-warning text-white',
  }

  return (
    <div className={`${types[type]} px-6 py-3 rounded-lg shadow-lg`}>
      {message}
    </div>
  )
}

export default Toast
