/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  getOwnedProperties, getFavoritesProperties, getNewProperties,
  getPremiumProperties, getPremarketProperties, getLastViewedProperties,
} from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { spinnerOff } from '../../actions/CommonActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import MarketList from './MarketList';

const MarketCategoryList = Loadable({
  loader: () => import('./MarketCategoryList' /* webpackChunkName: "MarketCategoryList" */),
  loading: () => null,
});

const Market = (props) => {
  // PROPS
  const {
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

  const getProfileCountry = () => {
    let country = '';
    userSearchProfiles[0].location.forEach((loc, i) => {
      if (i === userSearchProfiles[0].location.length - 1) country += `${loc.countryCode}`;
      else country += `${loc.countryCode},`;
    });
    return country;
  };

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
      handleGetSellerProperties(data);
      handleGetFavoritesProperties(data);
      handleGetPreMarketProperties(data);
      handleGetLastViewedProperties();
      handleGetUserSearchProfiles(loggedInUser.id);
      handleSpinnerOff();
    }
  }, [loggedInUser]);

  useEffect(() => {
    const profile = userSearchProfiles[0];
    if (get(profile, 'id', '')) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        searchProfileId: userSearchProfiles[0].id,
      };
      const payload = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        country: getProfileCountry(),
      };
      handleGetNewProperties(data);
      handleGetPremiumProperties(payload);
      handleSpinnerOff();
    }
  }, [userSearchProfiles]);

  return (
    <div className={`market-container container ${!history.location.pathname.includes('home/') ? 'market-listings' : 'dis-f'}`} id="market">
      <Switch>
        <Route exact path="/home" component={MarketCategoryList} />
        <Route exact path="/home/:cat/:id?" component={MarketList} />
      </Switch>
    </div>
  );
};

Market.propTypes = {
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
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Market.defaultProps = {
};

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Market);
