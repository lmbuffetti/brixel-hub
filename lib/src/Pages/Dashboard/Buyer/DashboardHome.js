import React, { useEffect, useState } from 'react';
import { BrixelButtonSecondary, Helpers, } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setModal, spinnerOff } from '../../../actions/CommonActions';
import { getUserSearchProfiles } from '../../../actions/SearchProfileActions';
import DashboardPropertyCard from '../../../components/Cards/DashboardPropertyCard';
import ArticlesBox from '../../../components/CraftCMS/ArticlesBox';
import BannerBox from '../../../components/CraftCMS/BannerBox';
import Loading from '../../../components/Loading';
import financingSvg from '../../../images/dashboard/financingDashboard.svg';
import { getCookie, setCookie } from '../../../utils/helpers';
import translateTo from '../../../utils/translation';
import BannerBuyerByStatus from '../../../components/BannerBuyerByStatus/BannerBuyerByStatus';
import { getActiveSingleOffer } from '../../../actions/DealActions';
const DashboardHome = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleOffer, activeSingleCompany, activeSingleProperty, dealID, handleGetActiveSingleOffer, isSmallLoading, lang, loggedInUser, scheduleVisit, userTypes = 'user', } = props;
    // STATE
    const [visitStatus, setVisitStatus] = useState();
    const [progressState, setProgressState] = useState({ step: 1 });
    const [showFirstWelcomMessage, setShowFirstWelcomMessage] = useState(false);
    const propID = get(match, 'propID', null);
    useEffect(() => {
        if (scheduleVisit) {
            const visitInfo = Helpers.getDataByStatus(scheduleVisit[0]);
            setVisitStatus(visitInfo);
        }
    }, [scheduleVisit && scheduleVisit[0]]);
    useEffect(() => {
        if (dealID) {
            handleGetActiveSingleOffer({ id: dealID, smallLoader: 'getOffer' });
        }
    }, [dealID]);
    useEffect(() => {
        if (getCookie('brixelFirstTime') === 'true') {
            setShowFirstWelcomMessage(true);
            setCookie('brixelFirstTime', 'false');
        }
    }, []);
    useEffect(() => {
        if (activeSingleProperty.sellerStatus === 'success')
            setProgressState({ step: 5 });
    }, [activeSingleProperty.sellerStatus, activeSingleProperty.progress]);
    // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
    if ((!activeSingleProperty.id && !userTypes) || isSmallLoading.getProperty) {
        return React.createElement(Loading, null);
    }
    return (React.createElement("div", { className: "rewards-container", id: "rewardsDashboard" },
        React.createElement("h4", { className: "mb-3 hide dis-b-lg fweight-600" },
            showFirstWelcomMessage ? (React.createElement("span", null, translateTo('Welcome back', lang))) : (React.createElement("span", null, translateTo('Welcome', lang))),
            React.createElement("span", { className: "ml-small-4" },
                " ",
                loggedInUser && (React.createElement(React.Fragment, null, loggedInUser.firstName)),
                " \uD83D\uDC4B ")),
        React.createElement("div", { className: "max-w-fix-1024 dis-fl-col pr-md-2" },
            React.createElement(React.Fragment, null,
                React.createElement(DashboardPropertyCard, { activeSingleCompany: activeSingleCompany, type: "buy", lang: lang }),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm" },
                    propID && (React.createElement(BannerBuyerByStatus, { className: "mr-1", history: history, lang: lang, propID: propID, status: visitStatus?.status || 'default', type: "visit", isLoading: !scheduleVisit })),
                    propID && (React.createElement(BannerBuyerByStatus, { className: "ml-sm-1", history: history, lang: lang, propID: propID, status: activeSingleOffer?.status || 'default', type: "offer", isLoading: !scheduleVisit }))),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm mt-sm-2" },
                    React.createElement("button", { onClick: () => history.push(`/buyer/${propID}/financing`), className: "shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-49 cur-poi bgWhite ta-l" },
                        React.createElement("div", { className: "cardWithBg", style: { backgroundImage: `url(${financingSvg})` } },
                            React.createElement("div", { className: "dis-fl-col max-w-perc-70" },
                                React.createElement("h5", { className: "fweight-600" }, translateTo('Check financing', lang)),
                                React.createElement("div", { className: "dis-f a-c w-perc-100 mt-1 mb-3" },
                                    React.createElement("p", { className: "pr-2 fsize-400 txtText700" }, translateTo('Assess whether you can afford your desired property.', lang))),
                                React.createElement(BrixelButtonSecondary, { rounded: true, onClick: () => '', className: "mt-a as-fs", label: translateTo('Calculate now', lang) }))))),
                progressState.step < 5 && (React.createElement(React.Fragment, null,
                    React.createElement(ArticlesBox, { activeSingleProperty: activeSingleProperty, activeSingleCompany: activeSingleCompany, lang: lang, placementSlug: "buyer-hub-home-onboarding-article" }),
                    React.createElement(BannerBox, { activeSingleCompany: activeSingleCompany, className: "mt-6", lang: lang, placementSlug: "buyer-hub-home-banner-bottom" }))),
                progressState.step === 5 && (React.createElement(React.Fragment, null,
                    React.createElement(BannerBox, { activeSingleCompany: activeSingleCompany, title: "Plane deine n\u00E4chsten Schritte.", className: "mt-6", lang: lang, placementSlug: "buyer-hub-home-sold-banner-top" }),
                    React.createElement(ArticlesBox, { activeSingleProperty: activeSingleProperty, activeSingleCompany: activeSingleCompany, lang: lang, placementSlug: "buyer-hub-home-sold-partner" }),
                    React.createElement(ArticlesBox, { activeSingleProperty: activeSingleProperty, activeSingleCompany: activeSingleCompany, lang: lang, placementSlug: "buyer-hub-home-sold-articles" }),
                    React.createElement(BannerBox, { activeSingleCompany: activeSingleCompany, className: "mt-6", lang: lang, placementSlug: "buyer-hub-home-sold-banner-bottom" })))))));
};
const mapStateToProps = (state) => ({
    activeSingleOffer: state?.deal.activeSingleOffer || null,
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    dealID: state?.deal?.activeSingleDeal?.id || null,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    offer: state?.deal?.activeSingleDeal?.closing?.stageOffer?.offer || {},
    scheduleVisit: get(state, 'deal.scheduleVisit', null),
    searchProfile: get(state, 'user.userSearchProfiles[0]', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetActiveSingleOffer: bindActionCreators(getActiveSingleOffer, dispatch),
    handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(DashboardHome);
