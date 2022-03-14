import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const BrixelIcon = React.lazy(() => import('@brixel/brixel-components/dist/components/BrixelIcon'));

const Accordion = (props) => {
  const {
    children,
    className,
    color,
    contentClass,
    isExpanded,
    onExpand,
    paddingContent,
    saturationTxt,
    smallRightIcon,
    title,
    titleClass,
    singleItem,
  } = props;

  const [open, setOpen] = useState(isExpanded);

  useEffect(() => {
    setOpen(isExpanded);
  }, [isExpanded]);

  const onClickExpand = (val) => {
    if (onExpand) {
      onExpand(val);
    } else {
      setOpen(val);
    }
  };

  return (
    <div
      className={`accordion ${className} ${open ? 'open' : 'close'}`}
    >
      <button
        type="button"
        className={`title ${singleItem ? 'cur-def' : 'cur-poi'} ${titleClass} dis-f a-t`}
        onClick={() => {
          if (!singleItem) onClickExpand(!open);
        }}
      >
        {
          !smallRightIcon && !singleItem && (
            <BrixelIcon
              color="green"
              saturationTxt={200}
              iconWidth="w-fix-24"
              className="mt-small-4 mr-small-8"
              icon={!open ? 'arrow-right' : 'arrow-down'}
            />
          )
        }
        <span className="txtDark700">{title}</span>
        {
          smallRightIcon && !singleItem && (
            <BrixelIcon
              color={color}
              saturationTxt={saturationTxt}
              iconWidth="w-fix-24"
              className="mt-small-4 mr-small-8"
              icon={!open ? 'arrow-simple-right' : 'arrow-simple-down'}
            />
          )
        }
      </button>

      <div className={`content ${paddingContent} ${!open ? 'collapsed' : ''}`}>
        <div className={contentClass}>
          {children}
        </div>
      </div>

    </div>
  );
};

Accordion.defaultProps = {
  children: '',
  className: '',
  color: 'green',
  contentClass: '',
  isExpanded: false,
  onExpand: null,
  paddingContent: 'pl-4',
  saturationTxt: 200,
  smallRightIcon: false,
  singleItem: false,
  title: '',
  titleClass: '',
};

Accordion.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
  className: PropTypes.string,
  color: PropTypes.string,
  contentClass: PropTypes.string,
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func,
  paddingContent: PropTypes.string,
  saturationTxt: PropTypes.number,
  smallRightIcon: PropTypes.bool,
  singleItem: PropTypes.bool,
  title: PropTypes.string,
  titleClass: PropTypes.string,
};

export default Accordion;
