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
import doneMarketCheck from '../../../images/MarketCheck/doneMarketCheck.svg';
import newMarketCheck from '../../../images/MarketCheck/newMarketCheck.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import startMarketCheck from '../../../images/MarketCheck/startMarketCheck.svg';

function SuccessMarketCheck(props) {
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
  const getDoneFirstTime = () => last(history.location.pathname.split('/'))[last(history.location.pathname.split('/')).length - 1];

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
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-b ${getDoneFirstTime() === 'done' ? "p-2 p-md-4 pb-5" : "pt-2 pt-md-4"}`}>
      {
        groupdAchievement.done || getDoneFirstTime() === 'done' ? (
          <>
            {
              achievement && (
                <>
                  {
                    getDoneFirstTime() === 'done' ? (
                      <>
                        <h5 className="ta-c">Great, now you know what is out there.</h5>
                        <div className="ta-c"><img src={newMarketCheck} alt="Nes Assessor" /></div>
                        <p className="ta-c mb-2">Congrats! <br/> You earned the <span className="txtGreen400">Market Checker</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (
                      <>
                        <h5 className="ta-c px-2 px-md-4">Looks like you can’t get enough data.</h5>
                        <div className="ta-c"><img src={doneMarketCheck} alt="Done Assessor" /></div>
                        <div className="dis-fl-col jc-c a-c">
                          <p className="ta-c px-2 px-md-4">We update these data daily. Would you like to update it now?</p>
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
            <h5 className="ta-c px-2 px-md-4">Check your local market</h5>
            <div className="ta-c m-a w-perc-md-75"><img className="w-perc-md-75" src={startMarketCheck} alt="Done Assessor" /></div>
            <div className="dis-fl-col jc-c a-c">
              <p className="ta-c txtDark700 px-2 px-md-4 w-perc-md-75">Stop browsing all the portals. I show you all similar properties on sale. Instantly.</p>
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

SuccessMarketCheck.propTypes = {
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
};

SuccessMarketCheck.defaultProps = {
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
)(SuccessMarketCheck);
