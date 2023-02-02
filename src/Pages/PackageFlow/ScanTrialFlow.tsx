import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelProgressBar} from '@brixel/brixel-components';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {change, destroy, initializeForm, MultiFileldsReduxForm, reset} from '@brixel/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerOff} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {sendUserScanTrial} from '../../actions/UserActions';
import {ScanTrialQuestions} from '../../resources/Flows/ScanTrialRequest';
import {getCookie, setCookie} from '../../utils/helpers';
import translateTo from '../../utils/translation';
import type {ScanTrialFlowType} from '../../@types/Pages/PackageFlow/ScantrialFlow';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const ScanTrialFlow = (props: ScanTrialFlowType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleGetActiveSingleCompany,
    handleSendScanTrial,
    handleSpinnerOff,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
    handleReset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(ScanTrialQuestions(lang));
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(ScanTrialQuestions(lang)[0]);
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
    handleSpinnerOff();
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = getCookie('brixelStubCompany') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({ stub: defComp });
      setCookie('brixelStubCompany', defComp);
    } else {
      handleGetActiveSingleCompany({ stub: 'default' });
    }
    return () => destroyForm();
  }, []);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(activeSingleCompany, 'stub', null)) {
      const getLang = getCookie('brixelLang');
      if (get(activeSingleCompany, 'language.code', null) && !getLang && currentIndex < 2) {
        if (!loggedInUser.id) {
          const companyPhone = {
            prefix: get(activeSingleCompany, 'contact.phone.prefix', ''),
            number: '',
          };
          changeFieldValue('phone', companyPhone);
        }
      }
      setCookie('brixelStubCompany', activeSingleCompany.stub);
    }
  }, [activeSingleCompany.id]);

  // ON CHANGE STEP LOAD THE ENTER EFFECT
  useEffect(() => {
    setIsEnter(true);
    if (questions[currentIndex].history) {
      history.push(`/packageFlow/testDrive/${questions[currentIndex].history}`);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isSmallLoading.sendData === false && questions[currentIndex + 1] && saved) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    initForm(initialValues);
  }, [loggedInUser.id]);

  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    handleReset(initialValues);
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/${propID}/home`);
  };

  const goToFacts = () => {
    handleReset(initialValues);
    history.push(`/packageFlow/getStarted?company=${activeSingleCompany.stub}`);
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
        smallLoader: 'sendData',
        data: {
          companyID: activeSingleCompany.id,
          user: {
            language: lang,
            userName: get(formValue, 'name', ''),
            userEmail: get(formValue, 'email', ''),
            userPhone: get(formValue, 'phone', { prefix: '', number: '' }),
          },
          meta: {
            ...obj,
            analysis: obj.analysis || 'on-site',
            bookType: obj.bookType || 'online',
            answers: formValue,
          },
        },
      };
      if (loggedInUser.id) set(data, 'data.user.id', get(loggedInUser, 'id', ''));
      handleSendScanTrial(data);
    }
  };

  const progressBarCalc = () => {
    let num = 0;
    questions.forEach((item) => {
      if (get(item, 'hideProgress', false) !== true) {
        if (item.conditions) {
          item.conditions.forEach((cond) => {
            if (cond.name) {
              const val = get(formValue, cond.name, null);
              if (cond.value && val === cond.value) {
                num += 1;
              } else if (cond.noValue && val !== cond.noValue) {
                num += 1;
              }
            }
          });
        } else {
          num += 1;
        }
      }
    });
    return (currentIndex * 100) / (num);
  };

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex: number = id;
    if (questions[newIndex] && questions[newIndex].conditions) {
      let checkCond = true;
      const {conditions} = questions[newIndex];
      if (conditions) {
        conditions.map((cond) => {
          if (cond.name) {
            const val = get(formValue, cond.name, null);
            if (has(cond, 'value') && val !== cond.value && checkCond) {
              if (act === 'back') newIndex -= 1;
              else newIndex += 1;
              checkCond = false;
            }
          }
          return null;
        });
      }
    }
    return newIndex;
  };

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act = '') => {
    let isValid = true;
    let isNotEmpty = false;
    if (quest?.inputs) {
      quest.inputs.forEach((input) => {
        if (input.name) {
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
            if (input.name === 'profile') {
              const page = get(formValue, 'signupScreen', null);
              field = ['register.email', 'register.firstName', 'register.lastName', 'register.password', 'register.privacy'];
              if (page === 'login') {
                field = ['login.email', 'login.password'];
              }
              field.forEach((item) => {
                const errCur = get(errorValue, item, true);
                if (errCur !== true && errCur !== false && isValid) isValid = false;
              });
            }
            if (input.name === 'register.ownerType') {
              if (!has(formValue, 'register.ownerType') || get(formValue, 'register.ownerType', '') === null) isValid = false;
            }
            if (input.name === 'register.whenToSell') {
              if (!has(formValue, 'register.whenToSell') || get(formValue, 'register.whenToSell', '') === null) isValid = false;
            } else if (err !== true && err !== false && err !== null && isValid) isValid = false;
          }
        }
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  const singleStepEl = singleStepRef.current;
  const multiStepSlidesEl = multiStepSlidesRef.current;

  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act = 'next', e: null | React.FormEvent = null, step = 1, skipValidation = false) => {
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
      history.push('/packageFlow');
    } else {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (questions[defId]) {
        // setPosition(newIndex);
        if (questions[defId].toSave) {
          saveData();
        } else {
          const newQuest = {
            ...questions[defId],
          };
          setQuest(newQuest);
          setCurrentIndex(defId);
          if (newQuest.history !== 'createProfile') {
            if (newQuest.inputs && !newQuest.inputs[0].options && !newQuest.inputs[0].startFrom) {
              const fakeInput = document.createElement('input');
              fakeInput.setAttribute('type', 'text');
              fakeInput.setAttribute('id', 'fakeInput');
              fakeInput.style.position = 'absolute';
              fakeInput.style.opacity = '0';
              fakeInput.style.height = '0';
              fakeInput.style.fontSize = '16px'; // disable auto zoom
              // zoom/scroll behavior
              document.body.prepend(fakeInput);
              fakeInput.focus();
            }

            setTimeout(() => {
              const fakeInput = document.getElementById('fakeInput');
              const getCurStep = document.getElementById(`step-${defId}`);
              if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
                const inputNumber = getCurStep.querySelector('input[type="number"]') as HTMLInputElement;
                if (inputNumber) inputNumber.focus();
              } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
                const inputText = getCurStep.querySelector('input[type="text"]') as HTMLInputElement;
                if (inputText) inputText.focus();
              } else if (getCurStep && getCurStep.querySelector('input[type="search"]')) {
                const inputSearch = getCurStep.querySelector('input[type="search"]') as HTMLInputElement;
                if (inputSearch) inputSearch.focus();
              }
              // cleanup
              if (fakeInput) fakeInput.remove();
            }, 500);
          }
          if (questions[defId].history) {
            history.push(`/packageFlow/testDrive/${questions[defId].history}`, { state: get(history, 'location.state', {}),
            });
          }
          // @ts-ignore
          if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
          // @ts-ignore
          if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
        }
      }
    }
    return null;
  };

  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    const newQuest: QuestionsListType[] = [];
    setOldIndex(currentIndex);
    if (formValue) {
      ScanTrialQuestions(lang).map((quests) => {
        if (quests.condition) {
          let isValid = true;
          quests.condition.map((item) => {
            if (item.name && get(formValue, item.name, null) !== item.value) {
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
    if (newQuest[currentIndex].inputs && newQuest[currentIndex] && (newQuest[currentIndex].inputs || []).length === 1 && get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex) {
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
    <div id="bodyModalWrapper" className={`withHeader getStarted ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'classWrapper', '')} trialRequest`}>

      <div className="pos-r">
        {
          get(quest, 'hideProgress', false) !== true && (
            <BrixelProgressBar
              large
              classProgressBar="container"
              className="brdRadius"
              saturation={500}
              color="green"
              barBackground="light"
              backgroundSaturation={200}
              progressValue={progressBarCalc()}
            />
          )
        }
      </div>

      <div className={`bodyModal dis-fl-col upgradeModal container ${get(quest, 'history', '')} ${get(quest, 'background', '') ? '' : ''} ${get(quest, 'vCentered', null) ? 'jc-c vCentered' : ''} stepNo${currentIndex}`}>
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''}`}
          onSubmit={() => changeStep()}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep zIndex1 pt-5 jc-c ${currentIndex < 5 ? isEnter ? 'fade-enter-active' : 'fade-enter' : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                    <div id={`step-${currentIndex}`} className="dis-fl-col flex-wrap">
                      {
                        quest.title && (
                          <h2 className={`fweight-600 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
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
                      <img loading="lazy" src={quest.img} alt={quest.title} className={`${quest.imgMaxWidth ? quest.imgMaxWidth : 'max-w-fix-232'} mb-3`} />
                      {
                        quest.title && (
                          <h2
                            className="fadeAnim fweight-600 ta-c"
                            dangerouslySetInnerHTML={{ __html: quest.title }}
                          />
                        )
                      }
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
                        label={translateTo(buttonLabel(), lang)}
                        disabled={!checkValidateField()}
                        isLoading={isSmallLoading.sendData}
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
                      (get(questions, `[${currentIndex - 1}].inputs`, null) && currentIndex > 0) && (
                        <BrixelButtonIcon
                          className="backBtn pos-a-fix x-l-0 x-t-0"
                          icon="arrow-left-small"
                          onClick={() => changeStep('back')}
                          theme="text"
                          themeSat={300}
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
                                className={`noWrap mr-a ml-a ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                disabled={!checkValidateField()}
                                theme="green"
                                themeSat={600}
                                rounded
                                label={translateTo(buttonLabel(), lang)}
                                rightIcon="arrow-right-small"
                                onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                              />
                            ) : (
                              <BrixelButtonPrimary
                                className={`ml-a mr-a noWrap ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                disabled={!checkValidateField()}
                                rounded
                                theme="green"
                                themeSat={600}
                                label={translateTo(buttonLabel(), lang)}
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
                </div>
              </div>
            )
          }
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    errorValue: get(state, 'brixelForm.scanFlow.syncErrors', {}),
    formValue: get(state, 'brixelForm.scanFlow.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', ''),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    initialValues: {
      ...get(state, 'brixelForm.scanFlow.values', {}),
      userID: get(state, 'user.loggedInUser.user.id', null),
      name: get(state, 'user.loggedInUser.user.name', null),
      phone: {
        prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode?.dial_code) || countryPhoneCode?.dial_code,
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
  handleReset(data) {
    (dispatch(reset('scanFlow', data)));
  },
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSendScanTrial: bindActionCreators(sendUserScanTrial, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScanTrialFlow);
