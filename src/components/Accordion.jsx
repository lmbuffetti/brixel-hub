import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BrixelIcon from '@brixel/brixel-components/dist/components/BrixelIcon';

const Accordion = (props) => {
  const {
    title,
    children,
    className,
    titleClass,
    contentClass,
    isExpanded,
  } = props;

  const [open, setOpen] = useState(isExpanded);

  return (
    <div
      className={`accordion ${className}`}
    >
      <div
        className={`title cur-poi ${titleClass} dis-f a-t`}
        onClick={() => setOpen(!open)}
      >
        <BrixelIcon
          color="green"
          saturationTxt="200"
          iconWidth="w-fix-24"
          className="mt-small-4 mr-small-8"
          icon={!open ? 'arrow-right' : 'arrow-down'}
        />
        <span>{title}</span>
      </div>

      <div className={`content pl-4 ${!open ? 'collapsed' : ''}`}>
        <p className={contentClass}>
          {children}
        </p>
      </div>

    </div>
  );
};

Accordion.defaultProps = {
  title: '',
  children: '',
  className: '',
  titleClass: '',
  contentClass: '',
  isExpanded: false,
};

Accordion.propTypes = {
  title: PropTypes.string,
  children: PropTypes.string,
  titleClass: PropTypes.string,
  contentClass: PropTypes.string,
  className: PropTypes.string,
  isExpanded: PropTypes.bool,
};

export default Accordion;
