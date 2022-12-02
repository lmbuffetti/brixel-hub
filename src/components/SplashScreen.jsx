import { useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';

const SplashScreen = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    children,
    className,
    closeLink,
    closeOutside,
    type,
    wizard,
  } = props;

  const drawerRef = useRef(null);

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(drawerRef, {
    action: 'function',
    func: () => {
      if (closeOutside === true) {
        document.body.classList.remove('ov-h');
        history.push(closeLink);
      }
    },
  });

  return (
    <div className={`wrapSplash ${type === 'marketOverlay' ? 'fixed' : ''} ${className} ${type} ${wizard.type ? 'bgOverlayDark' : ''}`}>
      <div className="container brdRadius m-a bgWhite p-small-4" ref={drawerRef}>
        <div className={`h-perc-100 ov-a dis-fl-col ${type === 'marketOverlay' ? '' : 'p-lg-3 p-2 px-2'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

SplashScreen.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.string,
  closeLink: PropTypes.string,
  closeOutside: PropTypes.bool,
  type: PropTypes.string,
  wizard: PropTypes.object.isRequired,
};

SplashScreen.defaultProps = {
  children: null,
  className: '',
  closeLink: './',
  closeOutside: true,
  type: null,
};

const mapStateToProps = (state) => ({
  wizard: get(state, 'common.wizard', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(SplashScreen);
