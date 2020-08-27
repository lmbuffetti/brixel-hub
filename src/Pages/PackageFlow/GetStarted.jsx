/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useRef, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary, BrixelButtonIcon, BrixelIcon, BrixelProgressBar, MultiFileldsReduxForm, initializeForm, change, reset,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { titleProperty } from '../../utils/titleCreation';
import { setCookie } from '../../utils/helpers';
import { QuestionsList } from '../../resources/onBoarding';
import { getGamegroup } from '../../actions/GamificationActions';
import { setLanguage } from '../../actions/CommonActions';
import { doLogin, validateUser, saveActiveSingleUser } from '../../actions/UserActions';

const cookie = new Cookies();

const GetStarted = (props) => {
  // PROPS
  const {
    changeFieldValue,
    company,
    errorValue,
    formValue,
    lang,
    handleCreateActiveSingleProperty,
    handleSaveActiveSingleProperty,
    handleGetActiveSingleCompany,
    handleSaveActiveSingleUser,
    handleSetLanguage,
    handleGetGamegroup,
    initForm,
    initialValues,
    loggedInUser,
    handleDoLogin,
    handleValidateUser,
    history,
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

  // FUNCTION TO SAVE DATA
  const saveData = async (action) => {
    const dataForm = cloneDeep(formValue);
    if (action === 'updateUser') {
      const dataUser = {
        id: dataForm.owner,
        userType: get(dataForm, 'register.ownerType', null),
      };
      const dataProperty = {
        id: get(dataForm, 'pageID', null),
        ownerType: get(dataForm, 'register.ownerType', null),
        redirectTo: `/${get(dataForm, 'pageID', null)}/rewards`,
      };
      if (get(dataForm, 'register.ownerType', null) === 'buyer') {
        dataUser.typeOfBuyer = get(dataForm, 'register.typeOfBuyer', null);
        dataProperty.typeOfBuyer = get(dataForm, 'register.typeOfBuyer', null);
      }
      if (get(dataForm, 'register.ownerType', null) === 'seller') {
        dataUser.whenToSell = get(dataForm, 'register.whenToSell', null);
        dataProperty.whenToSell = get(dataForm, 'register.whenToSell', null);
      }
      await handleSaveActiveSingleUser(dataUser);
      await handleSaveActiveSingleProperty(dataProperty);
    } else {
      const { login, register, company } = dataForm;
      // delete dataForm.login;
      changeFieldValue('register.password', '');
      delete dataForm.register.password;
      // delete dataForm.company;
      // PROPERTY DATA
      const data = {
        ...dataForm,
        packageFlowProcess: {
          answers: dataForm,
          rewardScreenData: {},
        },
        language: lang || 'en',
        title: formValue.pageTitle,
        status: 'on-request',
        listed: false,
        active: true,
        published: false,
        addProperty: true,
        redirectToUserFlow: false,
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
          name: `${register.firstName} ${get(register, 'lastName', '')}`,
          userType: 'seller',
          signupAccept: true,
          signupChannel: get(formValue, 'channel', 'default'),
          signupProduct: null,
          language: lang || 'en',
          createUser: true,
          company,
          ignoreEmail: false,
          redirectTo: '/packageFlow/getStarted/success',
        };
        // DISPATCH TO DO REGISTRATION USER
        await handleValidateUser(data);
      }
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
        history.push(`/packageFlow/getStarted/${questions[defId].history}`);
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
      changeStep('next', null, 2);
    }
  }, [get(history, 'location', null)]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    handleGetGamegroup();
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({ stub: defComp });
      setCookie('brixelStubCompany', defComp);
    } else {
      handleGetActiveSingleCompany({ stub: 'default' });
      // changeFieldValue('location.countryCode', 'all');`
    }
    const getCurrentUrl = last(history.location.pathname.split('/'));
    if (getCurrentUrl !== questions[0].history || get(companyByUrl, 'company', null)) {
      history.push(`/packageFlow/getStarted/${questions[0].history}`);
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
  }, [get(formValue, 'properties.typology.grossArea.value', 0)]);

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
    const propertyType = get(formValue, 'properties.propertyType', null);
    const pageTitle = titleProperty(formValue.location, propertyType, lang, formValue);
    if (pageTitle) changeFieldValue('pageTitle', pageTitle);
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
    initForm(initialValues);
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
          } else if (err !== true && err !== false && err !== null && isValid) isValid = false;
        }
      });
    }
    if (quest.history === 'createProfile') {
      // console.log(quest);
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    if (get(questions, `[${currentIndex + 1}].toSave`, null)) label = 'Save';
    else if (currentIndex === 0) label = 'Next';
    else label = 'Next';
    return label;
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
        className={`bodyModal ${questions[currentIndex].effect === 'slideUp' ? 'ov-v signUpScreen' : 'ov-h'} ${quest.history}`}
        // style={{ backgroundImage: `url(${quest.bgImg})` }}
      >
        {/* preload all background images */}
        {
          questions.map((questStep, i) => (
            <Fragment key={i.toString()}>
              {
                i <= 5 && (
                  <div className="slideBg" key={i.toString()}>
                    <div
                      // eslint-disable-next-line no-nested-ternary
                      className={`${i === currentIndex ? 'active' : currentIndex > 5 && i === 5 ? 'active' : ''} ${i < currentIndex && i <= 4 ? 'prev' : ''}`}
                      style={{ backgroundImage: `url(${questStep.bgImg})` }}
                    />
                  </div>
                )
              }
            </Fragment>
          ))
        }
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${quest.background || ''} ${questions[currentIndex].effect === 'slideUp' ? 'ov-v signUp' : 'ov-h'}`}
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep pt-5 jc-c ${quest.vCentered ? 'vertCentered' : ''} ${currentIndex < 5 ? isEnter || questions[currentIndex].effect ? 'fade-enter-active' : 'fade-enter' : ''}`}>
              <div className="subcontainer m-a">
                {
                  quest.inputs && (
                    <div id={`step-${currentIndex}`} className={`dis-f flex-wrap ${questions[currentIndex].effect} ${questions[currentIndex].effect === 'slideUp' ? 'activeQuestBack' : ''}`}>
                      {
                        quest.titleGreen && (
                          <h3 className="txtGreen400 w-perc-100">{quest.titleGreen}</h3>
                        )
                      }
                      {
                        quest.title && (
                          <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'} w-perc-100`}>{quest.title}</h3>
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
                  quest.history === 'resume' && (
                    <div className="max-w-fix-344 m-a">
                      <BrixelButtonPrimary
                        className={`mt-3 m-a noWrap ${quest.history}`}
                        rounded
                        background="green"
                        saturation={400}
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
            className={`footerAction shadow-1dp-top ${quest.history === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="pos-r p-1 p-md-2">
              <div className={`buttonsHolder w-perc-100 a-c dis-fl-row m-a flex-wrap ${currentIndex === lastID ? 'jc-c' : 'jc-fe'}`}>
                {
                  questions[currentIndex] && questions[currentIndex].inputs && currentIndex !== 6 && (
                    <BrixelButtonIcon
                      className={`shadow-2dp backBtn ml-0 mr-a ${currentIndex === 0 ? 'hide' : ''}`}
                      icon="arrow-simple-left"
                      onClick={() => changeStep('back')}
                      background="white"
                      saturation={0}
                      color="green"
                      saturationTxt={400}
                      noBorder
                    />
                  )
                }
                {
                  checkValidateField() && quest.successMessage && (
                    <div className="txtWhite pr-1 textSuccess ml-a mr-0">
                      {/* {quest.successMessage}  */} Ok! <BrixelIcon icon="check" className="ml-1" />
                    </div>
                  )
                }

                <BrixelButtonPrimary
                  className={`mr-0 ml-0 noWrap ${quest.history} ${currentIndex === 0 && !checkValidateField() ? 'ml-a' : ''} ${currentIndex === 0 ? `${!checkValidateField() ? '' : 'ml-md-0'}` : ''}`}
                  disabled={!checkValidateField()}
                  rounded
                  background="green"
                  saturation={400}
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

GetStarted.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateActiveSingleProperty: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleDoLogin: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleValidateUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

GetStarted.defaultProps = {
  lang: 'en',
};

const mapStateToProps = (state, props) => {
  const urlSearch = queryString.parse(get(props.history, 'location.search', ''));
  const channel = get(urlSearch, 'channel', 'default');
  const propertyType = get(urlSearch, 'propertyType', null);
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    gameGroup: get(state, 'gamification.gameGroup', []),
    gameHistory: get(state, 'gamification.gameHistory', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.GetStarted', null),
    initialValues: {
      company: get(state, 'companies.activeSingleCompany.stub', null),
      channel,
      price: {
        currency: get(state, 'companies.activeSingleCompany.country.currency', null),
      },
      location: {
        countryCode: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      },
      changeCountry: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      login: {},
      owner: get(state, 'user.loggedInUser.id', null),
      properties: {
        propertyType,
        typology: {
          livingArea: {
            unit: 'sqm',
          },
          grossArea: {
            unit: 'sqm',
          },
        },
      },
      register: {},
      signup: get(state, 'user.loggedInUser.id', null) !== null,
    },
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('GetStarted', value));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(GetStarted);
