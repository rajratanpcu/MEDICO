// mockData.js
// Mock data and test fixtures for medical report components

/**
 * MOCK ANALYSIS RESULT - Blood Test
 * Realistic data for testing AnalysisResults component
 */
export const mockBloodTestResult = {
  summary: 'Your recent blood test shows generally healthy results with a few values requiring attention. Your glucose and cholesterol levels are slightly elevated, which may benefit from lifestyle adjustments.',
  confidence: 92,
  
  abnormalValues: [
    {
      testName: 'Glucose',
      result: 145,
      unit: 'mg/dL',
      referenceRange: {
        min: 70,
        max: 100
      },
      severity: 'warning',
      direction: 'high',
      interpretation: 'Your blood sugar is higher than normal, which may indicate diabetes risk',
      recommendation: 'Contact your doctor to discuss diet modifications and possible testing for diabetes. Consider reducing sugar intake and increasing physical activity.'
    },
    {
      testName: 'Cholesterol',
      result: 250,
      unit: 'mg/dL',
      referenceRange: {
        min: 0,
        max: 200
      },
      severity: 'warning',
      direction: 'high',
      interpretation: 'Your cholesterol level is elevated, increasing risk for heart disease',
      recommendation: 'Reduce saturated fats and trans fats. Increase soluble fiber (oats, beans). Exercise regularly and schedule a follow-up with your doctor.'
    },
    {
      testName: 'Triglycerides',
      result: 280,
      unit: 'mg/dL',
      referenceRange: {
        min: 0,
        max: 150
      },
      severity: 'critical',
      direction: 'high',
      interpretation: 'Your triglyceride level is significantly elevated, which increases risk of heart disease and stroke',
      recommendation: 'Contact your doctor urgently. Reduce simple carbohydrates and alcohol. Regular exercise is essential. Your doctor may prescribe medication.'
    }
  ],
  
  findings: [
    {
      title: 'Elevated Fasting Glucose',
      description: 'Your blood sugar level is above normal range for fasting state',
      details: 'A fasting glucose of 145 mg/dL suggests your body may have difficulty regulating blood sugar. This could indicate impaired fasting glucose or prediabetes. Consider diabetes screening.',
      severity: 'warning',
      trend: 'worsening'
    },
    {
      title: 'High Cholesterol (LDL)',
      description: 'LDL cholesterol (bad cholesterol) is elevated',
      details: 'High LDL cholesterol increases plaque buildup in arteries. Diet changes, exercise, and possibly medication can help. Your doctor may recommend a statin.',
      severity: 'warning',
      trend: null
    },
    {
      title: 'Elevated Triglycerides',
      description: 'Triglyceride levels indicate increased cardiovascular risk',
      details: 'High triglycerides often accompany elevated glucose and are a risk factor for heart disease. Reducing carbohydrates and alcohol, plus regular exercise, can help significantly.',
      severity: 'high',
      trend: 'worsening'
    },
    {
      title: 'Normal Hemoglobin',
      description: 'Red blood cell oxygen capacity is normal',
      details: 'Your hemoglobin level indicates adequate oxygen-carrying capacity. No anemia detected.',
      severity: 'info',
      trend: 'improving'
    }
  ],
  
  recommendations: [
    'Schedule an appointment with your primary care doctor within 2 weeks to discuss results',
    'Get screened for diabetes if you haven\'t already (HbA1c test)',
    'Increase daily physical activity to at least 150 minutes of moderate exercise per week',
    'Reduce sugar and refined carbohydrate intake significantly',
    'Eat more heart-healthy foods: fruits, vegetables, whole grains, lean proteins',
    'Limit saturated fats and eliminate trans fats',
    'Reduce alcohol consumption',
    'Monitor your weight and aim for a healthy BMI (18.5-24.9)',
    'Consider stress reduction techniques like meditation or yoga',
    'Avoid smoking and secondhand smoke'
  ]
}

/**
 * MOCK ANALYSIS RESULT - Complete Blood Count (CBC)
 */
export const mockCBCResult = {
  summary: 'Your complete blood count shows mostly normal values with slightly low hemoglobin, which may indicate mild anemia. Other parameters are within normal range.',
  confidence: 88,
  
  abnormalValues: [
    {
      testName: 'Hemoglobin',
      result: 11.5,
      unit: 'g/dL',
      referenceRange: {
        min: 13.5,
        max: 17.5
      },
      severity: 'warning',
      direction: 'low',
      interpretation: 'Your red blood cell count is lower than normal, which may indicate mild anemia',
      recommendation: 'Increase iron-rich foods (lean red meat, spinach, lentils). Your doctor may recommend iron supplements. Follow up if symptoms like fatigue worsen.'
    }
  ],
  
  findings: [
    {
      title: 'Mild Anemia',
      description: 'Hemoglobin and hematocrit are below normal ranges',
      details: 'Mild anemia can cause fatigue and shortness of breath. Common causes include iron deficiency, B12 deficiency, or chronic disease. Further testing may be needed.',
      severity: 'warning',
      trend: null
    },
    {
      title: 'Normal White Blood Cells',
      description: 'Your immune system cells are at healthy levels',
      details: 'WBC count indicates normal immune function. No signs of infection or immune disorders.',
      severity: 'info',
      trend: null
    },
    {
      title: 'Normal Platelet Count',
      description: 'Blood clotting cells are normal',
      details: 'Platelet count indicates normal blood clotting ability.',
      severity: 'info',
      trend: null
    }
  ],
  
  recommendations: [
    'Consult with your doctor to determine the cause of anemia',
    'Increase dietary iron intake (red meat, poultry, fish, beans, leafy greens)',
    'Take iron supplements as recommended by your doctor',
    'Eat vitamin C rich foods to help iron absorption (citrus, tomatoes, peppers)',
    'Get tested for B12 and folate deficiency if recommended',
    'Monitor energy levels and report any significant fatigue',
    'Get adequate sleep and manage stress',
    'Follow up with blood work in 6-8 weeks to recheck hemoglobin'
  ]
}

/**
 * MOCK ANALYSIS RESULT - All Normal Values
 */
export const mockNormalResult = {
  summary: 'Great news! Your test results are all within normal ranges. Your health indicators show good metabolic function, normal immune response, and healthy blood clotting. Continue with your current healthy lifestyle.',
  confidence: 96,
  
  abnormalValues: [],
  
  findings: [
    {
      title: 'Overall Health Status: Good',
      description: 'All measured parameters are within normal ranges',
      details: 'Your comprehensive metabolic panel, complete blood count, and lipid profile all show healthy values. Keep up your current health practices.',
      severity: 'info',
      trend: 'improving'
    }
  ],
  
  recommendations: [
    'Continue with your current healthy lifestyle',
    'Maintain regular physical activity (150 minutes per week)',
    'Continue eating a balanced diet with plenty of fruits and vegetables',
    'Stay hydrated by drinking adequate water daily',
    'Get 7-9 hours of quality sleep each night',
    'Manage stress through relaxation techniques',
    'Schedule regular check-ups with your doctor (annually)',
    'Avoid smoking and limit alcohol consumption'
  ]
}

/**
 * MOCK FILES FOR TESTING
 */
export const createMockFile = (name, size, type) => {
  const blob = new Blob(['mock file content'.repeat(size / 18)], { type })
  return new File([blob], name, { type })
}

export const mockPDFFile = createMockFile(
  'blood_test_report.pdf',
  204800, // 200KB
  'application/pdf'
)

export const mockJPGFile = createMockFile(
  'xray_image.jpg',
  512000, // 500KB
  'image/jpeg'
)

export const mockPNGFile = createMockFile(
  'lab_scan.png',
  307200, // 300KB
  'image/png'
)

export const mockLargeFile = createMockFile(
  'large_report.pdf',
  11534336, // 11MB (exceeds limit)
  'application/pdf'
)

export const mockInvalidFile = createMockFile(
  'document.docx',
  102400, // 100KB
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
)

/**
 * MOCK API RESPONSES
 */
export const mockUploadResponse = {
  fileId: '550e8400-e29b-41d4-a716-446655440000',
  fileName: 'blood_test_report.pdf',
  fileSize: 204800,
  fileType: 'application/pdf',
  uploadedAt: '2024-01-15T10:30:00Z',
  patientId: '123e4567-e89b-12d3-a456-426614174000'
}

export const mockAnalysisResponse = {
  summary: 'Your blood test shows generally normal results with elevated glucose.',
  confidence: 92,
  abnormal_values: [
    {
      test_name: 'Glucose',
      result: '145',
      unit: 'mg/dL',
      reference_range: {
        min: '70',
        max: '100'
      },
      direction: 'high'
    }
  ],
  findings: [
    {
      title: 'Elevated Glucose',
      description: 'Blood sugar is above normal',
      details: 'Consider dietary modifications',
      severity: 'warning'
    }
  ],
  recommendations: [
    'Schedule doctor appointment',
    'Reduce sugar intake'
  ]
}

/**
 * MOCK API ERRORS
 */
export const mockNetworkError = new Error('Network request failed')
mockNetworkError.code = 'ERR_NETWORK'

export const mockTimeoutError = new Error('Request timeout')
mockTimeoutError.code = 'ECONNABORTED'

export const mockValidationError = {
  response: {
    status: 400,
    data: {
      message: 'Invalid file type. Only PDF, JPG, and PNG files are supported.'
    }
  }
}

export const mockAuthError = {
  response: {
    status: 401,
    data: {
      message: 'Unauthorized. Please log in again.'
    }
  }
}

export const mockServerError = {
  response: {
    status: 500,
    data: {
      message: 'Server error. Please try again later.'
    }
  }
}

/**
 * MOCK HOOKS RESPONSES
 */
export const mockUploadProgress = {
  0: { progress: 0, uploadSpeed: 0, timeRemaining: null },
  25: { progress: 25, uploadSpeed: 256000, timeRemaining: 0.8 },
  50: { progress: 50, uploadSpeed: 512000, timeRemaining: 0.4 },
  75: { progress: 75, uploadSpeed: 768000, timeRemaining: 0.2 },
  100: { progress: 100, uploadSpeed: 1024000, timeRemaining: 0 }
}

/**
 * MOCK PATIENT DATA
 */
export const mockPatient = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: '1990-01-15',
  gender: 'M',
  bloodType: 'O+',
  allergies: ['Penicillin'],
  medications: []
}

/**
 * MOCK DOCTOR DATA
 */
export const mockDoctor = {
  id: '987e6543-e89b-12d3-a456-426614174999',
  firstName: 'Dr. Sarah',
  lastName: 'Smith',
  email: 'dr.smith@hospital.com',
  specialty: 'Cardiology',
  licenseNumber: 'MD123456',
  hospital: 'City Medical Center'
}

/**
 * HELPER FUNCTIONS FOR TESTING
 */
export const createMockUploadHook = (initialProgress = 0) => {
  return {
    uploadFile: jest.fn().mockResolvedValue(mockUploadResponse),
    progress: initialProgress,
    uploadError: null,
    uploadSpeed: 0,
    timeRemaining: null,
    clearError: jest.fn(),
    reset: jest.fn(),
    isUploading: false
  }
}

export const createMockAnalysisHook = (result = mockBloodTestResult) => {
  return {
    analyzeReport: jest.fn().mockResolvedValue(result),
    analysisResult: result,
    isLoading: false,
    error: null,
    clearError: jest.fn(),
    reset: jest.fn()
  }
}

export const createMockApiClient = () => {
  return {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {
      baseURL: 'http://localhost:8080'
    }
  }
}

/**
 * TEST SCENARIOS
 */
export const testScenarios = {
  successfulUploadAndAnalysis: {
    description: 'User successfully uploads file and receives analysis',
    steps: [
      'User selects file via drag-drop or click',
      'File passes validation',
      'File is uploaded to backend',
      'Upload completes (100%)',
      'AI analysis is triggered',
      'Analysis completes',
      'Results are displayed'
    ],
    expectedResult: 'AnalysisResults component displays with all findings'
  },
  
  invalidFileType: {
    description: 'User attempts to upload invalid file type',
    steps: [
      'User selects .docx file',
      'Validation fails'
    ],
    expectedResult: 'Error message shown: "Invalid file type"'
  },
  
  fileTooLarge: {
    description: 'User attempts to upload file larger than 10MB',
    steps: [
      'User selects 15MB PDF file',
      'Validation fails'
    ],
    expectedResult: 'Error message shown: "File size exceeds 10MB limit"'
  },
  
  networkError: {
    description: 'Network connection drops during upload',
    steps: [
      'Upload starts',
      'Progress reaches 50%',
      'Network connection lost'
    ],
    expectedResult: 'Error message shown: "Upload failed. Please check connection"'
  },
  
  analysisTimeout: {
    description: 'AI analysis takes too long and times out',
    steps: [
      'File uploaded successfully',
      'Analysis requested',
      'Analysis takes > 2 minutes'
    ],
    expectedResult: 'Error message shown: "Analysis timed out"'
  },
  
  abnormalValuesDetected: {
    description: 'Analysis finds abnormal values',
    steps: [
      'Upload normal blood test',
      'Analysis completes',
      'Abnormal values identified'
    ],
    expectedResult: 'Abnormal values highlighted with severity colors and recommendations'
  }
}

export default {
  mockBloodTestResult,
  mockCBCResult,
  mockNormalResult,
  mockPDFFile,
  mockJPGFile,
  mockPNGFile,
  mockUploadResponse,
  mockAnalysisResponse,
  testScenarios,
  createMockFile,
  createMockUploadHook,
  createMockAnalysisHook,
  createMockApiClient
}
