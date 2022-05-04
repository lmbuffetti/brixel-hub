/* eslint-disable array-callback-return */
import { diff } from 'deep-object-diff';
import has from 'lodash/has';
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
} from '@brixel/brixel-components';
import {
  initializeForm,
  MultiFileldsReduxForm,
} from '@brixel/brixel-components/dist/form';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { createPropertyVisitBooking, getActiveSingleProperty } from '../../../actions/PropertyActions';
import { spinnerSmallOff } from '../../../actions/CommonActions';
import { QuestionsList } from '../../../resources/AddShowings';
import 'react-input-range/lib/css/index.css';
import { checkBrowser } from '../../../utils/helpers';
import AddShowings from '../../../images/Showings/Showings.png';

// COMPONENTS

const AddShowingsBuyer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    errorValue,
    formValue,
    handleGetActiveSingleProperty,
    initForm,
    initialValues,
    lang,
  } = props;
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
  const [quest, setQuest] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[0]);
  const [showError, setShowError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState(null);
  // REFS
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  
  useEffect(() => {
    if (activeSingleProperty.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty])
  
  useEffect(() => {
    if (propID && propID !== 'propertyLists' && propID !== activeSingleProperty.id) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
  }, [propID]);
  
  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act) => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      quest.inputs.forEach((input) => {
        let err = get(errorValue, input.name, null);
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
              err = get(errorValue, item, true);
              if (err !== true && err !== false && isValid) isValid = false;
            });
          }
          if (input.name === 'register.ownerType') {
            if (!has(formValue, 'register.ownerType') || get(formValue, 'register.ownerType', '') === null) isValid = false;
          }
          if (input.name === 'register.whenToSell') {
            if (!has(formValue, 'register.whenToSell') || get(formValue, 'register.whenToSell', '') === null) isValid = false;
          } else if (err !== true && err !== false && err !== null && isValid) isValid = false;
        }
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };
  
  const singleStepEl = singleStepRef.current;
  const multiStepSlidesEl = multiStepSlidesRef.current;
  
  const saveData = () => {
  
  };
  
  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex = id;
    const newQuestions = QuestionsList();
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
  
  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act, e, step = 1, skipValidation) => {
    if (e) e.preventDefault();
    const newQuestions = QuestionsList('en', get(formValue, 'location.countryCode', 'CH'));
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
        if (newQuestions[defId].toSave) {
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
          if (act === 'back' && newQuestions[defId + 1].effect === 'slideUp') {
            setQuest(newQuest);
            setCurrentIndex(defId);
          } else {
            setQuest(newQuest);
            setCurrentIndex(defId);
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
  
  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    if (formValue) {
      const newQuest = [];
      QuestionsList('en', get(formValue, 'location.countryCode', 'CH')).map((qst) => {
        if (qst.condition) {
          let isValid = true;
          qst.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(qst);
        } else {
          newQuest.push(qst);
        }
        return null;
      });
      const checkDiff = diff(quest, newQuest);
      if (Object.keys(checkDiff).length > 0) setQuestions(newQuest);
    }
  }, [formValue]);
  
  // FUNCTION TO CLOSE
  const closeWindow = () => {
    history.push(`/buyer/${propID}/property`);
  };
  
  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex + 2}].toSave`, null)) label = 'Back to Hub';
    else if (get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else label = 'Next';
    return label;
  };

  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'history', '')}`}>
      <div
        className={`bodyModal max-w-fix-600 pt-10 container ${questions[currentIndex].effect === 'slideUp' ? 'signUpScreen' : ''} ${get(quest, 'history', '')}`}
      >
        <div className="ov-h ta-c">
          <img className="w-perc-100 max-w-fix-120" src={AddShowings} alt="text-1" />
        </div>
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className="singleStep buyerShowings jc-c">
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && (
                    <div id={`step-${currentIndex}`} className="dis-fl-col a-c flex-wrap">
                      {console.log(quest)}
                      {
                        quest.titleGreen && (
                          <h3 className="txtGreen400 w-perc-100">{quest.titleGreen}</h3>
                        )
                      }
                      {
                        quest.title && (
                          <h3 className={`fweight-600 max-w-fix-408 ta-c fsize-600 fsize-sm-800 m-a ${quest.subtitle ? 'mb-1' : 'mb-5'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }
                      {
                        quest.subtitle && (
                          <p className="mb-5 ta-c txtDark200 w-perc-100 px-3 px-sm-2" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                      }
                      <div className="formWrapper bgWhite brdRadius w-perc-100 shadow-1dp p-6">
                        <MultiFileldsReduxForm
                          form="Showings"
                          className="w-perc-100"
                          disableNextBtn={false}
                          formValue={formValue}
                          inputs={quest.inputs}
                          onClick={() => changeStep()}
                          onCloseGoBack={() => changeStep('back')}
                          onSubmit={() => changeStep()}
                          showSendButton={quest.showSendButton}
                          showErrors={showError}
                          disableDelay={quest.history !== 'createProfile'}
                        />
                      </div>
                    </div>
    
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={`footerAction flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="pos-r">
              <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c">
                {
                  (get(questions, `[${currentIndex - 1}].inputs`, null) || currentIndex === 0) && (
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
                  get(quest, 'history', null) !== 'resume' && (get(quest, 'inputs', []).length > 1 || (get(quest, 'inputs[0].component.name', '') !== 'BrixelRadioButton' || get(quest, 'history', null) === 'propertyType') || action === 'back') && (
                    <BrixelButtonPrimary
                      className={`mr-a ml-5-neg noWrap ${get(quest, 'history', null)}`}
                      disabled={!checkValidateField()}
                      rounded
                      theme="green"
                      label={buttonLabel()}
                      rightIcon="arrow-right-small"
                      onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                      onShowError={() => setShowError(true)}
                    />
                  )
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

AddShowingsBuyer.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const activeSingleCompany = get(state, 'companies.activeSingleCompany', {});
  activeSingleCompany.defaultDialCode = countryPhoneCode.dial_code;
  const initialValues = {};
  return ({
    activeSingleCompany,
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    errorValue: get(state, 'brixelForm.Showings.syncErrors', {}),
    formValue: get(state, 'brixelForm.Showings.values', {}),
    initialValues,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'user.loggedInUser.user.language', ''),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    userLang: get(state, 'user.loggedInUser.language', 'en'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('Showings', value));
  },
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AddShowingsBuyer);
