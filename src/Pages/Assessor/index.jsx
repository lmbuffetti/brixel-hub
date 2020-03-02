/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MultiStepReduxForm from '../../components/MultiStepReduxForm';
import { AssessorQuestions } from '../../resources/Assessor';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../actions/CommonActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { calculateAgeByYear, extractAssessorCondition } from '../../utils/helpers';

// COMPONENTS
import last from 'lodash/last';
import { addGameHistory } from '../../actions/GamificationActions';
import { updateProperty } from '../../actions/PropertyActions';
import { change } from 'redux-form';
import ResumeAssessor from './ResumeAssessor';

const Assessor = (props) => {
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
    setQuestions(AssessorQuestions('en'));
    setQuestionsForm(AssessorQuestions('en').filter(quest => quest.inputs));
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
      const yearBuilt = get(formValue, 'properties.building.built', null);
      const yearRenovate = get(formValue, 'properties.building.renovated', null);
      const age = calculateAgeByYear(yearBuilt);
      const valueConstruction = get(formValue, 'properties.building.constructionMaterials', null);
      const valueRoof = get(formValue, 'properties.building.roofType', null);
      const valueFacade = get(formValue, 'properties.building.facade', null);
      const valueHeating = get(formValue, 'properties.building.energy.heating', null);
      dataProp.assessor = {
        date: new Date(),
        construction: extractAssessorCondition(age, valueConstruction, valueRoof, valueFacade, valueHeating),
      };
      if (yearRenovate) {
        const ageRenovation = calculateAgeByYear(yearRenovate);
        dataProp.assessor.renovation = extractAssessorCondition(ageRenovation, valueConstruction, valueRoof, valueFacade, valueHeating);
        dataProp.properties.building.isPropertyRenovated = 1;
      }
      setStep(step + 1);
      setToSave(false);
      // UPDATE PROPERTY
      handleUpdatePage(dataProp);
      // ADD THE ACHIEVEMENT
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
      } else if (
        Questions[step] &&
        (
          (Questions[step + 1] && Questions[step + 1].inputs) ||
          (Questions[step - 1] && Questions[step - 1].inputs)
        ) &&
        (!Questions[step + 1].hideDone || (Questions[step + 1].hideDone && !finishedFlow)) &&
        !Questions[step].toSave
      ) {
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
      <h2>Assessor</h2>
      {
        doneMarketCheck ? (
          <ResumeAssessor finishStep />
        ) : (
          <>
            {
              Questions[step] && Questions[step].inputs ? (
                <MultiStepReduxForm
                  form="Assessor"
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
                          React.createElement(Questions[step].component, {formName: 'Assessor', initialValue: initialValue})
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

Assessor.propTypes = {
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

Assessor.defaultProps = {
  initialValue: {},
  stubAchievement: null,
};

const mapStateToProps = (state, props) => ({
  formValue: get(state, 'form.Assessor.values', {}),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  initialValue: get(state, 'property.property', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
  stubAchievement: get(props, 'match.params.stub-achievement', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Assessor', field, value));
  },
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleUpdatePage: bindActionCreators(updateProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Assessor);
