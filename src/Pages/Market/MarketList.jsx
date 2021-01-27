/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import { BrixelButtonIcon, BrixelButtonSecondary } from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Sticker from 'react-stickyfill';
import {
  getAllProperties, getFavoritesProperties, getLastViewedProperties,
  getNewProperties, getOwnedProperties, getPremarketProperties,
  getPremiumProperties,
} from '../../actions/MarketActions';

const MarketMap = Loadable({
  loader: () => import('./MarketMap' /* webpackChunkName: "MarketMap" */),
  loading: () => null,
});

const MarketList = (props) => {
  // PROPS
  const {
    history,
    loggedInUser,
    favoritesProperties,
    handleGetFavoritesProperties,
    handleGetSellerProperties,
    handleGetNewProperties,
    handleGetPremiumProperties,
    handleGetPreMarketProperties,
    handleGetLastViewedProperties,
    handleGetAllProperties,
    match,
    ownerProperties,
    newProperties,
    lastViewedProperties,
    premiumProperties,
    preMarketProperties,
    allProperties,
  } = props;
  // URL PARAMS
  const catName = get(match, 'params.cat', null);
  const propID = get(match, 'params.id', null);
  // STATE
  const [activeProperty, setActiveProperty] = useState(propID);
  const [propertyListings, setPropertyListings] = useState([]);

  useEffect(() => {
    if (loggedInUser.id) {
      const data = {
        resultsPerPage: 50,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
      };
      switch (catName) {
        case 'own': {
          handleGetSellerProperties(data);
          break;
        }
        case 'all': {
          handleGetAllProperties(data);
          break;
        }
        case 'favorites': {
          handleGetFavoritesProperties(data);
          break;
        }
        case 'lastViewed': {
          handleGetLastViewedProperties();
          break;
        }
        case 'radar': {
          handleGetNewProperties();
          break;
        }
        case 'premium': {
          handleGetPremiumProperties(data);
          break;
        }
        case 'preMarket': {
          handleGetPreMarketProperties(data);
          break;
        }
        default:
          history.push('/home');
      }
    }
  }, [loggedInUser]);

  useEffect(() => {
    switch (catName) {
      case 'own': {
        setPropertyListings(ownerProperties);
        break;
      }
      case 'favorites': {
        setPropertyListings(favoritesProperties);
        break;
      }
      case 'lastViewed': {
        setPropertyListings(lastViewedProperties);
        break;
      }
      case 'radar': {
        setPropertyListings(newProperties);
        break;
      }
      case 'premium': {
        setPropertyListings(premiumProperties);
        break;
      }
      case 'preMarket': {
        setPropertyListings(preMarketProperties);
        break;
      }
      case 'all': {
        setPropertyListings(allProperties);
        break;
      }
      default:
        setPropertyListings([]);
    }
  }, [ownerProperties,
    favoritesProperties,
    lastViewedProperties,
    premiumProperties,
    preMarketProperties,
    newProperties,
    allProperties]);

  return (
    <>
      <div className="firstLevel dis-f">
        <div className="property-list py-6">
          <div className="mb-3 dis-fl-col">
            <div className="mb-3">
              <h3 className="dis-b">All in your rader</h3>
              <span>There are <strong>303 properties</strong> in your rader </span>
            </div>
            <div className="dis-f jc-b">
              <div className="dis-f a-t">
                <BrixelButtonSecondary
                  label="All"
                  rounded
                  theme="light"
                  themeSat={500}
                  className="fsize-300 mr-1"
                />
                <BrixelButtonSecondary
                  label="More Filter"
                  rounded
                  theme="light"
                  themeSat={500}
                  className="fsize-300 mr-1"
                />
              </div>
              <div className="div">
                <BrixelButtonSecondary
                  label="Sort by relevance"
                  rounded
                  theme="light"
                  themeSat={500}
                  className="fsize-300 mr-1"
                />
              </div>
            </div>
          </div>
          {
            propertyListings.map((page, i) => (
              <div
                className={`${activeProperty === page.id ? 'bgGreen400' : 'bgRed100'} mb-3`}
                key={i.toString()}
                onClick={() => setActiveProperty(page.id)}
              >
                <p>{i + 1} - {page.id}</p>
                <p>{get(page, 'location.longitude', 0)} - {get(page, 'location.latitude', 0)}</p>
              </div>
            ))
          }
        </div>

        <div className="secondLevel p-0 map-wrapper">
          <BrixelButtonIcon
            ghost
            theme="dark"
            onClick={() => history.push('/home')}
            icon="close-small"
            className="pos-a-fix x-l mt-1 ml-1 zIndex2"
          />
          <MarketMap
            activeProperty={activeProperty}
            onActiveProperty={(val) => setActiveProperty(val)}
            properties={propertyListings}
          />
        </div>
      </div>
    </>
  );
};

MarketList.propTypes = {
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetLastViewedProperties: PropTypes.func.isRequired,
  handleGetAllProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  ownerProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  newProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastViewedProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  premiumProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  preMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  allProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MarketList.defaultProps = {

};

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  favoritesProperties: get(state, 'market.favoritesProperties', []),
  ownerProperties: get(state, 'market.sellerProperties', []),
  newProperties: get(state, 'market.newProperties', []),
  lastViewedProperties: get(state, 'market.lastViewedProperties', []),
  premiumProperties: get(state, 'market.premiumProperties', []),
  preMarketProperties: get(state, 'market.preMarketProperties', []),
  allProperties: get(state, 'market.allProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetAllProperties: bindActionCreators(getAllProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
