/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import { getProperty, getMarketCheck, updateProperty } from '../../actions/PropertyActions';
import { sendGenericMail } from '../../actions/CommonActions';
import Maps from '../../components/Map/Maps';
import * as moment from 'moment';
import ChartDonuts from '../../components/Charts/ChartDonuts';
import RangePriceChart from '../../components/Charts/RangePriceChart';

function Rewards(props) {
  // PROPS
  const {
    handleGetMarketData,
    handleGetPage,
    handleUpdatePage,
    history,
    marketData,
    property,
    match,
  } = props;

  // GET the current property
  useEffect(() => {
    if (props.match.params.propId) {
      const data = {
        id: match.params.propId,
      };
      handleGetPage(data)
    }
  }, []);

  useEffect(() => {
    if (property && property.id) {
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
        stateCode: 'CH',
      };
      handleGetMarketData(data);
    }
  }, [property]);

  useEffect(() => {
    if (marketData && marketData.priceDistribution) {
      if (property.packageFlowProcess.rewardScreenData) {

      } else {
        const data = {
          id: match.params.propId,
          packageFlowProcess: property.packageFlowProcess,
        };
        data.packageFlowProcess.rewardScreenData = {
          market_check_date: moment().format(),
          similar_properties: marketData.priceDistribution.numberOfProperties,
          median_market_price: marketData.priceDistribution.medianRounded,
          median_market_price_per_m2: marketData.pricePerSpace.medianRounded,
          median_market_living_space: Math.ceil(marketData.livingSpacesDistribution.median).toString(),
          median_age: Math.ceil(marketData.constructionYearDistribution.medianAge).toString(),
          median_time_on_market: marketData.daysOnMarketDistribution.median.toString(),
        };
        handleUpdatePage(data);
      }

      if (marketData.priceDistribution.numberOfProperties === 0) {
        history.push(`/packageFlow/${match.params.propId}/advisory`);
      }
    }
  }, [marketData]);

  return (
    <main id="rewards" className="pb-4">
      <div className="subcontainer">
        <h1 className="mt-5 mb-2">Your local market check</h1>
        <p className="mb-2">Your local Market check shows you properties on the market with the same type (house/apartment) within a radius of 15km and a related living space.</p>
        {
          property && property.location && property.packageFlowProcess.rewardScreenData && marketData.priceDistribution && (
            <div>
              <p className="mb-2">
                Data as per: {moment(property.packageFlowProcess.rewardScreenData.market_check_date).format('DD-MM-YYYY')}
              </p>
              <div className="dis-f jc-b a-c">
                <p className="mb-2">{property.location.address}</p>
              </div>
              <div className="row mb-4">
                <div className="col-md-8">
                  <Maps
                    zoom={12}
                    scrollZoom
                    moveMarker
                    draggable
                    showMap
                    isShowZip={false}
                    similarProperties={marketData.list}
                  />
                </div>
                <div className="col-md-4">
                  <h5 className="mb-1">Similar Properties</h5>
                  <p className="mb-1">{marketData.priceDistribution.numberOfProperties}</p>
                  <h5 className="mb-1">Median Price</h5>
                  {
                    marketData.priceDistribution.medianRounded && (
                      <p className="mb-1">CHF {marketData.priceDistribution.medianRounded.toLocaleString('de-CH')}</p>
                    )
                  }
                  <h5 className="mb-1">Median Price per m2</h5>
                  {
                    marketData.pricePerSpace.medianRounded && (
                      <p className="mb-1">CHF {marketData.pricePerSpace.medianRounded.toLocaleString('de-CH')}</p>
                    )
                  }
                  <h5 className="mb-1">Median Living Sapce</h5>
                  <p className="mb-1">{Math.ceil(marketData.livingSpacesDistribution.median)} m2</p>
                  <h5 className="mb-1">Median Age</h5>
                  <p className="mb-1">{Math.ceil(marketData.constructionYearDistribution.medianAge)} years</p>
                  <h5 className="mb-1">Median Time on Market</h5>
                  <p>{marketData.daysOnMarketDistribution.median} days</p>
                </div>
              </div>
              <div className="mb-4">
                {
                  marketData && marketData.countBySubType && (
                    <ChartDonuts properties={marketData.countBySubType} />
                  )
                }
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  {
                    marketData && marketData.priceDistribution && marketData.priceDistribution.chartRangePrice && (
                      <>
                        <h5 className="mb-2">Offer Price</h5>
                        <RangePriceChart
                          properties={marketData.priceDistribution.chartRangePrice}
                          type="priceRange"
                        />
                      </>
                    )
                  }
                </div>
                <div className="col-md-6">
                  {
                    marketData && marketData.pricePerSpace && marketData.pricePerSpace.chartRangePrice && (
                      <>
                        <h5 className="mb-2">Offer Price/m2</h5>
                        <RangePriceChart
                          properties={marketData.pricePerSpace.chartRangePrice}
                          type="priceM2"
                        />
                      </>
                    )
                  }
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  {
                    marketData && marketData.priceDistribution && property.estimation && property.estimation.bestimate && (
                      <>
                        <h5 className="mb-2">Your Bestimate®</h5>
                        <RangePriceChart
                          properties={marketData.priceDistribution.chartRangePrice}
                          type="bestimate"
                          bestimate={property.estimation.bestimate}
                        />
                      </>
                    )
                  }
                </div>
                <div className="col-md-6">
                  <p>The Bestimate® gives you a free price indication. For a more accurate estimation, we suggest you to do a pro estimation by IAZI.</p>
                </div>
              </div>

              <BrixelButtonPrimary
                label="Continue"
                onClick={() => history.push(`/packageFlow/${match.params.propId}/advisory`)}
                type="submit"
              />

            </div>
          )
        }
      </div>
    </main>
  );
}

Rewards.propTypes = {
  handleGetMarketData: PropTypes.func.isRequired,
  handleGetPage: PropTypes.func.isRequired,
  handleSendGenericMail: PropTypes.func.isRequired,
  handleUpdatePage: PropTypes.func.isRequired,
  loggedUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object,
  property: PropTypes.object,
};

Rewards.defaultProps = {
  loggedUser: {},
  marketData: null,
  property: null,
};

const mapStateToProps = (state) => ({
  property: get(state, 'property.property', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  marketData: get(state, 'property.marketCheck', {}),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetPage: bindActionCreators(getProperty, dispatch),
  handleGetMarketData: bindActionCreators(getMarketCheck, dispatch),
  handleSendGenericMail: bindActionCreators(sendGenericMail, dispatch),
  handleUpdatePage: bindActionCreators(updateProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Rewards);
