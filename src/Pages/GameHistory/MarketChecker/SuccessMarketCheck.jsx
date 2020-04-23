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
import newMarketCheck from '../../../images/MarketCheck/newMarketCheck.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import startMarketCheck from '../../../images/MarketCheck/startMarketCheck.svg';
import moment from 'moment';

function SuccessMarketCheck(props) {
  // PROPS
  const {
    gameGroup,
    history,
    gameStub,
    groupdAchievement,
    match,
    marketData,
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
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-c a-c`}>
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
                        <div className="ta-c my-3"><img src={newMarketCheck} alt="Nes Assessor" /></div>
                        <p className="ta-c mb-2">Congrats! <br/> You earned the <span className="txtGreen400">Market Checker</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (
                      <>
                        <div className="dis-fl-col jc-c a-c">
                          <div className="ta-c mb-3">
                            <img src={startMarketCheck} alt="Done Market Check" />
                          </div>
                          <h5 className="mb-2 m-a ta-c">
                            <span>{marketData.similar_properties}</span>&nbsp;
                            <span>similar properties in your area.</span>
                          </h5>
                          <p className="body2 txtDark200 m-a ta-c">
                            <span>Last updated</span>
                            <span>:&nbsp;{moment(marketData.market_check_date).format('MMMM DD YYYY / HH:mm')}</span>
                          </p>
                        </div>
                        <div className="w-perc-100">
                          <BrixelButtonPrimary
                            rounded
                            label="Yes, update"
                            background={"primary"}
                            className="pl-3 m-a mt-2"
                            onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                            rightIcon="arrow-right"
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
              <div className="ta-c mb-3">
                <img src={startMarketCheck} alt="Start Market Check" />
              </div>
              <h5 className="mb-2 m-a">
                Compare your local market.
              </h5>
              <p className="body2 txtDark200 m-a ta-c">
                Stop browsing all the portals. I show you all similar properties on sale. Instantly.
              </p>
            </div>
            <div className="w-perc-100">
              <BrixelButtonPrimary
                rounded
                label="Check market now"
                background={"primary"}
                className="pl-3 m-a mt-3"
                onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
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
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
};

SuccessMarketCheck.defaultProps = {
  finishedFlow: false,
  groupdAchievement: {},
  gameStub: null,

};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  marketData: get(state, 'property.activeSingleProperty.packageFlowProcess.rewardScreenData', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessMarketCheck);
