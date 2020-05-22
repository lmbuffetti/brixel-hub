import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import useOutsideAlerter from '../components/OutsideElement';
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
    const headHeight =  head[0] ? head[0].offsetHeight : 0;
    const tabsHeight = headTabs[0] ? headTabs[0].offsetHeight : 0;
    return {
      height: windowDimensions.height > 767 ? headHeight - tabsHeight : headHeight,
      marginTop: windowDimensions.height > 767 ? headHeight - tabsHeight : headHeight
    };
  };

  return (
    <div className={`wrapDrawer ${className}`}>
      <div className="container h-perc-100 ov-x-h pos-r">
        <div className={`drawer shadow-1pd ${classNameDrawer}`} ref={drawerRef} style={{ marginTop: calcHeaderHeight().marginTop, height: windowDimensions.height - calcHeaderHeight().height }}>
          {children}
        </div>
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
