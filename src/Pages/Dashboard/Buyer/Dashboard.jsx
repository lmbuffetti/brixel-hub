/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  BrixelTabs, change, initializeForm, reset,
} from '@brixel/brixel-components';
import has from 'lodash/has';
import { setUserTypes, getUserPagesDeals } from '../../../actions/UserActions';
import { setActiveSingleProperty } from '../../../actions/PropertyActions';
import { firstRoutesBuyer, secondRoutesBuyer } from '../../../resources/navigationRoutes';

const ProtectedRoute = Loadable({
  loader: () => import('../../../components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: () => null,
});

const PropertiesBuyerDashboard = Loadable({
  loader: () => import('./PropertiesBuyerDashboard' /* webpackChunkName: "PropertiesBuyerDashboard" */),
  loading: () => null,
});

const RewardsBuyerDashboard = Loadable({
  loader: () => import('./RewardsBuyerDashboard' /* webpackChunkName: "RewardsBuyerDashboard" */),
  loading: () => null,
});

const PropertyBuyerDashboard = Loadable({
  loader: () => import('./PropertyBuyerDashboard' /* webpackChunkName: "PropertyBuyerDashboard" */),
  loading: () => null,
});

const Dashboard = (props) => {
  // PROPS
  const {
    handleGetUserPagesDeals,
    handleSetActiveSingleProperty,
    handleSetUserTypes,
    loggedInUser,
    match,
    userBuyerProperties,
  } = props;

  // GET URL PARAMS
  const propID = get(match, 'params.propID', null);
  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT AND GET THE GAME ACHIEVEMENTS - GAME HISTORY - GAME GROUP
  useEffect(() => {
    handleGetUserPagesDeals(loggedInUser.user.id);
    handleSetUserTypes('buyer');
  }, []);

  useEffect(() => {
    if (propID && userBuyerProperties.length > 0) {
      const selectProperty = userBuyerProperties.find((item) => item.id === propID);
      if (selectProperty) handleSetActiveSingleProperty(selectProperty);
    }
  }, [propID, userBuyerProperties]);

  return (
    <div className="container dashboardContainer" id="dashboard">
      { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
      <ProtectedRoute path="/buyer/propertyLists" exact component={PropertiesBuyerDashboard} />
      <ProtectedRoute path="/buyer/rewards/:propID" component={RewardsBuyerDashboard} />
      <ProtectedRoute path="/buyer/property/:propID" component={PropertyBuyerDashboard} />
    </div>
  );
};

Dashboard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleGetUserPagesDeals: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userBuyerProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Dashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  userBuyerProperties: get(state, 'user.userBuyerProperties', undefined),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});
const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('Property', value));
  },
  resetForm(data) {
    (dispatch(reset('Property', data)));
  },
  handleGetUserPagesDeals: bindActionCreators(getUserPagesDeals, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
