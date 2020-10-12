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
  } = props;

  const drawerRef = useRef(null);

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(drawerRef, {
    action: 'function',
    func: () => {
      document.body.classList.remove('ov-h');
      history.push(closeLink);
    },
  });

  return (
    <div className={`wrapSplash ${className}`}>
      <div className="container brdRadius m-a bgWhite p-small-4" ref={drawerRef}>
        <div className="h-perc-100 ov-a p-3">
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
};

SplashScreen.defaultProps = {
  className: '',
  closeLink: './',
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
