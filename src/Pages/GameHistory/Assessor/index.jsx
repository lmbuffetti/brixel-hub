/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon, MultiFileldsReduxForm } from '@brixel/brixel-components';
import { AssessorQuestions } from '../../../resources/Assessor';
import {extractAssessorCondition, calculateAgeByYear} from '../../../utils/helpers';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import { reduxForm, reset } from 'redux-form';
import { saveActiveSingleProperty } from '../../../actions/PropertyActions';
import { addGameHistory } from '../../../actions/GamificationActions';
import PageHeaderAchievement from '../../../components/PageHeaderAchievement';

const Assessor = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    errorValue,
    formValue,
    gameGroup,
    gameHistory,
    handleAddGameHistory,
    handleSaveActiveSingleProperty,
    history,
    match,
    reset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(AssessorQuestions('en'));
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(AssessorQuestions('en')[0]);
  const [isEnter, setIsEnter] = useState(true);
  const [selGameGroup, setSelGameGroup] = useState({});
  const [finishedFlow, setFinishedFlow] = useState(false);
  const [lastID, setLastID] = useState(0);
  // GET URL PARAMS
  const getAchievement = () => history.location.pathname.split('/')[4];
  const propID = get(match, 'params.propId', null);

  // CHECK IF THE ACHIEVEMENT IS DONE
  useEffect(() => {
    if (gameHistory && gameHistory.data && activeSingleProperty.id) {
      const checkGameExist = gameHistory.data.find(item => item.achievement.stub === getAchievement() && item.page === activeSingleProperty.id);
      if (typeof checkGameExist !== 'undefined') {
        setFinishedFlow(true);
        if (lastID && get(history, 'location.state.redo', false) !== true) {
          setCurrentIndex(lastID);
          setQuest(questions[lastID]);
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
      const achievements = get(group, 'achievements', []);
      const defGroup = achievements.find(item => item.stub === getAchievement());
      setSelGameGroup(defGroup);
    }
  }, [gameGroup]);

  useEffect(() => {
    setIsEnter(true);
    if (questions[currentIndex].history && loaded) {
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
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      history.push(`/${propID}/rewards`);
    } else {
      history.push(`/${propID}/rewards/${getAchievement()}`);
    }
    reset('Property');
  };

  const saveData = (e) => {
    const dataProp = {};
    dataProp.properties = get(formValue, 'properties', {});
    dataProp.id = get(formValue, 'id', 0);
    // CALC THE PROPERTY CONDITION
    const yearBuilt = get(formValue, 'properties.building.built', null);
    const yearRenovate = get(formValue, 'properties.building.renovated', null);
    const age = calculateAgeByYear(yearBuilt);
    const valueConstruction = get(formValue, 'properties.building.constructionMaterials', null);
    const valueRoof = get(formValue, 'properties.building.roofType', null);
    const valueFacade = get(formValue, 'properties.building.facade', null);
    const valueHeating = get(formValue, 'properties.energy.heating', null);
    dataProp.assessor = {
      date: new Date(),
      construction: extractAssessorCondition(age, valueConstruction, valueRoof, valueFacade, valueHeating),
    };
    if (yearRenovate) {
      const ageRenovation = calculateAgeByYear(yearRenovate);
      dataProp.assessor.renovation = extractAssessorCondition(ageRenovation, valueConstruction, valueRoof, valueFacade, valueHeating);
      dataProp.properties.building.isPropertyRenovated = 1;
    }
    // UPDATE PROPERTY
    history.push({state: {}});
    // ADD THE ACHIEVEMENT
    handleAddGameHistory({stub: getAchievement()});
    handleSaveActiveSingleProperty(dataProp);
    reset('Property');
  };

  const changeStep = (act) => {
    setIsEnter(false);
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }
    if (questions[newIndex].toSave) {
      saveData();
    }
    setCurrentIndex(newIndex);
    // setPosition(newIndex);
    setQuest(questions[newIndex]);
  };

  useEffect(() => {
    if (formValue.id) {
      let newQuest = [];
      AssessorQuestions('en').map((quest) => {
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
        if (input.condition) {
          input.condition.map((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
            return null;
          });
        } else if (input.validation) {
          if (err !== true && err !== false && isValid && err !== null) isValid = false;
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
    let validation = get(quest, 'inputs[0].validation', null);
    if (validation) {
      validation = validation[validation.length - 1]();
    }
    if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else if (validation === null && get(formValue, inputName, null) === null) label = 'Skip';
    else if (currentIndex === 0) label = 'Next';
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
              className={`singleStep jc-c ${quest.background || ''} ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer m-a">
                {
                  quest.inputs && (
                    <div>
                      <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'}`}>{quest.title}</h3>
                      {quest.subtitle && (
                        <p className="mb-5 txtDark200" dangerouslySetInnerHTML={{ __html: quest.subtitle }}/>)}
                      <MultiFileldsReduxForm
                        disableNextBtn={false}
                        formValue={formValue}
                        form="Property"
                        inputs={quest.inputs}
                        onClick={() => ''}
                      />
                    </div>
                  )
                }
                {
                  quest && quest.cardType === 'loadComponent' && quest.history === questions[currentIndex].history && (
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
              <div className={`w-perc-100 a-c dis-fl-row jc-b m-a ${currentIndex === questions.length - 1 ? 'jc-c' : 'jc-b'}`}>
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
                <BrixelButtonPrimary
                  className={`noWrap w-perc-100 max-w-fix-160 ${currentIndex === 0 ? 'ml-a' : ''}`}
                  disabled={!checkValidateField()}
                  rounded
                  background="primary"
                  saturation={400}
                  label={buttonLabel()}
                  rightIcon="arrow-right-small"
                  onClick={() => questions[currentIndex + 1] ? changeStep() : closeWindow()}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
};

Assessor.propTypes = {
  formValue: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  errorValue: get(state, 'form.Property.syncErrors', {}),
  formValue: get(state, 'form.Property.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  packagesProperty: get(state, 'property.packagesProperty', []),
});

const mapDispatchToProps = (dispatch) => ({
  reset(form) {
    (dispatch(reset(form)))
  },
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

const AnyForm = reduxForm({
  form: 'Property',
  destroyOnUnmount: false,
})(Assessor)

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AnyForm);
