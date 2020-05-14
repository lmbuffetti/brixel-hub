import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import useOutsideAlerter from '../components/OutsideElement';

const DrawerLayout = (props) => {
  const {
    children, className, classNameDrawer,
    closeLink, history,
  } = props;

  const drawerRef = useRef(null);

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(drawerRef, {
    action: 'function',
    func: () => {
      history.push(closeLink);
    },
  });

  return (
    <div className={`wrapDrawerLeft container ${className}`}>
      <div className={`drawer ${classNameDrawer}`} ref={drawerRef}>
        {children}
      </div>
    </div>
  );
};

DrawerLayout.propTypes = {
  children: PropTypes.object.isRequired,
  className: PropTypes.string,
  classNameDrawer: PropTypes.string,
  history: PropTypes.object.isRequired,
  closeLink: PropTypes.string,
};

DrawerLayout.defaultProps = {
  className: '',
  classNameDrawer: '',
  closeLink: './',
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DrawerLayout);
