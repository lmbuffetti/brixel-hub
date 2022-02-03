/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import { Helpers } from '@brixel/brixel-components';
import { useParams } from 'react-router-dom';
import { getEstimation, getMarketCheck, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { createEstimation, generateEstimation } from '../../actions/EstimationActions';
import RangePriceChart from '../../components/Charts/RangePriceChart';
import emptyHouseImg from '../../images/emptyHub.svg';
import Loading from '../../components/Loading';

function ResumeBestimate(props) {
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    condition,
    estimation,
    handleCreateEstimation,
    handleGenerateBestimate,
    handleGetEstimation,
    handleGetMarketCheck,
    history,
    marketData,
  } = props;
  // URL PARAMS
  const propID = get(match, 'propID', null);

  // LOAD THE MARKET DATA
  useEffect(() => {
    if (get(activeSingleProperty, 'id', null) && !marketData.priceDistribution) {
      const latBoundsRadius = 0.0675;
      const longBoundsRadius = 0.1;
      let livingSpace = get(activeSingleProperty, 'properties.typology.livingArea.value', 0);
      if (get(activeSingleProperty, 'location.countryCode', '') === 'PT' && get(activeSingleProperty, 'properties.typology.grossArea.value', 0) > 0) {
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
    if (get(activeSingleProperty, 'location.countryCode', null) !== 'CH' &&
            get(activeSingleProperty, 'location.countryCode', null) !== 'PT' &&
            !get(estimation, 'result.value', null)) {
      const data = {
        owner: activeSingleProperty.owner.id,
        page: activeSingleProperty.id,
        generate: false,
      };
      handleCreateEstimation(data);
      history.push(`/${activeSingleProperty.id}/home/bestimate`);
    } else if (get(activeSingleProperty, 'location.countryCode', null) === 'CH' ||
      get(activeSingleProperty, 'location.countryCode', null) === 'PT') handleGetEstimation(propID);
  }, [activeSingleProperty, marketData]);

  // LOAD THE ESTIMATION
  useEffect(() => {
    if (get(estimation, 'result.higherValue', 0) === 0 && activeSingleProperty.id) {
      if (!has(estimation, 'result') && get(estimation, 'status', '') !== 'pending') {
        const payload = {
          reloadOnwProperties: true,
          type: 'market',
          id: activeSingleProperty.id,
          generate: true,
        };
        handleGetEstimation(payload);
      } else if (has(estimation, 'result') && !has(estimation, 'result.value') && estimation.id) {
        handleGenerateBestimate(estimation.id);
      }
    }
  }, [estimation, activeSingleProperty]);

  return (
    <main id="rewards" className="pb-4 h-perc-100 txtDark700">
      {
        has(marketData, 'priceDistribution.chartRangePrice') ? (
          <>
            {
              get(estimation, 'result.value', null) ? (
                <>
                  <h5 className="ta-c mb-5">We proudly present you your Bestimate<sup>&reg;</sup>.</h5>
                  {
                    condition.higherValue && (
                      <>
                        {
                          get(activeSingleProperty, 'location.countryCode', null) === 'PT' ? (
                            <>
                              <p className="ta-c mb-1 txtDark700">Your property is worth</p>
                              <p className="heading4 ff-mono txtGreen400 fweight-600 ta-c mb-1">{get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.value, get(activeSingleCompany, 'country.currency', 'CHF'))}</p>
                            </>
                          ) : (
                            <>
                              <p className="ta-c mb-1 txtDark700">Your property is worth up to</p>
                              <p className="heading4 ff-mono txtGreen400 fweight-600 ta-c mb-1">{get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.higherValue, get(activeSingleCompany, 'country.currency', 'CHF'))}</p>
                            </>
                          )
                        }
                        <p className="body2 ta-c mb-5 txtDark700">Based on similar transactions.</p>
                        <p className="fweight-400 ta-c mb-1 txtDark700">Similar properties are currently worth between</p>
                        <div className="ta-c mb-5">
                          <p className="ff-mono txtPrimary700 fweight-600 ta-c">{get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.lowerValue, get(activeSingleCompany, 'country.currency', 'CHF'))} - {get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.higherValue, get(activeSingleCompany, 'country.currency', 'CHF'))}</p>
                          {
                            get(activeSingleProperty, 'location.countryCode', null) === 'PT' && (
                              <p className="fsize-200"><span>minimun value</span><span className="mx-2" /><span>maximun value</span></p>
                            )
                          }
                        </div>
                        <p className="fweight-400 ta-c txtDark700">Your Bestimate<sup>&reg;</sup> compared to local market data</p>
                      </>
                    )
                  }
                  {
                    Object.keys(get(estimation, 'result', {})).length > 0 && (
                      <div className="dis-f jc-c">
                        <RangePriceChart
                          properties={marketData.priceDistribution.chartRangePrice}
                          type="bestimate"
                          bestimate={estimation.result}
                          showTopLabel={false}
                        />
                      </div>
                    )
                  }
                </>
              ) : (
                <>
                  <h5 className="ta-c mb-5">We proudly present you your Bestimate<sup>&reg;</sup>.</h5>
                  <p>We Will contact you</p>
                </>
              )
            }
            <p className="body2 mt-5 txtDark700">The Bestimate<sup>&reg;</sup> is your free price indication. <br /> It is based on comparable transaction data. Due to the few inputs it does not replace any professional estimation but just gives you a quick orientation.</p>
          </>
        ) : (
          <>
            {
              get(marketData, 'priceDistribution', null) ? (
                <div className="dis-fl-col a-c jc-c">
                  <img src={emptyHouseImg} alt="Empty Market Data" />
                  <h5 className="mt-3 mb-2">Dude. Where&apos;s my data?</h5>
                  <p className="ta-c txtDark200 max-w-fix-320 m-a">Unfortunately there is not enough data available to
                    calculate your result
                  </p>
                </div>
              ) : (
                <div className="wrapLoader w-perc-100 h-perc-100">
                  <Loading isLoading isSmall />
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
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  condition: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  handleCreateEstimation: PropTypes.func.isRequired,
  handleGenerateBestimate: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleGetMarketCheck: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
};

ResumeBestimate.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  condition: get(state, 'property.estimation.result', {}),
  estimation: get(state, 'property.estimation', {}),
  marketData: get(state, 'property.marketCheck', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleCreateEstimation: bindActionCreators(createEstimation, dispatch),
  handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetMarketCheck: bindActionCreators(getMarketCheck, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeBestimate);
