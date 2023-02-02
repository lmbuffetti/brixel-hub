import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText} from '@brixel/brixel-components';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {change, destroy, initializeForm, MultiFileldsReduxForm, reset} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import {DateTime} from 'luxon';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {sendMessageContact} from '../../../actions/CommonActions';
import {getActiveSingleCompany} from '../../../actions/CompanyActions';
import {getBuyerDeal} from '../../../actions/DealActions';
import {getActiveSingleProperty} from '../../../actions/PropertyActions';
import {QuestionsList} from '../../../resources/Companies/Contact';
import {checkBrowser} from '../../../utils/helpers';
import translateTo from '../../../utils/translation';
import type {ContactType} from '../../../@types/Pages/ContactFlow/Companies/Contact';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const Contact = (props: ContactType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const urlParams = queryString.parse(get(history, 'location.search', ''));
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleGetActiveSingleCompany,
    handleGetActiveSingleProperty,
    handleGetBuyerDeal,
    handleReset,
    handleSendMessageContact,
    initForm,
    initValues,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;
  // STATE
  const isBuyer = get(formValue, 'userType', '') === 'buyer' && activeSingleProperty.owner !== loggedInUser.id && get(activeSingleProperty, 'owner.id', null) !== loggedInUser.id;
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang, activeSingleCompany, isBuyer));
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(formValue.analysis === 'remote' || urlParams.action === 'on-site' ? 3 : 0);
  const [quest, setQuest] = useState<QuestionsListType>({});
  const [isEnter, setIsEnter] = useState(true);
  const [showError, setShowError] = useState(false);
  const [oldIndex, setOldIndex] = useState(0);
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  const BASEURL = isBuyer ? `/buyer/${propID}/contactFlow` : `/${propID}/contactFlow`;

  // REF
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  useEffect(() => {
    return () => destroyForm();
  }, []);

  useEffect(() => {
    let fullVersion = false;
    if (isBuyer) {
      fullVersion = false;
      handleGetBuyerDeal({ id: propID, actionStub: null });
    }
    handleGetActiveSingleProperty({ fullVersion, id: propID, multiLoader: !formValue.id });
  }, [propID, isBuyer]);

  useEffect(() => {
    if (activeSingleProperty.company) handleGetActiveSingleCompany({ id: activeSingleProperty.company });
  }, [activeSingleProperty.company]);

  // ON CHANGE STEP LOAD THE ENTER EFFECT
  useEffect(() => {
    setIsEnter(true);
    if (get(questions, `[${currentIndex}].history`, null) && activeSingleCompany.stub) {
      // history.push(`${BASEURL}/${questions[currentIndex].history}`);
    }
    setQuest(questions[currentIndex])
  }, [currentIndex]);

  useEffect(() => {
    if (isSmallLoading.sendData === true && (get(questions, `[${currentIndex + 1}].history`, null) === 'success')) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);

  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    handleReset(initialValues);
    // const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(`${BASEURL}/${propID}/home`);
  };

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    handleSendMessageContact(formValue);
  };

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act = '') => {
    let newIndex = id;
    if (get(questions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      get(questions[newIndex], 'conditions', []).map((cond) => {
        let val;
        if (cond?.name) {
          val = get(formValue, cond.name, null);
          if (has(cond, 'value') && val !== cond.value && checkCond) {
            if (act === 'back') newIndex -= 1;
            else newIndex += 1;
            checkCond = false;
          }
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
  const checkValidateField = (act = '') => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      get(quest, 'inputs', []).forEach((input) => {
        if (input?.name) {
          const err = get(errorValue, input.name, null);
          const noEmpty = get(formValue, input.name, 'ayc');
          if (noEmpty !== 'ayc') isNotEmpty = true;
          if (input.condition) {
            input.condition.forEach((item) => {
              if (item.name && item.value && get(formValue, item.name, null) === item.value) {
                if (err !== true && err !== false && err !== null && isValid) isValid = false;
              }
              if (item.name && item.noValue && get(formValue, item.name, null) !== item.noValue) {
                if (err !== true && err !== false && isValid) isValid = false;
              }
            });
          } else if (isValid) {
            isValid = get(errorValue, input.name, null) === true || get(errorValue, input.name, 'ayc') === 'ayc';
          }
        }
      });
    }
    if (quest.history === 'financeCalculator') {
      if (get(formValue, 'affordabilityCheck', null) === null) isValid = false;
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
      history.push(`${BASEURL}/contactFlow/`);
    } else {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (defId > -1) {
        if (questions[defId].toSave) saveData();
        const newQuest = {
          ...questions[defId],
        };
        setQuest(newQuest);
        setCurrentIndex(defId);
        setTimeout(() => {
          const getCurStep = document.getElementById(`step-${defId}`);
          if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
            const inputNumber = getCurStep.querySelector('input[type="number"]') as HTMLInputElement;
            if (inputNumber) inputNumber.focus();
          } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
            const inputText = getCurStep.querySelector('input[type="text"]') as HTMLInputElement;
            if (inputText) inputText.focus();
          }
        }, 100);
        if (questions[defId].history) {
          history.push(`${BASEURL}/${questions[defId].history}`, { state: get(history, 'location.state', {}) });
        }
        if (checkBrowser() > 0) {
          // @ts-ignore
          if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
          // @ts-ignore
          if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
        } else {
          // @ts-ignore
          if (singleStepEl && typeof singleStepEl.scrollTo === 'function') singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
          // @ts-ignore
          if (multiStepSlidesEl && typeof multiStepSlidesEl.scrollTo === 'function') multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (loggedInUser.id && activeSingleCompany.id && activeSingleProperty.id) initForm(initialValues);
    const defId = checkCondition(currentIndex);
    if (defId !== currentIndex) changeStep();
    if (activeSingleProperty.owner && loggedInUser.id) {
      if (activeSingleProperty.owner !== loggedInUser.id && get(activeSingleProperty, 'owner.id', null) !== loggedInUser.id) history.push(`/buyer/${propID}/contactFlow`);
    }
  }, [activeSingleProperty.id, activeSingleCompany.id, loggedInUser.id, isBuyer]);

  // ON CHANGE STEP LOAD THE ENTER EFFECT
  useEffect(() => {
    setIsEnter(true);
    if (questions[currentIndex].history && get(initValues, 'company', null)) {
      const urlData = queryString.parse(get(history, 'location.search', ''));
      if (urlData.type) {
        changeFieldValue('type', urlData.type.toString());
        changeStep();
      }
      // history.push(`${BASEURL}/${questions[currentIndex].history}`);
    }
  }, [currentIndex, initValues]);

  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    setOldIndex(currentIndex);
    const newQuest: QuestionsListType[] = [];
    if (formValue && activeSingleCompany.stub) {
      QuestionsList(lang, activeSingleCompany, isBuyer).map((quests) => {
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
    if (get(newQuest, `[${currentIndex + 1}].inputs`, []).length === 1 && get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex) {
      changeStep('next', null, 1, true);
    }
    if (currentIndex === 0 && formValue.analysis === 'remote') changeStep();
  }, [formValue, activeSingleCompany.id]);

  useEffect(() => {
    if (get(formValue, 'time.timestamp', null)) {
      const isToday = DateTime.fromMillis(get(formValue, 'time.timestamp', 0)).hasSame(DateTime.local(), 'day');
      if (isToday && formValue.time) delete formValue.time.hour;
    }
  }, [get(formValue, 'time.timestamp', null)]);


  useEffect(() => {
    if (get(formValue, 'time.date', null) && get(formValue, 'time.hour', null)) {
      const timeDate = get(formValue, 'time.date', null);
      const timeHour = get(formValue, 'time.hour', '').split(' - ')[0];
      const fullDate = DateTime.fromFormat(`${timeDate} ${timeHour}`, 'dd-MM-yyyy HH:mm', {locale: 'en'}).toMillis();
      if (fullDate !== get(formValue, 'time.timestamp', 0)) changeFieldValue('time.timestamp', fullDate);
    } else if (get(formValue, 'time.date', null)) {
      const timeDate = get(formValue, 'time.date', null);
      const fullDate = timeDate ? DateTime.fromFormat(timeDate, 'dd-MM-yyyy', {locale: 'en'}).toMillis() : -1;
      if (fullDate !== get(formValue, 'time.timestamp', '')) changeFieldValue('time.timestamp', fullDate);
    }
  }, [get(formValue, 'time.date', null), get(formValue, 'time.hour', null)]);

  // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
  const buttonLabel = () => {
    let label = 'Continue';
    if (currentIndex === questions.length - 2) label = 'Send';
    if (currentIndex === questions.length - 1) label = 'Close';
    return label;
  };

  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'classWrapper', '')}  `}>
      {
        quest.history && (
          <div className={`bodyModal dis-fl-col upgradeModal container ${get(quest, 'history', '')} ${get(quest, 'background', '') ? '' : ''} ${get(quest, 'vCentered', null) ? 'jc-c vCentered' : ''} stepNo${currentIndex}`}>
            <form
              id="multiStepForm"
              autoComplete="off"
              className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''}`}
              onSubmit={(e) => changeStep('', e)}
            >
              <div ref={multiStepSlidesRef} className="multiStepSlides">
                <div ref={singleStepRef} className={`singleStep zIndex1 pt-5 jc-c ${currentIndex < 5 ? isEnter ? 'fade-enter-active' : 'fade-enter' : ''}`}>
                  <div className="subcontainer m-a">
                    {
                      get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                        <div id={`step-${currentIndex}`} className="dis-fl-col flex-wrap activeQuestBack">
                          {
                            quest.title && (
                              <h2 className={`fsize-600 fsize-sm-700 fweight-600 max-w-fix-600 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                            )
                          }
                          {
                            quest.subtitle && (
                              <p className="mb-5 ta-c txtText600 w-perc-100 fsize-600 fsize-sm-700 fweight-400" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                          }
                          <div className={`${quest.className} w-perc-100`}>
                            <MultiFileldsReduxForm
                              form="contactFlow"
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
                            formName: 'contactFlow',
                            initialValue: formValue,
                            ...quest,
                            onClick: (step = 1) => (questions[currentIndex + 1] ? changeStep('next', null, step, true) : closeWindow()),
                            showError,
                          },
                        )
                      )
                    }
                    {
                      get(quest, 'textsCard', []).length > 0 && (
                        <div>
                          {
                            quest.title && (
                              <h2 className={`fsize-600 fsize-sm-700 fweight-600 max-w-fix-600 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                            )
                          }
                          {
                            quest.subtitle && (
                              <p className="mb-5 fsize-600 fsize-sm-700 fweight-400 ta-c txtText600 w-perc-100" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                          }
                          <div className="dis-f a-t flex-wrap jc-c">
                            {
                              get(quest, 'textsCard', []).map((txtCard, i) => (
                                <div key={`card${i.toString()}`} className="ta-c col-12 col-sm-4 p-2 p-md-5">
                                  <div className="h-fix-80 mb-2 mb-sm-3">
                                    <img className="ml-a mr-a"  src={txtCard.image} alt={txtCard.title} />
                                  </div>
                                  <h5 className="fsize-400 fsize-md-500 max-w-fix-280 max-w-fix-sm-320 ml-a mr-a">{txtCard.title}</h5>
                                </div>
                              ))
                            }
                          </div>
                        </div>
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
                    className={`footerAction flowFooter ${get(quest, 'footerWidth', '')}  ${!checkValidateField() ? 'disabledNext' : 'normStep'}`}
                  >
                    <div className="pos-r">
                      <div className="w-perc-100 a-c dis-fl-row flex-wrap jc-c mb-3 h-fix-40">
                        <>
                          {
                            get(questions, `[${currentIndex - 1}].inputs`, null) && (
                              <BrixelButtonIcon
                                className="backBtn ml-0"
                                icon="arrow-left-small"
                                onClick={() => changeStep('back')}
                                theme="light"
                                secondary
                              />
                            )
                          }
                          {
                            quest.hideContinueBtn !== true && (
                              <>
                                {
                                  buttonLabel().toLowerCase() === 'skip' ? (
                                    <BrixelButtonSecondary
                                      className={`noWrap ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
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
                                      className={`noWrap ml-a mr-a ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                      disabled={!checkValidateField()}
                                      rounded
                                      theme="green"
                                      themeSat={600}
                                      label={translateTo(buttonLabel(), lang)}
                                      rightIcon="arrow-right-small"
                                      onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                                      onShowError={() => setShowError(true)}
                                    />
                                  )
                                }
                              </>
                            )
                          }
                        </>
                      </div>
                      {
                        quest.txtAfterNextButton && (
                          <div className="mx-a mt-4">
                            <p className="fsize-300 txtText500">
                              {quest.txtAfterNextButton}
                            </p>
                          </div>
                        )
                      }
                      {
                        get(quest, 'showExitText', null) && (
                          <div className="w-perc-100 a-c dis-fl-row m-a jc-c mt-2">
                            <BrixelButtonText
                              label={translateTo('Not now', lang)}
                              theme="dark"
                              themeSat={200}
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
        )
      }
    </div>
  );
};
const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const initVal = {
    phone: {
      prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode?.dial_code) || countryPhoneCode?.dial_code,
      number: get(state, 'user.loggedInUser.user.phone.number', ''),
    },
    company: get(state, 'companies.activeSingleCompany.id', undefined),
    page: get(state, 'property.activeSingleProperty.id', undefined),
    user: get(state, 'user.loggedInUser.user.id', undefined),
    deal: get(state, 'deal.activeSingleDeal.id', undefined),
    type: undefined,
    userType: get(state, 'user.userTypes', ''),
  };
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    errorValue: get(state, 'brixelForm.contactFlow.syncErrors', {}),
    formValue: get(state, 'brixelForm.contactFlow.values', {}),
    initValues: get(state, 'brixelForm.contactFlow.initialValues', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    initialValues: initVal,
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('contactFlow', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('contactFlow', value));
  },
  destroyForm() {
    (dispatch(destroy('contactFlow')));
  },
  handleReset(val) {
    (dispatch(reset('contactFlow', val)));
  },
  handleSendMessageContact: bindActionCreators(sendMessageContact, dispatch),
  handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Contact);
