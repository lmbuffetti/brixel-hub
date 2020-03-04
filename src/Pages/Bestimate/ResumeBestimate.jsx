/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { getEstimation, getMarketCheck, updateProperty } from '../../actions/PropertyActions';
import {
  withRouter,
} from 'react-router-dom';
import RangePriceChart from '../../components/Charts/RangePriceChart';

function ResumeBestimate(props) {
  // PROPS
  const {
    condition,
    estimation,
    handleGetEstimation,
    handleGetMarketData,
    handleUpdateProperty,
    marketData,
    match,
    property,
  } = props;
  // STATE
  const [saved, setSaved] = useState(false);
  // URL PARAMS
  const propID = get(match, 'params.propId', null);


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
      handleGetEstimation(propID);
    }
  }, [property]);

  useEffect(() => {
    if (estimation.value) {
      const data = {
        id: propID,
        estimation: {
          bestimate: {
            ...estimation,
          }
        }
      };
      if (property && property.estimation && property.estimation.bestimate) data.estimation.bestimate.updatedAt = new Date();
      else data.estimation.bestimate.createdAt = new Date();
      if (estimation && !saved) {
        handleUpdateProperty(data);
        setSaved(true);
      }
    }
  }, [estimation]);

  return (
    <main id="rewards" className="pb-4 txtDark700">
      <h5 className='ta-c mb-5'>We proudly present you your Bestimate&reg;.</h5>
      {
        condition.higherValue && (
          <>
            <p className="ta-c mb-1 txtDark700">Your property is worth up to</p>
            <p className="heading4 ff-mono txtGreen400 fweight-600 ta-c mb-1">CHF {condition.higherValue.toLocaleString('de-CH')}</p>
            <p className="fsize-100 ta-c mb-5 txtDark700">Based on similar transactions.</p>
            <p className="fweight-400 ta-c mb-1 txtDark700">Similar properties are currently worth between</p>
            <p className="ff-mono txtPrimary700 fweight-600 ta-c mb-5">CHF {condition.lowerValue.toLocaleString('de-CH')} - CHF {condition.higherValue.toLocaleString('de-CH')}</p>
            <p className="fweight-400 ta-c txtDark700 mb-4-neg">Your Bestimate&reg; compared to local market data</p>
          </>
        )
      }
      {
        marketData && marketData.priceDistribution && marketData.priceDistribution.chartRangePrice && property.estimation && property.estimation.bestimate && (
          <div className="dis-f jc-c">
            <RangePriceChart
              properties={marketData.priceDistribution.chartRangePrice}
              type="bestimate"
              bestimate={property.estimation.bestimate}
              showTopLabel={false}
            />
          </div>
        )
      }

      <p className="fsize-100 mt-5 txtDark700">The Bestimate&reg; is your free price indication. <br/> It is based on comparable transaction data. Due to the few inputs it does not replace any professional estimation but just gives you a quick orientation.</p>

    </main>
  );
}

ResumeBestimate.propTypes = {
  condition: PropTypes.object,
  estimation: PropTypes.object.isRequired,
  finishStep: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  handleGetEstimation: PropTypes.func.isRequired,
  handleGetMarketData: PropTypes.func.isRequired,
  handleUpdateProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  property: PropTypes.object,
};

ResumeBestimate.defaultProps = {
  finishStep: false,
};

const mapStateToProps = (state) => ({
  condition: get(state, 'property.property.estimation.bestimate', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  marketData: get(state, 'property.marketCheck', {}),
  property: get(state, 'property.property', {}),
  estimation: get(state, 'property.estimation', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetMarketData: bindActionCreators(getMarketCheck, dispatch),
  handleUpdateProperty: bindActionCreators(updateProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeBestimate);
