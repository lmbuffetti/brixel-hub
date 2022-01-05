import React from 'react';
import PropTypes from 'prop-types';

const ErrorBoundary = (props) => {
  const {
    children,
  } = props;

  try {
    return children;
  } catch {
    return (
      <div>
        Error Render
      </div>
    );
  }
};

ErrorBoundary.defaultProps = {
  children: null,
};

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
};

export default ErrorBoundary;
