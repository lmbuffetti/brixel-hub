import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';

const DrawerLayout = (props) => {
  const {
    children, className, classNameDrawer,
    closeLink, history, onClose, windowDimensions,
  } = props;

  const drawerRef = useRef(null);

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(drawerRef, {
    action: 'function',
    func: () => {
      closeLink ? history.push(closeLink) : onClose();
    },
  });

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('hubDasHeader');
    const headTabs = document.getElementsByClassName('brixelNavMenu');
    const headHight =  head[0] ? head[0].offsetHeight : 0;
    const tabsHeight = headTabs[0] ? headTabs[0].offsetHeight : 0;
    return headHight - tabsHeight;
  };

  return (
    <div className={`wrapDrawer ${className}`}>
      <div className={`drawer shadow-1pd ${classNameDrawer}`} ref={drawerRef} style={{ marginTop: calcHeaderHeight(), height: windowDimensions.height - calcHeaderHeight() }}>
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
  onClose: PropTypes.func,
  windowDimensions: PropTypes.object.isRequired,
};

DrawerLayout.defaultProps = {
  className: '',
  classNameDrawer: '',
  closeLink: null,
  onClose: () => '',
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DrawerLayout);
