import React from 'react'

const Alert = ({ message, type = 'info', onClose = null, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success',
      text: 'text-success',
      icon: '✓',
    },
    error: {
      bg: 'bg-error/10',
      border: 'border-error',
      text: 'text-error',
      icon: '✕',
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      text: 'text-blue-900',
      icon: 'ⓘ',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning',
      text: 'text-warning',
      icon: '⚠',
    },
  }

  const style = types[type]

  return (
    <div
      className={`${style.bg} border-l-4 ${style.border} p-4 rounded ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className={`${style.text} text-xl font-bold`}>{style.icon}</span>
        <p className={`${style.text} flex-1`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-75 font-bold`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
