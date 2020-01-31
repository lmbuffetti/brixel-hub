/* global Transifex */
import React, {
  useEffect,
  useRef,
  createRef,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
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
  Validation,
} from '@brixel/brixel-components';
import { getToken, setAwards, setBrixelPoint, validateUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData } from '../../actions/CommonActions';
import { QuestionsList } from '../../resources/brixelComintTownPropertyQuestion.js';
import { setCookie } from '../../utils/helpers';
import Maps from '../../components/Map/Maps';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';
import { translateTo } from '../../utils/translation';

const cookie = new Cookies;

function OnBoarding(props) {
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    errorValue,
    formValue,
    handleCreatePage,
    handleCreateUser,
    handleGetToken,
    handleSetAwards,
    handleSetBrixelPoint,
    history,
    lang,
    loggedUser,
    redirectTo,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [showErrors, setShowError] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hideNextBtn, setHideNextBtn] = useState(true);
  const [disablePrevBtn, setDisablePrevBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [showAddress, setShowAddress] = useState(true);
  const [Questions, setQuestions] = useState(QuestionsList(lang));
  // REF
  const listInputs = Questions.filter((item) => typeof item.inputs !== 'undefined');
  const elementsRef = useRef(listInputs.map((item) => createRef()));

  const extractTitle = (title) => {
    if (typeof title === 'object') {
      return title.House;
    }
    return title;
  };

  useEffect(() => {
    setQuestions(QuestionsList(lang));
  }, [lang]);

  useEffect(() => {
    let invalidField = false;
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
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
      document.getElementById('onBoarding').scrollTo(0, 0);
    }, false);
    document.addEventListener('keyup', function (e) {
      document.getElementById('onBoarding').scrollTo(0, 0);
    }, false);
    const test = cloneDeep(history);
    let company = get(history, 'location.search', null);
    if (company) company = company.replace('?company=', '');
    setCookie('brixelStubCompany', company);
    history.push(`/onBoarding/${Questions[0].history}`);
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
    setPosition(newPosition);
    setCurrentIndex(newPosition);
    if (newPosition > 0) setHidePrevBtn(false);
    else setHidePrevBtn(true);
    if (Questions[newPosition] && Questions[newPosition].cardType && Questions[newPosition].cardType === 'RewardsStep') {
      handleSetBrixelPoint([{desc: "First Award", point: 50}]);
      handleSetAwards([{desc: "First Award", point: 1}]);
    }
    if (Questions[newPosition] && Questions[newPosition].cardType && Questions[newPosition].cardType === 'LastStep' && loggedUser.user && loggedUser.user.id) {
      saveData();
    }
    const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
    setProgressBar(newPosition * 100 / questInputs.length);
    const getCurStep = document.getElementById(`step-${newPosition}`);
    if (getCurStep.querySelector('input[type="number"]')) getCurStep.querySelector('input[type="number"]').focus();
    if (getCurStep.querySelector('input[type="text"]')) getCurStep.querySelector('input[type="text"]').focus();
    document.getElementById('onBoarding').scrollTo(0, 0);
    history.push(`/onBoarding/${Questions[newPosition].history}`);
  };

  const saveData = (e) => {
    setShowError(false);
    Object.keys(errorValue).map((key) => {
      if (errorValue[key] !== true) {
        setShowError(true);
        return false;
      }
    });
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
          build: formValue.constructionYear,
        }
      },
      location: formValue.location,
      ownerType: "seller",
      getEstimation: false,
      addProperty: true,
      redirectToUserFlow: true,
      company: cookie.get('brixelStubCompany') || null,
    };
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
        userType: "seller",
        phone: formValue.phone,
        signupAccept: true,
        signupChannel: "default",
        signupProduct: null,
        language: lang || 'en',
        createUser: true,
        company: cookie.get('brixelStubCompany') || null,
        ignoreEmail: true,
      };
      handleCreateUser(data);
    }
  };

  return (
    <main id="onBoarding">
      {
        Questions[currentIndex].inputs && (
          <div id="progressBar"><span className="activeProgBar" style={{ width: `${progressBar}%` }} /></div>
        )
      }
      <form id="multiStepForm" onSubmit={(e) => {e.preventDefault(); changeStep()}} autoComplete="off">
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div id={`step-${i}`} className="singleStep" key={i.toString()} style={{ visibility: i !== currentIndex ? 'hidden' : 'visible' }}>
                <div className={`subcontainer ${quest.className || ''}`}>
                  {
                    quest.inputs && (
                      <>
                        {
                          quest.titleGreen && (
                            <h5 className="txtGreen400">{quest.titleGreen}</h5>
                          )
                        }
                        <h5 className="mb-4 mb-md-9">{quest.title}</h5>
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
                                              showSelectCountry
                                              showMap={false}
                                              isShowZip={false}
                                              className="w-perc-100"
                                            />
                                          )}
                                          options={input.options}
                                          validate={input.validation}
                                          type={input.type}
                                          onChange={(e) => validateSlide(e, input.name, quest)}
                                        />
                                      </div>
                                      {
                                        formValue.location && formValue.location.address && (
                                          <>
                                            <div className="dis-f jc-b pos-r zIndex3 my-2 w-perc-100">
                                              <p>{translateTo(lang, "Is this the place?")}</p>
                                              <button
                                                onClick={() => changeFieldValue('location', {})}
                                              >
                                                <span className="txtGreen400">{translateTo(lang, "Change")}</span>
                                              </button>
                                            </div>
                                            <div
                                              className="pos-r zIndex1"
                                              onMouseEnter={() => setShowAddress(false)}
                                              onTouchStart={() => setShowAddress(false)}
                                              onMouseLeave={() => setShowAddress(true)}
                                              onTouchEnd={() => setShowAddress(true)}

                                            >
                                              {
                                                showAddress && (
                                                  <div className="curAdr">{formValue.location.address}</div>
                                                )
                                              }
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
                                        quest.inputs.length === 1 && (input.type === 'number' || input.type === 'text') && !input.step && (
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
                          quest.cardType === 'Resume' && (
                            <div>
                              <div className="max-w-fix-264 m-a bgRed100 brdRadius shadow-4dp ov-h">
                                <img src={quest[`img${formValue.propertyType}`]} />
                                <div className="py-2 px-2">
                                  {
                                    formValue.location && <p className="body2 cutRow txtPrimary400">{formValue.location.address}</p>
                                  }
                                  <h6 className="txtRed700 mt-2 mb-4">{formValue.pageTitle}</h6>
                                  <div className="dis-f jc-b a-c">
                                    <p className="dis-f a-c">
                                      <BrixelIcon icon="bed" className="mr-1" />
                                      <span className="ff-mono body2">{formValue.rooms}</span>
                                    </p>
                                    <p className="dis-f a-c">
                                      <BrixelIcon icon="plans" className="mr-1" />
                                      <span className="ff-mono body2">{formValue.livingSpace} m</span>
                                    </p>
                                    <p className="dis-f a-c">
                                      <BrixelIcon icon="house-built" className="mr-1" />
                                      <span className="ff-mono body2">{formValue.constructionYear}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <h5 className="mt-5 ta-c" dangerouslySetInnerHTML={{ __html: quest.title}} />
                            </div>
                          )
                        }
                        {
                          (quest.cardType === 'RewardsStep' || quest.cardType === 'LastStep') && (
                            <div className="ta-c">
                              <img src={quest.img} alt={quest.title} className="max-w-fix-232" />
                              <h5 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.title}} />
                              {quest.subtitle && (<h6 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.subtitle}} />)}
                            </div>
                          )
                        }
                        {
                          quest.cardType === 'createProfile' && (
                            <div>
                              <h5>{loginPage ? quest.loginTitle : quest.signupTitle}</h5>
                              {
                                loginPage ? (
                                  <>
                                    <p className="mb-md-9">
                                      <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(false)}>
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
                                  </>
                                ) : (
                                  <>
                                    <p className="mb-md-9">
                                      <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(true)}>
                                        {translateTo(lang, "You already have an account?")}
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
                                        options={[{label: translateTo(lang, `I hereby confirm that I have read, understand and accept the <a href="https://gobrixel.nl/voorwaarden/" target="_blank">terms</a> and <a href="https://gobrixel.nl/privacybeleid/" target="_blank">privacy policy</a> of Brixel.`), value: 'privacy'}]}
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
        <div className={`footerAction p-1  shadow-1dp-top ${disableNextBtn ? 'disabledNext' : `${Questions[currentIndex].inputs ? 'successNext' : 'normStep'}`}`}>
          <div className="subcontainer">
            {
              !disableNextBtn && Questions[currentIndex] && Questions[currentIndex].inputs && Questions[currentIndex].successMessage && (
                <p className="txtGreen700 ta-r mb-2 textSuccess">
                  {Questions[currentIndex].successMessage}
                  <BrixelIcon icon="check" className="ml-1" />
                </p>
              )
            }
            <div className={`dis-f a-c ${Questions[currentIndex].inputs ? (hidePrevBtn ? 'jc-fe' : 'jc-b') : 'jc-c'}`}>
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
                      !Questions[currentIndex + 2] ?
                        translateTo(lang, "Create Profile") :
                        (
                          Questions[currentIndex].cardType === 'createProfile' ?
                            translateTo(lang, "Save") :
                            translateTo(lang, "Continue")
                        )
                    }
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
      </form>
    </main>
  );
}

OnBoarding.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
  handleCreatePage: PropTypes.func.isRequired,
  handleGetToken: PropTypes.func.isRequired,
  handleSetAwards: PropTypes.func.isRequired,
  handleSetBrixelPoint: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
  redirectTo: PropTypes.object,
};

OnBoarding.defaultProps = {
  redirectTo: null,
};

const mapStateToProps = (state, props) => ({
  errorValue: get(state, 'form.OnBoarding.syncErrors', {}),
  formValue: get(state, 'form.OnBoarding.values', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  redirectTo: get(state, 'common.redirectTo', {}),
  lang: get(state, 'common.language', {}),
  initialValues: {
    bedrooms: 0,
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
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
  handleSetPage: bindActionCreators(setPageData, dispatch),
  handleSetAwards: bindActionCreators(setAwards, dispatch),
  handleSetBrixelPoint: bindActionCreators(setBrixelPoint, dispatch),
});

const OnBoardingForm = reduxForm({
  form: 'OnBoarding', // a unique identifier for this form
})(OnBoarding);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OnBoardingForm);
