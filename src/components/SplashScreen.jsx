import React, {
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import {
  compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  useOutsideAlerter,
} from '@brixel/brixel-components';
import Loadable from 'react-loadable';
import Loading from './Loading';

const SplashScreenContent = Loadable({
  loader: () => import('./SplashScreenContent' /* webpackChunkName: "SplashScreenContent" */),
  loading: Loading,
});

const SplashScreen = (props) => {
  const {
    children,
    className,
    closeLink,
    closeOutside,
    history,
    type,
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
    <div className={`wrapSplash fixed ${className}`}>
      <div className="container brdRadius m-a bgWhite p-small-4" ref={drawerRef}>
        <div className="h-perc-100 ov-a p-md-3 p-2 px-2">
          {
            children || (
              <SplashScreenContent
                type={type}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

SplashScreen.propTypes = {
  children: PropTypes.object,
  className: PropTypes.string,
  closeLink: PropTypes.string,
  closeOutside: PropTypes.bool,
  history: PropTypes.object.isRequired,
  type: PropTypes.string,
};

SplashScreen.defaultProps = {
  children: null,
  className: '',
  closeLink: './',
  closeOutside: true,
  type: null,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
