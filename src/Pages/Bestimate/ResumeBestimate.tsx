import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import {bindActionCreators, compose} from 'redux';
import {Helpers} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {getEstimation, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {createEstimation, generateEstimation} from '../../actions/EstimationActions';
import type {ResumeBestimateType} from '../../@types/Pages/Bestimate/ResumeBestimate';

function ResumeBestimate(props: ResumeBestimateType) {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
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
    lang,
  } = props;
  // URL PARAMS
  const propID = get(match, 'propID', null);

  // LOAD THE MARKET DATA
  useEffect(() => {
    if (get(activeSingleProperty, 'location.countryCode', null) !== 'CH' &&
            get(activeSingleProperty, 'location.countryCode', null) !== 'PT' &&
            !get(estimation, 'result.value', null)) {
      const data = {
        owner: get(activeSingleProperty, 'owner.id', activeSingleProperty.owner),
        page: activeSingleProperty.id,
        generate: false,
      };
      handleCreateEstimation(data);
      history.push(`/${activeSingleProperty.id}/home/bestimate`);
    } else if (propID && (get(activeSingleProperty, 'location.countryCode', null) === 'CH' ||
      get(activeSingleProperty, 'location.countryCode', null) === 'PT')) handleGetEstimation(propID);
  }, [activeSingleProperty]);

  // LOAD THE ESTIMATION
  useEffect(() => {
    if (get(estimation, 'result.higherValue', 0) === 0 && activeSingleProperty.id) {
      if (!has(estimation, 'result') && get(estimation, 'status', null) !== 'pending') {
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
      <>
        {
          get(estimation, 'result.value', null) ? (
            <>
              <h5 className="ta-c mb-5">
                {translateTo('We proudly present you your Bestimate<sup>&reg;</sup>.', lang)}
              </h5>
              {
                condition && condition.higherValue && (
                  <>
                    {
                      get(activeSingleProperty, 'location.countryCode', null) === 'PT' ? (
                        <>
                          <p className="ta-c mb-1 txtDark700">
                            {translateTo('Your property is worth', lang)}</p>
                          <p className="heading4 ff-mono txtGreen400 fweight-600 ta-c mb-1">{get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.value, get(activeSingleCompany, 'country.currency', 'CHF'))}</p>
                        </>
                      ) : (
                        <>
                          <p className="ta-c mb-1 txtDark700">
                            {translateTo('Your property is worth up to', lang)}
                          </p>
                          <p className="heading4 ff-mono txtGreen400 fweight-600 ta-c mb-1">{get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.higherValue, get(activeSingleCompany, 'country.currency', 'CHF'))}</p>
                        </>
                      )
                    }
                    <p className="body2 ta-c mb-5 txtDark700">
                      {translateTo('Based on similar transactions.', lang)}
                    </p>
                    <p className="fweight-400 ta-c mb-1 txtDark700">
                      {translateTo('Similar properties are currently worth between', lang)}
                    </p>
                    <div className="ta-c mb-5">
                      <p className="ff-mono txtPrimary700 fweight-600 ta-c">{get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.lowerValue, get(activeSingleCompany, 'country.currency', 'CHF'))} - {get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(condition.higherValue, get(activeSingleCompany, 'country.currency', 'CHF'))}</p>
                      {
                        get(activeSingleProperty, 'location.countryCode', null) === 'PT' && (
                          <p className="fsize-200"><span>{translateTo('minimun value', lang)}</span><span className="mx-2" /><span>{translateTo('maximun value', lang)}</span></p>
                        )
                      }
                    </div>
                    <p className="fweight-400 ta-c txtDark700">
                      {translateTo('Your Bestimate<sup>&reg;</sup> compared to local market data', lang)}
                    </p>
                  </>
                )
              }
            </>
          ) : (
            <>
              <h5 className="ta-c mb-5">
                {translateTo('We proudly present you your Bestimate<sup>&reg;</sup>.', lang)}
              </h5>
              <p>{translateTo('We Will contact you', lang)}</p>
            </>
          )
        }
        <p className="body2 mt-5 txtDark700">
          {translateTo('The Bestimate<sup>&reg;</sup> is your free price indication. <br /> It is based on comparable transaction data. Due to the few inputs it does not replace any professional estimation but just gives you a quick orientation.', lang)}
        </p>
      </>
      )
    </main>
  );
}

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  condition: get(state, 'property.estimation.result', {}),
  estimation: get(state, 'property.estimation', {}),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleCreateEstimation: bindActionCreators(createEstimation, dispatch),
  handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeBestimate);
