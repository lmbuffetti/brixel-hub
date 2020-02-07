/* global Transifex */
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
} from 'react-router-dom'
import { change, isValid, Field, reduxForm } from 'redux-form';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelButtonSecondary,
  BrixelButtonTertiary,
} from '@brixel/brixel-components';
import { updateUser, setAwards, setBrixelPoint, validateUser } from '../../actions/UserActions';
import { setNotification } from '../../actions/CommonActions';
import { QuestionsList } from '../../resources/brixelComintTownUserQuestion.js';
import Maps from '../../components/Map/Maps';
import { translateTo } from '../../utils/translation';
import { getCompany } from '../../actions/CompanyActions';

const cookie = new Cookies;

function UserFlow(props) {
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    company,
    errorValue,
    formValue,
    handleUpdateUser,
    handleGetCompany,
    handleSetAwards,
    handleSetBrixelPoint,
    handleSetNotification,
    history,
    lang,
    loggedUser,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressBar, setProgressBar] = useState(0);
  const [emptyValue, setEmptyValue] = useState(true);
  const [Questions, setQuestions] = useState(QuestionsList(lang));

  useEffect(() => {
    // TODO: Change logic to save/get brixels and awards
    handleSetBrixelPoint([{desc: "Homebase", point: 50}, {desc: "Newcomer", point: 100}]);
    handleSetAwards([{desc: "Homebase", point: 1}, {desc: "Newcomer", point: 1}]);
    // On load redirect all to first route of flow
    history.push(`/onBoarding/brixelComingInTown/s${Questions[0].history}`);
    // GET Company data by cookie
    const companyCookie = cookie.get('brixelStubCompany') || null;
    if (companyCookie) handleGetCompany({stub: companyCookie});
  }, []);

  // LOAD QUESTIONS ON CHANGING LANGUAGE
  useEffect(() => {
    setQuestions(QuestionsList(lang));
  }, [lang]);

  useEffect(() => {
    // Check if the user token exist or redirect to Onboarding
    if (typeof cookie.get('brixelToken') === 'undefined') history.push('/onBoarding');
  }, [loggedUser]);

  // ON CHANGE VALUE AND STEP CHECK IF THE FIELDS ARE VALID
  useEffect(() => {
    let invalidField = false;
    let noValueField = false;
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
      });
    }
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(formValue, inp.name, true);
        if (curVal === true || !curVal) noValueField = true;
      });
    }
    setEmptyValue(noValueField);
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

  // Function to move next/prev question
  const changeStep = (act) => {
    let newPosition = position;
    handleSetNotification(null);
    if (act === 'back') {
      setDisableNextBtn(false);
      newPosition = position - 1;
    }
    else {
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
    setProgressBar(newPosition * 100 / questInputs.length);
    // If the current and the preview are not steps with inputs save the data
    if (Questions[newPosition - 1].inputs && !Questions[newPosition].inputs) saveData();
    // if the step is the chat step
    if (Questions[newPosition].cardType === 'chat') {
      handleSetNotification({
        small: true,
        icon: 'mosaic',
        text: "+ 50 Brixels for completing your onboarding.",
      });
      handleSetBrixelPoint([
        {desc: "Homebase", point: 50},
        {desc: "Newcomer", point: 100},
        {desc: "Completing onboarding", point: 50},
      ]);
      handleSetAwards([
        {desc: "Homebase", point: 1},
        {desc: "Newcomer", point: 1},
        {desc: "Completing onboarding", point: 1},
      ]);
      setTimeout(() => {
        handleSetNotification(null);
      }, 5000)
    }
    // Change the url in base of history key on question object
    history.push(`/onBoarding/brixelComingInTown/${Questions[newPosition].history}`);
  };

  // Function to create the email
  const extractEmaildata = () => {
    let formData = formValue;
    let email = `<p><b>Name</b> ${loggedUser.user.name}</p>`;
    email += `<p><b>Email</b> ${loggedUser.user.email}</p>`;
    email += `<p><b>User Id</b> ${loggedUser.user.id}</p>`;
    email += `<p><b>Company</b> ${company.name || 'default'}</p>`;
    const formInputs = QuestionsList('en').filter((itm) => typeof itm.inputs !== 'undefined');
    Object.keys(formData).map((key) => {
      formInputs.map((input) => {
        const getField = input.inputs.find(subVal => subVal.name === key);
        let getFieldValueLabel = formData[key];
        if (input.options) {
          getFieldValueLabel = input.options.find(subVal => subVal.value === formData[key]);
          if (getFieldValueLabel) getFieldValueLabel = getFieldValueLabel.label;
        }
        if (isObject(formData[key]) && !isArray(formData[key])) {
          let obj = 0;
          Object.keys(formData[key]).map((multiKey) => {
            const getField = input.inputs.find(subVal => subVal.name.split('.')[1] === multiKey);
            const getSubField = input.options.find(subVal => subVal.value === formData[key][multiKey]);
            if (getField && getSubField) {
              if (obj === 0 && email) email += "<hr />";
              email += `<p><b>${getField.labelEmail || getField.label}</b> ${getSubField.label} - ${getSubField.value}</p>`;
              obj++;
            }
          });
        } else if (isArray(formData[key])) {
          let arr = 0;
          formData[key].map((val) => {
            if (input.options) {
              const getSubField = input.options.find(subVal => subVal.value === val);
              if (getSubField && getField) {
                if (arr === 0 && email) email += "<hr />";
                email += `<p><b>${getField.labelEmail || getField.label}</b> ${getSubField.label}</p>`;
                arr++;
              }
            }
          });
        } else if (getField) {
          if (email) email += "<hr />";
          email += `<p><b>${getField.labelEmail || getField.label}</b> ${getFieldValueLabel || formData[key]}</p>`
        }
      });
    });
    return email;
  };

  // Function to save the data
  const saveData = (e) => {
    let message = extractEmaildata();
    // Save the obj data
    const data = {
      brixelComingFlowProcess: {
        answers: formValue
      },
      id: loggedUser.user.id,
      sendEmail: {
        company : company.stub || null, // email destinatary
        recipientEmail : 'support@brixel.io', // email
        subject        : `New Sign up - Brixel Coming In Town - ${company.name || 'default'}`,
        message        : `<h1>New Sign up - Brixel Coming In Town - ${company.name || 'default'}</h1> ${message}`,
      }
    };
    // Call to redux funciton to update the user
    handleUpdateUser(data);
  };

  return (
    <main
      id="onBoarding"
      className={Questions[currentIndex].cardType !== 'chat' ? 'withFooter' : 'withoutFooter'}
    >
      {
        Questions[currentIndex].inputs && (
          <div id="progressBar">
            <span className="activeProgBar" style={{ width: `${progressBar}%` }} />
          </div>
        )
      }
      <form
        id="multiStepForm"
        onSubmit={(e) => e.preventDefault()}
        autoComplete="off"
      >
        <div
          className="slideMultiStepForm"
          style={{ transform: `translate(-${position * 100}vw, 0)` }}
        >
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
                                              <button onClick={() => changeFieldValue('location', {})}>Change</button>
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
                                          className="mb-2 w-perc-100"
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
                                          max={input.max}s
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
                                            label={translateTo(lang,"Ok")}
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
                          quest.cardType === 'RewardsStep' && (
                            <div className="ta-c">
                              <img src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
                              <h5 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.title}} />
                              {quest.subtitle && (<h6 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.subtitle}} />)}
                            </div>
                          )
                        }
                        {
                          quest.cardType === 'LastStep' && (
                            <div>
                              <h5 className="mb-2 mb-md-9 ta-l" dangerouslySetInnerHTML={{ __html: quest.title}} />
                              <img src={quest.img} alt={quest.title} className="w-perc-100" />
                              {quest.subtitle && (<h5 className="mt-2 ta-l" dangerouslySetInnerHTML={{ __html: quest.subtitle}} />)}
                            </div>
                          )
                        }
                        {
                          (quest.cardType === 'chat') && (
                            <div>
                              <div className="dis-f a-c mb-4">
                                <img src={quest.img} />
                                <h5 className="ml-3" dangerouslySetInnerHTML={{ __html: quest.title}} />
                              </div>
                              <div className="chatContainer">
                                {
                                  quest.message && quest.message.map((msg, i) => (
                                    <div className="messageChat" dangerouslySetInnerHTML={{ __html: msg }} key={i.toString()} />
                                  ))
                                }
                              </div>
                              <div className="dis-f w-perc-100 jc-fe">
                                <BrixelButtonSecondary
                                  rounded
                                  label={translateTo(lang,"No thanks")}
                                  color="primary"
                                  onClick={() => window.location.href = company.contactWebsite || 'https://brixel.ch'}
                                  disabled={disableNextBtn}
                                />
                                <BrixelButtonPrimary
                                  className="ml-1"
                                  rounded
                                  label={translateTo(lang,"Yes, of course")}
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
            <div className={`footerAction p-1  shadow-1dp-top ${disableNextBtn ? 'disabledNext' : `${Questions[currentIndex].inputs && !emptyValue ? 'successNext' : 'normStep'}`}`}>
              <div className="container pos-r">
                <div className="subcontainer">
                  {
                    !disableNextBtn && Questions[currentIndex] && Questions[currentIndex].inputs && Questions[currentIndex].successMessage && !emptyValue && (
                      <p className="txtGreen700 ta-r mb-2 textSuccess">
                        {Questions[currentIndex].successMessage}
                        <BrixelIcon icon="check" className="ml-1" />
                      </p>
                    )
                  }
                  <div
                    className={
                      `dis-f a-c ${Questions[currentIndex].inputs ? 
                        (hidePrevBtn ? 'jc-fe' : 'jc-b') : 
                        (Questions[currentIndex].cardType === 'LastStep' ? 'jc-fe' : 'jc-c')}`
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
                      (
                        Questions[currentIndex].inputs ||
                        (
                          Questions[currentIndex + 1] &&
                          Questions[currentIndex + 1].inputs
                        )
                      ) ? (
                        <>
                          <BrixelButtonPrimary
                            rounded
                            label={
                              emptyValue &&
                              Questions[currentIndex].inputs ?
                                translateTo(lang,"Skip") :
                                translateTo(lang,"Continue")
                            }
                            background={Questions[currentIndex].inputs ? "green" : "primary"}
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
                                  label={translateTo(lang,"Back to our website")}
                                  color="primary"
                                  onClick={() => window.location.href = company.contactWebsite || 'https://brixel.ch'}
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
              </div>
            </div>
          )
        }
      </form>
    </main>
  );
}

UserFlow.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetCompany: PropTypes.func.isRequired,
  handleUpdateUser: PropTypes.func.isRequired,
  handleSetAwards: PropTypes.func.isRequired,
  handleSetBrixelPoint: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
  handleSetNotification: PropTypes.func.isRequired,
};

UserFlow.defaultProps = {

};

const mapStateToProps = (state, props) => ({
  company: get(state, 'companies.company', {}),
  errorValue: get(state, 'form.UserFlow.syncErrors', {}),
  formValue: get(state, 'form.UserFlow.values', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  lang: get(state, 'common.language', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('UserFlow', field, value));
  },
  checkValid() {
    dispatch(isValid('UserFlow'))
  },
  handleUpdateUser: bindActionCreators(updateUser, dispatch),
  handleGetCompany: bindActionCreators(getCompany, dispatch),
  handleSetAwards: bindActionCreators(setAwards, dispatch),
  handleSetBrixelPoint: bindActionCreators(setBrixelPoint, dispatch),
  handleSetNotification: bindActionCreators(setNotification, dispatch),
});

const UserFlowForm = reduxForm({
  form: 'UserFlow', // a unique identifier for this form
})(UserFlow);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(UserFlowForm);
