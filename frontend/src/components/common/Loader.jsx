import React from 'react'

const Loader = ({ size = 'md', fullScreen = false, message = 'Loading...' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const loaderElement = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-300 border-t-primary-600`} />
      <p className="text-gray-600">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
        {loaderElement}
      </div>
    )
  }

  return loaderElement
}

export default Loader
