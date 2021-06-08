/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonText,
  BrixelButtonIcon,
  BrixelButtonPrimary,
  FactsOptions,
  MultiFileldsReduxForm,
  change,
  destroy,
  reset,
  initializeForm,
} from '@brixel/brixel-components';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { checkBrowser } from '../../utils/helpers';
import { ScanTrialQuestions } from '../../resources/ScanTrialRequest';
import { sendScanTrialRequest } from '../../actions/PropertyActions';
import { checkBrowser } from '../../utils/helpers';

const { factsOptions } = FactsOptions;

const ScanTrialFlow = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleSendScanTrial,
    history,
    initForm,
    initialValues,
    isSmallLoading,
    loggedInUser,
    match,
    reset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(ScanTrialQuestions());
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(ScanTrialQuestions()[0]);
  const [isEnter, setIsEnter] = useState(true);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

  useEffect(() => () => destroyForm(), []);

  // ON CHANGE STEP LOAD THE ENTER EFFECT
  useEffect(() => {
    setIsEnter(true);
    if (questions[currentIndex].history) {
      history.push(`/${propID}/trialRequest/${questions[currentIndex].history}`);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isSmallLoading && questions[currentIndex + 1].history === 'success') {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    initForm(initialValues);
  }, [activeSingleProperty]);

  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    reset('scanFlow');
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/${propID}/rewards`);
  };

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    const data = {
      page: propID,
      smallLoader: 'sendData',
      data: {
        user: loggedInUser.id,
        interested: get(formValue, 'interested', null),
        meta: {
          answers: get(formValue, 'answers', []),
        },
      },
    };
    if (get(formValue, 'interested', null)) {
      data.data.meta = {
        ...data.data.meta,
        userName: get(formValue, 'contactFullName', null),
        userEmail: get(formValue, 'contactEmail', null),
        userPhone: get(formValue, 'contactPhone', null),
        comments: get(formValue, 'comments', ''),
      };
    }
    handleSendScanTrial(data);
  };

  // FUNCTION TO CHANGE STEP - BACK-FORWARD
  const changeStep = (act, condition) => {
    const el = document.getElementsByClassName('singleStep')[0];
    if (checkBrowser() > 0) {
      el.scrollTop = 0;
    } else {
      el.scrollTo({
        top: 0,
        left: 0,
      });
    }
    if (currentIndex < 1) {
      if (condition || condition === false) changeFieldValue('interested', condition);
      if (condition) {
        const answers = [];
        factsOptions.scanTrialInterest.forEach((input) => answers.push(input.value));
        changeFieldValue('answers', answers);
      } else {
        changeFieldValue('answers', []);
      }
    }
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }
    if (questions[newIndex].toSave) {
      saveData();
    } else {
      setIsEnter(false);
      setCurrentIndex(newIndex);
      // setPosition(newIndex);
      setQuest(questions[newIndex]);
    }
  };

  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    if (formValue.id) {
      const newQuest = [];
      ScanTrialQuestions('en').map((quests) => {
        if (quests.condition) {
          let isValid = true;
          quests.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(quests);
        } else {
          newQuest.push(quests);
        }
        return null;
      });
      setQuest(newQuest[currentIndex]);
      setQuestions(newQuest);
    }
  }, [formValue]);

  // CHECK IF FIELD IS VALID
  const checkValidateField = () => {
    let isValid = true;
    if (questions[currentIndex].inputs) {
      questions[currentIndex].inputs.forEach((input) => {
        const err = get(errorValue, input.name, null);
        if (input.condition) {
          input.condition.map((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && err !== null && isValid) isValid = false;
            }
            return null;
          });
        } else if (err !== true && err !== false && isValid) isValid = false;
      });
    }
    return isValid;
  };

  // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
  const buttonLabel = () => {
    let label;
    if (currentIndex === 0) label = 'Order now';
    else if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else label = 'Next';
    return label;
  };

  return (
    <div id="bodyModalWrapper" className="modalFlow">
      <div className={`bodyModal dis-fl-col upgradeModal stepNo${currentIndex}`}>
        <header className="max-w-fix-760 ml-a mr-a dis-f w-perc-100 jc-fe">
          <div className="dis-f a-c p-1 p-lg-2">
            <BrixelButtonIcon
              ghost
              theme="dark"
              icon="close-small"
              className="as-c"
              onClick={() => closeWindow()}
            />
          </div>
        </header>
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className="multiStepSlides" id="scrollEl">
            <div
              className={`singleStep jc-c ${quest.background || ''} ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className={`${currentIndex === 0 ? 'subcontainerlg' : ''} subcontainer m-a`}>
                {
                  quest.inputs && (
                    <div>

                      <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'}`}>{quest.title}</h3>
                      {quest.subtitle && (
                        <p className="mb-5 txtDark200" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)}

                      <MultiFileldsReduxForm
                        disableNextBtn={false}
                        formValue={formValue}
                        form="scanFlow"
                        inputs={quest.inputs}
                        onClick={() => ''}
                        className={quest.inputs.className}
                      />
                    </div>
                  )
                }
                {
                  quest.component && (
                    React.createElement(
                      quest.component,
                      {
                        ...get(quest, 'componentProps', {}),
                      },
                    )
                  )
                }
                {
                  !quest.inputs && !quest.component && quest.history !== 'success' && (
                    <div className="ta-c">
                      <div className="h-fix-248">
                        <img src={quest.img} alt={quest.title} />
                      </div>
                      <h3
                        className="mt-5"
                        dangerouslySetInnerHTML={{ __html: quest.title }}
                      />
                      <p
                        className="m-a mt-2 max-w-fix-400"
                        dangerouslySetInnerHTML={{ __html: quest.subtitle }}
                      />
                    </div>
                  )
                }
                {
                  quest.history === 'success' && (
                    <div className="ta-l">
                      {
                        get(formValue, 'interested', null) ? (
                          <div>
                            <h3 className="mt-5">
                              Thank you for your request!
                            </h3>
                            <p className="mt-3">
                              One of our experts will get in touch with you as soon as possible to schedule your personal appointment.
                            </p>
                            <p className="my-2">
                              To speed up the process you can already  prepare the following documents for your estimation:
                            </p>
                            {
                              get(activeSingleProperty, 'location.countryCode', '') === 'PT' ? (
                                <ul className="ml-3 pl-2">
                                  <li>Caderneta Predial Urbana</li>
                                  <li>Floor plan</li>
                                  <li>Previous estimation report</li>
                                </ul>
                              ) : (
                                <ul className="ml-3 pl-2">
                                  <li>Extract from the land register</li>
                                  <li>Building insurance policy</li>
                                  <li>Previous estimation report (if available)</li>
                                </ul>
                              )
                            }
                          </div>
                        ) : (
                          <div>
                            <h3 className="ta-c">
                              Thank you for your feedback.
                            </h3>
                            <p className="m-a mt-3 ta-c">
                              Feel free to contact us any time if you change your mind.
                            </p>
                          </div>
                        )
                      }

                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={`footerAction p-1 p-lg-2 shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'}`}
          >
            <div className="container pos-r">
              <div className={`w-perc-100 a-c ${currentIndex === 0 ? 'dis-f jc-c a-c' : 'dis-fl-row jc-b'} m-a ${currentIndex === questions.length - 1 ? 'jc-c' : 'jc-b'}`}>
                {
                  currentIndex === 0 && (
                    <>
                      <BrixelButtonText
                        className="noWrap"
                        rounded
                        label="Not interested"
                        onClick={() => changeStep('next', false)}
                      />
                      <BrixelButtonPrimary
                        className="noWrap ml-2"
                        rounded
                        label="Request test drive"
                        onClick={() => changeStep('next', true)}
                      />
                    </>
                  )
                }
                {
                  currentIndex > 0 && currentIndex < questions.length - 1 && (
                    <>
                      <BrixelButtonIcon
                        className={`backBtn ${currentIndex === 0 ? 'hide' : ''}`}
                        icon="arrow-simple-left"
                        onClick={() => changeStep('back')}
                        theme="primary"
                        ghost
                      />
                      <BrixelButtonPrimary
                        className="noWrap"
                        disabled={!checkValidateField()}
                        rounded
                        theme={questions[currentIndex - 1] ? 'primary' : 'red'}
                        label={get(formValue, 'interested', null) ? 'Send request' : 'Send feedback'}
                        rightIcon="arrow-right-small"
                        isLoading={isSmallLoading === 'sendData'}
                        onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                      />
                    </>
                  )
                }
                {
                  currentIndex === questions.length - 1 && (
                    <>
                      <BrixelButtonPrimary
                        className="noWrap"
                        disabled={!checkValidateField()}
                        rounded
                        theme={questions[currentIndex - 1] ? 'primary' : 'red'}
                        label={buttonLabel()}
                        rightIcon="arrow-right-small"
                        onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                      />
                    </>
                  )
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

ScanTrialFlow.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSendScanTrial: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    errorValue: get(state, 'brixelForm.scanFlow.syncErrors', {}),
    formValue: get(state, 'brixelForm.scanFlow.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    initialValues: {
      id: get(state, 'property.activeSingleProperty.id', null),
      contactFullName: get(state, 'user.loggedInUser.user.name', null),
      contactPhone: {
        prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode.dial_code) || countryPhoneCode.dial_code,
        number: get(state, 'user.loggedInUser.user.phone.number', ''),
      },
      contactEmail: get(state, 'user.loggedInUser.user.email', null),
    },
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('scanFlow', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('scanFlow', value));
  },
  destroyForm() {
    (dispatch(destroy('scanFlow')));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  handleSendScanTrial: bindActionCreators(sendScanTrialRequest, dispatch),

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ScanTrialFlow);
