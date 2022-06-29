/* eslint-disable react-hooks/exhaustive-deps */
import { change, initializeForm, reset } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff } from '../../../actions/CommonActions';
import { getActiveSingleCompany } from '../../../actions/CompanyActions';
import { getBuyerDeal } from '../../../actions/DealActions';
import { getFavoritesProperties } from '../../../actions/MarketActions';
import { getActiveSingleProperty } from '../../../actions/PropertyActions';
import { getUserPagesDeals, setUserTypes } from '../../../actions/UserActions';
import lazyWithRetry from '../../../components/LazyWithRetry';
import SidebarBuyer from './SidebarBuyer';

const DashboardHome = lazyWithRetry(() => import('./DashboardHome'));

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
    if (loggedInUser.id) {
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
    }
  }, []);

  useEffect(() => {
    const activeLeads = get(activeSingleProperty, 'pageLeads[0]', { });
    if (activeLeads && activeLeads.company && activeLeads.company !== activeSingleCompany.id) {
      handleGetActiveSingleCompany({ id: activeLeads.company });
    } else if (activeSingleProperty.id) {
      handleGetActiveSingleCompany({ id: get(loggedInUser, 'user.company.id', null) });
    }
    if (dealID !== activeSingleDeal.id || !dealID) {
      let actionStub;
      if (get(history, 'location.pathname', '').includes('showings')) actionStub = 'user-schedule';
      if (get(history, 'location.pathname', '').includes('docubox')) actionStub = 'get-document';
      if (get(history, 'location.pathname', '').includes('contact')) actionStub = 'message';
      handleGetBuyerDeal({ id: propID, actionStub });
    }
  }, [propID]);

  useEffect(() => {
    if (propID && propID !== 'propertyLists' && loggedInUser.id) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
  }, [propID, favoritesProperties, loggedInUser]);

  // FUNCTION TO RESET FORM ON CHANGE SECTIONS - EXCEPT FOR FACTS AND ACHIEVEMENT FLOW
  useEffect(() => {
    if (get(history, 'location.pathname', '').includes('deal') && !get(history, 'location.pathname', '').includes('closing')) {
      history.push({ pathname: `/buyer/${propID}/closing` });
    }
  }, [history.location.pathname]);

  const sectionClass = get(history, 'location.pathname', '/').split('/');

  return (
    <div className={`dashboardContainer mt-0 mt-md-3 dis-f jc-b ${sectionClass[2]}`} id="dashboard">
      <div className="w-perc-100">
        <Suspense fallback="">
          <Routes>
            { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
            <Route path="/home" element={<DashboardHome />} />
            <Route path="/property/*" element={<PropertyBuyerDashboard />} />
            <Route path="/docubox" element={<Documents />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/closing/*" element={<DealsDashboardBuyer />} />
            <Route path="*" element={<Navigate to={`/buyer/${propID}/home`} />} />
          </Routes>
        </Suspense>
      </div>
      {
        get(history, 'location.pathname', '').includes('home') && (
          <div className="hide dis-f-lg w-perc-100 max-w-fix-360">
            <SidebarBuyer />
          </div>
        )
      }
    </div>
  );
};

Dashboard.propTypes = {
  activeSingleCompany: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.object.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetBuyerDeal: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
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
