/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import Cookies from 'universal-cookie';
import {
  withRouter,
} from 'react-router-dom';
import {
  change, isValid, Field, reduxForm,
} from 'redux-form';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelButtonSecondary,
  BrixelButtonTertiary,
  BrixelProgressBar,
} from '@brixel/brixel-components';
import { saveActiveSingleUser, setAwards, setBrixelPoints } from '../../actions/UserActions';
import { setScreenNotification, setWindowDimensions } from '../../actions/CommonActions';
import { QuestionsList } from '../../resources/brixelComintTownUserQuestion';
import Maps from '../../components/Map/Maps';
import { translateTo } from '../../utils/translation';
import { getActiveSingleCompany } from '../../actions/CompanyActions';

const cookie = new Cookies();

function UserFlow(props) {
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    company,
    errorValue,
    formValue,
    handleSaveActiveSingleUser,
    handleGetActiveSingleCompany,
    handleSetNotification,
    history,
    lang,
    loggedInUser,
    windowDimensions,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressBar, setProgressBar] = useState(0);
  const [emptyValue, setEmptyValue] = useState(true);
  const [oneEmptyValue, setOneEmptyValue] = useState(true);
  const [hasToSave, setHasToSave] = useState(true);
  const [Questions, setQuestions] = useState(QuestionsList(lang));
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // On load redirect all to first route of flow
    history.push(`/onBoarding/brixelComingInTown/${Questions[0].history}`);
    // GET Company data by cookie
    const companyCookie = cookie.get('brixelStubCompany') || null;
    if (companyCookie) handleGetActiveSingleCompany({ stub: companyCookie });
  }, []);

  // LOAD QUESTIONS ON CHANGING LANGUAGE
  useEffect(() => {
    setQuestions(QuestionsList(lang));
  }, [lang]);

  const calcFlowContentHeight = () => {
    const flowHead = document.getElementsByClassName('flowHeader');
    const flowFooter = document.getElementsByClassName('footerAction');
    if (windowDimensions.width <= 1024) {
      if (Questions[currentIndex].cardType === 'chat') {
        return flowHead[0] ? flowHead[0].offsetHeight : 0;
      }
      return flowHead[0] && flowFooter[0] ? flowHead[0].offsetHeight + flowFooter[0].offsetHeight : 0;
    }
    return flowHead[0] ? flowHead[0].offsetHeight : 0;
  };

  useEffect(() => {
    // Check if the user token exist or redirect to Onboarding
    if (typeof cookie.get('brixelToken') === 'undefined') history.push('/onBoarding');
    if (loggedInUser.user) {
      if (loggedInUser.user.brixelComingFlowProcess && loggedInUser.user.brixelComingFlowProcess.answers && Object.keys(loggedInUser.user.brixelComingFlowProcess.answers).length > 0) {
        setHasToSave(false);
        history.push('/onBoarding/brixelComingInTown/chat');
        const curIndex = Questions.findIndex((item) => item.history === 'chat');
        setCurrentIndex(curIndex);
        setPosition(curIndex);
      }
    }
  }, [loggedInUser]);

  // ON CHANGE VALUE AND STEP CHECK IF THE FIELDS ARE VALID
  useEffect(() => {
    let invalidField = false;
    let noValueField = false;
    let oneValueField = true;
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
        return null;
      });
    }
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(formValue, inp.name, true);
        if (curVal === true || !curVal) noValueField = true;
        return null;
      });
    }
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(formValue, inp.name, true);
        if (curVal !== true) oneValueField = false;
        return null;
      });
    }
    setEmptyValue(noValueField);
    setOneEmptyValue(oneValueField);
    setDisableNextBtn(invalidField);
  }, [errorValue, currentIndex, formValue]);

  // Function to update the current index in base of History
  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
    document.getElementById('onBoarding').scrollTo(0, 0);
  };

  // Function to create the email
  const extractEmaildata = () => {
    const formData = formValue;
    let email = `<p><b>Name</b> ${loggedInUser.user.name}</p>`;
    email += `<p><b>Email</b> ${loggedInUser.user.email}</p>`;
    email += `<p><b>User Id</b> ${loggedInUser.user.id}</p>`;
    email += `<p><b>Company</b> ${company.name || 'default'}</p>`;
    const formInputs = QuestionsList('en').filter((itm) => typeof itm.inputs !== 'undefined');
    Object.keys(formData).map((key) => {
      formInputs.map((input) => {
        const getField = input.inputs.find((subVal) => subVal.name === key);
        let getFieldValueLabel = formData[key];
        if (input.options) {
          getFieldValueLabel = input.options.find((subVal) => subVal.value === formData[key]);
          if (getFieldValueLabel) getFieldValueLabel = getFieldValueLabel.label;
        }
        if (isObject(formData[key]) && !isArray(formData[key])) {
          let obj = 0;
          Object.keys(formData[key]).map((multiKey) => {
            const getFieldCur = input.inputs.find((subVal) => subVal.name.split('.')[1] === multiKey);
            const getSubField = input.options.find((subVal) => subVal.value === formData[key][multiKey]);
            if (getFieldCur && getSubField) {
              if (obj === 0 && email) email += '<hr />';
              email += `<p><b>${getFieldCur.labelEmail || getFieldCur.label}</b> ${getSubField.label} - ${getSubField.value}</p>`;
              obj += 1;
            }
            return null;
          });
        } else if (isArray(formData[key])) {
          let arr = 0;
          formData[key].map((val) => {
            if (input.options) {
              const getSubField = input.options.find((subVal) => subVal.value === val);
              if (getSubField && getField) {
                if (arr === 0 && email) email += '<hr />';
                email += `<p><b>${getField.labelEmail || getField.label}</b> ${getSubField.label}</p>`;
                arr += 1;
              }
            }
            return null;
          });
        } else if (getField) {
          if (email) email += '<hr />';
          email += `<p><b>${getField.labelEmail || getField.label}</b> ${getFieldValueLabel || formData[key]}</p>`;
        }
        return null;
      });
      return null;
    });
    return email;
  };

  // Function to save the data
  const saveData = () => {
    const message = extractEmaildata();
    // Save the obj data
    const data = {
      brixelComingFlowProcess: {
        answers: formValue,
      },
      id: loggedInUser.user.id,
      sendEmail: {
        company: company.stub || null, // email destinatary
        recipientEmail: 'support@brixel.io', // email
        subject: `New Sign up - Brixel Coming In Town - ${company.name || 'default'}`,
        message: `<h1>New Sign up - Brixel Coming In Town - ${company.name || 'default'}</h1> ${message}`,
      },
    };
    // Call to redux funciton to update the user
    if (hasToSave) {
      handleSaveActiveSingleUser(data);
    }
  };

  // Function to move next/prev question
  const changeStep = (act) => {
    let newPosition;
    handleSetNotification(null);
    if (act === 'back') {
      setDisableNextBtn(false);
      newPosition = position - 1;
    } else {
      setDisableNextBtn(true);
      setEmptyValue(true);
      newPosition = position + 1;
    }
    setPosition(newPosition);
    setCurrentIndex(newPosition);
    // if the current slide is not the first show the prev button arrow or hide
    if (newPosition > 0) setHidePrevBtn(false);
    else setHidePrevBtn(true);
    // Filter by inputs to calc the number of steps with field and calc the progress bar
    const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
    setProgressBar((newPosition * 100) / questInputs.length);
    // If the current and the preview are not steps with inputs save the data
    if (Questions[newPosition - 1].inputs && !Questions[newPosition].inputs) saveData();
    // Change the url in base of history key on question object
    history.push(`/onBoarding/brixelComingInTown/${Questions[newPosition].history}`);
  };

  const checkRedirectLink = (url) => {
    let newUrl = url;
    if (!url.includes('http') && !url.includes('https')) {
      newUrl = `https://${url}`;
    }
    return newUrl;
  };

  useEffect(() => {
    if (
      !disableNextBtn && Questions[currentIndex] &&
      Questions[currentIndex].inputs &&
      Questions[currentIndex].successMessage
      && !emptyValue
    ) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  });

  return (
    <div className="onBoardingWrapper">
      {
        Questions[currentIndex].inputs && (
          <BrixelProgressBar
            rounded
            saturation={700}
            small
            barBackground="Red"
            backgroundSaturation={100}
            progressValue={progressBar}
          />
        )
      }
      <main
        id="onBoarding"
        className="notranslate"
      >
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
        >
          <div
            className="multiStepSlides"
            style={
              {
                transform: `translate(-${position * 100}%, 0)`,
                height: windowDimensions.height - calcFlowContentHeight(),
              }
            }
          >
            {
              Questions.map((quest, i) => (
                <div
                  id={`step-${i}`}
                  className={`singleStep ${quest.background || ''} ${quest.vCentered ? 'vertCentered' : ''} ${Questions[currentIndex].cardType}`}
                  key={i.toString()}
                  style={{
                    visibility: i !== currentIndex ? 'hidden' : 'visible',
                    opacity: i !== currentIndex ? '0' : '1',
                    paddingBottom: !quest.vCentered && !quest.background && windowDimensions.width <= 1024 && isSuccess ? '30px' : '',
                  }}
                >
                  <div className="subcontainer">
                    {
                      quest.inputs && (
                        <>
                          {
                            quest.titleGreen && (
                              <h5 className="txtGreen400">{quest.titleGreen}</h5>
                            )
                          }
                          <h5 className="mb-4 mb-md-10">{quest.title}</h5>
                          {
                            quest.inputs.map((input, f) => (
                              <div key={f.toString()}>
                                {
                                  input.type === 'Map' ? (
                                    <>
                                      <div className="mb-2 pos-r zIndex3">
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
                                            <div className="dis-f jc-b pos-r zIndex2 my-2 w-perc-100">
                                              <p>Is this the place?</p>
                                              <button
                                                type="button"
                                                onClick={() => changeFieldValue('location', {})}
                                              >
                                                Change
                                              </button>
                                            </div>
                                            <div className="pos-r zIndex1">
                                              <div className="curAdr">{formValue.location.address}</div>
                                              <Maps
                                                zoom={14}
                                                scrollZoom
                                                moveMarker
                                                draggable
                                                showMap
                                                isShowZip={false}
                                              />
                                            </div>
                                          </>
                                        )
                                      }
                                    </>
                                  ) : (
                                    <div className="dis-f a-t jc-b">
                                      <div className={`${input.type === 'number' || input.type === 'text' ? 'dis-f a-c' : ''} jc-b w-perc-100`}>
                                        <Field
                                          className={`mb-2 w-perc-100 ${input.className}`}
                                          limit={input.max}
                                          name={input.name}
                                          label={input.label}
                                          icons={quest.icons}
                                          pdClass={input.pdClass}
                                          component={quest.component}
                                          fluid
                                          options={quest.options}
                                          validate={input.validation}
                                          type={input.type}
                                          step={+input.step}
                                          min={input.min}
                                          max={input.max}
                                          onChange={(e) => validateSlide(e, input.name, quest)}
                                          deactivable={input.deactivable || false}
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
                                            label={translateTo(lang, 'Ok')}
                                            className="ml-2"
                                            background="primary"
                                            onClick={() => changeStep()}
                                            disabled={disableNextBtn}
                                            type="submit"
                                          />
                                        )
                                      }
                                    </div>
                                  )
                                }
                                {
                                  get(input, 'help', null) && (
                                    <p className="body2">{get(input, 'help', null)}</p>
                                  )
                                }
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
                            quest.cardType === 'RewardsStep' && (
                              <div className="ta-c">
                                <img src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
                                <h5 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.title }} />
                                {quest.subtitle && (<h6 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)}
                              </div>
                            )
                          }
                          {
                            quest.cardType === 'LastStep' && (
                              <div>
                                <h5 className="mb-2 mb-md-9 ta-l" dangerouslySetInnerHTML={{ __html: quest.title }} />
                                <img src={quest.img} alt={quest.title} className="w-perc-100" />
                                {quest.subtitle && (<h5 className="mt-2 ta-l" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)}
                              </div>
                            )
                          }
                          {
                            (quest.cardType === 'chat') && (
                              <div>
                                <div className="dis-f a-c mb-4">
                                  <img src={quest.img} alt="" />
                                  <h5 className="ml-3" dangerouslySetInnerHTML={{ __html: quest.title }} />
                                </div>
                                <div className="chatContainer">
                                  {
                                    quest.message && quest.message.map((msg, f) => (
                                      <div className="messageChat" dangerouslySetInnerHTML={{ __html: msg }} key={f.toString()} />
                                    ))
                                  }
                                </div>
                                <div className="dis-f w-perc-100 jc-fe chatBtn">
                                  <BrixelButtonSecondary
                                    rounded
                                    label={translateTo(lang, 'No thanks')}
                                    color="primary"
                                    onClick={() => window.location.href = company.contactWebsite ? checkRedirectLink(company.contactWebsite) : 'https://brixel.ch'}
                                    disabled={disableNextBtn}
                                  />
                                  <BrixelButtonPrimary
                                    className="ml-1"
                                    rounded
                                    label={translateTo(lang, 'Yes, of course')}
                                    background="green"
                                    onClick={() => changeStep()}
                                    disabled={disableNextBtn}
                                  />
                                </div>
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
          {
            Questions[currentIndex].cardType !== 'chat' && (
              <div
                className={
                  `footerAction px-2 py-1 py-md-2 shadow-1dp-top ${disableNextBtn ? 'disabledNext' :
                    `${Questions[currentIndex].inputs && !emptyValue ? 'successNext' : 'normStep'}`}`
                }
              >
                <div
                  className={
                    `dis-f a-c ${Questions[currentIndex].inputs ? (hidePrevBtn ? 'jc-fe' : 'jc-b') :
                      (Questions[currentIndex].cardType === 'LastStep' ? 'jc-b' : 'jc-c')}`
                  }
                >
                  {
                    Questions && Questions[currentIndex] !== 'undefined' &&
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
                    !disableNextBtn && Questions[currentIndex] && Questions[currentIndex].inputs && Questions[currentIndex].successMessage && !emptyValue && (
                      <div className="txtGreen700 ta-r ml-a pr-1 textSuccess">
                        {Questions[currentIndex].successMessage}
                        <BrixelIcon icon="check" className="ml-1" />
                      </div>
                    )
                  }
                  {
                    (
                      Questions[currentIndex].inputs ||
                      (
                        Questions[currentIndex + 1] &&
                        Questions[currentIndex + 1].inputs
                      )) ? (
                        <>
                          <BrixelButtonPrimary
                            rounded
                            label={
                              oneEmptyValue &&
                              Questions[currentIndex].inputs ?
                                translateTo(lang, 'Skip') :
                                translateTo(lang, 'Continue')
                            }
                            background={Questions[currentIndex].inputs ? 'green' : 'primary'}
                            className={Questions[currentIndex].inputs ? '' : 'max-w-fix-280 w-perc-100'}
                            onClick={() => changeStep()}
                            rightIcon="arrow-right-small"
                            disabled={disableNextBtn}
                          />
                        </>
                      ) : (
                        <>
                          {
                            Questions[currentIndex].cardType === 'LastStep' && (
                              <>
                                <BrixelButtonIcon
                                  className="shadow-2dp backBtn"
                                  icon="arrow-simple-left"
                                  onClick={() => changeStep('back')}
                                  background="white"
                                  saturation={0}
                                  color="primary"
                                  saturationTxt={400}
                                  noBorder
                                />
                                <BrixelButtonTertiary
                                  rounded
                                  label={translateTo(lang, 'Back to our website')}
                                  color="primary"
                                  onClick={() => window.location.href = company.contactWebsite ? checkRedirectLink(company.contactWebsite) : 'https://brixel.ch'}
                                  rightIcon="arrow-right-small"
                                  disabled={disableNextBtn}
                                />
                              </>
                            )
                          }
                        </>
                      )
                  }
                </div>

              </div>
            )
          }
        </form>
      </main>
    </div>
  );
}

UserFlow.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  handleSetNotification: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

UserFlow.defaultProps = {
  lang: 'en',
};

const mapStateToProps = (state) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, 'form.UserFlow.syncErrors', {}),
  formValue: get(state, 'form.UserFlow.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  lang: get(state, 'common.language', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('UserFlow', field, value));
  },
  checkValid() {
    dispatch(isValid('UserFlow'));
  },
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSetAwards: bindActionCreators(setAwards, dispatch),
  handleSetBrixelPoints: bindActionCreators(setBrixelPoints, dispatch),
  handleSetNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

const UserFlowForm = reduxForm({
  form: 'UserFlow', // a unique identifier for this form
})(UserFlow);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(UserFlowForm);
