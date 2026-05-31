import { useState, useEffect } from "react";
import SymptomCheckerComponent from '../../components/features/SymptomChecker';
import ErrorBoundary from "../../components/common/ErrorBoundary";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const SymptomCheckerPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate AI symptom engine initialization
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <header className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 backdrop-blur-md">
                    <h1 className="text-3xl font-bold text-slate-100">
                        AI Symptom Checker
                    </h1>
                    <p className="mt-1 text-slate-400">
                        Analyze symptoms and get AI-powered health insights.
                    </p>
                </header>

                {loading ? (
                    <LoadingSpinner message="Initializing Symptom Engine..." />
                ) : (
                    <div>
                        <SymptomCheckerComponent />
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default SymptomCheckerPage;