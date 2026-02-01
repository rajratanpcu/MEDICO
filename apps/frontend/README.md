# Medical Assistant Frontend

React frontend for the AI-Powered Smart Medical Assistant system, connected to Spring Boot backend.

## Prerequisites

**Node.js 18+ Required** - [Download from nodejs.org](https://nodejs.org/)

## Quick Start

### 1. Install Dependencies
```powershell
cd frontend
npm install
```

### 2. Start Backend Services
Make sure the Spring Boot backend is running:
```powershell
cd ..
docker-compose up -d
```

Verify backend health:
```powershell
curl http://localhost:8080/actuator/health
```

### 3. Start Frontend Development Server
```powershell
npm run dev
```

Frontend will start at **http://localhost:3000**

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   └── patient/         # Patient-specific components
│   ├── pages/
│   │   ├── auth/            # Authentication pages
│   │   │   └── LoginPage.jsx
│   │   └── patient/         # Patient pages
│   │       └── PatientDashboard.jsx
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios instance with JWT interceptor
│   │   ├── authService.js   # Authentication methods
│   │   └── patientService.js # Patient API calls
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── hooks/               # Custom React hooks
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration with proxy
└── tailwind.config.js       # Tailwind CSS configuration
```

## Key Features

### 1. **JWT Authentication**
- Login page with error handling
- Token stored in localStorage
- Automatic token injection in API requests
- Auto-redirect to login on 401 errors

### 2. **API Integration**
- Axios client with interceptors
- Automatic Bearer token authentication
- Vite proxy: `/api/*` → `http://localhost:8080`
- Environment-based API URL configuration

### 3. **Protected Routes**
- Role-based access control (PATIENT, CLINICIAN, ADMIN)
- Authentication guards
- Loading states for auth checks

### 4. **State Management**
- React Query for server state (caching, refetching)
- React Context for authentication state
- Local storage for JWT persistence

### 5. **UI Components**
- Tailwind CSS for styling
- Medical app color scheme (primary blues, success green)
- Responsive design
- Loading and error states

## Backend Connection

The frontend connects to the Spring Boot backend via Vite proxy:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

**Frontend calls:** `axios.get('/api/patients')` → **Backend receives:** `GET http://localhost:8080/patients`

## Test Login Credentials

Use these credentials to test the system:

```
Email: doctor@hospital.com
Password: SecurePass123!
Role: CLINICIAN
```

## Available Scripts

```powershell
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Login and get JWT token |
| `/auth/register` | POST | Register new user |
| `/patients` | GET | Get all patients |
| `/patients/:id` | GET | Get patient by ID |
| `/reports/patient/:id` | GET | Get patient reports |
| `/prescriptions/patient/:id` | GET | Get patient prescriptions |

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080
```

Change this for production deployment.

## Troubleshooting

### Problem: npm not recognized
**Solution:** Install Node.js from https://nodejs.org/ (LTS version)

### Problem: Backend connection refused
**Solution:** 
1. Verify backend running: `docker-compose ps`
2. Check backend health: `curl http://localhost:8080/actuator/health`
3. Start backend: `docker-compose up -d`

### Problem: Login returns 401
**Solution:**
1. Verify user exists in database
2. Check credentials match: `doctor@hospital.com / SecurePass123!`
3. Run sample data script: `docker exec -i postgres-medical psql -U medical_user -d medical < sample-data.sql`

### Problem: Patients page empty
**Solution:** Load sample data (see DATABASE_CONNECTION.md)

### Problem: CORS errors
**Solution:** Spring Security configured to allow CORS from `http://localhost:3000`

## Next Steps

### Phase 1: Core Features (Completed)
- ✅ Authentication (login/logout)
- ✅ Protected routes
- ✅ Patient dashboard
- ✅ API integration

### Phase 2: Enhanced Features
- [ ] Medical report upload with progress
- [ ] Report viewing and analysis
- [ ] Prescription management
- [ ] AI symptom checker
- [ ] AI chatbot integration

### Phase 3: Advanced Features
- [ ] Emergency access request workflow
- [ ] Real-time notifications (WebSocket)
- [ ] Doctor scheduling
- [ ] Patient medical history timeline

## References

- **FRONTEND_ARCHITECTURE.md**: Complete architecture guide
- **DATABASE_CONNECTION.md**: API endpoint documentation
- **Backend README**: Spring Boot setup instructions
- **Vite Docs**: https://vitejs.dev/
- **React Router**: https://reactrouter.com/
- **React Query**: https://tanstack.com/query/
- **Tailwind CSS**: https://tailwindcss.com/

## Production Deployment

Before deploying to production:

1. Update `VITE_API_BASE_URL` in `.env`
2. Build optimized bundle: `npm run build`
3. Deploy `dist/` folder to static hosting (Netlify, Vercel, S3)
4. Configure CORS in Spring Security for production domain
5. Use HTTPS for both frontend and backend
