import React from 'react';
import PropTypes from 'prop-types';

function LoadingSimple(props) {
  const { isLoading } = props;
  if (isLoading) {
    return (
      <span />
    );
  }
  return null;
}

LoadingSimple.propTypes = {
  isLoading: PropTypes.bool,
};

LoadingSimple.defaultProps = {
  isLoading: false,
};

export default LoadingSimple;
