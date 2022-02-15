/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary,
  MultiFileldsReduxForm,
  initializeForm,
  change,
  reset,
  destroy,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { setCookie, checkBrowser } from '../../utils/helpers';
import { QuestionsList } from '../../resources/onBoarding';
import { setLanguage, spinnerOff } from '../../actions/CommonActions';
import { doLogin, validateUser } from '../../actions/UserActions';
import { createUserSearchProfile } from '../../actions/SearchProfileActions';

const cookie = new Cookies();

const GetStarted = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    changeFieldValue,
    company,
    destroyForm,
    errorValue,
    formValue,
    handleGetActiveSingleCompany,
    handleSetLanguage,
    handleSpinnerOff,
    initForm,
    initialValues,
    lang,
    loggedInUser,
    reset,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [companyURL, setCompanyURL] = useState('');
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[0]);
  const [isEnter, setIsEnter] = useState(true);
  // const [roomValue, setRoomValue] = useState('');

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
    const userType = get(dataForm, 'userType', null);
    switch (userType) {
      case 'buyer':
        history.push(`/packageFlow/getStartedBuyer?company=${companyURL}`);
        break;
      case 'estimation':
        history.push(`/packageFlow/getStartedEstimation?company=${companyURL}`);
        break;
      default:
        history.push(`/packageFlow/getStarted?company=${companyURL}`);
    }
  };

  useEffect(() => {
    if (get(loggedInUser, 'user.id', null)) changeFieldValue('owner', get(loggedInUser, 'user.id', null));
  }, [get(loggedInUser, 'user.id', null)]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    let defComp = companyCookie;
    if (get(companyByUrl, 'company', companyCookie)) {
      defComp = get(companyByUrl, 'company', companyCookie);
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
    setCompanyURL(defComp);
  }, []);

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
    const reloadQuestions = QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'));
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= step;
    } else {
      newIndex += step;
    }

    let defId = checkCondition(newIndex, act);
    if (defId !== newIndex) defId = checkCondition(defId, act);

    // setPosition(newIndex);
    if (reloadQuestions[defId].toSave) saveData(get(reloadQuestions[defId], 'action', null));
    else {
      setIsEnter(false);
      let newQuest = {
        ...reloadQuestions[defId],
      };
      if (reloadQuestions[defId].effect === 'slideUp') {
        newQuest = {
          ...reloadQuestions[defId - 1],
        };
      }
      if (act === 'back' && reloadQuestions[defId + 1].effect === 'slideUp') {
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
        } else if (getCurStep && getCurStep.querySelector('input[type="search"]')) {
          getCurStep.querySelector('input[type="search"]').focus();
        }
      }, 100);
      if (reloadQuestions[defId].history) {
        history.push({
          pathname: `/packageFlow/${reloadQuestions[defId].history}`,
          state: get(history, 'location.state', {}),
        });
      }
      setQuestions(reloadQuestions);
      if (checkBrowser() > 0) {
        if (singleStepEl) singleStepEl.scrollTop = 0;
        if (multiStepSlidesEl) multiStepSlidesEl.scrollTop = 0;
      } else {
        if (singleStepEl) singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
        if (multiStepSlidesEl) multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      history.push({
        pathname: `/packageFlow/${questions[0].history}`,
        state: {},
      });
    }
  }, []);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    const currentQuest = QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex];
    if (currentQuest.effect === 'slideUp') {
      // setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
      // setQuest(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex - 1]);
    } else {
      // setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
      // setQuest(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex]);
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

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    reset('Property');
    // history.push('/home');
    history.push('/buy');
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
      setQuestions(newQuest);
    }
  }, [formValue]);

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

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex + 1}].toSave`, null)) label = 'Next';
    else if (currentIndex === 0) label = 'Next';
    else if (get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else label = 'Next';
    return label;
  };

  useEffect(() => {
    if (get(formValue, 'userType', null)) changeStep();
  }, [get(formValue, 'userType', null)]);

  return (
    <div id="bodyModalWrapper" className="withHeader getStarted buyerHub">
      <div
        className={`bodyModal ${questions[currentIndex].effect === 'slideUp' ? 'signUpScreen' : ''} ${get(quest, 'history', '')}`}
      >
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep pt-6 jc-c ${get(quest, 'vCentered', null) ? 'vertCentered' : ''} ${currentIndex < 5 ? isEnter || questions[currentIndex].effect ? 'fade-enter-active' : 'fade-enter' : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && (
                    <div id={`step-${currentIndex}`} className={`dis-f flex-wrap ${questions[currentIndex].effect} ${questions[currentIndex].effect === 'slideUp' ? 'activeQuestBack' : ''}`}>
                      <div className="ta-c max-w-fix-456 m-a">
                        {
                          quest.title && (
                            <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'} fsize-600 fsize-sm-800 fweight-600 txtDark700 px-1 px-sm-0`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                          )
                        }
                      </div>
                      {
                        quest.subtitle && (
                          <p className="mb-5 txtDark700" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
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
        </form>
      </div>
      {/* signup flow */}
      {/* {
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
                    className="h-perc-100 dis-f"
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
      } */}
    </div>
  );
};

GetStarted.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

GetStarted.defaultProps = {
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
      characteristics: {
        livingArea: {
          unit: 'm2',
        },
      },
      owner: get(state, 'user.loggedInUser.id', null),
      user: get(state, 'user.loggedInUser.id', null),
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
  reset(form) {
    (dispatch(reset(form)));
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(GetStarted);
