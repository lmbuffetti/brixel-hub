/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import last from 'lodash/last';
import {
  withRouter,
} from 'react-router-dom'
import { change, isValid, Field, reduxForm } from 'redux-form';
import Cookies from 'universal-cookie';
import {
  BrixelButtonPrimary,
  BrixelButtonTertiary,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelProgressBar,
} from '@brixel/brixel-components';
import { doLogin, validateUser, saveActiveSingleUser, setAwards, setBrixelPoints } from '../../actions/UserActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData, setLanguage, setWindowDimensions } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { getGamegroup } from '../../actions/GamificationActions';
import { QuestionsList } from '../../resources/brixelComintTownPropertyQuestion.js';
import { setCookie } from '../../utils/helpers';
import Maps from '../../components/Map/Maps';
import { translateTo } from '../../utils/translation';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { titleProperty } from '../../utils/titleCreation';
import queryString from 'query-string';

const LoginSignup = Loadable({
  loader: () => import('../../components/LoginSignup' /* webpackChunkName: "LoginSignup" */),
  loading: Loading,
});

const cookie = new Cookies();

function GetStarted(props) {
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    company,
    country,
    errorValue,
    formValue,
    gameGroup,
    gameHistory,
    handleCreateActiveSingleProperty,
    handleValidateUser,
    handleGetActiveSingleCompany,
    handleDoLogin,
    handleSetLanguage,
    handleSetAwards,
    handleSetBrixelPoints,
    //handleSaveActiveSingleProperty,
    //handleSaveActiveSingleUser,
    handleGetGamegroup,
    history,
    lang,
    loggedInUser,
    windowDimensions
    //property,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [showErrors, setShowError] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  //const [showAddress, setShowAddress] = useState(true);
  const [Questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', '')));
  //const [curCountry, setCurCountry] = useState(null);
  const [showCountrySel, setShowCountrySel] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const countryObj = (curVal) => {
    const getCurrent = country.find((val) => val.value === curVal.toLowerCase() || val.value === curVal.toLowerCase());
    changeFieldValue('location.countryCode', curVal);
    changeFieldValue('location.countryName', get(getCurrent, 'label', ''));
    // setCurCountry(getCurrent);
  };

  useEffect(() => {
    const curVal = get(formValue, 'location.countryCode', '')
    if (curVal) {
      const getCurrent = country.find((val) => val.value === curVal.toLowerCase() || val.value === curVal.toLowerCase());
      changeFieldValue('location.countryName', get(getCurrent, 'label', ''));
    }
  }, [get(formValue, 'location.countryCode', null)])

  const changePageTitle = () => {
    if (formValue) {
      const pageTitle = titleProperty(formValue.location, formValue.propertyType, lang, formValue);
      if (pageTitle)
        changeFieldValue('pageTitle', pageTitle);
    }
  };

  useEffect(() => {
    if (baseByData.env === 'dev') {
      const location = {
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
      };
      changeFieldValue('location', location);
    }
    handleGetGamegroup();
  }, []);

  useEffect(() => {
    const cookieLang = cookie.get('brixelLang');
    if (company.languageCode && !cookieLang) {
      handleSetLanguage(company.languageCode.toLowerCase());
      const compLang = company.languageCode.toLowerCase();
      setQuestions(QuestionsList(compLang, get(formValue, 'location.countryCode', 'CH')));
    }
    if (company.countryCode) {
      countryObj(company.countryCode);
      const QuestFull = QuestionsList(lang, company.countryCode);
      setQuestions(QuestFull);
    }
  }, [company]);

  useEffect(() => {
    if (formValue) {
      changePageTitle();
    }
  }, [formValue, lang]);

  useEffect(() => {
    const Quest1 = QuestionsList(lang, get(formValue, 'location.countryCode', ''));
    // const Quest2 = PackageFlow(lang, gameGroup);
    const QuestFull = Quest1;
    setQuestions(QuestFull);
  }, [lang, gameGroup]);

  useEffect(() => {
    if (loggedInUser.user) {
      changeFieldValue('owner', loggedInUser.user.id);
      changeFieldValue('signup', false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    let invalidField = false;
    if (get(Questions, `[${currentIndex}].inputs`, null)) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
        return null;
      });
    }
    if (get(Questions, `[${currentIndex}].cardType`, null) === 'createProfile') {
      let fieldVal = [];
      if (loginPage) {
        fieldVal = ['email', 'password'];
      } else {
        fieldVal = ['firstName', 'lastName', 'email', 'privacy'];
      }
      fieldVal.map((inp) => {
        const curVal = get(errorValue, inp, true);
        if (curVal !== true) invalidField = true;
        return null;
      });
    }
    setDisableNextBtn(invalidField);
  }, [errorValue, currentIndex]);

  const saveData = async (act) => {
    setShowError(false);
    let enableForm = true;
    let fieldVal = [];
    if (loginPage) {
      fieldVal = ['email', 'password'];
    } else {
      fieldVal = ['firstName', 'lastName', 'email', 'privacy'];
    }
    fieldVal.map((key) => {
      if (errorValue[key] !== true && !isObject(errorValue[key]) && !loggedInUser.user) {
        setShowError(true);
        enableForm = false;
      }
      return null;
    });
    const data = {
      language: lang || 'en',
      packageFlowProcess: {
        answers: formValue,
        rewardScreenData: {},
      },
      title: formValue.pageTitle,
      status: "on-request",
      listed: false,
      active: true,
      published: false,
      properties: {
        propertyType: formValue.propertyType,
        typology: {
          bedrooms: formValue.bedrooms,
          bathrooms: formValue.bathrooms,
          separateToilets: formValue.separateToilets,
          livingArea: { value: +formValue.livingSpace, unit: "sqm" }
        },
        building: {
          built: formValue.constructionYear,
        }
      },
      location: formValue.location,
      getEstimation: formValue.location.country === 'CH',
      addProperty: true,
      redirectToUserFlow: false,
      redirectToHome: true,
      company: cookie.get('brixelStubCompany') || null,
    };

    if (enableForm) {
      if (loggedInUser.user && loggedInUser.user.id) {
        data.owner = loggedInUser.user.id;
        await handleCreateActiveSingleProperty(data);
      } else if (loginPage) {
        data.user = {
          username: formValue.email,
          password: formValue.password,
        };
        await handleDoLogin(data);
      } else {
        data.user = {
          email: formValue.email,
          name: `${formValue.firstName} ${formValue.lastName}`,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          userType: 'seller',
          phone: formValue.phone,
          signupAccept: true,
          signupChannel: "default",
          signupProduct: null,
          language: lang || 'en',
          createUser: true,
          company: cookie.get('brixelStubCompany') || null,
          ignoreEmail: false,
          redirectTo: '/packageFlow/getStarted/success'
        };
        await handleValidateUser(data);
      }
    }
  };

  const changeStep = (act) => {
    const getSellerLv1 = gameGroup.find(item => item.stub === 'seller-lvl1');
    let getHomeBase = {name: 'Homebase', points: 100};
    if (getSellerLv1 && getSellerLv1.achievements) getHomeBase = getSellerLv1.achievements.find(item => item.stub === 'homebase');
    let newPosition = position;
    if (act === 'back') {
      setDisableNextBtn(false);
      newPosition = position - 1;
    }
    else {
      if (disableNextBtn) return false;
      setDisableNextBtn(true);
      newPosition = position + 1;
    }
    if (get(Questions, `[${newPosition}].conditions`, null)) {
      let checkCond = true;
      Questions[newPosition].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (val !== cond.value && checkCond) {
          if (act === 'back') newPosition = newPosition - 1;
          else newPosition = newPosition + 1;
          checkCond = false;
        }
        return null;
      })
    }
    if (get(Questions, `[${newPosition}].conditions`, null)) {
      let checkCond = true;
      Questions[newPosition].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (val !== cond.value && checkCond) {
          if (act === 'back') newPosition = newPosition - 1;
          else newPosition = newPosition + 1;
          checkCond = false;
        }
        return null;
      });
    }
    if (get(Questions, `[${newPosition}].conditions`, null)) {
      let checkCond = true;
      Questions[newPosition].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (val !== cond.value && checkCond) {
          if (act === 'back') newPosition = newPosition - 1;
          else newPosition = newPosition + 1;
          checkCond = false;
        }
        return null;
      });
    }
    if (typeof Questions[newPosition] === 'undefined') {
      saveData('lastStep');
    } else {
      setPosition(newPosition);
      setCurrentIndex(newPosition);
      if (newPosition > 0) setHidePrevBtn(false);
      else setHidePrevBtn(true);
      if (
        Questions[newPosition] &&
        Questions[newPosition].cardType &&
        Questions[newPosition].cardType === 'RewardsStep'
      ) {
        let newPoints = gameHistory;
        if (newPoints && newPoints.actualPoints) {}
        else handleSetAwards(1);
        if (newPoints && newPoints.actualPoints) newPoints.actualPoints += getHomeBase.points;
        else newPoints = {actualPoints: getHomeBase.points};
        handleSetBrixelPoints(newPoints.actualPoints);
      }
      if (
        (Questions[position].cardType === 'LastStep' && loggedInUser && loggedInUser.user) ||
        (Questions[position].cardType === 'createProfile' && loggedInUser && !loggedInUser.user)
      ) {
        saveData();
      }
      const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
      setProgressBar(newPosition * 100 / questInputs.length);
      setTimeout(() => {
        const getCurStep = document.getElementById(`step-${newPosition}`);
        if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
          getCurStep.querySelector('input[type="number"]').focus();
        }
        else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
          getCurStep.querySelector('input[type="text"]').focus();
        }
        if (document.getElementById('getStarted')) {
          document.getElementById('getStarted').scrollTo(0, 0);
        }
      }, 100);
      if (document.getElementById('getStarted')) {
        document.getElementById('getStarted').scrollTo(0, 0);
      }
      history.push(`/packageFlow/getStarted/${Questions[newPosition].history}`);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        changeStep();
      }
      document.getElementById('getStarted').scrollTo(0, 0);
    }, false);
    document.addEventListener('keyup', function () {
      document.getElementById('getStarted').scrollTo(0, 0);
    }, false);
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({stub: defComp});
      setCookie('brixelStubCompany', defComp);
    }
    const getCurrentUrl = last(history.location.pathname.split('/'));
    if (getCurrentUrl !== Questions[0].history || get(companyByUrl, 'company', null)) history.push(`/packageFlow/getStarted/${Questions[0].history}`);
  }, []);

  useEffect(() => {
    if (typeof formValue.propertyType !== 'undefined' && get(Questions, `[${currentIndex}].successMessage`, null)) {
      let newPosition = position;
      setDisableNextBtn(true);
      newPosition = position + 1;
      setPosition(newPosition);
      setCurrentIndex(newPosition);
      const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
      setProgressBar(newPosition * 100 / questInputs.length);
      setTimeout(() => {
        const getCurStep = document.getElementById(`step-${newPosition}`);
        if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
          getCurStep.querySelector('input[type="number"]').focus();
        }
        else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
          getCurStep.querySelector('input[type="text"]').focus();
        }
        if (document.getElementById('getStarted')) {
          document.getElementById('getStarted').scrollTo(0, 0);
        }
      }, 100);
      if (document.getElementById('getStarted')) {
        document.getElementById('getStarted').scrollTo(0, 0);
      }
      history.push(`/packageFlow/getStarted/${Questions[newPosition].history}`);
    };
  }, [formValue.propertyType]);

  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
  };

  const buttonLabel = () => {
    let label;
    if (Questions[currentIndex].cardType === 'createProfile') {
      if(loginPage) label = translateTo(lang, "Login");
      else label = translateTo(lang, "Create profile")
    } else {
      if (Questions[currentIndex].cardType === 'createProfile') {
        label = translateTo(lang, "Save")
      } else {
        label = translateTo(lang, "Continue")
      }
    }
    return label;
  };

  const calcFlowContentHeight = () => {
    const flowHead = document.getElementsByClassName('flowHeader');
    const flowFooter = document.getElementsByClassName('footerAction');
    if (windowDimensions.width <= 1024)  {
      return flowHead[0]  && flowFooter[0] ? flowHead[0].offsetHeight + flowFooter[0].offsetHeight : 0;
    } else {
      return flowHead[0] ? flowHead[0].offsetHeight : 0;
    }
  };

  useEffect(() => {
    if (!disableNextBtn &&
      get(Questions, `[${currentIndex}].inputs`, null) &&
      get(Questions, `[${currentIndex}].successMessage`, null)) {
        setIsSuccess(true)
    } else {
      setIsSuccess(false)
    }
  })

  return (
    <div className="getStartedWrapper h-perc-100 w-perc-100">
      {
        get(Questions, `[${currentIndex}].inputs`, null) && (
          <BrixelProgressBar
            large
            saturation={400}
            barBackground="Light"
            backgroundSaturation={300}
            progressValue={progressBar}
          />
        )
      }
      <main id="getStarted" className="notranslate">
        <form id="multiStepForm" onSubmit={(e) => {e.preventDefault(); changeStep()}} autoComplete="off">
          <div
            className="slideMultiStepForm"
            style={
              {transform: `translate(-${position * 100}%, 0)`, height: windowDimensions.height - calcFlowContentHeight()}
            }
          >
            {
              Questions.map((quest, i) => (
                <div
                  id={`step-${i}`}
                  className={`singleStep ${Questions[currentIndex].cardType} ${quest.background || ''} ${quest.vCentered ? 'vertCentered' : ''}`}
                  key={i.toString()}
                  style={{
                    visibility: i !== currentIndex ? 'hidden' : 'visible',
                    opacity: i !== currentIndex ? '0' : '1',
                    paddingBottom: !quest.vCentered && !quest.background && windowDimensions.width <= 1024 && isSuccess  ? '30px' : '',
                  }}
                >
                  <div className={`subcontainer ${i !== currentIndex ? '' : quest.className || ''}`}>
                    {
                      get(quest, 'inputs', null) && (
                        <>
                          {
                            quest.titleGreen && (
                              <h5 className="txtGreen400 fsize-md-800">{quest.titleGreen}</h5>
                            )
                          }
                          <h5 className="mb-4 mb-md-10 fsize-md-800">{quest.title}</h5>
                          {
                            quest.inputs.map((input, f) => (
                              <div key={f.toString()}>
                                {
                                  input.type === 'Map' ? (
                                    <>
                                      <div className="mb-2 pos-r zIndex4">
                                        <Field
                                          name={input.name}
                                          component={() => (
                                            <Maps
                                              formName="GetStarted"
                                              zoom={14}
                                              scrollZoom
                                              moveMarker
                                              draggable
                                              showSearchLocation
                                              showSelectCountry={showCountrySel}
                                              showMap={false}
                                              inputLabel={input.label}
                                              isShowZip={false}
                                              className="w-perc-100"
                                              selCountry={get(formValue, 'location.countryCode', '')}
                                              changeCountry={(val) => {
                                                countryObj(val);
                                                setShowCountrySel(false);
                                              }}
                                            />
                                          )}
                                          options={input.options}
                                          validate={input.validation}
                                          type={input.type}
                                          onChange={(e) => validateSlide(e, input.name, quest)}
                                        />

                                        {
                                          !showCountrySel && (
                                            <BrixelButtonTertiary
                                              className="mt-1"
                                              label={
                                                translateTo(lang, get(formValue, 'location.countryName', `🌍 ${translateTo(lang, 'Everywhere')}`))}
                                              onClick={() => setShowCountrySel(true)}
                                            />
                                          )
                                        }

                                      </div>
                                      {
                                        formValue.location && formValue.location.address && (
                                          <>
                                            <div
                                              className="pos-r zIndex1"
                                            >
                                              <Maps
                                                formName="GetStarted"
                                                zoom={14}
                                                scrollZoom
                                                moveMarker
                                                draggable
                                                showMap
                                                isShowZip={false}
                                                className="w-perc-100"
                                              />
                                            </div>
                                          </>
                                        )
                                      }
                                    </>
                                  ) : (
                                    <div className="dis-f a-b jc-b">
                                      <div className={`${input.classNameBox || ''} dis-f a-b jc-b w-perc-100`} tabIndex="-1">
                                        <Field
                                          className="w-perc-100"
                                          inputClassName={input.className || ''}
                                          name={input.name}
                                          label={input.label}
                                          icons={quest.icons}
                                          component={quest.component}
                                          fluid={true}
                                          options={quest.options}
                                          validate={input.validation}
                                          type={input.type}
                                          step={+input.step}
                                          min={input.min}
                                          onChange={(e) => validateSlide(e, input.name, quest)}
                                          deactivable={false}
                                          placeholder={input.placeholder || ''}
                                          meta={{
                                            dirty: formValue[input.name] && errorValue[input.name] !== true,
                                            invalid: true,
                                          }}
                                          modal={null}
                                          message={{
                                            help: null,
                                            error: errorValue[input.name],
                                          }}
                                          minLenghtNum={input.minLenghtNum || null}
                                          maxLengthNum={input.maxLenghtNum || null}
                                        />
                                        {
                                          input.unit && (
                                            <span className="pl-2 h-fix-48 dis-f a-c">{input.unit}</span>
                                          )
                                        }
                                      </div>
                                      {
                                        quest.inputs.length === 1 && (input.type === 'number' || input.type === 'text') && (
                                          <div className="h-fix-48 dis-f a-c">
                                            <BrixelButtonPrimary
                                              rounded
                                              label="Ok"
                                              className="ml-2 hide-md"
                                              background="green"
                                              onClick={() => changeStep()}
                                              disabled={disableNextBtn}
                                              type="submit"
                                            />
                                          </div>
                                        )
                                      }
                                    </div>
                                  )
                                }
                                <p className="body2">{input.help}</p>
                              </div>
                            ))
                          }
                        </>
                      )
                    }
                    {
                      quest.cardType && (
                        <>
                          {
                            get(quest, 'cardType', null) === 'Resume' && (
                              <div>
                                <div className="scaleAnim bgWhite max-w-fix-344 m-a brdRadius shadow-4dp ov-h">
                                  <img
                                    src={quest[`img${formValue.propertyType || 'Apartment'}`]}
                                    className="dis-b"
                                    alt={formValue.propertyType || 'Apartment'}
                                  />
                                  <div className="pt-1 pb-2 px-2">
                                    {
                                      formValue.location && (
                                        <p className="body2 cutRow txtPrimary400">
                                          {formValue.location.address}
                                        </p>
                                      )
                                    }
                                    <h6 className="mt-1 mb-5">{formValue.pageTitle || 'Title'}</h6>
                                    <div className="dis-f jc-b a-c">
                                      <p className="dis-f a-c">
                                        <BrixelIcon icon="bed" className="mr-1" />
                                        <span className="ff-mono body2">{formValue.bedrooms || '0'}</span>
                                      </p>
                                      <p className="dis-f a-c">
                                        <BrixelIcon icon="plans" className="mr-1" />
                                        <span className="ff-mono body2">{formValue.livingSpace || '0'} m</span>
                                      </p>
                                      <p className="dis-f a-c">
                                        <BrixelIcon icon="house-built" className="mr-1" />
                                        <span className="ff-mono body2">
                                          {formValue.constructionYear || '0000'}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <h5
                                  className="fadeAnim mt-5 ta-c"
                                  dangerouslySetInnerHTML={{ __html: quest.title}}
                                />
                              </div>
                            )
                          }
                          {
                            (get(quest, 'cardType', null) === 'RewardsStep' || get(quest, 'cardType', null) === 'LastStep') && (
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
                          {
                            get(quest, 'cardType', null) === 'createProfile' && (
                              <div>
                                <h5>{loginPage ? quest.loginTitle : quest.signupTitle}</h5>
                                <LoginSignup
                                  formName="GetStarted"
                                  onChangeLogin={(val) => setLoginPage(val)}
                                  showErrors={showErrors}
                                />
                              </div>
                            )
                          }
                        </>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <div
            className={
              `footerAction px-2 py-1 py-md-2 shadow-1dp-top
              ${disableNextBtn ? 'disabledNext' : `${Questions[currentIndex].inputs ? 'successNext' : 'normStep'}`}`
            }
          >
            <div
              className={
                `dis-f a-c
                  ${get(Questions, `[${currentIndex}].inputs`, null) ? (hidePrevBtn ? 'jc-fe' : 'jc-b') : 'jc-c'}`
              }
            >
              {
                get(Questions, `[${currentIndex}].inputs`, null) && get(Questions, `[${currentIndex - 1}].inputs`, null) && (
                  <BrixelButtonIcon
                    className={`${hidePrevBtn ? 'hide' : ''} shadow-2dp backBtn`}
                    icon="arrow-simple-left"
                    onClick={() => changeStep('back')}
                    background="white"
                    saturation={0}
                    color="primary"
                    saturationTxt={400}
                    noBorder
                  />
                )
              }
              {
                !disableNextBtn &&
                get(Questions, `[${currentIndex}].inputs`, null) &&
                get(Questions, `[${currentIndex}].successMessage`, null) && (
                  <div className="txtGreen700 ta-r ml-a pr-1 textSuccess">
                    {Questions[currentIndex].successMessage}
                    <BrixelIcon icon="check" className="ml-1" />
                  </div>
                )
              }
              {
                get(Questions, `[${currentIndex}]`, null) && (
                  <BrixelButtonPrimary
                    rounded
                    label={buttonLabel()}
                    background={Questions[currentIndex].inputs ? "green" : "primary"}
                    className={Questions[currentIndex].inputs ? '' : 'max-w-fix-280 w-perc-100'}
                    onClick={() => changeStep()}
                    rightIcon="arrow-right-small"
                    disabled={disableNextBtn}
                  />
                )
              }
            </div>

          </div>
        </form>
      </main>
    </div>
  );
}

GetStarted.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  gameHistory: PropTypes.object,
  handleValidateUser: PropTypes.func.isRequired,
  handleCreateActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleDoLogin: PropTypes.func.isRequired,
  handleSetAwards: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetBrixelPoints: PropTypes.func.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  property: PropTypes.object,
  redirectTo: PropTypes.object,
  windowDimensions: PropTypes.object.isRequired,
};

GetStarted.defaultProps = {
  gameHistory: {},
  property: {},
  redirectTo: null,
};

const mapStateToProps = (state) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  country: get(state, 'common.country', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', {}),
  formValue: get(state, 'form.GetStarted.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', []),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  redirectTo: get(state, 'common.redirectTo', {}),
  lang: get(state, 'common.language', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  initialValues: {
    bedrooms: 0,
    owner: null,
    location: {},
  }
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  checkValid() {
    dispatch(isValid('GetStarted'))
  },
  handleValidateUser: bindActionCreators(validateUser, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleSetError: bindActionCreators(errorMessage, dispatch),
  handleSetAwards: bindActionCreators(setAwards, dispatch),
  handleSetBrixelPoints: bindActionCreators(setBrixelPoints, dispatch),
  handleSetPageData: bindActionCreators(setPageData, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

const getStartedForm = reduxForm({
  form: 'GetStarted', // a unique identifier for this form
  enableReinitialize: true,
})(GetStarted);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(getStartedForm);
