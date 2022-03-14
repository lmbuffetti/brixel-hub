/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import {
  Routes, Route, useLocation, useNavigate, useParams, Navigate,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { reset, initializeForm, change } from '@brixel/brixel-components/dist/utils/ReduxForm.Functions';
import { setUserTypes, getUserPagesDeals } from '../../../actions/UserActions';
import { getActiveSingleCompany } from '../../../actions/CompanyActions';
import { getActiveSingleProperty } from '../../../actions/PropertyActions';
import { spinnerOff } from '../../../actions/CommonActions';
import { getFavoritesProperties } from '../../../actions/MarketActions';
import { getBuyerDeal } from '../../../actions/DealActions';
import lazyWithRetry from '../../../components/LazyWithRetry';

const PropertiesBuyerDashboard = lazyWithRetry(() => import('./PropertiesBuyerDashboard'));

const PropertyBuyerDashboard = lazyWithRetry(() => import('./PropertyBuyerDashboard'));

const DealsDashboardBuyer = lazyWithRetry(() => import('./DealsDashboardBuyer'));

const Documents = lazyWithRetry(() => import('../../SingleProperty/Documents'));

const Financing = lazyWithRetry(() => import('./Financing'));

const Dashboard = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
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
    favoritesProperties,
  } = props;

  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  const dealID = get(match, 'dealID', null);
  // STATE
  const [itemsPerPage] = useState(20);
  const [currentPage] = useState(0);
  const [sortOrderType] = useState('updatedAt');
  const [sortDirection] = useState('DESC');

  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT
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
    if (activeSingleProperty.id && (dealID !== activeSingleDeal.id || !dealID)) {
      handleGetBuyerDeal({ id: activeSingleProperty.id });
    }
  }, [activeSingleProperty]);

  useEffect(() => {
    if (propID && propID !== 'propertyLists') {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
  }, [propID, favoritesProperties]);

  // FUNCTION TO RESET FORM ON CHANGE SECTIONS - EXCEPT FOR FACTS AND ACHIEVEMENT FLOW
  useEffect(() => {
    if (get(history, 'location.pathname', '').includes('deal') && !get(history, 'location.pathname', '').includes('closing')) {
      history.push({ pathname: `/buyer/${propID}/closing` });
    }
  }, [history.location.pathname]);

  return (
    <div className="dashboardContainer" id="dashboard">
      <div className="w-perc-100">
        <Suspense fallback="">
          <Routes>
            { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
            <Route path="/" element={<PropertiesBuyerDashboard />} />
            <Route path="/property/*" element={<PropertyBuyerDashboard />} />
            <Route path="/docubox" element={<Documents />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/closing/*" element={<DealsDashboardBuyer />} />
            <Route path="*" element={<Navigate to={`/buyer/${propID}/property`} />} />
          </Routes>
        </Suspense>
      </div>
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
  handleReset(data) {
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
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
