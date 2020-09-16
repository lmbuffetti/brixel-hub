/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Redirect,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { change, initializeForm, reset } from '@brixel/brixel-components';
import { getUserDeals } from '../../../actions/DealsActions';
import { setUserTypes } from '../../../actions/UserActions';

const ProtectedRoute = Loadable({
  loader: () => import('../../../components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: () => null,
});

const PropertiesDashboard = Loadable({
  loader: () => import('./PropertiesDashboard' /* webpackChunkName: "PropertiesDashboard" */),
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
    loggedInUser,
    match,
    handleGetUserDeals,
    handleSetUserTypes,
  } = props;

  // GET URL PARAMS
  const propID = get(match, 'params.propID', null);
  console.log(propID);
  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT AND GET THE GAME ACHIEVEMENTS - GAME HISTORY - GAME GROUP
  useEffect(() => {
    handleGetUserDeals(loggedInUser.user.id);
    handleSetUserTypes('buyer');
  }, []);

  return (
    <div className="container dashboardContainer" id="dashboard">
      { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
      <ProtectedRoute path="/buyer/propertyLists" exact component={PropertiesDashboard} />
      <ProtectedRoute path="/buyer/rewards/:propID" component={RewardsBuyerDashboard} />
      <ProtectedRoute path="/buyer/property/:propID" component={PropertyBuyerDashboard} />
    </div>
  );
};

Dashboard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleGetUserDeals: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', undefined),
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
  handleGetUserDeals: bindActionCreators(getUserDeals, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
