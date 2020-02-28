/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MultiStepReduxForm from '../../components/MultiStepReduxForm';
import { BestimateQuestions } from '../../resources/Bestimate';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../actions/CommonActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { calculateAgeByYear, calcConditionAssessor, extractAssessorCondition } from '../../utils/helpers';

// COMPONENTS
import last from 'lodash/last';
import { addGameHistory } from '../../actions/GamificationActions';
import { updateProperty } from '../../actions/PropertyActions';
import { change } from 'redux-form';
import ResumeBestimate from './ResumeBestimate';

const Bestimate = (props) => {
  // PROPS
  const {
    formValue,
    gameHistory,
    handleAddGameHistory,
    handleSetModal,
    history,
    initialValue,
    loggedUser,
    property,
    handleUpdatePage,
  } = props;
  // STATE
  const [Questions, setQuestions] = useState([]);
  const [QuestionsForm, setQuestionsForm] = useState([]);
  const [doneMarketCheck, setDoneMarketCheck] = useState(true);
  const [finishedFlow, setFinishedFlow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [toSave, setToSave] = useState(false);
  // GET STUB ACVHIEVEMNT
  const getAchievement = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    setQuestions(BestimateQuestions('en'));
    setQuestionsForm(BestimateQuestions('en').filter(quest => quest.inputs));
  }, []);

  useEffect(() => {
    if (gameHistory && gameHistory.data) {
      const checkGameExist = gameHistory.data.find(item => item.achievement.stub === getAchievement() && item.page === property.id);
      if (typeof checkGameExist !== 'undefined') {
        setFinishedFlow(true);
        setDoneMarketCheck(true);
      } else {
        setFinishedFlow(false);
        setDoneMarketCheck(false);
      }
      setLoaded(true);
    }
  }, [gameHistory]);

  useEffect(() => {
    if (toSave) {
      const dataProp = formValue;
      delete dataProp.owner;
      // CALC THE PROPERTY CONDITION
      // const yearBuilt = get(formValue, 'properties.building.built', null);
      // const yearRenovate = get(formValue, 'properties.building.renovated', null);
      // const age = calculateAgeByYear(yearBuilt);
      // const valueConstruction = get(formValue, 'properties.building.constructionMaterials', null);
      // const valueRoof = get(formValue, 'properties.building.roofType', null);
      // const valueHeating = get(formValue, 'properties.building.energy.heating', null);
      // dataProp.bestimate = {
      //   date: new Date(),
      //   construction: extractBestimateCondition(age, valueConstruction, valueRoof, valueHeating),
      // };
      // if (yearRenovate) {
      //   const ageRenovation = calculateAgeByYear(yearRenovate);
      //   dataProp.bestimate.renovation = extractBestimateCondition(ageRenovation, valueConstruction, valueRoof, valueHeating);
      //   dataProp.properties.building.isPropertyRenovated = 1;
      // }
      if (finishedFlow) setStep(step + 2);
      else setStep(step + 1);
      setToSave(false);
      // // UPDATE PROPERTY
      // handleUpdatePage(dataProp);
      // // ADD THE ACHIEVEMENT
      const data = {
        id: loggedUser.user.id,
        page: property.stub,
        achievement: getAchievement(),
      };
      const checkGameExist = gameHistory.data.find(item => item.achievement.stub === getAchievement() && item.page === property.id);
      if (typeof checkGameExist === 'undefined') {
        handleAddGameHistory(data);
      }
    }
  }, [formValue, toSave]);

  useEffect(() => {
    if (Questions.length > 0) {
      if (doneMarketCheck) {
        handleSetModal({
          state: false,
          multiActions: [
            {
              bkg: 'red',
              btnType: 'Primary',
              className: 'mr-2',
              name: 'No, Not Now',
              func: () => history.push('../')
            },
            {
              btnType: 'Primary',
              name: 'Yes, update it',
              func: () => setDoneMarketCheck(false),
            },
          ]
        });
      } else if (Questions[step] && (Questions[step + 1] && Questions[step + 1].inputs) || (Questions[step - 1] && Questions[step - 1].inputs) ) {
        handleSetModal({
          state: false,
          multiActions: [{
            btnType: 'Primary',
            name: 'Continue',
            func: () => setStep(step + 1)
          }]
        });
      } else if (Questions[step] && Questions[step].inputs && Questions[step + 1]) {
        handleSetModal({
          state: false,
          multiActions: [{
            btnType: 'Primary',
            name: 'Finish',
            func: () => setToSave(true),
          }]
        });
      } else {
        handleSetModal({
          state: false,
          multiActions: [{
            btnType: 'Primary',
            name: 'Got it',
            func: () => history.push('../')
          }]
        });
      }
    }
  }, [step, Questions, doneMarketCheck]);

  if (!Questions[0] && !loaded) {
    return (<div />)
  }

  return (
    <div>
      <h2>Bestimate®</h2>
      {
        doneMarketCheck ? (
          <ResumeBestimate finishStep />
        ) : (
          <>
          {console.log('here', Questions[step])}
            {
              Questions[step] && Questions[step].inputs ? (
                <MultiStepReduxForm
                  form="Bestimate"
                  questions={QuestionsForm}
                  onChangeStep={(val) => setStep(val)}
                  step={step}
                  formStep={QuestionsForm.findIndex(key => key.history === Questions[step].history)}
                  startValue={initialValue}
                />
              ) : (
                <>
                  {
                    Questions[step] && Questions[step].component ? (
                      <div>
                        {
                          React.createElement(Questions[step].component, {formName: 'Bestimate', initialValue: initialValue})
                        }
                      </div>
                    ) : (
                      <div>
                        <h2>{Questions[step].title}</h2>
                        <p>{Questions[step].description}</p>
                      </div>
                    )
                  }
                </>
              )
            }
          </>
        )
      }

    </div>
  )
};

Bestimate.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  gameHistory: PropTypes.object.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleUpdatePage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValue: PropTypes.object,
  loggedUser: PropTypes.object.isRequired,
  stubAchievement: PropTypes.string,
};

Bestimate.defaultProps = {
  initialValue: {},
  stubAchievement: null,
};

const mapStateToProps = (state, props) => ({
  formValue: get(state, 'form.Bestimate.values', {}),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  initialValue: get(state, 'property.property', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
  stubAchievement: get(props, 'match.params.stub-achievement', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Bestimate', field, value));
  },
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleUpdatePage: bindActionCreators(updateProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Bestimate);
