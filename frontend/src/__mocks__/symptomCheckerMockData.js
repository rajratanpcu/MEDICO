// mockData.js
// Mock data for testing and development

export const MOCK_PREDICTIONS_COLD = [
  {
    diseaseId: 'common_cold',
    diseaseName: 'Common Cold',
    confidence: 82.5,
    severity: 'high',
    description: 'A viral infection of the upper respiratory tract caused by rhinoviruses or other common viral pathogens.',
    matchingSymptoms: ['Cough', 'Sore Throat', 'Fever'],
    whenToSeeDoctorText: 'See a doctor if symptoms last more than 10 days, if fever is above 103°F, or if you have severe breathing difficulty.',
    selfCareTips: [
      'Get adequate rest and sleep (7-9 hours per night)',
      'Stay hydrated with water, herbal tea, and warm liquids',
      'Use over-the-counter pain relievers like acetaminophen or ibuprofen for aches and fever',
      'Gargle with warm salt water to soothe your throat',
      'Use a humidifier to ease congestion and coughing'
    ],
    riskFactors: [
      'Recent exposure to someone with cold symptoms',
      'Weakened immune system',
      'Stress and lack of sleep',
      'Cold weather exposure',
      'Crowded environments'
    ],
    additionalInfo: 'The common cold is the most frequent infectious disease in humans. Most people recover within 7-10 days without medical treatment. Antibiotics are not effective against cold viruses.'
  },
  {
    diseaseId: 'influenza',
    diseaseName: 'Influenza (Flu)',
    confidence: 68.3,
    severity: 'high',
    description: 'A viral respiratory infection caused by influenza viruses, more severe than the common cold.',
    matchingSymptoms: ['Cough', 'Fever'],
    whenToSeeDoctorText: 'Seek medical attention if you have difficulty breathing, severe chest pain, or high fever (above 104°F). Consider antiviral medication if symptoms appear early.',
    selfCareTips: [
      'Rest for several days while your body fights the infection',
      'Maintain hydration with clear broths, water, and warm drinks',
      'Take acetaminophen or ibuprofen for fever and muscle aches',
      'Use a humidifier to ease respiratory symptoms',
      'Avoid spreading to others by practicing good hygiene'
    ],
    riskFactors: [
      'Exposure to infected individuals',
      'Compromised immune system',
      'Chronic medical conditions (diabetes, heart disease)',
      'Age (young children or elderly)',
      'Seasonal flu circulation'
    ],
    additionalInfo: 'Influenza is more contagious than the common cold and can lead to serious complications. Annual flu vaccination is recommended. Antiviral medications like oseltamivir (Tamiflu) are most effective within 48 hours of symptom onset.'
  },
  {
    diseaseId: 'covid_19',
    diseaseName: 'COVID-19',
    confidence: 45.2,
    severity: 'moderate',
    description: 'A respiratory illness caused by the novel coronavirus SARS-CoV-2.',
    matchingSymptoms: ['Cough', 'Fever'],
    whenToSeeDoctorText: 'Seek emergency care immediately if you have trouble breathing, persistent pain in the chest, or confusion. Contact your doctor if symptoms worsen.',
    selfCareTips: [
      'Isolate yourself from others to prevent spread',
      'Monitor your oxygen saturation if you have a pulse oximeter',
      'Stay hydrated and get adequate rest',
      'Take fever-reducing medications as needed',
      'Consider getting tested to confirm diagnosis'
    ],
    riskFactors: [
      'Close contact with confirmed COVID-19 patients',
      'Age over 65',
      'Underlying medical conditions',
      'Immunocompromised status',
      'Living in high-transmission areas'
    ],
    additionalInfo: 'COVID-19 severity ranges from asymptomatic to critical. Most people recover within 2-4 weeks. Vaccination significantly reduces severe illness risk. Seek testing to confirm diagnosis.'
  }
]

export const MOCK_PREDICTIONS_HEADACHE = [
  {
    diseaseId: 'tension_headache',
    diseaseName: 'Tension Headache',
    confidence: 75.8,
    severity: 'moderate',
    description: 'The most common type of headache, often caused by muscle tension in the neck and scalp.',
    matchingSymptoms: ['Headache', 'Neck Stiffness'],
    whenToSeeDoctorText: 'Most tension headaches resolve with rest and over-the-counter pain relief. See a doctor if headaches are frequent (more than 15 per month) or severe.',
    selfCareTips: [
      'Apply a heating pad or warm compress to your neck and shoulders',
      'Practice relaxation techniques such as deep breathing',
      'Take a break from screen time',
      'Do gentle neck stretches',
      'Use over-the-counter pain relievers like aspirin or ibuprofen'
    ],
    riskFactors: [
      'Stress and emotional tension',
      'Poor posture',
      'Muscle tension from computer work',
      'Sleep deprivation',
      'Caffeine withdrawal'
    ],
    additionalInfo: 'Tension headaches are benign but can significantly impact quality of life. Regular exercise, stress management, and ergonomic adjustments can help prevent recurrence.'
  },
  {
    diseaseId: 'migraine',
    diseaseName: 'Migraine',
    confidence: 52.1,
    severity: 'moderate',
    description: 'A neurological condition characterized by intense, debilitating headaches often accompanied by other symptoms.',
    matchingSymptoms: ['Headache'],
    whenToSeeDoctorText: 'See a doctor if migraines are frequent or severely impacting your daily activities. Emergency care is needed for the worst headache of your life.',
    selfCareTips: [
      'Rest in a dark, quiet room',
      'Apply a cold compress to your head or neck',
      'Stay hydrated and avoid skipping meals',
      'Take migraine-specific medications (triptans) at first sign',
      'Identify and avoid triggers'
    ],
    riskFactors: [
      'Family history of migraines',
      'Hormonal changes',
      'Certain foods (chocolate, cheese, processed meats)',
      'Sleep changes',
      'Environmental factors'
    ],
    additionalInfo: 'Migraines affect about 12% of the population. Preventive medications are available for frequent migraines. Early treatment is most effective.'
  }
]

export const MOCK_PREDICTIONS_STOMACH = [
  {
    diseaseId: 'gastroenteritis',
    diseaseName: 'Gastroenteritis (Food Poisoning)',
    confidence: 71.4,
    severity: 'moderate',
    description: 'Inflammation of the stomach and intestines caused by viral or bacterial infection.',
    matchingSymptoms: ['Nausea', 'Vomiting', 'Stomach Pain', 'Diarrhea'],
    whenToSeeDoctorText: 'Seek medical attention if you have severe dehydration symptoms (dark urine, extreme thirst), blood in stool, or symptoms lasting more than 3 days.',
    selfCareTips: [
      'Rest and allow your digestive system to recover',
      'Sip clear liquids frequently (water, broth, electrolyte drinks)',
      'Avoid solid foods for 24 hours',
      'Take over-the-counter anti-nausea or anti-diarrheal medication if needed',
      'Gradually reintroduce bland foods'
    ],
    riskFactors: [
      'Consumption of contaminated food or water',
      'Poor food handling practices',
      'Recent travel to developing countries',
      'Exposure to infected individuals',
      'Weak immune system'
    ],
    additionalInfo: 'Most cases resolve within 1-3 days. The main concern is dehydration. Replace lost fluids and electrolytes. Avoid dairy and high-fat foods during recovery.'
  },
  {
    diseaseId: 'ibs',
    diseaseName: 'Irritable Bowel Syndrome (IBS)',
    confidence: 43.7,
    severity: 'moderate',
    description: 'A functional gastrointestinal disorder characterized by abdominal pain and altered bowel habits.',
    matchingSymptoms: ['Stomach Pain', 'Diarrhea'],
    whenToSeeDoctorText: 'Consult a doctor for persistent symptoms lasting more than a few weeks. Get evaluated if you have alarm symptoms like weight loss or bloody stools.',
    selfCareTips: [
      'Identify and avoid trigger foods',
      'Increase dietary fiber gradually',
      'Stay physically active',
      'Manage stress with relaxation techniques',
      'Keep a symptom diary to identify patterns'
    ],
    riskFactors: [
      'Stress and anxiety',
      'Dietary factors (low fiber, high fat)',
      'Hormonal changes',
      'Gut infections',
      'Family history of IBS'
    ],
    additionalInfo: 'IBS affects 10-15% of the global population. It\'s a chronic condition requiring long-term management. Treatment focuses on symptom relief and lifestyle modifications.'
  }
]

export const MOCK_API_RESPONSE = {
  success: true,
  predictions: MOCK_PREDICTIONS_COLD,
  confidence: 92,
  analysisId: 'analysis-uuid-123',
  timestamp: new Date().toISOString()
}

export const MOCK_SELECTED_SYMPTOMS = [
  { id: 'cough', name: 'Cough' },
  { id: 'fever', name: 'Fever' },
  { id: 'sore_throat', name: 'Sore Throat' }
]

export const MOCK_SYMPTOM_IDS = ['cough', 'fever', 'sore_throat']

export const MOCK_USER_ID = 'user-uuid-123'

// Hook return values for testing
export const MOCK_HOOK_RETURN_LOADING = {
  checkSymptoms: jest.fn(),
  predictions: null,
  isLoading: true,
  error: null,
  reset: jest.fn()
}

export const MOCK_HOOK_RETURN_SUCCESS = {
  checkSymptoms: jest.fn(),
  predictions: MOCK_PREDICTIONS_COLD,
  isLoading: false,
  error: null,
  reset: jest.fn()
}

export const MOCK_HOOK_RETURN_ERROR = {
  checkSymptoms: jest.fn(),
  predictions: null,
  isLoading: false,
  error: 'Request timeout. Please try again.',
  reset: jest.fn()
}

// Error scenarios
export const MOCK_ERROR_NETWORK = new Error('Network request failed')
export const MOCK_ERROR_TIMEOUT = new Error('Request timeout')
export const MOCK_ERROR_SERVER = new Error('Internal server error')

// Test component wrapper
export function MockSymptomCheckerProvider({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {children}
    </div>
  )
}

// Utility: Create mock prediction with custom values
export function createMockPrediction(overrides = {}) {
  return {
    diseaseId: 'mock_disease',
    diseaseName: 'Mock Disease',
    confidence: 75,
    severity: 'high',
    description: 'A mock disease for testing purposes.',
    matchingSymptoms: ['Symptom 1', 'Symptom 2'],
    whenToSeeDoctorText: 'See a doctor if symptoms persist.',
    selfCareTips: ['Tip 1', 'Tip 2', 'Tip 3'],
    riskFactors: ['Factor 1', 'Factor 2'],
    additionalInfo: 'Additional information about the mock disease.',
    ...overrides
  }
}

// Utility: Create mock API response with custom predictions
export function createMockApiResponse(predictions = MOCK_PREDICTIONS_COLD, overrides = {}) {
  return {
    success: true,
    predictions,
    confidence: 92,
    analysisId: 'analysis-uuid-' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    ...overrides
  }
}

// Test data for different scenarios
export const TEST_SCENARIOS = {
  // Scenario 1: Common cold with typical symptoms
  coldScenario: {
    symptoms: ['cough', 'fever', 'sore_throat'],
    expectedDisease: 'common_cold',
    predictions: MOCK_PREDICTIONS_COLD
  },

  // Scenario 2: Headache with related symptoms
  headacheScenario: {
    symptoms: ['headache', 'neck_stiffness'],
    expectedDisease: 'tension_headache',
    predictions: MOCK_PREDICTIONS_HEADACHE
  },

  // Scenario 3: Stomach issues
  stomachScenario: {
    symptoms: ['nausea', 'vomiting', 'stomach_pain', 'diarrhea'],
    expectedDisease: 'gastroenteritis',
    predictions: MOCK_PREDICTIONS_STOMACH
  },

  // Scenario 4: Single symptom
  singleSymptomScenario: {
    symptoms: ['cough'],
    expectedDisease: null,
    predictions: []
  },

  // Scenario 5: Maximum symptoms (10)
  maxSymptomScenario: {
    symptoms: [
      'cough', 'fever', 'sore_throat', 'headache',
      'body_aches', 'fatigue', 'nausea', 'vomiting',
      'chills', 'congestion'
    ],
    expectedDisease: 'influenza',
    predictions: MOCK_PREDICTIONS_COLD
  }
}

// API response variations for error testing
export const API_ERROR_RESPONSES = {
  // 400: Invalid request
  badRequest: {
    status: 400,
    data: {
      success: false,
      error: 'Invalid symptom IDs provided',
      details: ['symptom_xyz is not a valid symptom ID']
    }
  },

  // 408: Request timeout
  timeout: {
    status: 408,
    data: {
      success: false,
      error: 'Request timeout',
      details: 'The analysis took too long to complete'
    }
  },

  // 500: Server error
  serverError: {
    status: 500,
    data: {
      success: false,
      error: 'Internal server error',
      details: 'An unexpected error occurred while processing your request'
    }
  },

  // Network error
  networkError: {
    message: 'Network error',
    code: 'ECONNREFUSED'
  }
}

// Form validation test cases
export const FORM_VALIDATION_TESTS = {
  // No symptoms selected
  noSymptoms: {
    input: [],
    isValid: false,
    expectedError: 'Please select at least one symptom'
  },

  // One symptom (valid minimum)
  oneSymptom: {
    input: ['cough'],
    isValid: true,
    expectedError: null
  },

  // Five symptoms (valid middle)
  fiveSymptoms: {
    input: ['cough', 'fever', 'sore_throat', 'headache', 'body_aches'],
    isValid: true,
    expectedError: null
  },

  // Ten symptoms (valid maximum)
  tenSymptoms: {
    input: [
      'cough', 'fever', 'sore_throat', 'headache', 'body_aches',
      'fatigue', 'nausea', 'vomiting', 'chills', 'congestion'
    ],
    isValid: true,
    expectedError: null
  },

  // Eleven symptoms (invalid - over max)
  elevenSymptoms: {
    input: [
      'cough', 'fever', 'sore_throat', 'headache', 'body_aches',
      'fatigue', 'nausea', 'vomiting', 'chills', 'congestion', 'rash'
    ],
    isValid: false,
    expectedError: 'Please select a maximum of 10 symptoms'
  },

  // Duplicate symptoms
  duplicateSymptoms: {
    input: ['cough', 'cough', 'fever'],
    isValid: true, // Duplicates filtered out
    expectedError: null
  }
}

// UI state test cases
export const UI_STATE_TESTS = {
  inputStage: {
    stage: 'input',
    shouldShow: {
      disclimer: true,
      symptomSelector: true,
      submitButton: true,
      spinner: false,
      results: false,
      errorMessage: false
    }
  },

  submittingStage: {
    stage: 'submitting',
    shouldShow: {
      disclaimer: true,
      symptomSelector: false,
      submitButton: false,
      spinner: true,
      results: false,
      errorMessage: false
    }
  },

  resultsStage: {
    stage: 'results',
    shouldShow: {
      disclaimer: true,
      symptomSelector: false,
      submitButton: false,
      spinner: false,
      results: true,
      errorMessage: false
    }
  },

  errorStage: {
    stage: 'error',
    shouldShow: {
      disclaimer: true,
      symptomSelector: false,
      submitButton: false,
      spinner: false,
      results: false,
      errorMessage: true
    }
  }
}
