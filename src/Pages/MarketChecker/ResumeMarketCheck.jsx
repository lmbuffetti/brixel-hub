/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { getProperty, getMarketCheck, updateProperty } from '../../actions/PropertyActions';
import { sendGenericMail } from '../../actions/CommonActions';
import Maps from '../../components/Map/Maps';
import * as moment from 'moment';
import RangePriceChart from '../../components/Charts/RangePriceChart';
import { BrixelIcon } from '@brixel/brixel-components';

function ResumeMarketCheck(props) {
  // PROPS
  const {
    formValue,
    handleGetMarketData,
    handleUpdatePage,
    marketData,
    property,
    match,
  } = props;
  // STATE
  const [saved, setSaved] = useState(false);

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
    if (marketData && marketData.priceDistribution && !saved) {
      const data = {
        id: match.params.propId,
        packageFlowProcess: property.packageFlowProcess,
        properties: property.properties,
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
      handleUpdatePage(data);
      setSaved(true);
    }
  }, [marketData]);

  return (
    <main id="rewards" className="pb-4">
      <div className="bgWhite brdRadius">
        <h5 className="ta-c">Voila!</h5>
        <h5 className="ta-c mb-3">
          {
            marketData.priceDistribution && marketData.priceDistribution.numberOfProperties && (
              <span className="txtGreen400 mr-1">{marketData.priceDistribution.numberOfProperties}</span>
            )
          }
          similar apartments in your area are on sale.
        </h5>
        {
          property && property.location && property.packageFlowProcess.rewardScreenData && marketData.priceDistribution && (
            <div>

              <div>
                <Maps
                  zoom={12}
                  scrollZoom={false}
                  moveMarker
                  draggable
                  showMap
                  isShowZip={false}
                  similarProperties={marketData.list}
                />
              </div>

              <div className="dis-f jc-fs a-c mt-1">
                <BrixelIcon icon='location-pin-simple' color="dark" saturationTxt={700} />
                <p>{property.location.address}</p>
              </div>


              <div className="row mt-5 px-2">
                <div className="col-md-6">
                  {
                    marketData && marketData.priceDistribution && marketData.priceDistribution.chartRangePrice && (
                      <>
                        <RangePriceChart
                          properties={marketData.priceDistribution.chartRangePrice}
                          type="priceRange"
                        />
                        <p className="mt-2 body2">The graph shows you the current distribution of the offer prices of all similar properties. The data are updated daily.</p>
                      </>
                    )
                  }
                </div>
                <div className="col-md-6">
                  {
                    marketData && marketData.pricePerSpace && marketData.pricePerSpace.chartRangePrice && (
                      <>
                        <RangePriceChart
                          properties={marketData.pricePerSpace.chartRangePrice}
                          type="priceM2"
                        />
                        <p className="mt-2 body2">The graph shows you the current distribution of the square meter prices of all similar properties. The data are updated daily.</p>
                      </>
                    )
                  }
                </div>
              </div>


              <div className="boxMarketCheck mt-5">
                {
                  marketData && marketData.livingSpacesDistribution && (
                    <div>
                      <h6 className="mb-1 body2 fweight-600">Living Sapce</h6>
                      <p className="mb-1"><span>{Math.ceil(marketData.livingSpacesDistribution.median)}</span> m2</p>
                    </div>
                  )
                }
                {
                  marketData && marketData.constructionYearDistribution && (
                    <div>
                      <h6 className="mb-1 body2 fweight-600">Age</h6>
                      <p className="mb-1"><span>{Math.ceil(marketData.constructionYearDistribution.medianAge)}</span> years</p>
                    </div>
                  )
                }
                {
                  marketData && marketData.daysOnMarketDistribution && (
                    <div>
                      <h6 className="mb-1 body2 fweight-600">Time on Market</h6>
                      <p><span>{marketData.daysOnMarketDistribution.median}</span> days</p>
                    </div>
                  )
                }
              </div>

              <p className="mt-1">All numbers are median values</p>
            </div>
          )
        }
      </div>
    </main>
  );
}

ResumeMarketCheck.propTypes = {
  formValue: PropTypes.object,
  handleGetMarketData: PropTypes.func.isRequired,
  handleGetPage: PropTypes.func.isRequired,
  handleSendGenericMail: PropTypes.func.isRequired,
  handleUpdatePage: PropTypes.func.isRequired,
  loggedUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object,
  property: PropTypes.object,
};

ResumeMarketCheck.defaultProps = {
  formValue: {},
  loggedUser: {},
  marketData: null,
  property: null,
};

const mapStateToProps = (state, props) => ({
  formValue: get(state, `form.${props.formName}.values`, {}),
  property: get(state, 'property.property', {}),
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
)(ResumeMarketCheck);
