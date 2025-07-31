import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and any error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Something went wrong
                  </h4>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-3">
                      <summary className="text-danger">Error Details (Development)</summary>
                      <pre className="mt-2 p-3 bg-light rounded" style={{ fontSize: '12px' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                  
                  <div className="mt-4">
                    <button 
                      className="btn btn-primary me-2"
                      onClick={() => window.location.reload()}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Refresh Page
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => window.history.back()}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </div>
                </div>
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