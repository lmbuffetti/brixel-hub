/* global Transifex */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
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

const cookie = new Cookies;

function UserFlow(props) {
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    errorValue,
    formValue,
    handleUpdateUser,
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
  const [hideNextBtn, setHideNextBtn] = useState(true);
  const [disablePrevBtn, setDisablePrevBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [emptyValue, setEmptyValue] = useState(true);
  const [Questions, setQuestions] = useState(QuestionsList(lang));

  useEffect(() => {
    setQuestions(QuestionsList(lang));
  }, [lang]);

  const extractTitle = (title) => {
    if (typeof title === 'object') {
      return title.House;
    }
    return title;
  };

  useEffect(() => {
    handleSetBrixelPoint([{desc: "Homebase", point: 50}, {desc: "Newcomer", point: 100}]);
    handleSetAwards([{desc: "Homebase", point: 1}, {desc: "Newcomer", point: 1}]);
    history.push(`/onBoarding/brixelComingInTown/s${Questions[0].history}`);
  }, []);

  useEffect(() => {
    if (typeof cookie.get('brixelToken') === 'undefined') history.push('/onBoarding');
  }, [loggedUser]);

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

  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
    document.getElementById('onBoarding').scrollTo(0, 0);
  };

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
    if (newPosition > 0) setHidePrevBtn(false);
    else setHidePrevBtn(true);
    setProgressBar(newPosition * 100 / Questions.length);
    if (Questions[newPosition - 1].inputs && !Questions[newPosition].inputs) saveData();
    if (Questions[newPosition].cardType === 'chat') {
      handleSetNotification({small: true, icon: 'mosaic', text: "+ 50 Brixels for completing your onboarding." });
      handleSetBrixelPoint([{desc: "Homebase", point: 50}, {desc: "Newcomer", point: 100}, {desc: "Completing onboarding", point: 50}]);
      handleSetAwards([{desc: "Homebase", point: 1}, {desc: "Newcomer", point: 1}, {desc: "Completing onboarding", point: 1}]);
      setTimeout(() => {
        handleSetNotification(null);
      }, 5000)
    }
    history.push(`/onBoarding/brixelComingInTown/${Questions[newPosition].history}`);
  };

  const saveData = (e) => {
    const data = {
      brixelComingFlowProcess: {
        answers: formValue
      },
      id: loggedUser.user.id
    };
    handleUpdateUser(data);
  };
  return (
    <main id="onBoarding">
      <div id="progressBar"><span className="activeProgBar" style={{ width: `${progressBar}%` }} /></div>
      <form id="multiStepForm" onSubmit={(e) => e.preventDefault()} autocomplete="off">
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div id={`step-${i}`} className="singleStep" key={i.toString()}>
                <div className="subcontainer">
                  {
                    quest.inputs && (
                      <>
                        {
                          quest.titleGreen && (
                            <h5 className="txtGreen400">{quest.titleGreen}</h5>
                          )
                        }
                        <h5 className="mb-4 mb-md-9">{extractTitle(quest.title)}</h5>
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
                              <img src={quest.img} alt={quest.title} className="max-w-fix-232" />
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
        <div className={`footerAction p-1  shadow-1dp-top ${disableNextBtn ? 'disabledNext' : `${Questions[currentIndex].inputs && !emptyValue ? 'successNext' : 'normStep'}`}`}>
          <div className="subcontainer">
            {
              !disableNextBtn && Questions[currentIndex] && Questions[currentIndex].inputs && Questions[currentIndex].successMessage && !emptyValue && (
                <p className="txtGreen700 ta-r mb-2 textSuccess">
                  {Questions[currentIndex].successMessage}
                  <BrixelIcon icon="check" className="ml-1" />
                </p>
              )
            }
            <div className={`dis-f a-c ${Questions[currentIndex].inputs ? (hidePrevBtn ? 'jc-fe' : 'jc-b') : (Questions[currentIndex].cardType === 'LastStep' ? 'jc-fe' : 'jc-c')}`}>
              {
                Questions && Questions[currentIndex] !== 'undefined' && Questions[currentIndex].inputs && (
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
                (currentIndex === 0 || Questions[currentIndex].inputs || (Questions[currentIndex + 1] && Questions[currentIndex + 1].inputs)) ? (
                  <>
                    <BrixelButtonPrimary
                      rounded
                      label={emptyValue && Questions[currentIndex].inputs  ? translateTo(lang,"Skip") : translateTo(lang,"Continue")}
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
                      Questions[currentIndex].cardType === 'LastStep' ? (
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
                            onClick={() => ''}
                            rightIcon="arrow-right-small"
                            disabled={disableNextBtn}
                          />
                        </>
                      ) : (
                        <>
                          <BrixelButtonSecondary
                            rounded
                            label={translateTo(lang,"No thanks")}
                            color="primary"
                            onClick={() => ''}
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
                        </>
                      )
                    }
                  </>
                )
              }
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

UserFlow.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
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
