import React from 'react';
import PropTypes from 'prop-types';

const DrawerLayout = (props) => {
  const {
    children,
    className,
    classNameDrawer,
  } = props;
  return (
    <div className={`wrapDrawer ${className}`}>
      <div className={`drawer ${classNameDrawer}`}>
        {children}
      </div>
    </div>
  );
};

DrawerLayout.propTypes = {
  children: PropTypes.object.isRequired,
  className: PropTypes.string,
  classNameDrawer: PropTypes.string,
};

DrawerLayout.defaultProps = {
  className: '',
  classNameDrawer: '',
};

export default DrawerLayout;
