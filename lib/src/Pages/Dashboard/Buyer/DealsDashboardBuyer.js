import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import lazyWithRetry from '../../../components/LazyWithRetry';
const OfferDetail = lazyWithRetry(() => import('../../Closing/Offers/OfferDetail'));
const DealsDashboardBuyer = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleDeal, } = props;
    // URL PARAMS
    const propID = get(match, 'propID', null);
    const getFact = () => last(history.location.pathname.split('/')) || '';
    const link = get(history, 'location.pathname', '').split('/');
    useEffect(() => {
        if ((link[link.length - 1] === 'closing' || !link[link.length - 1] || link[link.length - 1] === 'undefined') && activeSingleDeal.id) {
            history.push(`/buyer/${propID}/closing/${activeSingleDeal.id}`);
        }
    }, [activeSingleDeal.id]);
    return (React.createElement("div", { className: `${get(history, 'location.pathname', '').includes('closing/') ? '' : 'secondLevel'}` },
        React.createElement("div", null,
            (link[link.length - 1] === 'deal' || !link[link.length - 1]) && (React.createElement(OfferDetail, { isBuyer: true })),
            (getFact() && getFact().length > 20)
                ? (React.createElement(Suspense, { fallback: "" },
                    React.createElement(Routes, null,
                        React.createElement(Route, { path: "/:dealID", element: React.createElement(OfferDetail, { isBuyer: true }) })))) : (React.createElement("div", null)))));
};
const mapStateToProps = (state) => ({
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    lang: get(state, 'common.language', 'en'),
});
export default compose(connect(mapStateToProps, null))(DealsDashboardBuyer);
