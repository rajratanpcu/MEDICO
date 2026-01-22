import React from 'react'

const Badge = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success/10 text-success',
    danger: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-semibold',
    lg: 'px-4 py-2 text-base font-semibold',
  }

  return (
    <span
      className={`inline-block rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
