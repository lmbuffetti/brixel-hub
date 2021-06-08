/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonSecondary, BrixelLogin, BrixelRegister, BrixelButtonPrimary, change, BrixelButtonText, Validation, BrixelReset,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { setFormError } from '../actions/CommonActions';
import { recoverPassword } from '../actions/UserActions';
import { checkBrowser } from '../utils/helpers';
import Support from './Support';
import Accordion from './Accordion';

// COMPONENT FOR THE LOGIN/SIGN UP ON ONBOARDING
const LoginSignup = (props) => {
  // PROPS
  const {
    changeFieldValue,
    company,
    errorValue,
    formError,
    formName,
    formValue,
    handleRecoverPassword,
    handleSetFormError,
    isSmallLoading,
    onChangeLogin,
    onDisableValidation,
    loggedInUser,
    notification,
    onSubmit,
  } = props;
  // STATE
  const [loginPage, setLoginPage] = useState('register');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    onDisableValidation(true);
  }, []);

  // FUNCTION TO SAVE ON REDUX FORM THE CURRENT PAGE (LOGIN OR REGISTER)
  useEffect(() => {
    if (typeof loggedInUser.token === 'undefined') {
      changeFieldValue(formName, 'signup', !loginPage);
    }
    changeFieldValue(formName, 'signupScreen', loginPage);
    onChangeLogin(loginPage);
  }, [loginPage]);

  useEffect(() => {
    if (loginPage === 'register' && get(formError, 'state', false) && !get(formError, 'noRedirect', false)) {
      setLoginPage('login');
    }
  }, [formError]);

  useEffect(() => {
    // this changes the scrolling behavior to "smooth"
    if (checkBrowser() > 0) {
      window.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0 });
    }
  }, []);

  // FUNCTION TO SAVE THE DATA, IF NOT VALID SHOW THE ERROR
  const onSubmitForm = () => {
    let isValid = true;
    Object.keys(get(errorValue, loginPage, {})).forEach((subKey) => {
      const curErr = get(errorValue[loginPage], subKey, true);
      if (curErr !== true && curErr !== null) {
        setShowErrors(true);
        isValid = false;
      }
    });
    if (loginPage === 'reset') {
      const email = get(formValue, 'login.email', null);
      if (Validation.isEmail(email) === true && Validation.required(email) === true) {
        handleRecoverPassword({
          email,
          smallLoader: 'recoverPassword',
        });
      }
    } else if (isValid) {
      setShowErrors(false);
      onSubmit();
    }
  };

  // CHANGE PAGE
  const changeScreen = (page) => {
    setLoginPage(page);
    handleSetFormError({});
  };

  // FUNCTION TO MANAGE THE ONLCIK FUNCTION AND LABEL OF TERTIARY BUTTON (bottom left)
  const TertiaryButton = () => {
    switch (loginPage) {
      case 'not_sure':
        return {
          action: () => changeScreen('support'),
          label: 'Still, not convinced',
        };
      case 'support':
        return {
          action: () => changeScreen('register'),
          label: 'Cancel',
        };
      default:
        return {
          action: () => changeScreen('not_sure'),
          label: 'I am not sure',
        };
    }
  };

  // FUNCTION TO MANAGE THE ONLCIK FUNCTION AND LABEL OF PRIMARY BUTTON (center)
  const PrimaryButton = () => {
    switch (loginPage) {
      case 'not_sure':
        return {
          action: () => changeScreen('register'),
          label: 'Ok, save now',
        };
      case 'support':
        return {
          action: () => changeScreen('register'),
          label: 'Ok, save now',
        };
      case 'login':
        return {
          action: () => onSubmitForm(),
          label: 'Login',
        };
      case 'reset':
        // eslint-disable-next-line no-case-declarations
        const checkDoneStatus = notification.filter((item) => item.type === 'done');
        if (checkDoneStatus.length > 0) {
          return {
            action: () => changeScreen('login'),
            label: 'Go to login',
          };
        }
        return {
          action: () => onSubmitForm(),
          label: 'Reset Password',
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
    <div className="signUpScreen pos-r dis-f flex-wrap">
      <div className="w-perc-100 max-w-fix-600 m-a mt-0 w-perc-md-50">
        <div className="mr-a onBoardingSignUp">
          {/* {
            (loginPage === 'register' || loginPage === 'login') && (
              <h3 className="txtWhite fweight-600 ta-c mb-5">
                {
                  loginPage === 'register' && (
                    <> {translateTo(lang, 'Create free profile to save')} </>
                  )
                }
                {
                  loginPage === 'login' && (
                    <> {translateTo(lang, 'Login to your profile to save your progress.')} </>
                  )
                }
              </h3>
            )
          } */}

          {
            (loginPage === 'register' || loginPage === 'login' || loginPage === 'reset') && (
              <>
                <div className="topBar fsize-400 bgLight200 p-2 ta-c">
                  {
                    (loginPage === 'register' || loginPage === 'reset') && (
                      <p className="txtDark700">
                        <span>Already have an account?</span>
                        <span>&nbsp;</span>
                        <span className="cur-poi td-u txtPrimary400" onClick={() => changeScreen('login')}>
                          <span>Login here</span>
                        </span>
                      </p>
                    )
                  }
                  {
                    loginPage === 'login' && (
                      <p className="txtDark700">
                        <span>Login or&nbsp;</span>
                        <span
                          className="cur-poi td-u txtPrimary400"
                          onClick={() => changeScreen('register')}
                        >
                          <span>create profile here</span>
                        </span>
                      </p>
                    )
                  }
                </div>
                <div className="innerBox bgWhite p-2 px-2 px-sm-5">
                  {
                    loginPage === 'login' && (
                      <>
                        {
                          get(formError, 'state', false) && (
                            <p className="txtRed400">
                              {get(formError, 'message', '')}
                            </p>
                          )
                        }
                        <BrixelLogin company={company} formName="GetStarted" showErrors={showErrors} />
                        <p className="mt-1">
                          <BrixelButtonText
                            label="Forgot password?"
                            onClick={() => changeScreen('reset')}
                          />
                        </p>
                      </>
                    )
                  }
                  {
                    loginPage === 'register' && (
                      <>
                        {
                          get(formError, 'state', false) && (
                            <p className="txtRed400">
                              {get(formError, 'message', '')}
                            </p>
                          )
                        }
                        <BrixelRegister
                          baseURL={baseByData.apiRoot}
                          showGeneratePassword={false}
                          company={company}
                          formName="GetStarted"
                          showErrors={showErrors}
                          // validateEmail
                        />
                      </>
                    )
                  }
                  {
                    loginPage === 'reset' && (
                      <div className="mb-3">
                        {
                          get(formError, 'state', false) && (
                            <p className="txtRed400">
                              {get(formError, 'message', '')}
                            </p>
                          )
                        }
                        <BrixelReset
                          company={company}
                          formName="GetStarted"
                          showErrors={showErrors}
                        />
                        {
                          notification.label && (
                            <>
                              <p className="fsize-300 mt-1 txtGreen400">
                                {notification.label}
                              </p>
                              <BrixelButtonText
                                className="mt-2"
                                label="Resend password"
                                onClick={() => onSubmitForm()}
                              />
                            </>
                          )
                        }
                      </div>
                    )
                  }
                </div>
              </>
            )
          }

          {
            (loginPage === 'not_sure' || loginPage === 'support') && (

              <div className="p-2 bgWhite brdRadius">
                {
                  loginPage === 'not_sure' && (
                    <div className="p-3 p-sm-5">
                      <h4 className="ta-c-md  pr-lg-0">Here are 3 reasons to sign up.</h4>
                      <ol className="mt-3 px-2 px-lg-0">
                        <li className="pl-1">You receive a free price indication and a local market check.</li>
                        <li className="pl-1 mt-1">You get free access to the full Brixel Hub. Your all-in-one tool to sell your home.</li>
                        <li className="pl-1 mt-1">All services are free of charge. You decide if you want to upgrade or not.</li>
                      </ol>

                      <h4 className="ta-c-md  mt-5 pr-lg-0">Don’t worry about spam.</h4>
                      <ol className="mt-3 px-2 px-lg-0">
                        <li className="pl-1">All your personal data is save with us. We are not using them for commercial purpose.</li>
                        <li className="pl-1 mt-1">We will contact you only for support and consultation</li>
                        <li className="pl-1 mt-1">Your property data will not be published unless you request it explicitly.</li>
                      </ol>
                    </div>
                  )
                }
                {
                  loginPage === 'support' && (
                    <div className="p-3 p-sm-5">
                      <h4 className="ta-c-md  pr-5 pr-lg-0">You want to talk to us before? No problem. We are here for you.</h4>
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
            )
          }
        </div>
        <div className="footerActionLogin">
          <div className={`dis-fl-col col-reverse dis-fl-row-sm a-c ${loginPage === 'register' ? 'jc-c' : 'jc-fs'} my-3 pos-r`}>
            {
              loginPage === 'register' && (
                <BrixelButtonSecondary
                  className="pos-a-fix-sm x-l-0 mt-2 mt-sm-0"
                  bgTransparent
                  rounded
                  theme="white"
                  label={TertiaryButton().label}
                  onClick={TertiaryButton().action}
                />
              )
            }
            <BrixelButtonPrimary
              rounded
              rightIcon="arrow-right-small"
              theme="red"
              className={loginPage === 'register' ? 'mr-sm-a ml-sm-a' : 'ml-sm-a'}
              label={PrimaryButton().label}
              onClick={PrimaryButton().action}
              isLoading={isSmallLoading === 'recoverPassword'}
            />
          </div>
        </div>
      </div>
      <div className="w-perc-100 w-perc-md-50 dis-f">
        <div className="max-w-fix-600 pt-2 px-3 pb-3 px-md-5 pb-md-5 txtWhite">
          <h2 className="txtWhite fsize-700 fweight-600 mb-3">
            Your benefits when you sell with Brixel.
          </h2>

          <Accordion
            title="Sell without an agent"
            titleClass="fsize-600 txtWhite fweight-600"
            contentClass="txtWhite py-2"
            className="mb-2"
            isExpanded
          >
            All our service packages have fixed prices. Without any exclusive brokerage contract or commission. Just pay what you need.
          </Accordion>
          <Accordion
            title="The best presentation"
            titleClass="fsize-600 txtWhite fweight-600"
            contentClass="txtWhite py-2"
            className="mb-2"
            isExpanded
          >
            All our properties are presented on a dedicated website with a 3D tour, high-quality photos, and much more. Buyers confirm that the presentation is outstanding.
          </Accordion>
          <Accordion
            title="Start with a free test drive"
            titleClass="fsize-600 txtWhite fweight-600"
            contentClass="txtWhite py-2"
            isExpanded
          >
            Convince yourself of our quality before you commit to any package. We offer a 7 days trial for all our packages. No strings attached.
          </Accordion>
        </div>
      </div>
    </div>
  );
};

LoginSignup.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formError: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
  formValue: PropTypes.object.isRequired,
  handleRecoverPassword: PropTypes.func.isRequired,
  handleSetFormError: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  notification: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeLogin: PropTypes.func,
  onDisableValidation: PropTypes.func,
  onSubmit: PropTypes.func,
};

LoginSignup.defaultProps = {
  onChangeLogin: () => '',
  onDisableValidation: () => '',
  onSubmit: () => '',
};

const mapStateToProps = (state, props) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  formError: get(state, 'common.formError', {}),
  errorValue: get(state, `brixelForm.${props.formName}.syncErrors`, {}),
  formValue: get(state, `brixelForm.${props.formName}.values`, {}),
  isSmallLoading: get(state, 'common.isSmallLoading', ''),
  lang: get(state, 'common.language', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  notification: get(state, 'common.notification', []),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(formName, field, value) {
    dispatch(change(formName, field, value));
  },
  handleSetFormError: bindActionCreators(setFormError, dispatch),
  handleRecoverPassword: bindActionCreators(recoverPassword, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LoginSignup);
