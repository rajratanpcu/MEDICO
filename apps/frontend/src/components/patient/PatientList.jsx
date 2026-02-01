import React, { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { AlertCircle, Plus, Search, Filter, Loader } from 'lucide-react'

/**
 * PatientList Component
 * Displays paginated table of patients with search, filter, and action buttons
 * Features: Pagination, search, sorting, status indicators
 */
export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('lastName')
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage] = useState(10)

  const { data: patientsData, loading, error, request } = useApi()

  // Fetch patients on component mount
  useEffect(() => {
    request('/patients', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
  }, [])

  // Filter patients based on search and status
  const filteredPatients = (patientsData?.patients || [])
    .filter((patient) => {
      const matchesSearch =
        patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mrn?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || patient.status === filterStatus

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'lastName') {
        return a.lastName.localeCompare(b.lastName)
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)
  const startIndex = (currentPage - 1) * patientsPerPage
  const endIndex = startIndex + patientsPerPage
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-h2 font-bold text-neutral-900 mb-2">Patients</h1>
          <p className="text-body-md text-neutral-600">
            Manage patient records and medical information
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, email, or MRN..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:border-medical-500 focus:ring-4 focus:ring-medical-100 placeholder-neutral-400 transition-colors"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-neutral-600 self-center" />
              <select
                className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:border-medical-500 focus:ring-4 focus:ring-medical-100 text-neutral-900 transition-colors"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {/* Sort */}
            <select
              className="px-4 py-3 rounded-lg border border-neutral-300 focus:border-medical-500 focus:ring-4 focus:ring-medical-100 text-neutral-900 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="lastName">Sort by Last Name</option>
              <option value="createdAt">Sort by Date Added</option>
            </select>
          </div>

          {/* Add Patient Button */}
          <button className="inline-flex items-center gap-2 bg-medical-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-600 active:bg-medical-700 focus:ring-4 focus:ring-medical-200 transition-colors">
            <Plus className="w-5 h-5" />
            Add Patient
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-neutral-200 rounded-lg p-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 text-medical-500 animate-spin" />
              <p className="text-body-md text-neutral-600">Loading patients...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Patients</h3>
              <p className="text-body-sm text-red-800">{error.message || 'Failed to load patient data'}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-body-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-label font-semibold text-neutral-700">Name</th>
                      <th className="px-6 py-4 text-left text-label font-semibold text-neutral-700">Email</th>
                      <th className="px-6 py-4 text-left text-label font-semibold text-neutral-700">MRN</th>
                      <th className="px-6 py-4 text-left text-label font-semibold text-neutral-700">Status</th>
                      <th className="px-6 py-4 text-left text-label font-semibold text-neutral-700">Added</th>
                      <th className="px-6 py-4 text-right text-label font-semibold text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPatients.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <p className="text-body-md text-neutral-500">
                            {filteredPatients.length === 0 && searchTerm
                              ? 'No patients match your search'
                              : 'No patients found'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedPatients.map((patient) => (
                        <tr key={patient.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-body-md font-medium text-neutral-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-body-md text-neutral-600">{patient.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-body-md font-mono text-neutral-600">{patient.mrn}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-label font-medium ${
                                patient.status === 'ACTIVE'
                                  ? 'bg-calm-100 text-calm-700'
                                  : patient.status === 'INACTIVE'
                                    ? 'bg-neutral-200 text-neutral-700'
                                    : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-body-sm text-neutral-600">
                              {new Date(patient.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button className="px-3 py-1 text-medical-600 hover:bg-medical-50 rounded text-body-sm font-medium transition-colors">
                                View
                              </button>
                              <button className="px-3 py-1 text-neutral-600 hover:bg-neutral-200 rounded text-body-sm font-medium transition-colors">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-body-sm text-neutral-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of{' '}
                  {filteredPatients.length} patients
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded text-body-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-medical-500 text-white'
                              : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
