/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { getGamegroup } from '../../../actions/GamificationActions';
import doneBestimate from '../../../images/Bestimate/doneBestimate.svg';
import newBestimate from '../../../images/Bestimate/newBestimate.svg';
import startBestimate from '../../../images/Bestimate/startBestimate.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

function SuccessBestimate(props) {
  // PROPS
  const {
    gameGroup,
    handleGetGamegroup,
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
  const getDoneFirstTime = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    handleGetGamegroup();
  }, []);

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
  }, [gameGroup]);

  return (
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-b ${getDoneFirstTime().includes('-done') ? "p-2 p-md-4 pb-5" : "pt-2 pt-md-4"}`}>
      {
        groupdAchievement.done || getDoneFirstTime() === 'done' ? (
          <>
            {
              achievement && (
                <>
                  {
                    getDoneFirstTime().includes('-done') ? (
                      <>
                        <h5 className="ta-c">Well done. You are now an Assessor.</h5>
                        <div className="ta-c"><img src={newBestimate} alt="Nes Assessor" /></div>
                        <p className="ta-c mb-2">Congrats! <br/> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (

                      <>
                        <h5 className="ta-c px-2 px-md-4">You are already a Bestimate&reg;</h5>
                        <div className="ta-c"><img src={doneBestimate} alt="Done Assessor" /></div>
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
            <h5 className="ta-c px-2 px-md-4">Get a free price indication</h5>
            <div className="ta-c"><img className="w-fix-100" src={startBestimate} alt="Done Assessor" /></div>
            <div className="dis-fl-col jc-c a-c">
              <p className="ta-c txtDark700 px-2 px-md-4">Compare your property to real transaction data to better define the pricing.</p>
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

SuccessBestimate.propTypes = {
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

SuccessBestimate.defaultProps = {
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
)(SuccessBestimate);
