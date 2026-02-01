# API Service Layer - Integration Guide

## Overview

Complete API service layer for React-Spring Boot communication with JWT authentication, centralized error handling, and environment configuration.

## Architecture

```
Frontend (React)
├── apiClient.js         → Axios instance with interceptors
├── endpoints.js         → API endpoint definitions
├── errorHandler.js      → Centralized error handling
├── useApi.js            → React hooks for API calls
└── .env                 → Environment configuration
```

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
```

### 2. Basic Usage

```jsx
import { patientApi } from '@/services/endpoints'
import { useQuery } from '@/hooks/useApi'

function PatientList() {
  const { data, loading, error } = useQuery(patientApi.getAll)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {data.content.map(patient => (
        <li key={patient.id}>{patient.name}</li>
      ))}
    </ul>
  )
}
```

## Core Components

### 1. apiClient.js

**Purpose**: Axios instance with JWT injection and response handling

**Features**:
- Automatic JWT token injection from localStorage
- Request/response logging in development
- Centralized error handling with standardized format
- 401 auto-redirect to login
- Token refresh support

**Token Management**:
```javascript
import { setAuthToken, clearAuthToken } from '@/services/apiClient'

// After login
setAuthToken(response.accessToken)

// On logout
clearAuthToken()
```

### 2. endpoints.js

**Purpose**: Centralized API endpoint definitions

**Available APIs**:
- `authApi` - Authentication (login, register, refresh, etc.)
- `patientApi` - Patient management
- `doctorApi` - Doctor management
- `reportApi` - Medical reports with file upload
- `prescriptionApi` - Prescriptions
- `emergencyApi` - Emergency access requests
- `aiApi` - AI services (OCR, symptom checker, chat)
- `notificationApi` - Notifications
- `analyticsApi` - Analytics and statistics
- `fileApi` - File management

**Usage**:
```javascript
import { patientApi, reportApi } from '@/services/endpoints'

// Get all patients
const patients = await patientApi.getAll({ page: 0, size: 10 })

// Upload report
const report = await reportApi.uploadFile(formData, onProgress)
```

### 3. errorHandler.js

**Purpose**: Centralized error handling utilities

**Features**:
- User-friendly error messages
- Error severity levels
- Retry logic for transient errors
- Error logging for monitoring
- Error type detection

**Error Types**:
- `UNAUTHORIZED` (401) - Session expired
- `FORBIDDEN` (403) - No permission
- `NOT_FOUND` (404) - Resource not found
- `TIMEOUT` (408) - Request timeout
- `VALIDATION_ERROR` (422) - Form validation errors
- `RATE_LIMIT` (429) - Too many requests
- `SERVER_ERROR` (500) - Internal server error
- `NETWORK_ERROR` - No internet connection

**Usage**:
```javascript
import { getErrorMessage, handleErrorWithRetry } from '@/utils/errorHandler'

try {
  await patientApi.create(data)
} catch (error) {
  console.error(getErrorMessage(error))
}

// With retry
const data = await handleErrorWithRetry(
  () => patientApi.getAll(),
  3 // max retries
)
```

### 4. useApi.js Hooks

**Purpose**: React hooks for API calls with state management

#### useApi
Basic hook with manual execution

```jsx
const { data, loading, error, execute } = useApi(patientApi.create)

const handleSubmit = async (formData) => {
  try {
    await execute(formData)
    alert('Patient created!')
  } catch (err) {
    // Error already in state
  }
}
```

#### useQuery
Auto-fetching hook for GET requests

```jsx
const { data, loading, error, refetch } = useQuery(
  patientApi.getAll,
  {
    enabled: true,
    params: { page: 0, size: 10 },
    onSuccess: (data) => console.log('Loaded:', data)
  }
)
```

#### useMutation
Hook for POST/PUT/DELETE operations

```jsx
const { loading, error, mutate } = useMutation(
  patientApi.create,
  {
    onSuccess: (data) => alert('Created!'),
    onError: (err) => console.error(err)
  }
)

await mutate(formData)
```

#### useFileUpload
Hook for file uploads with progress

```jsx
const { loading, progress, upload } = useFileUpload(reportApi.uploadFile)

await upload(file, { patientId: '123' })
// progress: 0-100
```

## Common Patterns

### Pattern 1: Authentication Flow

```jsx
import { authApi } from '@/services/endpoints'
import { setAuthToken } from '@/services/apiClient'
import { useMutation } from '@/hooks/useApi'

function LoginPage() {
  const { loading, error, mutate: login } = useMutation(
    authApi.login,
    {
      onSuccess: (data) => {
        setAuthToken(data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/dashboard'
      }
    }
  )
  
  const handleSubmit = async (credentials) => {
    await login(credentials)
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit({ email, password })
    }}>
      {/* Form fields */}
    </form>
  )
}
```

### Pattern 2: Paginated List

```jsx
import { patientApi } from '@/services/endpoints'
import { useQuery } from '@/hooks/useApi'

function PatientList() {
  const [page, setPage] = useState(0)
  
  const { data, loading, refetch } = useQuery(
    patientApi.getAll,
    { params: { page, size: 10 } }
  )
  
  useEffect(() => {
    refetch()
  }, [page])
  
  return (
    <div>
      {data?.content.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
      
      <button onClick={() => setPage(page - 1)} disabled={page === 0}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  )
}
```

### Pattern 3: File Upload with Progress

```jsx
import { reportApi } from '@/services/endpoints'
import { useFileUpload } from '@/hooks/useApi'

function FileUploader() {
  const { loading, progress, error, upload } = useFileUpload(reportApi.uploadFile)
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await upload(file, { patientId: '123' })
    }
  }
  
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {loading && <div>Uploading... {progress}%</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

### Pattern 4: Sequential API Calls

```jsx
import { patientApi } from '@/services/endpoints'

async function loadPatientWithReports(patientId) {
  try {
    // 1. Get patient
    const patient = await patientApi.getById(patientId)
    
    // 2. Get patient's reports
    const reports = await patientApi.getReports(patientId)
    
    return { patient, reports }
  } catch (error) {
    console.error('Failed to load patient:', error)
    throw error
  }
}
```

### Pattern 5: Error Handling

```jsx
import { getErrorMessage, isRetriableError } from '@/utils/errorHandler'

function MyComponent() {
  const [error, setError] = useState(null)
  
  const loadData = async () => {
    try {
      const data = await patientApi.getAll()
      // Success
    } catch (err) {
      setError(err)
      
      // Show user-friendly message
      alert(getErrorMessage(err))
      
      // Check if retriable
      if (isRetriableError(err)) {
        // Show retry button
      }
    }
  }
  
  return (
    <div>
      {error && (
        <div className="error">
          {getErrorMessage(error)}
          {isRetriableError(error) && (
            <button onClick={loadData}>Retry</button>
          )}
        </div>
      )}
    </div>
  )
}
```

## Error Handling Best Practices

### 1. Always Handle Errors

```jsx
// ❌ Bad
const data = await patientApi.getAll()

// ✅ Good
try {
  const data = await patientApi.getAll()
} catch (error) {
  console.error('Failed to load patients:', error)
  // Show error to user
}
```

### 2. Use Hook Error States

```jsx
const { data, loading, error } = useQuery(patientApi.getAll)

if (error) {
  return <ErrorMessage error={error} />
}
```

### 3. Show User-Friendly Messages

```jsx
import { getErrorMessage } from '@/utils/errorHandler'

if (error) {
  return <div>{getErrorMessage(error)}</div>
}
```

### 4. Handle Specific Error Types

```jsx
try {
  await patientApi.create(data)
} catch (error) {
  if (error.type === 'VALIDATION_ERROR') {
    // Show validation errors
    setFormErrors(error.errors)
  } else if (error.type === 'UNAUTHORIZED') {
    // Redirect to login (handled automatically)
  } else {
    // Show generic error
    alert(error.message)
  }
}
```

## Testing

### Mock API Responses

```javascript
import { patientApi } from '@/services/endpoints'

jest.mock('@/services/endpoints', () => ({
  patientApi: {
    getAll: jest.fn(() => Promise.resolve({
      content: [{ id: '1', name: 'John Doe' }],
      totalPages: 1
    })),
    create: jest.fn(() => Promise.resolve({ id: '1' }))
  }
}))
```

### Test with Hooks

```jsx
import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from '@/hooks/useApi'
import { patientApi } from '@/services/endpoints'

test('loads patients', async () => {
  const { result } = renderHook(() => useQuery(patientApi.getAll))
  
  await waitFor(() => expect(result.current.loading).toBe(false))
  
  expect(result.current.data).toBeDefined()
  expect(result.current.error).toBeNull()
})
```

## Performance Optimization

### 1. Request Cancellation

```javascript
const controller = new AbortController()

try {
  const data = await patientApi.getAll({
    signal: controller.signal
  })
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request cancelled')
  }
}

// Cancel request
controller.abort()
```

### 2. Request Debouncing

```jsx
import { debounce } from 'lodash'

const searchPatients = debounce(async (query) => {
  const results = await patientApi.search(query)
  setResults(results)
}, 300)
```

### 3. Response Caching

```javascript
const cache = new Map()

const getCachedPatient = async (id) => {
  if (cache.has(id)) {
    return cache.get(id)
  }
  
  const patient = await patientApi.getById(id)
  cache.set(id, patient)
  return patient
}
```

## Troubleshooting

### Issue: 401 Unauthorized

**Solution**: Check token in localStorage and ensure it's valid

```javascript
const token = localStorage.getItem('accessToken')
console.log('Token:', token)
```

### Issue: CORS Errors

**Solution**: Configure Spring Boot CORS:

```java
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
          .allowedOrigins("http://localhost:5173")
          .allowedMethods("*")
          .allowedHeaders("*")
          .allowCredentials(true);
      }
    };
  }
}
```

### Issue: Network Timeout

**Solution**: Increase timeout in .env:

```
VITE_API_TIMEOUT=60000
```

### Issue: File Upload Fails

**Solution**: Check Spring Boot config:

```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

## Security Considerations

1. **Never commit .env files** - Use .env.example
2. **Token expiration** - Implement refresh token logic
3. **HTTPS in production** - Always use HTTPS
4. **Validate all inputs** - Client and server validation
5. **Sanitize file uploads** - Check file types and sizes

## Next Steps

1. Review examples in `ApiUsageExamples.jsx`
2. Configure environment variables in `.env`
3. Test authentication flow
4. Implement error notifications
5. Add request logging/monitoring
6. Set up response caching if needed

## Support

For issues or questions:
- Check error messages in browser console
- Review API response format in Network tab
- Verify Spring Boot backend is running
- Check JWT token validity
- Review CORS configuration
