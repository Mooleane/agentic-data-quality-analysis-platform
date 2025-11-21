'use client';

import { Component } from 'react';
import '../styles/ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-content">
              <div className="error-boundary-icon">⚠️</div>
              <h1>Oops! Something went wrong</h1>
              <p className="error-boundary-message">
                We encountered an unexpected error while processing your data. Please try again or
                contact support if the problem persists.
              </p>

              {this.state.errorInfo && process.env.NODE_ENV === 'development' && (
                <>
                  <div className="error-boundary-details">
                    <pre>
                      {this.state.error && this.state.error.toString()}
                      {'\n\n'}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                    (Error details shown only in development mode)
                  </p>
                </>
              )}

              <div className="error-boundary-tips">
                <h3>What you can try:</h3>
                <ul>
                  <li>Check that your data file is valid and properly formatted</li>
                  <li>Try uploading a smaller file first</li>
                  <li>Clear your browser cache and try again</li>
                  <li>Use a different browser if the problem persists</li>
                </ul>
              </div>

              <div className="error-boundary-actions">
                <button
                  className="error-boundary-button error-boundary-button-primary"
                  onClick={this.handleReset}
                >
                  Try Again
                </button>
                <button
                  className="error-boundary-button error-boundary-button-secondary"
                  onClick={this.handleGoHome}
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
