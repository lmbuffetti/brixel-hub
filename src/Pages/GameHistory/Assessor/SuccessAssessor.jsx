/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelButtonPrimary, BrixelButtonText } from '@brixel/brixel-components';
import { getGamegroup } from '../../../actions/GamificationActions';
import newAssessor from '../../../images/Assessor/newAssessor.svg';
import startAssessor from '../../../images/Assessor/startAssessor.svg';
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

  // GET CURRENT GROUP
  useEffect(() => {
    if (gameGroup) {
      let selectedGame;
      gameGroup.map((game) => {
        const curGame = game.achievements.find((item) => item.stub === getParams);
        if (curGame) selectedGame = curGame;
        return null;
      });
      setAchievement(selectedGame);
    }
  }, [gameGroup, getParams]);

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col a-c">
      {
        get(groupdAchievement, 'done', null) ? (
          <>
            {
              achievement && (
                <>
                  {
                    isNew ? (
                      <>
                        <div className="dis-fl-col jc-c a-c">
                          <h5 className="max-w-fix-376 m-a ta-c mb-2">Well done. You are now an Assessor.</h5>
                          <div className="ta-c my-5"><img src={newAssessor} alt="new Assessor" /></div>
                          <p className="max-w-fix-376 m-a ta-c">Congrats! <br /> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="dis-fl-col jc-c a-c">
                          <h5 className="max-w-fix-376 mb-2 m-a ta-c">
                            Your property’s condition
                          </h5>
                          <p className="max-w-fix-376 body2 txtDark200 m-a ta-c">
                            The values are calculated with the average lifespan of each element.
                          </p>
                          <div className="brdRadius my-5">
                            <ChartDonuts
                              assessor={get(formValue, 'assessor.renovation', get(formValue, 'assessor.construction', {}))}
                              smallPie
                              noText
                            />
                          </div>

                        </div>
                        <div>
                          <BrixelButtonPrimary
                            rounded
                            label="See full report"
                            className="m-a mb-2"
                            onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`)}
                            rightIcon="arrow-right"
                          />
                          <BrixelButtonText
                            label="Redo condition check"
                            className="m-a"
                            onClick={() => history.push({
                              pathname: `/${propID}/rewards/achievement/${getParams}`,
                              state: { redo: true },
                            })}
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
              <h5 className="max-w-fix-376 mb-2 m-a ta-c">
                Assess your property with a condition check
              </h5>
              <p className=" max-w-fix-376 body2 txtDark200 m-a ta-c">
                As an assessor, you know about the condition of the most important parts of your property.
              </p>
              <div className="ta-c m-a h-perc-50 my-5">
                <img className="h-perc-100" src={startAssessor} alt="Done Assessor" />
              </div>
            </div>
            <div className="w-perc-100">
              <BrixelButtonPrimary
                rounded
                label="Assess condition"
                className="m-a"
                onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`)}
                rightIcon="arrow-right"
              />
            </div>
          </>
        )
      }
    </main>
  );
}

SuccessAssessor.propTypes = {
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

SuccessAssessor.defaultProps = {
  groupdAchievement: {},
  gameStub: null,

};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  formValue: get(state, 'brixelForm.Property.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessAssessor);
