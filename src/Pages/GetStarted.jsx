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
import { getToken } from '../actions/UserActions';
import { errorMessage } from '../actions/CommonActions';
import Maps from '../components/Map/Maps';
import { Questions } from '../resources/packageFlowGetstartedQuestions.js';
import swissZipCode from '../resources/swissZipCodes.json';

function GetStarted(props) {
  const { factsOptions } = FactsOptions;
  // PROPS
  const {
    changeFieldValue, errorMsg, errorValue, formValue, loggedUser, handleSetErrorMsg, history,
  } = props;
  // STATE
  const [swiper, updateSwiper] = useState(null);
  const [valid, setValid] = useState(false);
  const [actSlide, setActSlide] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [errorInput, setErrorInput] = useState(null);

  const params = {
    direction: 'vertical',
    history: {
      key: '/packageFlow/getstarted/',
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
  };

  const validateSlide = () => {
    setValid(true);
    if (swiper && typeof Questions[swiper.activeIndex] !== 'undefined') {
      const validate = Questions[swiper.activeIndex].inputs;
      validate.map((val) => {
        const checkErr = get(errorValue, val.name, null);
        if (errorValue && checkErr) setValid( false);
      });
      let idPrev = swiper.activeIndex - 1;
      let idNext = swiper.activeIndex + 1;
      if (Questions[idPrev] && Questions[idPrev].conditions) {
        Questions[idPrev].show = true;
        Questions[idPrev].conditions.map((cond) => {
          if (get(formValue, `${cond.name}`, '') !== cond.value) {
            Questions[idPrev].show = false;
          }
        });
      }
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
    if (swiper) {
      swiper.slideTo(0, 0, false);
    }
  }, [swiper]);

  useEffect(() => {
    validateSlide();
  }, [formValue, errorValue]);

  const goToSlide = (act) => {
    let id = swiper.realIndex;
    if (act === 'prev') {
      id -= 1;
    }
    if (act === 'next') {
      id += 1;
    }
    swiper.slideTo(id, 500, true);
    setActSlide(id);
    validateSlide();
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
    <main id="getStarted">
      <Swiper
        activeSlideKey={0}
        {...params}
        getSwiper={updateSwiper}
      >
        {
          Questions.map((item, i) => (
            <div data-history={item.history} key={i.toString()} style={{ display: item.show ? 'block' : 'none' }}>
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
                          onChange={(e) => item.history === 'zipInput' ? searchByZipCode(e) : ''}
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
        <div data-history="credentials" style={{ display: typeof loggedUser.token !== 'undefined' ? 'block' : 'none' }}>
          <h3>Great! Your Market check is ready</h3>
          <h5> Sign up to unlock your report.</h5>
          {
            loginPage ? (
              <>
                <p><span>If you don't have an account</span> <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(false)}>sign up here.</span></p>
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
                <div>
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
      </Swiper>
      <footer>
        <BrixelButtonIcon
          icon="arrow-simple-up"
          onClick={() => goToSlide('prev')}
          disabled={swiper && swiper.realIndex < 1}
        />
        <BrixelButtonIcon
          icon="arrow-simple-down"
          onClick={() => goToSlide('next')}
          disabled={!valid}
        />
      </footer>
    </main>
  );
}

GetStarted.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  errorMsg: PropTypes.object.isRequired,
  errorValue: PropTypes.object,
  formValue: PropTypes.object,
  handleGetToken: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  valid: PropTypes.bool,
};

GetStarted.defaultProps = {
  errorMsg: {},
  errorValue: null,
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  errorMsg: get(state, 'common.errorMsg', null),
  formValue: get(state, 'form.GetStarted.values', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  valid: isValid('GetStarted')(state),
});
const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  checkValid() {
    dispatch(isValid('GetStarted'))
  },
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
});

const GetStartedForm = reduxForm({
  form: 'GetStarted', // a unique identifier for this form
  touchOnBlur: false,
})(GetStarted);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedForm);
