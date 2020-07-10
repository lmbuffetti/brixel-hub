/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { translateTo } from '../utils/translation';
import { change } from 'redux-form';
import { BrixelButtonIcon, BrixelLogin, BrixelRegister, BrixelButtonPrimary, BrixelButtonTertiary } from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { setCookie } from '../utils/helpers';

const LoginSignup = (props) => {
  console.log('cazzo')
  // PROPS
  const {
    changeFieldValue,
    company,
    formName,
    formValue,
    onChangeLogin,
    onCloseGoBack,
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
      <div className="p-5">
        <div className="dis-f a-t jc-b">
          {
            loginPage ? (
              <div className="w-perc-100 ta-c">
                <h5 className="txtWhite">{translateTo(lang, "Login to your profile to save your progress.")}</h5>
                <p className="txtWhite cur-poi mt-1 td-u" onClick={() => setLoginPage(false)}>
                  {translateTo(lang, "or create profile here")}
                </p>
              </div>
            ) : (
              <div className="w-perc-100 ta-c">
                <h5 className="txtWhite">{translateTo(lang, "Create free profile to save")}</h5>
                <p className="txtWhite cur-poi mt-1 td-u" onClick={() => setLoginPage(true)}>
                  {translateTo(lang, "or login here")}
                </p>
              </div>
            )
          }
          <BrixelButtonIcon
            className="shadow-3dp"
            icon="close-small"
            color="dark"
            saturationTxt={700}
            background={"white"}
            saturation={0}
            noBorder
            onClick={() => onCloseGoBack()}
          />
        </div>
        <div className="max-w-fix-400 m-a onBoardingSignUp">
          {
            loginPage ? (
              <>
                <BrixelLogin company={company} formName="GetStarted" />
                <p className="mt-1">
                  <a
                    className="txtWhite td-u cur-poi"
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
                <BrixelRegister company={company} formName="GetStarted" />
              </>
            )
          }
        </div>
      </div>
      <div
        className="footerActionLogin py-3 px-2 shadow-1dp-top"
      >
        <div className="dis-f a-c jc-b">
          <BrixelButtonTertiary
            color="white"
            saturation={0}
            className="td-u"
            label="Not now"
          />
          <BrixelButtonPrimary
            rounded
            label="Create profile"
            rightIcon="arrow-right-small"
            background="green"
          />
          <span />
        </div>
      </div>
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
  onCloseGoBack: PropTypes.func.isRequired,
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

