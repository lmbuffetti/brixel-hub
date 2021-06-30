/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  destroy,
} from '@brixel/brixel-components';
import { diff } from 'deep-object-diff';
import {
  getOwnedProperties, getFavoritesProperties, getNewProperties,
  getPremiumProperties, getPremarketProperties, getLastViewedProperties,
  getWishlistProperties,
} from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import { updateFavorite } from '../../actions/UserActions';

const MarketCategoryListBuyer = lazy(() => import('./MarketCategoryListBuyer'));

const MarketList = lazy(() => import('./MarketList'));

const MarketBuyer = (props) => {
  // PROPS
  const {
    destroyForm,
    handleGetFavoritesProperties,
    handleGetNewProperties,
    handleGetPreMarketProperties,
    handleGetPremiumProperties,
    handleGetUserSearchProfiles,
    handleGetWishlistProperties,
    handleSpinnerOff,
    history,
    loggedInUser,
    match,
    userSearchProfiles,
  } = props;
  // URL PARAMS
  const catName = get(match, 'params.cat', null);

  useEffect(() => { destroyForm(); }, [history.location.pathname]);

  useEffect(() => {
    if (loggedInUser.id) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
      };
      if (!catName) handleGetFavoritesProperties(data);
      handleGetWishlistProperties(data);
      handleGetUserSearchProfiles(loggedInUser.id);
      handleSpinnerOff();
    }
  }, [loggedInUser.id]);

  useEffect(() => {
    if (userSearchProfiles !== null) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        searchProfileId: get(userSearchProfiles, '[0].id', null),
      };
      handleGetNewProperties(data);
      handleGetPreMarketProperties(data);
      handleGetPremiumProperties(data);
      handleSpinnerOff();
    }
  }, [userSearchProfiles, get(history, 'location.pathname', null)]);

  return (
    <div className="market-container buyerPage" id="market">
      {/* premarket overlay */}
      <Suspense fallback="">
        <Switch>
          <Route exact path="/buy" component={MarketCategoryListBuyer} />
          <Route exact path="/buy/:cat/:id?" component={() => <MarketList isBuyer />} />
        </Switch>
      </Suspense>
    </div>
  );
};

MarketBuyer.propTypes = {
  destroyForm: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  handleGetWishlistProperties: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
};

MarketBuyer.defaultProps = {
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
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
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketBuyerMemo);
