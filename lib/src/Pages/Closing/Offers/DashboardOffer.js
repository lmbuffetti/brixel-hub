import get from 'lodash/get';
import React, { Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { getOfferListings } from '../../../actions/DealActions';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';
const OffersList = lazyWithRetry(() => import('./OffersList'));
const OfferDetail = lazyWithRetry(() => import('./OfferDetail'));
const DashboardOffer = (props) => {
    const { activeSingleProperty, handleGetOfferListings, } = props;
    const match = useParams();
    // URL PARAMS
    const propID = get(match, 'propID', null);
    useEffect(() => {
        const data = {
            id: propID,
        };
        if (propID)
            handleGetOfferListings(data);
    }, [activeSingleProperty]);
    return (React.createElement(Suspense, { fallback: React.createElement(Loading, { isLoading: true }) },
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(OffersList, null) }),
            React.createElement(Route, { path: "/:dealID", element: React.createElement(OfferDetail, null) }),
            React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: `/${propID}/closing` }) }))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetOfferListings: bindActionCreators(getOfferListings, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(DashboardOffer);
