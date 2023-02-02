import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText, BrixelProgressBar} from '@brixel/brixel-components';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {change, destroy, initializeForm, MultiFileldsReduxForm, reset} from '@brixel/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import set from 'lodash/set';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import Cookies from 'universal-cookie';
import {spinnerOff, spinnerOn} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {createActiveSingleProperty, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {createUserSearchProfile} from '../../actions/SearchProfileActions';
import {doLogin, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Flows/onBoardingBuyer';
import {checkBrowser, setCookie} from '../../utils/helpers';
import {titleSearchProfile} from '../../utils/titleCreationSearchProfile';
import translateTo from '../../utils/translation';
import type {GetStartedType} from '../../@types/Pages/PackageFlow/GetStartedBuyer';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const cookie = new Cookies();

const GetStartedBuyer = (props: GetStartedType) => {
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
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleCreateSearchProfile,
    handleSpinnerOff,
    handleSpinnerOn,
    handleValidateUser,
    initForm,
    initialValues,
    isLoading,
    lang = 'en',
    loggedInUser,
    handleReset,
    translations,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue, 'GetStarted'));
  const [progressBar, setProgressBar] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState(0);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState<QuestionsListType>(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue, 'GetStarted')[0]);
  const [showError, setShowError] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  // const [roomValue, setRoomValue] = useState('');
  const companyStub = get(match, 'companyStub', null);

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm();
  }, []);

  // FUNCTION TO SAVE DATA
  const saveData = async (action = '') => {
    if (isLoading || loadingRequest) return false;
    const dataForm = cloneDeep(formValue);
    const dataFormAnswer = cloneDeep(formValue);
    setCookie('brixelSplashHome', 'buyerWelcome');
    const { login, register } = dataForm;
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
      owner: '',
      company: company.stub,
    };
    if (action === 'accept' && company.stub === 'baloise') {
      set(data, 'termsBaloiseBank', true);
      set(data, 'termsBaloiseInsurance', true);
    }
    if (action === 'accept' && company.stub === 'ubs') {
      set(data, 'termsUBS', true)
    }
    const page = get(formValue, 'signupScreen', null);
    // IF USER IS LOGGED IN SAVE DIRECTLY THE PAGE
    handleSpinnerOn();
    if (formValue.owner) {
      data.owner = get(loggedInUser, 'user.id', '');
      // DISPATCH TO SAVE THE PROPERTY
      set(data.dataSearchProfile, 'user', get(loggedInUser, 'user.id', ''))
      await handleCreateSearchProfile(data);
    } else if (page === 'login') {
      changeFieldValue('register.email', login?.email || '');
      // IF USER DO THE LOG IN, DO THE LOGIN AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      const userData = {
        username: (login?.email || '').toLowerCase(),
        password: login.password,
      };
      set(data, 'user', userData);
      // DISPATCH TO DO LOGIN
      await handleDoLogin(data);
    } else {
      changeFieldValue('login.email', register.email || '');
      // IF USER DO THE SIGN UP, DO THE REGISTRATION AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      const userData = {
        ...register,
        email: (login?.email || '').toLowerCase(),
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
        company: company.stub,
        ignoreEmail: false,
        redirectTo: {
          pathname: '/packageFlow/getstartedBuyer/success',
          state: { hideClose: true },
        },
      };
      set(data, 'user', userData);
      if (activeSingleCompany.stub === 'baloise' || activeSingleCompany.stub === 'ubs') {
        const userType = 'buyer';
        set(data, 'redirectToUrl', `/termsConditionFlow/${activeSingleCompany.stub}/${userType}?url=/buy`);
      }
      // DISPATCH TO DO REGISTRATION USER
      setLoadingRequest(true);
      setCookie('brixelFirstTime', 'true');
      await handleValidateUser(data);
    }
  };

  useEffect(() => {
    if (get(loggedInUser, 'user.id', null)) changeFieldValue('owner', get(loggedInUser, 'user.id', null));
  }, [get(loggedInUser, 'user.id', null)]);

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex: number = id;
    if (questions[newIndex] && questions[newIndex].conditions) {
      let checkCond = true;
      const {conditions} = questions[newIndex];
      if (conditions) {
        conditions.map((cond) => {
          if (cond.name) {
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
    }
    return newIndex;
  };

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act = '') => {
    let isValid = true;
    let isNotEmpty = false;
    if (quest?.inputs) {
      quest.inputs.forEach((input) => {
        if (input.name) {
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
            let field;
            if (input.name === 'profileUser') {
              const page = get(formValue, 'signupScreen', null);
              field = ['register.email', 'register.firstName', 'register.lastName', 'register.password', 'register.privacy'];
              if (page === 'login') {
                field = ['login.email', 'login.password'];
              }
              field.forEach((item) => {
                const errCur = get(errorValue, item, true);
                if (errCur !== true && errCur !== false && isValid) isValid = false;
              });
            } else if (err !== true && err !== false && err !== null && isValid) isValid = false;
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
    setLoadingRequest(false);
    if (e) e.preventDefault();
    if (isLoading || loadingRequest) return false;
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
        saveData(get(questions[defId], 'action', ''));
      } else {
        const newQuest = {
          ...questions[defId],
        };
        setQuest(newQuest);
        setCurrentIndex(defId);

        if (newQuest.history !== 'createProfile') {
          if (newQuest.inputs && !newQuest.inputs[0].options && !newQuest.inputs[0].startFrom) {
            const fakeInput = document.createElement('input');
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
            } else if (getCurStep && getCurStep.querySelector('input[type="search"]')) {
              const inputSearch = getCurStep.querySelector('input[type="search"]') as HTMLInputElement;
              if (inputSearch) inputSearch.focus();
            }
            // cleanup
            if (fakeInput) fakeInput.remove();
          }, 500);
        }
        if (questions[defId].history) {
          history.push(`/packageFlow/getStartedBuyer/${company.stub}/${questions[defId].history}`, {state: get(history, 'location.state', {})});
        }
        const getOnlyQuest = questions.filter((item) => item.inputs);
        setProgressBar((defId * 100) / getOnlyQuest.length);
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

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      let defComp = get(companyByUrl, 'company', companyCookie);
      if (companyStub && companyStub !== get(questions, '[0].history', null)) defComp = companyStub;
      handleGetActiveSingleCompany({ stub: defComp || 'default' });
      setCookie('brixelStubCompany', defComp);
      history.push(`/packageFlow/getStartedBuyer/${defComp}/${get(questions, '[0].history', null)}`);
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
  }, []);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue, 'GetStarted'));
    setQuest(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue, 'GetStarted')[currentIndex]);
  }, [lang, translations]);

  // SKIP FIRST STEP IF PROPERTY TYPE EXISTS - by url param
  useEffect(() => {
    if (get(initialValues, 'properties.propertyType', null)) {
      // changeStep();
    }
  }, [initialValues]);

  // ON CHANGE STEP (currentIndex is different for each step) CHANGE THE isEnter (used for enter effect) AND LOAD COMPANY DATA IF countryCode CHANGE
  useEffect(() => {
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

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    handleReset(initialValues);
    history.push('/buy');
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    setOldIndex(currentIndex);
    const newQuest: QuestionsListType[] = [];
    if (formValue) {
      QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue, 'GetStarted').map((questData) => {
        if (questData.condition) {
          let isValid = true;
          questData.condition.map((item) => {
            if (item.name && get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid && !questData.hideSearchProfileFlow) newQuest.push(questData);
        } else {
          if (!questData.hideSearchProfileFlow) newQuest.push(questData);
        }
        return null;
      });
      setQuestions(newQuest);
      setQuest(newQuest[currentIndex]);
    }
    if (newQuest[currentIndex].inputs && newQuest[currentIndex] && (newQuest[currentIndex].inputs || []).length === 1 && get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 && get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) && !isArray(get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), [])) && oldIndex <= currentIndex) {
      changeStep('next', null, 1, true);
    }
    const rooms: {max?: number; min?: number} = get(formValue, 'characteristics.bedrooms', {});
    const propertyType = get(formValue, 'characteristics.propertyType', []);
    const locations = get(formValue, 'locations', []);
    const searchProfileName = get(formValue, 'name', null);
    if (propertyType.length > 0 && locations.length > 0 && rooms.max && !searchProfileName) {
      changeFieldValue('name', titleSearchProfile(formValue, lang))
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
      setQuestions(QuestionsList(getLang, companyCountry, changeFieldValue, 'GetStarted'));
      setQuest(QuestionsList(getLang, companyCountry, changeFieldValue, 'GetStarted')[currentIndex]);
      const companyCountryCode = get(company, 'country.code', 'CH');
      const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
      changeFieldValue('register.phone.prefix', countryPhoneCode?.dial_code || null);
    }
    if (get(formValue, 'locations', []).length === 0) initForm(initialValues);
  }, [get(company, 'id', null)]);

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex + 1}].toSave`, null)) label = 'Save';
    else if (get(quest, 'history', '') === 'baloiseInfo') label = 'Continue';
    else if (currentIndex === 0) label = 'Next';
    else if (inputName && get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
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
            className="interactive dis-fl-col jc-b"
            onSubmit={() => changeStep()}
          >
            <div ref={multiStepSlidesRef} className="multiStepSlides">
              <div ref={singleStepRef} className="singleStep pt-5 jc-c">
                <div className="subcontainer m-a">
                  {
                    get(quest, 'inputs', null) && (
                      <div id={`step-${currentIndex}`} className="dis-fl-col flex-wrap">
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
                            <p className="mb-5 ta-c txtText600 w-perc-100 px-3 px-sm-2" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                        }
                        <div className={`${quest.className} w-perc-100`}>
                          <MultiFileldsReduxForm
                            baseByData={baseByData}
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
                        <img loading="lazy" src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
                        {
                          quest.title && (
                            <h5
                              className="fadeAnim mt-2 ta-c"
                              dangerouslySetInnerHTML={{ __html: quest.title }}
                            />
                          )
                        }
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
                          label={translateTo(buttonLabel(), lang)}
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
              get(quest, 'history', null) !== 'createProfile' && (get(quest, 'history', '') !== 'baloisePolicy' && get(quest, 'history', '') !== 'ubsPolicy') && (
                <div
                  className={`footerAction flowFooter ${questions[currentIndex].footerWidth} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
                >
                  <div className="pos-r">
                    <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c">
                      {
                        ( (get(questions, `[${currentIndex - 1}].inputs`, null) || currentIndex === 0) && (get(quest, 'history', '') !== 'baloiseInfo') ) && (
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
                                  type="submit"
                                  className={`noWrap mr-a ml-5-neg ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                  disabled={!checkValidateField()}
                                  theme="green"
                                  rounded
                                  label={translateTo(buttonLabel(), lang)}
                                  rightIcon="arrow-right-small"
                                  onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                                />
                              ) : (
                                <BrixelButtonPrimary
                                  type="submit"
                                  className={`mr-a ml-5-neg noWrap ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`}
                                  disabled={!checkValidateField()}
                                  rounded
                                  theme="green"
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
                  </div>
                </div>
              )
            }
            {
              (get(quest, 'history', null) === 'baloisePolicy' || get(quest, 'history', null) === 'ubsPolicy') && (
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
                      quest.text && quest.text.map((text, i) => (
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
                          <p className="fsize-300 mb-2 dis-b" dangerouslySetInnerHTML={{ __html: text.description || '' }} />
                        </div>
                      ))
                    }
                    {
                      quest.bulletPoints && (
                        <div className="brdSmallLeft-lg brdText50 w-perc-lg-45 pl-lg-5 py-lg-3 max-w-fix-lg-352">
                          <span className="my-3 dis-b">{quest.bulletPoints.title}</span>
                          <ul className="">
                            {
                              get(quest, 'bulletPoints.description', []).map((bullet,k) => (
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
                  <div
                    className={`footerAction my-3 flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
                  >
                    <div className="pos-r">
                      <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c">
                        {
                          get(quest, 'history', null) !== 'resume' && (get(quest, 'inputs', []).length > 1 || (get(quest, 'inputs[0].component.name', '') !== 'BrixelRadioButton' || get(quest, 'history', null) === 'propertyType')) && (
                            <BrixelButtonPrimary
                              className={`mr-a ml-a noWrap ${get(quest, 'history', null)}`}
                              disabled={!checkValidateField()}
                              rounded
                              theme="green"
                              label={translateTo('Accept', lang)}
                              onClick={() => saveData('accept')}
                              onShowError={() => setShowError(true)}
                            />
                          )
                        }
                        <BrixelButtonText
                          theme="light"
                          className="pos-sm-a x-r"
                          label={translateTo('Skip', lang)}
                          onClick={() => saveData('skip')}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )
            }

          </form>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const urlSearch = queryString.parse(get(ownProps.history, 'location.search', ''));
  const channel = get(urlSearch, 'channel', 'default');
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
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
          min: 0,
          max: 300,
        },
        bedrooms: {min: 0, max: 9},
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
          prefix: countryPhoneCode?.dial_code,
          number: '',
        },
      },
      signup: get(state, 'user.loggedInUser.id', null) !== null,
    },
    isLoading: get(state, 'common.isLoading', 0) > 0,
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.GetStarted', null),
    translations: get(state, 'translations', { }),
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
  handleReset(initialValue) {
    (dispatch(reset('GetStarted', initialValue)));
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
