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
import { change, initializeForm, reset } from '@brixel/brixel-components';
import { getUserDeals } from '../../../actions/DealsActions';
import { setUserTypes } from '../../../actions/UserActions';

const ProtectedRoute = Loadable({
  loader: () => import('../../../components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
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
  const propID = get(match, 'params.propId', null);

  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT AND GET THE GAME ACHIEVEMENTS - GAME HISTORY - GAME GROUP
  useEffect(() => {
    handleGetUserDeals(loggedInUser.user.id);
    handleSetUserTypes('buyer');
  }, []);

  return (
    <div className="container dashboardContainer" id="dashboard">
      { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
      <h1>BUYER</h1>
      {/* <ProtectedRoute path="/:propId?/rewards/:rewardType?" component={RewardsDashboard} /> */}
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
