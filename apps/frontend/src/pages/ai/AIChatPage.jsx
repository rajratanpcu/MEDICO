import { useState, useEffect } from "react";
import Chatbot from '../../components/features/Chatbot';
import ErrorBoundary from "../../components/common/ErrorBoundary";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AIChatPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate AI service initialization
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <header className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 backdrop-blur-md">
                    <h1 className="text-3xl font-bold text-slate-100">
                        AI Medical Assistant
                    </h1>
                    <p className="mt-1 text-slate-400">
                        Ask clinical and wellness questions with AI-guided insights.
                    </p>
                </header>

                {loading ? (
                    <LoadingSpinner message="Initializing AI Chat..." />
                ) : (
                    <Chatbot />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AIChatPage;