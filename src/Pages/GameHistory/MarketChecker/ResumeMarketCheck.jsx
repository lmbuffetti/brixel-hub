/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { BrixelIcon } from '@brixel/brixel-components';
import { getActiveSingleProperty, getMarketCheck, saveActiveSingleProperty } from '../../../actions/PropertyActions';
import { sendGenericMail } from '../../../actions/CommonActions';
import Maps from '../../../components/Map/Maps';
import RangePriceChart from '../../../components/Charts/RangePriceChart';
import emptyHouseImg from '../../../images/emptyHub.svg';
import Loading from '../../../components/Loading';

function ResumeMarketCheck(props) {
  // PROPS
  const {
    formValue,
    handleGetMarketData,
    handleSaveActiveSingleProperty,
    marketData,
    activeSingleProperty,
    gameHistory,
    isSmallLoading,
    match,
  } = props;
  // STATE
  const [saved, setSaved] = useState(false);
  const [isMarketCheckDone, setIsMarketCheckDone] = useState(false);

  useEffect(() => {
    if (get(activeSingleProperty, 'id', null) && !marketData.priceDistribution) {
      const latBoundsRadius = 0.0675;
      const longBoundsRadius = 0.1;
      let livingSpace = get(activeSingleProperty, 'properties.typology.livingArea.value', 0);
      if (get(activeSingleProperty, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0) {
        livingSpace = get(activeSingleProperty, 'properties.typology.grossArea.value', 0);
      }
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
        smallLoader: 'loadMarket',
      };
      handleGetMarketData(data);
    }
  }, [activeSingleProperty]);

  useEffect(() => {
    if (get(gameHistory, 'data', null)) {
      const checkGameExist = gameHistory.data.find((item) => item.achievement.stub === 'market-checker' && item.page === activeSingleProperty.id);
      if (typeof checkGameExist === 'undefined' && !isMarketCheckDone) {
        setIsMarketCheckDone(true);
      }
    }
  }, [gameHistory]);

  // GET MARKET CHECK
  useEffect(() => {
    if (get(marketData, 'priceDistribution', null) && !saved) {
      const oldPackageflow = get(activeSingleProperty, 'packageFlowProcess', {});
      const getOldOwnerType = get(activeSingleProperty, 'ownerType', null);
      const getOldWhenToSell = get(activeSingleProperty, 'whenToSell', null);
      const getOldTypeOfBuyer = get(activeSingleProperty, 'typeOfBuyer', null);
      const getOwnerType = get(oldPackageflow, 'ownerType', getOldOwnerType);
      const getWhenToSell = get(oldPackageflow, 'whenToSell', getOldWhenToSell);
      const getTypeOfBuyer = get(oldPackageflow, 'typeOfBuyer', getOldTypeOfBuyer);
      const data = {
        id: match.params.propId,
        packageFlowProcess: oldPackageflow,
        properties: activeSingleProperty.properties,
        ownerType: formValue.ownerType,
        typeOfBuyer: formValue.typeOfBuyer,
        whenToSell: formValue.whenToSell,
        setSuccessNotification: true,
        smallLoader: 'saveMarket',
      };
      data.properties.building.conditionCode = get(formValue, 'properties.building.conditionCode', null);
      data.packageFlowProcess = {
        ...get(formValue, 'packageFlowProcess', { }),
        ownerType: get(formValue, 'ownerType', getOwnerType),
        typeOfBuyer: get(formValue, 'typeOfBuyer', getTypeOfBuyer),
        whenToSell: get(formValue, 'whenToSell', getWhenToSell),
        rewardScreenData: {
          // market_check_date: moment().format(),
          market_check_date: DateTime.now().toISODate(),
          similar_properties: marketData.priceDistribution.numberOfProperties,
          median_market_price: marketData.priceDistribution.medianRounded,
          median_market_price_per_m2: marketData.pricePerSpace.medianRounded,
          median_market_living_space: Math.ceil(marketData.livingSpacesDistribution.median).toString(),
          median_age: Math.ceil(marketData.constructionYearDistribution.medianAge).toString(),
          median_time_on_market: marketData.daysOnMarketDistribution.median ? marketData.daysOnMarketDistribution.median.toString() : 0,
        },
      };
      handleSaveActiveSingleProperty(data);
      setSaved(true);
    }
  }, [get(marketData, 'priceDistribution', null)]);
  // eslint-disable-next-line no-undef

  return (
    <main id="rewards" className="pb-4 h-perc-100 wrapLoader">
      <Loading isLoading={isSmallLoading.loadMarket || isSmallLoading.saveMarket} isSmall />
      {
        has(marketData, 'priceDistribution') && (
          <div className="bgWhite brdRadius">
            {
              get(marketData, 'priceDistribution.numberOfProperties', 0) > 0 ? (
                <>
                  <h5 className="ta-c">Voila!</h5>
                  <h5 className="ta-c mb-3">
                    <span className="txtBlue700 mr-1">
                      {get(marketData, 'priceDistribution.numberOfProperties', 0)}
                    </span>
                    &nbsp;
                    <span>similar apartments in your area are on sale.</span>
                  </h5>
                  {
                    has(activeSingleProperty, 'location') &&
                    has(activeSingleProperty, 'packageFlowProcess.rewardScreenData') && (
                      <div>
                        <div>
                          <Maps
                            zoom={get(activeSingleProperty, 'location.countryCode', '') === 'PT' ? 15 : 12}
                            scrollZoom={false}
                            subMinHeight="min-h-fix-320"
                            moveMarker
                            draggable
                            showMap
                            className="brdRadius ov-h"
                            isShowZip={false}
                            similarProperties={marketData.list}
                          />
                          <div className="dis-f jc-fs a-c mt-2">
                            <BrixelIcon icon="location-pin-simple fsize-400" color="dark" saturationTxt={700} />
                            <p className="ml-1 txtDark700 fsize-300">{get(activeSingleProperty, 'location.address', '')}</p>
                          </div>
                        </div>

                        <div className="dis-fl-col my-5">
                          <div>
                            {
                              has(marketData, 'priceDistribution.chartRangePrice') && (
                                <>
                                  <RangePriceChart
                                    properties={marketData.priceDistribution.chartRangePrice}
                                    type="priceRange"
                                  />
                                  <p className="mt-2 body2 txtDark700">The graph shows you the current distribution of the offer prices of all similar properties. The data are updated daily.</p>
                                </>
                              )
                            }
                          </div>
                          <div className="mt-5">
                            {
                              has(marketData, 'pricePerSpace.chartRangePrice') && (
                                <>
                                  <RangePriceChart
                                    properties={marketData.pricePerSpace.chartRangePrice}
                                    type="priceM2"
                                  />
                                  <p className="mt-2 body2 txtDark700">The graph shows you the current distribution of the square meter prices of all similar properties. The data are updated daily.</p>
                                </>
                              )
                            }
                          </div>
                        </div>

                        <div className="boxMarketCheck w-perc-100">
                          {
                            get(marketData, 'livingSpacesDistribution.median', null) && (
                              <div className="">
                                {
                                  get(activeSingleProperty, 'location.countryCode', '') === 'PT' ? (
                                    <p className="mb-1 body2 fweight-600 txtDark700">Gross Area</p>
                                  ) : (
                                    <p className="mb-1 body2 fweight-600 txtDark700">Living Space</p>
                                  )
                                }
                                <p><span className="ff-mono txtGreen400 fsize-700">{Math.ceil(marketData.livingSpacesDistribution.median)}</span> <span className="fsize-100 txtDark200">m2</span></p>
                              </div>
                            )
                          }
                          {
                            get(marketData, 'constructionYearDistribution.medianAge', null) && (
                              <div>
                                <p className="mb-1 body2 fweight-600 txtDark700">Age</p>
                                <p><span className="ff-mono txtGreen400 fsize-700">{Math.ceil(marketData.constructionYearDistribution.medianAge)}</span> <span className="fsize-100 txtDark200">years</span></p>
                              </div>
                            )
                          }
                          {
                            get(marketData, 'daysOnMarketDistribution.median', 0) > 0 && (
                              <div>
                                <p className="mb-1 body2 fweight-600 txtDark700">Time on Market</p>
                                <p>
                                  <span className="ff-mono txtGreen400 fsize-700">
                                    {marketData.daysOnMarketDistribution.median}
                                  </span>
                                  <span className="fsize-100 txtDark200"> days</span>
                                </p>
                              </div>
                            )
                          }
                        </div>

                        <p className="mt-1 fsize-100 txtDark700">All numbers are median values</p>
                      </div>
                    )
                  }
                </>
              ) : (
                <div className="dis-fl-col a-c jc-c">
                  <img src={emptyHouseImg} alt="Empty Market Data" />
                  <h5 className="mt-3 mb-2">Dude. Where&apos;s my data?</h5>
                  <p className="ta-c txtDark200 max-w-fix-320 m-a">Unfortunately there is not enough data available to calculate your result</p>
                </div>
              )
            }
          </div>
        )
      }
    </main>
  );
}

ResumeMarketCheck.propTypes = {
  activeSingleProperty: PropTypes.object,
  formValue: PropTypes.object,
  gameHistory: PropTypes.object.isRequired,
  handleGetMarketData: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  marketData: PropTypes.object,
  match: PropTypes.object.isRequired,
};

ResumeMarketCheck.defaultProps = {
  formValue: {},
  marketData: null,
  activeSingleProperty: null,
};

const mapStateToProps = (state, props) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, `brixelForm.${props.formName}.values`, {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', []),
  isSmallLoading: get(state, 'console.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  marketData: get(state, 'property.marketCheck', {}),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetMarketData: bindActionCreators(getMarketCheck, dispatch),
  handleGetPage: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSendGenericMail: bindActionCreators(sendGenericMail, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeMarketCheck);
