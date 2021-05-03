/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  destroy,
} from '@brixel/brixel-components';
import {
  getOwnedProperties, getFavoritesProperties, getNewProperties,
  getPremiumProperties, getPremarketProperties, getLastViewedProperties,
} from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import { updateFavorite } from '../../actions/UserActions';

const MarketCategoryListBuyer = Loadable({
  loader: () => import('./MarketCategoryListBuyer' /* webpackChunkName: "MarketCategoryListBuyer" */),
  loading: () => null,
});

const MarketList = Loadable({
  loader: () => import('./MarketList' /* webpackChunkName: "MarketList" */),
  loading: () => null,
});

const MarketBuyer = (props) => {
  // PROPS
  const {
    destroyForm,
    handleGetFavoritesProperties,
    handleGetLastViewedProperties,
    handleGetNewProperties,
    handleGetPreMarketProperties,
    handleGetPremiumProperties,
    handleGetSellerProperties,
    handleGetUserSearchProfiles,
    handleSpinnerOff,
    history,
    loggedInUser,
    userSearchProfiles,
  } = props;

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
      handleGetFavoritesProperties(data);
      handleGetLastViewedProperties();
      handleGetUserSearchProfiles(loggedInUser.id);
      handleSpinnerOff();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (userSearchProfiles) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        searchProfileId: get(userSearchProfiles[0], 'id', null),
      };
      handleGetPreMarketProperties(data);
      handleGetPremiumProperties(data);
      handleSpinnerOff();
    }
  }, [userSearchProfiles]);

  return (
    <div className="market-container container" id="market">
      {/* premarket overlay */}
      <Switch>
        <Route exact path="/buy" component={MarketCategoryListBuyer} />
        <Route exact path="/buy/:cat/:id?" component={() => <MarketList isBuyer />} />
      </Switch>
    </div>
  );
};

MarketBuyer.propTypes = {
  destroyForm: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetLastViewedProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
};

MarketBuyer.defaultProps = {
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
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
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketBuyer);
