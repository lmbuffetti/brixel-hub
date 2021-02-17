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
  change,
  initializeForm,
  reset,
} from '@brixel/brixel-components';
import { setUserTypes, getUserPagesDeals } from '../../../actions/UserActions';
import { getActiveSingleProperty } from '../../../actions/PropertyActions';
import { spinnerOff } from '../../../actions/CommonActions';
import { getFavoritesProperties } from '../../../actions/MarketActions';

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
    handleGetFavoritesProperties,
    handleGetActiveSingleProperty,
    handleSpinnerOff,
    handleSetUserTypes,
    match,
    favoritesProperties,
  } = props;

  // GET URL PARAMS
  const propID = get(match, 'params.propID', null);
  // STATE
  const [itemsPerPage] = useState(20);
  const [currentPage] = useState(0);
  const [sortOrderType] = useState('updatedAt');
  const [sortDirection] = useState('DESC');

  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT AND GET THE GAME ACHIEVEMENTS - GAME HISTORY - GAME GROUP
  useEffect(() => {
    const data = {
      resultsPerPage: itemsPerPage,
      offset: currentPage,
      order: sortOrderType,
      direction: sortDirection,
      setAsSingle: true,
      multiLoader: true,
    };
    handleGetFavoritesProperties(data);
    handleSetUserTypes('buyer');
    handleSpinnerOff();
  }, []);

  useEffect(() => {
    if (propID && favoritesProperties.total > 0) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
  }, [propID, favoritesProperties]);

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
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', []),
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
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetUserPagesDeals: bindActionCreators(getUserPagesDeals, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
