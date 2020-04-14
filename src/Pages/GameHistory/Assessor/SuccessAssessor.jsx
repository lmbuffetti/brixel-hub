/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { getGamegroup } from '../../../actions/GamificationActions';
import doneAssessor from '../../../images/Assessor/doneAssessor.svg';
import newAssessor from '../../../images/Assessor/newAssessor.svg';
import startAssessor from '../../../images/Assessor/startAssessor.svg';
import { BrixelButtonPrimary, BrixelButtonTertiary } from '@brixel/brixel-components';
import ChartDonuts from '../../../components/Charts/ChartDonuts';

function SuccessAssessor(props) {
  // PROPS
  const {
    formValue,
    gameGroup,
    history,
    gameStub,
    groupdAchievement,
    match,
  } = props;
  // STATE
  const [achievement, setAchievement] = useState(null);
  // URL PARAMS
  const getParams = gameStub;
  const propID = get(match, 'params.propId', null);
  const isNew = get(history, 'location.state.isNew', false);


  useEffect(() => {
    if (gameGroup) {
      let selectedGame;
      gameGroup.map((game) => {
        let curGame = game.achievements.find(item => item.stub === getParams);
        if (curGame) selectedGame = curGame;
        return null;
      });
      setAchievement(selectedGame);
    }
  }, [gameGroup, getParams]);

  return (
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-b a-c`}>
      {
        groupdAchievement.done ? (
          <>
            {
              achievement && (
                <>
                  {
                    isNew ? (
                      <>
                        <h5 className="ta-c">Well done. You are now an Assessor.</h5>
                        <div className="ta-c my-3"><img src={newAssessor} alt="Nes Assessor" /></div>
                        <p className="ta-c mt-5">Congrats! <br/> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (
                      <>
                        <div className="dis-fl-col jc-c a-c">
                          <div className="brdRadius bgGreen100 p-2 mb-3">
                            <ChartDonuts
                              assessor={get(formValue, 'assessor.construction', {})}
                              smallPie
                              noText
                            />
                          </div>
                          <h5 className="mb-2 m-a ta-c">
                            Your property’s conditon
                          </h5>
                          <p className="body2 txtDark200 m-a ta-c">
                            The values are calculated with the average lifespan of each element.
                          </p>
                        </div>
                        <div className="w-perc-100 p-1 p-md-2 mt-2">
                          <BrixelButtonPrimary
                            rounded
                            label="See full report"
                            background={"primary"}
                            className="max-w-fix-280 w-perc-100 m-a"
                            onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                            rightIcon="arrow-right-small"
                          />
                          <BrixelButtonTertiary
                            label="Redo condition check"
                            className="max-w-fix-280 w-perc-100 m-a mt-3"
                            onClick={() => history.push({
                              pathname: `/${propID}/rewards/achievement/${getParams}`,
                              state: { redo: true }
                            }) }
                          />
                        </div>
                      </>
                    )
                  }
                </>
              )
            }
          </>
        ) : (
          <>
            <div className="dis-fl-col jc-c a-c">
              <div className="ta-c m-a h-perc-50 mb-3">
                <img className="h-perc-100" src={startAssessor} alt="Done Assessor" />
              </div>
              <h5 className="mb-2 m-a ta-c">
                Assess your property with a condition check
              </h5>
              <p className="body2 txtDark200 m-a ta-c">
                As an assessor, you know about the condition of the most important parts of your property.
              </p>
            </div>
            <div className="w-perc-100 p-1 p-md-2 mt-2">
              <BrixelButtonPrimary
                rounded
                label="Assess condition"
                background={"primary"}
                className="max-w-fix-280 w-perc-100 m-a"
                onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                rightIcon="arrow-right-small"
              />
            </div>
          </>
        )
      }
    </main>
  );
}

SuccessAssessor.propTypes = {
  finishedFlow: PropTypes.bool,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
};

SuccessAssessor.defaultProps = {
  finishedFlow: false,
  groupdAchievement: {},
  gameStub: null,

};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  formValue: get(state, 'form.Property.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessAssessor);
