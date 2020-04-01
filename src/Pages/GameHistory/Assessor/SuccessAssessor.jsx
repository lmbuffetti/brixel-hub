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
import becomeAssessor from '../../../images/Assessor/becomeAssessor.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

function SuccessAssessor(props) {
  // PROPS
  const {
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
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-b ${ isNew ? "p-2 p-md-4 pb-5" : "pt-2 pt-md-4"}`}>

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
                        <div className="ta-c"><img src={doneAssessor} alt="Nes Assessor" /></div>
                        <p className="ta-c mt-5">Congrats! <br/> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (

                      <>
                        <h5 className="ta-c px-2 px-md-4">You are already an Assessor</h5>
                        <div className="ta-c"><img src={newAssessor} alt="Done Assessor" /></div>
                        <div className="dis-fl-col jc-c a-c">
                          <p className="ta-c px-2 px-md-4">Would you like to do the condition check again?</p>
                          <div className="shadow-1dp-top w-perc-100 p-1 p-md-2 mt-2 brdRadiusTop">
                            <BrixelButtonPrimary
                              rounded
                              label="Yes, update"
                              background={"primary"}
                              className="max-w-fix-280 w-perc-100 m-a"
                              onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                              rightIcon="arrow-right-small"
                            />
                          </div>
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
            <h5 className="ta-c px-2 px-md-4">Assess your property with a condition check</h5>
            <div className="ta-c m-a h-perc-50"><img className="h-perc-100" src={becomeAssessor} alt="Done Assessor" /></div>
            <div className="dis-fl-col jc-c a-c">
              <p className="ta-c txtDark700 px-2 px-md-4 w-perc-md-75">As an assessor, you know about the condition of the most important parts of your property.</p>
              <div className="shadow-1dp-top w-perc-100 p-1 p-md-2 mt-2 brdRadiusTop">
                <BrixelButtonPrimary
                  rounded
                  label="Ok, show me"
                  background={"primary"}
                  className="max-w-fix-280 w-perc-100 m-a"
                  onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                  rightIcon="arrow-right-small"
                />
              </div>
            </div>
          </>
        )
      }
    </main>
  );
}

SuccessAssessor.propTypes = {
  finishedFlow: PropTypes.bool,
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
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessAssessor);
