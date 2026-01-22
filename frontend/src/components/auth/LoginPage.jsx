// LoginPage.jsx
// Complete authentication component with login/logout flow

import React, { useState } from 'react'
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react'
import { useMutation } from '../../hooks/useApi'
import { authApi } from '../../services/endpoints'
import { setAuthToken } from '../../services/apiClient'
import { getErrorMessage } from '../../utils/errorHandler'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Login mutation
  const { loading, error, mutate: login } = useMutation(
    authApi.login,
    {
      onSuccess: (data) => {
        console.log('Login successful:', data)
        
        // Store authentication data
        setAuthToken(data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        
        // Redirect based on user role
        const role = data.user.role
        if (role === 'ADMIN') {
          window.location.href = '/admin/dashboard'
        } else if (role === 'CLINICIAN') {
          window.location.href = '/doctor/dashboard'
        } else {
          window.location.href = '/patient/dashboard'
        }
      },
      onError: (err) => {
        console.error('Login failed:', err)
      }
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!credentials.email || !credentials.password) {
      return
    }
    
    try {
      await login(credentials)
    } catch (err) {
      // Error is handled by the hook
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to access your medical records
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  Login Failed
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {getErrorMessage(error)}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="doctor@hospital.com"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Remember me
                </span>
              </label>

              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !credentials.email || !credentials.password}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create account
              </a>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-900 mb-2">
              Demo Credentials:
            </p>
            <div className="text-xs text-blue-800 space-y-1">
              <p>Doctor: doctor@hospital.com / password123</p>
              <p>Patient: patient@example.com / password123</p>
              <p>Admin: admin@hospital.com / password123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Protected by end-to-end encryption
        </p>
      </div>
    </div>
  )
}

/**
 * Logout Component/Function
 */
export function useLogout() {
  const { mutate: logout } = useMutation(
    authApi.logout,
    {
      onSuccess: () => {
        // Clear all authentication data
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('rememberMe')
        
        // Redirect to login
        window.location.href = '/login'
      },
      onError: (err) => {
        // Even if API fails, clear local data
        console.error('Logout error:', err)
        localStorage.clear()
        window.location.href = '/login'
      }
    }
  )

  return logout
}

/**
 * Logout Button Component
 */
export function LogoutButton({ className = '' }) {
  const logout = useLogout()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setLoading(true)
      try {
        await logout()
      } catch (err) {
        console.error('Logout failed:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <LogIn className="w-4 h-4 rotate-180" />
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
