import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelProgressBar, Helpers} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {change, destroy, initializeForm, MultiFileldsReduxForm, reset} from '@brixel/brixel-components/dist/form';
import {bindActionCreators} from 'redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import queryString from 'query-string';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import {FinancialCalculator} from '@brixel/brixel-components/dist/utils/FinancialFormulas';
import isArray from 'lodash/isArray';
import {QuestionsList} from '../../../resources/Deals/Financing';
import {getCookie, setCookie} from '../../../utils/helpers';
import {getActiveSingleCompany} from '../../../actions/CompanyActions';
import {getActiveSingleProperty} from '../../../actions/PropertyActions';
import {getBuyerDeal, saveFinancingRequest} from '../../../actions/DealActions';
import {multiUploadDocument} from '../../../actions/UploadActions';
import type {FinancingType} from '../../../@types/Pages/Closing/Financing/Financing';
import {DocumentType, QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const Financing = (props: FinancingType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleDeal,
    activeSingleProperty,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleGetActiveSingleCompany,
    handleGetActiveSingleProperty,
    handleGetBuyerDeal,
    handleMultiUploadDocument,
    handleReset,
    handleSaveFinancingRequest,
    initForm,
    initValues,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;
  const lowCountry = get(formValue, 'propertyLocation.countryCode', '');
  const maxLoanRatio = lowCountry?.toLowerCase() === 'pt' ? 90 : 80;
  const affordability = get(formValue, 'affordability', 0);
  const loanToValueRatio = get(formValue, 'loanToValueRatio', 0);
  // STATE
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState<QuestionsListType>(QuestionsList((name, value) => changeFieldValue(name, value), lang)[0]);
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList((name, value) => changeFieldValue(name, value), lang));
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
    if (get(activeSingleProperty, 'company', null)) {
      const defComp = get(activeSingleProperty, 'company', 'default');
      handleGetActiveSingleCompany({ id: defComp });
    }
    if (activeSingleProperty.id && !activeSingleDeal.id) handleGetBuyerDeal({ id: activeSingleProperty.id });
  }, [activeSingleDeal.id, activeSingleProperty.id]);

  useEffect(() => {
    const cost = {
      equityCapital: get(formValue, 'financeBuyer.equity', undefined),
      income: get(formValue, 'financeBuyer.income', undefined),
      fixedCost: 0,
    };
    let lowCountryFin = get(formValue, 'propertyLocation.countryCode', '');
    lowCountryFin = lowCountryFin ? lowCountryFin.toLowerCase() : '';
    const price = get(formValue, 'propertyPrice', 0);
    const financeCalc = FinancialCalculator(lowCountryFin, price, cost, '');
    if (financeCalc) {
      const affordabilityData = get(financeCalc, 'affordability', 0);
      const loanToValueRatioData = get(financeCalc, 'loanToValueRatio', 0);
      changeFieldValue('affordability', affordabilityData);
      changeFieldValue('loanToValueRatio', loanToValueRatioData);
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
    if (questions[currentIndex].history && get(initValues, 'id', null)) {
      const urlData = queryString.parse(get(history, 'location.search', ''));
      if (urlData.subtype) changeFieldValue('subtype', urlData.subtype);
      history.push(`/buyer/${propID}/financingFlow/${questions[currentIndex].history}`);
    }
  }, [currentIndex, get(initValues, 'id', null)]);


  // MOVE STEP FORWARD AFTER SAVING
  useEffect(() => {
    if (isSmallLoading?.sendData === true && questions[currentIndex + 1]) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
      setIsToSave(true);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    if (activeSingleProperty.id && loggedInUser.id) initForm(initialValues);
  }, [loggedInUser.id, activeSingleProperty.id]);

  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    handleReset(initialValues);
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/buyer/${propID}/closing/${dealID}`);
  };

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    const doc: DocumentType[] = get(formValue, 'document', []);
    const docs: DocumentType[] = get(formValue, 'documents', doc);
    docs.forEach((_item, i) => set(docs[i], 'user', get(loggedInUser, 'id', undefined)));
    const dataDocuments = {
      allImgs: docs,
      actions: 'documents',
      pageID: propID,
      smallLoader: 'sendData',
      user: get(loggedInUser, 'id', null),
    };
    const dataForm = {
      user: get(loggedInUser, 'id', null),
      page: get(activeSingleProperty, 'id', null),
      company: get(activeSingleCompany, 'id', null),
      data: {
        amount: get(formValue, 'amount', 0),
        currency: get(activeSingleProperty, 'price.currency', ''),
        netIncome: get(formValue, 'finance.netIncome', 0),
        grossIncome: get(formValue, 'finance.grossIncome', 0),
        equityCapital: get(formValue, 'finance.equityCapital', 0),
        affordabilityCheck: get(formValue, 'affordabilityCheck', null),
        affordability: get(formValue, 'affordability', null),
        loanValueCheck: get(formValue, 'loanValueCheck', null),
        loanToValueRatio: get(formValue, 'loanToValueRatio', null),
        mortgageAmount: get(formValue, 'mortgageAmount', null),
      },
    }
    const data = {
      ...dataForm,
      ...dataDocuments,
    };
    if (isToSave) {
      setIsToSave(false);
      if (docs.length > 0) {
        handleMultiUploadDocument(data);
      } else {
        handleSaveFinancingRequest(data);
      }
    }
  };

  const progressBarCalc = () => {
    let num = 0;
    questions.forEach((item) => {
      if (get(item, 'hideProgress', false) !== true) {
        if (item.conditions) {
          item.conditions.forEach((cond) => {
            const val = get(formValue, cond.name || '', null);
            if ((cond.value && val === cond.value) || (cond.noValue && val !== cond.noValue)) num += 1;
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
      get(questions[newIndex], 'conditions', []).map((cond) => {
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
  const checkConditionField = (input, valid, err) => {
    let isValid = valid;
    if (input.condition) {
      input.condition.forEach((item) => {
        if (item?.name) {
          if (item.value && get(formValue, item.name, null) === item.value) {
            if (err !== true && err !== false && err !== null && isValid) isValid = false;
          }
          if (item.noValue && get(formValue, item.name, null) !== item.noValue) {
            if (err !== true && err !== false && isValid) isValid = false;
          }
        }
      });
    } else if (isValid) {
      isValid = get(errorValue, input.name, null) === true || get(errorValue, input.name, 'ayc') === 'ayc';
    }
    return isValid;
  };
  const checkValidateField = (act = '') => {
    let isValid = true;
    let isNotEmpty = false;
    if (quest?.inputs) {
      quest.inputs.forEach((input) => {
        if (input?.name) {
          const err = get(errorValue, input.name, null);
          const noEmpty = get(formValue, input.name, 'ayc');
          if (noEmpty !== 'ayc') isNotEmpty = true;
          isValid = checkConditionField(input, isValid, err);
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
  const fakeInputField = (newQuest, defId) => {
    if (newQuest.history !== 'createProfile') {
      if (newQuest.inputs && !newQuest.inputs[0].options && !newQuest.inputs[0].startFrom) {
        const fakeInput = document.createElement('input') as HTMLInputElement;
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
        }
        // cleanup
        if (fakeInput) fakeInput.remove();
      }, 500);
    }
  }
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
        if (questions[defId].toSave) {
          saveData();
        } else {
          const newQuest = {
            ...questions[defId],
          };
          setQuest(newQuest);
          setCurrentIndex(defId);
          fakeInputField(newQuest, defId);
          if (questions[defId].history) {
            history.push(`/buyer/${propID}/financingFlow/${questions[defId].history}`, { state: get(history, 'location.state', {}) });
          }
          // @ts-ignore
          if (singleStepEl?.scrollTop) singleStepEl.scrollTop = 0;
          // @ts-ignore
          if (multiStepSlidesEl?.scrollTop) multiStepSlidesEl.scrollTop = 0;
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
      QuestionsList((name, value) => changeFieldValue(name, value), lang).forEach((quests) => {
        if (quests.condition) {
          let isValid = true;
          quests.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
          });
          if (isValid) newQuest.push(quests);
        } else {
          newQuest.push(quests);
        }
      });
      setQuest(newQuest[currentIndex]);
      setQuestions(newQuest);
    }
    if (newQuest[currentIndex] && newQuest[currentIndex].inputs && newQuest[currentIndex]?.inputs?.length === 1 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex) {
      changeStep('next', null, 1, true);
    }
  }, [formValue, get(formValue, 'document', null), lang]);

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

  const enterEffectClass = () => {
    if (currentIndex < 5) {
      return isEnter ? 'fade-enter-active' : 'fade-enter' ;
    }
  }

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
              barBackground="text"
              backgroundSaturation={100}
              progressValue={progressBarCalc()}
            />
          )
        }
      </div>

      <div className={`bodyModal dis-fl-col upgradeModal container ${get(quest, 'history', '')} ${get(quest, 'vCentered', null) ? 'jc-c vCentered' : ''} stepNo${currentIndex}`}>
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''}`}
          onSubmit={() => changeStep()}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep zIndex1 pt-5 jc-c ${enterEffectClass()}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                    <div id={`step-${currentIndex}`} className="dis-fl-col flex-wrap">
                      {
                        quest.title && (
                          <h2
                            className={`fweight-600 fsize-600 fsize-sm-800 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`}
                            dangerouslySetInnerHTML={{ __html: Helpers.sanitizeText(quest.title) }}
                          />
                        )
                      }
                      {
                        initialValues?.id && (
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
                        onCloseGoBack: () => changeStep('back'),
                        showError,
                      },
                    )
                  )
                }
                {
                  (get(quest, 'cardType', null) === 'card') && (
                    <div className={`scaleAnim ta-c ${quest.cardClass}`}>
                      <img loading="lazy" src={quest.img} alt={quest.title} className={`${quest.imgMaxWidth ? quest.imgMaxWidth : 'max-w-fix-232'} mb-3`} />
                      <h2
                        className="fadeAnim fweight-600 ta-c"
                        dangerouslySetInnerHTML={{ __html: Helpers.sanitizeText(quest.title || '') }}
                      />
                      {
                        quest.subtitle && (
                          <h6
                            className="fadeAnim fsize-600 fweight-400 mt-2 ta-c"
                            dangerouslySetInnerHTML={{ __html: Helpers.sanitizeText(quest.subtitle) }}
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
                        themeSat={500}
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
                          theme="text"
                          themeSat={300}
                          ghost
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
                                themeSat={500}
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
                                themeSat={500}
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
                        <div dangerouslySetInnerHTML={{ __html: Helpers.sanitizeText(quest.txtAfterNextButton) }} />
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

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', { }),
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  errorValue: get(state, 'brixelForm.offerFlow.syncErrors', {}),
  formValue: get(state, 'brixelForm.offerFlow.values', {}),
  initValues: get(state, 'brixelForm.offerFlow.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  initialValues: {
    ...get(state, 'brixelForm.offerFlow.values', {}),
    affordabilityCheck: 0,
    loanValueCheck: 0,
    company: get(state, 'companies.activeSingleCompany.stub', ''),
    id: get(state, 'property.activeSingleProperty.id', ''),
    propertyLocation: get(state, 'property.activeSingleProperty.location', {}),
    amount: get(state, 'brixelForm.offerFlow.values.amount', get(state, 'property.activeSingleProperty.price.total', 0)) || 0,
    propertyPrice: get(state, 'property.activeSingleProperty.price.total', 0) || 0,
    propertyPriceCurrency: get(state, 'property.activeSingleProperty.price.currency', ''),
    subtype: get(state, 'brixelForm.offerFlow.values.subtype', ''),
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
  handleReset(data) {
    (dispatch(reset('offerFlow', data)));
  },
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleSaveFinancingRequest: bindActionCreators(saveFinancingRequest, dispatch),
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Financing);
