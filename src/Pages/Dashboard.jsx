import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import get from 'lodash/get';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import queryString from 'query-string';
import { Field, reduxForm } from 'redux-form'
import {
  BrixelInputText, BrixelButtonPrimary, BrixelCheckbox, BrixelButtonTertiary, Validation,
  BrixelTabs,
} from '@brixel/brixel-components';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';
import LoadingSimple from '../components/LoadingSimple';
import { getToken } from '../actions/UserActions';
import { errorMessage } from '../actions/CommonActions';

function Dashboard(props) {
  const {
    errorMsg, formValue, handleGetToken, handleSetErrorMsg, history,
  } = props;

  useEffect(() => {
    const urlParams = queryString.parse(history.location.search);
    console.log(urlParams);
    return () => {
      handleSetErrorMsg({});
    }
  }, []);

  const login = (e) => {
    e.preventDefault();
    const data = {
      username: formValue.email,
      password: formValue.password,
    };
    handleGetToken(data);
  };
  console.log(CompanyInfo);
  return (
    <main id="loginPage">
      <h1>Dashboard</h1>
    </main>
  );
}

Dashboard.propTypes = {
  errorMsg: PropTypes.object,
  formValue: PropTypes.object,
  handleGetToken: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
};

Dashboard.defaultProps = {
  errorMsg: {},
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  errorMsg: get(state, 'common.errorMsg', null),
  formValue: get(state, 'form.LoginForm.values', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
