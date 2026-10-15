import React, { Suspense, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import translateTo from '../../../utils/translation';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';
const Page = lazyWithRetry(() => import('../../Marketing/Page'));
const Portals = lazyWithRetry(() => import('../../Marketing/Portals'));
const TermsAcceptance = lazyWithRetry(() => import('../../Marketing/TermsAcceptance'));
const MarketingDashboard = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const { lang, } = props;
    // useState
    const [isReady, setIsReady] = useState(false);
    // URL PARAMS
    const propID = get(match, 'propID', null);
    const getFact = () => last(history.location.pathname.split('/'));
    setTimeout(() => { setIsReady(true); }, 300);
    return (React.createElement(React.Fragment, null, isReady ? (React.createElement("div", { className: "listings-container dis-f jc-fs h-perc-lg-100 a-t", id: "listingsDashaboard" },
        React.createElement("div", { className: "w-perc-100" },
            React.createElement("h3", { className: "mb-3 hide dis-b-lg  fweight-600" }, translateTo('Marketing', lang)),
            React.createElement("div", { className: "dis-f a-t flex-wrap max-w-fix-1280" },
                React.createElement("div", { className: "pr-md-1 w-perc-100 w-perc-md-50" },
                    React.createElement(Page, null)),
                React.createElement("div", { className: "mt-2 mt-md-0 pl-md-1 w-perc-100 w-perc-md-50" },
                    React.createElement(Portals, null),
                    React.createElement(TermsAcceptance, null)))),
        getFact() !== 'marketing' && (React.createElement(Suspense, { fallback: React.createElement(Loading, { isLoading: true }) },
            React.createElement(Routes, null,
                React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: `/buyer/${propID}/marketing` }) })))))) : (React.createElement("div", { className: "listings-container h-perc-lg-100" },
        React.createElement("div", { className: "max-w-fix-1280 h-perc-100" },
            React.createElement("p", { className: "h-fix-24 hide dis-fl-row-lg h-fix-lg-40 mb-3 skeletonBg w-perc-15" }, " "),
            React.createElement("div", { className: "dis-fl-col dis-fl-row-lg" },
                React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 brdRadius skeletonBg mr-0 mr-lg-1 h-fix-304' }),
                React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 mt-2 mt-lg-0 brdRadius skeletonBg ml-0 ml-lg-1 h-fix-304' })),
            React.createElement("div", { className: "dis-fl-col dis-fl-row-lg mt-2" },
                React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 brdRadius mr-0 mr-lg-1 h-fix-304' }),
                React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 mt-2 mt-lg-0 brdRadius skeletonBg ml-0 ml-lg-1 h-fix-304' })))))));
};
const mapStateToProps = (state) => ({
    lang: get(state, 'common.language', 'en'),
});
export default compose(connect(mapStateToProps, null))(MarketingDashboard);
