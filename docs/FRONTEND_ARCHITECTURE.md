# 🏥 Frontend Architecture Guide
## AI-Powered Smart Medical Assistant - React Frontend

### 📋 Executive Summary

**Recommended Stack:**
- ⚛️ **Framework:** React 18 + Vite (faster dev experience than Next.js for this scope)
- 🎨 **Styling:** Tailwind CSS + shadcn/ui (accessible components)
- 🔐 **Auth:** JWT tokens with axios interceptors
- 🌐 **API Client:** Axios with custom hooks
- 📊 **State Management:** React Context API + React Query (for server state)
- 🧭 **Routing:** React Router v6
- 📝 **Forms:** React Hook Form + Zod validation
- 🎯 **Icons:** Lucide React (medical-friendly icons)

**Why Vite over Next.js?**
- ⚡ Faster development server (HMR)
- 🎯 Simpler for SPA with REST API (no SSR needed)
- 📦 Smaller bundle size
- 🔧 Easier to understand for learning

---

## 🏗️ Project Structure

```
medical-frontend/
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
├── src/
│   ├── assets/              # Images, icons, static files
│   │   ├── images/
│   │   └── illustrations/
│   │
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Generic components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── patient/         # Patient-specific components
│   │   │   ├── PatientCard.jsx
│   │   │   ├── MedicalHistory.jsx
│   │   │   ├── ReportUploader.jsx
│   │   │   └── EmergencyInfo.jsx
│   │   │
│   │   ├── doctor/          # Doctor-specific components
│   │   │   ├── PatientList.jsx
│   │   │   ├── DiagnosisForm.jsx
│   │   │   └── PrescriptionForm.jsx
│   │   │
│   │   └── ai/              # AI-related components
│   │       ├── SymptomChecker.jsx
│   │       ├── ReportAnalysis.jsx
│   │       └── PredictionResults.jsx
│   │
│   ├── pages/               # Page components (route-level)
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── patient/
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── MedicalRecordsPage.jsx
│   │   │   ├── UploadReportPage.jsx
│   │   │   ├── SymptomCheckerPage.jsx
│   │   │   └── EmergencyPage.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientDetailsPage.jsx
│   │   │   └── PrescriptionPage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       └── UserManagementPage.jsx
│   │
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── authService.js   # Login, register, token management
│   │   ├── patientService.js
│   │   ├── doctorService.js
│   │   ├── reportService.js
│   │   └── aiService.js
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Authentication hook
│   │   ├── usePatients.js   # React Query hook for patients
│   │   ├── useReports.js
│   │   └── useFileUpload.js
│   │
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── utils/               # Utility functions
│   │   ├── formatters.js    # Date, currency formatters
│   │   ├── validators.js    # Form validation helpers
│   │   └── constants.js     # App-wide constants
│   │
│   ├── routes/              # Route configuration
│   │   └── index.jsx
│   │
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles + Tailwind
│
├── .env.local               # Environment variables
├── .env.example             # Environment template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🎨 Component Breakdown by Page

### 1. **Login Page** (`/login`)

**Components:**
```jsx
<LoginPage>
  <Card>                          {/* Container card */}
    <LoginForm>
      <Input type="email" />      {/* Email input */}
      <Input type="password" />   {/* Password input */}
      <Button>Login</Button>
      <ErrorMessage />            {/* API error display */}
      <Loader />                  {/* Loading spinner */}
    </LoginForm>
  </Card>
</LoginPage>
```

**State:**
- `email`, `password` (form fields)
- `loading` (API call in progress)
- `error` (login error message)

**API Call:**
```javascript
POST /auth/login
Body: { email, password }
Response: { token, type: "Bearer", expiresIn }
```

---

### 2. **Patient Dashboard** (`/patient/dashboard`)

**Components:**
```jsx
<DashboardLayout>
  <Sidebar role="patient" />
  <MainContent>
    <WelcomeCard name="John Doe" />
    <StatsGrid>
      <StatCard title="Upcoming Appointments" value="2" />
      <StatCard title="Prescriptions" value="3" />
      <StatCard title="Reports" value="5" />
    </StatsGrid>
    <RecentReports limit={3} />
    <QuickActions>
      <ActionButton to="/upload">Upload Report</ActionButton>
      <ActionButton to="/symptom-checker">Check Symptoms</ActionButton>
    </QuickActions>
  </MainContent>
</DashboardLayout>
```

**Data Flow:**
1. On mount → API call to get patient profile
2. Fetch recent reports → `GET /patients/{id}/reports`
3. Fetch prescriptions → `GET /patients/{id}/prescriptions`
4. Display in cards with loading states

---

### 3. **Medical Records Page** (`/patient/records`)

**Components:**
```jsx
<MedicalRecordsPage>
  <PageHeader title="My Medical Records" />
  <FilterBar>
    <DateRangePicker />
    <TypeFilter options={['LAB', 'IMAGING', 'CONSULTATION']} />
    <SearchBar />
  </FilterBar>
  <ReportList>
    {reports.map(report => (
      <ReportCard
        title={report.title}
        date={report.reportDate}
        type={report.reportType}
        status={report.status}
        onClick={() => viewReport(report.id)}
      />
    ))}
  </ReportList>
  <Pagination currentPage={1} totalPages={5} />
</MedicalRecordsPage>
```

**API Calls:**
```javascript
GET /patients/{patientId}/reports?page=0&size=10&type=LAB&startDate=2026-01-01
```

---

### 4. **Upload Report Page** (`/patient/upload-report`)

**Components:**
```jsx
<UploadReportPage>
  <UploadForm>
    <FileDropzone
      accept="application/pdf,image/*"
      maxSize={10 * 1024 * 1024}  // 10MB
      onDrop={handleFileUpload}
    />
    <FormFields>
      <Input label="Report Title" required />
      <Select label="Report Type" options={reportTypes} />
      <DatePicker label="Report Date" />
      <Textarea label="Notes" optional />
    </FormFields>
    <UploadProgress percent={uploadProgress} />
    <Button disabled={!file || uploading}>
      {uploading ? 'Uploading...' : 'Submit Report'}
    </Button>
  </UploadForm>
  
  {/* Show AI analysis after upload */}
  {analysisResult && (
    <AnalysisResultCard>
      <SectionTitle>AI Analysis Results</SectionTitle>
      <KeyFindings findings={analysisResult.findings} />
      <Recommendations items={analysisResult.recommendations} />
    </AnalysisResultCard>
  )}
</UploadReportPage>
```

**Upload Flow:**
1. User selects file → validate (size, type)
2. User fills metadata → validate form
3. Submit → `POST /patients/{id}/reports` with FormData
4. Show progress bar (0-100%)
5. On success → trigger AI analysis (background)
6. Poll for analysis → `GET /ai/analyze-report/{reportId}`
7. Display results when ready

---

### 5. **Symptom Checker Page** (`/patient/symptom-checker`)

**Components:**
```jsx
<SymptomCheckerPage>
  <IntroCard>
    <Icon name="stethoscope" />
    <Text>Describe your symptoms and get AI-powered insights</Text>
  </IntroCard>
  
  <SymptomForm>
    <SymptomInput
      placeholder="E.g., headache, fever, cough for 3 days"
      multiline
      rows={4}
    />
    <TagInput
      label="Select common symptoms"
      tags={['Fever', 'Headache', 'Cough', 'Fatigue']}
    />
    <Button>Analyze Symptoms</Button>
  </SymptomForm>
  
  {/* Results after submission */}
  {prediction && (
    <PredictionResults>
      <AlertBanner
        severity={prediction.severity}
        message="Please consult a doctor immediately"
      />
      <PossibleConditions>
        {prediction.conditions.map(condition => (
          <ConditionCard
            name={condition.name}
            probability={condition.probability}
            description={condition.description}
          />
        ))}
      </PossibleConditions>
      <RecommendedActions>
        <Action>Schedule appointment with {prediction.specialty}</Action>
        <Action>Monitor symptoms for next 48 hours</Action>
      </RecommendedActions>
      <Disclaimer>
        ⚠️ This is not a medical diagnosis. Always consult a qualified doctor.
      </Disclaimer>
    </PredictionResults>
  )}
</SymptomCheckerPage>
```

**API Call:**
```javascript
POST /ai/predict-disease
Body: { symptoms: "fever, headache, cough", duration: "3 days" }
Response: {
  conditions: [
    { name: "Common Cold", probability: 0.75 },
    { name: "Flu", probability: 0.60 }
  ],
  severity: "MODERATE",
  specialty: "General Physician"
}
```

---

### 6. **Emergency Info Page** (`/patient/emergency`)

**Components:**
```jsx
<EmergencyPage>
  <AlertBanner type="warning">
    This information is visible to emergency responders
  </AlertBanner>
  
  <EmergencyContactCard>
    <ContactInfo name="Dr. Sarah Smith" phone="+1-555-0101" />
    <ContactInfo name="Jane Doe (Spouse)" phone="+1-555-1234" />
  </EmergencyContactCard>
  
  <CriticalInfoCard>
    <InfoRow label="Blood Type" value="A+" />
    <InfoRow label="Allergies" value="Penicillin, Peanuts" />
    <InfoRow label="Current Medications" value="Lisinopril 10mg" />
    <InfoRow label="Medical Conditions" value="Hypertension" />
  </CriticalInfoCard>
  
  <RecentReports limit={2} critical={true} />
</EmergencyPage>
```

---

### 7. **Doctor Dashboard** (`/doctor/dashboard`)

**Components:**
```jsx
<DoctorDashboard>
  <Sidebar role="doctor" />
  <MainContent>
    <StatsRow>
      <StatCard title="Today's Appointments" value="8" />
      <StatCard title="Pending Reviews" value="12" />
      <StatCard title="Total Patients" value="156" />
    </StatsRow>
    
    <TodaySchedule>
      {appointments.map(appt => (
        <AppointmentCard
          time={appt.time}
          patient={appt.patient.name}
          reason={appt.reason}
        />
      ))}
    </TodaySchedule>
    
    <PatientSearchBar onSearch={handleSearch} />
    
    <PendingReviews>
      {reports.map(report => (
        <ReportReviewCard
          patient={report.patient}
          reportType={report.type}
          uploadDate={report.date}
          onReview={() => navigateTo(`/doctor/review/${report.id}`)}
        />
      ))}
    </PendingReviews>
  </MainContent>
</DoctorDashboard>
```

---

## 🔐 Authentication Flow

### JWT Token Management

**1. Login Process:**
```javascript
// authService.js
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, expiresIn } = response.data;
  
  // Store in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiry', Date.now() + expiresIn * 1000);
  
  // Decode token to get user info
  const user = jwtDecode(token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};
```

**2. Axios Interceptor:**
```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout and redirect
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**3. Protected Routes:**
```jsx
// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Usage in routes
<Route 
  path="/patient/*" 
  element={
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <PatientLayout />
    </ProtectedRoute>
  } 
/>
```

---

## 🌊 Data Flow Architecture

### Example: Upload Medical Report

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT (UploadReportPage)                               │
│  - User selects file                                        │
│  - User fills form (title, type, date)                      │
│  - Clicks "Upload" button                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  CUSTOM HOOK (useFileUpload)                                │
│  - Validates file (size, type)                              │
│  - Manages upload state (progress, error)                   │
│  - Calls service layer                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICE LAYER (reportService.js)                           │
│  - Creates FormData object                                  │
│  - Appends file + metadata                                  │
│  - Makes API call with axios                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AXIOS INTERCEPTOR                                          │
│  - Adds JWT token to Authorization header                  │
│  - Sends request to backend                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  SPRING BOOT BACKEND                                        │
│  - Validates token                                          │
│  - Saves file to storage                                    │
│  - Creates database record                                  │
│  - Publishes Kafka event (document-uploaded)                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AI SERVICE (Background)                                    │
│  - Consumes Kafka event                                     │
│  - Processes report (OCR, analysis)                         │
│  - Updates database with results                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND POLLING (Optional)                                │
│  - Polls GET /reports/{id}/analysis every 3s               │
│  - Updates UI when status = "COMPLETED"                     │
│  - Displays analysis results                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Best Practices for Medical Apps

### 1. **Accessibility (Critical for Healthcare)**

```jsx
// ✅ Good: Semantic HTML + ARIA labels
<button 
  aria-label="Upload medical report"
  className="btn-primary"
>
  <UploadIcon aria-hidden="true" />
  Upload Report
</button>

// ❌ Bad: No labels
<div onClick={upload}>
  <img src="icon.png" />
</div>
```

**Requirements:**
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader support (ARIA labels)
- ✅ High contrast mode support
- ✅ Font size adjustable (16px minimum)
- ✅ Color is not the only indicator (use icons + text)

### 2. **Visual Hierarchy**

**Critical Info First:**
```jsx
<PatientHeader>
  {/* Most important - large and bold */}
  <h1 className="text-3xl font-bold">John Doe</h1>
  
  {/* Critical medical info - prominent */}
  <Badge color="red">Allergic to Penicillin</Badge>
  <Badge color="orange">Blood Type: A+</Badge>
  
  {/* Secondary info - smaller */}
  <div className="text-gray-600">
    Age: 38 | Last Visit: Jan 15, 2026
  </div>
</PatientHeader>
```

### 3. **Color Coding (Medical Standards)**

```javascript
// Status colors
const STATUS_COLORS = {
  // Reports
  COMPLETED: 'green',   // ✅ Report ready
  PROCESSING: 'yellow', // ⏳ In progress
  ERROR: 'red',         // ❌ Failed
  
  // Severity
  CRITICAL: 'red',      // 🔴 Immediate attention
  HIGH: 'orange',       // 🟠 Urgent
  MODERATE: 'yellow',   // 🟡 Monitor
  LOW: 'green',         // 🟢 Normal
  
  // Prescriptions
  ACTIVE: 'blue',
  COMPLETED: 'gray',
  CANCELLED: 'red'
};
```

### 4. **Error Handling (User-Friendly Messages)**

```jsx
// ✅ Good: Clear, actionable error messages
const ERROR_MESSAGES = {
  'UPLOAD_FAILED': {
    title: 'Upload Failed',
    message: 'Unable to upload your report. Please check your internet connection and try again.',
    actions: [
      { label: 'Retry', onClick: retryUpload },
      { label: 'Save Draft', onClick: saveDraft }
    ]
  },
  'FILE_TOO_LARGE': {
    title: 'File Too Large',
    message: 'Please upload a file smaller than 10MB. You can compress PDFs at tinypdf.com',
    actions: [
      { label: 'Choose Another File', onClick: openFilePicker }
    ]
  }
};

// ❌ Bad: Technical jargon
"Error: axios.post failed with status 413"
```

### 5. **Loading States (Show Progress)**

```jsx
// ✅ Good: Contextual loading
<ReportCard>
  {loading ? (
    <Skeleton className="h-20 w-full">
      <div className="animate-pulse">
        Loading your medical report...
      </div>
    </Skeleton>
  ) : (
    <ReportContent data={report} />
  )}
</ReportCard>

// For uploads - show progress
<UploadProgress
  percent={uploadProgress}
  message={
    uploadProgress < 100 
      ? `Uploading... ${uploadProgress}%` 
      : 'Processing report...'
  }
/>
```

### 6. **Confirmation Dialogs (Prevent Mistakes)**

```jsx
// ✅ Critical actions need confirmation
const cancelPrescription = () => {
  showConfirmDialog({
    title: 'Cancel Prescription?',
    message: 'Are you sure you want to cancel Lisinopril 10mg for John Doe?',
    confirmText: 'Yes, Cancel Prescription',
    cancelText: 'No, Keep It',
    variant: 'danger',
    onConfirm: async () => {
      await api.delete(`/prescriptions/${id}`);
      toast.success('Prescription cancelled');
    }
  });
};
```

### 7. **Mobile Responsiveness**

```jsx
// Use Tailwind responsive classes
<div className="
  grid 
  grid-cols-1          /* Mobile: 1 column */
  md:grid-cols-2       /* Tablet: 2 columns */
  lg:grid-cols-3       /* Desktop: 3 columns */
  gap-4
">
  {reports.map(report => <ReportCard {...report} />)}
</div>

// Touch-friendly buttons (minimum 44px height)
<Button className="h-12 w-full md:w-auto">
  Upload Report
</Button>
```

---

## 📱 Responsive Design Breakpoints

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
    }
  }
}
```

**Mobile-First Approach:**
```jsx
// Base styles = mobile
// Add larger breakpoints progressively
<Sidebar className="
  fixed              /* Mobile: overlays content */
  inset-y-0 
  left-0 
  w-64 
  transform 
  -translate-x-full  /* Hidden by default */
  
  md:relative        /* Tablet+: always visible */
  md:translate-x-0
  
  transition-transform
  duration-300
">
```

---

## 🗂️ State Management Strategy

### When to Use What?

**1. Local State (useState)**
- Form inputs
- UI toggles (modal open/close)
- Component-specific data

```jsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

**2. Context API (useContext)**
- User authentication state
- Theme (dark/light mode)
- Global UI state

```jsx
// AuthContext.jsx
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
  };
  
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage
const { user, logout } = useContext(AuthContext);
```

**3. React Query (Server State)**
- API data fetching
- Caching responses
- Automatic refetching

```jsx
// hooks/usePatients.js
import { useQuery } from '@tanstack/react-query';

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getAll(),
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
    retry: 2
  });
};

// Usage in component
const { data: patients, isLoading, error } = usePatients();
```

---

## 🛠️ Development Roadmap

### **Phase 1: Project Setup (Week 1)**

**Day 1-2: Initialize Project**
```bash
# Create Vite project
npm create vite@latest medical-frontend -- --template react
cd medical-frontend
npm install

# Install dependencies
npm install \
  react-router-dom \
  axios \
  @tanstack/react-query \
  react-hook-form \
  zod \
  jwt-decode \
  lucide-react \
  date-fns

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Day 3: Configure Tailwind + Basic Structure**
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

Create folder structure (as shown above)

**Day 4-5: Setup Routing + Auth Context**

```jsx
// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import PatientDashboard from '../pages/patient/PatientDashboard';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/patient',
    element: (
      <ProtectedRoute allowedRoles={['PATIENT']}>
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <PatientDashboard /> },
      { path: 'records', element: <MedicalRecordsPage /> },
      // ... more routes
    ]
  }
]);
```

---

### **Phase 2: Authentication (Week 2)**

**Tasks:**
1. ✅ Create Login page UI
2. ✅ Implement login API call
3. ✅ Setup axios interceptors
4. ✅ Create AuthContext
5. ✅ Implement ProtectedRoute
6. ✅ Add logout functionality

**Code Example:**
```jsx
// pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      // Redirect based on role
      if (user.role === 'PATIENT') {
        navigate('/patient/dashboard');
      } else if (user.role === 'CLINICIAN') {
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">
          Medical Assistant Login
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### **Phase 3: Patient Dashboard (Week 3)**

**Tasks:**
1. ✅ Create dashboard layout (sidebar, header)
2. ✅ Fetch patient profile data
3. ✅ Display stats cards
4. ✅ Show recent reports
5. ✅ Add quick actions

**API Integration:**
```jsx
// hooks/usePatientProfile.js
import { useQuery } from '@tanstack/react-query';
import { patientService } from '../services/patientService';

export const usePatientProfile = () => {
  return useQuery({
    queryKey: ['patient-profile'],
    queryFn: () => patientService.getProfile(),
    staleTime: 10 * 60 * 1000  // 10 minutes
  });
};

// Usage
const PatientDashboard = () => {
  const { data: profile, isLoading } = usePatientProfile();
  
  if (isLoading) return <Loader />;
  
  return (
    <DashboardLayout>
      <h1>Welcome back, {profile.firstName}!</h1>
      <StatsGrid data={profile.stats} />
      <RecentReports reports={profile.recentReports} />
    </DashboardLayout>
  );
};
```

---

### **Phase 4: Medical Records (Week 4)**

**Tasks:**
1. ✅ Create reports list page
2. ✅ Implement filtering (date, type)
3. ✅ Add pagination
4. ✅ Create report detail modal
5. ✅ Add PDF viewer

**Component:**
```jsx
// pages/patient/MedicalRecordsPage.jsx
import { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { ReportCard } from '../../components/patient/ReportCard';
import { FilterBar } from '../../components/common/FilterBar';

export default function MedicalRecordsPage() {
  const [filters, setFilters] = useState({
    type: 'ALL',
    startDate: null,
    endDate: null
  });
  
  const { data, isLoading } = useReports(filters);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Medical Records</h1>
      
      <FilterBar filters={filters} onChange={setFilters} />
      
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data.reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### **Phase 5: Report Upload (Week 5)**

**Tasks:**
1. ✅ Create file upload component (drag & drop)
2. ✅ Implement progress tracking
3. ✅ Add form validation
4. ✅ Handle upload errors
5. ✅ Display AI analysis results

**Upload Hook:**
```jsx
// hooks/useFileUpload.js
import { useState } from 'react';
import { reportService } from '../services/reportService';

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const upload = async (file, metadata) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', metadata.title);
      formData.append('reportType', metadata.type);
      formData.append('reportDate', metadata.date);
      
      const response = await reportService.upload(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };
  
  return { upload, progress, uploading, error };
};
```

---

### **Phase 6: AI Features (Week 6)**

**Tasks:**
1. ✅ Create symptom checker form
2. ✅ Implement disease prediction
3. ✅ Display prediction results with probabilities
4. ✅ Add disclaimer/warnings
5. ✅ Show recommended actions

**Symptom Checker:**
```jsx
// pages/patient/SymptomCheckerPage.jsx
import { useState } from 'react';
import { aiService } from '../../services/aiService';
import { PredictionResults } from '../../components/ai/PredictionResults';

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await aiService.predictDisease(symptoms);
      setPrediction(result);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Symptom Checker</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms (e.g., headache, fever for 3 days)"
          rows={5}
          className="w-full p-3 border rounded-lg"
        />
        
        <button
          type="submit"
          disabled={!symptoms || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Check Symptoms'}
        </button>
      </form>
      
      {prediction && (
        <PredictionResults data={prediction} />
      )}
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Disclaimer:</strong> This tool is for informational purposes only. 
          Always consult a qualified healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
}
```

---

### **Phase 7: Doctor Features (Week 7)**

**Tasks:**
1. ✅ Create doctor dashboard
2. ✅ Patient search functionality
3. ✅ View patient details
4. ✅ Create/edit prescriptions
5. ✅ Review reports

---

### **Phase 8: Polish & Testing (Week 8)**

**Tasks:**
1. ✅ Add loading skeletons
2. ✅ Improve error messages
3. ✅ Add success notifications (toast)
4. ✅ Test on mobile devices
5. ✅ Accessibility audit
6. ✅ Performance optimization

**Tools:**
```bash
# Install toast notifications
npm install react-hot-toast

# Install loading skeletons
npm install react-loading-skeleton
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest + React Testing Library)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Example Test:**
```jsx
// LoginPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginPage from './LoginPage';
import * as authService from '../../services/authService';

vi.mock('../../services/authService');

describe('LoginPage', () => {
  it('should show error on failed login', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
});
```

---

## 📦 Deployment

### Build for Production

```bash
# Build
npm run build

# Preview production build locally
npm run preview
```

### Deploy Options

**1. Vercel (Recommended - Free)**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**2. Netlify**
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**3. Docker (for self-hosting)**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🎓 Learning Resources

**React Fundamentals:**
- React Docs: https://react.dev/learn
- Vite Guide: https://vitejs.dev/guide/

**Styling:**
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui Components: https://ui.shadcn.com/

**Data Fetching:**
- React Query (TanStack Query): https://tanstack.com/query/latest

**Forms:**
- React Hook Form: https://react-hook-form.com/

**Healthcare UI Inspiration:**
- Dribbble Healthcare: https://dribbble.com/search/healthcare-app
- Epic MyChart (reference): https://www.mychart.org/

---

## ✅ Final Checklist

**Before Demo:**
- [ ] All pages render without errors
- [ ] Login/logout works correctly
- [ ] Patient can upload reports
- [ ] AI analysis displays results
- [ ] Symptom checker shows predictions
- [ ] Mobile responsive (test on phone)
- [ ] Error messages are user-friendly
- [ ] Loading states show during API calls
- [ ] Logout clears tokens and redirects
- [ ] Protected routes work (can't access doctor page as patient)

**Documentation:**
- [ ] README with setup instructions
- [ ] Environment variables documented
- [ ] API endpoint list
- [ ] Screenshots for report

---

## 💡 Pro Tips for College Project

1. **Start Simple:** Build login → dashboard → one feature at a time
2. **Don't Overcomplicate:** Context API is enough for auth, no need for Redux
3. **Reuse Components:** One Button component used everywhere
4. **Use Libraries:** Don't build file upload from scratch, use react-dropzone
5. **Mock Data First:** Test UI with dummy data before connecting API
6. **Git Commits:** Commit after each feature ("Add login page", "Add report upload")
7. **Comments:** Add JSDoc comments for complex functions
8. **Demo Video:** Record a 3-min walkthrough showing all features

**Example Demo Flow:**
1. Login as patient
2. View dashboard (shows stats)
3. Upload medical report → show AI analysis
4. Check symptoms → show disease prediction
5. View medical history (filter by date)
6. Logout → login as doctor
7. View patient list
8. Create prescription for patient

---

**Good luck with your final year project! 🚀**

Start with Phase 1 and reach out if you need help with any specific component.
