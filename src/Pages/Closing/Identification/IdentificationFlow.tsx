import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelProgressBar} from '@brixel/brixel-components';
import {change, destroy, initializeForm, MultiFileldsReduxForm, reset} from '@brixel/brixel-components/dist/form';
import {bindActionCreators} from 'redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import {diff} from 'deep-object-diff';
import translateTo from '../../../utils/translation';
import {deleteDocument, multiUploadDocument} from '../../../actions/UploadActions';
import {checkBrowser} from '../../../utils/helpers';
import {IdentificationQuestions} from '../../../resources/Deals/Identification';
import {getActiveSingleDeal, saveClosingIdentification} from '../../../actions/DealActions';
import {spinnerOff, spinnerSmall} from '../../../actions/CommonActions';
import type {IdentificationFlowType} from '../../../@types/Pages/Closing/Identification/IdentificationFlow';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const IdentificationFlow = (props: IdentificationFlowType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleDeal,
    activeSingleProperty,
    destroyForm,
    errorValue,
    formValue,
    handleDeleteDocument,
    handleGetActiveSingleDeal,
    handleSaveClosingIdentification,
    handleMultiUploadDocument,
    handleChangeSmallLoading,
    handleSpinnerOff,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
    handleReset,
    syncErrors,
  } = props;
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  const dealID = get(match, 'dealID', null);
  const userType = get(match, 'userType', null);
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(IdentificationQuestions(false, userType, lang));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [action, setAction] = useState('next');
  const [isEnter, setIsEnter] = useState(true);
  // SET QUEST TO FIRST QUESTION OF IdentificationQuestions()
  const [quest, setQuest] = useState<QuestionsListType>(IdentificationQuestions(false, userType, lang)[0]);

  // REFS
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    handleGetActiveSingleDeal({ id: dealID });
    if (userType !== 'buyer' && userType !== 'seller') {
      history.push(`/buyer/${propID}/closing/${dealID}`);
    }
    return () => {
      const loader = cloneDeep(isSmallLoading);
      loader.sendDataSent = false;
      handleChangeSmallLoading(loader);
      destroyForm();
    };
  }, []);

  useEffect(() => {
    delete syncErrors.location;
  }, [syncErrors]);

  useEffect(() => {
    setIsEnter(true);
  }, [currentIndex]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    const docsList: object[] = [];
    const formData = cloneDeep(formValue);
    formValue.persons.forEach((person, index) => {
      const prs = get(person, 'document', []);
      if (prs.length > 0) {
        Object.keys(prs).forEach((key) => {
          const doc = prs[key];
          if (doc.file) {
            docsList.push({
              idBuyer: `${index}:${key}`,
              id: `${index}:${key}`,
              ...doc,
              isPrivate: true,
              user: get(loggedInUser, 'id', null),
            });
          } else {
            formValue.persons[index].document[key] = doc;
          }
        });
      }
    });
    const dataDocuments = {
      allImgs: docsList,
      actions: 'documents',
      pageID: propID,
      smallLoader: 'sendData',
      user: get(loggedInUser, 'id', null),
    };
    const dataForm = {
      id: dealID,
      ...dataDocuments,
      smallLoader: 'sendData',
      personType: userType,
      ...formData,
      saveAction: 'closingIdentification',
    };
    if (docsList.length > 0) {
      handleMultiUploadDocument(dataForm);
    } else {
      handleSaveClosingIdentification(dataForm);
    }
  };

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex = id;
    const newQuestions: QuestionsListType[] = IdentificationQuestions(false, userType, lang);
    if (get(newQuestions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      get(newQuestions[newIndex], 'conditions', []).map((cond) => {
        if (cond?.name && cond?.value) {
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
    return newIndex;
  };

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act = '') => {
    let isValid = true;
    let isNotEmpty = false;
    if (quest?.inputs) {
      quest.inputs.forEach((input) => {
        if (input?.name) {
          const err = get(errorValue, input.name, null);
          const noEmpty = get(formValue, input.name, 'ayc');
          if (noEmpty !== 'ayc') isNotEmpty = true;
          if (input.condition) {
            input.condition.forEach((item) => {
              if (item?.name && item.value && get(formValue, item.name, null) === item.value) {
                if (err !== true && err !== false && isValid) isValid = false;
              }
              if (item?.name && item.noValue && get(formValue, item.name, null) !== item.noValue) {
                if (err !== true && err !== false && isValid) isValid = false;
              }
            });
          } else if (input.validation) {
            if (err !== true && err !== false && err !== null && isValid) isValid = false;
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
    const newQuestions = IdentificationQuestions(false, userType, lang);
    let newIndex = currentIndex;
    setShowError(false);
    setAction(act);
    if (act === 'back') {
      newIndex -= step;
    } else {
      if (!checkValidateField() && !skipValidation) {
        setShowError(true);
        return false;
      }
      newIndex += step;
    }
    if (newIndex > -1) {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (newQuestions[defId]) {
        // setPosition(newIndex);
        if (newQuestions[defId].toSave && !isSmallLoading.sendDataSent) {
          saveData();
          delete isSmallLoading.sendDataSent;
          handleChangeSmallLoading(isSmallLoading);
        } else {
          const newQuest = {
            ...newQuestions[defId],
          };
          setQuest(newQuest);
          setCurrentIndex(defId);
          if (newQuestions[defId].history) {
            history.push(`/packageFlow/${propID}/${dealID}/closing/${userType}/identification/${newQuestions[defId].history}`, { state: get(history, 'location.state', {}) });
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
    }
    return null;
  };

  useEffect(() => {
    initForm(initialValues);
    if (activeSingleDeal.id && get(activeSingleDeal, 'closing.stageIdentification.active', false) !== true) {
      if (userType === 'seller') history.push(`/${propID}/closing`);
      else history.push(`/buyer/${propID}/closing`);
    } else if (get(activeSingleProperty, 'owner', null)) {
      let ownerProp: string | null = get(activeSingleProperty, 'owner.id', null);
      if (!ownerProp && typeof activeSingleProperty.owner === 'string') ownerProp = activeSingleProperty.owner;
      if (userType === 'seller' && ownerProp !== loggedInUser.id) {
        history.push(`/${propID}/closing`);
      }

      if (userType === 'buyer' && get(loggedInUser, 'id', null) !== get(activeSingleDeal, 'user', null)) {
        history.push(`/buyer/${propID}/closing`);
      }
    }
    if (get(initialValues, 'persons[0].fullName', null)) {
      setTimeout(() => {
        changeStep('next', null, 3, true);
      }, 10);
    }
  }, [activeSingleDeal.id, get(initialValues, 'persons[0].fullName', null), get(activeSingleProperty, 'id', null)]);

  // CHANGE STEP AFTER SAVE
  useEffect(() => {
    if (isSmallLoading.sendDataSent) {
      changeStep();
    }
  }, [isSmallLoading]);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    setQuestions(IdentificationQuestions(false, userType, lang));
    setQuest(IdentificationQuestions(false, userType, lang)[currentIndex]);
  }, [lang]);

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    handleReset(initialValues);
    if (userType === 'seller') history.push(`/${propID}/closing`);
    else history.push(`/buyer/${propID}/closing`);
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    if (formValue) {
      const newQuest: object[] = [];
      IdentificationQuestions(false, userType, lang).map((questData: QuestionsListType) => {
        if (questData.condition) {
          let isValid = true;
          questData.condition.map((item) => {
            if (item.name && get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(questData);
        } else {
          newQuest.push(questData);
        }
        return null;
      });
      const checkDiff = diff(quest, newQuest);
      if (Object.keys(checkDiff).length > 0) setQuestions(newQuest);
    }
  }, [formValue]);

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex}].toSave`, null)) label = 'Save';
    else if (inputName && get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else label = 'Next';
    return label;
  };

  const progressBarCalc = () => {
    let num = 0;
    questions.forEach((item) => {
      if (get(item, 'hideProgress', false) !== true) {
        if (item.conditions) {
          item.conditions.forEach((cond) => {
            const val = get(formValue, cond.name || '', null);
            if (has(cond, 'value') && val === cond.value) {
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
    return (currentIndex * 100) / (num - 1);
  };

  const onRemoveFile = (file, profileId = 0) => {
    const dataForm = cloneDeep(formValue);
    dataForm.persons[profileId].document = [];
    const data = {
      ...dataForm,
      dealID,
      id: file.id,
      saveAction: 'closingIdentification',
      smallLoader: 'removeData',
    };
    handleDeleteDocument(data);
  };

  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted idFlow ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'history', '')}`}>
      {
        get(quest, 'inputs', null) && get(quest, 'history', '') !== 'createProfile' && get(quest, 'history', null) !== 'resume' && (
          <div className="pos-r">
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
          </div>

        )
      }

      <div className={`bodyModal dis-fl-col upgradeModal container ${get(quest, 'history', '')} ${get(quest, 'background', '') ? '' : ''} ${get(quest, 'vCentered', null) ? 'jc-c vCentered' : ''} stepNo${currentIndex}`}>
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''}`}
          onSubmit={(e: React.FormEvent) => changeStep('next', e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep zIndex1 pt-5 jc-c ${currentIndex < 5 ? isEnter : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (
                    <div id={`step-${currentIndex}`} className="dis-fl-col flex-wrap">
                      {
                        quest.title && (
                          <h3 className={`fweight-600 fsize-600 fsize-sm-800 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }
                      <div className={`${quest.className} w-perc-100`}>
                        {
                          quest.subtitleSmall && (
                            <p className="mb-3" dangerouslySetInnerHTML={{ __html: quest.subtitleSmall }} />
                          )
                        }
                        <MultiFileldsReduxForm
                          form="Identification"
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
                          onRemove={(val) => onRemoveFile(val)}
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
                        dealID,
                        formName: 'Identification',
                        initialValue: formValue,
                        userType,
                        ...quest,
                        onClick: (step = 1) => (questions[currentIndex + 1] ? changeStep('next', null, step, true) : closeWindow()),
                        onBack: (step = 1) => changeStep('back', null, step, true),
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
                            className="fadeAnim fsize-600 fsize-sm-700 fweight-600 ta-c"
                            dangerouslySetInnerHTML={{ __html: quest.title }}
                          />
                        )
                      }
                      {
                        quest.subtitle && (
                          <h6
                            className="fadeAnim fsize-400 fsize-sm-500 fweight-400 mt-2 ta-c"
                            dangerouslySetInnerHTML={{ __html: quest.subtitle }}
                          />
                        )
                      }
                      <BrixelButtonPrimary
                        className={`mt-3 mb-3 m-a noWrap ${quest.history}`}
                        rounded
                        theme="green"
                        label={translateTo('Back to hub', lang)}
                        disabled={!checkValidateField()}
                        isLoading={isSmallLoading.sendData}
                        onClick={() => (userType === 'buyer' ? history.push(`/buyer/${propID}/closing`) : history.push(`/${propID}/closing/${dealID}`))}
                      />
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
                className={`footerAction flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
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
                          secondary
                        />
                      )
                    }
                    {
                      get(quest, 'history', null) !== 'resume' && (get(quest, 'inputs', []).length > 1 || (get(quest, 'inputs[0].component.name', '') !== 'BrixelRadioButton' || get(quest, 'history', null) === 'propertyType') || action === 'back') && (
                        <BrixelButtonPrimary
                          className={`ml-a mr-a noWrap ${get(quest, 'history', null)}`}
                          disabled={!checkValidateField()}
                          rounded
                          theme="green"
                          label={translateTo(buttonLabel(), lang)}
                          isLoading={isSmallLoading.sendData}
                          rightIcon="arrow-right-small"
                          onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                          onShowError={() => setShowError(true)}
                        />
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
  let userType = 'buyer';
  if (typeof window !== 'undefined') userType = (window.location.href).includes('seller') ? 'seller' : 'buyer';
  const initialValues = cloneDeep(get(state, `deal.activeSingleDeal.closing.stageIdentification.${userType}`, {}));
  if (userType === 'buyer' && get(initialValues, 'persons', []).length === 0) {
    const buyerOffer = cloneDeep(get(state, 'deal.activeSingleDeal.closing.stageOffer.offer', {}));
    initialValues.persons = [{
      document: [],
      dateBirth: get(buyerOffer, 'buyer.dateBirth', ''),
      maritialStatus: get(buyerOffer, 'buyer.maritialStatus', ''),
      matrimonialPropertyRegime: get(buyerOffer, 'buyer.matrimonialPropertyRegime', ''),
      nationality: get(buyerOffer, 'buyer.placeOfOrigin', ''),
      typeOfOwnership: get(buyerOffer, 'buyer.typeOfPurchase', ''),
      currentLivingAddress: {
        address: get(buyerOffer, 'location.street', ''),
        zipCode: get(buyerOffer, 'location.zipCode', ''),
        city: get(buyerOffer, 'location.City', ''),
      },
    }];
  }
  return ({
    activeSingleDeal: get(state, 'deal.activeSingleDeal', null),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.Identification.syncErrors', {}),
    formValue: get(state, 'brixelForm.Identification.values', {}),
    initialValues,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.lang', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    stageClosingData: initialValues,
    syncErrors: get(state, 'brixelForm.Identification.syncErrors', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Identification', field, value));
  },
  destroyForm() {
    dispatch(destroy('Identification'));
  },
  initForm(value) {
    dispatch(initializeForm('Identification', value));
  },
  handleReset(data) {
    (dispatch(reset('Identification', data)));
  },
  handleGetActiveSingleDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleSaveClosingIdentification: bindActionCreators(saveClosingIdentification, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleChangeSmallLoading: bindActionCreators(spinnerSmall, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(IdentificationFlow);
