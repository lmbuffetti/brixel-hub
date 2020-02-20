/* global Transifex */
import React, { useEffect } from 'react';
import {
  Redirect, Switch, Route, withRouter,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import Cookies from 'universal-cookie';
// COMPONENTS
import { checkToken } from '../actions/UserActions';
import queryString from 'query-string';
import { BrixelNotification } from '@brixel/brixel-components'

const ProtectedRoute = (props) => {
  const {
    component,
    history,
    loggedUser,
    path,
  } = props;

  useEffect(() => {
    if (loggedUser && typeof loggedUser.statusCode !== 'undefined') {
      if (window.location.hostname.includes('localhost')) {
        history.push('/tokeninput');
      } else {
        window.location.href = `${baseByData.loginUrl}?url=${window.location.href}`;
      }
    }
  }, [loggedUser]);

  return (
    <>
      {
        loggedUser.token && (
          <Route path={path} component={component} />
        )
      }
    </>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  history: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  loggedUser: get(state, 'user.loggedUser', null),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ProtectedRoute);
