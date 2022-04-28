/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Navigate,
  Route, Routes, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { destroy } from '@brixel/brixel-components/dist/form';
import { diff } from 'deep-object-diff';
import {
  getOwnedProperties, getFavoritesProperties, getNewProperties,
  getPremiumProperties, getPremarketProperties, getLastViewedProperties,
  getWishlistProperties, getPremarketStats, getOwnedEstimations,
} from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import { updateFavorite } from '../../actions/UserActions';
import { setActiveMarketOverlayPropertyLists } from '../../actions/PropertyActions';
import lazyWithRetry from '../../components/LazyWithRetry';

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
    destroyForm,
    handleGetFavoritesProperties,
    // handleSetActiveMarketOverlayPropertyLists,
    handleGetOwnedEstimations,
    handleGetPreMarketProperties,
    handleGetPremarketStats,
    handleGetPremiumProperties,
    handleGetUserSearchProfiles,
    handleGetWishlistProperties,
    handleSpinnerOff,
    loggedInUser,
    preMarketProperties,
    userSearchProfiles,
  } = props;
  // URL PARAMS
  const catName = get(match, 'cat', null);

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

  useEffect(() => {
    // handleSetActiveMarketOverlayPropertyLists(preMarketProperties);
  }, [preMarketProperties]);

  useEffect(() => {
    if (userSearchProfiles !== null) {
      handleGetPremarketStats({ id: get(userSearchProfiles, '[0].id', null) });
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        overlayCard: true,
        resultType: 'buyer',
        searchProfileId: get(userSearchProfiles, '[0].id', null),
      };
      handleGetPreMarketProperties(data);
      if (get(userSearchProfiles, '[0].id', null)) {
        handleGetPremiumProperties(data);
        data.resultType = 'europe';
        handleGetPremiumProperties(data);
      } else {
        data.resultType = 'seller';
        handleGetPremiumProperties(data);
      }
      handleSpinnerOff();
    }
  }, [userSearchProfiles, get(history, 'location.pathname', null)]);

  return (
    <div className="bgOverlay market-container buyerPage" id="market">
      {/* premarket overlay */}
      <Suspense fallback="">
        <Routes>
          <Route path="/" element={<MarketCategoryListBuyer />} />
          <Route path="/:cat" element={<MarketList isBuyer />} />
          <Route path="*" element={<Navigate to="/buy" />} />
        </Routes>
      </Suspense>
    </div>
  );
};

MarketBuyer.propTypes = {
  destroyForm: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetOwnedEstimations: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremarketStats: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  handleGetWishlistProperties: PropTypes.func.isRequired,
  // handleSetActiveMarketOverlayPropertyLists: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  preMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
};

MarketBuyer.defaultProps = {
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  preMarketProperties: get(state, 'market.preMarketProperties.data', []),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', null),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleGetOwnedEstimations: bindActionCreators(getOwnedEstimations, dispatch),
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetPremarketStats: bindActionCreators(getPremarketStats, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
  handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export const MarketBuyerMemo = React.memo(MarketBuyer, (prevProps, nextProps) => {
  const diffProps = diff(prevProps, nextProps);
  const diffSearchProfile = diff(prevProps.userSearchProfiles, nextProps.userSearchProfiles);
  return (
    Object.keys(diffProps).length === 0 &&
    Object.keys(diffSearchProfile).length === 0
  );
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketBuyerMemo);
