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
import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, FactsOptions, BrixelCheckbox, BrixelCheckboxSingle } from '@brixel/brixel-components';
import Swiper from 'react-id-swiper';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';
import { getToken, validateUser } from '../actions/UserActions';
import { addProperty } from '../actions/PropertyActions';
import { errorMessage, setPageData } from '../actions/CommonActions';
import Maps from '../components/Map/Maps';
import { Questions } from '../resources/packageFlowGetstartedQuestions.js';
import swissZipCode from '../resources/swissZipCodes.json';

function GetStarted(props) {
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

  const params = {
    direction: 'vertical',
    history: {
      key: `getstarted/`,
      replaceState: true,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    spaceBetween: 0,
    lazy: {
      loadOnTransitionStart: true,
    },
    allowTouchMove: false,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    on: {
      reachEnd: () => {
        funcLastSlide();
      }
    }
  };

  const funcLastSlide = () => {
    setSendaData(true);
  };

  const validateSlide = () => {
    setValid(true);
    if (swiper && typeof Questions[actSlide] !== 'undefined') {
      const validate = Questions[actSlide].inputs;
      validate.map((val) => {
        const checkErr = get(errorValue, val.name, null);
        if (errorValue && checkErr) setValid( false);
      });
      let idNext = actSlide + 1;
      if (Questions[idNext] && Questions[idNext].conditions) {
        Questions[idNext].show = true;
        Questions[idNext].conditions.map((cond) => {
          if (get(formValue, `${cond.name}`, '') !== cond.value) {
            Questions[idNext].show = false;
          }
        });
      }
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
    if (typeof loggedUser.token === 'undefined' && actSlide === Questions.length && formValue.ownerType === 'seller') {
      setLastSlide(true);
    } else if (typeof loggedUser.token === 'undefined' && actSlide === Questions.length - 1 && formValue.ownerType !== 'seller') {
      setLastSlide(true);
    } if (typeof loggedUser.token !== 'undefined' && actSlide === Questions.length - 1 && formValue.ownerType === 'seller') {
      setLastSlide(true);
    } else if (typeof loggedUser.token !== 'undefined' && actSlide === Questions.length - 2 && formValue.ownerType !== 'seller') {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
  }, [formValue, errorValue, actSlide]);

  const goToSlide = (act) => {
    let id = actSlide;
    let slideId = swiper.realIndex;
    if (act === 'prev') {
      id -= 1;
      slideId -= 1;
      if (Questions[id] && Questions[id].conditions) {
        Questions[id].conditions.map((cond) => {
          if (get(formValue, `${cond.name}`, '') !== cond.value) {
            id = id - 1;
          }
        });
      }
    }
    if (act === 'next') {
      id += 1;
      slideId += 1;
      if (Questions[id] && Questions[id].conditions) {
        Questions[id].conditions.map((cond) => {
          if (get(formValue, `${cond.name}`, '') !== cond.value) {
            id = id + 1;
          }
        });
      }
    }
    swiper.slideTo(slideId, 500, true);
    setActSlide(id);
  };

  const saveData = () => {
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
      language: "ch",
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
          livingArea: {value: +formValue.livingSpace, unit: "sqm"}
        },
        building: {
          build: formValue.constructionYear,
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
      handleCreatePage(data);
    } else if (loginPage || showInpuPassword) {
      data.user = {
        username: formValue.email,
        password: formValue.password,
      };
      handleGetToken(data);
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
        language: "pt",
        createUser: true,
      };
      handleCreateUser(data);
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
      <Swiper
        activeSlideKey={0}
        {...params}
        getSwiper={updateSwiper}
      >
        {
          Questions.map((item, i) => (
            <div data-history={item.history} key={i.toString()} style={{ display: item.show ? 'block' : 'none' }} id={`field-${i}`}>
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
                          onChange={(e) => item.history === 'zipInput' ? searchByZipCode(e) : validateSlide()}
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

      <footer>
        <div className="container dis-f">
          <BrixelButtonIcon
            icon="arrow-simple-up"
            onClick={() => goToSlide('prev')}
            disabled={swiper && swiper.realIndex < 1}
          />
          <BrixelButtonIcon
            icon="arrow-simple-down"
            onClick={() => sendData ? saveData() : goToSlide('next')}
            disabled={!valid}
          />
        </div>
      </footer>
    </main>
  );
}

GetStarted.propTypes = {
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

GetStarted.defaultProps = {
  configUrl: {},
  errorMsg: {},
  errorValue: null,
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  configUrl: get(state, 'common.configUrl', {}),
  errorMsg: get(state, 'common.errorMsg', null),
  formValue: get(state, 'form.GetStarted.values', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', null),
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
})(GetStarted);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedForm);
