// INTEGRATION_EXAMPLES.md
// Complete integration examples for Symptom Checker

# Symptom Checker - Integration Examples

## Example 1: Basic Integration

```jsx
// pages/SymptomCheckPage.jsx
import React from 'react'
import SymptomChecker from '@/components/symptoms/SymptomChecker'
import { useAuth } from '@/hooks/useAuth'

export default function SymptomCheckPage() {
  const { user } = useAuth()

  const handleResultsSubmitted = (analysisId) => {
    console.log('Analysis saved:', analysisId)
    // Navigate to results page or show success message
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <SymptomChecker 
        userId={user.id}
        onResultsSubmitted={handleResultsSubmitted}
      />
    </div>
  )
}
```

## Example 2: With Error Boundary

```jsx
import React from 'react'
import SymptomChecker from '@/components/symptoms/SymptomChecker'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle } from 'lucide-react'

export default function SymptomCheckPage() {
  const { user } = useAuth()
  const [submitted, setSubmitted] = React.useState(false)

  const handleResultsSubmitted = (analysisId) => {
    setSubmitted(true)
    setTimeout(() => {
      window.location.href = `/health-insights/${analysisId}`
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analysis Saved Successfully
          </h3>
          <p className="text-gray-600 mb-4">
            Your health insights have been saved and you can view them anytime.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to results...
          </p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="flex items-center mb-4 text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-semibold">Something went wrong</h3>
          </div>
          <p className="text-gray-600">
            Unable to load the symptom checker. Please try refreshing the page.
          </p>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <SymptomChecker 
          userId={user.id}
          onResultsSubmitted={handleResultsSubmitted}
        />
      </div>
    </ErrorBoundary>
  )
}
```

## Example 3: With Redux Integration

```jsx
// pages/SymptomCheckPage.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SymptomChecker from '@/components/symptoms/SymptomChecker'
import { saveAnalysis, selectAnalysisLoading } from '@/store/analysisSlice'

export default function SymptomCheckPage() {
  const dispatch = useDispatch()
  const isLoading = useSelector(selectAnalysisLoading)
  const currentUser = useSelector(state => state.auth.user)

  const handleResultsSubmitted = (analysisId) => {
    dispatch(saveAnalysis({
      analysisId,
      userId: currentUser.id,
      timestamp: new Date()
    })).then(() => {
      // Handle success
      window.location.href = `/health-insights/${analysisId}`
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-900">Saving your analysis...</p>
          </div>
        </div>
      )}
      <SymptomChecker 
        userId={currentUser.id}
        onResultsSubmitted={handleResultsSubmitted}
      />
    </div>
  )
}
```

## Example 4: With Modal Dialog

```jsx
// components/SymptomCheckerModal.jsx
import React from 'react'
import SymptomChecker from '@/components/symptoms/SymptomChecker'
import { X } from 'lucide-react'

export default function SymptomCheckerModal({ isOpen, onClose, userId }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Health Symptom Checker</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="p-8">
          <SymptomChecker 
            userId={userId}
            onResultsSubmitted={() => {
              onClose()
              // Show success message or redirect
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Usage in parent component
export function ParentComponent() {
  const [showSymptomCheck, setShowSymptomCheck] = React.useState(false)
  const { user } = useAuth()

  return (
    <div>
      <button 
        onClick={() => setShowSymptomCheck(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Check My Symptoms
      </button>

      <SymptomCheckerModal 
        isOpen={showSymptomCheck}
        onClose={() => setShowSymptomCheck(false)}
        userId={user.id}
      />
    </div>
  )
}
```

## Example 5: With Form Context

```jsx
// pages/PatientOnboarding.jsx
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import SymptomChecker from '@/components/symptoms/SymptomChecker'
import PersonalInfoForm from '@/components/forms/PersonalInfoForm'

export default function PatientOnboarding() {
  const methods = useForm({
    defaultValues: {
      personalInfo: {},
      symptoms: [],
      analysisId: null
    }
  })

  const onSubmit = async (data) => {
    // Submit entire onboarding flow
    const response = await fetch('/api/patients/onboard', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-4xl mx-auto py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Personal Information</h2>
          <PersonalInfoForm />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Health Assessment</h2>
          <SymptomChecker 
            userId={null} // Will be set during submission
            onResultsSubmitted={(analysisId) => {
              methods.setValue('analysisId', analysisId)
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Complete Onboarding
        </button>
      </form>
    </FormProvider>
  )
}
```

## Example 6: With Query Parameters

```jsx
// pages/dashboard.jsx
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import SymptomChecker from '@/components/symptoms/SymptomChecker'
import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const showSymptomCheck = searchParams.get('action') === 'check-symptoms'

  if (showSymptomCheck) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSearchParams({})}
            className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center"
          >
            ← Back to Dashboard
          </button>
          <SymptomChecker 
            userId={user.id}
            onResultsSubmitted={() => {
              setSearchParams({})
              // Show success toast
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Dashboard content */}
      <button 
        onClick={() => setSearchParams({ action: 'check-symptoms' })}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Check Symptoms
      </button>
    </div>
  )
}
```

## Example 7: With Custom Hook

```jsx
// hooks/useSymptomAnalysis.js
import React from 'react'
import { useSymptomChecker } from '@/hooks/useSymptomChecker'
import { useAuth } from '@/hooks/useAuth'
import { saveAnalysisMutation } from '@/api/analysis'

export function useSymptomAnalysis() {
  const { user } = useAuth()
  const { checkSymptoms, predictions, isLoading, error } = useSymptomChecker()
  const [analysis, setAnalysis] = React.useState(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState(null)

  const analyzeSymptoms = React.useCallback(async (symptomIds) => {
    try {
      const result = await checkSymptoms(symptomIds, { userId: user.id })
      return result
    } catch (err) {
      console.error('Analysis failed:', err)
      throw err
    }
  }, [checkSymptoms, user.id])

  const saveAnalysis = React.useCallback(async (analysisId) => {
    setIsSaving(true)
    setSaveError(null)
    try {
      const result = await saveAnalysisMutation({
        analysisId,
        userId: user.id,
        predictions
      })
      setAnalysis(result)
      return result
    } catch (err) {
      setSaveError(err.message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [user.id, predictions])

  return {
    analyzeSymptoms,
    saveAnalysis,
    predictions,
    analysis,
    isLoading,
    isSaving,
    error,
    saveError
  }
}

// Usage in component
export function SymptomCheckPage() {
  const { 
    analyzeSymptoms, 
    saveAnalysis, 
    predictions, 
    isLoading, 
    isSaving 
  } = useSymptomAnalysis()

  return (
    <SymptomChecker 
      userId={user.id}
      onResultsSubmitted={saveAnalysis}
    />
  )
}
```

## Example 8: With Analytics Tracking

```jsx
// pages/SymptomCheckPage.jsx
import React from 'react'
import SymptomChecker from '@/components/symptoms/SymptomChecker'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useAuth } from '@/hooks/useAuth'

export default function SymptomCheckPage() {
  const { user } = useAuth()
  const { trackEvent } = useAnalytics()
  const [startTime] = React.useState(Date.now())

  const handleSymptomCheck = (symptoms) => {
    trackEvent('symptom_check_started', {
      symptomCount: symptoms.length,
      userId: user.id,
      timestamp: new Date()
    })
  }

  const handleResultsSubmitted = (analysisId) => {
    const duration = Date.now() - startTime
    trackEvent('symptom_check_completed', {
      analysisId,
      duration,
      userId: user.id,
      timestamp: new Date()
    })
  }

  const handleError = (error) => {
    trackEvent('symptom_check_error', {
      errorType: error.type,
      errorMessage: error.message,
      userId: user.id,
      timestamp: new Date()
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <SymptomChecker 
        userId={user.id}
        onResultsSubmitted={handleResultsSubmitted}
        onSymptomSelected={handleSymptomCheck}
        onError={handleError}
      />
    </div>
  )
}
```

## Common Integration Patterns

### Pattern 1: Redirect After Success
```jsx
const handleResultsSubmitted = (analysisId) => {
  navigate(`/health-insights/${analysisId}`, {
    state: { fromSymptomCheck: true }
  })
}
```

### Pattern 2: Show Toast Notification
```jsx
import { useToast } from '@/hooks/useToast'

const { showToast } = useToast()

const handleResultsSubmitted = (analysisId) => {
  showToast({
    type: 'success',
    title: 'Analysis Saved',
    message: 'Your health analysis has been saved successfully.',
    duration: 3000
  })
}
```

### Pattern 3: Update Parent State
```jsx
const [analysisId, setAnalysisId] = React.useState(null)

const handleResultsSubmitted = (id) => {
  setAnalysisId(id)
  // Parent component can now access analysisId
}
```

### Pattern 4: Firebase Integration
```jsx
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

const handleResultsSubmitted = async (analysisId) => {
  await setDoc(doc(db, 'analyses', analysisId), {
    userId: user.id,
    createdAt: new Date(),
    status: 'completed'
  })
}
```

### Pattern 5: API Integration
```jsx
const handleResultsSubmitted = async (analysisId) => {
  const response = await fetch(`/api/analyses/${analysisId}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: user.id,
      timestamp: new Date()
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to save analysis')
  }
  
  const data = await response.json()
  return data
}
```

## Troubleshooting

### Issue: Component Not Rendering
**Solution:** Ensure user ID is properly passed and API endpoint is accessible

### Issue: Form Validation Not Working
**Solution:** Check that validateSymptoms() is called before submission

### Issue: Results Not Displaying
**Solution:** Verify predictions array is properly formatted from API response

### Issue: Styling Issues
**Solution:** Ensure TailwindCSS is properly configured in your project

### Issue: API Timeout
**Solution:** Check network conditions and increase timeout value if needed
