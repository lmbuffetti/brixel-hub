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
import newBestimate from '../../../images/Bestimate/newBestimate.svg';
import startBestimate from '../../../images/Bestimate/startBestimate.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import { getMarketCheck } from '../../../actions/PropertyActions';
import RangePriceChart from '../../../components/Charts/RangePriceChart';

function SuccessBestimate(props) {
  // PROPS
  const {
    activeSingleProperty,
    bestimate,
    gameGroup,
    handleGetGamegroup,
    history,
    gameStub,
    groupdAchievement,
    handleGetMarketCheck,
    match,
    marketData,
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
    if (activeSingleProperty && activeSingleProperty.id && !marketData.priceDistribution) {
      const latBoundsRadius = 0.0675;
      const longBoundsRadius = 0.1;
      const livingSpace = get(activeSingleProperty, 'properties.typology.livingArea.value', 0);
      const percLivingSpace = +livingSpace * 0.5;
      const data = {
        north: activeSingleProperty.location.latitude + latBoundsRadius,
        south: activeSingleProperty.location.latitude - latBoundsRadius,
        west: activeSingleProperty.location.longitude - longBoundsRadius,
        east: activeSingleProperty.location.longitude + longBoundsRadius,
        propertyType: activeSingleProperty.properties.propertyType,
        minLivingSpace: +livingSpace - percLivingSpace,
        maxLivingSpace: +livingSpace + percLivingSpace,
        stateCode: 'CH',
      };
      handleGetMarketCheck(data);
    }
  }, [activeSingleProperty]);

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

  const bestimateValue = get(bestimate, 'higherValue', 0);

  return (
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-c a-c pt-md-2`}>
      {
        groupdAchievement.done || getDoneFirstTime() === 'done' ? (
          <>
            {
              achievement && (
                <>
                  {
                    getDoneFirstTime().includes('-done') ? (
                      <>
                        <h5 className="ta-c max-w-fix-368">Well done. You are now an Assessor.</h5>
                        <div className="ta-c m-a mb-3">
                          <img className="h-fix-120" src={newBestimate} alt="Nes Assessor" />
                        </div>
                        <p className="max-w-fix-368 ta-c mb-2">Congrats! <br/> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (
                      <>
                        <div className="dis-fl-col jc-c a-c">
                          <div className="ta-c mb-3 pos-r">
                            {
                              get(marketData, 'priceDistribution.chartRangePrice', null) && get(activeSingleProperty, 'estimation.bestimate', null) && (
                                <div className="dis-f jc-c">
                                  <RangePriceChart
                                    properties={marketData.priceDistribution.chartRangePrice}
                                    type="bestimate"
                                    bestimate={activeSingleProperty.estimation.bestimate}
                                    showTopLabel={false}
                                  />
                                </div>
                              )
                            }
                            <div className="ta-l pb-2 m-a w-fit">
                              <p className="body2 txtDark200">Worth up to</p>
                              <h5 className="ff-mono fweight-700">
                                <span>{bestimate.currency}</span>&nbsp;
                                <span>{bestimateValue.toLocaleString('de-CH')}</span>
                              </h5>
                            </div>
                          </div>
                          <p className="body2 max-w-fix-368 txtDark200 m-a ta-c">
                            Based on similar transaction.
                          </p>
                        </div>
                        <div className="w-perc-100">
                          <BrixelButtonPrimary
                            rounded
                            label="See full Bestimate®"
                            background={"primary"}
                            className="pl-3 m-a mt-3"
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
              <div className="ta-c m-a mb-3">
                <img className="h-fix-120" src={startBestimate} alt="Done Assessor" />
              </div>
              <h5 className="mb-2 m-a ta-c">
                Get a free price indication.
              </h5>
              <p className="body2 max-w-fix-368 txtDark200 m-a ta-c">
                Compare your property to real transaction data to better define the pricing.
              </p>
            </div>
            <div className="w-perc-100">
              <BrixelButtonPrimary
                rounded
                label="Get free Bestimate®"
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

SuccessBestimate.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  bestimate: PropTypes.object.isRequired,
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
};

SuccessBestimate.defaultProps = {
  finishedFlow: false,
  groupdAchievement: {},
  gameStub: null,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  bestimate: get(state, 'property.activeSingleProperty.estimation.bestimate', {}),
  marketData: get(state, 'property.marketCheck', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleGetMarketCheck: bindActionCreators(getMarketCheck, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessBestimate);
