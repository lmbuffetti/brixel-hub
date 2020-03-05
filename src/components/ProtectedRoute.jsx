/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Route, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

const ProtectedRoute = (props) => {
  const {
    component,
    exact,
    history,
    loggedUser,
    path,
    protect,
  } = props;

  useEffect(() => {
    if (window.location.hostname.includes('localhost') && typeof cookie.get('brixelToken') === 'undefined') {
      history.push('/tokeninput');
    } else if (typeof cookie.get('brixelToken') === 'undefined') {
      window.location.href = `${baseByData.loginUrl}?url=${window.location.href}`;
    }
    if (loggedUser.token && protect) {
      history.push('/');
    }
  }, [loggedUser]);

  return (
    <>
      {
        loggedUser.token && !protect && (
          <Route path={path} exact={exact} component={component} />
        )
      }
    </>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  exact: PropTypes.bool,
  history: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  protect: PropTypes.bool,
};

ProtectedRoute.defaultProps = {
  exact: false,
  protect: false,
};

const mapStateToProps = (state) => ({
  loggedUser: get(state, 'user.loggedUser', null),
});

const mapDispatchToProps = () => ({
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ProtectedRoute);
