# API Service Layer - Quick Reference

## 📁 Files Created

### Core Services
1. **apiClient.js** - Axios instance with JWT interceptors
2. **endpoints.js** - Centralized API endpoint definitions
3. **useApi.js** - React hooks for API calls
4. **API_INTEGRATION_GUIDE.md** - Complete integration documentation

### Examples
5. **ApiUsageExamples.jsx** - 8 working examples

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install axios
```

### 2. Configure Environment

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
```

### 3. Use in Components

```jsx
import { patientApi } from '@/services/endpoints'
import { useQuery } from '@/hooks/useApi'

function PatientList() {
  const { data, loading, error } = useQuery(patientApi.getAll)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {data?.content.map(patient => (
        <li key={patient.id}>{patient.name}</li>
      ))}
    </ul>
  )
}
```

## 🔑 Key Features

### ✅ JWT Token Management
- Automatic token injection from localStorage
- Auto-redirect on 401 Unauthorized
- Token refresh support

```javascript
import { setAuthToken, clearAuthToken } from '@/services/apiClient'

// After login
setAuthToken(response.accessToken)

// On logout
clearAuthToken()
```

### ✅ Centralized Error Handling
- User-friendly error messages
- Error type detection (UNAUTHORIZED, VALIDATION_ERROR, etc.)
- Retry logic for transient errors
- Automatic logging in development

```javascript
try {
  await patientApi.create(data)
} catch (error) {
  console.error(error.message) // User-friendly message
}
```

### ✅ Environment-Based URLs
- Development: `http://localhost:8080/api`
- Production: Configure in `.env`

### ✅ Request/Response Logging
- Automatic in development mode
- Request duration tracking
- Full request/response details

## 📚 Available APIs

```javascript
import api from '@/services/endpoints'

// Authentication
api.auth.login({ email, password })
api.auth.register({ email, password, role })
api.auth.logout()

// Patients
api.patient.getAll({ page: 0, size: 10 })
api.patient.getById(id)
api.patient.create(data)
api.patient.update(id, data)
api.patient.search(query)

// Doctors
api.doctor.getAll()
api.doctor.getById(id)
api.doctor.searchBySpecialty(specialty)

// Medical Reports
api.report.getAll()
api.report.uploadFile(formData, onProgress)
api.report.analyzeWithAI(id)

// Prescriptions
api.prescription.getAll()
api.prescription.create(data)

// Emergency Access
api.emergency.requestAccess(data)
api.emergency.approveAccess(requestId)

// AI Services
api.ai.checkSymptoms(symptomData)
api.ai.chat(message)
api.ai.extractText(formData)

// Notifications
api.notification.getAll()
api.notification.markAsRead(id)

// Analytics
api.analytics.getDashboardStats()
api.analytics.getPatientStats()

// Files
api.file.upload(formData, onProgress)
api.file.download(fileId)
```

## 🎣 React Hooks

### useQuery - Auto-fetching
```jsx
const { data, loading, error, refetch } = useQuery(
  patientApi.getAll,
  {
    enabled: true,
    params: { page: 0 },
    onSuccess: (data) => console.log('Loaded:', data)
  }
)
```

### useMutation - POST/PUT/DELETE
```jsx
const { loading, error, mutate } = useMutation(
  patientApi.create,
  {
    onSuccess: () => alert('Created!'),
    onError: (err) => console.error(err)
  }
)

await mutate(formData)
```

### useFileUpload - File uploads with progress
```jsx
const { loading, progress, upload } = useFileUpload(reportApi.uploadFile)

await upload(file, { patientId: '123' })
// progress: 0-100
```

## 🛠️ Common Patterns

### Pattern 1: Login Flow
```jsx
import { authApi } from '@/services/endpoints'
import { setAuthToken } from '@/services/apiClient'
import { useMutation } from '@/hooks/useApi'

const { mutate: login } = useMutation(authApi.login, {
  onSuccess: (data) => {
    setAuthToken(data.accessToken)
    window.location.href = '/dashboard'
  }
})

await login({ email, password })
```

### Pattern 2: Paginated List
```jsx
const [page, setPage] = useState(0)
const { data } = useQuery(patientApi.getAll, {
  params: { page, size: 10 }
})
```

### Pattern 3: File Upload with Progress
```jsx
const { progress, upload } = useFileUpload(reportApi.uploadFile)

await upload(file, { patientId: '123' })
// Shows progress: 0-100%
```

### Pattern 4: Error Handling
```jsx
import { getErrorMessage } from '@/utils/errorHandler'

const { error } = useQuery(patientApi.getAll)

if (error) {
  return <div>{getErrorMessage(error)}</div>
}
```

## 🔒 Security Features

1. **JWT Injection**: Automatic Bearer token on all requests
2. **Auto-Logout**: Clears tokens and redirects on 401
3. **HTTPS**: Environment-based URL configuration
4. **Token Refresh**: Built-in refresh token support
5. **Request Timeout**: 30s default (configurable)

## 📊 Error Types Handled

| Type | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Session expired (auto-redirect) |
| FORBIDDEN | 403 | No permission |
| NOT_FOUND | 404 | Resource not found |
| TIMEOUT | 408 | Request timeout |
| VALIDATION_ERROR | 422 | Form validation errors |
| RATE_LIMIT | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |
| NETWORK_ERROR | - | No internet connection |

## 📝 Example Components

See `ApiUsageExamples.jsx` for 8 complete examples:
1. Basic API call
2. Auto-fetching with useQuery
3. Create/Update with useMutation
4. File upload with progress
5. Authentication flow
6. Symptom checker integration
7. Paginated list with search
8. Sequential API calls

## 🧪 Testing

```javascript
// Mock API in tests
jest.mock('@/services/endpoints', () => ({
  patientApi: {
    getAll: jest.fn(() => Promise.resolve({ content: [] }))
  }
}))
```

## 📖 Documentation

Full documentation available in:
- `API_INTEGRATION_GUIDE.md` - Complete integration guide
- `ApiUsageExamples.jsx` - Working code examples
- `apiClient.js` - Inline code comments
- `endpoints.js` - API endpoint definitions

## 🚨 Troubleshooting

### 401 Unauthorized
- Check token: `localStorage.getItem('accessToken')`
- Verify token is valid
- Check token expiration

### CORS Errors
- Configure Spring Boot CORS for frontend URL
- Allow credentials and appropriate methods

### Network Timeout
- Increase timeout in `.env`: `VITE_API_TIMEOUT=60000`

### File Upload Fails
- Check Spring Boot: `spring.servlet.multipart.max-file-size`
- Verify file type/size limits

## ✅ Integration Checklist

- [ ] Install axios: `npm install axios`
- [ ] Create `.env` with API URL
- [ ] Copy service files to `src/services/`
- [ ] Copy hooks to `src/hooks/`
- [ ] Import and use in components
- [ ] Test authentication flow
- [ ] Verify error handling
- [ ] Test file uploads
- [ ] Configure Spring Boot CORS
- [ ] Test with backend

## 🎯 Next Steps

1. Configure `.env` with your backend URL
2. Test authentication with login/logout
3. Implement error notifications (toast/alert)
4. Add request caching if needed
5. Set up monitoring/analytics
6. Test all API endpoints
7. Add unit tests

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify Spring Boot backend is running
3. Check Network tab for API responses
4. Review JWT token in localStorage
5. Verify CORS configuration

---

**Status**: ✅ Complete & Ready for Integration

**Files**: 5 core files + 1 guide + 1 examples file

**Coverage**: Authentication, CRUD operations, File uploads, AI services, Error handling, Testing
