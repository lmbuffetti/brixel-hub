import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import get from 'lodash/get';
import {compose} from 'redux';
import {connect} from 'react-redux';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import Cookies from 'universal-cookie';
import type {ProtectedRouteType} from '../@types/components/ProtectedRoute';

const cookie = new Cookies();

// COMPONENT TO ENABLE ROUTES TO ONLY LOGGED IN USER
const ProtectedRoute = (props: ProtectedRouteType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    allowAccess = false,
    children,
    isTest,
    loggedInUser,
    userTypes,
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

  return (<>{children}</>);
};

const mapStateToProps = (state) => ({
  isTest: get(state, 'common.test', false),
  loggedInUser: get(state, 'user.loggedInUser', { }),
  userTypes: get(state, 'user.userTypes', null),
});

export default compose(connect(mapStateToProps, null))(ProtectedRoute);
