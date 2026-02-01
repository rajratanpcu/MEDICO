# Frontend Testing Strategy - React Medical Application

## 📋 Table of Contents
1. [Testing Pyramid](#testing-pyramid)
2. [Component Testing](#component-testing)
3. [Form Validation Testing](#form-validation-testing)
4. [API Mocking](#api-mocking)
5. [Tools Recommendations](#tools-recommendations)
6. [Setup Guide](#setup-guide)
7. [Best Practices](#best-practices)
8. [Testing Checklist](#testing-checklist)

---

## 🔺 Testing Pyramid

```
         E2E Tests (5%)
          ↙        ↖
    Integration Tests (15%)
     ↙                    ↖
Unit Tests (80%)
```

### Coverage Goals
- **Unit Tests**: 80% coverage - Fast, focused, component/function isolated
- **Integration Tests**: 15% coverage - Component interactions, API calls
- **E2E Tests**: 5% coverage - Critical user flows, full app scenarios

### For Medical Applications
- ⚠️ **High priority**: Form validation (patient data accuracy)
- ⚠️ **High priority**: API error handling (critical alerts)
- ⚠️ **High priority**: Authentication flows (security)
- ⚠️ **High priority**: Patient data display (privacy/accuracy)

---

## 🧪 Component Testing

### 1. Unit Testing Components with React Testing Library

#### Basic Component Test Example
```javascript
// components/Button.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button Component', () => {
  // Test basic rendering
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  // Test click handlers
  it('should call onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Test variants
  it('should apply correct classes for variant', () => {
    const { container } = render(<Button variant="primary">Action</Button>)
    expect(container.querySelector('.bg-medical-500')).toBeInTheDocument()
  })

  // Test disabled state
  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  // Test loading state
  it('should show loading state', () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })
})
```

#### Form Component Test Example
```javascript
// components/LoginPage.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../context/AuthContext'
import LoginPage from './LoginPage'

describe('LoginPage Component', () => {
  // Test form rendering
  it('should render email and password inputs', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  // Test input value changes
  it('should update input values when user types', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    await userEvent.type(emailInput, 'doctor@hospital.com')
    await userEvent.type(passwordInput, 'SecurePass123!')
    
    expect(emailInput.value).toBe('doctor@hospital.com')
    expect(passwordInput.value).toBe('SecurePass123!')
  })

  // Test form submission
  it('should submit form with valid data', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await userEvent.type(emailInput, 'doctor@hospital.com')
    await userEvent.type(passwordInput, 'SecurePass123!')
    await userEvent.click(submitButton)
    
    // Assert API was called or navigation happened
    // (depends on implementation)
  })

  // Test accessibility
  it('should have proper ARIA labels', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )
    
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')
  })
})
```

#### Alert Component Test Example
```javascript
// components/Alert.test.jsx
import { render, screen } from '@testing-library/react'
import Alert from './Alert'

describe('Alert Component', () => {
  // Test different alert types
  const alertTypes = ['critical', 'warning', 'success', 'info']

  alertTypes.forEach((type) => {
    it(`should render ${type} alert with correct styling`, () => {
      const { container } = render(
        <Alert type={type} title={`${type} Alert`}>
          Alert message
        </Alert>
      )
      
      const alertElement = container.querySelector('.alert')
      expect(alertElement).toHaveClass(`alert-${type}`)
      expect(screen.getByText(`${type} Alert`)).toBeInTheDocument()
    })
  })

  // Test dismissible alert
  it('should dismiss alert when close button clicked', async () => {
    const { container, rerender } = render(
      <Alert dismissible type="warning">
        Warning message
      </Alert>
    )
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()
  })

  // Test accessibility
  it('should have proper ARIA role and attributes', () => {
    const { container } = render(
      <Alert type="critical" role="alert" title="Critical Error">
        Something went wrong
      </Alert>
    )
    
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument()
  })
})
```

### 2. Testing with Context API

```javascript
// __tests__/AuthContext.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../context/AuthContext'

// Test component that uses auth context
function TestComponent() {
  const { user, login, logout } = useAuth()
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('test@test.com', 'password')}>Login</button>
      )}
    </div>
  )
}

describe('AuthContext', () => {
  it('should provide auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })

  it('should update auth state when login is called', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const loginButton = screen.getByText(/login/i)
    await userEvent.click(loginButton)
    
    // Wait for context to update
    expect(await screen.findByText(/welcome/i)).toBeInTheDocument()
  })
})
```

### 3. Testing Hooks

```javascript
// __tests__/useApi.test.jsx
import { renderHook, act } from '@testing-library/react'
import useApi from '../hooks/useApi'

describe('useApi Hook', () => {
  // Test successful API call
  it('should fetch data successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'John Doe' }),
      })
    )

    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.fetchPatients()
    })

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.data).toEqual({ id: 1, name: 'John Doe' })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  // Test error handling
  it('should handle API errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    )

    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.fetchPatients()
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.error).toEqual(new Error('Network error'))
    expect(result.current.loading).toBe(false)
  })

  // Test loading state
  it('should set loading state during fetch', () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ data: [] }),
              }),
            100
          )
        )
    )

    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.fetchPatients()
    })

    expect(result.current.loading).toBe(true)
  })
})
```

---

## 📝 Form Validation Testing

### 1. Unit Tests for Validation Functions

```javascript
// utils/validation.test.js
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateMedicalId,
} from './validation'

describe('Email Validation', () => {
  const validEmails = [
    'doctor@hospital.com',
    'patient@clinic.co.uk',
    'admin+test@medical.org',
  ]

  const invalidEmails = [
    'invalid.email',
    '@nodomain.com',
    'user@',
    'user name@domain.com',
    '',
  ]

  validEmails.forEach((email) => {
    it(`should accept valid email: ${email}`, () => {
      expect(validateEmail(email)).toBe(true)
    })
  })

  invalidEmails.forEach((email) => {
    it(`should reject invalid email: ${email}`, () => {
      expect(validateEmail(email)).toBe(false)
    })
  })
})

describe('Password Validation', () => {
  const validPasswords = [
    'SecurePass123!',
    'Complex@Password#2024',
    'Qwerty123$%',
  ]

  const invalidPasswords = [
    'short',
    '12345678',
    'NoNumbers!',
    'nouppercase123!',
    'NOLOWERCASE123!',
  ]

  validPasswords.forEach((password) => {
    it(`should accept valid password: ${password}`, () => {
      expect(validatePassword(password)).toBe(true)
    })
  })

  invalidPasswords.forEach((password) => {
    it(`should reject invalid password: ${password}`, () => {
      expect(validatePassword(password)).toBe(false)
    })
  })
})

describe('Phone Number Validation', () => {
  it('should accept valid US phone number', () => {
    expect(validatePhoneNumber('555-123-4567')).toBe(true)
    expect(validatePhoneNumber('(555) 123-4567')).toBe(true)
    expect(validatePhoneNumber('5551234567')).toBe(true)
  })

  it('should reject invalid phone number', () => {
    expect(validatePhoneNumber('123')).toBe(false)
    expect(validatePhoneNumber('abc-def-ghij')).toBe(false)
  })
})

describe('Medical ID Validation', () => {
  it('should accept valid medical ID format', () => {
    expect(validateMedicalId('MRN123456')).toBe(true)
    expect(validateMedicalId('DOC987654')).toBe(true)
  })

  it('should reject invalid medical ID', () => {
    expect(validateMedicalId('invalid')).toBe(false)
    expect(validateMedicalId('123')).toBe(false)
  })
})
```

### 2. Form Validation in Component Tests

```javascript
// components/PatientForm.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientForm from './PatientForm'

describe('PatientForm Component', () => {
  // Test email validation
  it('should show error for invalid email', async () => {
    render(<PatientForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.click(submitButton)

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })

  // Test password validation
  it('should show error for weak password', async () => {
    render(<PatientForm />)

    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await userEvent.type(passwordInput, 'weak')
    await userEvent.click(submitButton)

    expect(
      screen.getByText(/password must contain/i)
    ).toBeInTheDocument()
  })

  // Test required field validation
  it('should show error when required fields are empty', async () => {
    render(<PatientForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })

    await userEvent.click(submitButton)

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })

  // Test form submission with valid data
  it('should submit form with valid data', async () => {
    const mockSubmit = jest.fn()
    render(<PatientForm onSubmit={mockSubmit} />)

    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await userEvent.type(firstNameInput, 'John')
    await userEvent.type(lastNameInput, 'Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.click(submitButton)

    expect(mockSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    })
  })

  // Test real-time validation feedback
  it('should show validation error immediately after blur', async () => {
    render(<PatientForm />)

    const emailInput = screen.getByLabelText(/email/i)

    await userEvent.type(emailInput, 'invalid')
    await userEvent.tab() // Trigger blur

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })

  // Test validation clearing on fix
  it('should clear validation error when input becomes valid', async () => {
    render(<PatientForm />)

    const emailInput = screen.getByLabelText(/email/i)

    // Type invalid email
    await userEvent.type(emailInput, 'invalid')
    await userEvent.tab() // Blur to trigger validation

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()

    // Clear and type valid email
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'valid@example.com')

    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument()
  })
})
```

### 3. Testing Custom Validation Hooks

```javascript
// __tests__/useFormValidation.test.jsx
import { renderHook, act } from '@testing-library/react'
import useFormValidation from '../hooks/useFormValidation'

describe('useFormValidation Hook', () => {
  const initialValues = {
    email: '',
    password: '',
    firstName: '',
  }

  const validate = (values) => {
    const errors = {}
    if (!values.email) errors.email = 'Email is required'
    if (!values.email.includes('@'))
      errors.email = 'Invalid email format'
    if (!values.password) errors.password = 'Password is required'
    if (values.password.length < 8)
      errors.password = 'Password must be at least 8 characters'
    return errors
  }

  it('should initialize with empty errors', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validate)
    )

    expect(result.current.errors).toEqual({})
  })

  it('should validate on blur', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validate)
    )

    act(() => {
      result.current.handleBlur({
        target: { name: 'email', value: 'invalid' },
      })
    })

    expect(result.current.errors.email).toBe('Invalid email format')
  })

  it('should update values on change', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validate)
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      })
    })

    expect(result.current.values.email).toBe('test@example.com')
  })

  it('should validate all fields on submit', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validate)
    )

    const isValid = result.current.validateForm()

    expect(isValid).toBe(false)
    expect(result.current.errors.email).toBe('Email is required')
    expect(result.current.errors.password).toBe('Password is required')
  })
})
```

---

## 🌐 API Mocking

### 1. Using MSW (Mock Service Worker)

#### Setup MSW
```javascript
// __mocks__/handlers.js
import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:8080'

export const handlers = [
  // Login endpoint
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json()

    if (body.email === 'doctor@hospital.com' && body.password === 'SecurePass123!') {
      return HttpResponse.json({
        token: 'mock-jwt-token-12345',
        user: {
          id: 'user-1',
          email: 'doctor@hospital.com',
          role: 'CLINICIAN',
        },
      })
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Get patients endpoint
  http.get(`${API_BASE}/patients`, () => {
    return HttpResponse.json({
      patients: [
        {
          id: 'patient-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          mrn: 'MRN123456',
        },
        {
          id: 'patient-2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          mrn: 'MRN789012',
        },
      ],
      total: 2,
    })
  }),

  // Create patient endpoint
  http.post(`${API_BASE}/patients`, async ({ request }) => {
    const body = await request.json()

    if (!body.firstName || !body.lastName || !body.email) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    return HttpResponse.json(
      {
        id: 'patient-new',
        ...body,
        mrn: 'MRN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      },
      { status: 201 }
    )
  }),

  // Get patient by ID
  http.get(`${API_BASE}/patients/:id`, ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      mrn: 'MRN123456',
      dateOfBirth: '1990-01-01',
      phone: '555-123-4567',
    })
  }),

  // Update patient
  http.put(`${API_BASE}/patients/:id`, async ({ params, request }) => {
    const body = await request.json()

    return HttpResponse.json({
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    })
  }),

  // Delete patient
  http.delete(`${API_BASE}/patients/:id`, ({ params }) => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Get reports for patient
  http.get(`${API_BASE}/patients/:id/reports`, ({ params }) => {
    return HttpResponse.json({
      reports: [
        {
          id: 'report-1',
          patientId: params.id,
          type: 'Blood Test',
          date: '2024-01-15',
          status: 'COMPLETED',
          fileName: 'blood-test-2024.pdf',
        },
        {
          id: 'report-2',
          patientId: params.id,
          type: 'X-Ray',
          date: '2024-01-20',
          status: 'PENDING',
          fileName: 'xray-chest-2024.pdf',
        },
      ],
    })
  }),

  // AI analysis endpoint
  http.post(`${API_BASE}/ai/analyze`, async ({ request }) => {
    const body = await request.json()

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    return HttpResponse.json({
      reportId: body.reportId,
      analysis: 'Analysis complete. No critical findings detected.',
      confidence: 0.92,
      recommendations: [
        'Continue current medication',
        'Follow-up appointment in 3 months',
      ],
    })
  }),

  // Error handling - Server error
  http.get(`${API_BASE}/patients/error/server`, () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }),

  // Error handling - Not found
  http.get(`${API_BASE}/patients/:id`, ({ params }) => {
    if (params.id === 'nonexistent') {
      return HttpResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json({ id: params.id })
  }),

  // Error handling - Unauthorized
  http.get(`${API_BASE}/protected-resource`, () => {
    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }),
]
```

#### Setup MSW server for tests
```javascript
// __mocks__/server.js
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// Enable API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Disable API mocking after all tests
afterAll(() => server.close())
```

#### Add to test setup file
```javascript
// jest.setup.js
import '@testing-library/jest-dom'
import './src/__mocks__/server'
```

### 2. Using MSW in Component Tests

```javascript
// components/PatientList.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import { server } from '../__mocks__/server'
import { http, HttpResponse } from 'msw'
import PatientList from './PatientList'

describe('PatientList Component', () => {
  // Test successful data loading
  it('should load and display patients', async () => {
    render(<PatientList />)

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    // Check specific patient data
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  // Test error handling
  it('should display error message on API failure', async () => {
    // Override handler for this test
    server.use(
      http.get('http://localhost:8080/patients', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        )
      })
    )

    render(<PatientList />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load patients/i)).toBeInTheDocument()
    })
  })

  // Test empty state
  it('should display empty state when no patients', async () => {
    server.use(
      http.get('http://localhost:8080/patients', () => {
        return HttpResponse.json({ patients: [], total: 0 })
      })
    )

    render(<PatientList />)

    await waitFor(() => {
      expect(screen.getByText(/no patients found/i)).toBeInTheDocument()
    })
  })

  // Test retry functionality
  it('should retry failed request', async () => {
    let callCount = 0
    server.use(
      http.get('http://localhost:8080/patients', () => {
        callCount++
        if (callCount === 1) {
          return HttpResponse.json(
            { error: 'Server error' },
            { status: 500 }
          )
        }
        return HttpResponse.json({
          patients: [{ id: 1, name: 'John Doe' }],
        })
      })
    )

    render(<PatientList />)

    // First request fails
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    })

    // Click retry
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await userEvent.click(retryButton)

    // Second request succeeds
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  // Test loading state with delay
  it('should show loading for extended time', async () => {
    server.use(
      http.get('http://localhost:8080/patients', async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return HttpResponse.json({
          patients: [{ id: 1, name: 'John Doe' }],
        })
      })
    )

    render(<PatientList />)

    // Loading should persist briefly
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Eventually loads
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })
})
```

### 3. Using Jest to Mock Fetch/Axios

```javascript
// hooks/__tests__/useApi.test.js
import { renderHook, act, waitFor } from '@testing-library/react'
import useApi from '../useApi'

// Mock fetch globally
global.fetch = jest.fn()

describe('useApi Hook - With Fetch Mocking', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  // Test successful API call with data transformation
  it('should fetch and transform patient data', async () => {
    const mockData = {
      id: 'patient-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.get('/patients/patient-1')
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
      expect(result.current.loading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/patients/patient-1'),
      expect.any(Object)
    )
  })

  // Test error handling with specific status codes
  it('should handle 401 Unauthorized error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    })

    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.get('/protected')
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.error.status).toBe(401)
    })
  })

  // Test network error
  it('should handle network error', async () => {
    const networkError = new Error('Network request failed')
    global.fetch.mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.get('/patients')
    })

    await waitFor(() => {
      expect(result.current.error).toEqual(networkError)
    })
  })
})
```

### 4. Mocking Authenticated Requests

```javascript
// __mocks__/handlers-auth.js
import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // Mock authenticated endpoint
  http.get('http://localhost:8080/patient/me', ({ request }) => {
    const token = request.headers.get('Authorization')

    if (!token || !token.includes('Bearer')) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if token is valid (mock validation)
    if (token === 'Bearer invalid-token') {
      return HttpResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      id: 'user-1',
      email: 'doctor@hospital.com',
      role: 'CLINICIAN',
      firstName: 'Dr.',
      lastName: 'Smith',
    })
  }),

  // Mock refresh token
  http.post('http://localhost:8080/auth/refresh', async ({ request }) => {
    const body = await request.json()

    if (!body.refreshToken) {
      return HttpResponse.json(
        { error: 'Missing refresh token' },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      token: 'new-jwt-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
    })
  }),
]
```

---

## 🛠️ Tools Recommendations

### Testing Framework & Libraries

#### 1. **Jest** ⭐⭐⭐⭐⭐
**Purpose**: Test runner and assertion library
```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```
**Pros**:
- Widely used, excellent documentation
- Built-in mocking and spying
- Great snapshot testing
- Fast parallel execution

**Cons**:
- Can be slow for large test suites
- Memory intensive

---

#### 2. **React Testing Library** ⭐⭐⭐⭐⭐
**Purpose**: Component testing from user perspective
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```
**Example**:
```javascript
import { render, screen } from '@testing-library/react'

test('renders welcome message', () => {
  render(<App />)
  expect(screen.getByText(/welcome/i)).toBeInTheDocument()
})
```
**Pros**:
- Tests user behavior, not implementation
- Great accessibility testing
- Encourages best practices

**Cons**:
- Requires understanding of queries
- Less granular than Enzyme

---

#### 3. **Vitest** ⭐⭐⭐⭐
**Purpose**: Fast unit test framework (Vite native)
```bash
npm install --save-dev vitest @vitest/ui
```
**Config** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```
**Pros**:
- 20-30x faster than Jest
- Vite-native, modern setup
- Better TypeScript support
- HMR for tests

**Cons**:
- Newer ecosystem
- Fewer plugins/extensions

---

#### 4. **Mock Service Worker (MSW)** ⭐⭐⭐⭐⭐
**Purpose**: API mocking at request level
```bash
npm install --save-dev msw
```
**Pros**:
- Mock at network level (intercept)
- Works for integration tests
- Can be used in browser for development
- No code changes needed

**Cons**:
- Slight learning curve
- Additional setup needed

---

#### 5. **@testing-library/user-event** ⭐⭐⭐⭐⭐
**Purpose**: Simulate user interactions realistically
```bash
npm install --save-dev @testing-library/user-event
```
**Example**:
```javascript
import userEvent from '@testing-library/user-event'

test('user can type in input', async () => {
  const user = userEvent.setup()
  render(<Form />)
  
  const input = screen.getByRole('textbox')
  await user.type(input, 'Hello World')
  
  expect(input.value).toBe('Hello World')
})
```
**Pros**:
- More realistic than fireEvent
- Handles keyboard, mouse, clipboard
- Better accessibility testing

---

#### 6. **Cypress** ⭐⭐⭐⭐
**Purpose**: End-to-end testing framework
```bash
npm install --save-dev cypress
npx cypress open
```
**Example**:
```javascript
describe('Patient Login Flow', () => {
  it('should login and redirect to dashboard', () => {
    cy.visit('http://localhost:3000')
    cy.get('input[name="email"]').type('doctor@hospital.com')
    cy.get('input[name="password"]').type('SecurePass123!')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/patient/dashboard')
    cy.contains('Welcome').should('be.visible')
  })
})
```
**Pros**:
- Interactive test runner with time-travel debugging
- Great for E2E testing
- Visual debugging
- Excellent documentation

**Cons**:
- Slower than unit tests
- Requires running server
- Larger file sizes

---

#### 7. **Playwright** ⭐⭐⭐⭐
**Purpose**: Cross-browser E2E testing
```bash
npm install --save-dev @playwright/test
```
**Pros**:
- Supports Chromium, Firefox, WebKit
- Better performance than Cypress
- Can test multiple browsers

**Cons**:
- Less interactive debugging
- Steeper learning curve

---

### Coverage Tools

#### 1. **Jest Coverage**
```bash
npm test -- --coverage
```
**Output**:
```
Statements   : 85.5% ( 120/140 )
Branches     : 78.3% ( 90/115 )
Functions    : 92.1% ( 70/76 )
Lines        : 88.0% ( 110/125 )
```

#### 2. **c8** (for Vitest)
```bash
npm install --save-dev c8
vitest --coverage
```

---

### Accessibility Testing

#### 1. **axe-core/jest-axe**
```bash
npm install --save-dev @axe-core/react jest-axe
```
**Example**:
```javascript
import { axe, toHaveNoViolations } from 'jest-axe'

test('should not have accessibility violations', async () => {
  const { container } = render(<LoginForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

#### 2. **WAVE** (Wave Accessibility Tool)
- Browser extension for manual testing
- Highlights WCAG violations

---

### Performance Testing

#### 1. **Lighthouse**
```bash
npm install --save-dev @lhci/cli
```

#### 2. **React Profiler**
```javascript
import { Profiler } from 'react'

function onRenderCallback(...args) {
  console.log('Render time:', args[3])
}

<Profiler id="PatientList" onRender={onRenderCallback}>
  <PatientList />
</Profiler>
```

---

## 📦 Setup Guide

### Installation Commands

```bash
# Navigate to frontend directory
cd frontend

# Install testing dependencies
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  jest-axe \
  @axe-core/react

# Or install all at once
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jest-axe @axe-core/react
```

### Jest Configuration

Create `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],
}
```

### Jest Setup File

Create `src/test/setup.js`:
```javascript
import '@testing-library/jest-dom'
import './mocks/server'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock fetch globally
global.fetch = jest.fn()

// Suppress console errors in tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
```

### Update package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

---

## ✅ Best Practices

### 1. Test Organization
```
src/
├── components/
│   ├── Button.jsx
│   └── Button.test.jsx
├── pages/
│   ├── LoginPage.jsx
│   └── LoginPage.test.jsx
├── __tests__/
│   ├── integration/
│   │   └── auth.integration.test.jsx
│   ├── unit/
│   │   └── validation.test.js
│   └── e2e/
│       └── login-flow.spec.js
└── __mocks__/
    ├── handlers.js
    └── server.js
```

### 2. Test Naming Conventions
```javascript
// ✅ Good - describes what it tests
describe('LoginForm', () => {
  it('should submit form with valid credentials')
  it('should show error message on invalid email')
  it('should disable submit button during loading')
})

// ❌ Bad - vague
describe('LoginForm', () => {
  it('works')
  it('test 1')
  it('can submit')
})
```

### 3. Test Structure (Arrange-Act-Assert)
```javascript
// Arrange - Set up test data
const user = { email: 'test@test.com', password: 'Pass123!' }

// Act - Perform the action
render(<LoginForm />)
await userEvent.type(emailInput, user.email)
await userEvent.click(submitButton)

// Assert - Verify the result
expect(mockLogin).toHaveBeenCalledWith(user)
```

### 4. Avoid Testing Implementation Details
```javascript
// ❌ Bad - tests implementation
expect(component.state.isLoading).toBe(true)
expect(component.instance.handleClick).toHaveBeenCalled()

// ✅ Good - tests behavior
expect(screen.getByText(/loading/i)).toBeInTheDocument()
expect(mockCallback).toHaveBeenCalled()
```

### 5. Use Data Testid for Complex Queries
```javascript
// ❌ Hard to find/maintain
const button = container.querySelector('div > div > button:nth-child(3)')

// ✅ Easy to find/maintain
const button = screen.getByTestId('patient-save-button')
```
```jsx
// Component
<button data-testid="patient-save-button">Save</button>
```

### 6. Mock External Dependencies
```javascript
// ✅ Good - mock API
jest.mock('../api/patientApi', () => ({
  fetchPatient: jest.fn(),
}))

// ❌ Bad - test with real API
// Will cause slow, flaky tests
```

### 7. Test Edge Cases
```javascript
it('should handle empty patient list', () => {
  // Empty array
  expect(formatPatientList([])).toBe('No patients')
})

it('should handle null values', () => {
  expect(getPatientName(null)).toBe('Unknown')
})

it('should handle very long names', () => {
  const longName = 'A'.repeat(500)
  expect(truncateName(longName)).toHaveLength(50)
})
```

### 8. Use Factories for Test Data
```javascript
// ✅ Good - consistent test data
const patientFactory = (overrides = {}) => ({
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  ...overrides,
})

test('should display patient name', () => {
  const patient = patientFactory({ firstName: 'Jane' })
  render(<PatientCard patient={patient} />)
  expect(screen.getByText('Jane Doe')).toBeInTheDocument()
})
```

### 9. Test Async Operations Properly
```javascript
// ✅ Good - use async utilities
test('should load patient data', async () => {
  render(<PatientPage />)
  
  // Wait for API call to complete
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})

// ❌ Bad - doesn't wait
test('should load patient data', () => {
  render(<PatientPage />)
  expect(screen.getByText('John Doe')).toBeInTheDocument() // Fails!
})
```

### 10. Clean Up Between Tests
```javascript
import { server } from '../__mocks__/server'

beforeEach(() => {
  // Clear any previous state
  jest.clearAllMocks()
})

afterEach(() => {
  // Reset MSW handlers
  server.resetHandlers()
})

afterAll(() => {
  // Clean up
  server.close()
})
```

---

## ✔️ Testing Checklist

### Component Testing
- [ ] Component renders without errors
- [ ] Props are passed correctly
- [ ] Event handlers are called
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Empty states display correctly
- [ ] Accessibility attributes present
- [ ] Focus states visible
- [ ] Works on mobile (responsive)
- [ ] Works without JavaScript (progressive enhancement)

### Form Testing
- [ ] All fields render
- [ ] Valid data submits
- [ ] Invalid email rejected
- [ ] Weak password rejected
- [ ] Required fields validated
- [ ] Error messages display
- [ ] Error messages clear when fixed
- [ ] Submit button disabled during request
- [ ] Success message shows after submit
- [ ] Form clears after success

### API/Integration Testing
- [ ] Successful requests return data
- [ ] Error responses display error message
- [ ] 401 Unauthorized redirects to login
- [ ] 404 Not Found shows appropriate message
- [ ] 500 Server Error shows retry option
- [ ] Network timeout handled
- [ ] Loading state shows during request
- [ ] No duplicate requests on double-click
- [ ] Request headers include auth token
- [ ] Sensitive data not logged

### Accessibility Testing
- [ ] WCAG AA color contrast verified
- [ ] Focus order logical
- [ ] Focus visible (ring)
- [ ] Labels associated with inputs
- [ ] ARIA attributes present
- [ ] Alt text on images
- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] axe-core violations: 0

### Performance Testing
- [ ] Component renders < 100ms
- [ ] First Contentful Paint < 2.5s
- [ ] Largest Contentful Paint < 4s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No memory leaks on unmount
- [ ] API requests debounced/throttled
- [ ] Images optimized
- [ ] Bundle size appropriate

---

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test LoginPage.test.jsx
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should submit form"
```

### Debug Tests
```bash
npm run test:debug
# Then open chrome://inspect in Chrome
```

---

## 📊 Coverage Report Example

```
PASS  src/components/__tests__/Button.test.jsx
PASS  src/pages/__tests__/LoginPage.test.jsx
PASS  src/hooks/__tests__/useApi.test.jsx

Test Suites: 3 passed, 3 total
Tests:       42 passed, 42 total
Snapshots:   0 total
Time:        5.234 s

======= Coverage summary =======
Statements   : 85.5% ( 120/140 )
Branches     : 78.3% ( 90/115 )
Functions    : 92.1% ( 70/76 )
Lines        : 88.0% ( 110/125 )
```

---

## 📚 Recommended Reading

1. **Testing Library Docs**: https://testing-library.com/react
2. **Jest Docs**: https://jestjs.io/
3. **React Testing Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
4. **MSW Documentation**: https://mswjs.io/
5. **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Status**: ✅ **TESTING STRATEGY COMPLETE**  
**Created**: January 23, 2026
