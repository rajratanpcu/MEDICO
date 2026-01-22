import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import PatientDashboard from './pages/patient/PatientDashboard'
import ProtectedRoute from './components/common/ProtectedRoute'
import DesignSystemShowcase from './components/DesignSystemShowcase'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Design system showcase - public for development */}
          <Route path="/design-system" element={<DesignSystemShowcase />} />
          
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected patient routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CLINICIAN', 'PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
