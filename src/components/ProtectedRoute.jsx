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

// COMPONENT TO ENABLE ROUTES TO ONLY LOGGED IN USER
const ProtectedRoute = (props) => {
  const {
    allowAccess,
    userTypes,
    component,
    exact,
    history,
    isTest,
    loggedInUser,
    path,
    render,
  } = props;

  useEffect(() => {
    if ((get(window, 'location.hostname', '').includes('localhost') || get(window, 'location.hostname', '').includes('192.168')) && typeof cookie.get('brixelToken') === 'undefined' && !window.localStorage.getItem('brixelToken')) {
      history.push('/tokeninput');
    } else if (typeof cookie.get('brixelToken') === 'undefined' && !isTest) {
      window.location.assign(`${baseByData.loginUrl}?url=${get(window, 'location.href', '')}`);
    } else if (loggedInUser.token && userTypes && allowAccess && allowAccess !== userTypes) {
      // history.push('/');
    }
  }, [loggedInUser]);

  if (allowAccess && userTypes && allowAccess !== userTypes) {
    return (<div />);
  }

  return (
    <>
      {
        loggedInUser.token && (
          <>
            {
              render ? (
                <Route path={path} exact={exact} render={() => render} />
              ) : (
                <Route path={path} exact={exact} component={component} />
              )
            }
          </>
        )
      }
    </>
  );
};

ProtectedRoute.propTypes = {
  allowAccess: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  exact: PropTypes.bool,
  history: PropTypes.object.isRequired,
  isTest: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  userTypes: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  allowAccess: false,
  component: null,
  userTypes: null,
  exact: false,
  render: null,
};

const mapStateToProps = (state) => ({
  isTest: get(state, 'common.test', false),
  loggedInUser: get(state, 'user.loggedInUser', null),
  userTypes: get(state, 'user.userTypes', null),
});

const mapDispatchToProps = () => ({
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ProtectedRoute);
