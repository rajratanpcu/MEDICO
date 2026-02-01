// symptomData.js
// Comprehensive symptom database organized by medical categories

/**
 * SYMPTOM_CATEGORIES
 * Complete list of symptoms organized by body system/category
 */
export const SYMPTOM_CATEGORIES = [
  {
    id: 'respiratory',
    name: 'Respiratory & Breathing',
    icon: '🫁',
    symptoms: [
      {
        id: 'cough',
        name: 'Cough',
        description: 'Persistent or recurring cough',
        relatedSymptoms: ['Sore Throat', 'Fever', 'Chest Pain']
      },
      {
        id: 'sore_throat',
        name: 'Sore Throat',
        description: 'Pain or irritation in the throat',
        relatedSymptoms: ['Cough', 'Fever', 'Difficulty Swallowing']
      },
      {
        id: 'shortness_of_breath',
        name: 'Shortness of Breath',
        description: 'Difficulty breathing or feeling out of breath',
        relatedSymptoms: ['Chest Pain', 'Dizziness', 'Fatigue']
      },
      {
        id: 'chest_pain',
        name: 'Chest Pain',
        description: 'Pain or discomfort in chest area',
        relatedSymptoms: ['Shortness of Breath', 'Heart Palpitations']
      },
      {
        id: 'congestion',
        name: 'Nasal Congestion',
        description: 'Stuffy or blocked nose',
        relatedSymptoms: ['Runny Nose', 'Sneezing', 'Sore Throat']
      },
      {
        id: 'runny_nose',
        name: 'Runny Nose',
        description: 'Nasal discharge or mucus drainage',
        relatedSymptoms: ['Congestion', 'Sneezing', 'Cough']
      },
      {
        id: 'sneezing',
        name: 'Sneezing',
        description: 'Frequent or excessive sneezing',
        relatedSymptoms: ['Runny Nose', 'Congestion', 'Itchy Eyes']
      },
      {
        id: 'wheezing',
        name: 'Wheezing',
        description: 'Whistling sound when breathing',
        relatedSymptoms: ['Shortness of Breath', 'Cough']
      }
    ]
  },
  {
    id: 'fever_chills',
    name: 'Fever & Temperature',
    icon: '🌡️',
    symptoms: [
      {
        id: 'fever',
        name: 'Fever',
        description: 'Body temperature above 98.6°F (37°C)',
        relatedSymptoms: ['Chills', 'Fatigue', 'Body Aches']
      },
      {
        id: 'chills',
        name: 'Chills',
        description: 'Feeling cold and shivering',
        relatedSymptoms: ['Fever', 'Sweating', 'Body Aches']
      },
      {
        id: 'night_sweats',
        name: 'Night Sweats',
        description: 'Excessive sweating during sleep',
        relatedSymptoms: ['Fever', 'Fatigue', 'Chills']
      },
      {
        id: 'cold_hands_feet',
        name: 'Cold Hands & Feet',
        description: 'Persistently cold extremities',
        relatedSymptoms: ['Fever', 'Fatigue']
      }
    ]
  },
  {
    id: 'gastrointestinal',
    name: 'Digestive & Stomach',
    icon: '🍽️',
    symptoms: [
      {
        id: 'nausea',
        name: 'Nausea',
        description: 'Feeling sick to the stomach',
        relatedSymptoms: ['Vomiting', 'Loss of Appetite', 'Stomach Pain']
      },
      {
        id: 'vomiting',
        name: 'Vomiting',
        description: 'Expelling contents of stomach',
        relatedSymptoms: ['Nausea', 'Diarrhea', 'Dehydration']
      },
      {
        id: 'diarrhea',
        name: 'Diarrhea',
        description: 'Loose or watery bowel movements',
        relatedSymptoms: ['Nausea', 'Vomiting', 'Stomach Pain']
      },
      {
        id: 'constipation',
        name: 'Constipation',
        description: 'Difficulty or infrequent bowel movements',
        relatedSymptoms: ['Stomach Pain', 'Bloating']
      },
      {
        id: 'stomach_pain',
        name: 'Stomach Pain',
        description: 'Abdominal pain or cramping',
        relatedSymptoms: ['Nausea', 'Diarrhea', 'Constipation']
      },
      {
        id: 'bloating',
        name: 'Bloating',
        description: 'Feeling full or swollen in abdomen',
        relatedSymptoms: ['Gas', 'Stomach Pain']
      },
      {
        id: 'loss_appetite',
        name: 'Loss of Appetite',
        description: 'Reduced desire to eat',
        relatedSymptoms: ['Nausea', 'Fatigue', 'Weight Loss']
      }
    ]
  },
  {
    id: 'pain_ache',
    name: 'Pain & Body Aches',
    icon: '💪',
    symptoms: [
      {
        id: 'headache',
        name: 'Headache',
        description: 'Pain in the head region',
        relatedSymptoms: ['Fever', 'Neck Stiffness', 'Dizziness']
      },
      {
        id: 'migraine',
        name: 'Migraine',
        description: 'Severe throbbing headache, often one-sided',
        relatedSymptoms: ['Nausea', 'Sensitivity to Light', 'Dizziness']
      },
      {
        id: 'body_aches',
        name: 'Body Aches',
        description: 'General muscle or joint pain',
        relatedSymptoms: ['Fever', 'Fatigue', 'Chills']
      },
      {
        id: 'back_pain',
        name: 'Back Pain',
        description: 'Pain in the back or spine',
        relatedSymptoms: []
      },
      {
        id: 'muscle_pain',
        name: 'Muscle Pain',
        description: 'Pain or soreness in muscles',
        relatedSymptoms: ['Body Aches', 'Fatigue']
      },
      {
        id: 'joint_pain',
        name: 'Joint Pain',
        description: 'Pain in joints (knees, ankles, etc.)',
        relatedSymptoms: ['Swelling', 'Stiffness']
      },
      {
        id: 'neck_stiffness',
        name: 'Neck Stiffness',
        description: 'Difficulty moving or pain in neck',
        relatedSymptoms: ['Headache', 'Fever']
      }
    ]
  },
  {
    id: 'fatigue_sleep',
    name: 'Fatigue & Sleep',
    icon: '😴',
    symptoms: [
      {
        id: 'fatigue',
        name: 'Fatigue',
        description: 'Extreme tiredness or lack of energy',
        relatedSymptoms: ['Fever', 'Body Aches', 'Loss of Appetite']
      },
      {
        id: 'weakness',
        name: 'Weakness',
        description: 'Loss of physical strength',
        relatedSymptoms: ['Fatigue', 'Dizziness']
      },
      {
        id: 'insomnia',
        name: 'Insomnia',
        description: 'Difficulty falling or staying asleep',
        relatedSymptoms: ['Fatigue', 'Anxiety']
      },
      {
        id: 'excessive_sleep',
        name: 'Excessive Sleepiness',
        description: 'Sleeping much more than usual',
        relatedSymptoms: ['Fatigue', 'Depression']
      }
    ]
  },
  {
    id: 'neurological',
    name: 'Neurological & Senses',
    icon: '🧠',
    symptoms: [
      {
        id: 'dizziness',
        name: 'Dizziness',
        description: 'Feeling lightheaded or unbalanced',
        relatedSymptoms: ['Headache', 'Nausea', 'Vision Changes']
      },
      {
        id: 'confusion',
        name: 'Confusion',
        description: 'Mental fog or difficulty concentrating',
        relatedSymptoms: ['Dizziness', 'Fever', 'Fatigue']
      },
      {
        id: 'vision_changes',
        name: 'Vision Changes',
        description: 'Blurred vision or vision problems',
        relatedSymptoms: ['Dizziness', 'Headache']
      },
      {
        id: 'tingling',
        name: 'Tingling or Numbness',
        description: 'Pins and needles sensation',
        relatedSymptoms: []
      },
      {
        id: 'tremor',
        name: 'Tremor or Shaking',
        description: 'Involuntary shaking or trembling',
        relatedSymptoms: ['Fever', 'Chills', 'Anxiety']
      },
      {
        id: 'hearing_changes',
        name: 'Hearing Changes',
        description: 'Ringing ears or hearing loss',
        relatedSymptoms: ['Dizziness', 'Headache']
      }
    ]
  },
  {
    id: 'skin',
    name: 'Skin & Allergies',
    icon: '🩹',
    symptoms: [
      {
        id: 'rash',
        name: 'Rash',
        description: 'Irritated, red, or inflamed skin',
        relatedSymptoms: ['Itching', 'Fever']
      },
      {
        id: 'itching',
        name: 'Itching',
        description: 'Persistent itchy feeling',
        relatedSymptoms: ['Rash', 'Hives']
      },
      {
        id: 'hives',
        name: 'Hives',
        description: 'Red, raised, itchy bumps on skin',
        relatedSymptoms: ['Itching', 'Swelling', 'Fever']
      },
      {
        id: 'swelling',
        name: 'Swelling',
        description: 'Puffiness or inflammation of body part',
        relatedSymptoms: ['Rash', 'Itching', 'Pain']
      },
      {
        id: 'bruising',
        name: 'Bruising',
        description: 'Discolored skin from injury or bleeding',
        relatedSymptoms: ['Swelling', 'Pain']
      },
      {
        id: 'sores',
        name: 'Sores or Wounds',
        description: 'Open or painful skin lesions',
        relatedSymptoms: ['Rash', 'Itching']
      }
    ]
  },
  {
    id: 'mental_emotional',
    name: 'Mental & Emotional',
    icon: '🧘',
    symptoms: [
      {
        id: 'anxiety',
        name: 'Anxiety',
        description: 'Feeling nervous or worried',
        relatedSymptoms: ['Insomnia', 'Heart Palpitations']
      },
      {
        id: 'depression',
        name: 'Depression',
        description: 'Persistent sadness or hopelessness',
        relatedSymptoms: ['Fatigue', 'Loss of Appetite', 'Insomnia']
      },
      {
        id: 'mood_changes',
        name: 'Mood Changes',
        description: 'Sudden or extreme emotional shifts',
        relatedSymptoms: ['Anxiety', 'Depression']
      },
      {
        id: 'irritability',
        name: 'Irritability',
        description: 'Easily annoyed or agitated',
        relatedSymptoms: ['Anxiety', 'Stress']
      }
    ]
  },
  {
    id: 'heart_circulation',
    name: 'Heart & Circulation',
    icon: '❤️',
    symptoms: [
      {
        id: 'heart_palpitations',
        name: 'Heart Palpitations',
        description: 'Awareness of heartbeat or irregular heartbeat',
        relatedSymptoms: ['Dizziness', 'Shortness of Breath', 'Anxiety']
      },
      {
        id: 'high_blood_pressure',
        name: 'High Blood Pressure',
        description: 'Elevated blood pressure readings',
        relatedSymptoms: ['Headache', 'Dizziness']
      },
      {
        id: 'low_blood_pressure',
        name: 'Low Blood Pressure',
        description: 'Low blood pressure readings',
        relatedSymptoms: ['Dizziness', 'Fatigue', 'Weakness']
      },
      {
        id: 'leg_swelling',
        name: 'Leg Swelling',
        description: 'Puffiness or swelling in legs',
        relatedSymptoms: ['Pain', 'Redness']
      }
    ]
  },
  {
    id: 'urinary',
    name: 'Urinary & Reproductive',
    icon: '💧',
    symptoms: [
      {
        id: 'frequent_urination',
        name: 'Frequent Urination',
        description: 'Need to urinate more often than usual',
        relatedSymptoms: ['Thirst', 'Fatigue']
      },
      {
        id: 'painful_urination',
        name: 'Painful Urination',
        description: 'Pain or burning when urinating',
        relatedSymptoms: ['Fever', 'Pelvic Pain']
      },
      {
        id: 'blood_in_urine',
        name: 'Blood in Urine',
        description: 'Reddish or brown urine',
        relatedSymptoms: ['Painful Urination', 'Back Pain']
      },
      {
        id: 'pelvic_pain',
        name: 'Pelvic Pain',
        description: 'Pain in lower abdomen or pelvic area',
        relatedSymptoms: ['Painful Urination', 'Fever']
      }
    ]
  },
  {
    id: 'other',
    name: 'Other Symptoms',
    icon: '⚡',
    symptoms: [
      {
        id: 'weight_loss',
        name: 'Weight Loss',
        description: 'Unexplained loss of body weight',
        relatedSymptoms: ['Loss of Appetite', 'Fatigue']
      },
      {
        id: 'weight_gain',
        name: 'Weight Gain',
        description: 'Unexplained weight gain',
        relatedSymptoms: ['Swelling', 'Fatigue']
      },
      {
        id: 'thirst',
        name: 'Excessive Thirst',
        description: 'Abnormal thirst or dry mouth',
        relatedSymptoms: ['Frequent Urination', 'Dry Skin']
      },
      {
        id: 'dry_mouth',
        name: 'Dry Mouth',
        description: 'Lack of saliva in mouth',
        relatedSymptoms: ['Thirst', 'Difficulty Swallowing']
      }
    ]
  }
]

/**
 * Common symptom combinations and their typical conditions
 */
export const SYMPTOM_COMBINATIONS = {
  'fever_cough_sore_throat': ['Common Cold', 'Influenza', 'COVID-19', 'Strep Throat'],
  'headache_fever_body_aches': ['Influenza', 'Meningitis', 'COVID-19'],
  'chest_pain_shortness_of_breath': ['Heart Attack', 'Pneumonia', 'Pulmonary Embolism', 'Anxiety'],
  'diarrhea_nausea_vomiting': ['Gastroenteritis', 'Food Poisoning', 'COVID-19'],
  'frequent_urination_thirst': ['Diabetes', 'UTI', 'Hyperthyroidism'],
  'fatigue_weakness_shortness_of_breath': ['Anemia', 'Heart Failure', 'Thyroid Disorder']
}

/**
 * Symptom severity indicators
 */
export const EMERGENCY_SYMPTOMS = [
  'Severe chest pain',
  'Difficulty breathing',
  'Loss of consciousness',
  'Severe headache with fever',
  'Confused or disoriented',
  'Severe abdominal pain',
  'Coughing up blood',
  'Severe allergic reaction',
  'Poisoning'
]

/**
 * Get all symptom IDs
 */
export const getAllSymptomIds = () => {
  return SYMPTOM_CATEGORIES.flatMap((cat) =>
    cat.symptoms.map((sym) => sym.id)
  )
}

/**
 * Get symptom by ID
 */
export const getSymptomById = (id) => {
  for (const category of SYMPTOM_CATEGORIES) {
    const symptom = category.symptoms.find((s) => s.id === id)
    if (symptom) {
      return {
        ...symptom,
        categoryId: category.id,
        categoryName: category.name
      }
    }
  }
  return null
}

/**
 * Get category by ID
 */
export const getCategoryById = (id) => {
  return SYMPTOM_CATEGORIES.find((cat) => cat.id === id)
}
