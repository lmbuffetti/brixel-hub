/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
} from '@brixel/brixel-components';
import {
  MultiFileldsReduxForm,
  change,
  destroy,
  reset,
  initializeForm,
} from '@brixel/brixel-components/dist/form';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import isArray from 'lodash/isArray';
import queryString from 'query-string';
import { checkBrowser } from '../../utils/helpers';
import { ScanTrialQuestions } from '../../resources/Flows/ScanTrialRequest';
import { sendScanTrialRequest } from '../../actions/PropertyActions';

const ScanTrialFlow = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const urlParams = queryString.parse(get(history, 'location.search', ''));
  // PROPS
  const {
    activeSingleProperty,
    destroyForm,
    errorValue,
    formValue,
    handleSendScanTrial,
    initForm,
    initialValues,
    isSmallLoading,
    loggedInUser,
    handleReset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(ScanTrialQuestions());
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(formValue.analysis === 'remote' || urlParams.action === 'on-site' ? 3 : 0);
  const [quest, setQuest] = useState(ScanTrialQuestions()[0]);
  const [isEnter, setIsEnter] = useState(true);
  const [showError, setShowError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [oldIndex, setOldIndex] = useState(0);
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  
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
    if (!isSmallLoading.sendData && (questions[currentIndex + 1] && questions[currentIndex + 1].history === 'success')) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);
  
  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    handleReset('scanFlow');
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/${propID}/home`);
  };
  
  const goToFacts = () => {
    handleReset('scanFlow');
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
      if (obj.bookType === 'phone' || obj.bookType === 'whereby') {
        delete obj.date;
        delete formValue.hourBook;
        delete formValue.dateBook;
        delete formValue.fullDate;
        delete formValue.date;
      }
      const data = {
        page: propID,
        smallLoader: 'sendData',
        data: {
          user: loggedInUser.id,
          meta: {
            ...obj,
            analysis: obj.analysis || 'on-site',
            bookType: obj.bookType || 'online',
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
  
  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex = id;
    if (get(questions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      questions[newIndex].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (has(cond, 'value') && val !== cond.value && checkCond) {
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
    if (get(formValue, 'fullDate', 0) && +new Date(get(formValue, 'fullDate', 0)) < +new Date()) isValid = false;
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
          if (err !== true && err !== false && err !== null && isValid) isValid = false;
        }
      });
      Object.keys(errorValue).forEach((key) => {
        const err = get(errorValue, key, null);
        if (err !== true && err !== false && isValid) isValid = false;
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
    setOldIndex(currentIndex);
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
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (defId > -1) {
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
          if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
          if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
        } else {
          if (singleStepEl && singleStepEl.scrollTo) singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
          if (multiStepSlidesEl && multiStepSlidesEl.scrollTo) {
            multiStepSlidesEl.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        }
      }
    }
    return null;
  };
  
  useEffect(() => {
    initForm(initialValues);
    const defId = checkCondition(currentIndex);
    if (defId !== currentIndex) changeStep();
  }, [activeSingleProperty]);
  
  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    setOldIndex(currentIndex);
    const newQuest = [];
    if (formValue) {
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
    if (newQuest[currentIndex].inputs && newQuest[currentIndex].inputs.length === 1 && get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex) {
      changeStep('next', null, 1, true);
    }
    if (currentIndex === 0 && formValue.analysis === 'remote') changeStep();
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
    <div id="bodyModalWrapper" className={`withHeader getStarted ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'classWrapper', '')}  `}>
      
      <div className={`bodyModal dis-fl-col upgradeModal container ${get(quest, 'history', '')} ${get(quest, 'background', '') ? '' : ''} ${get(quest, 'vCentered', null) ? 'jc-c vCentered' : ''} stepNo${currentIndex}`}>
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''} ${questions[currentIndex].effect === 'slideUp' ? 'ov-v signUp' : ''}`}
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep zIndex1 pt-5 jc-c ${currentIndex < 5 ? isEnter || questions[currentIndex].effect ? 'fade-enter-active' : 'fade-enter' : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                    <div id={`step-${currentIndex}`} className={`dis-fl-col flex-wrap ${questions[currentIndex].effect} ${questions[currentIndex].effect === 'slideUp' ? 'activeQuestBack' : ''}`}>
                      {
                        quest.title && (
                          <h2 className={`fsize-600 fsize-sm-800 fweight-600 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }
                      {/*                       {
                        quest.subtitle && (
                          <p className="mb-5 ta-c txtDark200 w-perc-100" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                      } */}
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
                          showSendButton={false}
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
                      <img src={quest.img} alt={quest.title} className={`${quest.imgMaxWidth ? quest.imgMaxWidth : 'max-w-fix-232'} mb-3`} />
                      <h2
                        className="fadeAnim fweight-600 ta-c"
                        dangerouslySetInnerHTML={{ __html: quest.title }}
                      />
                      {
                        quest.subtitle && (
                          <h6
                            className="fadeAnim fsize-600 fweight-400 mt-2 ta-c"
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
                        themeSat={600}
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
                  <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c mb-3 h-fix-40">
                    {
                      (get(quest, 'inputs', []).length > 1 || get(quest, 'inputs[0].component.name', '') !== 'BrixelRadioButton') && (
                        <>
                          {
                            buttonLabel().toLowerCase() === 'skip' ? (
                              <BrixelButtonSecondary
                                className={`noWrap mr-a ml-a ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                disabled={!checkValidateField()}
                                theme="green"
                                themeSat={600}
                                rounded
                                label={buttonLabel()}
                                rightIcon="arrow-right-small"
                                onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                              />
                            ) : (
                              <>
                                {
                                  (questions[currentIndex].history !== 'BookTrialFlow' || get(formValue, 'analysis', null) !== 'remote') && (
                                    <BrixelButtonPrimary
                                      className={`noWrap ml-a mr-a ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
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
                          onClick={() => closeWindow()}
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
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  handleReset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const history = {
    location: window.location.href,
  };
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  let bookType = get(history, 'location', '').replace(/\/$/, '');
  if (bookType) {
    if (bookType.includes('?url=')) bookType = bookType.split('?')[0];
    bookType = bookType.split('/')[bookType.split('/').length - 1];
  }
  const initVal = {
    ...get(state, 'brixelForm.scanFlow.values', {}),
    name: get(state, 'user.loggedInUser.user.name', null),
    phone: {
      prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode.dial_code) || countryPhoneCode.dial_code,
      number: get(state, 'user.loggedInUser.user.phone.number', ''),
    },
    email: get(state, 'user.loggedInUser.user.email', null),
    userID: get(state, 'user.loggedInUser.user.id', null),
  };
  if (!initVal.analysis) initVal.analysis = 'on-site';
  if (bookType.includes('on-site')) initVal.analysis = 'on-site';
  if (bookType.includes('remote')) initVal.analysis = 'remote';
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    errorValue: get(state, 'brixelForm.scanFlow.syncErrors', {}),
    formValue: get(state, 'brixelForm.scanFlow.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    initialValues: initVal,
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
  handleReset(form) {
    (dispatch(reset(form)));
  },
  handleSendScanTrial: bindActionCreators(sendScanTrialRequest, dispatch),
  
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScanTrialFlow);
