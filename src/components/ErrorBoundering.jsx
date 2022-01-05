import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state to show the fallback UI during the next render phase
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // logging the error details
    // eslint-disable-next-line no-console
    console.log(`Cause: ${error}.\nStackTrace: ${info.componentStack}`);
  }

  render() {
    const {
      hasError,
    } = this.state;
    const {
      children,
    } = this.props;
    if (hasError) {
      // Return the fallback UI
      return <h3 style={{ textAlign: 'center' }}>Unfortunately, something went wrong.</h3>;
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]).isRequired,
};

export default ErrorBoundary;
