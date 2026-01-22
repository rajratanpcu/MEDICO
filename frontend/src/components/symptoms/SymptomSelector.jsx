// SymptomSelector.jsx
// Multi-select symptom interface with search and categorization

import React, { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { SYMPTOM_CATEGORIES } from '@/data/symptomData'

/**
 * SymptomSelector Component
 * 
 * Multi-select interface for choosing symptoms:
 * - Search functionality
 * - Category filtering
 * - Selected count display
 * - Visual selection feedback
 * 
 * @param {Array} selectedSymptoms - Currently selected symptoms
 * @param {function} onSymptomToggle - Callback when symptom selected/deselected
 */
const SymptomSelector = ({ selectedSymptoms, onSymptomToggle }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({})

  // Initialize all categories as expanded
  React.useEffect(() => {
    const initial = {}
    SYMPTOM_CATEGORIES.forEach((cat) => {
      initial[cat.id] = true
    })
    setExpandedCategories(initial)
  }, [])

  /**
   * Filter symptoms based on search term
   */
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return SYMPTOM_CATEGORIES
    }

    const term = searchTerm.toLowerCase()
    return SYMPTOM_CATEGORIES.map((category) => ({
      ...category,
      symptoms: category.symptoms.filter(
        (symptom) =>
          symptom.name.toLowerCase().includes(term) ||
          symptom.description.toLowerCase().includes(term)
      )
    })).filter((category) => category.symptoms.length > 0)
  }, [searchTerm])

  /**
   * Toggle category expansion
   */
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  /**
   * Check if symptom is selected
   */
  const isSymptomSelected = (symptomId) => {
    return selectedSymptoms.some((s) => s.id === symptomId)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search symptoms... (e.g., headache, fever, cough)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {filteredCategories.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No symptoms found matching "{searchTerm}"
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <SymptomCategory
              key={category.id}
              category={category}
              isExpanded={expandedCategories[category.id]}
              onToggleExpand={() => toggleCategory(category.id)}
              selectedSymptoms={selectedSymptoms}
              isSymptomSelected={isSymptomSelected}
              onSymptomToggle={onSymptomToggle}
            />
          ))
        )}
      </div>

      {/* Selection Count */}
      {selectedSymptoms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            {selectedSymptoms.length} of 10 maximum symptoms selected
          </p>
          <div className="w-full h-2 bg-blue-200 rounded-full mt-2">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${(selectedSymptoms.length / 10) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * SymptomCategory Component
 * Expandable category of symptoms
 */
const SymptomCategory = ({
  category,
  isExpanded,
  onToggleExpand,
  selectedSymptoms,
  isSymptomSelected,
  onSymptomToggle
}) => {
  const selectedCount = selectedSymptoms.filter(
    (s) => s.categoryId === category.id
  ).length

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Category Header */}
      <button
        onClick={onToggleExpand}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-xs text-gray-600">{category.symptoms.length} symptoms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
              {selectedCount}
            </span>
          )}
          <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Category Symptoms */}
      {isExpanded && (
        <div className="bg-white border-t border-gray-200 p-4 space-y-2">
          {category.symptoms.map((symptom) => {
            const isSelected = isSymptomSelected(symptom.id)
            return (
              <button
                key={symptom.id}
                onClick={() => onSymptomToggle(symptom)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Symptom Info */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{symptom.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{symptom.description}</p>
                    {symptom.relatedSymptoms && (
                      <p className="text-xs text-gray-500 mt-2">
                        Related: {symptom.relatedSymptoms.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SymptomSelector
