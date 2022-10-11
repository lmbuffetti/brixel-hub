import translateTo from '../utils/translation';
import React from 'react';
import PropTypes from 'prop-types';

const DealsTitle = (props) => {
  const {
    className,
    lang,
    title,
    total,
  } = props;

  return (
    <div className={`title dis-fl-row a-c jc-b pl-2 py-2 ${className}`}>
      <span className="fweight-500 fsize-500 txtDark700 mr-1 tt-c">{translateTo(title, lang)}</span>
      <span className="fweight-300 fsize-200 txtLight500"><span>{translateTo('Total', lang)}</span>&nbsp;<span className="notranslate">{translateTo(total, lang)}</span></span>
    </div>
  );
};

DealsTitle.propTypes = {
  className: PropTypes.string,
  lang: PropTypes.string.isRequired,
  title: PropTypes.string,
  total: PropTypes.number,
};

DealsTitle.defaultProps = {
  className: '',
  title: '',
  total: 0,
};

export default DealsTitle;
