import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center 
                        justify-center bg-gray-950 text-white px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-400 text-center max-w-md mb-6">
            An unexpected error occurred in this component.
            Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                       rounded-lg font-medium transition-colors"
          >
        
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;