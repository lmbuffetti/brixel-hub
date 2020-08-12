import React from 'react';
import PropTypes from 'prop-types';

// COMPONENT TO LOAD THE DIFFRENT EMOJI
const Emoji = (props) => {
  const {
    label,
    symbol,
  } = props;

  return (
    <span
      className="emoji dis-b"
      role="img"
      aria-label={label || ''}
      aria-hidden={label ? 'false' : 'true'}
    >
      {symbol}
    </span>
  );
};

Emoji.propTypes = {
  label: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default Emoji;
