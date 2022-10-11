/* eslint-disable no-nested-ternary */
import queryString from 'query-string';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelProgressBar,
  BrixelButtonText,
} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {
  MultiFileldsReduxForm,
  initializeForm,
  change,
  reset,
  destroy,
} from '@brixel/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import Cookies from 'universal-cookie';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { titleProperty } from '../../utils/titleCreation';
import { setCookie } from '../../utils/helpers';
import { QuestionsList } from '../../resources/Companies/TermsCondition/TermsCondition';
import { spinnerOff, spinnerOn } from '../../actions/CommonActions';
import { doLogin, validateUser, saveActiveSingleUser } from '../../actions/UserActions';

const cookie = new Cookies();

const TermsCondition = (props) => {
  const isOpenTransifex = cookie.get('transifex_sidebar');
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    changeFieldValue,
    company,
    destroyForm,
    errorValue,
    formValue,
    handleGetActiveSingleCompany,
    handleSaveActiveSingleUser,
    handleReset,
    handleSpinnerOff,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  const companyStub = get(match, 'companyStub', null);
  const userType = get(match, 'userType', null);
  // STATE
  const isBuyer = userType === 'buyer';
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang, activeSingleCompany, isBuyer));
  const [redirectURL, setRedirectURL] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState(QuestionsList(lang, activeSingleCompany, isBuyer)[0]);
  // const [roomValue, setRoomValue] = useState('');
  
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);
  
  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    const parmsURL = queryString.parse(get(history, 'location.search', ''));
    setRedirectURL(get(parmsURL, 'url', null));
    history.push(`/termsConditionFlow/${companyStub}/${userType}`);
    return () => destroyForm();
  }, []);
  
  useEffect(() => {
    
    if(get(isSmallLoading, 'sentData', null)) {
      history.push(redirectURL || '/sell');
    }
  }, [get(isSmallLoading, 'sentData', null)]);
  
  
  
  // FUNCTION TO SAVE DATA
  const saveData = async (action = '') => {
    const data = {
      smallLoader: 'sendData',
      id: loggedInUser.id,
    }
    if (action === 'accept' && activeSingleCompany.stub === 'ubs') {
      data.termsUBS = true;
    }
    if (action === 'accept' && activeSingleCompany.stub === 'baloise') {
      const baloiseInfo = get(formValue, 'baloiseInfo', '');
      if (baloiseInfo === 'baloiseInsurance' || baloiseInfo === 'both') data.termsBaloiseInsurance = true;
      if (baloiseInfo === 'baloiseBank' || baloiseInfo === 'both') data.termsBaloiseBank = true;
    }
    handleSaveActiveSingleUser(data);
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
        } else {
          if (err !== true && err !== false && isValid) isValid = false;
        }
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };
  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act, e, step = 1, skipValidation) => {
    if (e) e.preventDefault();
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= step;
      setCurrentIndex(newIndex);
    } else {
      if (!checkValidateField() && !skipValidation) {
        setShowError(true);
        return false;
      }
      newIndex += step;
      if (questions[newIndex].toSave) {
        saveData('accept');
      } else {
        setCurrentIndex(newIndex);
      }
    }
  };
  
  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    handleGetActiveSingleCompany({ stub: companyStub });
  }, []);
  
  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    if (company.stub) {
      setQuestions(QuestionsList(lang, activeSingleCompany, isBuyer));
      setQuest(QuestionsList(lang, activeSingleCompany, isBuyer)[currentIndex]);
    }
  }, [lang, company.stub]);
  
  useEffect(() => {
    setQuest(questions[currentIndex]);
  }, [currentIndex, questions]);
  
  // FUNCTION TO CLOSE
  const closeWindow = () => {
    handleReset('Property');
    history.push(`/${propID}/home`);
  };
  
  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    if (formValue && company.stub) {
      const newQuest = [];
      QuestionsList(lang, activeSingleCompany, isBuyer).map((quest) => {
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
      setQuestions(newQuest);
      setQuest(newQuest[currentIndex]);
    }
  }, [formValue]);
  
  // FUNCTION TO CHANGE THE TITLE ON CHANGING LOCATION
  useEffect(() => {
    if (get(formValue, 'properties.propertyType', null) && get(formValue, 'location.address', null)) {
      const propertyType = get(formValue, 'properties.propertyType', null);
      const pageTitle = titleProperty(formValue.location, propertyType, lang, formValue);
      if (pageTitle && questions[currentIndex].history !== 'createProfile') changeFieldValue('pageTitle', pageTitle);
    }
  }, [get(formValue, 'properties.propertyType', null), get(formValue, 'location.city', null), lang]);
  
  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      setCookie('brixelStubCompany', company.stub);
      changeFieldValue('company', company.stub);
    }
    if (get(formValue, 'properties.propertyType', null) === null) initForm(initialValues);
  }, [get(company, 'id', null)]);
  
  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex + 1}].toSave`, null) && checkValidateField()) label = 'Accept';
    else if (get(quest, 'history', '') === 'baloiseInfo') label = 'Continue';
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
  
  // REMOVE FADEIN CLASS TO INITIATE ANIMATION FOR EVERY STEP
  const getStartedEl = document.querySelector('.getStarted');
  useEffect(() => {
    setTimeout(() => {
      if (getStartedEl) getStartedEl.classList.remove('slideUpTrans');
    }, 350);
  }, [quest]);
  
  if (!formValue.id && !company.stub) return (<div />);
  
  return (
    <>
      <div id="bodyModalWrapper" className={`withHeader getStarted slideUpTrans ${get(quest, 'background', '')} ${get(quest, 'history', '')}  ${isOpenTransifex ? '' : 'notranslate'}`}>
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
        
        <div
          className={`bodyModal container ${currentIndex ? '' : ''} ${get(quest, 'history', '')}`}
        >
          
          <form
            id="multiStepForm"
            autoComplete="off"
            className="interactive dis-fl-col jc-b"
            onSubmit={(e) => changeStep(null, e)}
          >
            <div ref={multiStepSlidesRef} className="multiStepSlides">
              <div ref={singleStepRef} className="singleStep pt-5 jc-c ">
                <div className="subcontainer m-a">
                  {
                    get(quest, 'inputs', null) && (
                      <div id={`step-${currentIndex}`} className="dis-fl-col a-c flex-wrap">
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
                        <MultiFileldsReduxForm
                          form="GetStarted"
                          className="w-perc-100"
                          disableNextBtn={false}
                          formValue={formValue}
                          inputs={quest.inputs}
                          onClick={() => changeStep()}
                          onCloseGoBack={() => changeStep('back')}
                          onClickDisabled={!checkValidateField()}
                          onSubmit={() => changeStep()}
                          showSendButton={quest.showSendButton}
                          showErrors={showError}
                          disableDelay={quest.history !== 'createProfile'}
                          skipPhone
                        />
                      </div>
                    
                    )
                  }
                  {
                    get(quest, 'cardType', null) === 'loadComponent' && (
                      React.createElement(
                        quest.component,
                        {
                          formName: 'GetStarted',
                          initialValue: formValue,
                          ...quest,
                          onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()),
                        },
                      )
                    )
                  }
                  {
                    (get(quest, 'cardType', null) === 'card') && (
                      <div className="scaleAnim ta-c">
                        <img loading="lazy" src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
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
                    (quest.bulletPoints || quest.text) && (
                      <>
                        {
                          quest.title && (
                            <h3 className={`fweight-600 max-w-fix-600 ta-c fsize-600 fsize-sm-800 m-a ${quest.subtitle ? 'mb-1' : 'mb-5'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                          )
                        }
                        <div
                          className={`brdRadius bgWhite ml-a mr-a px-2 px-sm-6 ${quest.bulletPoints ? 'dis-fl-col dis-fl-row-lg bulletPointsStep jc-b py-2 py-lg-0 max-w-fix-912' : 'max-w-fix-752 pt-3 pb-6'}`}
                        >
                          {
                            quest.text.map((text, i) => (
                              <div
                                className={quest.bulletPoints ? 'w-perc-lg-55 py-lg-3 pr-lg-4' : ''}
                                key={i.toString()}
                              >
                                <span className="fweight-600 my-3 dis-b">{text.title}</span>
                                {
                                  text.subtitle && (
                                    <p className="fsize-300 fweight-500 mb-1 dis-b">{text.subtitle}</p>
                                  )
                                }
                                <p className="fsize-300 mb-2 dis-b" dangerouslySetInnerHTML={{ __html: text.description }} />
                              </div>
                            ))
                          }
                          {
                            quest.bulletPoints && (
                              <div className="brdSmallLeft-lg brdAltGrey100 w-perc-lg-45 pl-lg-5 py-lg-3 max-w-fix-lg-352">
                                <span className="my-3 dis-b">{quest.bulletPoints.title}</span>
                                <ul className="">
                                  {
                                    quest.bulletPoints.description.map((bullet,k) => (
                                      <li
                                        className="mb-2"
                                        key={k.toString()}
                                      >
                                        {bullet}
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>
                            )
                          }
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
            <div
              className={`footerAction mb-3 flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
            >
              <div className="pos-r">
                <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c">
                  {
                    currentIndex > 0 && (
                      <BrixelButtonIcon
                        className="backBtn pos-a-sm x-l"
                        icon="arrow-left-small"
                        onClick={() => changeStep('back')}
                        theme="light"
                        secondary
                      />
                    )
                  }
                  <BrixelButtonPrimary
                    className={`ml-a mr-a noWrap ${get(quest, 'history', null)}`}
                    disabled={!checkValidateField()}
                    rounded
                    theme="green"
                    isLoading={isSmallLoading.sendData}
                    label={buttonLabel()}
                    onClick={() => changeStep()}
                    onShowError={() => setShowError(true)}
                  />
                  
                  <BrixelButtonText
                    theme="light"
                    className="pos-a-sm x-r"
                    label={translateTo('Skip', lang)}
                    onClick={() => saveData('skip')}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

TermsCondition.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
};

TermsCondition.defaultProps = {
  isTest: false,
  lang: 'en',
};

const mapStateToProps = (state) => {
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.GetStarted', null),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  destroyForm() {
    dispatch(destroy('GetStarted'));
  },
  initForm(value) {
    dispatch(initializeForm('GetStarted', value));
  },
  handleReset(form) {
    (dispatch(reset(form)));
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TermsCondition);
