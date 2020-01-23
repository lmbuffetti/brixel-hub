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
import { BrixelButtonPrimary, BrixelButtonIcon, FactsOptions } from '@brixel/brixel-components';
import { getToken, validateUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData } from '../../actions/CommonActions';
import { Questions } from '../../resources/packageFlowGetstartedQuestions.js';

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
    console.log(val);
    changeFieldValue(name, val);
    const curIndex = Questions.findIndex((val) => quest.history === val.history);
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
    if (newPosition > 0) setHidePrevBtn(false);
  };
  console.log(Questions);
  return (
    <main id="onBoarding">
      <div id="multiStepForm">
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div id={`step-${i}`} className="singleStep" key={i.toString()}>
                <h3>{extractTitle(quest.text)}</h3>
                {
                  quest.inputs.map((input, f) => (
                    <>
                      <Field
                        key={f.toString()}
                        className="mb-2"
                        name={input.name}
                        label={input.label}
                        icons={quest.icons}
                        component={quest.component}
                        options={quest.options}
                        validate={input.validation}
                        step={+input.step || 1}
                        type={input.type}
                        onChange={(e) => validateSlide(e, input.name, quest)}
                        deactivable={false}
                      />
                    </>
                    )
                  )
                }
              </div>
            ))
          }
        </div>
        <div className={`footerAction dis-f a-c p-1 ${hidePrevBtn ? 'jc-fe' : 'jc-b'} shadow-1dp-top`}>
          <BrixelButtonIcon
            className={hidePrevBtn ? 'hide' : ''}
            icon="arrow-simple-left"
            onClick={() => changeStep('back')}
          />
          <BrixelButtonPrimary
            rounded
            label="Continue"
            onClick={() => changeStep()}
            rightIcon="arrow-simple-right"
            disabled={disableNextBtn}
          />
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
