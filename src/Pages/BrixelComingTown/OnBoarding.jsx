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
import {
  withRouter,
} from 'react-router-dom'
import { change, isValid, Field, reduxForm } from 'redux-form';
import Cookies from 'universal-cookie';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelInputText,
  BrixelCheckbox,
  BrixelProgressBar,
  Validation,
} from '@brixel/brixel-components';
import {
  getBrowserPlatform
} from '@brixel/brixel-components/src/utils/helper';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { doLogin, setAwards, setBrixelPoints, validateUser } from '../../actions/UserActions';
import { createActiveSingleProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData, setLanguage, setScreenNotification } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { QuestionsList } from '../../resources/brixelComintTownPropertyQuestion.js';
import { setCookie } from '../../utils/helpers';
import Maps from '../../components/Map/Maps';
import { translateTo } from '../../utils/translation';
import { getGamegroup } from '../../actions/GamificationActions';
import last from 'lodash/last';

const cookie = new Cookies();

function OnBoarding(props) {
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
    handleCreatePage,
    handleCreateUser,
    handleGetCompany,
    handleGetGameGroup,
    handleGetToken,
    handleSetAwards,
    handleSetLanguage,
    handleSetBrixelPoint,
    handleSetPage,
    handleSetNotification,
    history,
    lang,
    loggedInUser,
    pageState,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [showErrors, setShowError] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [Questions, setQuestions] = useState(QuestionsList(lang));
  const [curCountry, setCurCountry] = useState(null);

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
    handleGetGameGroup();
  }, []);

  const hideOnDesk = getBrowserPlatform().indexOf('desk') !== -1 ? 'hide-desktop' : 'dis-b-mobile';

  // SET the country from the value
  const countryObj = (curVal) => {
    const getCurrent = country.find((val) => val.full === curVal || val.value === curVal);
    setCurCountry(getCurrent);
  };

  useEffect(() => {
    if (loggedInUser.user) {
      changeFieldValue('owner', loggedInUser.user.id);
    }
  }, [loggedInUser]);

  // SET the default language in base of the company
  useEffect(() => {
    const cookieLang = cookie.get('brixelLang');
    if (company.languageCode && !cookieLang) {
      handleSetLanguage(company.languageCode.toLowerCase());
    }
    if (company.countryName) {
      countryObj(company.countryName);
    }
  }, [company]);

  const changePageTitle = () => {
    const pageTitle = `${formValue.bedrooms} ${translateTo(lang, 'Rooms')} ${translateTo(lang, formValue.propertyType)} - ${formValue.location.city}`;
    changeFieldValue('pageTitle', pageTitle);
  };

  // LOAD QUESTIONS ON CHANGING LANGUAGE
  useEffect(() => {
    setQuestions(QuestionsList(lang));
    if (formValue && formValue.location) {
      changePageTitle();
    }
  }, [lang]);

  // ON CHANGE VALUE AND STEP CHECK IF THE FIELDS ARE VALID
  useEffect(() => {
    let invalidField = false;
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
        return null;
      });
    }
    if (Questions[currentIndex].cardType && Questions[currentIndex].cardType === 'createProfile') {
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

  // ON change reducer pageState load the login page
  // Used to know if the account on sign up exist ad redirect to login
  useEffect(() => {
    if (pageState) {
      setLoginPage(true);
      setShowError(false);
    }
  }, [pageState]);

  // Function to Create the pageTitle
  useEffect(() => {
    if (formValue && formValue.location) {
      changePageTitle();
    }
  }, [formValue.location, formValue.propertyType, formValue.bedrooms]);

  // Function to save the data
  const saveData = (e) => {
    setShowError(false);
    let enableForm = true;
    // Check if exist any invalid field
    Object.keys(errorValue).map((key) => {
      if (errorValue[key] !== true && !isObject(errorValue[key]) && !loggedInUser.user) {
        setShowError(true);
        enableForm = false;
      }
      return null;
    });
    // Defaul Obj
    const data = {
      language: lang || 'en',
      title: formValue.pageTitle,
      status: "on-request",
      listed: false,
      active: true,
      published: false,
      properties: {
        propertyType: formValue.propertyType,
        typology: {
          bedrooms: formValue.bedrooms,
          livingArea: { value: +formValue.livingSpace, unit: "sqm" }
        },
        building: {
          built: formValue.constructionYear,
        }
      },
      location: formValue.location,
      ownerType: "seller",
      getEstimation: false, // not call the estimation function
      addProperty: true, // add the property
      redirectToUserFlow: true, // redirect the user to second part of flow
      company: cookie.get('brixelStubCompany') || null,
      packageFlowProcess: {
        propertyType: formValue.propertyType,
        bedrooms: formValue.bedrooms,
        livingArea: { value: +formValue.livingSpace, unit: "sqm" },
        built: formValue.constructionYear,
        location: formValue.location,
      },
    };
    // if form is valid
    if (enableForm) {
      // if user is logged in
      if (loggedInUser.user && loggedInUser.user.id) {
        changeFieldValue('owner', loggedInUser.user.id);
        data.owner = loggedInUser.user.id;
        handleCreatePage(data);
      } else if (loginPage) {
        // if user exist and is access by own account
        data.user = {
          username: formValue.email,
          password: formValue.password,
        };
        handleGetToken(data);
      } else {
        // if user not exist
        data.user = {
          email: formValue.email,
          name: `${formValue.firstName} ${formValue.lastName}`,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          userType: "seller",
          phone: formValue.phone,
          signupAccept: true,
          signupChannel: "default",
          signupProduct: null,
          language: lang || 'en',
          createUser: true,
          company: cookie.get('brixelStubCompany') || null,
          ignoreEmail: true, // not send the email to user with password,
          redirectTo: '/onBoarding/success',
        };
        handleCreateUser(data);
      }
    }
  };

  // Function to move next/prev question
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
    if (Questions[newPosition] && Questions[newPosition].conditions) {
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
    if (Questions[newPosition] && Questions[newPosition].conditions) {
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
      handleSetBrixelPoint(newPoints.actualPoints);
    }
    if (
      Questions[newPosition] &&
      Questions[newPosition].cardType &&
      Questions[newPosition].cardType === 'LastStep' &&
      loggedInUser.user && loggedInUser.user.id
    ) {
      saveData();
    }
    const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
    setProgressBar(newPosition * 100 / questInputs.length);
    setTimeout(() => {
      const getCurStep = document.getElementById(`step-${newPosition}`);
      if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
        getCurStep.querySelector('input[type="number"]').removeAttribute('autofocus');
        getCurStep.querySelector('input[type="number"]').setAttribute('autofocus', 'autofocus');
        getCurStep.querySelector('input[type="number"]').focus();
      }
      else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
        getCurStep.querySelector('input[type="text"]').removeAttribute('autofocus');
        getCurStep.querySelector('input[type="text"]').setAttribute('autofocus', 'autofocus');
        getCurStep.querySelector('input[type="text"]').focus();
      }
      if (document.getElementById('onBoarding')) {
        document.getElementById('onBoarding').scrollTo(0, 0);
      }
    }, 100);
    document.addEventListener('touchend', function(event) {
      const getCurStep = document.getElementById(`step-${newPosition}`);
      if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
        getCurStep.querySelector('input[type="number"]').removeAttribute('autofocus');
        getCurStep.querySelector('input[type="number"]').setAttribute('autofocus', 'autofocus');
        getCurStep.querySelector('input[type="number"]').focus();
      }
      else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
        getCurStep.querySelector('input[type="text"]').removeAttribute('autofocus');
        getCurStep.querySelector('input[type="text"]').setAttribute('autofocus', 'autofocus');
        getCurStep.querySelector('input[type="text"]').focus();
      }
    }, false);
    if (document.getElementById('onBoarding')) {
      document.getElementById('onBoarding').scrollTo(0, 0);
    }
    history.push(`/onBoarding/${Questions[newPosition].history}`);
  };

  useEffect(() => {
    // Function to detect the TAB
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        changeStep();
      }
      document.getElementById('onBoarding').scrollTo(0, 0);
    }, false);
    document.addEventListener('keyup', function (e) {
      document.getElementById('onBoarding').scrollTo(0, 0);
    }, false);
    // Get the company from url or cookie and set on cookie
    let company = get(history, 'location.search', cookie.get('brixelStubCompany') || null);
    const companyCookie = cookie.get('brixelStubCompany') || null;
    if (company || companyCookie) {
      company = company.replace('?company=', '');
      const defComp = company || companyCookie;
      handleGetCompany({stub: defComp});
      setCookie('brixelStubCompany', defComp);
    }
    // on load page redirect all to first step
    const getCurrentUrl = last(history.location.pathname.split('/'));
    if (getCurrentUrl !== Questions[0].history) history.push(`/onBoarding/${Questions[0].history}`);
  }, []);

  // Function to update the current index in base of History
  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
  };

  // Chack if user account just exist and redirect him to login part
  const switchLoginSignUpPage = (act) => {
    handleSetPage(null);
    handleSetNotification(null);
    setLoginPage(act);
  };

  const buttonLabel = () => {
    let label;
    if (!Questions[currentIndex + 2]) {
      if(loginPage) label = translateTo(lang, "Login");
      else label = translateTo(lang, "Create profile")
    } else {
      if (Questions[currentIndex].cardType === 'createProfile') {
        label = translateTo(lang, "Save");
      } else {
        label = translateTo(lang, "Continue");
      }
    }
    return label;
  };

  return (
    <main id="onBoarding">
      {
        Questions[currentIndex] && Questions[currentIndex].inputs && (
          <BrixelProgressBar
            saturation={400}
            barBackground="Light"
            backgroundSaturation={200}
            progressValue={progressBar}
          />
        )
      }
      <form
        id="multiStepForm"
        onSubmit={(e) => {e.preventDefault(); changeStep()}}
        autoComplete="off"
      >
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div
                id={`step-${i}`}
                className={`singleStep ${quest.background || ''}`}
                key={i.toString()}
                style={{
                  visibility: i !== currentIndex ? 'hidden' : 'visible',
                }}
              >
                <div className={`subcontainer ${quest.className || ''}`}>
                  {
                    quest.inputs && (
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
                                    <div className="mb-2 pos-r zIndex1">
                                      <Field
                                        name={input.name}
                                        label={input.label}
                                        component={() => (
                                          <Maps
                                            zoom={14}
                                            scrollZoom
                                            moveMarker
                                            draggable
                                            showSearchLocation
                                            showSelectCountry={true}
                                            showMap={true}
                                            isShowZip={false}
                                            className="w-perc-100"
                                            selCountry={curCountry ? curCountry.value : ''}
                                            changeCountry={(val) => {
                                              countryObj(val);
                                            }}
                                          />
                                        )}
                                        options={input.options}
                                        validate={input.validation}
                                        type={input.type}
                                        onChange={(e) => validateSlide(e, input.name, quest)}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="dis-f a-c jc-b">
                                    <div
                                      className={`${input.classNameBox || ''} dis-f a-c jc-b w-perc-100`}
                                      tabIndex="-1"
                                    >
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
                                          <span className="pl-2">{input.unit}</span>
                                        )
                                      }
                                    </div>
                                    {
                                      quest.inputs.length === 1 &&
                                      (input.type === 'number' || input.type === 'text') && (
                                        <BrixelButtonPrimary
                                          rounded
                                          label="Ok"
                                          className={`ml-2 ${hideOnDesk}`}
                                          background="green"
                                          onClick={() => changeStep()}
                                          disabled={disableNextBtn}
                                          type="submit"
                                        />
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
                          quest.cardType === 'Resume' && (
                            <div>
                              <div className="bgWhite max-w-fix-344 m-a brdRadius shadow-4dp ov-h">
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
                                className="mt-5 ta-c"
                                dangerouslySetInnerHTML={{ __html: quest.title}}
                              />
                            </div>
                          )
                        }
                        {
                          (quest.cardType === 'RewardsStep' || quest.cardType === 'LastStep') && (
                            <div className="ta-c">
                              <img src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
                              <h5
                                className="mt-2 ta-c"
                                dangerouslySetInnerHTML={{ __html: quest.title}}
                              />
                              {
                                quest.subtitle && (
                                  <h6
                                    className="mt-2 ta-c"
                                    dangerouslySetInnerHTML={{ __html: quest.subtitle}}
                                  />
                                )
                              }
                            </div>
                          )
                        }
                        {
                          quest.cardType === 'createProfile' && (
                            <div>
                              {
                                pageState && pageState.login ? (
                                  <h5>{translateTo(lang, pageState.login.message)}</h5>
                                ) : (
                                  <h5>{loginPage ? quest.loginTitle : quest.signupTitle}</h5>
                                )

                              }
                              {
                                loginPage ? (
                                  <>
                                    <p className="mb-md-9">
                                      <span
                                        className="txtPrimary400 cur-poi"
                                        onClick={() => switchLoginSignUpPage(false)}
                                      >
                                        {translateTo(lang, "You don't have a profile?")}
                                      </span>
                                    </p>
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label={translateTo(lang, "Email address")}
                                      name="email"
                                      placeholder=""
                                      type="email"
                                      validate={[Validation.required]}
                                      meta={{
                                        dirty: (showErrors || formValue.email) && errorValue.email !== true,
                                        invalid: (showErrors || formValue.email) && errorValue.email !== true,
                                      }}
                                      message={{
                                        error: translateTo(lang, "Please insert a valid email")
                                      }}
                                    />
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label={translateTo(lang, "Password")}
                                      name="password"
                                      placeholder=""
                                      type="password"
                                      validate={[Validation.required]}
                                      meta={{
                                        dirty: (showErrors || formValue.password) && errorValue.password !== true,
                                        invalid: (showErrors || formValue.password) && errorValue.password !== true,
                                      }}
                                      message={{
                                        error: translateTo(lang, "Please insert a valid password")
                                      }}
                                    />
                                    <p className="mt-1">
                                      <a
                                        className="txtPrimary400 cur-poi"
                                        href={`${baseByData.loginBasePath}/recover`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {translateTo(lang, "Forgot password?")}
                                      </a>
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="mb-md-9">
                                      <span
                                        className="txtPrimary400 cur-poi"
                                        onClick={() => switchLoginSignUpPage(true)}
                                      >
                                        {translateTo(lang, "You already have a profile?")}
                                      </span>
                                    </p>
                                    <div className="dis-f">
                                      <Field
                                        className="mt-2 w-perc-100 mr-2"
                                        component={BrixelInputText}
                                        label={translateTo(lang, "First name")}
                                        name="firstName"
                                        placeholder=""
                                        type="text"
                                        validate={[Validation.required]}
                                        meta={{
                                          dirty: (showErrors || formValue.firstName) && errorValue.firstName !== true,
                                          invalid: (showErrors || formValue.firstName) && errorValue.firstName !== true,
                                        }}
                                        message={{
                                          error: translateTo(lang, "Please insert a valid first name")
                                        }}
                                      />
                                      <Field
                                        className="mt-2 w-perc-100 ml-2"
                                        component={BrixelInputText}
                                        label={translateTo(lang, "Last name")}
                                        name="lastName"
                                        placeholder=""
                                        type="text"
                                        validate={[Validation.required]}
                                        meta={{
                                          dirty: (showErrors || formValue.lastName) && errorValue.lastName !== true,
                                          invalid: (showErrors || formValue.lastName) && errorValue.lastName !== true,
                                        }}
                                        message={{
                                          error: translateTo(lang, "Please insert a valid last name")
                                        }}
                                      />
                                    </div>
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label={translateTo(lang, "Email address")}
                                      name="email"
                                      placeholder=""
                                      type="email"
                                      validate={formValue.email ? [Validation.isEmail] : [Validation.required]}
                                      meta={{
                                        dirty: (showErrors || formValue.email) && errorValue.email !== true,
                                        invalid: (showErrors || formValue.email) && errorValue.email !== true,
                                      }}
                                      message={{
                                        error: translateTo(lang, "Please insert a valid email")
                                      }}
                                    />
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label={translateTo(lang, "Phone number")}
                                      name="phone"
                                      placeholder=""
                                      type="text"
                                    />
                                    <div className="mt-2">
                                      <Field
                                        component={BrixelCheckbox}
                                        options={[
                                          {
                                            // eslint-disable-next-line max-len
                                            label: translateTo(lang, `I hereby confirm that I have read, understand and accept the <a href="https://gobrixel.nl/voorwaarden/" target="_blank">terms</a> and <a href="https://gobrixel.nl/privacybeleid/" target="_blank">privacy policy</a> of Brixel.`),
                                            value: 'privacy'
                                          }
                                        ]}
                                        name="privacy"
                                        className="body2 w-perc-100 max-w-perc-100"
                                        validate={[Validation.required]}
                                        meta={{
                                          dirty: (showErrors || formValue.privacy) && errorValue.privacy !== true,
                                          invalid: (showErrors || formValue.privacy) && errorValue.privacy !== true,
                                        }}
                                        message={{
                                          error: translateTo(lang, "Please accept terms and privacy policy")
                                        }}
                                      />
                                    </div>
                                  </>
                                )
                              }
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
          className={`footerAction p-1 p-md-2 shadow-1dp-top ${disableNextBtn ? 'disabledNext' : `${Questions[currentIndex].inputs ? 'successNext' : 'normStep'}`}`}
        >
          <div className="container pos-r">
            <div className="subcontainer">
              {
                !disableNextBtn &&
                Questions[currentIndex] &&
                Questions[currentIndex].inputs &&
                Questions[currentIndex].successMessage && (
                  <p className="txtGreen700 ta-r mb-2 textSuccess">
                    {Questions[currentIndex].successMessage}
                    <BrixelIcon icon="check" className="ml-1" />
                  </p>
                )
              }
              <div
                className={`dis-f a-c ${Questions[currentIndex].inputs ? (hidePrevBtn ? 'jc-fe' : 'jc-b') : 'jc-c'}`}>
                {
                  Questions[currentIndex].inputs && (
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
                  Questions[currentIndex] && (
                    <BrixelButtonPrimary
                      rounded
                      label={buttonLabel()}
                      background={Questions[currentIndex].inputs ? "green" : "primary"}
                      className={Questions[currentIndex].inputs ? '' : 'max-w-fix-280 w-perc-100'}
                      onClick={() => Questions[currentIndex].cardType === 'createProfile' ? saveData() : changeStep()}
                      rightIcon="arrow-right-small"
                      disabled={disableNextBtn}
                    />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

OnBoarding.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  gameHistory: PropTypes.object,
  handleCreateUser: PropTypes.func.isRequired,
  handleCreatePage: PropTypes.func.isRequired,
  handleGetCompany: PropTypes.func.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
  handleGetToken: PropTypes.func.isRequired,
  handleSetAwards: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetPage: PropTypes.func.isRequired,
  handleSetBrixelPoint: PropTypes.func.isRequired,
  handleSetNotification: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValue: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  pageState: PropTypes.object,
  redirectTo: PropTypes.object,
};

OnBoarding.defaultProps = {
  pageState: null,
  redirectTo: null,
};

const mapStateToProps = (state, props) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  country: get(state, 'common.country', {}),
  errorValue: get(state, 'form.OnBoarding.syncErrors', {}),
  formValue: get(state, 'form.OnBoarding.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', []),
  initialValue: get(state, 'form.OnBoarding.initial', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  redirectTo: get(state, 'common.redirectTo', {}),
  lang: get(state, 'common.language', {}),
  pageState: get(state, 'common.setPageData', null),
  initialValues: {
    bedrooms: 0,
    owner: null,
  }
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('OnBoarding', field, value));
  },
  checkValid() {
    dispatch(isValid('OnBoarding'))
  },
  handleCreateUser: bindActionCreators(validateUser, dispatch),
  handleGetToken: bindActionCreators(doLogin, dispatch),
  handleGetCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetGameGroup: bindActionCreators(getGamegroup, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleCreatePage: bindActionCreators(createActiveSingleProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
  handleSetNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSetPage: bindActionCreators(setPageData, dispatch),
  handleSetAwards: bindActionCreators(setAwards, dispatch),
  handleSetBrixelPoint: bindActionCreators(setBrixelPoints, dispatch),
});

const OnBoardingForm = reduxForm({
  form: 'OnBoarding', // a unique identifier for this form
})(OnBoarding);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OnBoardingForm);
