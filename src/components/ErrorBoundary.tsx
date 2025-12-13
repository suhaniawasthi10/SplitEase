import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
        // Log error to error reporting service
        console.error('Error caught by boundary:', _error, _errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/dashboard';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>
                        {this.state.error && (
                            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                                <p className="text-sm text-gray-700 font-mono break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Return to Dashboard
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
