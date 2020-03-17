/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { getGamegroup } from '../../actions/GamificationActions';
import doneAssessor from '../../images/Assessor/doneAssessor.svg';
import newAssessor from '../../images/Assessor/newAssessor.svg';
import becomeAssessor from '../../images/Assessor/becomeAssessor.svg';
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
    <main id="rewards" className="pb-4">

      {
        groupdAchievement.done ? (
          <>
            {
              achievement && (
                <>
                  {
                    isNew ? (
                      <>
                        <h5 className="ta-c mb-5">Well done. You are now an Assessor.</h5>
                        <div className="ta-c"><img src={doneAssessor} alt="Nes Assessor" /></div>
                        <p className="ta-c mt-5">Congrats! <br/> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (

                      <>
                        <h5 className="ta-c mb-5">You are already an Assessor</h5>
                        <div className="ta-c"><img src={newAssessor} alt="Done Assessor" /></div>
                        <p className="ta-c mt-5">Would you like to do the condition check again?</p>
                        <div className="dis-r jc-c">
                          <div className="dis-f jc-b mt-3 a-c">
                            <BrixelButtonPrimary
                              rounded
                              label="Cancel"
                              background={"white"}
                              saturation={0}
                              color="dark"
                              saturationTxt={700}
                              className="max-w-fix-280 w-perc-100 mr-2 shadow-3dp"
                              onClick={() => history.push(`/${propID}/rewards`) }
                            />
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
            <h5 className="ta-c mb-5">Assess your property with a condition check</h5>
            <div className="ta-c"><img className="w-fix-100" src={becomeAssessor} alt="Done Assessor" /></div>
            <p className="ta-c mt-5 txtDark700">As an assessor, you know about the condition of the most important parts of your property.</p>
            <div className="dis-f jc-b mt-3 a-c">
              <BrixelButtonPrimary
                rounded
                label="Cancel"
                background={"white"}
                saturation={0}
                color="dark"
                saturationTxt={700}
                className="max-w-fix-280 w-perc-100 mr-2 shadow-3dp"
                onClick={() => history.push(`/${propID}/rewards`) }
              />
              <BrixelButtonPrimary
                rounded
                label="Ok, show me"
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
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
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
  handleGetGameGroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessAssessor);
