/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonPrimary, BrixelButtonIcon, BrixelIcon, BrixelProgressBar, MultiFileldsReduxForm } from '@brixel/brixel-components';
import { QuestionsList } from '../../resources/brixelComintTownPropertyQuestion';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { getActiveSingleCompany, getCompanyByCountry } from '../../actions/CompanyActions';
import { createActiveSingleProperty } from '../../actions/PropertyActions';
import { reduxForm, reset, change } from 'redux-form';
import last from 'lodash/last';
import { titleProperty } from '../../utils/titleCreation';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import queryString from 'query-string';
import { setCookie } from '../../utils/helpers';
import Cookies from 'universal-cookie';
import { getGamegroup } from '../../actions/GamificationActions';
import { setLanguage } from '../../actions/CommonActions';
import { doLogin, validateUser } from '../../actions/UserActions';

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
    handleGetActiveSingleCompany,
    handleSetLanguage,
    handleGetGamegroup,
    initialValues,
    loggedInUser,
    handleDoLogin,
    handleValidateUser,
    history,
    match,
    reset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
  const [progressBar, setProgressBar] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [quest, setQuest] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[1]);
  const [isEnter, setIsEnter] = useState(true);
  const [lastID, setLastID] = useState(0);
  //const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS
  const getAchievement = () => last(history.location.pathname.split('/'));
  const propID = get(match, 'params.propId', null);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    const dataForm = formValue;
    const { login, register, company } = dataForm;
    delete dataForm.login;
    delete dataForm.register;
    delete dataForm.company;
    const data = {
      ...dataForm,
      packageFlowProcess: {
        answers: formValue,
        rewardScreenData: {},
      },
      language: lang || 'en',
      title: formValue.pageTitle,
      status: "on-request",
      listed: false,
      active: true,
      published: false,
      addProperty: true,
      redirectToUserFlow: false,
      redirectToHome: true,
      company: company,
    }
    const page = get(formValue, 'signupScreen', null);
    if (formValue.owner) {
      data.owner = loggedInUser.user.id;
      await handleCreateActiveSingleProperty(data);
    } else if (page === 'login') {
      data.user = {
        username: login.email,
        password: login.password,
      };
      await handleDoLogin(data);
    } else {
      data.user = {
        ...register,
        name: `${register.firstName} ${register.lastName}`,
        userType: 'seller',
        signupAccept: true,
        signupChannel: get(formValue, 'channel', 'default'),
        signupProduct: null,
        language: lang || 'en',
        createUser: true,
        company: cookie.get('brixelStubCompany') || null,
        ignoreEmail: false,
        redirectTo: '/packageFlow/getStarted/success'
      };
      await handleValidateUser(data);
    }
    //handleCreateActiveSingleProperty({stub: getAchievement()});
    //reset('Property');
  };

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex = id;
    if (get(questions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      questions[newIndex].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (val !== cond.value && checkCond) {
          if (act === 'back') newIndex = newIndex - 1;
          else newIndex = newIndex + 1;
          checkCond = false;
        }
        return null;
      })
    }
    return newIndex
  }

  // FUNCTION TO GO TO NEXT SPEP
  const changeStep = (act) => {
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }

    let defId = checkCondition(newIndex, act);
    if (defId !== newIndex) defId = checkCondition(defId, act);

    // setPosition(newIndex);
    if (questions[defId].toSave) saveData();
    else {
      setIsEnter(false);
      setQuest(questions[defId]);
      setCurrentIndex(defId);
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
      const getOnlyQuest = questions.filter(item => item.inputs);
      setProgressBar(defId * 100 / getOnlyQuest.length);
    }
  };

  useEffect(() => {
    // SET DEFAULT LOCATION FOR DEV
    if (baseByData.env === 'dev') {
      /*const location = {
        type: "stateCode",
        country: "Schweiz",
        countryCode: "CH",
        name: "Ernastrasse",
        vicinity: "Kreis 4",
        address: "Ernastrasse, 8004 Zürich, Schweiz",
        latitude: 47.3807432,
        longitude: 8.516775800000005,
        state: "Zürich",
        stateCode: "ZH",
        zip: 8004,
        city: "Zürich",
      };*/
      //changeFieldValue('location', location);
    }
    // GET GAME GROUP TO POPULATE THE HOMEBASE SCREEN
    handleGetGamegroup();

    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({stub: defComp});
      setCookie('brixelStubCompany', defComp);
    } else {
      changeFieldValue('location.countryCode', 'all');
    }
    const getCurrentUrl = last(history.location.pathname.split('/'));
    if (getCurrentUrl !== questions[0].history || get(companyByUrl, 'company', null)) history.push(`/packageFlow/getStarted/${questions[0].history}`);
  }, []);

  useEffect(() => {
    setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')))
    setQuest(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[currentIndex])
  }, [lang]);
  // SET THE OWNER PROPERTY IF USER IS LOGGED IN
  useEffect(() => {
    if (loggedInUser.user) {
      changeFieldValue('owner', loggedInUser.user.id);
      changeFieldValue('signup', false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (get(initialValues, 'properties.propertyType', null)) {
      changeStep();
    }
  }, [initialValues])

  useEffect(() => {
    setIsEnter(true);
    if (get(questions, `[${currentIndex - 1}].history`, null) === 'locationInput') {
      const countryCodeLocation = get(formValue, 'location.countryCode', '');
      const countryCodeCompany = get(company, 'country.code', '');
      if (countryCodeCompany !== countryCodeLocation) {
        let newCountryStub = '';
        if (countryCodeLocation === 'CH') newCountryStub = 'brixel_zurich';
        if (countryCodeLocation === 'PT') newCountryStub = 'brixel_portugal';
        handleGetActiveSingleCompany({stub: newCountryStub})
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
      let newQuest = [];
      QuestionsList('en', get(formValue, 'location.countryCode', 'CH')).map((quest) => {
        if (quest.condition) {
          let isValid = true;
          quest.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false
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
      const propertyType = get(formValue, 'properties.propertyType', null);
      const pageTitle = titleProperty(formValue.location, propertyType, lang, formValue);
      if (pageTitle)
        changeFieldValue('pageTitle', pageTitle);
    }
  }, [formValue]);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (has(company, 'stub')) {
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
      changeFieldValue('company', company.stub)
      changeFieldValue('price.currency', get(company, 'country.currency', 'CHF'));
    }
  }, [company]);

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act) => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      quest.inputs.forEach((input) => {
        const err = get(errorValue, input.name, null);
        const noEmpty = get(formValue, input.name, 'ayc');
        if(noEmpty !== 'ayc') isNotEmpty = true;
        if (input.condition) {
          input.condition.forEach((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
          });
        } else if (input.validation) {
          //const getRegField = get(registeredFields
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
            })
          } else if (err !== true && err !== false && isValid) isValid = false;
        }
      });
    }
    if (quest.history === 'createProfile') {
      //console.log(quest);
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else if (currentIndex === 0) label = 'Next';
    else label = 'Next';
    return label;
  };

  return (
    <div id="bodyModalWrapper" className="withHeader">
      {
        get(quest, `inputs`, null) && (
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
        className="bodyModal"
        // disabled for this release
        style={{
          backgroundImage: `url(${quest.bgImg})`,
          //backgroundSize: roomValue
        }}
      >
        <form
          id="multiStepForm"
          autoComplete="off"
          className={`interactive dis-fl-col jc-b ${quest.background || ''}`}
        >
          <div className="multiStepSlides">
            <div
              className={`singleStep jc-c ${quest.vCentered ? 'vertCentered' : ''} ${isEnter || questions[currentIndex].effect ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer m-a">
                {
                  quest.effect === 'slideUp' && (
                    <>
                      {
                        questions[currentIndex - 1] && questions[currentIndex -1].inputs && (
                          <div id={`step-${currentIndex}`} className="dis-f flex-wrap activeQuestBack">
                            {
                              questions[currentIndex -1].titleGreen && (
                                <h3 className="txtGreen400 w-perc-100">{questions[currentIndex -1].titleGreen}</h3>
                              )
                            }
                            <h3 className={`${questions[currentIndex -1].subtitle ? 'mb-1' : 'mb-5'} w-perc-100`}>{questions[currentIndex -1].title}</h3>
                            {
                              questions[currentIndex -1].subtitle && (
                                <p className="mb-5 txtDark200 w-perc-100" dangerouslySetInnerHTML={{ __html: questions[currentIndex -1].subtitle }}/>)
                            }
                            <MultiFileldsReduxForm
                              form="GetStarted"
                              disableNextBtn={false}
                              formValue={formValue}
                              inputs={questions[currentIndex -1].inputs}
                              onClick={() => changeStep()}
                              onClickDisabled={!checkValidateField()}
                              showSendButton={true}
                            />
                          </div>
                        )
                      }
                    </>
                  )
                }
                {
                  quest.inputs && (
                    <div id={`step-${currentIndex}${quest.effect === 'slideUp' ? 'slideUp' : ''}`} className={`dis-f flex-wrap ${quest.effect === 'slideUp' ? 'slideUp' : ''} ${isEnter ? 'slide-enter-down' : ''}`}>
                      {
                        quest.titleGreen && (
                          <h3 className="txtGreen400 w-perc-100">{quest.titleGreen}</h3>
                        )
                      }
                      <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'} w-perc-100`}>{quest.title}</h3>
                      {
                        quest.subtitle && (
                          <p className="mb-5 txtDark200 w-perc-100" dangerouslySetInnerHTML={{ __html: quest.subtitle }}/>)
                      }
                      <MultiFileldsReduxForm
                        form="GetStarted"
                        disableNextBtn={false}
                        formValue={formValue}
                        inputs={quest.inputs}
                        onClick={() => changeStep()}
                        onCloseGoBack={() => changeStep('back')}
                        onClickDisabled={!checkValidateField()}
                        showSendButton={true}
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
                        ...quest
                      }
                    )
                  )
                }
                {
                  (get(quest, 'cardType', null) === 'card') && (
                    <div className="scaleAnim ta-c">
                      <img src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
                      <h5
                        className="fadeAnim mt-2 ta-c"
                        dangerouslySetInnerHTML={{ __html: quest.title}}
                      />
                      {
                        quest.subtitle && (
                          <h6
                            className="fadeAnim mt-2 ta-c"
                            dangerouslySetInnerHTML={{ __html: quest.subtitle}}
                          />
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={`footerAction shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="pos-r p-1 p-md-2">
              <div className={`buttonsHolder w-perc-100 a-c dis-fl-row m-a flex-wrap ${currentIndex === lastID ? 'jc-c' : 'jc-b'}`}>
                {
                  checkValidateField() && quest.successMessage && (
                    <div
                      className="txtWhite ta-r ml-a pr-1 textSuccess order-md-2 w-perc-flex-100 w-auto-md mb-1 mb-md-0"
                    >
                      {quest.successMessage}
                      <BrixelIcon icon="check" className="ml-1" />
                    </div>
                  )
                }
                {
                  questions[currentIndex] && questions[currentIndex].inputs && (
                    <BrixelButtonIcon
                      className={`shadow-2dp backBtn ${currentIndex === 0 ? 'hide' : ''} order-md-1`}
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
                <BrixelButtonPrimary
                  className={`order-md-3 noWrap w-perc-100 max-w-fix-160 ${currentIndex === 0 && !checkValidateField() ? 'ml-a' : ''} ${currentIndex === 0 ? `${!checkValidateField() ? '' : 'ml-md-0'} ml-a` : ''}`}
                  disabled={!checkValidateField()}
                  rounded
                  background="green"
                  saturation={400}
                  label={buttonLabel()}
                  rightIcon="arrow-right-small"
                  onClick={() => questions[currentIndex + 1] ? changeStep() : closeWindow()}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
};

GetStarted.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCreateActiveSingleProperty: PropTypes.func.isRequired,
  handleDoLogin: PropTypes.func.isRequired,
  handleGetCompanyByCountry: PropTypes.func.isRequired,
  handleValidateUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string,
  match: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  registeredFields: PropTypes.object,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => {
  const urlSearch = queryString.parse(get(props.history, 'location.search', ''));
  const channel = get(urlSearch, 'channel', 'default');
  const propertyType = get(urlSearch, 'propertyType', null)
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'form.GetStarted.syncErrors', {}),
    formValue: get(state, 'form.GetStarted.values', {}),
    gameGroup: get(state, 'gamification.gameGroup', []),
    gameHistory: get(state, 'gamification.gameHistory', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'form.GetStarted', null),
    initialValues: {
      company: null,
      channel: channel,
      price: {
        currency: get(state, 'companies.activeSingleCompany.country.currency', null)
      },
      changeCountry: null,
      properties: {
        propertyType: propertyType,
        typology: {
          livingArea: {
            unit: 'sqm'
          }
        }
      }
    }
  });
}

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetCompanyByCountry: bindActionCreators(getCompanyByCountry, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

const AnyForm = reduxForm({
  form: 'GetStarted',
  enableReinitialize: false,
  destroyOnUnmount: false,
})(GetStarted)

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AnyForm);
