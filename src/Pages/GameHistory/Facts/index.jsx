/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon, MultiFileldsReduxForm } from '@brixel/brixel-components';
import { FactsApartment } from '../../../resources/Facts';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonPrimary, BrixelButtonTertiary } from '@brixel/brixel-components';
import { reduxForm, reset } from 'redux-form';
import { saveActiveSingleProperty } from '../../../actions/PropertyActions';
import { addGameHistory } from '../../../actions/GamificationActions';
import PageHeaderAchievement from '../../../components/PageHeaderAchievement';
import { BrixelProgressLineDots } from '@brixel/brixel-components';

const MarketCheck = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    errorValue,
    formValue,
    gameGroup,
    gameHistory,
    handleSaveActiveSingleProperty,
    history,
    match,
    reset,
    smallLoading,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(FactsApartment('en'));
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(FactsApartment('en')[0]);
  const [isEnter, setIsEnter] = useState(true);
  const [selGameGroup, setSelGameGroup] = useState({});
  const [finishedFlow, setFinishedFlow] = useState(false);
  const [lastID, setLastID] = useState(0);
  const [numberQuestions, setNumberQuestions] = useState(0);
  // GET URL PARAMS
  const getAchievement = () => history.location.pathname.split('/')[4];
  const propID = get(match, 'params.propId', null);

  // CHECK IF THE ACHIEVEMENT IS DONE
  useEffect(() => {
    if (gameHistory && gameHistory.data && activeSingleProperty.id) {
      const checkGameExist = gameHistory.data.find(item => item.achievement.stub === getAchievement() && item.page === activeSingleProperty.id);
      if (typeof checkGameExist !== 'undefined' && activeSingleProperty.ownerType) {
        setFinishedFlow(true);
        if (lastID) {
          //setCurrentIndex(lastID);
          //setQuest(questions[lastID]);
        }
      } else {
        setFinishedFlow(false);
      }
      setLoaded(true);
    }
  }, [gameHistory, activeSingleProperty, lastID]);

  useEffect(() => {
    if (gameGroup.length > 0) {
      const group = gameGroup.find(game => game.achievements.some(item => item.stub === getAchievement()));
      const defGroup = group.achievements.find(item => item.stub === getAchievement());
      setSelGameGroup(defGroup);
    }
  }, [gameGroup]);

  useEffect(() => {
    setIsEnter(true);
    if (get(questions, `[${currentIndex}].history`, null) && loaded) {
      const redo = get(history, 'location.state.redo', false);
      history.push({
        pathname: `/${propID}/rewards/achievement/${getAchievement()}/${questions[currentIndex].history}`,
        state: {
          redo: redo,
        }
      });
    }
  }, [currentIndex, loaded]);

  const closeWindow = () => {
    reset('Property');
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      history.push(`/${propID}/rewards`);
    } else {
      history.push(`/${propID}/rewards/${getAchievement()}`);
    }
  };

  const saveData = () => {
    //handleAddGameHistory({stub: getAchievement()});
    const data = {
      id: propID,
      smallLoader: 'property',
      redirectTo: `/${propID}/rewards/${getAchievement()}`,
      ...formValue
    };
    handleSaveActiveSingleProperty(data);
  };

  const changeStep = (act) => {
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }
    if (questions[newIndex].toSave) {
      history.push(`/${propID}/rewards/achievement/${getAchievement()}/${questions[newIndex].history}`);
      saveData();
    }
    // setPosition(newIndex);
    if (typeof questions[newIndex].title !== 'undefined') {
      setIsEnter(false);
      setQuest(questions[newIndex]);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    if (formValue.id) {
      let newQuest = [];
      let originalQuests = FactsApartment('en');
      originalQuests.map((quest) => {
        if (quest.condition) {
          let isValid = true;
          quest.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false
            }
            return null;
          });
          if (isValid) newQuest.push(quest);
        } else {
          newQuest.push(quest);
        }
        return null;
      });
      setLastID(newQuest.length - 1);
      setNumberQuestions(originalQuests.filter(item => typeof item.inputs !== 'undefined').length);
      setQuestions(newQuest);
    }
  }, [formValue]);

  const checkValidateField = (act) => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      quest.inputs.map((input) => {
        const err = get(errorValue, input.name, null);
        const noEmpty = get(formValue, input.name, 'ayc');
        if(noEmpty !== 'ayc') isNotEmpty = true;
        if (get(input, 'condition', null)) {
          input.condition.map((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && err !== null && isValid) isValid = false;
            }
            return null;
          });
        } else if (input.validation) {
          if (err !== true && err !== false && err !== null && isValid) isValid = false;
        }
        return null;
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else if (questions[currentIndex + 1].toSave) label = 'Finish';
    else if (get(quest, 'inputs', []).length > 0) {
      get(quest, 'inputs', []).forEach((item) => {
        if (get(item, 'validation', null) === null && get(formValue, item.name, null) === null && label !== 'Next') {
          label = 'Skip';
        } else {
          label = 'Next';
        }
      })
    }
    else label = 'Next';
    return label;
  };

  if(!formValue.id && !loaded) {
    return (
      <div/>
    )
  }

  return (
    <div id="bodyModalWrapper" className="achievementFlow">
      <div className="bodyModal">
        <PageHeaderAchievement
          icon={selGameGroup.icon}
          title={selGameGroup.description}
          isFree
          subtitle={selGameGroup.name}
        />
        <form
          id="multiStepForm"
          // onSubmit={(e) => {e.preventDefault(); changeStep()}}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className={`multiStepSlides`}>
            <div
              className={`singleStep jc-c a-t ${quest.background || ''} ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer m-a mt-0 rewardsFacts">
                <div className="mt-2 mb-5">
                  <BrixelProgressLineDots
                    color="Primary"
                    backgroundSaturation={100}
                    saturation={600}
                    activeStep={currentIndex}
                    steps={numberQuestions}
                  />
                </div>
                {
                  quest.inputs && (
                    <div>
                      <h5 className={`${quest.subtitle ? 'mb-1' : 'mb-3'}`}>{quest.title}</h5>
                      {
                        quest.subtitle && (
                          <p className="mb-3 txtDark200" dangerouslySetInnerHTML={{ __html: quest.subtitle }}/>)
                      }
                      <MultiFileldsReduxForm
                        className="singleInput"
                        disableNextBtn={false}
                        formValue={formValue}
                        form="GamingFlow"
                        inputs={quest.inputs}
                        onClick={() => ''}
                      />
                    </div>
                  )
                }
                {
                  get(quest, 'cardType', null) === 'loadComponent' && get(quest, 'history', 'a') === get(questions, `[${currentIndex}].history`, 'b') && (
                    React.createElement(quest.component, {formName: 'GamingFlow', finishedFlow, initialValue: formValue})
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={`footerAction p-1 p-md-2 shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="container pos-r">
              <div className={`w-perc-100 a-c dis-fl-row jc-b m-a ${currentIndex === lastID ? 'jc-c' : 'jc-b'}`}>
                {
                  questions[currentIndex] && questions[currentIndex].inputs && (
                    <BrixelButtonIcon
                      className={`shadow-2dp backBtn ${currentIndex === 0 ? 'hide' : ''}`}
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
                  buttonLabel().toLowerCase() === "skip" ? (
                    <BrixelButtonTertiary
                      className={`noWrap w-perc-100 max-w-fix-160 ${buttonLabel().toLowerCase() === "skip" ? 'skip' : ''} ${currentIndex === 0 ? 'ml-a' : ''}`}
                      disabled={!checkValidateField()}
                      saturation={400}
                      color="light"
                      label={buttonLabel()}
                      rightIcon="arrow-right-small"
                      onClick={() => questions[currentIndex + 1] ? changeStep() : closeWindow()}
                      isLoading={smallLoading === 'Property'}
                    />
                  ) : (
                    <BrixelButtonPrimary
                      className={`noWrap w-perc-100 max-w-fix-160 ${buttonLabel().toLowerCase() === "skip" ? 'skip' : ''} ${currentIndex === 0 ? 'ml-a' : ''}`}
                      disabled={!checkValidateField()}
                      rounded
                      background="primary"
                      saturation={400}
                      label={buttonLabel()}
                      rightIcon="arrow-right-small"
                      onClick={() => questions[currentIndex + 1] ? changeStep() : closeWindow()}
                      isLoading={smallLoading === 'property'}
                    />
                  )
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
};

MarketCheck.propTypes = {
  formValue: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  reset: PropTypes.func.isRequired,
  smallLoading: PropTypes.string,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  errorValue: get(state, 'form.GamingFlow.syncErrors', {}),
  formValue: get(state, 'form.GamingFlow.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  smallLoading: get(state, 'common.isSmallLoading', null),
  packagesProperty: get(state, 'property.packagesProperty', []),
  initialValues: {
    id: get(state, 'property.activeSingleProperty.id', null),
    properties: get(state, 'property.activeSingleProperty.properties', null),
    price: get(state, 'property.activeSingleProperty.price', null),
    title: get(state, 'property.activeSingleProperty.title', null)
  }
});

const mapDispatchToProps = (dispatch) => ({
  reset(form) {
    (dispatch(reset(form)))
  },
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

const AnyForm = reduxForm({
  form: 'GamingFlow',
  enableReinitialize: true,
  destroyOnUnmount: true,
})(MarketCheck)

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AnyForm);
