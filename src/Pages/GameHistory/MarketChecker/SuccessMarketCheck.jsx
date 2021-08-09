/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import { DateTime } from 'luxon';
import { getGamegroup } from '../../../actions/GamificationActions';
import newMarketCheck from '../../../images/MarketCheck/newMarketCheck.svg';
import startMarketCheck from '../../../images/MarketCheck/startMarketCheck.svg';
import simillarMarketCheck from '../../../images/MarketCheck/simillarMarketCheck.svg';
import emptyHouseImg from '../../../images/emptyHub.svg';

function SuccessMarketCheck(props) {
  // PROPS
  const {
    gameGroup,
    history,
    gameStub,
    groupdAchievement,
    match,
    marketData,
    userLang,
  } = props;
  // STATE
  const [achievement, setAchievement] = useState(null);
  // URL PARAMS
  const getParams = gameStub;
  const propID = get(match, 'params.propId', null);
  const getDoneFirstTime = () => last(history.location.pathname.split('/'))[last(history.location.pathname.split('/')).length - 1];

  // GET CURRENT GAME GROUP
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
        get(groupdAchievement, 'done', false) || getDoneFirstTime() === 'done' ? (
          <>
            {
              achievement && (
                <>
                  {
                    getDoneFirstTime() === 'done' ? (
                      <>
                        <h5 className="ta-c max-w-fix-376 m-a">Great, now you know what is out there.</h5>
                        <div className="ta-c my-5">
                          <img className="h-fix-120" src={newMarketCheck} alt="Nes Assessor" />
                        </div>
                        <p className="ta-c max-w-fix-376">Congrats! <br /> You earned the <span className="txtGreen400">Market Checker</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (
                      <>
                        {
                          get(marketData, 'similar_properties', 0) > 0 ? (
                            <>
                              <div className="dis-fl-col jc-c a-c">
                                <h5 className="mb-2 ta-c max-w-fix-376 m-a">
                                  <span>{marketData.similar_properties}</span>&nbsp;
                                  <span>similar properties in your area.</span>
                                </h5>
                                <p className="body2 txtDark200 m-a ta-c max-w-fix-376">
                                  <span>Last updated</span>
                                  <span>:&nbsp;{DateTime.fromISO(marketData.market_check_date, { locale: userLang }).toFormat('d LLL yyyy, H:mm')}</span>
                                </p>
                                <div className="ta-c my-5">
                                  <img className="w-fix-352" src={simillarMarketCheck} alt="Done Market Check" />
                                </div>

                              </div>
                              <div>
                                <BrixelButtonPrimary
                                  rounded
                                  label="Update now"
                                  background="primary"
                                  className="m-a"
                                  onClick={() => history.push(`/${propID}/singleFlow/achievement/${getParams}`)}
                                  rightIcon="arrow-right"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {
                                get(marketData, 'similar_properties', -1) > -1 && (
                                  <div className="dis-fl-col a-c jc-c">
                                    <img src={emptyHouseImg} alt="Empty Market Data" />
                                    <h5 className="mt-3 mb-2">Dude. Where&apos;s my data?</h5>
                                    <p className="ta-c txtDark200 max-w-fix-320 m-a">Unfortunately there is not enough
                                      data available to calculate your result
                                    </p>
                                    <BrixelButtonPrimary
                                      rounded
                                      label="Check market now"
                                      className="m-a mt-2"
                                      onClick={() => history.push(`/${propID}/singleFlow/achievement/${getParams}`)}
                                      rightIcon="arrow-right"
                                    />
                                  </div>
                                )
                              }
                            </>
                          )
                        }
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
              <h5 className="mb-2 m-a max-w-fix-376 ta-c">
                Know your local market.
              </h5>
              <p className="body2 txtDark200 m-a ta-c max-w-fix-376">
                Stop browsing all the portals. You can see all similar properties on sale. Instantly.
              </p>
              <div className="ta-c my-5">
                <img className="h-fix-120" src={startMarketCheck} alt="Start Market Check" />
              </div>
            </div>
            <div className="w-perc-100">
              <BrixelButtonPrimary
                rounded
                label="Check market now"
                className="m-a"
                onClick={() => history.push(`/${propID}/singleFlow/achievement/${getParams}`)}
                rightIcon="arrow-right"
              />
            </div>
          </>
        )
      }
    </main>
  );
}

SuccessMarketCheck.propTypes = {
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
  userLang: PropTypes.string.isRequired,
};

SuccessMarketCheck.defaultProps = {
  groupdAchievement: {},
  gameStub: null,

};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  marketData: get(state, 'property.activeSingleProperty.packageFlowProcess.rewardScreenData', {}),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessMarketCheck);
