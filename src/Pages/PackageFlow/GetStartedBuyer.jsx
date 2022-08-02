/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useRef, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelProgressBar,
  translateTo,
} from '@brixel/brixel-components';
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
import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { setCookie, checkBrowser } from '../../utils/helpers';
import { QuestionsList } from '../../resources/Flows/onBoardingBuyer';
import { spinnerOff, spinnerOn } from '../../actions/CommonActions';
import { doLogin, validateUser } from '../../actions/UserActions';
import { createUserSearchProfile } from '../../actions/SearchProfileActions';

const cookie = new Cookies();

const GetStartedBuyer = (props) => {
  const isOpenTransifex = cookie.get('transifex_sidebar');
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    changeFieldValue,
    company,
    destroyForm,
    errorValue,
    formValue,
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleCreateSearchProfile,
    handleSpinnerOff,
    handleSpinnerOn,
    handleValidateUser,
    initForm,
    initialValues,
    lang,
    loggedInUser,
    handleReset,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
  const [progressBar, setProgressBar] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState(0);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[0]);
  const [isEnter, setIsEnter] = useState(true);
  const [showError, setShowError] = useState(false);
  
  const companyStub = get(match, 'companyStub', null);

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm();
  }, []);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    const dataForm = cloneDeep(formValue);
    const dataFormAnswer = cloneDeep(formValue);
    setCookie('brixelSplashHome', 'buyerWelcome');
    const { login, register, company } = dataForm;
    // delete dataForm.login;
    changeFieldValue('register.password', '');
    delete dataFormAnswer.register.password;
    // delete dataForm.company;
    // BROWSER AND META USER DATA
    const metaUserData = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in navigator) {
      metaUserData[key] = navigator[key];
    }
    const dataSearchProfile = {
      characteristics: get(dataFormAnswer, 'characteristics', {}),
      location: get(dataFormAnswer, 'locations', {}),
      profile: get(dataFormAnswer, 'profile', {}),
      finance: get(dataFormAnswer, 'finance', {}),
    };
    // PROPERTY DATA
    const data = {
      dataSearchProfile,
      addSearchProfile: true,
      redirectToUserFlow: false,
      redirectToUrl: '/buy',
      extraLoading: true,
      company,
    };
    const page = get(formValue, 'signupScreen', null);
    // IF USER IS LOGGED IN SAVE DIRECTLY THE PAGE
    handleSpinnerOn();
    if (formValue.owner) {
      data.owner = get(loggedInUser, 'user.id', '');
      // DISPATCH TO SAVE THE PROPERTY
      data.dataSearchProfile.user = get(loggedInUser, 'user.id', '');
      await handleCreateSearchProfile(data);
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
      data.user = {
        ...register,
        email: register.email.toLowerCase(),
        acceptTerms: get(register, 'privacy[0]', true),
        acceptMarketing: get(register, 'acceptMarketing[0]', false),
        name: `${register.firstName} ${get(register, 'lastName', '')}`,
        userType: 'buyer',
        signupAccept: true,
        buyer: true,
        signupChannel: get(formValue, 'channel', 'default'),
        signupProduct: null,
        language: lang || 'en',
        createUser: true,
        company,
        ignoreEmail: false,
        redirectTo: {
          pathname: '/packageFlow/getstartedBuyer/success',
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
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
          });
        } else if (input.validation) {
          // const getRegField = get(registeredFields
          let field;
          if (input.name === 'profileUaer') {
            const page = get(formValue, 'signupScreen', null);
            field = ['register.email', 'register.firstName', 'register.lastName', 'register.password', 'register.privacy'];
            if (page === 'login') {
              field = ['login.email', 'login.password'];
            }
            field.forEach((item) => {
              const err = get(errorValue, item, true);
              if (err !== true && err !== false && isValid) isValid = false;
            });
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
    let newIndex = currentIndex;
    setOldIndex(currentIndex);
    setShowError(false);
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
            } else if (getCurStep && getCurStep.querySelector('input[type="search"]')) {
              getCurStep.querySelector('input[type="search"]').focus();
            }
            // cleanup
            if (fakeInput) fakeInput.remove();
          }, 500);
        }
        if (questions[defId].history) {
          history.push({
            pathname: `/packageFlow/getStartedBuyer/${company.stub}${questions[defId].history}`,
            state: get(history, 'location.state', {}),
          });
        }
        const getOnlyQuest = questions.filter((item) => item.inputs);
        setProgressBar((defId * 100) / getOnlyQuest.length);
        if (checkBrowser() > 0) {
          if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
          if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
        } else {
          if (singleStepEl && singleStepEl.scrollTo) singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
          if (multiStepSlidesEl && multiStepSlidesEl.scrollTo) multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
    return null;
  };

  // IF THE URL IS SUCCESS (SUCCESS CREATE USER) REDIRECT TO SECOND PART
  useEffect(() => {
    if (get(history, 'location.pathname', '').includes('success') && questions[currentIndex + 1]) {
      setTimeout(() => {
        changeStep('next', null, 2);
      }, 500);
    }
  }, [get(history, 'location', null)]);
  
  useEffect(() => {
    if (company.stub) {
      history.push({
        pathname: `/packageFlow/getStarted/${company.stub}/${questions[0].history}`,
        state: {},
      });
    }
  }, [company.stub]);
  
  
  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', companyStub));
    const companyCookie = companyStub || cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({ stub: defComp || 'default' });
      setCookie('brixelStubCompany', defComp);
    } else {
      handleGetActiveSingleCompany({ stub: 'default' });
      // changeFieldValue('location.countryCode', 'all');`
    }
    if (get(companyByUrl, 'channel', channelCookie)) {
      const defChan = get(companyByUrl, 'channel', channelCookie);
      changeFieldValue('channel', defChan);
      setCookie('brixelChannelSignup', defChan);
    } else {
      changeFieldValue('channel', channelCookie);
    }
    const getCurrentUrl = last(history.location.pathname.split('/'));
    if (getCurrentUrl !== questions[0].history || get(companyByUrl, 'company', null)) {
      history.push({
        pathname: `/packageFlow/getstartedBuyer/${get(companyByUrl, 'company', company.stub)}/${questions[0].history}`,
        state: {},
      });
    }
  }, []);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    const currentQuest = QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex];
    if (currentQuest.effect === 'slideUp') {
      setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
      setQuest(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex - 1]);
    } else {
      setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
      setQuest(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex]);
    }
  }, [lang]);

  // SKIP FIRST STEP IF PROPERTY TYPE EXISTS - by url param
  useEffect(() => {
    if (get(initialValues, 'properties.propertyType', null)) {
      // changeStep();
    }
  }, [initialValues]);

  // ON CHANGE STEP (currentIndex is different for each step) CHANGE THE isEnter (used for enter effect) AND LOAD COMPANY DATA IF countryCode CHANGE
  useEffect(() => {
    setIsEnter(true);
    if (get(questions, `[${currentIndex - 1}].history`, null) === 'locationInput') {
      const countryCodeLocation = get(formValue, 'locations[0].countryCode', '');
      const countryCodeCompany = get(company, 'country.code', '');
      if (countryCodeCompany !== countryCodeLocation) {
        let newCountryStub = '';
        if (countryCodeLocation === 'CH') newCountryStub = 'brixel_zurich';
        else if (countryCodeLocation === 'PT') newCountryStub = 'brixel_portugal';
        else if (countryCodeLocation === 'DE') newCountryStub = 'brixel_germany';
        else {
          changeFieldValue('finance.currency', 'EUR');
        }
        handleGetActiveSingleCompany({ stub: newCountryStub });
      }
    }
  }, [currentIndex]);

  // FUNCTION to MULTIPLY ROOMS IN BACKGROUND
  /* useEffect(() => {
    let roomValue = get(formValue, 'properties.typology.bedrooms', 2);
    let bgSize = 500
    bgSize = bgSize / roomValue;

    setRoomValue(bgSize+ 'vw');

  }, [get(formValue, 'properties.typology.bedrooms', 2)]); */

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    handleReset('Property');
    // history.push('/buy');
    history.push('/buy');
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    setOldIndex(currentIndex);
    const newQuest = [];
    if (formValue) {
      QuestionsList('en', get(formValue, 'location.countryCode', 'CH')).map((quest) => {
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
    }
    if (newQuest[currentIndex].inputs && newQuest[currentIndex].inputs.length === 1 && get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex) {
      changeStep('next', null, 1, true);
    }
  }, [formValue]);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      const getLang = cookie.get('brixelLang');
      const companyCountry = get(company, 'country.code', 'CH');
      changeFieldValue('location.countryCode', companyCountry);
      setCookie('brixelStubCompany', company.stub);
      changeFieldValue('company', company.stub);
      changeFieldValue('finance.currency', get(company, 'country.currency', 'CHF'));
      changeFieldValue('price.currency', get(company, 'country.currency', 'CHF'));
      setQuestions(QuestionsList(getLang, companyCountry));
      setQuest(QuestionsList(getLang, companyCountry)[currentIndex]);
      const companyCountryCode = get(company, 'country.code', 'CH');
      const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
      changeFieldValue('register.phone.prefix', countryPhoneCode.dial_code);
    }
    if (get(formValue, 'locations', []).length === 0) initForm(initialValues);
  }, [get(company, 'id', null)]);

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex + 1}].toSave`, null)) label = 'Save';
    else if (currentIndex === 0) label = 'Next';
    else if (get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else label = 'Next';
    return label;
  };

  // REMOVE FADEIN CLASS TO INITIATE ANIMATION FOR EVERY STEP
  const getStartedEl = document.querySelector('.getStarted');
  useEffect(() => {
    setTimeout(() => {
      if (getStartedEl) getStartedEl.classList.remove('slideUpTrans');
    }, 350);
  }, [quest]);

  return (
    <>
      <div id="bodyModalWrapper" className={`withHeader getStarted slideUpTrans ${get(quest, 'background', '')} ${get(quest, 'history', '')}  ${isOpenTransifex ? '' : 'notranslate'}`}>
        {
          (get(quest, 'inputs', null) && get(quest, 'history', null) !== 'createProfile') && get(quest, 'history', null) !== 'resume' && (
            <div className="pos-r">
              <BrixelProgressBar
                large
                classProgressBar="container"
                className="brdRadius"
                saturation={500}
                color="green"
                barBackground="light"
                backgroundSaturation={200}
                progressValue={progressBar}
              />
            </div>
          )
        }

        <div
          className={`bodyModal container ${get(quest, 'history', '')}`}
        >

          <form
            id="multiStepForm"
            autoComplete="off"
            className={`interactive dis-fl-col jc-b`}
            onSubmit={(e) => changeStep(null, e)}
          >
            <div ref={multiStepSlidesRef} className="multiStepSlides">
              <div ref={singleStepRef} className={`singleStep pt-5 jc-c`}>
                <div className="subcontainer m-a">
                  {
                    get(quest, 'inputs', null) && (
                      <div id={`step-${currentIndex}`} className={`dis-fl-col flex-wrap ${questions[currentIndex].effect} ${questions[currentIndex].effect === 'slideUp' ? 'activeQuestBack' : ''}`}>
                        {
                          quest.titleGreen && (
                            <h3 className="txtGreen400 w-perc-100">{quest.titleGreen}</h3>
                          )
                        }
                        {
                          quest.title && (
                            <h3 className={`fweight-600 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-5'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                          )
                        }
                        {
                          quest.subtitle && (
                            <p className="mb-5 ta-c txtDark200 w-perc-100 px-3 px-sm-2" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                        }
                        <div className={`${quest.className} w-perc-100`}>
                          <MultiFileldsReduxForm
                            form="GetStarted"
                            disableNextBtn={false}
                            formValue={formValue}
                            inputs={quest.inputs}
                            onClick={() => changeStep()}
                            onCloseGoBack={() => changeStep('back')}
                            onClickDisabled={!checkValidateField()}
                            onSubmit={() => changeStep()}
                            showSendButton
                            showErrors={showError}
                            disableDelay={quest.history !== 'createProfile'}
                            skipPhone
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
                        <img src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
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
                    get(quest, 'history', null) === 'resume' && (
                      <div className="max-w-fix-344 m-a">
                        <BrixelButtonPrimary
                          className={`mt-3 m-a noWrap ${quest.history}`}
                          rounded
                          theme="green"
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
                        (get(quest, 'inputs', []).length > 1 || get(quest, 'inputs[0].component.name', '') !== 'BrixelRadioButton') && (
                          <>
                            {
                              buttonLabel().toLowerCase() === 'skip' ? (
                                <BrixelButtonSecondary
                                  className={`noWrap mr-a ml-5-neg ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                  disabled={!checkValidateField()}
                                  saturation={400}
                                  theme="green"
                                  rounded
                                  label={translateTo(buttonLabel())}
                                  rightIcon="arrow-right-small"
                                  onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                                />
                              ) : (
                                <BrixelButtonPrimary
                                  className={`mr-a ml-5-neg noWrap ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                  disabled={!checkValidateField()}
                                  rounded
                                  theme="green"
                                  label={translateTo(buttonLabel())}
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
                  </div>
                </div>
              )
            }
          </form>
        </div>
        {/* signup flow */}
        {
          questions[currentIndex].effect === 'slideUp' && (
            <div className="signUpContainer">
              {
                questions[currentIndex] && questions[currentIndex].inputs && (
                  <div id={`step-${currentIndex}slideUp`} className={`dis-f flex-wrap slideUp ${isEnter ? 'slide-enter-down' : ''}`}>
                    {
                      questions[currentIndex].titleGreen && (
                        <h3 className="txtGreen400 w-perc-100">{questions[currentIndex].titleGreen}</h3>
                      )
                    }
                    {
                      questions[currentIndex].title && (
                        <h3 className={`${questions[currentIndex].subtitle ? 'mb-1' : 'mb-5'} w-perc-100`}>{questions[currentIndex].title}</h3>
                      )
                    }
                    {
                      questions[currentIndex].subtitle && (
                        <p className="mb-5 txtDark200 w-perc-100" dangerouslySetInnerHTML={{ __html: questions[currentIndex].subtitle }} />)
                    }
                    <MultiFileldsReduxForm
                      form="GetStarted"
                      disableNextBtn={false}
                      formValue={formValue}
                      inputs={questions[currentIndex].inputs}
                      onSubmit={() => changeStep()}
                      onCloseGoBack={() => changeStep('back')}
                      onClickDisabled={!checkValidateField()}
                      showSendButton
                      showErrors={showError}
                    />
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </>
  );
};

GetStartedBuyer.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateSearchProfile: PropTypes.func.isRequired,
  handleDoLogin: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleSpinnerOn: PropTypes.func.isRequired,
  handleValidateUser: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  handleReset: PropTypes.func.isRequired,
};

GetStartedBuyer.defaultProps = {
  lang: 'en',
};

const mapStateToProps = (state, ownProps) => {
  const urlSearch = queryString.parse(get(ownProps.history, 'location.search', ''));
  const channel = get(urlSearch, 'channel', 'default');
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    initialValues: {
      channel,
      changeCountry: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      company: get(state, 'companies.activeSingleCompany.stub', null),
      location: {
        countryCode: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      },
      locations: get(state, 'brixelForm.GetStarted.values.locations', []),
      characteristics: {
        livingArea: {
          unit: 'm2',
        },
      },
      owner: get(state, 'user.loggedInUser.user.id', null),
      user: get(state, 'user.loggedInUser.user.id', null),
      login: {},
      finance: {
        currency: get(state, 'companies.activeSingleCompany.country.currency', {}),
      },
      price: {
        currency: get(state, 'companies.activeSingleCompany.country.currency', {}),
      },
      profile: {},
      register: {
        phone: {
          prefix: countryPhoneCode.dial_code,
          number: '',
        },
      },
      signup: get(state, 'user.loggedInUser.id', null) !== null,
    },
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
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedBuyer);
