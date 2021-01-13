/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Sticker from 'react-stickyfill';
import Loadable from 'react-loadable';
import { getSellerProperties } from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';

const MarketList = Loadable({
  loader: () => import('./MarketList' /* webpackChunkName: "MarketList" */),
  loading: () => null,
});

const MarketCategoryList = Loadable({
  loader: () => import('./MarketCategoryList' /* webpackChunkName: "MarketCategoryList" */),
  loading: () => null,
});

const Market = (props) => {
  // PROPS
  const {
    handleGetSellerProperties,
    loggedInUser,
    windowDimensions,
  } = props;

  useEffect(() => {
    if (loggedInUser.id) {
      const data = {
        limit: 50,
        offset: `0/?owner=${loggedInUser.id}`,
        userId: loggedInUser.id,
        setAsSingle: true,
        multiLoader: true,
      };
      handleGetSellerProperties(data);
    }
  }, [loggedInUser]);

  return (
    <div className="market-container mx-2" id="market">
      <Switch>
        <Route exact path="/home" component={MarketCategoryList} />
        <Route exact path="/home/:cat" component={MarketList} />
      </Switch>
    </div>
  );
};

Market.propTypes = {
  handleGetSellerProperties: PropTypes.func.isRequired,
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
  handleGetSellerProperties: bindActionCreators(getSellerProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Market);
