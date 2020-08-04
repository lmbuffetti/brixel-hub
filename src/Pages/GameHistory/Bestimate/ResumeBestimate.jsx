/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { getEstimation, getMarketCheck, saveActiveSingleProperty } from '../../../actions/PropertyActions';
import RangePriceChart from '../../../components/Charts/RangePriceChart';
import emptyHouseImg from '../../../images/emptyHub.svg';

function ResumeBestimate(props) {
  // PROPS
  const {
    condition,
    estimation,
    handleGetEstimation,
    handleGetMarketCheck,
    handleSaveActiveSingleProperty,
    history,
    marketData,
    match,
    activeSingleProperty,
  } = props;
  // STATE
  const [saved, setSaved] = useState(false);
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  // LOAD THE MARKET DATA
  useEffect(() => {
    if (get(activeSingleProperty, 'id', null) && !marketData.priceDistribution) {
      const latBoundsRadius = 0.0675;
      const longBoundsRadius = 0.1;
      let livingSpace = get(activeSingleProperty, 'properties.typology.livingArea.value', 0);
      if (get(activeSingleProperty, 'location.countryCode', '') === 'PT') {
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
      };
      handleGetMarketCheck(data);
    }
    if (get(activeSingleProperty, 'location.countryCode', null) === 'PT') {
      history.push(`/${activeSingleProperty.id}/rewards/bestimate`);
    }
    if (get(activeSingleProperty, 'location.countryCode', null) === 'CH') handleGetEstimation(propID);
  }, [activeSingleProperty, marketData]);

  // LOAD THE ESTIMATION
  useEffect(() => {
    if (estimation.value) {
      const data = {
        id: propID,
        estimation: {
          bestimate: {
            ...estimation,
          },
        },
      };
      if (get(activeSingleProperty, 'property.estimation.bestimate', null)) data.estimation.bestimate.updatedAt = new Date();
      else data.estimation.bestimate.createdAt = new Date();
      if (estimation && !saved) {
        handleSaveActiveSingleProperty(data);
        setSaved(true);
      }
    }
  }, [estimation, activeSingleProperty]);

  return (
    <main id="rewards" className="pb-4 h-perc-100 txtDark700">
      {
        has(marketData, 'priceDistribution.chartRangePrice') ? (
          <>
            {
              get(activeSingleProperty, 'location.countryCode', null) === 'CH' ? (
                <>
                  <h5 className="ta-c mb-5">We proudly present you your Bestimate&reg;.</h5>
                  {
                    condition.higherValue && (
                      <>
                        <p className="ta-c mb-1 txtDark700">Your property is worth up to</p>
                        <p className="heading4 ff-mono txtGreen400 fweight-600 ta-c mb-1">CHF {condition.higherValue.toLocaleString('de-CH')}</p>
                        <p className="body2 ta-c mb-5 txtDark700">Based on similar transactions.</p>
                        <p className="fweight-400 ta-c mb-1 txtDark700">Similar properties are currently worth between</p>
                        <p className="ff-mono txtPrimary700 fweight-600 ta-c mb-5">CHF {condition.lowerValue.toLocaleString('de-CH')} - CHF {condition.higherValue.toLocaleString('de-CH')}</p>
                        <p className="fweight-400 ta-c txtDark700">Your Bestimate&reg; compared to local market data</p>
                      </>
                    )
                  }
                  {
                    has(activeSingleProperty, 'estimation.bestimate') && (
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
                </>
              ) : (
                <>
                  <h5 className="ta-c mb-5">We proudly present you your Bestimate&reg;.</h5>
                  <p>We Will contact you</p>
                </>
              )
            }
            <p className="body2 mt-5 txtDark700">The Bestimate&reg; is your free price indication. <br /> It is based on comparable transaction data. Due to the few inputs it does not replace any professional estimation but just gives you a quick orientation.</p>
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
    </main>
  );
}

ResumeBestimate.propTypes = {
  condition: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleGetMarketCheck: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
};

ResumeBestimate.defaultProps = {
};

const mapStateToProps = (state) => ({
  condition: get(state, 'property.activeSingleProperty.estimation.bestimate', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  marketData: get(state, 'property.marketCheck', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  estimation: get(state, 'property.estimation', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetMarketCheck: bindActionCreators(getMarketCheck, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeBestimate);
