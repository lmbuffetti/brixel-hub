/* eslint-disable react-hooks/exhaustive-deps */
import { destroy } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import {
  getAllProperties,
  getFavoritesProperties,
  getLastViewedProperties,
  getNewProperties,
  getOwnedEstimations,
  getOwnedProperties,
  getPremarketProperties,
  getPremiumProperties,
  getWishlistProperties,
} from '../../actions/MarketActions';
import { setActiveMarketOverlayPropertyLists } from '../../actions/PropertyActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import { updateFavorite } from '../../actions/UserActions';
import lazyWithRetry from '../../components/LazyWithRetry';
import '../../styles/SCSS/pages/market.scss';

const MarketCategoryListBuyer = lazyWithRetry(() => import('./MarketCategoryListBuyer'));
const MarketList = lazyWithRetry(() => import('./MarketList'));

const MarketBuyer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSearchProfile,
    destroyForm,
    handleGetFavoritesProperties,
    handleGetAllProperties,
    handleGetOwnedEstimations,
    handleGetPreMarketProperties,
    handleGetPremiumProperties,
    handleGetUserSearchProfiles,
    handleGetWishlistProperties,
    handleSpinnerOff,
    loggedInUser,
    preMarketProperties,
  } = props;
  // URL PARAMS
  const catName = get(match, 'cat', null);
  const [page, setPage] = useState({
    all: 0,
    published: 0,
    preMarket: 0,
  });

  useEffect(() => { destroyForm(); }, [history.location.pathname]);

  useEffect(() => {
    if (get(loggedInUser, 'id', null)) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        ownerId: loggedInUser.id,
        isBuyer: true,
      };
      if (!catName) handleGetFavoritesProperties(data);
      handleGetWishlistProperties(data);
      handleGetUserSearchProfiles(loggedInUser.id);
      handleGetOwnedEstimations(data);
      handleSpinnerOff();
    }
  }, [loggedInUser.id]);
  
  const getPropertiesPage = (type, pageNumber) => {
    if (activeSearchProfile !== null) {
      const data = {
        resultsPerPage: 9,
        offset: pageNumber,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        overlayCard: true,
        resultType: 'buyer',
        searchProfileId: get(activeSearchProfile, '.id', null),
      };
      switch (type) {
        case 'all':
          data.offset = page.all;
          handleGetAllProperties(data);
          break;
        case 'preMarket':
          data.preMarket = page.all;
          handleGetPreMarketProperties(data);
          break;
        case 'published':
          data.offset = page.published;
          handleGetPremiumProperties(data);
          break;
        default:
          return null;
      }
      setPage({... page, [type]: pageNumber });
      handleSpinnerOff();
    }
  }

  useEffect(() => {
    if (activeSearchProfile !== null) {
      getPropertiesPage('all', page['all']);
      getPropertiesPage('preMarket', page['preMarket']);
      getPropertiesPage('published', page['published']);
      handleSpinnerOff();
    }
  }, [activeSearchProfile, get(history, 'location.pathname', null)]);

  return (
    <div className="bgOverlay market-container buyerPage" id="market">
      {/* premarket overlay */}
      <Suspense fallback="">
        <Routes>
          <Route
            path="/"
            element={
              <MarketCategoryListBuyer
                onPageChange={(resultsPerPage, pageNumber, type) => getPropertiesPage(type, pageNumber)}
                page={page}
              />
            }
          />
          <Route path="/searchProfile/*" element={<MarketCategoryListBuyer />} />
          <Route path="/:cat" element={<MarketList isBuyer />} />
          <Route path="*" element={<Navigate to="/buy" />} />
        </Routes>
      </Suspense>
    </div>
  );
};

MarketBuyer.propTypes = {
  activeSearchProfile: PropTypes.object,
  destroyForm: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetOwnedEstimations: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetAllProperties: PropTypes.func.isRequired,
  handleGetPremarketStats: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  handleGetWishlistProperties: PropTypes.func.isRequired,
  // handleSetActiveMarketOverlayPropertyLists: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  preMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MarketBuyer.defaultProps = {
  activeSearchProfile: null,
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  activeSearchProfile: get(state, 'user.activeSearchProfile', null),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  preMarketProperties: get(state, 'market.preMarketProperties.data', []),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleGetAllProperties: bindActionCreators(getAllProperties, dispatch),
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleGetOwnedEstimations: bindActionCreators(getOwnedEstimations, dispatch),
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
  handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketBuyer);
