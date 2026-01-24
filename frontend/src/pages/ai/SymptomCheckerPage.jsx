import SymptomCheckerComponent from '../../components/ai/SymptomChecker'

const SymptomCheckerPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">AI Symptom Checker</h1>
                    <p className="text-gray-600 mt-1">Analyze symptoms and get AI-powered health insights</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SymptomCheckerComponent />
            </div>
        </div>
    )
}

export default SymptomCheckerPage
