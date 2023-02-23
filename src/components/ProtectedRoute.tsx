import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import get from 'lodash/get';
import {compose} from 'redux';
import {connect} from 'react-redux';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import Cookies from 'universal-cookie';
import type {ProtectedRouteType} from '../@types/components/ProtectedRoute';
import Loading from './Loading';

const cookie = new Cookies();

// COMPONENT TO ENABLE ROUTES TO ONLY LOGGED IN USER
const ProtectedRoute = (props: ProtectedRouteType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleCompany,
    children,
    isTest,
    loggedInUser,
  } = props;

  useEffect(() => {
    if (typeof cookie.get('brixelToken') === 'undefined' && !window.localStorage.getItem('brixelToken')) {
      if ((history.location.pathname.includes('buyer') && activeSingleCompany.id) || !history.location.pathname.includes('buyer')) {
        const companyURL = activeSingleCompany.id ? `/${activeSingleCompany.stub}` : '';
        const redirectURL = `${baseByData.loginUrl}${companyURL}?url=${get(window, 'location.href', '')}`;
        if ((get(window, 'location.hostname', '').includes('localhost') || get(window, 'location.hostname', '').includes('192.168'))) {
          history.push('/tokeninput');
        } else if (typeof cookie.get('brixelToken') === 'undefined' && !isTest) {
          window.location.assign(redirectURL);
        }
      }
    }
  }, [loggedInUser.id, activeSingleCompany]);

  return (
    <>
      {
        !loggedInUser.id && (
          <Loading isLoading={true} />
        )
      }
      {children}
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  isTest: get(state, 'common.test', false),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  userTypes: get(state, 'user.userTypes', null),
});

export default compose(connect(mapStateToProps, null))(ProtectedRoute);
