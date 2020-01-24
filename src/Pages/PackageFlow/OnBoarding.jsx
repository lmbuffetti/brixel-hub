/* global Transifex */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  withRouter,
} from 'react-router-dom'
import { change, isValid, Field, reduxForm } from 'redux-form';
import { BrixelButtonPrimary, BrixelButtonIcon, FactsOptions, BrixelIcon } from '@brixel/brixel-components';
import { getToken, validateUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData } from '../../actions/CommonActions';
import { Questions } from '../../resources/packageFlowGetstartedQuestions.js';
import Maps from '../../components/Map/Maps';


function OnBoarding(props) {
  const { factsOptions } = FactsOptions;
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    errorValue,
    formValue,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hideNextBtn, setHideNextBtn] = useState(true);
  const [disablePrevBtn, setDisablePrevBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const extractTitle = (title) => {
    if (typeof title === 'object') {
      return title.House;
    }
    return title;
  };

  useEffect(() => {
    let invalidField = false;
    Questions[currentIndex].inputs.map((inp) => {
      const curVal = get(errorValue, inp.name, true);
      if (curVal !== true) invalidField = true;
    });
    setDisableNextBtn(invalidField);
  }, [errorValue, currentIndex]);

  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    console.log('eh');
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
  };

  const changeStep = (act) => {
    let newPosition = position;
    if (act === 'back') {
      setDisableNextBtn(false);
      newPosition = position - 1;
    }
    else {
      setDisableNextBtn(true);
      newPosition = position + 1;
    }
    setPosition(newPosition);
    setCurrentIndex(newPosition);
    if (newPosition > 0) setHidePrevBtn(false);
    else setHidePrevBtn(true);
  };

  const checkYear = (value) => {
    const minimumYear = 1000;
    const currentYear = (new Date()).getFullYear();

    const isNumber = Number.isInteger(+value);
    const isInValidYearDiapason = ((minimumYear <= +value) && (+value <= currentYear));

    if (!isNumber) return 'Is not a number';
    if (!isInValidYearDiapason) return 'Is not valid year';

    return null;
  };

  return (
    <main id="onBoarding">
      <form id="multiStepForm" onSubmit={(e) => e.preventDefault()}>
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div id={`step-${i}`} className="singleStep" key={i.toString()}>
                <div className="container">
                  {
                    quest.titleGreen && (
                      <h5 className="txtGreen400">{quest.titleGreen}</h5>
                    )
                  }
                  <h5>{extractTitle(quest.title)}</h5>
                  {
                    quest.inputs.map((input, f) => (
                      <div key={f.toString()}>
                        {
                          input.type === 'Map' ? (
                            <>
                            <Field
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
                                  showSelectCountry
                                  showMap={false}
                                  isShowZip={false}
                                />
                              )}
                              options={input.options}
                              validate={input.validation}
                              type={input.type}
                              onChange={(e) => validateSlide(e, input.name, quest)}
                            />
                              {
                                formValue.location && formValue.location.address && (
                                  <>
                                    <div className="dis-f jc-b pos-r zIndex2 my-2 w-perc-100">
                                      <p>Is this the place?</p>
                                      <button onClick={() => changeFieldValue('location', {})}>Change</button>
                                    </div>
                                    <div className="pos-r">
                                      <div className="curAdr">{formValue.location.address}</div>
                                      <Maps
                                        zoom={14}
                                        scrollZoom
                                        moveMarker
                                        draggable
                                        showMap
                                        isShowZip={false}
                                      />
                                    </div>
                                  </>
                                )
                              }
                            </>
                          ) : (
                            <div className="dis-f a-c jc-b">
                              <div className="dis-f a-c jc-b w-perc-100">
                                <Field
                                  className="mb-2 w-perc-100"
                                  name={input.name}
                                  label={input.label}
                                  icons={quest.icons}
                                  component={quest.component}
                                  fluid={true}
                                  options={quest.options}
                                  validate={input.validation}
                                  type={input.type}
                                  onChange={(e) => validateSlide(e, input.name, quest)}
                                  deactivable={false}

                                />
                                {
                                  input.unit && (
                                    <span className="pl-2">{input.unit}</span>
                                  )
                                }
                              </div>
                              {
                                quest.inputs.length === 1 && (input.type === 'number' || input.type === 'text') && (
                                  <BrixelButtonPrimary
                                    rounded
                                    label="Ok"
                                    className="ml-2"
                                    background="primary"
                                    onClick={() => changeStep()}
                                    rightIcon="arrow-simple-right"
                                    disabled={disableNextBtn}
                                  />
                                )
                              }
                            </div>
                          )
                        }
                        <p className="body2">{input.help}</p>
                      </div>
                      )
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
        <div className={`footerAction p-1  shadow-1dp-top ${disableNextBtn ? 'disabledNext' : 'successNext'}`}>
          {
            !disableNextBtn && Questions[currentIndex].successMessage && (
              <p className="txtGreen700 ta-r mb-2">
                {Questions[currentIndex].successMessage}
                <BrixelIcon icon="check" className="ml-1" />
              </p>
            )
          }
          <div className={`dis-f a-c ${hidePrevBtn ? 'jc-fe' : 'jc-b'}`}>
            <BrixelButtonIcon
              className={`${hidePrevBtn ? 'hide' : ''} shadow-2dp`}
              icon="arrow-simple-left"
              onClick={() => changeStep('back')}
              background="white"
              saturation={0}
              color="primary"
              saturationTxt={400}
              noBorder
            />
            <BrixelButtonPrimary
              rounded
              label="Continue"
              background="green"
              onClick={() => changeStep()}
              rightIcon="arrow-simple-right"
              disabled={disableNextBtn}
            />
          </div>
        </div>
      </form>
    </main>
  );
}

OnBoarding.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
};

OnBoarding.defaultProps = {

};

const mapStateToProps = (state, props) => ({
  errorValue: get(state, 'form.OnBoarding.syncErrors', {}),
  formValue: get(state, 'form.OnBoarding.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('OnBoarding', field, value));
  },
  checkValid() {
    dispatch(isValid('OnBoarding'))
  },
  handleCreateUser: bindActionCreators(validateUser, dispatch),
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
  handleSetPage: bindActionCreators(setPageData, dispatch),
});

const OnBoardingForm = reduxForm({
  form: 'OnBoarding', // a unique identifier for this form
})(OnBoarding);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OnBoardingForm);
