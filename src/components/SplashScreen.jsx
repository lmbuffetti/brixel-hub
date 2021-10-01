import React, {
  useRef, lazy, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  useOutsideAlerter,
} from '@brixel/brixel-components';
import Loading from './Loading';

const SplashScreenContent = lazy(() => import('./SplashScreenContent'));

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
    <div className={`wrapSplash ${type === 'marketOverlay' ? 'fixed' : ''} ${className} ${type}`}>
      <div className="container brdRadius m-a bgWhite p-small-4" ref={drawerRef}>
        <div className={`h-perc-100 ov-a dis-fl-col ${type === 'marketOverlay' ? '' : 'p-lg-3 p-2 px-2'}`}>
          {
            children || (
              <Suspense fallback={<Loading isLoading />}>
                <SplashScreenContent
                  type={type}
                />
              </Suspense>
            )
          }
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
