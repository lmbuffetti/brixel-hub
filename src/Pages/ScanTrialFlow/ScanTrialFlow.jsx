/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  MultiFileldsReduxForm,
  change,
  destroy,
  reset,
  initializeForm,
  BrixelButtonText,
  BrixelProgressBar,
} from '@brixel/brixel-components';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import { checkBrowser } from '../../utils/helpers';
import { ScanTrialQuestions } from '../../resources/ScanTrialRequest';
import { sendScanTrialRequest } from '../../actions/PropertyActions';

const ScanTrialFlow = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    destroyForm,
    errorValue,
    formValue,
    handleSendScanTrial,
    history,
    initForm,
    initialValues,
    isSmallLoading,
    loggedInUser,
    match,
    reset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(ScanTrialQuestions());
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(ScanTrialQuestions()[0]);
  const [isEnter, setIsEnter] = useState(true);
  const [showError, setShowError] = useState(false);
  const [saved, setSaved] = useState(false);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

  // REF
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('brixelRegField', JSON.stringify({}));
    return () => destroyForm();
  }, []);

  // ON CHANGE STEP LOAD THE ENTER EFFECT
  useEffect(() => {
    setIsEnter(true);
    if (questions[currentIndex].history) {
      history.push(`/${propID}/trialRequest/${questions[currentIndex].history}`);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isSmallLoading.sendData && questions[currentIndex + 1].history === 'success') {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    initForm(initialValues);
  }, [activeSingleProperty]);

  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    reset('scanFlow');
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/${propID}/rewards`);
  };

  const goToFacts = () => {
    reset('scanFlow');
    history.push(`/${propID}/property/facts/propertyType`);
  };

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    if (!saved) {
      setSaved(true);
      const obj = cloneDeep(formValue);
      delete obj.hourBook;
      delete obj.dateBook;
      delete obj.fullDate;
      delete obj.name;
      delete obj.phone;
      delete obj.email;
      const data = {
        page: propID,
        smallLoader: 'sendData',
        data: {
          user: loggedInUser.id,
          interested: true,
          meta: {
            ...obj,
            answers: formValue,
          },
          userName: get(formValue, 'name', ''),
          userEmail: get(formValue, 'email', ''),
          userPhone: get(formValue, 'phone', { prefix: '', number: '' }),
        },
      };
      handleSendScanTrial(data);
    }
  };

  const progressBarCalc = () => {
    let num = 0;
    questions.forEach((item) => {
      if (item.conditions) {
        item.conditions.forEach((cond) => {
          const val = get(formValue, cond.name, null);
          if (cond.value && val === cond.value) {
            num += 1;
          } else if (cond.noValue && val !== cond.noValue) {
            num += 1;
          }
        });
      } else {
        num += 1;
      }
    });
    return (currentIndex * 100) / num;
  };

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex = id;
    if (get(questions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      questions[newIndex].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (cond.value && val !== cond.value && checkCond) {
          if (act === 'back') newIndex -= 1;
          else newIndex += 1;
          checkCond = false;
        }
        if (cond.noValue && val === cond.noValue && checkCond) {
          if (act === 'back') newIndex -= 1;
          else newIndex += 1;
          checkCond = false;
        }
        return null;
      });
    }
    return newIndex;
  };

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act) => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      quest.inputs.forEach((input) => {
        const err = get(errorValue, input.name, null);
        const noEmpty = get(formValue, input.name, 'ayc');
        if (noEmpty !== 'ayc') isNotEmpty = true;
        if (input.condition) {
          input.condition.forEach((item) => {
            if (item.value && get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
            if (item.noValue && get(formValue, item.name, null) !== item.noValue) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
          });
        } else if (input.validation) {
          // const getRegField = get(registeredFields
          let field;
          if (input.name === 'profileUser') {
            const page = get(formValue, 'signupScreen', null);
            field = ['register.email', 'register.firstName', 'register.lastName', 'register.password', 'register.privacy'];
            if (page === 'login') {
              field = ['login.email', 'login.password'];
            }
            field.forEach((item) => {
              const err = get(errorValue, item, true);
              if (err !== true && err !== false && isValid) isValid = false;
            });
          } else if (err !== true && err !== false && err !== null && isValid) isValid = false;
        }
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  const singleStepEl = singleStepRef.current;
  const multiStepSlidesEl = multiStepSlidesRef.current;
  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act, e, step = 1, skipValidation) => {
    if (e) e.preventDefault();
    let newIndex = currentIndex;
    setShowError(false);
    if (act === 'back') {
      newIndex -= step;
    } else {
      if (!checkValidateField() && !skipValidation) {
        setShowError(true);
        return false;
      }
      newIndex += step;
    }
    if (newIndex === -1) {
      history.push(`/${propID}/trialRequest/`);
    } else {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);

      // setPosition(newIndex);
      if (questions[defId].toSave) saveData(get(questions[defId], 'action', null));

      let newQuest = {
        ...questions[defId],
      };
      if (questions[defId].effect === 'slideUp') {
        newQuest = {
          ...questions[defId - 1],
        };
      }
      if (act === 'back' && questions[defId + 1].effect === 'slideUp') {
        setQuest(newQuest);
        setCurrentIndex(defId);
      } else {
        setQuest(newQuest);
        setCurrentIndex(defId);
      }
      setTimeout(() => {
        const getCurStep = document.getElementById(`step-${defId}`);
        if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
          getCurStep.querySelector('input[type="number"]').focus();
        } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
          getCurStep.querySelector('input[type="text"]').focus();
        }
      }, 100);
      if (questions[defId].history) {
        history.push({
          pathname: `/${propID}/trialRequest/${questions[defId].history}`,
          state: get(history, 'location.state', {}),
        });
      }
      if (checkBrowser() > 0) {
        if (singleStepEl) singleStepEl.scrollTop = 0;
        if (multiStepSlidesEl) multiStepSlidesEl.scrollTop = 0;
      } else {
        if (singleStepEl) singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
        if (multiStepSlidesEl) multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    return null;
  };

  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    if (formValue.id) {
      const newQuest = [];
      ScanTrialQuestions('en').map((quests) => {
        if (quests.condition) {
          let isValid = true;
          quests.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(quests);
        } else {
          newQuest.push(quests);
        }
        return null;
      });
      setQuest(newQuest[currentIndex]);
      setQuestions(newQuest);
    }
    if (get(quest, 'inputs', []).length === 1 && get(quest, 'inputs[0].component.name', null) === 'BrixelRadioButton' && get(formValue, get(quest, 'inputs[0].name', ''), null)) {
      changeStep('next', null, 1, true);
    }
  }, [formValue]);

  // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
  const buttonLabel = () => {
    let label;
    if (currentIndex === 0) label = 'Book your test drive';
    else if (currentIndex === questions.length - 1) label = 'Continue';
    else label = 'Continue';
    return label;
  };

  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted container ${get(quest, 'history', '')} ${get(quest, 'background', '')} ${get(quest, 'classWrapper', '')}`}>

      <BrixelProgressBar
        large
        className="brdRadius"
        saturation={500}
        color="green"
        barBackground="light"
        backgroundSaturation={200}
        progressValue={progressBarCalc()}
      />

      <div className={`bodyModal dis-fl-col upgradeModal stepNo${currentIndex}`}>
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''} ${questions[currentIndex].effect === 'slideUp' ? 'ov-v signUp' : ''}`}
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep pt-5 jc-c ${get(quest, 'vCentered', null) ? 'vertCentered' : ''} ${currentIndex < 5 ? isEnter || questions[currentIndex].effect ? 'fade-enter-active' : 'fade-enter' : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                    <div id={`step-${currentIndex}`} className={`dis-fl-col flex-wrap ${questions[currentIndex].effect} ${questions[currentIndex].effect === 'slideUp' ? 'activeQuestBack' : ''}`}>
                      {
                        quest.titleGreen && (
                          <h3 className="txtGreen400 w-perc-100">{quest.titleGreen}</h3>
                        )
                      }
                      {
                        quest.title && (
                          <h3 className={`fweight-600 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-5'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }
                      {
                        quest.subtitle && (
                          <p className="mb-5 ta-c txtDark200 w-perc-100" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                      }
                      <div className={`${quest.className} w-perc-100`}>
                        <MultiFileldsReduxForm
                          form="scanFlow"
                          disableNextBtn={false}
                          formValue={formValue}
                          inputs={quest.inputs}
                          onClick={() => changeStep()}
                          onCloseGoBack={() => changeStep('back')}
                          onClickDisabled={!checkValidateField()}
                          onSubmit={() => changeStep()}
                          showSendButton
                          showErrors={showError}
                          disableDelay
                        />
                      </div>

                    </div>
                  )
                }
                {
                  get(quest, 'cardType', null) === 'loadComponent' && (
                    React.createElement(
                      quest.component,
                      {
                        formName: 'scanFlow',
                        initialValue: formValue,
                        ...quest,
                        onClick: (step = 1) => (questions[currentIndex + 1] ? changeStep('next', null, step, true) : closeWindow()),
                        showError,
                      },
                    )
                  )
                }
                {
                  (get(quest, 'cardType', null) === 'card') && (
                    <div className={`scaleAnim ta-c ${quest.cardClass}`}>
                      <img src={quest.img} alt={quest.title} className={`${quest.imgMaxWidth ? quest.imgMaxWidth : 'max-w-fix-232'} mb-5`} />
                      <h5
                        className="fadeAnim mt-2 ta-c"
                        dangerouslySetInnerHTML={{ __html: quest.title }}
                      />
                      {
                        quest.subtitle && (
                          <h6
                            className="fadeAnim mt-2 ta-c"
                            dangerouslySetInnerHTML={{ __html: quest.subtitle }}
                          />
                        )
                      }
                    </div>
                  )
                }
                {
                  get(quest, 'history', null) === 'resume' && (
                    <div className="max-w-fix-344 m-a">
                      <BrixelButtonPrimary
                        className={`mt-3 m-a noWrap ${quest.history}`}
                        rounded
                        theme="green"
                        label={buttonLabel()}
                        disabled={!checkValidateField()}
                        rightIcon="arrow-right-small"
                        onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                      />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          {
            get(quest, 'history', null) !== 'createProfile' && (
              <div
                className={`footerAction flowFooter ${questions[currentIndex].footerWidth} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
              >
                <div className="pos-r">
                  <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c">
                    {
                      (get(questions, `[${currentIndex - 1}].inputs`, null) && currentIndex > 0) && (
                        <BrixelButtonIcon
                          className="backBtn ml-0 mr-a"
                          icon="arrow-left-small"
                          onClick={() => changeStep('back')}
                          theme="light"
                          secondary
                        />
                      )
                    }
                    {
                      (get(quest, 'inputs', []).length > 1 || get(quest, 'inputs[0].component.name', '') !== 'BrixelRadioButton') && (
                        <>
                          {
                            buttonLabel().toLowerCase() === 'skip' ? (
                              <BrixelButtonSecondary
                                className={`noWrap mr-a ml-5-neg ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                disabled={!checkValidateField()}
                                theme="green"
                                rounded
                                label={buttonLabel()}
                                rightIcon="arrow-right-small"
                                onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                              />
                            ) : (
                              <BrixelButtonPrimary
                                className={`${currentIndex > 0 && get(questions, `[${currentIndex - 1}].inputs`, null) ? 'mr-a ml-5-neg' : ''} noWrap ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                disabled={!checkValidateField()}
                                rounded
                                theme="green"
                                themeSat={600}
                                label={buttonLabel()}
                                rightIcon="arrow-right-small"
                                onClick={() => (questions[currentIndex + 1] ? changeStep() : goToFacts())}
                                onShowError={() => setShowError(true)}
                              />
                            )
                          }
                        </>
                      )
                    }
                  </div>
                  {
                    get(quest, 'showExitText', null) && (
                      <div className="w-perc-100 a-c dis-fl-row m-a jc-c mt-2">
                        <BrixelButtonText
                          label="Not now"
                          theme="dark"
                          saturation={200}
                          onClick={() => history.push('/sell')}
                        />
                      </div>
                    )
                  }
                </div>
              </div>
            )
          }
        </form>
      </div>
    </div>
  );
};

ScanTrialFlow.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSendScanTrial: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    errorValue: get(state, 'brixelForm.scanFlow.syncErrors', {}),
    formValue: get(state, 'brixelForm.scanFlow.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    initialValues: {
      name: get(state, 'user.loggedInUser.user.name', null),
      phone: {
        prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode.dial_code) || countryPhoneCode.dial_code,
        number: get(state, 'user.loggedInUser.user.phone.number', ''),
      },
      email: get(state, 'user.loggedInUser.user.email', null),
    },
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('scanFlow', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('scanFlow', value));
  },
  destroyForm() {
    (dispatch(destroy('scanFlow')));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  handleSendScanTrial: bindActionCreators(sendScanTrialRequest, dispatch),

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ScanTrialFlow);
