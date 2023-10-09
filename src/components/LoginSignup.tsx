/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonPrimary, BrixelButtonText} from '@brixel-io/brixel-components';
import {BrixelLogin, BrixelRegister, BrixelReset, change, Validation} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import Slider from 'react-slick';
import {setFormError} from '../actions/CommonActions';
import {recoverPassword} from '../actions/UserActions';
import {checkBrowser} from '../utils/helpers';
import illustration01 from '../images/getstarted/illustrations/signup-illustration-01.svg';
import illustration02 from '../images/getstarted/illustrations/signup-illustration-02.svg';
import illustration03 from '../images/getstarted/illustrations/signup-illustration-03.svg';
import illustration04 from '../images/getstarted/illustrations/signup-illustration-04.svg';
import translateTo from '../utils/translation';
import type {LoginSignupType} from '../@types/components/LoginSignup';

// COMPONENT FOR THE LOGIN/SIGN UP ON ONBOARDING
const LoginSignup = (props: LoginSignupType) => {
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
    lang,
    loggedInUser,
    notification,
    onChangeLogin = () => '',
    onDisableValidation = () => '',
    onSubmit = () => '',
    skipPhone = false,
  } = props;
  // STATE
  const [loginPage, setLoginPage] = useState('register');
  const [showErrors, setShowErrors] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const sliderInstance = useRef(null);
  const settingSlider = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
    draggable: false,
    centerPadding: '8px',
  };

  useEffect(() => {
    onDisableValidation(true);
  }, []);

  useEffect(() => {
    document.body.classList.add('flowProfile');
    return () => {
      //  clean up
      document.body.classList.remove('flowProfile');
    };
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
    if (typeof window !== 'undefined' && window.innerHeight > 50) {
      if (checkBrowser() > 0) {
        // @ts-ignore
        if (window.scrollTop) window.scrollTop = 0;
      } else if (window.scrollTo) window.scrollTo({ top: 0 });
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
      const email = get(formValue, 'login.email', '');
      if (Validation.isEmail(email) === true && Validation.required(email) === true) {
        handleRecoverPassword({
          email: email.toLowerCase(),
          smallLoader: 'recoverPassword',
        });
      }
    } else if (isValid) {
      setShowErrors(false);
      onSubmit(loginPage);
    }
  };

  // CHANGE PAGE
  const changeScreen = (page) => {
    changeFieldValue(formName, 'signupScreen', page);
    setLoginPage(page);
    handleSetFormError({});
  };

  useEffect(() => {
    if (disabledButton) {
      setTimeout(() => {
        setDisabledButton(false);
      }, 2000);
    }
  }, [disabledButton]);

  // FUNCTION TO MANAGE THE ONLCIK FUNCTION AND LABEL OF PRIMARY BUTTON (center)
  const PrimaryButton = () => {
    switch (loginPage) {
      case 'not_sure':
        return {
          action: () => {
            setDisabledButton(true);
            changeScreen('register');
          },
          label: translateTo('Ok, save now', lang),
        };
      case 'support':
        return {
          action: () => changeScreen('register'),
          label: translateTo('Ok, save now', lang),
        };
      case 'login':
        return {
          action: () => {
            setDisabledButton(true);
            onSubmitForm();
          },
          label: 'Login',
        };
      case 'reset':
        // eslint-disable-next-line no-case-declarations
        const checkDoneStatus = notification.filter((item) => item.type === 'done');
        if (checkDoneStatus.length > 0) {
          return {
            action: () => changeScreen('login'),
            label: translateTo('Go to login', lang),
          };
        }
        return {
          action: () => {
            setDisabledButton(true);
            onSubmitForm();
          },
          label: translateTo('Reset Password', lang),
        };
      default:
        return {
          action: () => {
            setDisabledButton(true);
            onSubmitForm();
          },
          label: translateTo('Sign up', lang),
        };
    }
  };

  if (!formValue) {
    return (
      <div />
    );
  }

  return (
    <div className="signUpScreen pos-r dis-fl-col dis-fl-row-lg jc-c w-perc-100">
      <div className="m-a mt-0 max-w-fix-600 w-perc-100">
        <div className="mr-a ml-a onBoardingSignUp">
          <div className="max-w-fix-376 dis-fl-col a-c jc-c ta-c w-perc-100 ml-a mr-a mb-3  hide-lg">
            <h2 className="fSizePx26-sm fsize-500 fweight-600">
              <span>{translateTo('Join', lang)}</span>
              <span className="txtGreen400 mx-1">{translateTo(' thousands of buyers and sellers', lang)}</span>
              <span>{translateTo('who have already registered.', lang)}</span>
            </h2>
          </div>
          {
            (loginPage === 'register' || loginPage === 'login' || loginPage === 'reset') && (
              <>
                <div className="innerBox bgWhite pb-2 pt-1 px-2 px-sm-5">
                  {
                    loginPage === 'login' && (
                      <>
                        {
                          get(formError, 'state', false) && (
                            <p className="txtRed400">
                              {translateTo(get(formError, 'message', ''), lang)}
                            </p>
                          )
                        }
                        <BrixelLogin
                          company={company}
                          formName="GetStarted"
                          showErrors={showErrors}
                          lang={lang}
                        />
                        <p className="mt-1">
                          <BrixelButtonText
                            label={translateTo('Forgot password?', lang)}
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
                              {translateTo(get(formError, 'message', ''), lang)}
                            </p>
                          )
                        }
                        {
                          get(notification[0], 'state', false) && get(notification[0], 'type', '') === 'done' && (
                            <p className="txtGreen400">
                              {translateTo('Registration complete.', lang)}
                            </p>
                          )
                        }
                        <BrixelRegister
                          baseURL={baseByData?.apiRoot}
                          showGeneratePassword={false}
                          company={company}
                          formName="GetStarted"
                          showErrors={showErrors}
                          lang={lang}
                          // validateEmail
                          skipPhone={skipPhone}
                        />
                      </>
                    )
                  }
                  {
                    loginPage === 'reset' && (
                      <div className="mb-2">
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
                          lang={lang}
                        />
                        {
                          get(notification[0], 'label', null) && (
                            <>
                              <p className="fsize-300 mt-1 txtGreen400">
                                {notification[0].label}
                              </p>
                              <BrixelButtonText
                                className="mt-2 ml-a mr-a"
                                label={translateTo('Resend password', lang)}
                                onClick={() => onSubmitForm()}
                              />
                            </>
                          )
                        }
                      </div>
                    )
                  }
                  <BrixelButtonPrimary
                    rounded
                    className="ml-a mr-a mt-2 mb-2 minimum-w-210"
                    label={translateTo(PrimaryButton().label, lang)}
                    onClick={!disabledButton ? PrimaryButton().action : () => ''}
                    isLoading={isSmallLoading.recoverPassword}
                    type="submit"
                  />
                </div>
                <div className="topBar fsize-400 p-2 ta-c">
                  {
                    (loginPage === 'register' || loginPage === 'reset') && (
                      <p className="txtWhite">
                        <span>{translateTo('Already have an account?', lang)}</span>
                        <span>&nbsp;</span>
                        <span className="cur-poi td-u txtWhite" onClick={() => changeScreen('login')}>
                          <span>{translateTo('Login here', lang)}</span>
                        </span>
                      </p>
                    )
                  }
                  {
                    loginPage === 'login' && (
                      <p className="txtWhite">
                        <span>{translateTo('Login or', lang)}</span>
                        <span
                          className="cur-poi td-u txtWhite ml-small-4"
                          onClick={() => changeScreen('register')}
                        >
                          <span>{translateTo('create profile here', lang)}</span>
                        </span>
                      </p>
                    )
                  }
                </div>
              </>
            )
          }

        </div>
      </div>
      <div className="w-perc-100 w-perc-lg-50 dis-fl-col a-c jc-c py-2 pt-md-0 pb-lg-10">
        <div className="max-w-fix-376 dis-fl-col-lg a-c jc-c ta-c w-perc-100 ml-a mr-a mb-3 hide">
          <h2
            className="fSizePx26-sm fsize-500 mt-3 fweight-600"
          >
            <span>{translateTo('Join', lang)}</span>
            <span className="txtGreen400 mx-1">{translateTo(' thousands of buyers and sellers', lang)}</span>
            <span>{translateTo('who have already registered.', lang)}</span>
          </h2>
        </div>
        <div className="max-w-fix-440 w-perc-100 ml-a mr-a testimonialsSlide">

          <Slider ref={sliderInstance} {...settingSlider}>
            <div className="ta-c ml-a mr-a mb-2">
              <img loading="lazy" src={illustration01} alt="Fabian Testimonial" className="max-w-fix-176 ml-a mr-a mb-3" />
              <h2 className="ta-c mb-2 fweight-500 fsize-500">
                {translateTo('"Absolutely perfect and uncomplicated"', lang)}
              </h2>

              <p className="ta-c txtPrimary400">
                {translateTo('R. Willi bought an apartment', lang)}
              </p>
            </div>

            <div className="ta-c ml-a mr-a mb-2">
              <img loading="lazy" src={illustration02} alt="Fabian Testimonial" className="max-w-fix-176 ml-a mr-a mb-3" />
              <h2 className="ta-c mb-2 fweight-500 fsize-500">
                {translateTo('"We would sell with Brixel again anytime."', lang)}
              </h2>

              <p className="ta-c txtPrimary400">
                {translateTo('J. Beurret bought a house', lang)}
              </p>
            </div>

            <div className="ta-c ml-a mr-a mb-2">
              <img loading="lazy" src={illustration03} alt="Fabian Testimonial" className="max-w-fix-176 ml-a mr-a mb-3" />
              <h2 className="ta-c mb-2 fweight-500 fsize-500">
                {translateTo('"Excellent service with flexible fees."', lang)}
              </h2>

              <p className="ta-c txtPrimary400">
                {translateTo('M. Hardegger sold a house', lang)}
              </p>
            </div>

            <div className="ta-c ml-a mr-a mb-2">
              <img loading="lazy" src={illustration04} alt="Fabian Testimonial" className="max-w-fix-176 ml-a mr-a mb-3" />
              <h2 className="ta-c mb-2 fweight-500 fsize-500">
                {translateTo('"Excellent service with flexible fees."', lang)}
              </h2>

              <p className="ta-c txtPrimary400">
                {translateTo('M. Callaghan saved CHF 44\'050', lang)}
              </p>
            </div>
          </Slider>

        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, `brixelForm.${ownProps.formName}.syncErrors`, {}),
  formError: get(state, 'common.formError', {}),
  formValue: get(state, `brixelForm.${ownProps.formName}.values`, {}),
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
  connect(mapStateToProps, mapDispatchToProps),
)(LoginSignup);
