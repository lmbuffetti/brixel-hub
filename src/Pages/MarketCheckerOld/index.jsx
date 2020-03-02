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
import { getToken, setAwards, setBrixelPoint, validateUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData, setLanguage, setNotification } from '../../actions/CommonActions';
import { getCompany } from '../../actions/CompanyActions';
import { QuestionsList } from '../../resources/brixelComintTownPropertyQuestion.js';
import { setCookie } from '../../utils/helpers';
import Maps from '../../components/Map/Maps';
import { translateTo } from '../../utils/translation';

const cookie = new Cookies();

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
  const [Questions, setQuestions] = useState(QuestionsList(lang));
  const [curCountry, setCurCountry] = useState(null);

  const hideOnDesk = getBrowserPlatform().indexOf('desk') !== -1 ? 'hide-desktop' : 'dis-b-mobile';

  // LOAD QUESTIONS ON CHANGING LANGUAGE
  useEffect(() => {
    setQuestions(QuestionsList(lang));
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
    setDisableNextBtn(invalidField);
  }, [errorValue, currentIndex]);

  // Function to save the data
  const saveData = (e) => {
    setShowError(false);
    let enableForm = true;
    // Check if exist any invalid field
    Object.keys(errorValue).map((key) => {
      if (errorValue[key] !== true && !isObject(errorValue[key]) && !loggedUser.user) {
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
      if (loggedUser.user && loggedUser.user.id) {
        changeFieldValue('owner', loggedUser.user.id);
        data.owner = loggedUser.user.id;
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
      Questions[newPosition].cardType === 'LastStep' &&
      loggedUser.user && loggedUser.user.id
    ) {
      saveData();
    }
    const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
    setProgressBar(newPosition * 100 / questInputs.length);
  };

  // Function to update the current index in base of History
  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
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
        Questions[currentIndex].inputs && (
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
                              <p className="body2">{input.help}</p>
                            </div>
                          ))
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
  handleCreateUser: PropTypes.func.isRequired,
  handleCreatePage: PropTypes.func.isRequired,
  handleGetCompany: PropTypes.func.isRequired,
  handleGetToken: PropTypes.func.isRequired,
  handleSetAwards: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetPage: PropTypes.func.isRequired,
  handleSetBrixelPoint: PropTypes.func.isRequired,
  handleSetNotification: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValue: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
  pageState: PropTypes.object,
  redirectTo: PropTypes.object,
};

OnBoarding.defaultProps = {
  pageState: null,
  redirectTo: null,
};

const mapStateToProps = (state, props) => ({
  company: get(state, 'companies.company', {}),
  country: get(state, 'common.country', {}),
  errorValue: get(state, 'form.OnBoarding.syncErrors', {}),
  formValue: get(state, 'form.OnBoarding.values', {}),
  initialValue: get(state, 'form.OnBoarding.initial', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
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
    dispatch(change('GamingFlow', field, value));
  },
  checkValid() {
    dispatch(isValid('GamingFlow'))
  },
  handleCreateUser: bindActionCreators(validateUser, dispatch),
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleGetCompany: bindActionCreators(getCompany, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
  handleSetNotification: bindActionCreators(setNotification, dispatch),
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
