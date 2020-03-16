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
import {
  withRouter,
} from 'react-router-dom'
import { change, isValid, reduxForm } from 'redux-form';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelProgressBar,
} from '@brixel/brixel-components';
import { saveActiveSingleProperty, getActiveSingleProperty } from '../../actions/PropertyActions';
import { MarketCheckQuestions } from '../../resources/MarketCheck';
import MultiStepForm from '../../components/MultiStepReduxForm';
import { translateTo } from '../../utils/translation';
import last from 'lodash/last';
import { addGameHistory, getGameHistory } from '../../actions/GamificationActions';
import PageHeaderAchievement from '../../components/PageHeaderAchievement';

function MarketCheck(props) {
  // PROPS
  const {
    errorValue,
    formValue,
    gameHistory,
    handleGetProperty,
    handleAddGameHistory,
    handleGetGameHistory,
    history,
    lang,
    loggedInUser,
    match,
    property,
  } = props;
  // STATE
  const [finishedFlow, setFinishedFlow] = useState(false);
  const [position, setPosition] = useState(0);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressBar, setProgressBar] = useState(0);
  const [Questions] = useState(MarketCheckQuestions(lang));
  const [saved] = useState(false);
  // GET URL PARAMS
  const getAchievement = () => last(history.location.pathname.split('/'));
  const propID = get(match, 'params.propId', null);

  // CHECK IF THE ACHIEVEMENT IS DONE
  useEffect(() => {
    if (gameHistory && gameHistory.data && property.id) {
      const checkGameExist = gameHistory.data.find(item => item.achievement.stub === getAchievement() && item.page === property.id);
      if (typeof checkGameExist !== 'undefined') {
        setFinishedFlow(true);
        if (!saved) {
          setCurrentIndex(Questions.length - 1);
          setPosition(Questions.length - 1);
        }
      } else {
        setFinishedFlow(false);
      }
    }
  }, [gameHistory, property]);

  // GET DEFAULT PROPERTY
  useEffect(() => {
    handleGetProperty({id: propID});
    handleGetGameHistory();
  }, []);

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
    // ADD THE ACHIEVEMENT
    if (!finishedFlow) {
      const data = {
        id: loggedInUser.user.id,
        page: property.stub,
        achievement: getAchievement(),
      };
      handleAddGameHistory(data);
      // eslint-disable-next-line no-use-before-define
      changeStep();
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
    const questInputs = Questions.filter((val) => typeof val.inputs !== 'undefined');
    setProgressBar(newPosition * 100 / questInputs.length);
  };

  const buttonLabel = () => {
    let label;
    let oneValueField = typeof Questions[currentIndex].inputs !== 'undefined';
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(formValue, inp.name, true);
        if (curVal !== true) oneValueField = false;
        return null;
      });
    }
    if (Questions[currentIndex].inputs || (Questions[currentIndex + 1] && Questions[currentIndex + 1].inputs)) {
      label = oneValueField ? translateTo(lang, "Skip") : translateTo(lang, "Continue");
    } else if (Questions[currentIndex + 1]) {
      label = translateTo(lang, "Finish");
    } else {
      label = translateTo(lang, "Alright");
    }
    return label;
  };

  if ((gameHistory && !gameHistory.data) || !property.id) {
    return (<div />);
  }

  return (
    <main id="achievementSection">
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
      <PageHeaderAchievement
        icon="location-pin-simple"
        title="Market Checker"
        subtitle="Compare to your local market"
      />
      <form
        id="multiStepForm"
        // onSubmit={(e) => {e.preventDefault(); changeStep()}}
        autoComplete="off"
      >
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div
                id={`step-${i}`}
                className={`singleStep ${quest.background || ''} ${quest.vCentered ? 'vertCentered' : ''}`}
                key={i.toString()}
                style={{
                  visibility: i !== currentIndex ? 'hidden' : 'visible',
                  maxWidth: i !== currentIndex ? '' : '100%',
                }}
              >
                <div className={`subcontainer m-a ${quest.className || ''}`}>
                  {
                    quest.inputs && (
                      <>
                        <h5 className="mb-4 mb-md-10">{quest.title}</h5>

                        {
                          quest.inputs.map((input, f) => (
                            <div key={f.toString()}>
                              <MultiStepForm
                                disableNextBtn={disableNextBtn}
                                formValue={formValue}
                                onClick={() => changeStep()}
                                input={input}
                                onChangeProgressBar={(val) => setProgressBar(val)}
                              />
                            </div>
                          ))
                        }
                      </>
                    )
                  }
                  {
                    quest.cardType === 'loadComponent' && quest.history === Questions[currentIndex].history && (
                      React.createElement(quest.component, {formName: 'GamingFlow', finishedFlow, initialValue: formValue})
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
                  Questions[currentIndex] && Questions[currentIndex + 1] && (
                    <BrixelButtonPrimary
                      rounded
                      label={buttonLabel()}
                      background={Questions[currentIndex].inputs ? "green" : "primary"}
                      className={Questions[currentIndex].inputs ? '' : 'max-w-fix-280 w-perc-100'}
                      onClick={() => Questions[currentIndex + 1] && Questions[currentIndex].toSave ? saveData() : changeStep()}
                      rightIcon="arrow-right-small"
                      disabled={disableNextBtn}
                    />
                  )
                }
                {
                  Questions[currentIndex] && !Questions[currentIndex + 1] && (
                    <>
                      <BrixelButtonPrimary
                        rounded
                        label="Finish"
                        background={"primary"}
                        className="max-w-fix-280 w-perc-100 mr-1"
                        onClick={() => history.push(`/${propID}/rewards/${finishedFlow ? '' : 'done'}`)}
                      />
                    </>
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

MarketCheck.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  gameHistory: PropTypes.object.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleGetGameHistory: PropTypes.func.isRequired,
  handleUpdateProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  pageState: PropTypes.object,
  property: PropTypes.object.isRequired,
  redirectTo: PropTypes.object,
};

MarketCheck.defaultProps = {
  pageState: null,
  redirectTo: null,
};

const mapStateToProps = (state, props) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, 'form.GamingFlow.syncErrors', {}),
  formValue: get(state, 'form.GamingFlow.values', {}),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  initialValue: get(state, 'form.GamingFlow.initial', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  redirectTo: get(state, 'common.redirectTo', {}),
  lang: get(state, 'common.language', {}),
  pageState: get(state, 'common.setPageData', null),
  property: get(state, 'property.activeSingleProperty', null),
  initialValues: get(state, 'property.activeSingleProperty', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GamingFlow', field, value));
  },
  checkValid() {
    dispatch(isValid('GamingFlow'))
  },
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleGetGameHistory: bindActionCreators(getGameHistory, dispatch),
  handleGetProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleUpdateProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

const OnBoardingForm = reduxForm({
  form: 'GamingFlow', // a unique identifier for this form
  enableReinitialize: true,
  destroyOnUnmount: false,
})(MarketCheck);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OnBoardingForm);
