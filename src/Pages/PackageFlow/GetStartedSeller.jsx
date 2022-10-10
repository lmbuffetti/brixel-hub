/* eslint-disable no-nested-ternary */
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
  DataByCountry,
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
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import isArray from 'lodash/isArray';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { titleProperty } from '../../utils/titleCreation';
import { calcPercentageFacts, setCookie, checkBrowser } from '../../utils/helpers';
import { QuestionsList } from '../../resources/Flows/onBoardingSeller';
import { spinnerOff, spinnerOn } from '../../actions/CommonActions';
import { doLogin, validateUser, saveActiveSingleUser } from '../../actions/UserActions';

const cookie = new Cookies();

const GetStartedSeller = (props) => {
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
    handleCreateActiveSingleProperty,
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleSpinnerOff,
    handleValidateUser,
    handleSpinnerOn,
    initForm,
    initialValues,
    isLoading,
    isTest,
    lang,
    loggedInUser,
    handleReset,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [action, setAction] = useState('next');
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[0]);
  // const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  const companyStub = get(match, 'companyStub', null);

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm();
  }, []);

  const getCurrency = () => {
    const result = {};
    if (get(formValue, 'location.countryCode', '')) {
      const currency = DataByCountry(get(formValue, 'location.countryCode', ''));
      result.currency = currency || 'CHF';
      changeFieldValue('price.currency', result.currency);
    }
    return result;
  };

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    if (isLoading) return false;
    const dataForm = cloneDeep(formValue);
    const dataFormAnswer = cloneDeep(formValue);
    setCookie('brixelSplashHome', 'sellerWelcome');
    const { login, register, company } = dataForm;
    // delete dataForm.login;
    // changeFieldValue('register.password', '');
    delete dataFormAnswer.register.password;
    // delete dataForm.company;
    // BROWSER AND META USER DATA
    const metaUserData = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in navigator) {
      metaUserData[key] = navigator[key];
    }
    if (dataFormAnswer.properties.propertyType === 'Building land' || dataFormAnswer.properties.propertyType === 'Commercial') {
      dataFormAnswer.properties.typology.bedrooms = 0;
    }
    dataFormAnswer.properties.typology.bathrooms = 0;
    dataFormAnswer.properties.parking = {
      garage: 0,
      outside: 0,
      underground: 0,
    };
    // PROPERTY DATA
    delete dataFormAnswer.login;
    const data = {
      ...dataFormAnswer,
      packageFlowProcess: {
        answers: dataFormAnswer,
        rewardScreenData: {},
        metaUser: metaUserData,
      },
      ownerType: 'seller',
      purpose: 'seller',
      preMarketVisible: true,
      language: lang || 'en',
      title: formValue.pageTitle,
      status: 'on-request',
      listed: false,
      active: true,
      price: get(formValue, 'price', getCurrency()),
      createEstimation: true,
      published: false,
      addProperty: true,
      // redirectToUrl: '/sell',
      company,
      extraLoading: true,
    };
    if (company !== 'baloise' && company !== 'ubs') set(data, 'redirectToUrl', '/packageFlow/:pageID/welcomeSeller');
    else set(data, 'redirectToUrl', '/:pageID/home');
    if (formValue.pageID) data.id = formValue.pageID;
    const page = get(formValue, 'signupScreen', null);
    handleSpinnerOn();
    // IF USER IS LOGGED IN SAVE DIRECTLY THE PAGE
    if (formValue.owner && get(data, 'price.currency', null)) {
      data.owner = get(loggedInUser, 'user.id', '');
      // DISPATCH TO SAVE THE PROPERTY
      await handleCreateActiveSingleProperty(data);
    } else if (page === 'login') {
      changeFieldValue('register.email', login.email);
      // IF USER DO THE LOG IN, DO THE LOGIN AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      data.user = {
        username: login.email.toLowerCase(),
        password: login.password,
      };
      // DISPATCH TO DO LOGIN
      await handleDoLogin(data);
    } else {
      changeFieldValue('login.email', register.email);
      // IF USER DO THE SIGN UP, DO THE REGISTRATION AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      if (activeSingleCompany.stub === 'baloise' || activeSingleCompany.stub === 'ubs') set(data, 'redirectToUrl', `/termsConditionFlow/${activeSingleCompany.stub}/seller?url=/:pageID/home`);
      data.user = {
        ...register,
        email: register.email.toLowerCase(),
        acceptTerms: get(register, 'privacy[0]', true),
        acceptMarketing: get(register, 'acceptMarketing[0]', false),
        name: get(formValue, 'register.name', ''),
        userType: 'seller',
        signupAccept: true,
        signupChannel: get(formValue, 'channel', 'default'),
        signupProduct: null,
        language: lang || 'en',
        createUser: true,
        company,
        ignoreEmail: false,
        seller: true,
        redirectTo: {
          pathname: '/packageFlow/getStarted/success',
          state: { hideClose: true },
        },
      };
      // DISPATCH TO DO REGISTRATION USER
      await handleValidateUser(data);
    }
  };

  useEffect(() => {
    if (get(loggedInUser, 'user.id', null)) changeFieldValue('owner', get(loggedInUser, 'user.id', null));
  }, [get(loggedInUser, 'user.id', null)]);

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    if (company.stub) {
      let newIndex = id;
      const newQuestions = QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'));
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
    }
    return null;
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
          if (input.name === 'profile') {
            const page = get(formValue, 'signupScreen', null);
            field = ['register.email', 'register.firstName', 'register.lastName', 'register.password', 'register.privacy'];
            if (page === 'login') {
              field = ['login.email', 'login.password'];
            }
            field.forEach((item) => {
              const err = get(errorValue, item, true);
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

  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act, e, step = 1, skipValidation) => {
    if (e) e.preventDefault();
    const newQuestions = questions;
    let newIndex = currentIndex;
    setOldIndex(currentIndex);
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
      history.push(`/packageFlow/${company.stub}`);
    } else {
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
              } else if (getCurStep && getCurStep.querySelector('input[type="search"]')) {
                getCurStep.querySelector('input[type="search"]').focus();
              }
              // cleanup
              if (fakeInput) fakeInput.remove();
            }, 500);
          }
          if (newQuestions[defId].history) {
            history.push({
              pathname: `/packageFlow/getStarted/${company.stub}/${newQuestions[defId].history}`,
              state: get(history, 'location.state', {}),
            });
          }
          if (checkBrowser() > 0) {
            if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
            if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
          } else {
            if (singleStepEl && typeof singleStepEl.scrollTo === 'function') singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
            if (multiStepSlidesEl && typeof multiStepSlidesEl.scrollTo === 'function') multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    }
    return null;
  };

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    setOldIndex(currentIndex);
    if (company.stub) {
      const newQuest = QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'));
      if (newQuest[currentIndex].inputs && newQuest[currentIndex].inputs.length === 1 && get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex && !newQuest[currentIndex].noAutoStepForward) {
        changeStep('next', null, 1, true);
      }
      const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
      if (calcPercentageFacts('GetStarted').calcPerc !== calcPercentageFacts('GetStarted').savedPerc && inputSheet.totalComplete !== calcPercentageFacts('GetStarted').calcPerc) {
        inputSheet.totalComplete = calcPercentageFacts('GetStarted').calcPerc;
        changeFieldValue('inputSheet', inputSheet);
      }
    }
  }, [formValue]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    let defComp = get(companyByUrl, 'company', companyCookie);
    if (companyStub && companyStub !== get(questions, '[0].history', null)) defComp = companyStub;
    if (defComp) {
      handleGetActiveSingleCompany({ stub: defComp || 'default' });
      setCookie('brixelStubCompany', defComp);
      changeFieldValue('company', defComp);
      history.push(`/packageFlow/getStarted/${defComp}/${get(questions, '[0].history', null)}`);
    } else if (!isTest) {
      const companyUser = get(loggedInUser, 'users.company.stub', null);
      if (companyUser) handleGetActiveSingleCompany({ stub: companyUser });
      else handleGetActiveSingleCompany({ stub: 'default' });
      changeFieldValue('location.countryCode', 'all');
    }
    if (get(companyByUrl, 'channel', channelCookie)) {
      const defChan = get(companyByUrl, 'channel', channelCookie);
      changeFieldValue('channel', defChan);
      setCookie('brixelChannelSignup', defChan);
    } else {
      changeFieldValue('channel', channelCookie);
    }
  }, []);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    if (company.stub) {
      setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
      setQuest(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex]);
    }
  }, [lang, company.stub]);

  useEffect(() => {
    setQuest(questions[currentIndex]);
  }, [currentIndex, questions]);


  // ON CHANGE STEP (currentIndex is different for each step) CHANGE THE isEnter (used for enter effect) AND LOAD COMPANY DATA IF countryCode CHANGE
  useEffect(() => {
    if (currentIndex > 2) {
      const countryCodeLocation = get(formValue, 'location.countryCode', '');
      const countryCodeCompany = get(company, 'country.code', '');
      if (countryCodeCompany !== countryCodeLocation) {
        let newCountryStub = '';
        if (countryCodeLocation === 'CH') newCountryStub = 'brixel_zurich';
        if (countryCodeLocation === 'PT') newCountryStub = 'brixel_portugal';
        if (countryCodeLocation === 'DE') newCountryStub = 'brixel_germany';
        handleGetActiveSingleCompany({ stub: newCountryStub });
      }
    }
  }, [get(formValue, 'location.countryCode', '')]);

  // FUNCTION TO CALC THE LIVING SPACE FROM GROSS AREA
  useEffect(() => {
    if (get(formValue, 'properties.typology.grossArea.value', 0) > 0) {
      const livingSpace = Math.round(get(formValue, 'properties.typology.grossArea.value', 0) * 0.85);
      changeFieldValue('properties.typology.livingArea.value', livingSpace);
    }
    if (get(formValue, 'properties.typology.floorSpace.value', 0) > 0) {
      changeFieldValue('properties.typology.livingArea.value', get(formValue, 'properties.typology.floorSpace.value', 0));
    }
    if (get(formValue, 'properties.typology.lotArea.value', 0) > 0) {
      changeFieldValue('properties.typology.livingArea.value', get(formValue, 'properties.typology.lotArea.value', 0));
    }
    if ((get(formValue, 'properties.propertyType', null) === 'Commercial') && (formValue.location.countryCode === 'PT')) {
      changeFieldValue('properties.typology.grossArea.value', get(formValue, 'properties.typology.floorSpace.value', 0));
      const livingSpace = Math.round(get(formValue, 'properties.typology.grossArea.value', 0) * 0.85);
      changeFieldValue('properties.typology.livingArea.value', livingSpace);
    }
  }, [get(formValue, 'properties.typology.grossArea.value', 0), get(formValue, 'properties.typology.floorSpace.value', 0), get(formValue, 'properties.typology.lotArea.value', 0)]);

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    handleReset('Property');
    history.push(`/${propID}/home`);
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    if (formValue && company.stub) {
      const newQuest = [];
      QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')).map((quest) => {
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
    if (get(questions, `[${currentIndex + 2}].toSave`, null)) label = 'Save';
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
  useEffect(() => {
    setTimeout(() => {
      const getStartedEl = document.querySelector('.getStarted');
      if (getStartedEl && getStartedEl.classList) getStartedEl.classList.remove('slideUpTrans');
    }, 350);
  }, [quest]);

  if (!formValue.pageID && !company.stub) return (<div />);

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
            noValidate
            id="multiStepForm"
            autoComplete="off"
            className="dis-fl-col jc-b"
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
                </div>
              </div>
            </div>
            {
              get(quest, 'history', null) !== 'createProfile' && (
                <div
                  className={`footerAction flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
                >
                  <div className="pos-r">
                    <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c">
                      {
                        ((currentIndex !== questions.length - 2) && get(quest, 'history', '') !== 'baloiseInfo') && (
                          <BrixelButtonIcon
                            className="backBtn pos-a x-l"
                            icon="arrow-left-small"
                            onClick={() => changeStep('back')}
                            theme="light"
                            secondary
                          />
                        )
                      }
                      {
                        get(quest, 'history', null) !== 'resume' && (get(quest, 'inputs', []).length > 1 || (get(quest, 'inputs[0].component.name', '') !== 'BrixelRadioButton' || get(quest, 'history', null) === 'propertyType' || get(quest, 'history', null) === 'baloiseInfo') || action === 'back') && (
                          <BrixelButtonPrimary
                            className={`mr-a ml-a noWrap ${get(quest, 'history', null)}`}
                            rounded
                            theme="green"
                            label={translateTo(buttonLabel(), lang)}
                            rightIcon="arrow-right-small"
                            onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                            onShowError={() => setShowError(true)}
                            type="submit"
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
    </>
  );
};

GetStartedSeller.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateActiveSingleProperty: PropTypes.func.isRequired,
  handleDoLogin: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleSpinnerOn: PropTypes.func.isRequired,
  handleValidateUser: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isTest: PropTypes.bool,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
};

GetStartedSeller.defaultProps = {
  isTest: false,
  lang: 'en',
};

const mapStateToProps = (state, ownProps) => {
  const urlSearch = queryString.parse(get(ownProps.history, 'location.search', ''));
  const channelCookie = cookie.get('brixelChannelSignup') || null;
  const channel = get(urlSearch, 'channel', channelCookie);
  const propertyType = get(urlSearch, 'propertyType', null);
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'PT');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    initialValues: ownProps.testValue ? ownProps.testValue : {
      ...get(state, 'brixelForm.GetStarted.initialValues', {}),
      channel,
      pageID: get(state, 'brixelForm.GetStarted.values.pageID', null),
      changeCountry: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      company: get(state, 'companies.activeSingleCompany.stub', null),
      // price: {
      //   currency: get(state, 'companies.activeSingleCompany.country.currency', null),
      // },
      location: {
        ...get(state, 'brixelForm.GetStarted.values.location', { }),
        countryCode: get(state, 'companies.activeSingleCompany.country.code', 'PT'),
      },
      login: {},
      owner: get(state, 'user.loggedInUser.user.id', null),
      properties: {
        propertyType,
        typology: {
          bathrooms: 0,
          bedrooms: 3,
          livingArea: {
            unit: 'm2',
          },
          grossArea: {
            unit: 'm2',
          },
          floorSpace: {
            unit: 'm2',
          },
        },
        parking: {
          garage: 0,
          outside: 0,
          underground: 0,
        },
      },
      register: {
        phone: {
          prefix: countryPhoneCode.dial_code,
          number: '',
        },
      },
      signup: get(state, 'user.loggedInUser.user.id', null) !== null,
    },
    isLoading: get(state, 'common.isLoading', 0) > 0,
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
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
)(GetStartedSeller);
