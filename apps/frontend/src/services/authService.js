import apiClient from './api'

const authService = {
  // Login user
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password })
    const { token, userId, email: userEmail, role } = response.data
    
    // Store token and user info
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ userId, email: userEmail, role }))
    
    return response.data
  },

  // Register new user
  register: async (email, password, role) => {
    const response = await apiClient.post('/auth/register', { email, password, role })
    return response.data
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}

export default authService
