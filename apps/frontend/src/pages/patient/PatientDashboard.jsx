import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import patientService from '../../services/patientService'

const PatientDashboard = () => {
  const { user, logout } = useAuth()

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getPatients,
  })

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-800">Patient Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-error text-white px-4 py-2 rounded-md hover:bg-error/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Patient Records</h2>
          <p className="text-gray-600">View and manage patient information</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded">
            Error loading patients: {error.message}
          </div>
        )}

        {/* Patients Grid */}
        {patients && patients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'ACTIVE'
                        ? 'bg-success/10 text-success'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Age:</span>{' '}
                    {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span> {patient.gender}
                  </p>
                  <p>
                    <span className="font-medium">Blood Type:</span> {patient.bloodType}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {patient.phoneNumber}
                  </p>
                </div>

                <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {patients && patients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No patients found</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default PatientDashboard
