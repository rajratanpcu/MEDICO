# React Frontend Engineering Guide - Medical Assistant

## Overview

This guide provides comprehensive best practices and patterns for developing a scalable, maintainable React frontend for the Medical Assistant application using Tailwind CSS and modern tooling.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Component Development](#component-development)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Styling & UI](#styling--ui)
7. [Performance](#performance)
8. [Testing](#testing)
9. [Common Patterns](#common-patterns)
10. [Development Workflow](#development-workflow)

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Pages (Route Views)         │
├─────────────────────────────────────┤
│      Containers (Data Fetching)     │
├─────────────────────────────────────┤
│   Components (UI + Business Logic)  │
├─────────────────────────────────────┤
│      Hooks (Logic Reusability)      │
├─────────────────────────────────────┤
│   Services (API Communication)      │
├─────────────────────────────────────┤
│      Context (Global State)         │
├─────────────────────────────────────┤
│      Utils (Helper Functions)       │
└─────────────────────────────────────┘
```

### Data Flow

```
User Action (Click, Submit)
        ↓
Component Handler
        ↓
Service Call / Hook Mutation
        ↓
API Request
        ↓
Backend Processing
        ↓
API Response
        ↓
State Update (Context/React Query)
        ↓
Component Re-render
        ↓
UI Update
```

---

## Project Structure

### Organized by Feature

```
src/
├── components/
│   ├── common/        # Shared UI components
│   ├── layout/        # Page layout components
│   ├── patient/       # Patient feature components
│   ├── doctor/        # Doctor feature components
│   ├── ai/            # AI feature components
│   └── auth/          # Auth components
├── pages/             # Page components for routes
├── services/          # API communication layer
├── hooks/             # Custom React hooks
├── context/           # Global state (Auth, Theme)
├── utils/             # Helper functions
├── constants/         # App constants
├── styles/            # Global styles
└── types/             # TypeScript definitions
```

### Benefits

- **Scalability**: Easy to add new features
- **Maintainability**: Related code grouped together
- **Reusability**: Shared components in `common/`
- **Discoverability**: Clear organization

---

## Component Development

### 1. Component Types

#### Presentational Component
```javascript
// Stateless, receives data via props
const PatientCard = ({ patient, onSelect }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3>{patient.firstName} {patient.lastName}</h3>
      <p>{patient.email}</p>
      <button onClick={() => onSelect(patient.id)}>View</button>
    </div>
  )
}
export default PatientCard
```

#### Container Component
```javascript
// Manages state, fetches data, passes to presentational
import { usePatients } from '@/hooks'
import { PatientCard } from '@/components/patient'

const PatientList = () => {
  const { data: patients, isLoading, error } = usePatients()

  if (isLoading) return <Loader />
  if (error) return <Alert type="error" message="Failed to load patients" />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {patients.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  )
}
export default PatientList
```

### 2. Component Composition

```javascript
// ❌ Bad: Large monolithic component
const PatientDetails = () => {
  // 500+ lines of code mixing UI, logic, fetching
}

// ✅ Good: Composed from smaller components
const PatientDetails = () => (
  <div>
    <PatientInfo />
    <MedicalHistory />
    <PrescriptionsList />
    <ReportsList />
  </div>
)
```

### 3. Props Validation

```javascript
import PropTypes from 'prop-types'

const PatientCard = ({ patient, onSelect }) => (
  // Component code
)

PatientCard.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.required,
    firstName: PropTypes.string.required,
    lastName: PropTypes.string.required,
    email: PropTypes.string.required,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
}

PatientCard.defaultProps = {
  onSelect: () => {},
}
```

### 4. Component Naming

| Type | Example | Pattern |
|------|---------|---------|
| Container | `PatientList.jsx` | Feature + Component type |
| Presentational | `PatientCard.jsx` | Descriptive name |
| Layout | `DashboardLayout.jsx` | Feature + Layout |
| HOC | `withAuth.jsx` | `with` prefix |
| Hook | `usePatients.js` | `use` prefix |

---

## State Management

### 1. Local State (useState)

```javascript
const PatientForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
    </form>
  )
}
```

### 2. Global State (Context)

```javascript
// Define context
import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Use context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// In component
const MyComponent = () => {
  const { user, login, logout } = useAuth()
  // ...
}
```

### 3. Server State (React Query)

```javascript
// Define hook
export const usePatients = (filters = {}) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getPatients(filters),
    staleTime: 5 * 60 * 1000,           // 5 minutes
    cacheTime: 10 * 60 * 1000,          // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// In component
const PatientList = () => {
  const { data, isLoading, error, refetch } = usePatients()

  if (isLoading) return <Loader />
  if (error) return <Alert type="error" message={error.message} />

  return (
    <>
      {data.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </>
  )
}
```

### 4. Form State (Custom Hook)

```javascript
const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ... implementation

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  }
}

// Usage
const LoginForm = () => {
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (values) => {
      await authService.login(values.email, values.password)
    },
    {
      email: validateEmail,
      password: validatePassword,
    }
  )

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}
    </form>
  )
}
```

---

## API Integration

### 1. Service Layer Pattern

```javascript
// src/services/patientService.js
import apiClient from './api'

const patientService = {
  // Get all patients with filters
  getPatients: async (filters = {}) => {
    const response = await apiClient.get('/patients', { params: filters })
    return response.data
  },

  // Get single patient
  getPatientById: async (id) => {
    const response = await apiClient.get(`/patients/${id}`)
    return response.data
  },

  // Create patient
  createPatient: async (patientData) => {
    const response = await apiClient.post('/patients', patientData)
    return response.data
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(`/patients/${id}`, patientData)
    return response.data
  },

  // Delete patient
  deletePatient: async (id) => {
    await apiClient.delete(`/patients/${id}`)
  },
}

export default patientService
```

### 2. Axios Instance with Interceptors

```javascript
// src/services/api.js
import axios from 'axios'
import { storageManager } from '@/utils'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = storageManager.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired
      storageManager.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### 3. Error Handling

```javascript
import { handleApiError } from '@/utils/errorHandler'

const MyComponent = () => {
  const { mutate } = useMutation({
    mutationFn: (data) => patientService.createPatient(data),
    onError: (error) => {
      const message = handleApiError(error)
      showToast({ type: 'error', message })
    },
    onSuccess: () => {
      showToast({ type: 'success', message: 'Patient created' })
    },
  })

  return <button onClick={() => mutate(formData)}>Create</button>
}
```

---

## Styling & UI

### 1. Tailwind CSS Utilities

```javascript
// Using Tailwind classes directly
const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-6">
    {children}
  </div>
)

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Item key={item.id} item={item} />)}
</div>

// Conditional styles
<div className={`p-4 rounded ${
  status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100'
}`}>
  Status: {status}
</div>
```

### 2. Medical App Color Scheme

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        critical: '#dc2626',
      },
    },
  },
}
```

### 3. Responsive Design

```javascript
// Mobile-first approach
<div className="
  grid
  grid-cols-1        /* Mobile: 1 column */
  md:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-3     /* Desktop: 3 columns */
  gap-4              /* Consistent spacing */
">
  {items.map(item => <Item key={item.id} item={item} />)}
</div>

// Text responsive
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Heading
</h1>

// Padding responsive
<div className="px-4 md:px-8 lg:px-12">
  Content with responsive padding
</div>
```

### 4. Component Variants with clsx/cn

```javascript
import clsx from 'clsx'

const Button = ({ variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-error text-white hover:bg-error/90',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={clsx(
        'rounded-lg font-medium transition-colors',
        variants[variant],
        sizes[size]
      )}
      {...props}
    />
  )
}
```

---

## Performance

### 1. Code Splitting

```javascript
import { lazy, Suspense } from 'react'
import { Loader } from '@/components/common'

// Lazy load pages
const PatientDashboard = lazy(() => import('@/pages/patient/PatientDashboard'))
const DoctorDashboard = lazy(() => import('@/pages/doctor/DoctorDashboard'))

// Use with Suspense
<Suspense fallback={<Loader fullScreen message="Loading..." />}>
  <Routes>
    <Route path="/patient/dashboard" element={<PatientDashboard />} />
    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
  </Routes>
</Suspense>
```

### 2. Memoization

```javascript
import { memo, useMemo, useCallback } from 'react'

// Prevent unnecessary re-renders
const PatientCard = memo(({ patient, onSelect }) => (
  <div onClick={() => onSelect(patient.id)}>
    {patient.firstName} {patient.lastName}
  </div>
), (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.patient.id === nextProps.patient.id
})

// Memoize expensive computations
const PatientList = ({ patients, filter }) => {
  const filteredPatients = useMemo(
    () => patients.filter(p => p.status === filter),
    [patients, filter]
  )

  // Stable function reference
  const handleSelect = useCallback(
    (id) => console.log('Selected:', id),
    []
  )

  return <div>{filteredPatients.map(p => ...)}</div>
}
```

### 3. Image Optimization

```javascript
// Use WebP format with fallback
<picture>
  <source srcSet="patient.webp" type="image/webp" />
  <img src="patient.jpg" alt="Patient" />
</picture>

// Lazy load images
<img src="patient.jpg" alt="Patient" loading="lazy" />

// Optimize with sizes attribute
<img
  src="patient.jpg"
  srcSet="patient-small.jpg 480w, patient-large.jpg 1024w"
  sizes="(max-width: 768px) 480px, 1024px"
  alt="Patient"
/>
```

### 4. Query Optimization

```javascript
// React Query deduplication
const usePatients = (filters = {}) => {
  return useQuery({
    queryKey: ['patients', filters],  // Unique key prevents duplicate requests
    queryFn: () => patientService.getPatients(filters),
    staleTime: 5 * 60 * 1000,         // Don't refetch frequently
    cacheTime: 10 * 60 * 1000,        // Keep data in memory
  })
}

// Background refetch when window regains focus
refetchOnWindowFocus: true

// Don't refetch on mount if data is fresh
refetchOnMount: 'stale'
```

---

## Testing

### 1. Unit Tests

```javascript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/common'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>)
    expect(screen.getByText(/Loading/)).toBeInTheDocument()
  })
})
```

### 2. Integration Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import PatientForm from '@/components/patient/PatientForm'

const queryClient = new QueryClient()

describe('PatientForm Integration', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <PatientForm onSubmit={jest.fn()} />
      </QueryClientProvider>
    )

    await user.type(screen.getByLabelText(/First Name/i), 'John')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.click(screen.getByRole('button', { name: /Submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Success/i)).toBeInTheDocument()
    })
  })
})
```

### 3. Hook Tests

```javascript
import { renderHook, act } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { usePatients } from '@/hooks'

const queryClient = new QueryClient()

describe('usePatients Hook', () => {
  it('fetches patients', async () => {
    const { result } = renderHook(() => usePatients(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeDefined()
    })
  })
})
```

---

## Common Patterns

### 1. Protected Route Pattern

```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

// Usage
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 2. Form Handling Pattern

```javascript
const PatientForm = () => {
  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
    },
    async (values) => {
      await patientService.createPatient(values)
      showToast({ type: 'success', message: 'Patient created' })
    },
    {
      email: validateEmail,
      dateOfBirth: (dob) => validateAge(dob, 18, 120),
    }
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          className="input"
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>
      <button type="submit" className="button">Submit</button>
    </form>
  )
}
```

### 3. List with Filters Pattern

```javascript
const PatientList = () => {
  const [filters, setFilters] = useState({ status: 'ACTIVE', search: '' })
  const debouncedSearch = useDebounce(filters.search, 300)
  const { data: patients, isLoading } = usePatients({
    status: filters.status,
    search: debouncedSearch,
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          placeholder="Search patients"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            search: e.target.value
          }))}
          className="input flex-1"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            status: e.target.value
          }))}
          className="input"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid gap-4">
          {patients?.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### 4. Data Loading States Pattern

```javascript
const PatientDetails = ({ patientId }) => {
  const { data, isLoading, error, refetch } = usePatientById(patientId)

  if (isLoading) {
    return <Loader message="Loading patient details..." />
  }

  if (error) {
    return (
      <Alert
        type="error"
        message={`Error: ${error.message}`}
        onClose={() => refetch()}
      />
    )
  }

  if (!data) {
    return <Alert type="info" message="No patient data found" />
  }

  return <PatientDetailedInfo patient={data} />
}
```

---

## Development Workflow

### 1. Feature Development Steps

1. **Create feature folder**
   ```
   src/
   ├── components/patient/
   │   ├── PatientForm.jsx
   │   ├── PatientList.jsx
   │   └── index.js
   ├── pages/patient/
   │   ├── PatientDetailsPage.jsx
   │   └── index.js
   └── hooks/
       ├── usePatients.js
       └── index.js
   ```

2. **Create service layer**
   ```javascript
   // src/services/patientService.js
   const patientService = {
     getPatients: async () => {...},
     getPatientById: async (id) => {...},
     createPatient: async (data) => {...},
     updatePatient: async (id, data) => {...},
   }
   ```

3. **Create custom hooks**
   ```javascript
   // src/hooks/usePatients.js
   export const usePatients = () => useQuery({...})
   export const usePatientById = (id) => useQuery({...})
   ```

4. **Build components (small → large)**
   - Small presentational components
   - Composed container components
   - Page components

5. **Add routing**
   ```javascript
   <Route path="/patients" element={<PatientListPage />} />
   <Route path="/patients/:id" element={<PatientDetailsPage />} />
   ```

6. **Write tests**
   - Component unit tests
   - Hook tests
   - Integration tests

### 2. Git Workflow

```bash
# Create feature branch
git checkout -b feature/patient-management

# Make changes and commit
git add .
git commit -m "feat: add patient list with filters"

# Push and create pull request
git push origin feature/patient-management

# After review, merge to main
git checkout main
git pull
git merge feature/patient-management
```

### 3. Code Review Checklist

- [ ] Components are reusable and focused
- [ ] No prop drilling (use Context for deep nesting)
- [ ] Proper error handling
- [ ] Loading states handled
- [ ] Responsive design verified
- [ ] Accessibility considered (alt text, labels)
- [ ] Performance optimized (memoization, lazy loading)
- [ ] Tests written
- [ ] No console errors/warnings

### 4. Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Deploy to hosting
# (Netlify, Vercel, AWS S3, etc.)
```

---

## Best Practices Summary

### Do's ✅
- Keep components small and focused
- Use custom hooks for logic reuse
- Implement proper error handling
- Use React Query for server state
- Lazy load pages with React.lazy()
- Optimize images
- Write accessible markup
- Test critical functionality
- Use TypeScript for type safety
- Implement loading/error states

### Don'ts ❌
- Don't mix data fetching and UI
- Don't prop drill deeply
- Don't create context for everything
- Don't ignore performance
- Don't forget error boundaries
- Don't skip tests
- Don't hardcode values
- Don't make components too large
- Don't ignore accessibility
- Don't use console.log in production

---

## Resources

- [React Documentation](https://react.dev)
- [React Query Docs](https://tanstack.com/query/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Testing Library](https://testing-library.com/react)
- [Vite Guide](https://vitejs.dev)

---

**Last Updated**: January 2026
**Version**: 1.0.0
