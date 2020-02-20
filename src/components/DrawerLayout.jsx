import React from 'react';
import PropTypes from 'prop-types';

const DrawerLayout = (props) => {
  const {
    children,
  } = props;
  return (
    <div className="wrapDrawer">
      <div className="drawer">
        {children}
      </div>
    </div>
  );
};

DrawerLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default DrawerLayout;
