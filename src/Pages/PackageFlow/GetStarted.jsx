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
  BrixelButtonTertiary,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelProgressBar,
} from '@brixel/brixel-components';
import { getToken, setAwards, setBrixelPoint, validateUser, updateUser } from '../../actions/UserActions';
import { addProperty, updateProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData, setLanguage } from '../../actions/CommonActions';
import { getCompany } from '../../actions/CompanyActions';
import { QuestionsList } from '../../resources/brixelComintTownPropertyQuestion.js';
import { PackageFlow } from '../../resources/packageFlowGetstartedQuestions.js';
import { setCookie } from '../../utils/helpers';
import Maps from '../../components/Map/Maps';
import { translateTo } from '../../utils/translation';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

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
    handleCreatePage,
    handleCreateUser,
    handleGetCompany,
    handleGetToken,
    handleSetLanguage,
    handleSetAwards,
    handleSetBrixelPoint,
    handleUpdatePage,
    handleUpdateUser,
    history,
    lang,
    loggedUser,
    property,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [showErrors, setShowError] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginPage] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  //const [showAddress, setShowAddress] = useState(true);
  const [Questions, setQuestions] = useState(QuestionsList(lang));
  const [curCountry, setCurCountry] = useState(null);
  const [showCountrySel, setShowCountrySel] = useState(false);

  const countryObj = (curVal) => {
    const getCurrent = country.find((val) => val.full === curVal || val.value === curVal);
    setCurCountry(getCurrent);
  };

  const changePageTitle = () => {
    const pageTitle = `${formValue.bedrooms} ${translateTo(lang, 'Rooms')} ${translateTo(lang, formValue.propertyType)} - ${formValue.location.city}`;
    changeFieldValue('pageTitle', pageTitle);
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
  }, []);

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
    const Quest1 = QuestionsList(lang);
    const Quest2 = PackageFlow(lang);
    const QuestFull = Quest1.concat(Quest2);
    setQuestions(QuestFull);
    if (formValue && formValue.location) {
      changePageTitle();
    }
  }, [lang]);

  useEffect(() => {
    if (loggedUser.user) {
      changeFieldValue('owner', loggedUser.user.id);
      changeFieldValue('signup', false);
    }
  }, [loggedUser]);

  useEffect(() => {
    let invalidField = false;
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
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

  useEffect(() => {
    if (formValue && formValue.location) {
      changePageTitle();
    }
  }, [formValue]);

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
      if (errorValue[key] !== true && !isObject(errorValue[key]) && !loggedUser.user) {
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
          build: formValue.constructionYear,
        }
      },
      location: formValue.location,
      ownerType: formValue.ownerType,
      getEstimation: formValue.location.country === 'CH',
      addProperty: true,
      redirectToUserFlow: false,
      redirectToHome: false,
      company: cookie.get('brixelStubCompany') || null,
    };
    if (enableForm) {
      if (loggedUser.user && loggedUser.user.id) {
        if (act === 'LastStep') {
          const pageData = {
            id: property.id,
            ownerType: formValue.ownerType,
            typeOfBuyer: formValue.typeOfBuyer,
            whenToSell: formValue.apartmentSellTiming,
            redirectTo: `/packageFlow/${property.id}/rewards`,
          };
          const userData = {
            id: loggedUser.user.id,
            userType: formValue.ownerType
          };
          await handleUpdateUser(userData);
          await handleUpdatePage(pageData);
        } else {
          changeFieldValue('owner', loggedUser.user.id);
          data.owner = loggedUser.user.id;
          await handleCreatePage(data);
        }
      } else if (loginPage) {
        data.user = {
          username: formValue.email,
          password: formValue.password,
        };
        await handleGetToken(data);
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
          redirectTo: '/packageFlow/getStarted/success'
        };
        await handleCreateUser(data);
      }
    }
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
    if (typeof Questions[newPosition] === 'undefined') {

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
        handleSetBrixelPoint([{desc: "First Award", point: 50}]);
        handleSetAwards([{desc: "First Award", point: 1}]);
      }
      if (
        (Questions[position].cardType === 'LastStep' && loggedUser && loggedUser.user) ||
        (Questions[position].cardType === 'createProfile' && loggedUser && !loggedUser.user)
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
        document.getElementById('getStarted').scrollTo(0, 0);
      }, 100);
      document.getElementById('getStarted').scrollTo(0, 0);
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

  return (
    <main id="getStarted">
      {
        Questions[currentIndex].inputs && (
          <BrixelProgressBar
            rounded
            saturation={700}
            small
            barBackground="Red"
            backgroundSaturation={100}
            progressValue={42}
          />
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
                                            showSelectCountry={showCountrySel}
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
                                            label={
                                              curCountry ?
                                                translateTo(lang, curCountry.label) :
                                                `🌍 ${translateTo(lang, 'Everywhere')}`
                                            }
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
                              <h5>{loginPage ? quest.loginTitle : quest.signupTitle}</h5>
                              <LoginSignup
                                formName="GetStarted"
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
                  Questions[currentIndex].inputs && Questions[currentIndex - 1] && Questions[currentIndex - 1].inputs && (
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
                      onClick={() => changeStep()}
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
  handleUpdateUser: PropTypes.func.isRequired,
  handleUpdatePage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
  property: PropTypes.object,
  redirectTo: PropTypes.object,
};

GetStarted.defaultProps = {
  property: {},
  redirectTo: null,
};

const mapStateToProps = (state) => ({
  company: get(state, 'companies.company', {}),
  country: get(state, 'common.country', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', {}),
  formValue: get(state, 'form.GetStarted.values', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
  redirectTo: get(state, 'common.redirectTo', {}),
  lang: get(state, 'common.language', {}),
  initialValues: {
    bedrooms: 0,
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
  handleUpdatePage: bindActionCreators(updateProperty, dispatch),
  handleUpdateUser: bindActionCreators(updateUser, dispatch),
});

const getStartedForm = reduxForm({
  form: 'GetStarted', // a unique identifier for this form
  enableReinitialize: true,
})(GetStarted);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(getStartedForm);
