import React from 'react';
import PropTypes from 'prop-types';

const SidebarLayout = (props) => {
  const {
    children,
  } = props;
  return (
    <div className="wrapSidebar">
      <div className="rightSidebar">
        {children}
      </div>
    </div>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default SidebarLayout;
