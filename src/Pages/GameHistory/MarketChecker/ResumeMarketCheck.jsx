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
import { getActiveSingleProperty, getMarketCheck, saveActiveSingleProperty } from '../../../actions/PropertyActions';
import { sendGenericMail } from '../../../actions/CommonActions';
import Maps from '../../../components/Map/Maps';
import * as moment from 'moment';
import RangePriceChart from '../../../components/Charts/RangePriceChart';
import { BrixelIcon } from '@brixel/brixel-components';
import emptyHouseImg from '../../../images/emptyHub.svg';

function ResumeMarketCheck(props) {
  // PROPS
  const {
    formValue,
    handleGetMarketData,
    handleSaveActiveSingleProperty,
    marketData,
    property,
    match,
  } = props;
  // STATE
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (property && property.id && !marketData.priceDistribution) {
      const latBoundsRadius = 0.0675;
      const longBoundsRadius = 0.1;
      const livingSpace = get(property, 'properties.typology.livingArea.value', 0);
      const percLivingSpace = +livingSpace * 0.5;
      const data = {
        north: property.location.latitude + latBoundsRadius,
        south: property.location.latitude - latBoundsRadius,
        west: property.location.longitude - longBoundsRadius,
        east: property.location.longitude + longBoundsRadius,
        propertyType: property.properties.propertyType,
        minLivingSpace: +livingSpace - percLivingSpace,
        maxLivingSpace: +livingSpace + percLivingSpace,
        stateCode: property.location.countryCode,
      };
      handleGetMarketData(data);
    }
  }, [property]);

  useEffect(() => {
    if (marketData && marketData.priceDistribution && !saved) {
      const data = {
        id: match.params.propId,
        packageFlowProcess: property.packageFlowProcess || {},
        properties: property.properties,
        ownerType: formValue.ownerType,
        whenToSell: formValue.whenToSell,
        setSuccessNotification: true,
      };
      data.properties.building.conditionCode = get(formValue, 'properties.building.conditionCode', null);
      data.packageFlowProcess.rewardScreenData = {
        market_check_date: moment().format(),
        similar_properties: marketData.priceDistribution.numberOfProperties,
        median_market_price: marketData.priceDistribution.medianRounded,
        median_market_price_per_m2: marketData.pricePerSpace.medianRounded,
        median_market_living_space: Math.ceil(marketData.livingSpacesDistribution.median).toString(),
        median_age: Math.ceil(marketData.constructionYearDistribution.medianAge).toString(),
        median_time_on_market: marketData.daysOnMarketDistribution.median ? marketData.daysOnMarketDistribution.median.toString() : 0,
      };
      handleSaveActiveSingleProperty(data);
      setSaved(true);
    }
  }, [marketData]);
  // eslint-disable-next-line no-undef

  return (
    <main id="rewards" className="pb-4 h-perc-100">
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
                    has(property, 'location') &&
                    has(property, 'packageFlowProcess.rewardScreenData') && (
                      <div>
                        <div>
                          <Maps
                            zoom={property.location.countryCode === 'PT' ? 15 : 12}
                            scrollZoom={false}
                            moveMarker
                            draggable
                            showMap
                            className="brdRadius ov-h"
                            isShowZip={false}
                            similarProperties={marketData.list}
                          />
                          <div className="dis-f jc-fs a-c mt-2">
                            <BrixelIcon icon='location-pin-simple fsize-400' color="dark" saturationTxt={700} />
                            <p className="ml-1 txtDark700 fsize-300">{property.location.address}</p>
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


                        <div className="boxMarketCheck">
                          {
                            marketData && marketData.livingSpacesDistribution && (
                              <div>
                                <p className="mb-1 body2 fweight-600 txtDark700">Living Sapce</p>
                                <p><span className="ff-mono txtGreen400 fsize-700">{Math.ceil(marketData.livingSpacesDistribution.median)}</span> <span className="fsize-100 txtDark200">m2</span></p>
                              </div>
                            )
                          }
                          {
                            marketData && marketData.constructionYearDistribution && (
                              <div>
                                <p className="mb-1 body2 fweight-600 txtDark700">Age</p>
                                <p><span className="ff-mono txtGreen400 fsize-700">{Math.ceil(marketData.constructionYearDistribution.medianAge)}</span> <span className="fsize-100 txtDark200">years</span></p>
                              </div>
                            )
                          }
                          {
                            marketData && marketData.daysOnMarketDistribution && (
                              <div>
                                <p className="mb-1 body2 fweight-600 txtDark700">Time on Market</p>
                                <p><span className="ff-mono txtGreen400 fsize-700">{marketData.daysOnMarketDistribution.median}</span> <span className="fsize-100 txtDark200">days </span></p>
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
                  <h5 className="mt-3 mb-2">Dude. Where's my data?</h5>
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
  formValue: PropTypes.object,
  handleGetMarketData: PropTypes.func.isRequired,
  handleGetPage: PropTypes.func.isRequired,
  handleSendGenericMail: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object,
  property: PropTypes.object,
};

ResumeMarketCheck.defaultProps = {
  formValue: {},
  loggedInUser: {},
  marketData: null,
  property: null,
};

const mapStateToProps = (state, props) => ({
  formValue: get(state, `form.${props.formName}.values`, {}),
  property: get(state, 'property.activeSingleProperty', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  marketData: get(state, 'property.marketCheck', {}),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetPage: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetMarketData: bindActionCreators(getMarketCheck, dispatch),
  handleSendGenericMail: bindActionCreators(sendGenericMail, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeMarketCheck);
