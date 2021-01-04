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

const SplashScreen = (props) => {
  const {
    children,
    className,
    closeLink,
    history,
    closeOutside,
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
    <div className={`wrapSplash ${className}`}>
      <div className="container brdRadius m-a bgWhite p-small-4" ref={drawerRef}>
        <div className="h-perc-100 ov-a p-md-3 p-1">
          {children}
        </div>
      </div>
    </div>
  );
};

SplashScreen.propTypes = {
  children: PropTypes.object.isRequired,
  className: PropTypes.string,
  closeLink: PropTypes.string,
  history: PropTypes.object.isRequired,
  closeOutside: PropTypes.bool,
};

SplashScreen.defaultProps = {
  className: '',
  closeLink: './',
  closeOutside: true,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
