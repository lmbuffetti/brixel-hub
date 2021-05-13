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
  getFavoritesProperties,
  getOwnedProperties,
  getPremiumProperties,
} from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import { updateFavorite } from '../../actions/UserActions';

const MarketCategoryListSeller = Loadable({
  loader: () => import('./MarketCategoryListSeller' /* webpackChunkName: "MarketCategoryListSeller" */),
  loading: () => null,
});

const MarketList = Loadable({
  loader: () => import('./MarketList' /* webpackChunkName: "MarketList" */),
  loading: () => null,
});

const MarketSeller = (props) => {
  // PROPS
  const {
    destroyForm,
    handleGetFavoritesProperties,
    handleGetPremiumProperties,
    handleGetSellerProperties,
    handleSpinnerOff,
    history,
    loggedInUser,
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
      handleGetSellerProperties(data);
      handleGetPremiumProperties(data);
      handleSpinnerOff();
    }
  }, [loggedInUser]);

  return (
    <div className="market-container container" id="market">
      {/* premarket overlay */}
      <Switch>
        <Route exact path="/sell" component={MarketCategoryListSeller} />
        <Route exact path="/sell/:cat/:id?" component={() => <MarketList isSeller />} />
      </Switch>
    </div>
  );
};

MarketSeller.propTypes = {
  destroyForm: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketSeller);
