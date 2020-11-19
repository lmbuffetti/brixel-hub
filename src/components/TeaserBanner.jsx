import React from 'react';
import PropTypes from 'prop-types';

const TeaserBanner = (props) => {
  const {
    className,
  } = props;

  return (
    <span className={className}>
      test
    </span>
  );
};

TeaserBanner.propTypes = {
  className: PropTypes.string,
};

TeaserBanner.defaultProps = {
  className: '',
};

export default TeaserBanner;
