/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import set from 'lodash/set';
import Loadable from 'react-loadable';
import { BrixelButtonIcon, BrixelButtonSecondary } from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  getAllProperties, getFavoritesProperties, getLastViewedProperties,
  getNewProperties, getOwnedProperties, getPremarketProperties,
  getPremiumProperties,
} from '../../actions/MarketActions';
import MarketCardMap from '../../components/MarketCardMap';
import { setWindowDimensions } from '../../actions/CommonActions';

const MarketMap = Loadable({
  loader: () => import('./MarketMap' /* webpackChunkName: "MarketMap" */),
  loading: () => null,
});

const MarketList = (props) => {
  // PROPS
  const {
    allProperties,
    favoritesProperties,
    handleGetAllProperties,
    handleGetFavoritesProperties,
    handleGetLastViewedProperties,
    handleGetNewProperties,
    handleGetPreMarketProperties,
    handleGetPremiumProperties,
    handleGetSellerProperties,
    history,
    lastViewedProperties,
    loggedInUser,
    match,
    newProperties,
    ownerProperties,
    preMarketProperties,
    premiumProperties,
    userSearchProfiles,
    windowDimensions,
  } = props;
  // URL PARAMS
  const catName = get(match, 'params.cat', null);
  const propID = get(match, 'params.id', null);
  // STATE
  const [activeProperty, setActiveProperty] = useState(propID);
  const [propertyListings, setPropertyListings] = useState([]);
  const [openMap, setOpenMap] = useState(false);

  useEffect(() => {
    const profile = userSearchProfiles[0];
    if (loggedInUser.id && get(profile, 'id', '')) {
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
          set(data, 'searchProfileId', userSearchProfiles[0].id);
          handleGetNewProperties(data);
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
  }, [loggedInUser, userSearchProfiles]);

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

  const handleMapClose = () => {
    // eslint-disable-next-line react/prop-types
    if (windowDimensions.width <= 1024) {
      setOpenMap(false);
    } else {
      history.push('/home');
    }
  };

  return (
    <>
      <div className="maplink hide-lg pos-a x-c bt mb-3 zIndex1">
        <BrixelButtonSecondary
          label="Map View"
          rounded
          theme="light"
          themeSat={500}
          className={openMap ? 'slideOut' : ''}
          onClick={() => { setOpenMap(true); }}
        />
      </div>
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
              <MarketCardMap type="own" key={i.toString()} item={page} />
            ))
          }
        </div>

        <div className={`secondLevel p-0 map-wrapper ${openMap ? 'map-on' : ''}`}>
          <BrixelButtonIcon
            ghost
            theme="dark"
            onClick={() => handleMapClose()}
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
  allProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetAllProperties: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetLastViewedProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lastViewedProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  newProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  ownerProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  preMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  premiumProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketList.defaultProps = {

};

const mapStateToProps = (state) => ({
  allProperties: get(state, 'market.allProperties', []),
  favoritesProperties: get(state, 'market.favoritesProperties', []),
  lastViewedProperties: get(state, 'market.lastViewedProperties', []),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  newProperties: get(state, 'market.newProperties.data', []),
  ownerProperties: get(state, 'market.ownerProperties', []),
  preMarketProperties: get(state, 'market.preMarketProperties', []),
  premiumProperties: get(state, 'market.premiumProperties', []),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetAllProperties: bindActionCreators(getAllProperties, dispatch),
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
