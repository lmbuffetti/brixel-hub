import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MultiStepReduxForm from '../../components/MultiStepReduxForm';
import { MarketCheckQuestions } from '../../resources/MarketCheck';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../actions/CommonActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// COMPONENTS
import last from 'lodash/last';
import { addGameHistory } from '../../actions/GamificationActions';
import SuccessMarketCheck from './SuccessMarketCheck';
import { change } from 'redux-form';

const MarketChecker = (props) => {
  // PROPS
  const {
    changeFieldValue,
    formValue,
    gameHistory,
    handleAddGameHistory,
    handleSetModal,
    history,
    initialValue,
    loggedUser,
    property,
    stubAchievement,
  } = props;
  // STATE
  const [Questions, setQuestions] = useState([]);
  const [QuestionsForm, setQuestionsForm] = useState([]);
  const [doneMarketCheck, setDoneMarketCheck] = useState(true);
  const [finishedFlow, setFinishedFlow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  // GET STUB ACVHIEVEMNT
  const getAchievement = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    setQuestions(MarketCheckQuestions('en'));
    setQuestionsForm(MarketCheckQuestions('en').filter(quest => quest.inputs));
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

  const saveAchievement = () => {
    const data = {
      id: loggedUser.user.id,
      page: property.stub,
      achievement: getAchievement(),
    };
    const checkGameExist = gameHistory.data.find(item => item.achievement.stub === getAchievement() && item.page === property.id);
    if (typeof checkGameExist === 'undefined') {
      handleAddGameHistory(data);
    }
    setStep(step + 1);
  };

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
      } else if (Questions[step] && Questions[step].inputs) {
        handleSetModal({
          state: false,
          multiActions: [{
            btnType: 'Primary',
            name: 'Continue',
            func: () => setStep(step + 1)
          }]
        });
      } else if (Questions[step] && Questions[step + 1]) {
        handleSetModal({
          state: false,
          multiActions: [{
            btnType: 'Primary',
            name: 'Finish',
            func: () => finishedFlow ? history.push('../') : saveAchievement(),
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
      <h2>Market Checker {stubAchievement}</h2>
      {
        doneMarketCheck ? (
          <SuccessMarketCheck finishStep />
        ) : (
          <>
            {
              Questions[step] && Questions[step].inputs ? (
                <MultiStepReduxForm
                  form="MarketCheck"
                  questions={QuestionsForm}
                  onChangeStep={(val) => setStep(val)}
                  step={step}
                  startValue={initialValue}
                />
              ) : (
                <>
                  {
                    Questions[step] && Questions[step].component && (
                      <div>
                        {
                          React.createElement(Questions[step].component, {formName: 'MarketCheck', initialValue: initialValue})
                        }
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

MarketChecker.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  gameHistory: PropTypes.object.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValue: PropTypes.object,
  loggedUser: PropTypes.object.isRequired,
  stubAchievement: PropTypes.string.isRequired,
};

MarketChecker.defaultProps = {
  initialValue: {}
};

const mapStateToProps = (state, props) => ({
  formValue: get(state, 'form.MarketCheck.values', {}),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  initialValue: {
    properties: {
      building: {
        conditionCode: get(state, 'property.property.properties.building.conditionCode', null),
      },
    },
  },
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
  stubAchievement: get(props, 'match.params.stub-achievement', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('MarketCheck', field, value));
  },
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(MarketChecker);
