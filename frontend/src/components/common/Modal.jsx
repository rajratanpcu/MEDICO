import React from 'react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = null,
  size = 'md',
}) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${sizes[size]} bg-white rounded-lg shadow-xl p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">{children}</div>

        {actions && (
          <div className="flex gap-3 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
