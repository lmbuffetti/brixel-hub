import React, { useEffect, useState } from 'react';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelTabs, Helpers } from '@brixel-io/brixel-components';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import { bindActionCreators, compose } from 'redux';
import { preventExitFromScreen } from '../../actions/CommonActions';
import { saveActiveSingleDeal, setActiveSingleDeal } from '../../actions/DealActions';
import { getPageDeals, setPageDeals } from '../../actions/PropertyActions';
import DealsCard from '../../components/Cards/DealsCard';
import DealsTitle from '../../components/DealsTitle';
import FilterBar from '../../components/FilterBar';
import { getCookie, setCookie } from '../../utils/helpers';
import translateTo from '../../utils/translation';
import SectionMobileTitle from '../../components/SectionMobileTitle';
const Deals = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleProperty, activeSinglePropertyDeals, handleGetPageDeals, handleSaveDeal, notification, resetSingleDeal, setActiveSinglePropertyDeals, setPreventExit, smallLoader, lang, windowDimensions, } = props;
    const [processedDeals, setProcessedDeals] = useState();
    const [filteredDeals, setFilteredDeals] = useState();
    const [emptyDeals, setEmptyDeals] = useState(false);
    const [activeTab, setActiveTab] = useState();
    const [filterStatus, setFilterStatus] = useState({
        status: getCookie('brixelFilterDeal') || 'all',
    });
    const propID = get(match, 'propID', null);
    useEffect(() => {
        if (windowDimensions.width <= 1024 && !activeTab) {
            setActiveTab('interested');
        }
        else {
            setActiveTab(undefined);
        }
    }, [windowDimensions]);
    useEffect(() => () => {
        setActiveSinglePropertyDeals([]);
    }, []);
    // GET THE BUYERS REQUEST FOR CURRENT PROPERTY
    useEffect(() => {
        if (propID) {
            const data = {
                id: propID,
                smallLoader: 'loadDeal',
            };
            handleGetPageDeals(data);
        }
    }, [propID]);
    const processDeals = (list) => {
        if (activeSinglePropertyDeals) {
            const deals = {
                interested: get(list, 'interested.data', []),
                visit: get(list, 'visit.data', []),
                offer: get(list, 'offer.data', []),
            };
            if (list) {
                forEach(list, (deal) => {
                    if (deal.stage === 'Interested') {
                        deals.interested.push(deal);
                    }
                    if (deal.stage === 'Visit') {
                        deals.visit.push(deal);
                    }
                    if (deal.stage === 'Offer') {
                        deals.offer.push(deal);
                    }
                });
            }
            const listsDeal = {
                interested: deals.interested,
                visit: deals.visit,
                offer: deals.offer,
            };
            if (listsDeal.interested.length === 0 &&
                listsDeal.visit.length === 0 &&
                listsDeal.offer.length === 0) {
                setEmptyDeals(true);
            }
            else {
                setEmptyDeals(false);
            }
            setProcessedDeals(listsDeal);
            if (!filteredDeals)
                setFilteredDeals(listsDeal);
        }
    };
    useEffect(() => {
        processDeals(activeSinglePropertyDeals);
    }, [activeSinglePropertyDeals]);
    useEffect(() => {
        // Special notification close for alert status
        const checkDoneStatus = notification.filter((item) => item.type === 'done');
        if (checkDoneStatus.length > 0) {
            setPreventExit(false);
        }
    }, [notification]);
    const openDeal = (id) => {
        resetSingleDeal({});
        history.push(`/${activeSingleProperty.id}/prospect/${id}`);
    };
    const createNewDeal = () => {
        resetSingleDeal({});
        history.push(`/${activeSingleProperty.id}/prospects/newDeal`);
    };
    const saveDeal = (deal, type = '') => {
        const data = {
            id: deal.id,
            data: deal,
            type,
        };
        handleSaveDeal(data);
    };
    const archiveDeal = (id, _stage, parent) => {
        if (processedDeals) {
            const deals = cloneDeep(processedDeals[parent]);
            find(deals, (element, key) => {
                if (element.id === id) {
                    set(deals[key], 'active', !processedDeals[parent][key].active);
                    set(deals[key], 'newSeller', false);
                    saveDeal(deals[key], 'archive');
                }
            });
        }
    };
    const moveDeal = (card) => {
        const moveDealID = card.clone.firstChild.getAttribute('data-id');
        const newDealList = card.to.offsetParent.getAttribute('data-id');
        const capitalNewDealList = newDealList.charAt(0).toUpperCase() + newDealList.slice(1);
        let findDeal;
        Object.keys(activeSinglePropertyDeals).forEach(key => {
            if (!findDeal)
                findDeal = activeSinglePropertyDeals[key].data.find((deal) => deal.id === moveDealID);
        });
        if (findDeal?.stage?.toLowerCase() !== newDealList.toLowerCase()) {
            const data = {
                id: moveDealID,
                data: {
                    stage: capitalNewDealList,
                },
                type: 'reloadDeals',
            };
            handleSaveDeal(data);
        }
    };
    const applyFilter = (_text, _type, _direction, _company, filterModal) => {
        if (processedDeals) {
            const filterDeals = processedDeals || {};
            const selected = {};
            Object.keys(filterDeals).forEach((key) => {
                const isNew = has(filterModal, 'status') && filterModal.status === 'newSeller';
                const isAll = has(filterModal, 'status') && filterModal.status === 'all';
                const isArchived = has(filterModal, 'status') && filterModal.status === 'archived';
                let filteredDealsByStatus = filterDeals[key].filter((deal) => deal.newSeller === isNew || deal.active === isArchived);
                if (isAll) {
                    filteredDealsByStatus = filterDeals[key].filter((deal) => deal.active === true || deal.active === false);
                }
                else if (isArchived) {
                    filteredDealsByStatus = filterDeals[key].filter((deal) => deal.active === false);
                }
                if (isNew)
                    filteredDealsByStatus = filteredDealsByStatus.filter((deal) => deal.newSeller === true);
                selected[key] = filteredDealsByStatus;
            });
            setFilteredDeals(selected);
            setFilterStatus(filterModal);
            setCookie('brixelFilterDeal', get(filterModal, 'status', 'all'));
        }
    };
    useEffect(() => {
        applyFilter(null, null, null, null, filterStatus);
    }, [processedDeals, filterStatus]);
    const mobileTabsDeal = (val) => {
        setActiveTab(val);
    };
    return (React.createElement("div", { className: "deals-container dis-f jc-fs h-perc-lg-100 a-t", id: "dealsDashaboard" },
        React.createElement("div", { className: "w-perc-100 dis-fl-col" },
            React.createElement("div", { className: "dealsListings" },
                React.createElement("div", { className: "listings-header bg-white" },
                    React.createElement("div", { className: "dis-f jc-b" },
                        React.createElement("div", { className: "dis-f jc-fe-md w-perc-100" },
                            React.createElement("div", { className: "dis-fl-row a-b zIndex3 jc-b w-perc-100" },
                                React.createElement(SectionMobileTitle, { title: "Prospects" }),
                                React.createElement("h3", { className: "mb-3 hide dis-b-lg" }, translateTo('Prospects', lang)),
                                React.createElement("div", { className: "dis-fl-row a-c zIndex3 mb-2 mb-lg-0" },
                                    !emptyDeals && (React.createElement(FilterBar, { lang: lang, activeSortDirection: "", activeSortOrderType: "", filterDeals: filterStatus, applyFilter: (text, type, direction, company, filterModal) => applyFilter(text, type, direction, company, filterModal), dealsFilter: true })),
                                    React.createElement(BrixelButtonIcon, { icon: "plus", className: "ml-1", onClick: () => createNewDeal(), label: translateTo('Add Deal', lang), tooltipWidth: "88" }))))),
                    windowDimensions.width <= 768 && (React.createElement(BrixelTabs, { activeTab: activeTab, className: "mt-3", labels: [translateTo('Interested', lang), translateTo('Visit', lang), translateTo('Offer', lang)], clicksList: ['interested', 'visit', 'offer'], onClick: (val) => mobileTabsDeal(val), fullWidth: true }))),
                React.createElement("div", { className: `dealsWrapper mt-2 ${emptyDeals ? 'emptyDeals' : ''}` },
                    React.createElement("div", { className: "titleContainer" }, filteredDeals && Object.keys(filteredDeals).map((key, i) => (React.createElement(React.Fragment, null, (key === activeTab || windowDimensions.width > 768) && (React.createElement("div", { key: `fltDls_${i.toString()}`, className: "rightCol" },
                        React.createElement("div", { className: "pr-2" },
                            React.createElement(DealsTitle, { lang: lang, title: translateTo(key, lang), total: get(filteredDeals, `${key}`, []).length })))))))),
                    React.createElement("div", { className: "dealsContainer" },
                        React.createElement("div", { className: "topParent" },
                            React.createElement("div", { className: "rightCol parentScroll" },
                                React.createElement("div", { className: "scrollContent" },
                                    activeSinglePropertyDeals && emptyDeals && smallLoader.loadDeal === false && (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "emptyMessage min-h-fix-224 dis-f w-perc-100 jc-c" },
                                            React.createElement("div", { className: "max-w-fix-544 ta-c p-3 dis-fl-col a-c" },
                                                React.createElement("h5", null, translateTo('No deals yet?', lang)),
                                                React.createElement("p", { className: "p-3 txtText900" }, translateTo('Your deals will appear as soon as any interested buyer interacts with your property. Make sure to publish your Brixel Page and your listings to receive deals.', lang)),
                                                React.createElement(BrixelButtonPrimary, { label: translateTo('Manage listings', lang), rounded: true, onClick: () => history.push(`/${activeSingleProperty.id}/marketing/page`) }))))),
                                    filteredDeals && Object.keys(filteredDeals).map((key, o) => (React.createElement(React.Fragment, { key: `fltDls_${o.toString()}` }, (key === activeTab || windowDimensions.width > 768) && (React.createElement("div", { className: `singleCol ${key}`, "data-id": key },
                                        React.createElement(ReactSortable, { disabled: windowDimensions.width <= 1024, group: "groupName", list: filteredDeals[key], setList: () => '', onEnd: (card) => moveDeal(card) }, filteredDeals[key].filter((dl) => dl.active).map((singleDeal, k) => (React.createElement(React.Fragment, { key: `fltDls_${k.toString()}` },
                                            React.createElement("div", { className: windowDimensions.width > 768 ? 'cur-all-scroll' : '', key: `SingleDeal${k.toString()}`, "data-id": key },
                                                React.createElement("div", { "data-id": singleDeal.id, id: singleDeal.id, className: "list-item pos-r" },
                                                    React.createElement(DealsCard, { probability: singleDeal?.stageProbability, id: singleDeal.id, avatarImg: singleDeal.user.avatarUrl, archOnClick: () => archiveDeal(singleDeal.id, singleDeal.stage, key), archived: !singleDeal.active, className: `${!singleDeal.active ? 'bgText25' : ''} dealCard`, date: DateTime.fromMillis(singleDeal.updatedAt, { locale: lang }).toFormat('ccc, dd LLL yy, H:mm'), isNew: get(singleDeal, 'newSeller'), isWinner: get(singleDeal, 'winner'), isQualified: get(singleDeal, 'qualified'), name: Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name) === 'No Name' ? get(singleDeal.user, 'email', '') : Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name), offer: has(singleDeal, 'closing.stageOffer') ? singleDeal.closing.stageOffer : {}, parentOnClick: () => openDeal(singleDeal.id), profileId: get(singleDeal, 'user.id', ''), stage: singleDeal.stage }))))))),
                                        filteredDeals[key].filter((dl) => !dl.active).map((singleDeal, k) => (React.createElement(React.Fragment, { key: `SingleDeal${k.toString()}` },
                                            k === 0 && (React.createElement("div", { className: "mt-2 mb-1 dis-fl-row" },
                                                React.createElement("span", { className: "fsize-200 txtText200" }, translateTo('Archived', lang)),
                                                React.createElement("span", { className: 'fsize-200 pl-1 txtText200' },
                                                    " (",
                                                    filteredDeals[key].filter((dl) => !dl.active).length,
                                                    ")"))),
                                            React.createElement("div", { className: "list-item pos-r archived" },
                                                React.createElement(DealsCard, { id: singleDeal.id, avatarImg: singleDeal.user.avatarUrl, archOnClick: () => archiveDeal(singleDeal.id, singleDeal.stage, key), archived: !singleDeal.active, className: `${!singleDeal.active ? 'bgText25' : ''} dealCard`, date: DateTime.fromMillis(singleDeal.updatedAt, { locale: lang }).toFormat('dd LLL yy, H:mm'), isNew: get(singleDeal, 'newSeller'), isWinner: get(singleDeal, 'winner'), isQualified: get(singleDeal, 'qualified'), name: Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name) === 'No Name' ? get(singleDeal.user, 'email', '') : Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name), offer: has(singleDeal, 'closing.stageOffer') ? singleDeal.closing.stageOffer : {}, parentOnClick: () => openDeal(singleDeal.id), profileId: get(singleDeal, 'user.id', ''), stage: singleDeal.stage })))))))))))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', null),
    formValue: get(state, 'brixelForm.Property.values', {}),
    initialValues: get(state, 'property.activeSingleProperty', {}),
    lang: get(state, 'common.language', 'en'),
    notification: get(state, 'common.notification', []),
    smallLoader: get(state, 'common.isSmallLoading', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetPageDeals: bindActionCreators(getPageDeals, dispatch),
    handleSaveDeal: bindActionCreators(saveActiveSingleDeal, dispatch),
    resetSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
    setActiveSinglePropertyDeals: bindActionCreators(setPageDeals, dispatch),
    setPreventExit: bindActionCreators(preventExitFromScreen, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Deals);
