import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { BrixelButtonPrimary, BrixelCheckbox, BrixelInputText, Validation } from '@brixel/brixel-components';
import { getProperty, getMarketCheck, updateProperty } from '../../actions/PropertyActions';
import { sendGenericMail } from '../../actions/CommonActions';
import Maps from '../../components/Map/Maps';
import * as moment from 'moment';
import ChartDonuts from '../../components/Charts/ChartDonuts';
import RangePriceChart from '../../components/Charts/RangePriceChart';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

function Rewards(props) {
  // PROPS
  const {
    handleGetMarketData,
    handleGetPage,
    handleSendGenericMail,
    handleUpdatePage,
    loggedUser,
    marketData,
    property,
    match,
  } = props;
  // STATE
  const [checkboxes] = useState([
    {
      label: 'Free Estimation (Bestimate ®)',
      value: 'bestimate',
    },
    {
      label: 'Price level, demand and construction activity',
      value: 'priceLevelDemandActivity',
    },
    {
      label: 'Capital gains tax',
      value: 'capitalGainsTax',
    }
  ]);
  const [chexkboxesVal, setCheckboxesVal] = useState([]);
  const [email, setEmail] = useState({});

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
    if (loggedUser && loggedUser.user) setEmail(loggedUser.user.email)
  }, [loggedUser]);

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
          median_market_living_space: marketData.livingSpacesDistribution.median.toString(),
          median_age: marketData.constructionYearDistribution.medianAge.toString(),
          median_time_on_market: marketData.daysOnMarketDistribution.median.toString(),
        };
        handleUpdatePage(data);
      }
    }
  }, [marketData]);

  const sendForm = async (e) => {
    e.preventDefault();
    if (Validation.isEmail(email) === true && chexkboxesVal.length > 0) {
      let processedInfo = '';
      const answer = {
        'active': true,
        'informationNeeded': {
          bestimate: false,
          priceLevelDemandActivity: false,
          capitalGainsTax: false,
        }
      };
      chexkboxesVal.map((val) => {
        if (val === 'priceLevelDemandActivity') {
          processedInfo += 'Price level, demand and construction activity / ';
          answer.informationNeeded.priceLevelDemandActivity = true;
        } else if (val === 'capitalGainsTax') {
          processedInfo += 'Capital gains tax / ';
          answer.informationNeeded.capitalGainsTax = true;
        } else {
          processedInfo += 'Bestimate / ';
          answer.informationNeeded.bestimate = true;
        }
      });
      const message = `
            <h1>A PDF Market check was requested</h1>
            <p><b>User ID</b> ${loggedUser.user.id}</p>
            <p><b>User Name</b> ${loggedUser.user.name}</p>
            <p><b>Page ID</b> ${match.params.propId}</p>
            <p><b>Page Title</b> <a href="${baseByData.pageUrl}/${property.stub}">${property.title}</a></p>
            <p><b>Page Stub</b> ${property.stub}</p>
            <h4>Here are the contents</h4>
            <p><b>First Name</b> ${loggedUser.user.firstName}</p>
            <p><b>Last Name</b> ${loggedUser.user.lastName}</p>
            <p><b>Information Needed</b> ${processedInfo ? processedInfo : 'No response'}</p>
            <p><b>Email</b> ${loggedUser.user.email}</p>
      `;

      const mail = {
        destinationEmail : 'support@brixel.io', // email
        recipientEmail : 'support@brixel.io', // email
        subject        : `A PDF Market check was requested`,
        message        : message,
      };
      await handleSendGenericMail(mail);
      const data = {
        id: match.params.propId,
        redirectTo: `/packageFlow/${match.params.propId}/advisory`,
        packageFlowProcess: property.packageFlowProcess,
      };
      data.packageFlowProcess.orderOffer = answer;
      await handleUpdatePage(data);

    }
  };

  return (
    <main id="rewards">
      <div className="container">
        <h1>Your local market check</h1>
        <p>Your local Market check shows you properties on the market with the same type (house/apartment) within a radius of 15km and a related living space.</p>
        {
          property && property.location && property.packageFlowProcess.rewardScreenData && (
            <div>
              <p>Data as per: {moment(property.packageFlowProcess.rewardScreenData.market_check_date).format('DD-MM-YYYY')}</p>
              <div className="dis-f jc-b a-c">
                <p>{property.location.address}</p>
                <BrixelButtonPrimary
                  label="Order PDF"
                  onClick={() => ''}
                />
              </div>
              <div className="row">
                <div className="col-md-8">
                  <Maps
                    zoom={14}
                    scrollZoom
                    moveMarker
                    draggable
                    showMap
                    isShowZip={false}
                  />
                </div>
                <div className="col-md-4">
                  <h5>Similar Properties</h5>
                  <p>{property.packageFlowProcess.rewardScreenData.similar_properties}</p>
                  <h5>Median Price</h5>
                  <p>CHF {property.packageFlowProcess.rewardScreenData.median_market_price.toLocaleString('de-CH')}</p>
                  <h5>Median Price per m2</h5>
                  <p>CHF {property.packageFlowProcess.rewardScreenData.median_market_price_per_m2.toLocaleString('de-CH')}</p>
                  <h5>Median Living Sapce</h5>
                  <p>{property.packageFlowProcess.rewardScreenData.median_market_living_space} m2</p>
                  <h5>Median Age</h5>
                  <p>{property.packageFlowProcess.rewardScreenData.median_age} years</p>
                  <h5>Median Time on Market</h5>
                  <p>{property.packageFlowProcess.rewardScreenData.median_time_on_market} days</p>
                  <p></p>
                </div>
              </div>
              {
                marketData && marketData.countBySubType && (
                  <ChartDonuts properties={marketData.countBySubType} />
                )
              }
              <div className="row">
                <div className="col-md-6">
                  {
                    marketData && marketData.priceDistribution && (
                      <RangePriceChart
                        properties={marketData.priceDistribution.chartRangePrice}
                        type="priceRange"
                        title="Median Angebotspreis"
                        subtitle
                      />
                    )
                  }
                </div>
                <div className="col-md-6">
                  {
                    marketData && marketData.pricePerSpace && (
                      <RangePriceChart
                        properties={marketData.pricePerSpace.chartRangePrice}
                        type="priceM2"
                        title="Median Angebotspreis pro m2"
                        subtitle
                      />
                    )
                  }
                  <p>The Bestimate® gives you a free price indication. For a more accurate estimation, we suggest you to do a pro estimation by IAZI.</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {
                    marketData && marketData.priceDistribution && (
                      <RangePriceChart
                        properties={marketData.priceDistribution.chartRangePrice}
                        type="bestimate"
                        bestimate={property.estimation.bestimate}
                        title="Dein Bestimate®"
                      />
                    )
                  }
                </div>
                <div className="col-md-6">
                  <h4>Pro Estimation for CHF 249.-</h4>
                  <h6>In cooperation with LOGO_IAZI</h6>
                  <p>If you would like to get a more accurate estimation value, get a hedonic estimation by IAZI, one of the leading real estate consulting companies in Switzerland.</p>
                </div>
              </div>

              <form onSubmit={(e) => sendForm(e)}>
                <h3>Order now your personal complete PDF market check:</h3>
                <h6>What information do you need?</h6>

                <BrixelCheckbox
                  input={{
                    onChange: (val) => setCheckboxesVal(val),
                    name: 'checkboxes',
                    value: chexkboxesVal,
                  }}
                  icons
                  options={checkboxes}
                />

                <BrixelInputText
                  input={{
                    onChange: (val) => setEmail(val),
                    name: 'email',
                    value: email,
                  }}
                />

                <BrixelButtonPrimary
                  label="Order free PDF market check"
                  onClick={(e) => sendForm(e)}
                  type="submit"
                />

              </form>

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

const mapStateToProps = (state, props) => ({
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
