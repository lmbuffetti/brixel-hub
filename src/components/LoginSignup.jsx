/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import {
  BrixelButtonIcon, BrixelLogin, BrixelRegister, BrixelButtonPrimary, BrixelButtonTertiary,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { translateTo } from '../utils/translation';
import Support from './Support';

// COMPONENT FOR THE LOGIN/SIGN UP ON ONBOARDING
const LoginSignup = (props) => {
  // PROPS
  const {
    changeFieldValue,
    company,
    errorValue,
    formName,
    formValue,
    onChangeLogin,
    onCloseGoBack,
    lang,
    loggedInUser,
    onSubmit,
  } = props;
  // STATE
  const [loginPage, setLoginPage] = useState('register');
  const [showErrors, setShowErrors] = useState(false);

  // FUNCTION TO SAVE ON REDUX FORM THE CURRENT PAGE (LOGIN OR REGISTER)
  useEffect(() => {
    if (typeof loggedInUser.token === 'undefined') {
      changeFieldValue(formName, 'signup', !loginPage);
    }
    changeFieldValue(formName, 'signupScreen', loginPage);
    onChangeLogin(loginPage);
  }, [loginPage]);

  // FUNCTION TO SAVE THE DATA, IF NOT VALID SHOW THE ERROR
  const onSubmitForm = () => {
    let isValid = true;
    Object.keys(errorValue).forEach((key) => {
      if (key.includes(loginPage)) {
        const curErr = get(errorValue, key, true);
        if (curErr !== true) {
          setShowErrors(true);
          isValid = false;
        }
      }
    });
    if (isValid) {
      setShowErrors(false);
      onSubmit();
    }
  };

  // FUNCTION TO MANAGE THE ONLCIK FUNCTION AND LABEL OF TERTIARY BUTTON (bottom left)
  const TertiaryButton = () => {
    switch (loginPage) {
      case 'not_sure':
        return {
          action: () => setLoginPage('support'),
          label: 'Still, not convinced',
        };
      case 'support':
        return {
          action: () => setLoginPage('register'),
          label: 'Cancel',
        };
      default:
        return {
          action: () => setLoginPage('not_sure'),
          label: 'I am not sure',
        };
    }
  };

  // FUNCTION TO MANAGE THE ONLCIK FUNCTION AND LABEL OF PRIMARY BUTTON (center)
  const PrimaryButton = () => {
    switch (loginPage) {
      case 'not_sure':
        return {
          action: () => setLoginPage('register'),
          label: 'Ok, save now',
        };
      case 'support':
        return {
          action: () => setLoginPage('register'),
          label: 'Ok, save now',
        };
      case 'login':
        return {
          action: () => onSubmitForm(),
          label: 'Login',
        };
      default:
        return {
          action: () => onSubmitForm(),
          label: 'Save',
        };
    }
  };

  if (!formValue) {
    return (
      <div />
    );
  }

  return (
    <>
      <div className="bodyScrollUp pos-r">
        <div className="dis-f jc-fe pos-r pos-a-md x-r zIndex1">
          <BrixelButtonIcon
            className="shadow-3dp pos-a-fix mt-2-neg mt-md-0 x-r-2 x-t-2"
            icon="close-small"
            color="dark"
            saturationTxt={700}
            background="white"
            saturation={0}
            noBorder
            onClick={() => onCloseGoBack()}
          />
        </div>
        <div className="max-w-fix-360 ml-a mr-a onBoardingSignUp">
          {
            loginPage === 'login' && (
              <>
                <div className="w-perc-100 ta-c-md mb-5 pr-5 pr-md-0">
                  <h4 className="txtWhite">{translateTo(lang, 'Login to your profile to save your progress.')}</h4>
                  <p className="txtWhite cur-poi mt-1 td-u" onClick={() => setLoginPage('register')}>
                    {translateTo(lang, 'or create profile here')}
                  </p>
                </div>
                <BrixelLogin company={company} formName="GetStarted" showErrors={showErrors} />
                <p className="mt-1">
                  <a
                    className="txtWhite td-u cur-poi link"
                    href={`${baseByData.loginBasePath}/recover`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {translateTo(lang, 'Forgot password?')}
                  </a>
                </p>
              </>
            )
          }
          {
            loginPage === 'register' && (
              <>
                <div className="w-perc-100 ta-c-md mb-5 pr-5 pr-md-0">
                  <h4 className="txtWhite">{translateTo(lang, 'Create free profile to save')}</h4>
                  <p className="txtWhite cur-poi mt-1 td-u" onClick={() => setLoginPage('login')}>
                    {translateTo(lang, 'or login here')}
                  </p>
                </div>
                <BrixelRegister company={company} formName="GetStarted" showErrors={showErrors} />
              </>
            )
          }
          {
            loginPage === 'not_sure' && (
              <div className="txtWhite">
                <h4 className="ta-c-md txtWhite pr-5 pr-md-0">Here are 3 reasons to sign up.</h4>
                <ol className="mt-3 px-2 px-md-0">
                  <li className="pl-1">You receive a free price indication and a local market check.</li>
                  <li className="pl-1 mt-1">You get free access to the full Brixel Hub. Your all-in-one tool to sell your home.</li>
                  <li className="pl-1 mt-1">All services are free of charge. You decide if you want to upgrade or not.</li>
                </ol>

                <h4 className="ta-c-md txtWhite mt-5 pr-5 pr-md-0">Don’t worry about spam.</h4>
                <ol className="mt-3 px-2 px-md-0">
                  <li className="pl-1">All your personal data is save with us. We are not using them for commercial purpose.</li>
                  <li className="pl-1 mt-1">We will contact you only for support and consultation</li>
                  <li className="pl-1 mt-1">Your property data will not be published unless you request it explicitly.</li>
                </ol>
              </div>
            )
          }
          {
            loginPage === 'support' && (
              <div>
                <h4 className="ta-c-md txtWhite pr-5 pr-md-0">You want to talk to us before? No problem. We are here for you.</h4>
                <Support
                  isFixed={false}
                  expanded
                  hideClose
                  layout="onboarding"
                />
              </div>
            )
          }
        </div>
        <div className="footerActionLogin p-2 p-md-3 shadow-1dp-top">
          <div className="dis-f a-c jc-b pos-r">
            <BrixelButtonTertiary
              color="white"
              saturation={0}
              className="td-u mt-1 mt-md-0"
              label={TertiaryButton().label}
              onClick={TertiaryButton().action}
            />
            <BrixelButtonPrimary
              className="pl-3 min-w-fix-144"
              rounded
              rightIcon="arrow-right-small"
              background="green"
              label={PrimaryButton().label}
              onClick={PrimaryButton().action}
            />
          </div>
        </div>
      </div>
    </>
  );
};

LoginSignup.propTypes = {
  company: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  onChangeLogin: PropTypes.func,
  onCloseGoBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

LoginSignup.defaultProps = {
  lang: 'en',
  onChangeLogin: () => '',
  onSubmit: () => '',
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
