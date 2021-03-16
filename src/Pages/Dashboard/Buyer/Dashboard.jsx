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
import { getActiveSingleCompany } from '../../../actions/CompanyActions';
import { getActiveSingleProperty } from '../../../actions/PropertyActions';
import { spinnerOff } from '../../../actions/CommonActions';
import { getFavoritesProperties } from '../../../actions/MarketActions';
import { getBuyerDeal } from '../../../actions/DealActions';

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

const OfferDetail = Loadable({
  loader: () => import('../../Offers/OfferDetail' /* webpackChunkName: "OfferDetail" */),
  loading: () => null,
});

const Dashboard = (props) => {
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    activeSingleDeal,
    handleGetFavoritesProperties,
    handleGetActiveSingleProperty,
    handleGetActiveSingleCompany,
    handleSpinnerOff,
    handleGetBuyerDeal,
    handleSetUserTypes,
    loggedInUser,
    match,
    favoritesProperties,
  } = props;

  // GET URL PARAMS
  const propID = get(match, 'params.propID', null);
  const dealID = get(match, 'params.dealID', null);
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
    const activeLeads = get(activeSingleProperty, 'pageLeads[0]', { });
    if (activeLeads && activeLeads.company !== activeSingleCompany.id) {
      handleGetActiveSingleCompany({ id: activeLeads.company });
    } else if (activeSingleProperty.id) {
      handleGetActiveSingleCompany({ id: get(loggedInUser, 'user.company.id', null) });
    }
    if (activeSingleProperty.id && dealID !== activeSingleDeal.id) {
      handleGetBuyerDeal(activeSingleProperty.id);
    }
  }, [activeSingleProperty]);

  useEffect(() => {
    if (propID && propID !== 'propertyLists' && favoritesProperties.total > 0) {
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
      <ProtectedRoute exact path="/buyer/propertyLists" component={PropertiesBuyerDashboard} />
      <ProtectedRoute path="/buyer/:propID/rewards" component={RewardsBuyerDashboard} />
      <ProtectedRoute path="/buyer/:propID/property" component={PropertyBuyerDashboard} />
      <ProtectedRoute path="/buyer/:propID/deal/:dealID" render={<OfferDetail isBuyer />} />
    </div>
  );
};

Dashboard.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSingleCompany: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetBuyerDeal: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany.id', { }),
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
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetUserPagesDeals: bindActionCreators(getUserPagesDeals, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
