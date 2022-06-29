/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import get from 'lodash/get';
import set from 'lodash/set';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText } from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import {
  getAllProperties, getFavoritesProperties, getLastViewedProperties,
  getNewProperties, getOwnedProperties, getPremarketProperties,
  getPremiumProperties, getWishlistProperties,
} from '../../actions/MarketActions';
import lazyWithRetry from '../../components/LazyWithRetry';
import MarketCardMap from '../../components/Cards/MarketCardMap';
import Pagination from '../../components/Pagination';
import { setSplashType, setWindowDimensions } from '../../actions/CommonActions';
import { setActiveMarketOverlayProperty } from '../../actions/PropertyActions';

const MarketMap = lazyWithRetry(() => import('./MarketMap'));

const MarketList = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
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
    handleGetWishlistProperties,
    lastViewedProperties,
    loggedInUser,
    newProperties,
    ownerProperties,
    preMarketProperties,
    premiumProperties,
    setMarketOverlayProperty,
    setSplashScreen,
    userSearchProfiles,
    wishlistProperties,
    windowDimensions,
  } = props;
  // URL PARAMS
  const catName = get(match, 'cat', null);
  const propID = get(match, 'id', null);
  // STATE
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrderType, setSortOrderType] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [activeProperty, setActiveProperty] = useState(propID);
  const [propertyListings, setPropertyListings] = useState([]);
  const [openMap, setOpenMap] = useState(false);
  const [marker, setMarker] = useState([]);

  useEffect(() => {
    if (windowDimensions.width <= 1024) {
      if (history.location.state === 'showMap') setOpenMap(true);
    }
  }, [windowDimensions]);

  useEffect(() => {
    if (loggedInUser.id && (userSearchProfiles || catName === 'own')) {
      const profileID = get(userSearchProfiles, '[0].id', null);
      const data = {
        resultsPerPage: itemsPerPage,
        offset: currentPage,
        order: sortOrderType,
        direction: sortDirection,
        setAsSingle: true,
        multiLoader: true,
      };
      switch (catName) {
        case 'own': {
          handleGetSellerProperties(data);
          break;
        }
        case 'all': {
          if (profileID) set(data, 'searchProfileId', profileID);
          handleGetAllProperties(data);
          break;
        }
        case 'wishlist': {
          handleGetWishlistProperties(data);
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
          if (profileID) set(data, 'searchProfileId', profileID);
          handleGetNewProperties(data);
          break;
        }
        case 'premium': {
          if (profileID) set(data, 'searchProfileId', profileID);
          handleGetPremiumProperties(data);
          break;
        }
        case 'preMarket': {
          if (profileID) set(data, 'searchProfileId', profileID);
          handleGetPreMarketProperties(data);
          break;
        }
        default:
          history.push('./');
      }
    }
  }, [itemsPerPage, currentPage, sortOrderType, sortDirection, get(loggedInUser, 'id', null), get(userSearchProfiles, '[0].id', null)]);

  // eslint-disable-next-line max-params
  const updatePagination = (resultsPerPage, pageNumber, type, direction) => {
    setItemsPerPage(resultsPerPage);
    setCurrentPage(pageNumber);
    setSortOrderType(type);
    setSortDirection(direction);
  };

  useEffect(() => {
    switch (catName) {
      case 'own': {
        setPropertyListings(ownerProperties.data || []);
        break;
      }
      case 'wishlist': {
        setPropertyListings(wishlistProperties.data || []);
        break;
      }
      case 'favorites': {
        setPropertyListings(favoritesProperties.data || []);
        break;
      }
      case 'lastViewed': {
        setPropertyListings(lastViewedProperties.data || []);
        break;
      }
      case 'radar': {
        setPropertyListings(newProperties.data || []);
        break;
      }
      case 'premium': {
        setPropertyListings(premiumProperties.data || []);
        break;
      }
      case 'preMarket': {
        setPropertyListings(preMarketProperties.data || []);
        break;
      }
      case 'all': {
        setPropertyListings(allProperties.data || []);
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
      if (openMap) {
        setOpenMap(false);
      } else {
        history.push('../');
      }
    } else {
      history.push('../');
    }
  };

  // eslint-disable-next-line consistent-return
  const getTitle = () => {
    switch (catName) {
      case 'own': {
        return 'Your properties';
      }
      case 'all': {
        return 'All properties';
      }
      case 'wishlist': {
        return 'Wishlist';
      }
      case 'favorites': {
        return 'Bookmarks';
      }
      case 'lastViewed': {
        return 'Last viewed properties';
      }
      case 'radar': {
        return 'Properties in your radar';
      }
      case 'premium': {
        return 'Premium properties';
      }
      case 'preMarket': {
        return 'Pre-market properties';
      }
      default:
    }
  };

  // eslint-disable-next-line consistent-return
  const getTotal = () => {
    switch (catName) {
      case 'own': {
        return ownerProperties.total;
      }
      case 'all': {
        return allProperties.total;
      }
      case 'wishlist': {
        return wishlistProperties.total;
      }
      case 'favorites': {
        return favoritesProperties.total;
      }
      case 'lastViewed': {
        return lastViewedProperties.total;
      }
      case 'radar': {
        return newProperties.total;
      }
      case 'premium': {
        return premiumProperties.total;
      }
      case 'preMarket': {
        return preMarketProperties.total;
      }
      default:
    }
  };

  const openCard = (item) => {
    if (catName === 'own') {
      history.push({
        pathname: `/${item.id}/home`,
        state: { section: 'Market' },
      });
    } else if (catName === 'preMarket' || get(item, 'tags', []).includes('pre-market')) {
      setSplashScreen('marketOverlay');
      setMarketOverlayProperty(item);
    } else if (catName === 'favorite' || catName === 'wishlist') {
      history.push({
        pathname: `/buyer/${item.id}/property/page`,
        state: { section: 'Market' },
      });
    } else window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
  };

  useEffect(() => {
    const catList = document.getElementsByClassName('market-container')[0];
    const scrollEl = document.getElementsByClassName('hubDasContent')[0];

    if (scrollEl) scrollEl.scrollTo = 0;

    if (catList) catList.classList.add('dis-f');
    if (catList) catList.classList.add('map-view');
    return () => {
      if (catList) catList.classList.remove('dis-f');
      if (catList) catList.classList.remove('map-view');
    };
  }, []);

  return (
    <div className="container">
      <div className="maplink hide-lg pos-a x-c bt mb-3 zIndex1">
        <BrixelButtonPrimary
          label="Map View"
          rounded
          theme="dark"
          leftIcon="roadmap"
          className={openMap ? 'slideOut' : ''}
          onClick={() => { setOpenMap(true); }}
        />
      </div>
      <div className="firstLevel dis-f">
        <div className="property-list pb-md-3">
          <div className="mb-3 dis-fl-col">
            <div className="dis-fl-col pos-r">
              <BrixelButtonIcon
                secondary
                small
                theme="light"
                onClick={() => handleMapClose()}
                icon="arrow-simple-left"
                className="pos-r"
              />
              <div className="mt-2 pr-0 pr-lg-3">
                <div className="dis-f jc-b a-b">
                  <div>
                    <h4 className="dis-b fweight-700 pb-small-4">{getTitle()}</h4>
                    <span className="fsize-300"><span>There are </span> <span className="fweight-600 notranslate"> {getTotal() ? getTotal() : '-'}</span> <span className="fweight-600">properties</span> <span>available</span></span>
                  </div>
                  <BrixelButtonText
                    className="fsize-300 show-all pos-r"
                    label="+ Add new"
                    onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'company.stub', '')}`)}
                  />
                </div>
              </div>
            </div>
            {
              /*
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
                  theme="light"#
                  themeSat={500}
                  className="fsize-300 mr-1"
                />
              </div>
            </div>
               */
            }
          </div>
        
          {
            propertyListings.map((page, i) => (
              <MarketCardMap
                type="own"
                key={`prop_${i.toString()}`}
                item={page}
                onClick={() => openCard(page)}
                onHover={(val) => setActiveProperty(val !== null ? page.id : null)}
              />
            ))
          }
          {
            propertyListings.length > 0 && (
              <Pagination
                className="pr-3"
                totalItems={getTotal()}
                itemsPerPage={itemsPerPage}
                activePage={currentPage}
                paginate={(resultsPerPage, pageNumber) => updatePagination(resultsPerPage, pageNumber, sortOrderType, sortDirection)}
                // we use the current values for the filters (stored in currentSearch, sortOrderType and sortDirection) in the moment the pagination is applied
              />
            )
          }
        </div>
      
        <div className={`secondLevel p-0 map-wrapper ${openMap ? 'map-on' : ''}`}>
          {
            windowDimensions.width <= 1024 && !activeProperty && (
              <BrixelButtonIcon
                ghost
                theme="dark"
                onClick={() => handleMapClose()}
                icon="close-small"
                className="pos-a-fix x-r-0 zIndex1 mt-10 mr-2"
              />
            )
          }
          <Suspense fallback="">
            <MarketMap
              type={catName}
              activeProperty={activeProperty}
              onActiveProperty={(val) => setActiveProperty(val)}
              properties={propertyListings}
              onMarker={(val) => setMarker(val)}
              parentMarker={marker}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

MarketList.propTypes = {
  allProperties: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.object.isRequired,
  handleGetAllProperties: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetLastViewedProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  handleGetWishlistProperties: PropTypes.func.isRequired,
  lastViewedProperties: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  newProperties: PropTypes.object.isRequired,
  ownerProperties: PropTypes.object.isRequired,
  preMarketProperties: PropTypes.object.isRequired,
  premiumProperties: PropTypes.object.isRequired,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
  wishlistProperties: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketList.defaultProps = {
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  allProperties: get(state, 'market.allProperties', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  lastViewedProperties: get(state, 'market.lastViewedProperties', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  newProperties: get(state, 'market.newProperties', {}),
  ownerProperties: get(state, 'market.ownerProperties', {}),
  preMarketProperties: get(state, 'market.preMarketProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  userSearchProfiles: get(state, 'user.userSearchProfiles', {}),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
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
  handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
