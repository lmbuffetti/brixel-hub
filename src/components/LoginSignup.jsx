/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  BrixelLogin, BrixelRegister, BrixelButtonPrimary, change, BrixelButtonText, Validation, BrixelReset,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import Slider from 'react-slick';
import { setFormError } from '../actions/CommonActions';
import { recoverPassword } from '../actions/UserActions';
import { checkBrowser } from '../utils/helpers';
import Testimonial1CH from '../images/getstarted/testimonial-1_CH.jpeg';
import Testimonial2CH from '../images/getstarted/testimonial-2_CH.jpeg';
import Testimonial3CH from '../images/getstarted/testimonial-3_CH.jpeg';
import Testimonial1PT from '../images/getstarted/testimonial-1_PT.jpg';
import Testimonial2PT from '../images/getstarted/testimonial-2_PT.jpg';
import Testimonial3PT from '../images/getstarted/testimonial-3_PT.jpg';

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
    skipPhone,
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
      const email = get(formValue, 'login.email', null);
      if (Validation.isEmail(email) === true && Validation.required(email) === true) {
        handleRecoverPassword({
          email: email.toLowerCase(),
          smallLoader: 'sendData',
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
          label: 'Ok, save now',
        };
      case 'support':
        return {
          action: () => changeScreen('register'),
          label: 'Ok, save now',
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
            label: 'Go to login',
          };
        }
        return {
          action: () => {
            setDisabledButton(true);
            onSubmitForm();
          },
          label: 'Reset Password',
        };
      default:
        return {
          action: () => {
            setDisabledButton(true);
            onSubmitForm();
          },
          label: 'Sign up',
        };
    }
  };

  if (!formValue) {
    return (
      <div />
    );
  }

  return (
    <div className="signUpScreen pos-r dis-f flex-wrap w-perc-100">
      <div className="m-a mt-0 max-w-fix-600 w-perc-100">
        <div className="mr-a ml-a onBoardingSignUp">
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
                <div className="innerBox bgWhite pb-2 pt-1 px-2 px-sm-5">
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
                        <BrixelLogin
                          company={company}
                          formName="signupScreen"
                          showErrors={showErrors}
                        />
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
                        {
                          get(notification[0], 'state', false) && get(notification[0], 'type', '') === 'done' && (
                            <p className="txtGreen400">
                              Registration complete.
                            </p>
                          )
                        }
                        <BrixelRegister
                          baseURL={baseByData.apiRoot}
                          showGeneratePassword={false}
                          company={company}
                          formName="signupScreen"
                          showErrors={showErrors}
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
                          formName="signupScreen"
                          showErrors={showErrors}
                        />
                        {
                          get(notification[0], 'label', null) && (
                            <>
                              <p className="fsize-300 mt-1 txtGreen400">
                                {notification[0].label}
                              </p>
                              <BrixelButtonText
                                className="mt-2 ml-a mr-a"
                                label="Resend password"
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
                    label={PrimaryButton().label}
                    onClick={!disabledButton ? PrimaryButton().action : () => ''}
                    isLoading={isSmallLoading === 'recoverPassword'}
                  />
                </div>
                <div className="topBar fsize-400 p-2 ta-c">
                  {
                    (loginPage === 'register' || loginPage === 'reset') && (
                      <p className="txtWhite">
                        <span>Already have an account?</span>
                        <span>&nbsp;</span>
                        <span className="cur-poi td-u txtWhite" onClick={() => changeScreen('login')}>
                          <span>Login here</span>
                        </span>
                      </p>
                    )
                  }
                  {
                    loginPage === 'login' && (
                      <p className="txtWhite">
                        <span>Login or&nbsp;</span>
                        <span
                          className="cur-poi td-u txtWhite"
                          onClick={() => changeScreen('register')}
                        >
                          <span>create profile here</span>
                        </span>
                      </p>
                    )
                  }
                </div>
              </>
            )
          }

        </div>
        <div className="footerActionLogin">
          <div className={`dis-fl-col col-reverse dis-fl-row-sm a-c ${loginPage === 'register' ? 'jc-c' : 'jc-fs'} my-3 pos-r`}>
            {/* {
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
            } */}
          </div>
        </div>
      </div>
      <div className="w-perc-100 w-perc-md-50 dis-f a-c py-2 pt-md-0 pb-md-10">
        <div className="max-w-fix-304 w-perc-100 ml-a mr-a testimonialsSlide">

          {
            get(formValue, 'location.countryCode', '') === 'CH' ? (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial1CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Absolutely perfect and uncomplicated&quot;</h2>

                  <h5 className="ta-c txtPrimary400">M. Hardegger</h5>
                  <p className="ta-c txtPrimary400 fsize-500">House sold</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial2CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;We would sell with Brixel again anytime.&quot;</h2>

                  <h5 className="ta-c txtPrimary400">F. Pfiffner</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved CHF 30&apos;700</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial3CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Excellent service with flexible fees.&quot;</h2>

                  <h5 className="ta-c txtPrimary400">M. Callaghan</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved CHF 44&apos;050</p>
                </div>
              </Slider>
            ) : (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial1PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Always quick in responding, friendly, professional.&quot;</h2>

                  <h5 className="ta-c txtPrimary400">Katrien Willems</h5>
                  <p className="ta-c txtPrimary400 fsize-500" />
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial2PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Everything went incredibly well, it doesn&apos;t even seem real!&quot;</h2>

                  <h5 className="ta-c txtPrimary400">Luca Benussi</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved 18.400€</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial3PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;The sale was done even faster than expected.&quot;</h2>

                  <h5 className="ta-c txtPrimary400">Márcia Traça</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved 13.000€</p>
                </div>
              </Slider>
            )
          }

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
  skipPhone: PropTypes.bool,
};

LoginSignup.defaultProps = {
  onChangeLogin: () => '',
  onDisableValidation: () => '',
  onSubmit: () => '',
  skipPhone: false,
};

const mapStateToProps = (state, ownProps) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  formError: get(state, 'common.formError', {}),
  errorValue: get(state, `brixelForm.${ownProps.formName}.syncErrors`, {}),
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
