// ApiUsageExamples.jsx
// Comprehensive examples of using the API service layer

import React, { useState, useEffect } from 'react'
import { useApi, useQuery, useMutation, useFileUpload } from '../hooks/useApi'
import { patientApi, authApi, reportApi, aiApi } from '../services/endpoints'
import { getErrorMessage } from '../utils/errorHandler'

// ============================================================================
// EXAMPLE 1: Basic API Call with useApi Hook
// ============================================================================
export function BasicApiExample() {
  const { data, loading, error, execute } = useApi(patientApi.getAll)
  
  const loadPatients = async () => {
    try {
      await execute({ page: 1, size: 10 })
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to load patients')
    }
  }
  
  return (
    <div>
      <button onClick={loadPatients} disabled={loading}>
        {loading ? 'Loading...' : 'Load Patients'}
      </button>
      
      {error && <div className="error">{getErrorMessage(error)}</div>}
      
      {data && (
        <ul>
          {data.content.map(patient => (
            <li key={patient.id}>{patient.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: Auto-fetching with useQuery Hook
// ============================================================================
export function QueryExample() {
  const { data, loading, error, refetch } = useQuery(
    patientApi.getAll,
    {
      enabled: true,
      params: { page: 0, size: 20 },
      onSuccess: (data) => console.log('Patients loaded:', data)
    }
  )
  
  if (loading) return <div>Loading patients...</div>
  if (error) return <div>Error: {getErrorMessage(error)}</div>
  
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {data?.content.map(patient => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================================
// EXAMPLE 3: Create/Update with useMutation Hook
// ============================================================================
export function MutationExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  const { loading, error, mutate } = useMutation(
    patientApi.create,
    {
      onSuccess: (data) => {
        console.log('Patient created:', data)
        alert('Patient created successfully!')
        setFormData({ name: '', email: '', phone: '' })
      },
      onError: (err) => {
        console.error('Failed to create patient:', err)
      }
    }
  )
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await mutate(formData)
    } catch (err) {
      // Error already handled by hook
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="Phone"
      />
      
      {error && <div className="error">{getErrorMessage(error)}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Patient'}
      </button>
    </form>
  )
}

// ============================================================================
// EXAMPLE 4: File Upload with Progress
// ============================================================================
export function FileUploadExample() {
  const [selectedFile, setSelectedFile] = useState(null)
  
  const { loading, error, progress, upload, data } = useFileUpload(
    reportApi.uploadFile,
    {
      onSuccess: (result) => {
        console.log('File uploaded:', result)
        alert('File uploaded successfully!')
      }
    }
  )
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }
  
  const handleUpload = async () => {
    if (!selectedFile) return
    
    try {
      await upload(selectedFile, {
        patientId: '123',
        reportType: 'LAB_RESULT'
      })
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }
  
  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
      
      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        {loading ? `Uploading... ${progress}%` : 'Upload File'}
      </button>
      
      {loading && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {error && <div className="error">{getErrorMessage(error)}</div>}
      {data && <div className="success">File uploaded: {data.fileName}</div>}
    </div>
  )
}

// ============================================================================
// EXAMPLE 5: Authentication Flow
// ============================================================================
export function LoginExample() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  
  const { loading, error, mutate: login } = useMutation(
    authApi.login,
    {
      onSuccess: (data) => {
        // Store token
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect to dashboard
        window.location.href = '/dashboard'
      }
    }
  )
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(credentials)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Password"
        required
      />
      
      {error && <div className="error">{getErrorMessage(error)}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

// ============================================================================
// EXAMPLE 6: Symptom Checker Integration
// ============================================================================
export function SymptomCheckerExample() {
  const [symptoms, setSymptoms] = useState([])
  const [results, setResults] = useState(null)
  
  const { loading, error, mutate: checkSymptoms } = useMutation(
    aiApi.checkSymptoms,
    {
      onSuccess: (data) => {
        setResults(data)
      }
    }
  )
  
  const handleCheck = async () => {
    try {
      await checkSymptoms({
        symptomIds: symptoms,
        userId: localStorage.getItem('userId'),
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Symptom check failed:', err)
    }
  }
  
  return (
    <div>
      <h2>Check Your Symptoms</h2>
      
      {/* Symptom selection UI */}
      <div>
        {/* Add symptom selector components here */}
        <p>Selected: {symptoms.length} symptoms</p>
      </div>
      
      <button onClick={handleCheck} disabled={loading || symptoms.length === 0}>
        {loading ? 'Analyzing...' : 'Check Symptoms'}
      </button>
      
      {error && <div className="error">{getErrorMessage(error)}</div>}
      
      {results && (
        <div className="results">
          <h3>Predictions:</h3>
          {results.predictions.map((pred, idx) => (
            <div key={idx} className="prediction">
              <h4>{pred.disease_name}</h4>
              <p>Confidence: {pred.confidence}%</p>
              <p>{pred.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXAMPLE 7: Paginated List with Search
// ============================================================================
export function PaginatedListExample() {
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data, loading, error, refetch } = useQuery(
    patientApi.getAll,
    {
      params: { page, size: 10, search: searchQuery }
    }
  )
  
  useEffect(() => {
    refetch()
  }, [page, searchQuery, refetch])
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setPage(0) // Reset to first page on search
  }
  
  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search patients..."
      />
      
      {loading && <div>Loading...</div>}
      {error && <div className="error">{getErrorMessage(error)}</div>}
      
      {data && (
        <>
          <ul>
            {data.content.map(patient => (
              <li key={patient.id}>{patient.name} - {patient.email}</li>
            ))}
          </ul>
          
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            
            <span>Page {page + 1} of {data.totalPages}</span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= data.totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// EXAMPLE 8: Multiple API Calls in Sequence
// ============================================================================
export function SequentialCallsExample() {
  const [patientId, setPatientId] = useState(null)
  const [patientData, setPatientData] = useState(null)
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const loadPatientDetails = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      // 1. Get patient details
      const patient = await patientApi.getById(id)
      setPatientData(patient)
      
      // 2. Get patient's reports
      const patientReports = await patientApi.getReports(id)
      setReports(patientReports)
      
      console.log('Patient data loaded successfully')
    } catch (err) {
      setError(err)
      console.error('Failed to load patient details:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <input
        type="text"
        value={patientId || ''}
        onChange={(e) => setPatientId(e.target.value)}
        placeholder="Enter Patient ID"
      />
      
      <button
        onClick={() => loadPatientDetails(patientId)}
        disabled={!patientId || loading}
      >
        {loading ? 'Loading...' : 'Load Patient'}
      </button>
      
      {error && <div className="error">{getErrorMessage(error)}</div>}
      
      {patientData && (
        <div>
          <h3>{patientData.name}</h3>
          <p>Email: {patientData.email}</p>
          
          <h4>Reports ({reports?.length || 0})</h4>
          <ul>
            {reports?.map(report => (
              <li key={report.id}>{report.title} - {report.date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Export all examples
export default {
  BasicApiExample,
  QueryExample,
  MutationExample,
  FileUploadExample,
  LoginExample,
  SymptomCheckerExample,
  PaginatedListExample,
  SequentialCallsExample
}
