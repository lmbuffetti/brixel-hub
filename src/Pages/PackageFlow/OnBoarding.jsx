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
    errorValue,
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
      console.log(errorValue[inp.name]);
      if (errorValue[inp.name]) invalidField = true;
    });
    setDisableNextBtn(invalidField);
  }, [errorValue, currentIndex]);

  const validateSlide = (val, name, quest) => {
    console.log(val, quest);
    changeFieldValue(name, val);
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
  console.log(Questions);
  return (
    <main id="onBoarding">
      <div id="multiStepForm">
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div id={`step-${i}`} className="singleStep" key={i.toString()}>
                <div className="container">
                  <h5>{extractTitle(quest.text)}</h5>
                  {
                    quest.inputs.map((input, f) => (
                      <div key={f.toString()}>
                        {
                          input.type === 'Map' ? (
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
                                  showMap
                                  isShowZip={false}
                                />
                              )}
                              options={input.options}
                              validate={input.validation}
                              type={input.type}
                              onChange={(e) => validateSlide(e, input.name, quest)}
                            />
                          ) : (
                            <div className="dis-f a-c jc-b">
                              <div className="dis-f a-c jc-b w-perc-100">
                                <Field
                                  className="mb-2 w-perc-100"
                                  name={input.name}
                                  label={input.label}
                                  icons={quest.icons}
                                  component={quest.component}
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
            !disableNextBtn && (
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
              noBoder
            />
            {console.log(Questions[currentIndex])}
            {
              Questions[currentIndex] && Questions[currentIndex].inputs.length === 1 && Questions[currentIndex].inputs && (Questions[currentIndex].inputs[0].type === 'number' || Questions[currentIndex].inputs[0].type === 'text') ? (
                <p />
              ) : (
                <BrixelButtonPrimary
                  rounded
                  label="Continue"
                  background="green"
                  onClick={() => changeStep()}
                  rightIcon="arrow-simple-right"
                  disabled={disableNextBtn}
                />
              )
            }
          </div>
        </div>
      </div>
    </main>
  );
}

OnBoarding.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
};

OnBoarding.defaultProps = {

};

const mapStateToProps = (state, props) => ({
  errorValue: get(state, 'form.OnBoarding.syncErrors', {}),
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
  touchOnBlur: false,
})(OnBoarding);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OnBoardingForm);
