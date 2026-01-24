import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import PatientDashboard from './pages/patient/PatientDashboard'
import DashboardHome from './pages/dashboard/DashboardHome'
import PatientsPage from './pages/patients/PatientsPage'
import PatientForm from './pages/patients/PatientForm'
import ReportUploadPage from './pages/reports/ReportUploadPage'
import ReportsListPage from './pages/reports/ReportsListPage'
import AIChatPage from './pages/ai/AIChatPage'
import PatientDetailPage from './pages/patients/PatientDetailPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import DesignSystemShowcase from './components/DesignSystemShowcase'
import SymptomCheckerPage from './pages/ai/SymptomCheckerPage'
import SettingsPage from './pages/settings/SettingsPage'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/design-system" element={<DesignSystemShowcase />} />

            {/* Protected routes with layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['CLINICIAN', 'PATIENT', 'ADMIN']}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />

              {/* Patients */}
              <Route path="patients" element={<PatientsPage />} />
              <Route path="patients/new" element={<PatientForm />} />
              <Route path="patients/:id" element={<PatientDetailPage />} />
              <Route path="patients/:id/edit" element={<PatientForm />} />
              <Route path="patient/dashboard" element={<PatientDashboard />} />

              {/* Reports */}
              <Route path="reports" element={<ReportsListPage />} />
              <Route path="reports/upload" element={<ReportUploadPage />} />

              {/* AI Features */}
              <Route path="ai/chat" element={<AIChatPage />} />
              <Route path="ai/symptom-checker" element={<SymptomCheckerPage />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
