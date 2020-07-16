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
import { getGamegroup } from '../../../actions/GamificationActions';
import newBestimate from '../../../images/Bestimate/newBestimate.svg';
import startBestimate from '../../../images/Bestimate/startBestimate.svg';
import generatingBestimate from '../../../images/Bestimate/generatingBestimate.png';
import { getMarketCheck } from '../../../actions/PropertyActions';
import RangePriceChart from '../../../components/Charts/RangePriceChart';
import emptyHouseImg from '../../../images/emptyHub.svg';

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

  // LOAD MARKET DATA
  useEffect(() => {
    if (get(activeSingleProperty, 'id', '') && !marketData.priceDistribution) {
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
        stateCode: activeSingleProperty.location.countryCode,
      };
      handleGetMarketCheck(data);
    }
  }, [activeSingleProperty]);

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
  }, [gameGroup]);

  const bestimateValue = get(bestimate, 'higherValue', 0);

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col a-c">
      {
        get(groupdAchievement, 'done', null) || getDoneFirstTime() === 'done' ? (
          <>
            {
              achievement && (
                <>
                  {
                    getDoneFirstTime().includes('-done') ? (
                      <>
                        <h5 className="ta-c max-w-fix-376 mb-2">Well done. You are now an Assessor.</h5>
                        <p className="max-w-fix-376 m-a ta-c">Congrats! <br /><br /> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                        <div className="ta-c m-a my-5">
                          <img className="h-fix-120" src={newBestimate} alt="Nes Assessor" />
                        </div>
                      </>
                    ) : (
                      <>
                        {
                          get(marketData, 'priceDistribution.chartRangePrice', null) !== null ? (
                            <>
                              {
                                get(activeSingleProperty, 'location.countryCode', null) === 'CH' ? (
                                  <>
                                    <div className="dis-fl-col jc-c a-c">
                                      <h5 className="ta-c max-w-fix-376 mb-2">Your estimated value</h5>
                                      <p className="body2 max-w-fix-376 txtDark200 m-a ta-c">
                                        Bestimate® is calculated based on similar transaction.
                                      </p>
                                      <div className="ta-c mb-5 mt-2 pos-r">
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
                                        <div className="ta-l m-a w-fit">
                                          <p className="fsize-100 txtDark200">Worth up to</p>
                                          <h5 className="ff-mono txtBlue700 fweight-700">
                                            <span>{bestimate.currency}</span>&nbsp;
                                            <span>{bestimateValue.toLocaleString('de-CH')}</span>
                                          </h5>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-perc-100">
                                      <BrixelButtonPrimary
                                        rounded
                                        label="See full Bestimate®"
                                        background="primary"
                                        className="min-w-fix-208 m-a "
                                        onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`)}
                                        rightIcon="arrow-right"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="dis-fl-col jc-c a-c">
                                    <h5 className="ta-c max-w-fix-376 mb-2">Generating your estimation...</h5>
                                    <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300">
                                      Our experts are validating the data and generating an extimation report just for you
                                    </p>
                                    <img src={generatingBestimate} alt="Generating Bestimate" className="w-fix-320 my-2" />
                                    <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300 dis-f flex-wrap">
                                      If you have any questions please contact our <span className="ml-small-4 cur-poi txtPrimary400" onClick={() => history.push({ state: { showSupport: true } })}>support</span>
                                    </p>
                                  </div>
                                )
                              }
                            </>
                          ) : (
                            <>
                              {
                                get(marketData, 'priceDistribution', null) && (
                                  <div className="dis-fl-col a-c jc-c">
                                    <img src={emptyHouseImg} alt="Empty Market Data" />
                                    <h5 className="mt-3 mb-2">Dude. Where&apos;s my data?</h5>
                                    <p className="ta-c txtDark200 max-w-fix-320 m-a">Unfortunately there is not enough data available to
                                      calculate your result
                                    </p>
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
              <h5 className="mb-2 m-a ta-c max-w-fix-376">
                Get a free price indication.
              </h5>
              <p className="body2 max-w-fix-376 txtDark200 m-a ta-c">
                Compare your property to real transaction data to better define the pricing.
              </p>
              <div className="ta-c m-a my-5">
                <img className="h-fix-120" src={startBestimate} alt="Done Assessor" />
              </div>
            </div>
            <div className="w-perc-100">
              <BrixelButtonPrimary
                rounded
                label="Get free Bestimate®"
                background="primary"
                className="min-w-fix-208 m-a"
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

SuccessBestimate.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  bestimate: PropTypes.object.isRequired,
  groupdAchievement: PropTypes.object,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  handleGetMarketCheck: PropTypes.func.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
};

SuccessBestimate.defaultProps = {
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
