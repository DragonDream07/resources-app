import React from 'react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, title = 'Something went wrong' } = this.props;

    if (!hasError) return children;

    if (fallback) {
      return typeof fallback === 'function'
        ? fallback({ error, reset: this.handleReset })
        : fallback;
    }

    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-100 bg-red-50 p-8 text-center"
      >
        <svg
          className="h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-red-900">{title}</h2>
          {error && (
            <p className="text-sm text-red-700">{error.message}</p>
          )}
        </div>
        <Button variant="secondary" onClick={this.handleReset}>
          Try again
        </Button>
      </div>
    );
  }
}

export default ErrorBoundary;
