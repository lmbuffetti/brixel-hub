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
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-b a-c`}>
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
                        <div className="ta-c m-a h-perc-50 my-3">
                          <img src={newBestimate} alt="Nes Assessor" />
                        </div>
                        <p className="ta-c mb-2">Congrats! <br/> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (

                      <>
                        <div className="dis-fl-col jc-c a-c">
                          <div className="ta-c mb-3">
                            <img src={doneBestimate} alt="Done Assessor" />
                          </div>
                          <p className="body2 txtDark200 m-a ta-c">
                            Based on similar transaction.
                          </p>
                        </div>
                        <div className="w-perc-100 mt-2">
                          <BrixelButtonPrimary
                            rounded
                            label="See full Bestimate®"
                            background={"primary"}
                            className="max-w-fix-280 w-perc-100 m-a"
                            onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                            rightIcon="arrow-right-small"
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
              <div className="ta-c m-a mb-3">
                <img src={startBestimate} alt="Done Assessor" />
              </div>
              <h5 className="mb-2 m-a ta-c">
                Get a free price indication.
              </h5>
              <p className="body2 txtDark200 m-a ta-c">
                Compare your property to real transaction data to better define the pricing.
              </p>
            </div>
            <div className="w-perc-100 p-1 p-md-2 mt-2">
              <BrixelButtonPrimary
                rounded
                label="Get free Bestimate®"
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
