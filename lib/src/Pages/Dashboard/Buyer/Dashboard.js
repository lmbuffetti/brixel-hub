import { change, initializeForm, reset } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff } from '../../../actions/CommonActions';
import { getActiveSingleCompany } from '../../../actions/CompanyActions';
import { getBuyerDeal, getScheduleVisit, setScheduleVisit } from '../../../actions/DealActions';
import { getFavoritesProperties } from '../../../actions/MarketActions';
import { getActiveSingleProperty } from '../../../actions/PropertyActions';
import { setUserTypes } from '../../../actions/UserActions';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Energy from './Energy/Energy';
const DashboardHome = lazyWithRetry(() => import('./DashboardHome'));
const PropertyBuyerDashboard = lazy(() => import('./PropertyBuyerDashboard'));
const ScheduleVisit = lazy(() => import('./ScheduleVisit/ScheduleVisit'));
const DocumentsBuyer = lazy(() => import('../../SingleProperty/Documents/DocumentsBuyer'));
const Financing = lazy(() => import('./Financing'));
const SingleOffer = lazy(() => import('./Offer/SingleOffer'));
const Dashboard = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSingleProperty, activeSingleDeal, handleGetFavoritesProperties, handleGetActiveSingleProperty, hanldeGetScheduleVisit, handleGetScheduleVisit, handleGetActiveSingleCompany, handleSpinnerOff, handleGetBuyerDeal, handleSetUserTypes, loggedInUser, } = props;
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
    }, [loggedInUser.id]);
    useEffect(() => {
        if (activeSingleProperty.id && loggedInUser.id) {
            const companiesListUser = get(activeSingleProperty, 'companies', []);
            if (activeSingleProperty.id) {
                handleGetActiveSingleCompany({ id: activeSingleProperty.company });
            }
            else if (companiesListUser.length > 0) {
                handleGetActiveSingleCompany({ id: companiesListUser[companiesListUser.length - 1] });
            }
            if ((dealID !== activeSingleDeal.id || !dealID) && loggedInUser.id && activeSingleCompany.id) {
                let actionStub = 'default';
                if (get(history, 'location.pathname', '').includes('showings'))
                    actionStub = 'user-schedule';
                if (get(history, 'location.pathname', '').includes('docubox'))
                    actionStub = 'get-document';
                if (get(history, 'location.pathname', '').includes('contact'))
                    actionStub = 'message';
                if (get(history, 'location.pathname', '').includes('makeOffer'))
                    actionStub = 'make-offer';
                handleGetBuyerDeal({ id: propID, actionStub });
            }
        }
    }, [activeSingleProperty.id, loggedInUser, activeSingleCompany?.id]);
    useEffect(() => {
        if (activeSingleDeal.id) {
            handleGetScheduleVisit({
                id: activeSingleDeal.id,
                order: 'createdAt',
                direction: 'DESC',
            });
            const data2 = {
                id: activeSingleDeal.id,
                order: 'createdAt',
                direction: 'DESC',
                smallLoader: 'getBooking',
            };
            hanldeGetScheduleVisit(data2);
        }
    }, [activeSingleDeal.id]);
    useEffect(() => {
        if (propID && propID !== 'propertyLists') {
            const data = {
                fullVersion: false,
                smallLoader: 'property',
                id: propID,
            };
            handleGetActiveSingleProperty(data);
        }
    }, [propID]);
    // FUNCTION TO RESET FORM ON CHANGE SECTIONS - EXCEPT FOR FACTS AND ACHIEVEMENT FLOW
    useEffect(() => {
        if (get(history, 'location.pathname', '').includes('deal') && !get(history, 'location.pathname', '').includes('closing')) {
            history.push({ pathname: `/buyer/${propID}/closing` });
        }
    }, [history.location.pathname]);
    const sectionClass = get(history, 'location.pathname', '/').split('/');
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `dashboardContainer mt-0 mt-md-3 dis-f jc-b ${sectionClass[2]}`, id: "dashboard" },
            React.createElement("div", { className: "w-perc-100" },
                React.createElement(Suspense, { fallback: "" },
                    React.createElement(Routes, null,
                        React.createElement(Route, { path: "/home", element: React.createElement(DashboardHome, null) }),
                        React.createElement(Route, { path: "/property/*", element: React.createElement(PropertyBuyerDashboard, null) }),
                        React.createElement(Route, { path: "/energy/*", element: React.createElement(Energy, null) }),
                        React.createElement(Route, { path: "/scheduleVisit/*", element: React.createElement(ScheduleVisit, null) }),
                        React.createElement(Route, { path: "/docubox", element: React.createElement(DocumentsBuyer, null) }),
                        React.createElement(Route, { path: "/financing", element: React.createElement(Financing, null) }),
                        React.createElement(Route, { path: "/offer/*", element: React.createElement(SingleOffer, null) }),
                        React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: `/buyer/${propID}/home` }) })))))));
};
const mapStateToProps = (state) => ({
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
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
    hanldeGetScheduleVisit: bindActionCreators(getScheduleVisit, dispatch),
    hanldeSetScheduleVisit: bindActionCreators(setScheduleVisit, dispatch),
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
    handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
    handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
    handleGetScheduleVisit: bindActionCreators(getScheduleVisit, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Dashboard);
