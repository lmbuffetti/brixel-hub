/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useRef, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary, BrixelButtonIcon, BrixelIcon, BrixelProgressBar, MultiFileldsReduxForm, initializeForm, change, reset, destroy,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { titleProperty } from '../../utils/titleCreation';
import { calcPercentageFacts, setCookie } from '../../utils/helpers';
import { QuestionsList } from '../../resources/onBoardingSeller';
import { getGamegroup } from '../../actions/GamificationActions';
import { setLanguage, spinnerOff } from '../../actions/CommonActions';
import { doLogin, validateUser, saveActiveSingleUser } from '../../actions/UserActions';

const cookie = new Cookies();

const GetStartedSeller = (props) => {
  // PROPS
  const {
    changeFieldValue,
    company,
    destroyForm,
    errorValue,
    formValue,
    handleCreateActiveSingleProperty,
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleGetGamegroup,
    handleSaveActiveSingleProperty,
    handleSaveActiveSingleUser,
    handleSetLanguage,
    handleSpinnerOff,
    handleValidateUser,
    history,
    initForm,
    initialValues,
    lang,
    loggedInUser,
    match,
    reset,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
  const [progressBar, setProgressBar] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[0]);
  const [isEnter, setIsEnter] = useState(true);
  const [lastID, setLastID] = useState(0);
  // const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS
  const getAchievement = () => last(history.location.pathname.split('/'));
  const propID = get(match, 'params.propId', null);

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm();
  }, []);

  const getSplashType = () => {
    const dataForm = cloneDeep(formValue);
    let type;

    if (get(dataForm, 'location.countryCode', null) === 'PT') type = 'bestimateTeaser';
    if (get(dataForm, 'location.countryCode', null) === 'CH') type = 'bestimateResult';

    return type;
  };

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
    if (calcPercentageFacts('GetStarted').calcPerc !== calcPercentageFacts('GetStarted').savedPerc && inputSheet.totalComplete !== calcPercentageFacts('GetStarted').calcPerc) {
      inputSheet.totalComplete = calcPercentageFacts('GetStarted').calcPerc;
      changeFieldValue('inputSheet', inputSheet);
    }
  }, [formValue]);

  // FUNCTION TO SAVE DATA
  const saveData = async (action) => {
    const dataForm = cloneDeep(formValue);
    const dataFormAnswer = cloneDeep(formValue);

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
    // PROPERTY DATA
    delete dataFormAnswer.login;
    const data = {
      ...dataFormAnswer,
      packageFlowProcess: {
        answers: dataFormAnswer,
        rewardScreenData: {},
        metaUser: metaUserData,
      },
      language: lang || 'en',
      title: formValue.pageTitle,
      status: 'on-request',
      listed: false,
      active: true,
      published: false,
      addProperty: true,
      redirectToRewards: true,
      company,
    };
    const page = get(formValue, 'signupScreen', null);
    // IF USER IS LOGGED IN SAVE DIRECTLY THE PAGE
    if (formValue.owner) {
      data.owner = loggedInUser.user.id;
      // DISPATCH TO SAVE THE PROPERTY
      data.redirectToRewards = true;
      await handleCreateActiveSingleProperty(data);
    } else if (page === 'login') {
      changeFieldValue('register.email', login.email);
      // IF USER DO THE LOG IN, DO THE LOGIN AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      data.user = {
        username: login.email,
        password: login.password,
      };
      // DISPATCH TO DO LOGIN
      data.redirectToHome = true;
      await handleDoLogin(data);
    } else {
      changeFieldValue('login.email', register.email);
      // IF USER DO THE SIGN UP, DO THE REGISTRATION AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      data.redirectToRewards = false;
      data.user = {
        ...register,
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
    let newIndex = id;
    if (get(questions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      questions[newIndex].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (val !== cond.value && checkCond) {
          if (act === 'back') newIndex -= 1;
          else newIndex += 1;
          checkCond = false;
        }
        return null;
      });
    }
    return newIndex;
  };

  const singleStepEl = singleStepRef.current;
  const multiStepSlidesEl = multiStepSlidesRef.current;

  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act, e, step = 1) => {
    if (e) e.preventDefault();
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= step;
    } else {
      newIndex += step;
    }

    let defId = checkCondition(newIndex, act);
    if (defId !== newIndex) defId = checkCondition(defId, act);

    // setPosition(newIndex);
    if (questions[defId].toSave) saveData(get(questions[defId], 'action', null));
    else {
      setIsEnter(false);
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
      setTimeout(() => {
        const getCurStep = document.getElementById(`step-${defId}`);
        if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
          getCurStep.querySelector('input[type="number"]').focus();
        } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
          getCurStep.querySelector('input[type="text"]').focus();
        }
      }, 100);
      if (questions[defId].history) {
        history.push({
          pathname: `/packageFlow/getStarted/${questions[defId].history}`,
          state: get(history, 'location.state', {}),
        });
      }
      const getOnlyQuest = questions.filter((item) => item.inputs);
      setProgressBar((defId * 100) / getOnlyQuest.length);
      if (singleStepEl) singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
      if (multiStepSlidesEl) multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // IF THE URL IS SUCCESS (SUCCESS CREATE USER) REDIRECT TO SECOND PART
  useEffect(() => {
    if (get(history, 'location.pathname', '').includes('success') && questions[currentIndex + 1]) {
      setTimeout(() => {
        changeStep('next', null, 2);
      }, 500);
    }
  }, [get(history, 'location', null)]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    handleGetGamegroup();
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({ stub: defComp });
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
        pathname: `/packageFlow/getStarted/${questions[0].history}`,
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
  }, [currentIndex]);

  // FUNCTION TO CALC THE LIVING SPACE FROM GROSS AREA
  useEffect(() => {
    if (get(formValue, 'properties.typology.grossArea.value', 0) > 0) {
      const livingSpace = Math.round(get(formValue, 'properties.typology.grossArea.value', 0) * 0.85);
      changeFieldValue('properties.typology.livingArea.value', livingSpace);
    }
    if (get(formValue, 'properties.typology.floorSpace.value', 0) > 0) {
      changeFieldValue('properties.typology.livingArea.value', get(formValue, 'properties.typology.floorSpace.value', 0));
    }
  }, [get(formValue, 'properties.typology.grossArea.value', 0), get(formValue, 'properties.typology.floorSpace.value', 0)]);

  // FUNCTION to MULTIPLY ROOMS IN BACKGROUND
  /* useEffect(() => {
    let roomValue = get(formValue, 'properties.typology.bedrooms', 2);
    let bgSize = 500
    bgSize = bgSize / roomValue;

    setRoomValue(bgSize+ 'vw');

  }, [get(formValue, 'properties.typology.bedrooms', 2)]); */

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    reset('Property');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      history.push(`/${propID}/rewards`);
    } else {
      history.push(`/${propID}/rewards/${getAchievement()}`);
    }
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    if (formValue) {
      const newQuest = [];
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
      setLastID(newQuest.length - 1);
      setQuestions(newQuest);
    }
  }, [formValue]);

  // FUNCTION TO CHANGE THE TITLE ON CHANGING LOCATION
  useEffect(() => {
    if (currentIndex <= 5) {
      const propertyType = get(formValue, 'properties.propertyType', null);
      const pageTitle = titleProperty(formValue.location, propertyType, lang, formValue);
      if (pageTitle) changeFieldValue('pageTitle', pageTitle);
    }
  }, [formValue.location, lang]);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      let getLang = cookie.get('brixelLang');
      if (get(company, 'language.code', null) && !getLang && currentIndex < 2) {
        const companyLang = get(company, 'language.code', 'en');
        handleSetLanguage(companyLang.toLowerCase());
        getLang = companyLang.toLowerCase();
      }
      const companyCountry = get(company, 'country.code', 'CH');
      setQuestions(QuestionsList(getLang, companyCountry));
      changeFieldValue('location.countryCode', companyCountry);
      setCookie('brixelStubCompany', company.stub);
      changeFieldValue('company', company.stub);
      changeFieldValue('price.currency', get(company, 'country.currency', 'CHF'));
    }
    if (get(formValue, 'properties.propertyType', null) === null) initForm(initialValues);
  }, [company]);

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

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex + 2}].toSave`, null)) label = 'Save';
    else if (get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else label = 'Next';
    return label;
  };

  const tansitionBg = (i, act = 'next') => {
    if (act === 'next') {
      if (i === currentIndex) return 'active';
      if (i === currentIndex + 1 && get(questions, `[${currentIndex + 1}].effect`, null) === 'slideUp') return 'active';
    }
    if (i < currentIndex) return 'prev';
    return '';
  };

  return (
    <div id="bodyModalWrapper" className="withHeader getStarted">
      {
        get(quest, 'inputs', null) && (
          <BrixelProgressBar
            large
            saturation={400}
            barBackground="Light"
            backgroundSaturation={300}
            progressValue={progressBar}
          />
        )
      }

      <div
        className={`bodyModal ${questions[currentIndex].effect === 'slideUp' ? 'ov-v signUpScreen' : 'ov-h'} ${get(quest, 'history', '')}`}
        // style={{ backgroundImage: `url(${quest.bgImg})` }}
      >
        {/* preload all background images */}
        {
          questions.map((questStep, i) => (
            <Fragment key={i.toString()}>
              <div className="slideBg" key={i.toString()}>
                <div
                  // eslint-disable-next-line no-nested-ternary
                  className={` ${tansitionBg(i)} ${i < currentIndex && i <= 4 ? 'prev' : ''}`}
                  style={{ backgroundImage: `url(${questStep.bgImg})` }}
                />
              </div>
            </Fragment>
          ))
        }
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''} ${questions[currentIndex].effect === 'slideUp' ? 'ov-v signUp' : 'ov-h'}`}
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep pt-5 jc-c ${get(quest, 'vCentered', null) ? 'vertCentered' : ''} ${currentIndex < 5 ? isEnter || questions[currentIndex].effect ? 'fade-enter-active' : 'fade-enter' : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && (
                    <div id={`step-${currentIndex}`} className={`dis-f flex-wrap ${questions[currentIndex].effect} ${questions[currentIndex].effect === 'slideUp' ? 'activeQuestBack' : ''}`}>
                      {
                        quest.titleGreen && (
                          <h3 className="txtGreen400 w-perc-100">{quest.titleGreen}</h3>
                        )
                      }
                      {
                        quest.title && (
                          <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'} w-perc-100`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                        )
                      }
                      {
                        quest.subtitle && (
                          <p className="mb-5 txtDark200 w-perc-100" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                      }
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
                        disableDelay
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
                        className={`mt-3 mb-2 m-a noWrap ${quest.history}`}
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
          <div
            className={`footerAction shadow-1dp-top ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="pos-r p-1 p-lg-2">
              <div className={`w-perc-100 a-c dis-fl-row m-a flex-wrap ${currentIndex === lastID ? 'jc-c' : 'jc-fe'}`}>
                {
                  get(questions, `[${currentIndex - 1}].inputs`, null) && (
                    <BrixelButtonIcon
                      className={`backBtn ml-0 mr-a ${currentIndex === 0 ? 'hide' : ''}`}
                      icon="arrow-simple-left"
                      onClick={() => changeStep('back')}
                      theme="green"
                      ghost
                    />
                  )
                }
                {
                  checkValidateField() && get(quest, 'successMessage', null) && (
                    <div className="txtWhite pr-1 textSuccess ml-a mr-0">
                      {/* {quest.successMessage}  */} Ok! <BrixelIcon icon="check" className="ml-1" />
                    </div>
                  )
                }

                <BrixelButtonPrimary
                  className={`mr-0 ml-0 noWrap ${get(quest, 'history', null)} ${currentIndex === 0 && !checkValidateField() ? 'ml-a' : ''} ${currentIndex === 0 ? `${!checkValidateField() ? '' : 'ml-lg-0'}` : ''}`}
                  disabled={!checkValidateField()}
                  rounded
                  theme="green"
                  label={buttonLabel()}
                  rightIcon="arrow-right-small"
                  onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                />
              </div>
            </div>
          </div>
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
                    className="h-perc-100"
                    form="GetStarted"
                    disableNextBtn={false}
                    formValue={formValue}
                    inputs={questions[currentIndex].inputs}
                    onSubmit={() => changeStep()}
                    onCloseGoBack={() => changeStep('back')}
                    onClickDisabled={!checkValidateField()}
                    showSendButton
                    showErrors
                  />
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
};

GetStartedSeller.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateActiveSingleProperty: PropTypes.func.isRequired,
  handleDoLogin: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleValidateUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

GetStartedSeller.defaultProps = {
  lang: 'en',
};

const mapStateToProps = (state, props) => {
  const urlSearch = queryString.parse(get(props.history, 'location.search', ''));
  const channelCookie = cookie.get('brixelChannelSignup') || null;
  const channel = get(urlSearch, 'channel', channelCookie);
  const propertyType = get(urlSearch, 'propertyType', null);
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    gameGroup: get(state, 'gamification.gameGroup', []),
    gameHistory: get(state, 'gamification.gameHistory', {}),
    initialValues: {
      channel,
      changeCountry: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      company: get(state, 'companies.activeSingleCompany.stub', null),
      price: {
        currency: get(state, 'companies.activeSingleCompany.country.currency', null),
      },
      location: {
        countryCode: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      },
      login: {},
      owner: get(state, 'user.loggedInUser.id', null),
      properties: {
        propertyType,
        typology: {
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
      },
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
  reset(form) {
    (dispatch(reset(form)));
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedSeller);
