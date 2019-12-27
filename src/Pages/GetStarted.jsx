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
import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, FactsOptions } from '@brixel/brixel-components';
import Swiper from 'react-id-swiper';
import { getToken } from '../actions/UserActions';
import { errorMessage } from '../actions/CommonActions';
import Maps from '../components/Map/Maps';
import { Questions } from '../resources/packageFlowGetstartedQuestions.js';

function GetStarted(props) {
  const { factsOptions } = FactsOptions;
  // PROPS
  const {
    errorMsg, errorValue, formValue, handleGetToken, handleSetErrorMsg, history,
  } = props;
  // STATE
  const [swiper, updateSwiper] = useState(null);
  const [valid, setValid] = useState(false);
  const [actSlide, setActSlide] = useState(0);

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
  };

  const validateSlide = () => {
    if (swiper) {
      const validate = Questions[swiper.activeIndex].inputs;
      setValid(true);
      validate.map((val) => {
        const checkErr = get(errorValue, val.name, null);
        console.log(errorValue, checkErr);
        if (errorValue && checkErr) setValid( false);
      })
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
    let id = swiper.activeIndex;
    if (act === 'prev') {
      id -= 1;
      if (Questions[id].condition && get(formValue, `${Questions[id].condition.name}`, '') !== Questions[id].condition.value) {
        id -= 1;
      }
    }
    if (act === 'next') {
      id += 1;
      if (Questions[id].condition && get(formValue, `${Questions[id].condition.name}`, '') !== Questions[id].condition.value) {
        id += 1;
      }
    }
    swiper.slideTo(id, 500, true);
    setActSlide(id);
    validateSlide();
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
            <div data-history={item.history} key={i.toString()}>
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
                  <>
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
                          validate={input.validation}
                          step={+input.step || 1}
                          type={input.type}
                        />
                      ) : (
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
                        />
                      )
                    }
                  </>
                ))
              }
            </div>
          ))
        }
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
        <div>
          {valid.toString()}
        </div>
      </footer>
    </main>
  );
}

GetStarted.propTypes = {
  checkValid: PropTypes.func.isRequired,
  errorMsg: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object,
  handleGetToken: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  valid: PropTypes.bool,
};

GetStarted.defaultProps = {
  errorMsg: {},
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  errorMsg: get(state, 'common.errorMsg', null),
  formValue: get(state, 'form.GetStarted.values', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  valid: isValid('myForm')(state),
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
