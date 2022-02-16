/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary, BrixelButtonIcon, BrixelProgressBar, MultiFileldsReduxForm, initializeForm, change, reset, destroy, DataByCountry,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import { diff } from 'deep-object-diff';
import { deleteDocument, multiUploadDocument } from '../../../actions/UploadActions';
import { titleProperty } from '../../../utils/titleCreation';
import { checkBrowser } from '../../../utils/helpers';
import { IdentificationQuestions } from '../../../resources/Identification';
import { getActiveSingleDeal, saveClosingIdentification } from '../../../actions/DealActions';
import { spinnerOff } from '../../../actions/CommonActions';

const IdentificationFlow = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleDeal,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleDeleteDocument,
    handleGetActiveSingleDeal,
    handleSaveClosingIdentification,
    handleMultiUploadDocument,
    handleSpinnerOff,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
    reset,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(IdentificationQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [action, setAction] = useState('next');
  const [isEnter, setIsEnter] = useState(true);
  // SET QUEST TO FIRST QUESTION OF IdentificationQuestions()
  const [quest, setQuest] = useState(IdentificationQuestions()[0]);
  // const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  const dealID = get(match, 'dealID', null);
  const userType = get(match, 'userType', null);

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    handleGetActiveSingleDeal({ id: dealID });
    if (userType !== 'buyer' && userType !== 'seller') {
      history.push(`/buyer/${propID}/closing`);
    }
    return () => destroyForm();
  }, []);

  useEffect(() => {
    initForm(initialValues);
    if (activeSingleDeal.id && get(activeSingleDeal, 'closing.stageIdentification.active', false) !== true) {
      history.push(`/buyer/${propID}/closing`);
    }
  }, [activeSingleDeal.id, get(initialValues, 'persons[0].fullName', null)]);

  const getCurrency = () => {
    const result = {};
    if (get(formValue, 'location.countryCode', '')) {
      const currency = DataByCountry(get(formValue, 'location.countryCode', ''));
      result.currency = currency || 'CHF';
      changeFieldValue('price.currency', result.currency);
    }
    return result;
  };

  useEffect(() => {
    getCurrency();
  }, [get(history, 'location.countryCode', null)]);

  useEffect(() => {
    setIsEnter(true);
  }, [currentIndex]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    const docsList = [];
    const formData = cloneDeep(formValue);
    formValue.persons.forEach((person, index) => {
      if (get(person, 'document', []).length > 0) {
        get(person, 'document', []).forEach((doc) => {
          docsList.push({
            idBuyer: index,
            ...doc,
            isPrivate: true,
            user: get(loggedInUser, 'id', null),
          });
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
    // eslint-disable-next-line no-console
    if (docsList.length > 0) {
      handleMultiUploadDocument(dataForm);
    } else {
      handleSaveClosingIdentification(dataForm);
    }
  };

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex = id;
    const newQuestions = IdentificationQuestions();
    if (get(newQuestions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      newQuestions[newIndex].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (has(cond, 'value') && val !== cond.value && checkCond) {
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
          if (err !== true && err !== false && err !== null && isValid) isValid = false;
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
    const newQuestions = IdentificationQuestions();
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
    if (newIndex === -1) {
      history.push('/packageFlow');
    } else {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (newQuestions[defId]) {
        // setPosition(newIndex);
        if (newQuestions[defId].toSave && !isSmallLoading.sendDataSent) {
          saveData(get(newQuestions[defId], 'action', null));
        } else {
          let newQuest = {
            ...newQuestions[defId],
          };
          if (newQuestions[defId].effect === 'slideUp') {
            newQuest = {
              ...newQuestions[defId - 1],
            };
          }
          setQuest(newQuest);
          setCurrentIndex(defId);
          if (newQuestions[defId].history) {
            history.push({
              pathname: `/packageFlow/${propID}/${dealID}/closing/identification/${newQuestions[defId].history}`,
              state: get(history, 'location.state', {}),
            });
          }
          if (checkBrowser() > 0) {
            if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
            if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
          } else {
            if (singleStepEl && singleStepEl.scrollTo) singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
            if (multiStepSlidesEl && multiStepSlidesEl.scrollTo) multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    }
    return null;
  };

  // CHANGE STEP AFTER SAVE
  useEffect(() => {
    if (isSmallLoading.sendDataSent) {
      changeStep();
    }
  }, [isSmallLoading]);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    const currentQuest = IdentificationQuestions()[currentIndex];
    if (currentQuest.effect === 'slideUp') {
      setQuestions(IdentificationQuestions());
      setQuest(IdentificationQuestions()[currentIndex - 1]);
    } else {
      setQuestions(IdentificationQuestions());
      setQuest(IdentificationQuestions()[currentIndex]);
    }
  }, [lang]);

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    reset('Property');
    history.push(`/buyer/${propID}/closing`);
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    if (formValue) {
      const newQuest = [];
      IdentificationQuestions('en', get(formValue, 'location.countryCode', 'CH')).map((quest) => {
        if (quest.condition) {
          let isValid = true;
          quest.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(quest);
        } else {
          newQuest.push(quest);
        }
        return null;
      });
      const checkDiff = diff(quest, newQuest);
      if (Object.keys(checkDiff).length > 0) setQuestions(newQuest);
    }
  }, [formValue]);

  // FUNCTION TO CHANGE THE TITLE ON CHANGING LOCATION
  useEffect(() => {
    if (get(formValue, 'properties.propertyType', null) && get(formValue, 'location.address', null)) {
      const propertyType = get(formValue, 'properties.propertyType', null);
      const pageTitle = titleProperty(formValue.location, propertyType, lang, formValue);
      if (pageTitle && questions[currentIndex].history !== 'createProfile') changeFieldValue('pageTitle', pageTitle);
    }
  }, [get(formValue, 'properties.propertyType', null), formValue.location, lang]);

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex}].toSave`, null)) label = 'Save';
    else if (get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else label = 'Next';
    return label;
  };

  const progressBarCalc = () => {
    let num = 0;
    questions.forEach((item) => {
      if (get(item, 'hideProgress', false) !== true) {
        if (item.conditions) {
          item.conditions.forEach((cond) => {
            const val = get(formValue, cond.name, null);
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
    dataForm.persons[profileId].document = {};
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
    <div id="bodyModalWrapper" className={`withHeader getStarted ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'history', '')}`}>
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
                          <h3 className={`fweight-600 fsize-600 fsize-sm-800 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }
                      <div className={`${quest.className} w-perc-100`}>
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
                      <img src={quest.img} alt={quest.title} className={`${quest.imgMaxWidth ? quest.imgMaxWidth : 'max-w-fix-232'} mb-3`} />
                      <h2
                        className="fadeAnim fsize-600 fsize-sm-700 fweight-600 ta-c"
                        dangerouslySetInnerHTML={{ __html: quest.title }}
                      />
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
                        label="Back to hub"
                        disabled={!checkValidateField()}
                        isLoading={isSmallLoading.sendData}
                        onClick={() => history.push(`/buyer/${propID}/closing`)}
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
                        label={buttonLabel()}
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
                          theme="light"
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
                          label={buttonLabel()}
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

IdentificationFlow.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleDeleteDocument: PropTypes.func.isRequired,
  handleGetActiveSingleDeal: PropTypes.func.isRequired,
  handleMultiUploadDocument: PropTypes.func.isRequired,
  handleSaveClosingIdentification: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  let userType = 'buyer';
  if (typeof window !== 'undefined') userType = (window.location.href).includes('seller') ? 'seller' : 'buyer';
  const initialValues = get(state, `deal.activeSingleDeal.closing.stageIdentification.${userType}`, {});
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
  reset(form) {
    (dispatch(reset(form)));
  },
  handleGetActiveSingleDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleSaveClosingIdentification: bindActionCreators(saveClosingIdentification, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(IdentificationFlow);
