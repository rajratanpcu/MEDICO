// IntegratedPatientList.jsx
// Example: Patient List component using the new API service layer

import React, { useState, useEffect } from 'react'
import { Users, Search, Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { useQuery, useMutation } from '../../hooks/useApi'
import { patientApi } from '../../services/endpoints'
import { getErrorMessage } from '../../utils/errorHandler'

export default function IntegratedPatientList() {
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(0) // Reset to first page on search
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch patients with useQuery hook
  const { data, loading, error, refetch } = useQuery(
    patientApi.getAll,
    {
      enabled: true,
      params: {
        page,
        size: 10,
        search: debouncedSearch
      }
    }
  )

  // Refresh when page or search changes
  useEffect(() => {
    refetch()
  }, [page, debouncedSearch, refetch])

  // Delete patient mutation
  const { mutate: deletePatient, loading: deleting } = useMutation(
    patientApi.delete,
    {
      onSuccess: () => {
        alert('Patient deleted successfully')
        refetch() // Refresh list after deletion
      }
    }
  )

  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId)
    }
  }

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (data && page < data.totalPages - 1) {
      setPage(page + 1)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Management
          </h1>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients by name, email, or phone..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">
              Failed to load patients
            </p>
            <p className="text-sm text-red-700 mt-1">
              {getErrorMessage(error)}
            </p>
            <button
              onClick={refetch}
              className="text-sm text-red-600 hover:text-red-700 font-medium mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading patients...</p>
        </div>
      )}

      {/* Patient List */}
      {data && (
        <>
          {/* Stats */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {data.content.length} of {data.totalElements} patients
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Patient
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'No patients found matching your search' : 'No patients yet'}
                    </td>
                  </tr>
                ) : (
                  data.content.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {patient.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          patient.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-700 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {page + 1} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={page === 0 || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={page >= data.totalPages - 1 || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
