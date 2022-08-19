/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelProgressBar, translateTo,
} from '@brixel/brixel-components';
import {
  MultiFileldsReduxForm,
  change,
  destroy,
  reset,
  initializeForm,
} from '@brixel/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import { FinancialCalculator } from '@brixel/brixel-components/dist/utils/FinancialFormulas';
import isArray from 'lodash/isArray';
import { MakeOfferQuestions } from '../../../../resources/Deals/MakeOffer';
import { sendUserScanTrial } from '../../../../actions/UserActions';
import { setModal, spinnerOff } from '../../../../actions/CommonActions';
import { getCookie, setCookie } from '../../../../utils/helpers';
import { getActiveSingleCompany } from '../../../../actions/CompanyActions';
import { getActiveSingleProperty } from '../../../../actions/PropertyActions';
import { saveMakeOffer, getActiveSingleDeal, getBuyerDeal } from '../../../../actions/DealActions';
import { multiUploadDocument } from '../../../../actions/UploadActions';

const MakeOffer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    activeSingleDeal,
    activeSingleCompany,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleGetActiveSingleCompany,
    handleGetActiveSingleProperty,
    handleMultiUploadDocument,
    handleSaveMakeOffer,
    handleSetModal,
    initForm,
    initialValues,
    isSmallLoading,
    handleGetBuyerDeal,
    lang,
    loggedInUser,
    handleReset,
  } = props;
  let lowCountry = get(formValue, 'propertyLocation.countryCode', '');
  lowCountry = lowCountry ? lowCountry.toLowerCase() : '';
  const maxLoanRatio = lowCountry === 'pt' ? 90 : 80;
  const affordability = get(formValue, 'affordability', 0);
  const loanToValueRatio = get(formValue, 'loanToValueRatio', 0);
  // STATE
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(MakeOfferQuestions((name, value) => changeFieldValue(name, value), (id) => setCurrentIndex(id))[0], (data) => handleSetModal(data), lang);
  const [questions, setQuestions] = useState(MakeOfferQuestions((name, value) => changeFieldValue(name, value), (id) => setCurrentIndex(id), (data) => handleSetModal(data), lang));
  const [isEnter, setIsEnter] = useState(true);
  const [showError, setShowError] = useState(false);
  const [oldIndex, setOldIndex] = useState(0);
  const [isToSave, setIsToSave] = useState(true);
  // GET URL PARAMS
  const propID = get(match, 'id', null);
  const dealID = get(activeSingleDeal, 'id', null);
  
  // REF
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);
  
  useEffect(() => {
    if (activeSingleProperty.id !== propID) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
    return () => destroyForm();
  }, []);
  
  useEffect(() => {
    if (activeSingleDeal.id && (get(activeSingleDeal, 'closing.stageOffer.offer.status', null) && (get(activeSingleDeal, 'closing.stageOffer.offer.amount', 0) === 0 || get(activeSingleDeal, 'closing.stageOffer.offer.status', '') !== 'rejected'))) {
      history.push({ pathname: `/buyer/${propID}/closing/${activeSingleDeal.id}` });
    }
    if (get(activeSingleProperty, 'company', null)) {
      const defComp = get(activeSingleProperty, 'company', 'default');
      handleGetActiveSingleCompany({ id: defComp });
    }
    if (activeSingleProperty.id && !activeSingleDeal.id) handleGetBuyerDeal({ id: activeSingleProperty.id });
  }, [activeSingleDeal.id, activeSingleProperty.id]);
  
  useEffect(() => {
    const cost = {
      equityCapital: get(formValue, 'financeBuyer.equity', null),
      netIncome: get(formValue, 'financeBuyer.income', null),
      fixedCost: 0,
    };
    let lowCountry = get(formValue, 'propertyLocation.countryCode', '');
    lowCountry = lowCountry ? lowCountry.toLowerCase() : '';
    const price = get(formValue, 'propertyPrice', 0);
    const financeCalc = FinancialCalculator(lowCountry, price, cost);
    if (financeCalc) {
      const {
        affordability,
        loanToValueRatio,
      } = financeCalc;
      changeFieldValue('affordability', affordability);
      changeFieldValue('loanToValueRatio', loanToValueRatio);
    }
  }, [get(formValue, 'financeBuyer.equity', null), get(formValue, 'financeBuyer.income', null)]);
  
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
      changeFieldValue('company', activeSingleCompany.stub);
      setCookie('brixelStubCompany', activeSingleCompany.stub);
    }
  }, [activeSingleCompany.id]);
  
  // ON CHANGE STEP LOAD THE ENTER EFFECT
  useEffect(() => {
    setIsEnter(true);
    if (questions[currentIndex].history) {
      history.push(`/packageFlow/${propID}/makeOffer/${questions[currentIndex].history}`);
    }
  }, [currentIndex]);
  
  // MOVE STEP FORWARD AFTER SAVING
  useEffect(() => {
    if (isSmallLoading.sendData === true && questions[currentIndex + 1]) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
      setIsToSave(true);
    }
  }, [isSmallLoading]);
  
  useEffect(() => {
    if (activeSingleProperty.id) initForm(initialValues);
  }, [loggedInUser.id, activeSingleProperty.id]);
  
  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    handleReset('offerFlow');
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/buyer/${propID}/closing/${dealID}`);
  };
  
  // FUNCTION TO SAVE DATA
  const saveData = () => {
    const doc = get(formValue, 'document', []);
    const docs = get(formValue, 'documents', doc);
    // eslint-disable-next-line no-return-assign
    docs.forEach((item, i) => docs[i].user = get(loggedInUser, 'id', null));
    const dataDocuments = {
      allImgs: docs,
      actions: 'documents',
      pageID: propID,
      smallLoader: 'sendData',
      user: get(loggedInUser, 'id', null),
    };
    const dataForm = cloneDeep(formValue);
    dataForm.id = dealID;
    dataForm.smallLoader = 'sendData';
    dataForm.saveAction = 'makeOffer';
    dataForm.currency = dataForm.propertyPriceCurrency;
    delete dataForm.financeBuyer;
    delete dataForm.propertyLocation;
    delete dataForm.propertyPrice;
    delete dataForm.propertyPriceCurrency;
    delete dataForm.propertyLocation;
    const data = {
      ...dataForm,
      ...dataDocuments,
    };
    if (isToSave) {
      if (docs.length === 0 && activeSingleCompany.stub === 'ubs') {
        history.push(`/buyer/${propID}/financingFlow`);
      } else {
        setIsToSave(false);
        if (docs.length > 0) {
          handleMultiUploadDocument(data);
        } else {
          handleSaveMakeOffer(data);
        }
      }
    }
  };
  
  const progressBarCalc = () => {
    let num = 0;
    questions.forEach((item) => {
      if (get(item, 'hideProgress', false) !== true) {
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
      }
    });
    return (currentIndex * 100) / (num);
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
    if (get(quest, 'inputs', null)) {
      quest.inputs.forEach((input) => {
        const err = get(errorValue, input.name, null);
        const noEmpty = get(formValue, input.name, 'ayc');
        if (noEmpty !== 'ayc') isNotEmpty = true;
        if (input.condition) {
          input.condition.forEach((item) => {
            if (item.value && get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && err !== null && isValid) isValid = false;
            }
            if (item.noValue && get(formValue, item.name, null) !== item.noValue) {if (err !== true && err !== false && isValid) isValid = false;
            }
          });
        } else if (isValid) {
          isValid = get(errorValue, input.name, null) === true || get(errorValue, input.name, 'ayc') === 'ayc';
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
      history.push('/packageFlow');
    } else {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (questions[defId]) {
        // setPosition(newIndex);
        if (questions[defId].toSave) {
          saveData(get(questions[defId], 'action', null));
        } else {
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
          if (newQuest.history !== 'createProfile') {
            if (newQuest.inputs && !newQuest.inputs[0].options && !newQuest.inputs[0].startFrom) {
              const fakeInput = document.createElement('input');
              fakeInput.setAttribute('type', 'text');
              fakeInput.setAttribute('id', 'fakeInput');
              fakeInput.style.position = 'absolute';
              fakeInput.style.opacity = 0;
              fakeInput.style.height = 0;
              fakeInput.style.fontSize = '16px'; // disable auto zoom
              // zoom/scroll behavior
              document.body.prepend(fakeInput);
              fakeInput.focus();
            }
            
            setTimeout(() => {
              const fakeInput = document.getElementById('fakeInput');
              const getCurStep = document.getElementById(`step-${defId}`);
              if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
                getCurStep.querySelector('input[type="number"]').focus();
              } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
                getCurStep.querySelector('input[type="text"]').focus();
              }
              // cleanup
              if (fakeInput) fakeInput.remove();
            }, 500);
          }
          if (questions[defId].history) {
            history.push({
              pathname: `/packageFlow/${propID}/makeOffer/${questions[defId].history}`,
              state: get(history, 'location.state', {}),
            });
          }
          if (singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
          if (multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
        }
      }
    }
    return null;
  };
  
  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    const newQuest = [];
    setOldIndex(currentIndex);
    if (formValue) {
      MakeOfferQuestions((name, value) => changeFieldValue(name, value), (id) => setCurrentIndex(id), (data) => handleSetModal(data), lang).map((quests) => {
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
    if (newQuest[currentIndex] && newQuest[currentIndex].inputs && newQuest[currentIndex].inputs.length === 1 && get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex) {
      changeStep('next', null, 1, true);
    }
  }, [formValue, get(formValue, 'document', null)]);
  
  useEffect(() => {
    if (has(formValue, 'document') && get(formValue, 'document', []).length === 0) {
      delete formValue.document;
    }
  }, [get(formValue, 'document', null)]);
  
  // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
  const buttonLabel = () => {
    let label;
    if (get(formValue, 'affordabilityCheck', null) === false && get(formValue, 'loanValueCheck', null) === false && get(quest, 'history', '') === 'financeCalculator') label = 'Continue without proof of financing';
    else if (get(questions, `[${currentIndex + 1}].toSave`, null)) label = 'Save';
    else if (get(questions, `[${currentIndex}].buttonText`, null)) label = get(questions, `[${currentIndex}].buttonText`, '');
    else if (currentIndex === questions.length - 1) label = 'Close';
    else label = 'Continue';
    return label;
  };
  
  const buttonContinueClick = () => {
    if ((affordability > 33 || loanToValueRatio > maxLoanRatio) && questions[currentIndex].history === 'key4Registration') closeWindow();
    else if (questions[currentIndex + 1]) changeStep();
    else closeWindow();
  };
  
  if (!formValue.id && !activeSingleCompany.id) return '<div />'

  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'classWrapper', '')} trialRequest`}>
      <div className="pos-r">
        {
          get(quest, 'hideProgress', false) !== true && (
            <BrixelProgressBar
              large
              classProgressBar="container topProgressBar"
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
          className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''} ${questions[currentIndex] && questions[currentIndex].effect === 'slideUp' ? 'ov-v signUp' : ''}`}
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep zIndex1 pt-5 jc-c ${currentIndex < 5 ? isEnter || (questions[currentIndex] && questions[currentIndex].effect) ? 'fade-enter-active' : 'fade-enter' : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                    <div id={`step-${currentIndex}`} className={`dis-fl-col flex-wrap ${questions[currentIndex].effect} ${questions[currentIndex].effect === 'slideUp' ? 'activeQuestBack' : ''}`}>
                      {
                        quest.title && (
                          <h2 className={`fweight-600 fsize-600 fsize-sm-800 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }
                      {
                        initialValues.id && (
                          <div className={`${quest.className} w-perc-100`}>
                            <MultiFileldsReduxForm
                              form="offerFlow"
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
                        )
                      }
                    
                    </div>
                  )
                }
                {
                  get(quest, 'cardType', null) === 'loadComponent' && (
                    React.createElement(
                      quest.component,
                      {
                        formName: 'offerFlow',
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
            get(quest, 'history', null) !== 'createProfile' && !get(quest, 'hideActionsButton', false) && (
              <div
                className={`footerAction flowFooter ${questions[currentIndex] && questions[currentIndex].footerWidth} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
              >
                <div className="pos-r">
                  <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c mb-3 h-fix-40">
                    {
                      ((get(questions, `[${currentIndex - 1}].inputs`, null) && currentIndex > 0) || (get(questions, `[${currentIndex}].showBackButton`, null))) && (
                        <BrixelButtonIcon
                          className="backBtn pos-a-fix x-l-0 x-t-0"
                          icon="arrow-left-small"
                          onClick={() => changeStep('back')}
                          theme="light"
                          secondary
                        />
                      )
                    }
                    {
                      get(quest, 'hideContinueBtn', '') !== true &&
                      (
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
                                onClick={() => buttonContinueClick()}
                              />
                            ) : (
                              <BrixelButtonPrimary
                                className={`mr-a ml-a noWrap ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                disabled={!checkValidateField()}
                                rounded
                                isLoading={isSmallLoading.sendData === true}
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
                  </div>
                  {
                    quest.txtAfterNextButton && (
                      <div className="max-w-fix-456 mx-a mt-2">
                        <div dangerouslySetInnerHTML={{ __html: quest.txtAfterNextButton }} />
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

MakeOffer.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetBuyerDeal: PropTypes.func.isRequired,
  handleMultiUploadDocument: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSaveMakeOffer: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', { }),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  errorValue: get(state, 'brixelForm.offerFlow.syncErrors', {}),
  formValue: get(state, 'brixelForm.offerFlow.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  initialValues: {
    ...get(state, 'brixelForm.offerFlow.values', {}),
    affordabilityCheck: null,
    loanValueCheck: null,
    financeCertificate: null,
    company: get(state, 'companies.activeSingleCompany.stub', null),
    id: get(state, 'property.activeSingleProperty.id', null),
    propertyLocation: get(state, 'property.activeSingleProperty.location', {}),
    amount: get(state, 'property.activeSingleProperty.price.total', 0) || 0,
    propertyPrice: get(state, 'property.activeSingleProperty.price.total', 0) || 0,
    propertyPriceCurrency: get(state, 'property.activeSingleProperty.price.currency', ''),
    noDocument: 0,
  },
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('offerFlow', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('offerFlow', value));
  },
  destroyForm() {
    (dispatch(destroy('offerFlow')));
  },
  handleReset(form) {
    (dispatch(reset(form)));
  },
  handleGetActiveDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleSaveMakeOffer: bindActionCreators(saveMakeOffer, dispatch),
  handleSendScanTrial: bindActionCreators(sendUserScanTrial, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MakeOffer);
