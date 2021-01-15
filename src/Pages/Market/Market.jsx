/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { getSellerProperties, getFavoritesProperties } from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { spinnerOff } from '../../actions/CommonActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';

const MarketList = Loadable({
  loader: () => import('./MarketList' /* webpackChunkName: "MarketList" */),
  loading: () => 'Loading...',
});

const MarketCategoryList = Loadable({
  loader: () => import('./MarketCategoryList' /* webpackChunkName: "MarketCategoryList" */),
  loading: () => null,
});

const Market = (props) => {
  // PROPS
  const {
    handleGetSellerProperties,
    handleSpinnerOff,
    loggedInUser,
    windowDimensions,
    handleGetFavoritesProperties,
    handleGetUserSearchProfiles,
  } = props;

  useEffect(() => {
    if (loggedInUser.id) {
      const data = {
        limit: 10,
        offset: `0/?owner=${loggedInUser.id}`,
        userId: loggedInUser.id,
        setAsSingle: true,
        multiLoader: true,
      };
      handleGetSellerProperties(data);
      handleGetFavoritesProperties(data);
      handleGetUserSearchProfiles(loggedInUser.id);
      handleSpinnerOff();
    }
  }, [loggedInUser]);

  return (
    <div className="market-container container" id="market">
      <Switch>
        <Route exact path="/home" component={MarketCategoryList} />
        <Route exact path="/home/:cat/:id?" component={MarketList} />
      </Switch>
    </div>
  );
};

Market.propTypes = {
  handleGetSellerProperties: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

Market.defaultProps = {
};

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getSellerProperties, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Market);
