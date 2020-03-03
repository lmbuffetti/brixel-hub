/* global Transifex */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import { change, isValid, Field, reduxForm } from 'redux-form';
import { BrixelButtonPrimary, BrixelIcon, BrixelInputStepNumber, BrixelInputText, FactsOptions, BrixelCheckbox, BrixelCheckboxSingle } from '@brixel/brixel-components';
import Swiper from 'react-id-swiper';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';
import { getToken, validateUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData } from '../../actions/CommonActions';
import Maps from '../../components/Map/Maps';
import { QuestionsList } from '../../resources/packageFlowGetstartedQuestions.js';
const swissZipCode = require('../../resources/swissZipCodes.json');

function GetStarted_old(props) {
  const { factsOptions } = FactsOptions;
  // PROPS
  const {
    changeFieldValue,
    configUrl,
    errorMsg,
    errorValue,
    formValue,
    handleCreatePage,
    handleCreateUser,
    handleGetToken,
    handleSetErrorMsg,
    handleSetPage,
    history,
    loggedUser,
    match,
    showInpuPassword,
  } = props;
  // STATE
  const [swiper, updateSwiper] = useState(null);
  const [valid, setValid] = useState(false);
  const [actSlide, setActSlide] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [errorInput, setErrorInput] = useState(null);
  const [lastSlide, setLastSlide] = useState(false);
  const [sendData, setSendaData] = useState(false);
  const [perSlide, setPercSlide] = useState(false);
  const [allSlides, setAllSlides] = useState(Questions);

  const params = {
    direction: 'vertical',
    history: {
      key: `getstarted/`,
      replaceState: true,
    },
    spaceBetween: 0,
    lazy: {
      loadOnTransitionStart: true,
    },
    allowSwipeToNext: false,
    allowSwipeToPrev: true,
    allowTouchMove: false,
    loadPrevNext: true,
    observer: true,
    observeParents: true,
    watchSlidesVisibility: true,
    on: {
      reachEnd: () => {
        funcLastSlide();
      },
      slideNextTransitionEnd: function() {
        goToSlide('next', this, actSlide)
      },
      slidePrevTransitionEnd: function() {
        goToSlide('prev', this, actSlide)
      }
    },
    keyboard: true,
    getSwiper: updateSwiper,
    navigation: {
      nextEl: ".swiper-navigation.next",
      prevEl: ".swiper-navigation.prev"
    },
    renderPrevButton: (e) => {
      return (<div className="swiper-navigation prev"><BrixelIcon icon="arrow-simple-up" /></div>)
    },
    renderNextButton: (e) => {
      return (
        <div className="swiper-navigation next" onClick={(e) => saveData(e)}><BrixelIcon icon="arrow-simple-down" /></div>
      )
    },
  };

  const funcLastSlide = () => {
    setSendaData(true);
  };

  const validateSlide = () => {
    setValid(true);
    if (swiper) {
      let curHistory = window.location.href.split('/')[window.location.href.split('/').length - 1];
      curHistory = curHistory === 'getstarted' ? 'propertyType' : curHistory.replace('/', '');
      const checkSlides = Questions;
      const curSlide = checkSlides.findIndex(item => item.history === curHistory);
      if (typeof checkSlides[curSlide] !== 'undefined') {
        swiper.allowSlideNext = true;
        swiper.navigation.$nextEl[0].classList.remove('disabled');
        const validate = checkSlides[curSlide].inputs;
        validate.map((val) => {
          const checkErr = get(errorValue, val.name, null);
          if (errorValue && checkErr) {
            setValid(false);
            swiper.navigation.$nextEl[0].classList.add('disabled');
            swiper.allowSlideNext = false;
          }
        });
        let idNext = curSlide + 1;
        if (checkSlides[idNext] && checkSlides[idNext].conditions) {
          checkSlides[idNext].show = true;
          checkSlides[idNext].conditions.map((cond) => {
            if (get(formValue, `${cond.name}`, '') !== cond.value) {
              checkSlides[idNext].show = false;
              setPercSlide(curSlide / Questions.length);
            }
          });
        }
      }
      if (swiper.allowSlideNext && checkSlides[curSlide] && checkSlides[curSlide].autoSlide === true && !checkSlides[curSlide].done) {
        setTimeout(() => {
          checkSlides[curSlide].done = true;
          swiper.slideNext();
        }, 200);
      }
      swiper.navigation.update();
      setAllSlides(checkSlides.filter(item => item.show));
      setTimeout(() => {
        setPercSlide(curSlide / Questions.length);
        swiper.update();
      }, 1000);

    }
  };

  useEffect(() => {
    if (showInpuPassword) {
      setTimeout(() => {
        swiper.slideTo(swiper.realIndex + 1, 500, true);
        handleSetPage();
      }, 100);

    }
  }, [showInpuPassword]);

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(0, 0, false);
    }
  }, [swiper]);

  useEffect(() => {
    validateSlide();
  }, [formValue, errorValue, actSlide]);

  const goToSlide = (act, swp) => {
    const slide = swp || swiper;
    validateSlide();
    if (slide) {
      let id = slide.realIndex;
      if (slide.clickedIndex && slide.clickedIndex > slide.realIndex) id = slide.clickedIndex;
      setActSlide(id);
    }
  };

  const saveData = (e) => {
    const isLastBtn = e.currentTarget.getAttribute("aria-disabled") === true || e.currentTarget.getAttribute("aria-disabled") === 'true';
    if (isLastBtn) {
      var titleAdjectives = [
        'Beautiful',
        'Charming',
        'Elegant',
        'Prestigious',
        'One-of-a-kind',
        'Exquisite',
        'Spacious',
        'Gorgeous',
        'Wonderful',
        'Lovely',
        'Superb',
        'Amazing',
        'Stunning',
        'Sophisticated',
        'Modern',
        'Incredible'
      ];
      // Create the title of the page
      let pageTitle = `${titleAdjectives[Math.floor(Math.random() * titleAdjectives.length)]} ${formValue.propertyType}`;

      // Try to add location to the title
      if (formValue.location.city) {
        pageTitle += ' in ' + formValue.location.city;
      } else if (formValue.location.state) {
        pageTitle += ' in ' + formValue.location.state;
      } else if (formValue.location.country) {
        pageTitle += ' in ' + formValue.location.country;
      } else {
        pageTitle += ' in ' + formValue.location.address;
      }
      const data = {
        language: Transifex.live.selected_lang,
        title: pageTitle,
        status: "on-request",
        listed: false,
        active: true,
        published: false,
        properties: {
          propertyType: formValue.propertyType,
          typology: {
            bedrooms: formValue.bedrooms,
            bathrooms: formValue.bathrooms,
            separateToilets: formValue.separateToilets,
            livingArea: { value: +formValue.livingSpace, unit: "sqm" }
          },
          building: {
            built: formValue.constructionYear,
          }
        },
        location: formValue.location,
        ownerType: formValue.ownerType,
        getEstimation: true,
        addProperty: true,
      };
      if (loggedUser.user && loggedUser.user.id) {
        changeFieldValue('owner', loggedUser.user.id);
        data.owner = loggedUser.user.id;
        // handleCreatePage(data);
      } else if (loginPage || showInpuPassword) {
        data.user = {
          username: formValue.email,
          password: formValue.password,
        };
        // handleGetToken(data);
      } else {
        data.user = {
          email: formValue.email,
          name: `${formValue.firstName} ${formValue.lastName}`,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          userType: formValue.ownerType,
          phone: formValue.phone,
          signupAccept: true,
          signupChannel: "default",
          signupProduct: null,
          language: Transifex.live.selected_lang,
          createUser: true,
        };
        // handleCreateUser(data);
      }
    }
  };

  const searchByZipCode = (val) => {
    if (val.length === 4 || val >= 1000) {
      const getRegionByCode = swissZipCode.find((zip) => +zip['Postleitzahl / Code Postal / Codice Postale'] === +val);
      if (getRegionByCode) {
        changeFieldValue('location.zip', getRegionByCode['Postleitzahl / Code Postal / Codice Postale']);
        changeFieldValue('location.city', getRegionByCode['Ort / Ville / Città']);
        changeFieldValue('location.stateCode', getRegionByCode['Abkürzung / Abréviation / Abbreviazione']);
        setErrorInput(null);
      } else {
        setErrorInput('Please insert a valid Swiss code');
      }
    } else {
      setErrorInput('Please insert a valid Swiss code');
    }
  };

  return (
    <main id="getStarted" className="container">
      <div className="swiper-pagination-container">
        <div className="swiper-pagination-progressbar">
          <span
            className="swiper-pagination-progressbar-fill"
            style={{ transform: `translate3d(0px, 0px, 0px) scaleX(${perSlide}) scaleY(1)` }}
          />
        </div>
        <BrixelButtonPrimary label="Continue" onClick={() => ''} />
      </div>
      <Swiper
        activeSlideKey={0}
        {...params}
      >
        {
          allSlides.map((item, i) => (
            <div
              data-history={item.history}
              key={i.toString()}
              id={`field-${i}`}
            >
              <div className="swiper-slide-content">
                <h3>
                  {
                    isObject(item.text) ? (
                      <>
                        {item.text[formValue.propertyType]}
                      </>
                    ) : (
                      <>
                        {item.text}
                      </>
                    )
                  }
                </h3>
                {
                  swiper && item.inputs.map((input, f) => (
                    <div key={f.toString()}>
                      {
                        input.type === 'Map' ? (
                          <Field
                            key={f.toString()}
                            className="mb-2"
                            name={input.name}
                            label={input.label}
                            component={() => (
                              <Maps
                                zoom={14}
                                scrollZoom
                                moveMarker
                                draggable
                                showSearchLocation
                                showMap
                              />
                            )}
                            options={item.options}
                            validate={item.show ? input.validation : []}
                            step={+input.step || 1}
                            type={input.type}
                            onChange={(e) => validateSlide(item)}
                          />
                        ) : (
                          <>
                            <Field
                              key={f.toString()}
                              className="mb-2"
                              name={input.name}
                              label={input.label}
                              component={item.component}
                              options={item.options}
                              validate={input.validation}
                              step={+input.step || 1}
                              type={input.type}
                              onChange={(e) => item.history === 'zipInput' ? searchByZipCode(e) : validateSlide(item)}
                              deactivable={false}
                            />
                            <p>{errorInput}</p>
                          </>
                        )
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
        <div
          data-history="credentials"
          style={{ display: typeof loggedUser.token === 'undefined' ? 'block' : 'none' }}
        >
          <h3>Great! Your Market check is ready</h3>
          <h5> Sign up to unlock your report.</h5>
          {
            loginPage ? (
              <>
                <p>
                  <span>If you don't have an account</span> <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(false)}>sign up here.</span>
                </p>
                <Field
                  className="mt-2"
                  component={BrixelInputText}
                  label="Email"
                  name="email"
                  placeholder=""
                  type="email"
                />
                <Field
                  className="mt-2"
                  component={BrixelInputText}
                  label="Password"
                  name="password"
                  placeholder=""
                  type="password"
                />
              </>
            ) : (
              <>
                <p><span>If you already have an account</span> <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(true)}>log in here.</span></p>
                <Field
                  className="mt-2"
                  component={BrixelInputText}
                  label="First name"
                  name="firstName"
                  placeholder=""
                  type="text"
                />
                <Field
                  className="mt-2"
                  component={BrixelInputText}
                  label="Last name"
                  name="lastName"
                  placeholder=""
                  type="text"
                />
                <Field
                  className="mt-2"
                  component={BrixelInputText}
                  label="Email address"
                  name="email"
                  placeholder=""
                  type="email"
                />
                <Field
                  className="mt-2"
                  component={BrixelInputText}
                  label="Phone number"
                  name="phone"
                  placeholder=""
                  type="text"
                />
                <div className="mt-2">
                  <Field
                    component={BrixelCheckbox}
                    options={[{label: `I hereby confirm that I have read, understand and accept the <a href="${CompanyInfo.link.terms_and_condition}" target="_blank">terms</a> and <a href="${CompanyInfo.link.terms_and_condition}" target="_blank">privacy policy</a> of Brixel.`, value: 'privacy'}]}
                    name="privacy"
                    className="body2 w-perc-100 max-w-perc-100"
                  />
                </div>
              </>
            )
          }
        </div>
        <div data-history="passwordInput" style={{ display: showInpuPassword ? 'block' : 'none' }}>
          <h3>Welcome back, insert your password to login to your account.</h3>
          <Field
            className="mt-2"
            component={BrixelInputText}
            label="Password"
            name="password"
            placeholder=""
            type="password"
          />
          <a href={`${configUrl.loginBasePath}/recover?email=${formValue.email}`} target="_blank">Recover password</a>
        </div>
      </Swiper>

    </main>
  );
}

GetStarted_old.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  configUrl: PropTypes.object,
  errorMsg: PropTypes.object.isRequired,
  errorValue: PropTypes.object,
  formValue: PropTypes.object,
  handleCreatePage: PropTypes.func.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
  handleGetToken: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  handleSetPage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  showInpuPassword: PropTypes.bool.isRequired,
  valid: PropTypes.bool,
};

GetStarted_old.defaultProps = {
  configUrl: {},
  errorMsg: {},
  errorValue: null,
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  configUrl: get(state, 'common.configUrl', {}),
  errorMsg: get(state, 'common.errorMsg', null),
  formValue: get(state, 'form.GetStarted_old.values', {}),
  errorValue: get(state, 'form.GetStarted_old.syncErrors', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  showInpuPassword: get(state, 'common.setPageData', null) === 'loginPage',
  valid: isValid('GetStarted')(state),
});
const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  checkValid() {
    dispatch(isValid('GetStarted'))
  },
  handleCreateUser: bindActionCreators(validateUser, dispatch),
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
  handleSetPage: bindActionCreators(setPageData, dispatch),
});

const GetStartedForm = reduxForm({
  form: 'GetStarted', // a unique identifier for this form
  touchOnBlur: false,
})(GetStarted_old);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedForm);
