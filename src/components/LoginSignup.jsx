/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { translateTo } from '../utils/translation';
import { change } from 'redux-form';
import { BrixelLogin, BrixelRegister } from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

const LoginSignup = (props) => {
  // PROPS
  const {
    changeFieldValue,
    company,
    formName,
    formValue,
    onChangeLogin,
    lang,
    loggedInUser,
  } = props;
  // STATE
  const [loginPage, setLoginPage] = useState(false);

  useEffect(() => {
    if (typeof loggedInUser.token === 'undefined') {
      changeFieldValue(formName, 'signup', !loginPage);
    }
    changeFieldValue(formName, 'signupScreen', loginPage ? 'login' : 'register');
    onChangeLogin(loginPage)
  }, [loginPage]);

  if (!formValue) {
    return (
      <div />
    )
  }

  return (
    <>
      {
        loginPage ? (
          <>
            <h5>{translateTo(lang, "Login to your profile to save your progress.")}</h5>
            <p className="mb-md-9">
              <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(false)}>
                {translateTo(lang, "You don't have a profile?")}
              </span>
            </p>
            <BrixelLogin company={company} formName="GetStarted" />
            <p className="mt-1">
              <a
                className="txtPrimary400 cur-poi"
                href={`${baseByData.loginBasePath}/recover`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {translateTo(lang, "Forgot password?")}
              </a>
            </p>
          </>
        ) : (
          <>
            <h5>{translateTo(lang, "Create your profile to save your progress.")}</h5>
            <p className="mb-md-9">
              <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(true)}>
                {translateTo(lang, "You already have a profile?")}
              </span>
            </p>
            <BrixelRegister company={company} formName="GetStarted" />
          </>
        )
      }
    </>
  )
};

LoginSignup.propTypes = {
  company: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  showErrors: PropTypes.bool,
  onChangeLogin: PropTypes.func.isRequired,
};

LoginSignup.defaultProps = {
  redirectTo: null,
  showErrors: false,
  onChangeLogin: () => '',
};

const mapStateToProps = (state, props) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, `form.${props.formName}.syncErrors`, {}),
  formValue: get(state, `form.${props.formName}.values`, {}),
  lang: get(state, 'common.language', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(formName, field, value) {
    dispatch(change(formName, field, value));
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LoginSignup);

