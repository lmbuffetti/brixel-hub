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
import ReactGA from 'react-ga';
import {
  BrixelButtonPrimary,
  BrixelButtonTertiary,
  BrixelButtonIcon,
  BrixelIcon,
  FactsOptions,
} from '@brixel/brixel-components';
import { getToken, setAwards, setBrixelPoint, validateUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData, setLanguage } from '../../actions/CommonActions';
import { getCompany } from '../../actions/CompanyActions';
import { QuestionsList } from '../../resources/packageFlowGetstartedQuestions.js';
import { setCookie } from '../../utils/helpers';
import Maps from '../../components/Map/Maps';
import { translateTo } from '../../utils/translation';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
const swissZipCode = require('../../resources/swissZipCodes.json');

const LoginSignup = Loadable({
  loader: () => import('../../components/LoginSignup' /* webpackChunkName: "LoginSignup" */),
  loading: Loading,
});

const cookie = new Cookies;

function GetStarted(props) {
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    company,
    country,
    errorValue,
    formValue,
    handleCreatePage,
    handleCreateUser,
    handleGetCompany,
    handleGetToken,
    handleSetLanguage,
    history,
    lang,
    loggedUser,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [showErrors, setShowError] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [showAddress, setShowAddress] = useState(true);
  const [Questions, setQuestions] = useState(QuestionsList(lang));
  const [curCountry, setCurCountry] = useState(null);
  const [showCountrySel, setShowCountrySel] = useState(false);

  const countryObj = (curVal) => {
    const getCurrent = country.find((val) => val.full === curVal || val.value === curVal);
    setCurCountry(getCurrent);
  };

  useEffect(() => {
    const cookieLang = cookie.get('brixelLang');
    if (company.languageCode && !cookieLang) {
      handleSetLanguage(company.languageCode.toLowerCase());
    }
    if (company.countryName) {
      countryObj(company.countryName);
    }
  }, [company]);

  useEffect(() => {
    setQuestions(QuestionsList(lang));
  }, [lang]);

  useEffect(() => {
    if (loggedUser.user) {
      changeFieldValue('owner', loggedUser.user.id);
    }
  }, [loggedUser]);

  useEffect(() => {
    let invalidField = false;
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        // Check if teh current fields are valid
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
        // If no zipCode and Country is Swiss get info from swissZipCodes json
        if (Questions[currentIndex].history === 'zipInput') {
          const zipVal = get(formValue, Questions[currentIndex].inputs[0].name, 0);
          if (+zipVal > 999) {
            // Select record by zipcode
            const filterFile = swissZipCode.find(zip => +zip["Postleitzahl / Code Postal / Codice Postale"] === zipVal);
            // Check if Abréviation is the same
            if (filterFile && formValue.location.stateCode === filterFile["Abkürzung / Abréviation / Abbreviazione"]) {
              changeFieldValue('location.city', filterFile['Ort / Ville / Città']);
              if (!formValue.location.state) changeFieldValue('location.state', filterFile['Canton']);
              if (!formValue.location.stateCode) changeFieldValue('location.state', filterFile['Abkürzung / Abréviation / Abbreviazione']);
              invalidField = false;
            } else {
              invalidField = true;
            }
          } else {
            invalidField = true;
          }
        }
      });
    }
    setDisableNextBtn(invalidField);
  }, [errorValue, currentIndex]);

  useEffect(() => {
    if (formValue && formValue.location && !formValue.pageTitle) {
      var titleAdjectives = [
        'Beautiful',
        'Charming',
        'Elegant',
        'Prestigious',
        'One-of-a-kind',
        'Exquisite',
        'Spacious',
        'Gorgeous',
        'Wonderful',
        'Lovely',
        'Superb',
        'Amazing',
        'Stunning',
        'Sophisticated',
        'Modern',
        'Incredible'
      ];
      // Create the title of the page
      let pageTitle = `${titleAdjectives[Math.floor(Math.random() * titleAdjectives.length)]} ${formValue.propertyType}`;

      // Try to add location to the title
      if (formValue.location.city) {
        pageTitle += ' in ' + formValue.location.city;
      } else if (formValue.location.state) {
        pageTitle += ' in ' + formValue.location.state;
      } else if (formValue.location.country) {
        pageTitle += ' in ' + formValue.location.country;
      } else {
        pageTitle += ' in ' + formValue.location.address;
      }
      changeFieldValue('pageTitle', pageTitle);
    }
  }, [formValue]);

  useEffect(() => {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        changeStep();
      }
      document.getElementById('getStarted').scrollTo(0, 0);
    }, false);
    document.addEventListener('keyup', function (e) {
      document.getElementById('getStarted').scrollTo(0, 0);
    }, false);
    const cookieCompany = cookie.get('brixelStubCompany') || null;
    let company = get(history, 'location.search', cookieCompany);
    if (company || cookieCompany) {
      company = company.replace('?company=', '');
      const defComp = company || cookieCompany;
      handleGetCompany({stub: defComp});
      setCookie('brixelStubCompany', defComp);
    }
    history.push(`/packageFlow/getStarted/${Questions[0].history}`);
  }, []);

  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
  };

  const changeStep = (act) => {
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
      })
    }
    setPosition(newPosition);
    setCurrentIndex(newPosition);
    if (newPosition > 0) setHidePrevBtn(false);
    else setHidePrevBtn(true);
    if (
      Questions[newPosition] &&
      Questions[newPosition].cardType &&
      Questions[newPosition].cardType === 'createProfile' &&
      loggedUser.user &&
      loggedUser.user.id
    ) {
      saveData();
    }
    const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
    setProgressBar(newPosition * 100 / questInputs.length);
    setTimeout(() => {
      const getCurStep = document.getElementById(`step-${newPosition}`);
      if (getCurStep.querySelector('input[type="number"]')) {
        getCurStep.querySelector('input[type="number"]').focus();
      }
      else if (getCurStep.querySelector('input[type="text"]')) {
        getCurStep.querySelector('input[type="text"]').focus();
      }
      document.getElementById('getStarted').scrollTo(0, 0);
    }, 100);
    document.getElementById('getStarted').scrollTo(0, 0);
    history.push(`/packageFlow/getStarted/${Questions[newPosition].history}`);
  };

  const saveData = (e) => {
    setShowError(false);
    let enableForm = true;
    Object.keys(errorValue).map((key) => {
      if (errorValue[key] !== true && !isObject(errorValue[key]) && !loggedUser.user) {
        setShowError(true);
        enableForm = false;
      }
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
          build: formValue.constructionYear,
        }
      },
      location: formValue.location,
      ownerType: formValue.ownerType,
      getEstimation: formValue.location.country === 'CH',
      addProperty: true,
      redirectToUserFlow: false,
      redirectToRewards: true,
      company: cookie.get('brixelStubCompany') || null,
    };
    if (enableForm) {
      if (loggedUser.user && loggedUser.user.id) {
        changeFieldValue('owner', loggedUser.user.id);
        data.owner = loggedUser.user.id;
        handleCreatePage(data);
      } else if (loginPage) {
        data.user = {
          username: formValue.email,
          password: formValue.password,
        };
        handleGetToken(data);
      } else {
        data.user = {
          email: formValue.email,
          name: `${formValue.firstName} ${formValue.lastName}`,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          userType: formValue.ownerType,
          phone: formValue.phone,
          signupAccept: true,
          signupChannel: "default",
          signupProduct: null,
          language: lang || 'en',
          createUser: true,
          company: cookie.get('brixelStubCompany') || null,
          ignoreEmail: false,
        };
        handleCreateUser(data);
      }
    }
  };

  return (
    <main id="getStarted">
      {
        Questions[currentIndex].inputs && (
          <div id="progressBar"><span className="activeProgBar" style={{ width: `${progressBar}%` }} /></div>
        )
      }
      <form id="multiStepForm" onSubmit={(e) => {e.preventDefault(); changeStep()}} autoComplete="off">
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
                                      <div className="mb-2 pos-r zIndex4">
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
                                              showSelectCountry={!curCountry || showCountrySel}
                                              showMap={false}
                                              isShowZip={false}
                                              className="w-perc-100"
                                              selCountry={curCountry ? curCountry.value : ''}
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
                                              label={curCountry ? curCountry.label : ''}
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
                                              onMouseEnter={() => setShowAddress(false)}
                                              onTouchStart={() => setShowAddress(false)}
                                              onMouseLeave={() => setShowAddress(true)}
                                              onTouchEnd={() => setShowAddress(true)}

                                            >
                                              <Maps
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
                                    <div className="dis-f a-c jc-b">
                                      <div className={`${input.classNameBox || ''} dis-f a-c jc-b w-perc-100`} tabIndex="-1">
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
                                            invalid: formValue[input.name] && errorValue[input.name] !== true,
                                          }}
                                        />
                                        {
                                          input.unit && (
                                            <span className="pl-2">{input.unit}</span>
                                          )
                                        }
                                      </div>
                                      {
                                        quest.inputs.length === 1 && (input.type === 'number' || input.type === 'text') && (
                                          <BrixelButtonPrimary
                                            rounded
                                            label="Ok"
                                            className="ml-2 hide-md"
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
                            )
                          )
                        }
                      </>
                    )
                  }
                  {
                    quest.cardType && (
                      <>
                        {
                          quest.cardType === 'createProfile' && (
                            <div>
                              <h5>{loginPage ? quest.loginTitle : quest.signupTitle}</h5>
                              <LoginSignup showErrors={showErrors} />
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
          className={`footerAction p-1 shadow-1dp-top ${disableNextBtn ? 'disabledNext' : `${Questions[currentIndex].inputs ? 'successNext' : 'normStep'}`}`}
        >
          <div className="container">
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
                    label={
                      !Questions[currentIndex + 1] && !loggedUser.user ?
                        translateTo(lang, "Create profile") :
                        (
                          Questions[currentIndex].cardType === 'createProfile' ||
                          !Questions[currentIndex + 2] ?
                            translateTo(lang, "Save") :
                            translateTo(lang, "Continue")
                        )
                    }
                    background={Questions[currentIndex].inputs ? "green" : "primary"}
                    className={Questions[currentIndex].inputs ? '' : 'max-w-fix-280 w-perc-100'}
                    onClick={() =>
                      !Questions[currentIndex + 1] ||
                      (loggedUser.user && !Questions[currentIndex + 2]) ?
                        saveData() : changeStep()
                    }
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

GetStarted.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
  handleCreatePage: PropTypes.func.isRequired,
  handleGetCompany: PropTypes.func.isRequired,
  handleGetToken: PropTypes.func.isRequired,
  handleSetAwards: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetBrixelPoint: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
  redirectTo: PropTypes.object,
};

GetStarted.defaultProps = {
  redirectTo: null,
};

const mapStateToProps = (state, props) => ({
  company: get(state, 'companies.company', {}),
  country: get(state, 'common.country', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', {}),
  formValue: get(state, 'form.GetStarted.values', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  redirectTo: get(state, 'common.redirectTo', {}),
  lang: get(state, 'common.language', {}),
  initialValues: {
    bedrooms: 0,
    bathrooms: 0,
    separateToilets: 0,
    owner: null,
  }
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  checkValid() {
    dispatch(isValid('GetStarted'))
  },
  handleCreateUser: bindActionCreators(validateUser, dispatch),
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleGetCompany: bindActionCreators(getCompany, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
  handleSetPage: bindActionCreators(setPageData, dispatch),
  handleSetAwards: bindActionCreators(setAwards, dispatch),
  handleSetBrixelPoint: bindActionCreators(setBrixelPoint, dispatch),
});

const getStartedForm = reduxForm({
  form: 'GetStarted', // a unique identifier for this form
})(GetStarted);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(getStartedForm);
