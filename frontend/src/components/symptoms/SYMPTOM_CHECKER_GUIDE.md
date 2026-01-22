// SYMPTOM_CHECKER_GUIDE.md
// Complete design documentation for Symptom Checker feature

# Symptom Checker - Design & Implementation Guide

## Overview

A medical-grade Symptom Checker interface that allows patients to:
- Select symptoms they're experiencing
- Get AI-powered disease predictions
- Understand health conditions with confidence levels
- Receive actionable health recommendations
- Clear medical disclaimers at every step

## ============================================================================
## COMPONENT ARCHITECTURE
## ============================================================================

### Component Hierarchy

```
SymptomChecker (Main Orchestrator)
├── DisclaimerBanner (Medical disclaimer)
├── InputStage (Symptom selection)
│   └── SymptomSelector
│       ├── Search Input
│       └── SymptomCategory (repeated)
│           └── SymptomCard (repeated)
├── SubmittingStage (Loading state)
├── ResultsStage (Disease predictions)
│   └── DiseaseResults
│       └── DiseaseCard (repeated)
│           ├── Severity Badge
│           ├── Confidence Bar
│           └── Expandable Details
└── ErrorStage (Error handling)
```

### Components Overview

#### 1. SymptomChecker.jsx (Main)
**Purpose:** Orchestrate entire workflow with stage management

**Props:**
- `userId` (string) - Current user ID
- `onResultsSubmitted` (function) - Callback when results saved

**State:**
- `selectedSymptoms` - Array of selected symptom objects
- `stage` - Current workflow stage (input|submitting|results|error)
- `submissionError` - Error message if any

**Key Methods:**
- `handleSymptomToggle()` - Add/remove symptoms
- `validateSymptoms()` - Ensure 1-10 symptoms selected
- `handleSubmit()` - Send to API
- `handleReset()` - Return to initial state

**Stages:**
1. **input** - SymptomSelector displayed
2. **submitting** - Loading spinner shown
3. **results** - DiseaseResults displayed
4. **error** - Error message with retry option

#### 2. SymptomSelector.jsx
**Purpose:** Multi-select symptom input with search and categorization

**Props:**
- `selectedSymptoms` - Array of selected symptoms
- `onSymptomToggle` - Callback for selection changes

**Features:**
- Real-time search filtering
- 10 symptom categories with emojis
- Category expansion/collapse
- Selected count tracking
- Progress bar (0-10 symptoms)

#### 3. DiseaseResults.jsx
**Purpose:** Display predictions ranked by confidence

**Props:**
- `predictions` - Array of disease predictions

**Displays:**
- Disease name and rank
- Confidence percentage with color-coded bar
- Severity level (critical/high/moderate/low)
- Matching symptoms list
- When to see doctor advice
- Self-care tips
- Risk factors
- Expandable detailed information

## ============================================================================
## WORKFLOW & UX FLOW
## ============================================================================

### Step 1: Initial Screen
```
┌─────────────────────────────────────────┐
│  🏥 Symptom Checker                     │
│  Describe your symptoms to get health   │
│  insights                                │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️ MEDICAL DISCLAIMER                  │
│  This is for informational purposes     │
│  only. Not a substitute for medical     │
│  advice. Consult a healthcare provider. │
│                                         │
│  📋 SELECT YOUR SYMPTOMS                │
│                                         │
│  🔍 Search symptoms...                  │
│                                         │
│  [Respiratory & Breathing] ▼            │
│     ☐ Cough                             │
│     ☐ Sore Throat                       │
│     ☐ Shortness of Breath               │
│                                         │
│  [Fever & Temperature] ▼                │
│     ☐ Fever                             │
│     ☐ Chills                            │
│                                         │
│  [Continue scrolling...]                │
│                                         │
│                                         │
│  [Disabled: Check Symptoms Button]      │
│                                         │
└─────────────────────────────────────────┘
```

### Step 2: Symptom Selection
```
┌─────────────────────────────────────────┐
│  🏥 Symptom Checker                     │
├─────────────────────────────────────────┤
│                                         │
│  ✓ Cough selected                       │
│  ✓ Fever selected                       │
│  ✓ Sore Throat selected                 │
│                                         │
│  Selected Symptoms (3)                  │
│  [Cough] [Fever] [Sore Throat]          │
│                                         │
│  3 of 10 maximum symptoms selected      │
│  ▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                         │
│                                         │
│  [Check Symptoms] ← Now enabled         │
│                                         │
└─────────────────────────────────────────┘
```

### Step 3: Loading State
```
┌─────────────────────────────────────────┐
│  🏥 Symptom Checker                     │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│           ⟲ (spinning)                  │
│                                         │
│     Analyzing Your Symptoms             │
│                                         │
│     Our AI is reviewing your            │
│     symptoms and checking against       │
│     our medical database.               │
│     This typically takes 5-10 seconds.  │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### Step 4: Results Display
```
┌─────────────────────────────────────────┐
│  ✅ Health Insights Based on            │
│     Your Symptoms                       │
│                                         │
│  Based on your 3 selected symptoms      │
├─────────────────────────────────────────┤
│                                         │
│  ℹ️ Results Summary                     │
│  We found 3 possible conditions         │
│                                         │
│  #1 Common Cold              ⬇️         │
│     High Risk - See Doctor Soon  [HIGH]│
│     Confidence: ▓▓▓▓▓▓▓▓░░ 82%          │
│     Your symptoms match this condition │
│                                         │
│     [Click to expand details...]        │
│                                         │
│  #2 Influenza                ⬇️         │
│     High Risk - See Doctor Soon  [HIGH]│
│     Confidence: ▓▓▓▓▓▓░░░░░░░░ 68%      │
│                                         │
│  #3 COVID-19                           │
│     Moderate Risk                [MOD] │
│     Confidence: ▓▓▓▓░░░░░░░░░░░░ 45%   │
│                                         │
│  ⚠️ IMPORTANT DISCLAIMER                │
│  This is not a medical diagnosis...    │
│                                         │
│  [Check Different Symptoms] [Save Results]
│                                         │
└─────────────────────────────────────────┘
```

### Step 5: Expanded Results
```
┌─────────────────────────────────────────┐
│  #1 Common Cold ⬆️ (Expanded)           │
├─────────────────────────────────────────┤
│                                         │
│  Your Matching Symptoms                 │
│  ✓ Cough                                │
│  ✓ Sore Throat                          │
│  ✓ Fever                                │
│                                         │
│  When to See a Doctor                   │
│  See a doctor if symptoms last more     │
│  than 10 days or worsen significantly.  │
│                                         │
│  Self-Care Tips                         │
│  • Get adequate rest and sleep          │
│  • Stay hydrated with water and warm    │
│  • Use over-the-counter pain relievers │
│  • Gargle with warm salt water          │
│  • Use humidifier to ease congestion    │
│                                         │
│  Risk Factors                           │
│  ⚠ Recent exposure to sick person       │
│  ⚠ Weakened immune system                │
│                                         │
│  More Information                       │
│  Learn more about Common Cold           │
│                                         │
└─────────────────────────────────────────┘
```

## ============================================================================
## FORM VALIDATION
## ============================================================================

### Validation Rules

**Symptom Count:**
- Minimum: 1 symptom required
- Maximum: 10 symptoms
- Error: "Please select at least one symptom"
- Error: "Please select a maximum of 10 symptoms"

**Symptom Selection:**
- No duplicates allowed
- Each symptom has unique ID
- Symptoms organized by category

**Form Submission:**
- Validates before API call
- Shows inline error messages
- Prevents double submission during API call

### Error Handling

```javascript
try {
  // Validate
  if (!validateSymptoms()) {
    setSubmissionError('Please select at least one symptom')
    setStage('input')
    return
  }

  // Submit
  setStage('submitting')
  const result = await checkSymptoms(symptomIds, { userId })
  
  // Success
  setStage('results')
  
} catch (err) {
  // Error
  setSubmissionError(err.message)
  setStage('error')
}
```

## ============================================================================
## API INTEGRATION
## ============================================================================

### Backend Endpoint

**POST /api/ai/check-symptoms**

**Request:**
```json
{
  "symptomIds": ["cough", "fever", "sore_throat"],
  "userId": "user-uuid",
  "timestamp": "2024-01-22T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "disease_id": "common_cold",
      "disease_name": "Common Cold",
      "confidence": 82.5,
      "severity": "high",
      "description": "A viral infection...",
      "matching_symptoms": ["Cough", "Sore Throat", "Fever"],
      "when_to_see_doctor": "See a doctor if...",
      "self_care_tips": ["Rest", "Stay hydrated", ...],
      "risk_factors": ["Recent exposure", ...],
      "additional_info": "The common cold..."
    },
    ...
  ],
  "confidence": 92,
  "analysisId": "analysis-uuid"
}
```

### Hook: useSymptomChecker

**Usage:**
```javascript
const { checkSymptoms, predictions, isLoading, error, reset } = useSymptomChecker()

const result = await checkSymptoms(['cough', 'fever'], { userId: '123' })
```

**Returns:**
- `predictions` - Array of disease predictions
- `isLoading` - Loading state
- `error` - Error message
- `reset()` - Reset state

**Error Handling:**
- Network errors
- Timeout errors (30 second limit)
- Server errors (500)
- Invalid symptoms (400)
- Connection issues

## ============================================================================
## MEDICAL DISCLAIMERS
## ============================================================================

### Top Banner
```
⚠️ MEDICAL DISCLAIMER

This Symptom Checker provides general health information and is not a 
substitute for professional medical advice, diagnosis, or treatment. 
Always consult with a qualified healthcare provider for medical concerns. 
In case of emergencies, call 911 or visit an emergency room immediately.
```

### Results Footer
```
⚠️ IMPORTANT

This tool provides general health information only. A medical professional 
must provide a proper diagnosis. If you have severe symptoms, seek immediate 
medical attention or call emergency services.
```

### Disease Card - When to See Doctor
```
When to See a Doctor

See a doctor if symptoms are severe, accompanied by difficulty breathing, 
persistent chest pain, or last longer than expected. Seek emergency care 
if symptoms are life-threatening.
```

## ============================================================================
## SEVERITY LEVELS
## ============================================================================

### Confidence to Severity Mapping

```
Confidence >= 80%  → CRITICAL    (Red)
Confidence >= 60%  → HIGH        (Orange)
Confidence >= 40%  → MODERATE    (Amber)
Confidence <  40%  → LOW         (Green)
```

### Color Scheme

| Severity  | Color   | Badge Text                  | When to Act            |
|-----------|---------|-----------------------------|-----------------------|
| Critical  | Red     | Seek Immediate Care         | Call 911 now          |
| High      | Orange  | See Doctor Soon             | Within 24 hours       |
| Moderate  | Amber   | Schedule Appointment        | Within 1 week         |
| Low       | Green   | Monitor Symptoms            | Watch and wait        |

## ============================================================================
## SAMPLE UI TEXT
## ============================================================================

### Page Title
"Symptom Checker"

### Subtitle
"Describe your symptoms to get health insights"

### Instruction Text
"Choose all symptoms you're currently experiencing (1-10 symptoms)"

### Section Headers
- "Select Your Symptoms"
- "Your Matching Symptoms"
- "When to See a Doctor"
- "Self-Care Tips"
- "Risk Factors"
- "More Information"

### Button Labels
- "Check Symptoms"
- "Check Different Symptoms"
- "Save Results"
- "Try Again"
- "Learn more about [Disease Name]"

### Status Messages
- "Analyzing Your Symptoms..."
- "Our AI is reviewing your symptoms..."
- "Selected Symptoms (3)"
- "3 of 10 maximum symptoms selected"

### Error Messages
- "Please select at least one symptom"
- "Please select a maximum of 10 symptoms"
- "Invalid symptoms provided. Please check your selection."
- "Request timed out. The server is taking too long."
- "Network error. Please check your connection."

## ============================================================================
## ACCESSIBILITY
## ============================================================================

### WCAG 2.1 AA Compliance

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ ARIA labels on form inputs
- ✅ Color contrast ratio >= 4.5:1
- ✅ Keyboard navigation throughout
- ✅ Focus visible on all interactive elements
- ✅ Icon + text for status indicators
- ✅ Error messages associated with fields

### Keyboard Navigation

- `Tab` - Move to next element
- `Shift+Tab` - Move to previous element
- `Enter` - Select symptom/submit form
- `Space` - Toggle checkbox
- `Escape` - Close expanded sections

## ============================================================================
## TESTING SCENARIOS
## ============================================================================

### Test Case 1: Happy Path
1. User selects 3 symptoms
2. Clicks "Check Symptoms"
3. API returns predictions
4. Results displayed successfully
5. User saves results

**Expected:** ✅ All predictions shown with confidence scores

### Test Case 2: Maximum Symptoms
1. User selects 10 symptoms (maximum)
2. Clicks "Check Symptoms"
3. Request succeeds

**Expected:** ✅ Submit button remains enabled at 10

### Test Case 3: Over Maximum
1. User attempts to select 11th symptom
2. 11th symptom cannot be selected

**Expected:** ✅ Can't select more than 10

### Test Case 4: Search Functionality
1. User types "fever" in search
2. Only fever-related symptoms shown

**Expected:** ✅ Results filtered correctly

### Test Case 5: Error Handling
1. User selects symptoms
2. Network error occurs during submission
3. Error message displayed

**Expected:** ✅ User can retry or reset

## ============================================================================
## MOBILE RESPONSIVENESS
## ============================================================================

### Desktop (1024px+)
- Full-width layout
- Multi-column information display
- Hover effects active

### Tablet (768px-1024px)
- Adjusted padding
- Single column layouts
- Touch-friendly targets

### Mobile (<768px)
- Full-width with side padding
- Vertical stacking
- Large touch targets (h-12, w-12)
- Readable text (min 16px)

## ============================================================================
## FUTURE ENHANCEMENTS
## ============================================================================

- [ ] Save symptom history
- [ ] Compare results over time
- [ ] Share results with doctor
- [ ] Print results for doctor visit
- [ ] Symptom severity rating (mild/moderate/severe)
- [ ] Duration of symptoms
- [ ] Medication interactions check
- [ ] Multiple language support
- [ ] Voice input for symptoms
- [ ] Integration with wearable devices
- [ ] Real-time doctor consultation booking
- [ ] Telemedicine integration
