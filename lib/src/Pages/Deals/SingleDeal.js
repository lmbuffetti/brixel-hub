import React, { useEffect, useRef, useState } from 'react';
import { BrixelAvatar, BrixelButtonIcon, BrixelButtonSecondary, BrixelDropdownMini, BrixelIcon, BrixelSingleTag, FactsOptions, Helpers, useOutsideAlerter, } from '@brixel-io/brixel-components';
import { change } from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { getActiveSingleDeal, getActiveSingleOffer, getScheduleVisit, saveActiveSingleDeal, setActiveSingleDeal, updateMultipleDeals, } from '../../actions/DealActions';
import { getHistoryListings, setDealHistoryListings, setDealOwnerHistoryListings } from '../../actions/HistoryActions';
import { getNoteListings, setDealNoteListings } from '../../actions/NoteActions';
// COMPONENTS
import ProgressBar from '../../components/ProgressBar';
import Timeline from '../../components/Timeline';
import translateTo from '../../utils/translation';
import TimelineStubs from '../../resources/Utilities/timelineActionStubs';
import { feedbackInvoled, feedbackReason } from '@brixel-io/brixel-components/dist/constants/FeedbackEmail';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import ReviewOfferModal from './Offer/ReviewOfferModal';
import { setModal } from '../../actions/CommonActions';
const SingleDeal = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const { activeSingleOffer, activeSingleDeal, activeSingleProperty, activeSinglePropertyDeals, activeSingleVisitFeedback, getActiveDeal, getDealNotes, getHistoryList, handleGetActiveSingleOffer, handleGetScheduleVisit, handleSaveDeal, handleSaveMultipleDeal, handleSetModal, lang, scheduleVisit, setActiveSingleDealHistory, setActiveSingleDealOwnerHistory, setDealNotes, windowDimensions, } = props;
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [winnerId, setWinnerId] = useState('');
    const [showFullFeedback, setShowFullFeedback] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const { factsOptions, } = FactsOptions;
    const propID = get(match, 'propID', null);
    const dealID = get(match, 'dealID', null);
    const optionsRef = useRef(null);
    useEffect(() => () => {
        setDealNotes([]);
        setActiveSingleDealHistory({});
        setActiveSingleDealOwnerHistory({});
    }, []);
    useEffect(() => {
        if (activeSingleDeal) {
            const payloadNote = {
                object: dealID,
                type: 'deal',
                resultsPerPage: 50,
                offset: 0,
                text: '',
                order: '',
                direction: 'DESC',
                company: '',
                smallLoader: 'dealNote',
            };
            const payloadDealHistory = {
                parent: dealID,
                type: 'deal',
                resultsPerPage: 50,
                offset: 0,
                order: 'createdAt',
                direction: 'DESC',
                actionStubs: TimelineStubs.Deal,
                smallLoader: 'getDealHistory',
            };
            getActiveDeal({ id: dealID, property: propID, smallLoader: 'getDeal' });
            getDealNotes(payloadNote);
            getHistoryList(payloadDealHistory);
            handleGetScheduleVisit({
                id: dealID,
                order: 'createdAt',
                direction: 'DESC',
                smallLoader: 'getScheduleVisit',
            });
        }
    }, [activeSingleDeal.id]);
    useEffect(() => {
        if (dealID) {
            handleGetActiveSingleOffer({ id: dealID, smallLoader: 'getOffer' });
        }
    }, [dealID]);
    useEffect(() => {
        forEach(activeSinglePropertyDeals, (el) => {
            if (has(el, 'winner') && el.winner === true)
                setWinnerId(el.id);
        });
    }, [activeSinglePropertyDeals]);
    const saveData = () => {
        const deal = cloneDeep(activeSingleDeal);
        const data = {
            actionStubs: TimelineStubs.Deal,
            id: deal.id,
            data: deal,
            propID: propID,
            smallLoader: 'saveData',
        };
        // For now we still dont use the diff object (TODO: API ticket)
        // diff(initialValues, formValue)
        handleSaveDeal(data);
    };
    const archiveDeal = () => {
        if (activeSingleDeal.newSeller === true)
            set(activeSingleDeal, 'newSeller', false);
        set(activeSingleDeal, 'active', !activeSingleDeal.active);
        saveData();
    };
    const newDeal = () => {
        set(activeSingleDeal, 'newSeller', !activeSingleDeal.newSeller);
        saveData();
    };
    const winDeal = () => {
        set(activeSingleDeal, 'winner', !get(activeSingleDeal, 'winner', false));
        const data = [{
                id: activeSingleDeal.id,
                data: activeSingleDeal,
                smallLoader: '',
            }];
        if (winnerId && (winnerId !== activeSingleDeal.id)) {
            const deals = cloneDeep(activeSinglePropertyDeals);
            const idExistWinner = deals.findIndex((deal) => deal.id === winnerId);
            if (activeSinglePropertyDeals[idExistWinner]) {
                set(activeSinglePropertyDeals[idExistWinner], 'winner', false);
                data.push({
                    id: activeSinglePropertyDeals[idExistWinner].id,
                    data: activeSinglePropertyDeals[idExistWinner],
                    smallLoader: 'saveData',
                });
                // For now we still dont use the diff object (TODO: API ticket)
                // diff(initialValues, formValue)
            }
        }
        handleSaveMultipleDeal({
            deals: data,
            smallLoader: 'saveData',
        });
    };
    const progressChange = (value) => {
        find(factsOptions.progressBarDealsOptions, (element) => {
            if (element.value === value) {
                const response = element.value;
                set(activeSingleDeal, 'stage', response);
                saveData();
            }
        });
    };
    const OptionsDropdown = (data) => {
        if ((get(data, 'showMobile', null) && get(windowDimensions, 'width', 0) <= 1024) || (get(data, 'showDesktop', null) && get(windowDimensions, 'width', 0) > 1024)) {
            const className = get(data, 'className', '');
            const btnClass = get(data, 'btnClass', '');
            return (React.createElement("div", { className: `pos-r mr-2 ${className}`, ref: optionsRef },
                React.createElement(BrixelButtonIcon, { icon: "options-vertical", className: `ml-a ${btnClass}`, theme: "text", ghost: true, onClick: () => {
                        setOptionsOpen(!optionsOpen);
                    } }),
                optionsOpen && (React.createElement(BrixelDropdownMini, { rightAligned: true, topOffset: 48, links: [
                        {
                            label: translateTo(get(activeSingleDeal, 'winner', null) ? 'Remove winner' : 'Winner', lang),
                            clickFunc: () => { winDeal(); setOptionsOpen(false); },
                            className: 'txtPrimary400',
                        },
                        {
                            label: translateTo(get(activeSingleDeal, 'newSeller', null) ? 'Mark as read' : 'Mark as new', lang),
                            clickFunc: () => { newDeal(); setOptionsOpen(false); },
                            className: 'txtPrimary400',
                        },
                        {
                            label: translateTo(get(activeSingleDeal, 'active', null) ? 'Archive' : 'Unarchive', lang),
                            clickFunc: () => { archiveDeal(); setOptionsOpen(false); },
                            className: 'txtPrimary400',
                        },
                    ] }))));
        }
        return null;
    };
    const getOfferTextColor = () => {
        if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'accepted')
            return 'Green400';
        if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'pending')
            return 'Yellow400';
        if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'rejected')
            return 'Red400';
        return 'Text900';
    };
    const onClickReview = () => {
        handleSetModal({
            clickOutsideToClose: false,
            bodyClassColor: 'p-0 dis-fl-col',
            bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
            state: true,
            small: true,
            hideHeader: true,
            layout: 'fullscreen',
            component: React.createElement(ReviewOfferModal, { closeModal: () => handleSetModal({}) }),
        });
    };
    // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
    useOutsideAlerter(optionsRef, {
        action: 'function',
        func: () => {
            setOptionsOpen(false);
        },
    });
    const getStatusStyle = (type) => {
        switch (type) {
            case 'accepted':
                return {
                    icon: 'check',
                    color: 'green',
                    saturation: 400,
                };
            case 'pending':
                return {
                    icon: 'clock',
                    color: 'yellow',
                    saturation: 400,
                };
            case 'rejected':
                return {
                    icon: 'close-small',
                    color: 'red',
                    saturation: 400,
                };
            default: return {
                icon: '',
                color: '',
                saturation: 0,
            };
        }
    };
    setTimeout(() => { setIsReady(true); }, 300);
    return (React.createElement(React.Fragment, null, isReady ? (React.createElement(React.Fragment, null, activeSingleDeal.id && (React.createElement("div", { className: "dashboardContainer mt-0 mt-md-3 dis-f jc-b", id: "dashboard" },
        React.createElement("div", { className: "w-perc-100" },
            React.createElement("div", { className: "single-deal dis-fl-col max-w-fix-1024" },
                React.createElement("div", { className: "actions dis-fl-row jc-b pb-2" },
                    React.createElement("div", { className: "pt-2 pr-1 pr-lg-0 pt-lg-0" },
                        React.createElement(BrixelButtonIcon, { icon: "arrow-left-small", ghost: true, theme: "text", onClick: () => history.push(`/${propID}/prospects`) })),
                    React.createElement(OptionsDropdown, { className: "pt-2 pt-lg-0", showMobile: true, showDesktop: true })),
                React.createElement("div", { className: "top dis-fl-row jc-b mb-0 mb-lg-4 pb-3" },
                    React.createElement("div", { className: "user dis-fl-row col-md-7" },
                        React.createElement(BrixelAvatar, { size: 'M', avatarImg: activeSingleDeal.user?.avatarUrl, name: Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', ''), get(activeSingleDeal, 'user.lastName', ''), get(activeSingleDeal, 'user.name', '')) === 'No Name' ? get(activeSingleDeal, 'user.email', '') : Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', ''), get(activeSingleDeal, 'user.lastName', ''), get(activeSingleDeal, 'user.name', '')), profileId: get(activeSingleDeal.user, 'id', '') }),
                        React.createElement("div", { className: "title dis-fl-col ml-2" },
                            React.createElement("span", { className: `name dis-b fsize-500 fweight-500 ${get(activeSingleDeal, 'user.name') ? 'txtText900' : 'txtText500'}` }, Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', ''), get(activeSingleDeal, 'user.lastName', ''), get(activeSingleDeal, 'user.name', ''))),
                            React.createElement("div", { className: "dis-f" },
                                get(activeSingleDeal, 'user.email', null) && (React.createElement("a", { className: "txtText900 link mr-2", target: "_blank", rel: "noopener noreferrer", href: `mailto:${activeSingleDeal.user.email}?subject=From Brixel` }, activeSingleDeal.user.email)),
                                get(activeSingleDeal, 'winner', null) && (React.createElement("span", { className: "cardTag winner dis-f jc-c a-c green mr-2" }, translateTo('Winner', lang))),
                                !activeSingleDeal.active && (React.createElement("span", { className: "cardTag" }, translateTo('Archived', lang)))),
                            get(activeSingleDeal, 'user.phone.number', null) ? (React.createElement("span", { className: "value txtText900" }, Helpers.telephoneFormat(activeSingleDeal.user.phone))) : (React.createElement("span", { className: "value txtText900" }, "-"))))),
                React.createElement("div", { className: "mid dis-fl-row-md flex-wrap mb-lg-0 pos-r" },
                    React.createElement("div", { className: "left dis-fl-col col-md-6 p-0" },
                        React.createElement("div", { className: "detail-part dis-fl-row" },
                            React.createElement("div", { className: "dis-fl-col col-6 p-0" }))),
                    React.createElement("div", { className: "right dis-fl-col col-md-6 p-0" },
                        React.createElement("div", { className: "mb-3 hide" },
                            React.createElement("span", { className: "overline mb-2" }, translateTo('Showings', lang)),
                            React.createElement(BrixelButtonSecondary, { className: "p-0 as-fs", label: translateTo('Add date', lang), rounded: true, bgTransparent: true, leftIcon: "calendar", onClick: () => '' })),
                        React.createElement("div", { className: "hide" },
                            React.createElement("span", { className: "overline mb-2" }, translateTo('Offers', lang)),
                            React.createElement(BrixelButtonSecondary, { className: "p-0 as-fs", label: translateTo('Add offer', lang), rounded: true, bgTransparent: true, leftIcon: "money", onClick: () => '' })))),
                React.createElement("div", { className: "bottom dis-fl-col dis-fl-row-sm w-perc-100 h-perc-100 py-3 pos-r p-0" },
                    React.createElement(Timeline, { isDeal: true, className: "col-12 col-sm-6 p-0" }),
                    React.createElement("div", { className: "dis-fl-col-md col-12 col-sm-6 px-0" },
                        React.createElement("div", { className: "progress dis-fl-col mb-5" },
                            React.createElement("div", null, activeSingleDeal.id && (React.createElement(ProgressBar, { lang: lang, className: "mb-3", options: factsOptions.progressBarDealsOptions, progressState: has(activeSingleDeal, 'stage') ? activeSingleDeal.stage : '', readOnly: false, updateProgressBarFunc: (value) => progressChange(value) })))),
                        React.createElement("div", { className: "visit dis-fl-col mb-5" },
                            React.createElement("span", { className: "overline dis-b mb-3" }, translateTo('Visit', lang)),
                            React.createElement("div", null,
                                scheduleVisit?.length === 0 && (React.createElement("div", { className: "dis-f a-c p-small-12 brdText100 brdSmall brdRadius bgWhite" },
                                    React.createElement(BrixelIcon, { icon: "calendar", background: "blue", saturation: 50, color: "blue", saturationTxt: 400, className: "mr-2" }),
                                    React.createElement("span", { className: `txt${getOfferTextColor()} fweight-500` }, translateTo('No visit requests yet', lang)))),
                                scheduleVisit && scheduleVisit.map((slots, i) => (React.createElement("div", { className: "visit-container mb-2 brdRadius bgWhite brdText100 brdSmall dis-fl-col", key: `visitsList${i.toString()}` },
                                    slots.buyerAvailability.length > 0 && !slots?.visit?.date && (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "dis-fl-row p-small-12" },
                                            React.createElement(BrixelIcon, { icon: "calendar", background: "blue", saturation: 50, color: "blue", saturationTxt: 400, className: "mr-2 as-fs" }),
                                            React.createElement("div", { className: "dis-fl-col jc-b" },
                                                React.createElement("h6", { className: "mb-1" }, translateTo('Suggested Dates:', lang)),
                                                slots.buyerAvailability.map((visit, f) => (React.createElement("div", { key: `visit${f.toString()}`, className: "dis-f a-c" },
                                                    React.createElement("span", { className: "px-1" }, " \u2022 "),
                                                    React.createElement("span", { className: "mr-1" }, visit.start ? DateTime.fromMillis(visit.start, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                    }).toFormat('dd LLL yyyy') : null),
                                                    React.createElement("span", null, visit.start ? DateTime.fromMillis(visit.start, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                    }).toFormat('HH:mm') : null),
                                                    React.createElement("span", { className: "mx-snall-4" }, "-"),
                                                    React.createElement("span", null, visit.end ? DateTime.fromMillis(visit.end, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                    }).toFormat('HH:mm') : null)))))))),
                                    slots?.visit?.date && (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "dis-fl-row jc-fs px-small-12 pt-small-12" },
                                            React.createElement(BrixelIcon, { icon: "calendar", background: "blue", saturation: 50, color: "blue", saturationTxt: 400, className: "mr-2 as-fs" }),
                                            React.createElement("div", { className: "dis-fl-row a-c jc-b" },
                                                React.createElement("div", { className: "dis-fl-col" },
                                                    React.createElement("h6", null, translateTo('Visit Date:', lang)),
                                                    React.createElement("div", { className: "dis-f a-c jc-b" },
                                                        React.createElement("p", { className: "txtGreen400 fweight-500" }, DateTime.fromMillis(slots.visit.date, {
                                                            locale: lang,
                                                            zone: slots.visit.timezone,
                                                        }).toFormat('dd LLL yyyy, HH:mm')))))),
                                        React.createElement("div", { className: "pb-small-12 px-small-12 ml-7" },
                                            React.createElement("hr", { className: "lighter my-2" }),
                                            React.createElement("h6", null, translateTo('Confirmation:', lang)),
                                            React.createElement("div", null,
                                                React.createElement("div", { className: "dis-f a-c jc-b" },
                                                    React.createElement("span", null, translateTo('Buyer', lang)),
                                                    React.createElement(BrixelIcon, { icon: getStatusStyle(slots.buyerStatus).icon, color: getStatusStyle(slots.buyerStatus).color, saturation: getStatusStyle(slots.buyerStatus).saturation })),
                                                React.createElement("div", { className: "dis-f a-c jc-b" },
                                                    React.createElement("span", null, translateTo('Seller', lang)),
                                                    React.createElement(BrixelIcon, { icon: getStatusStyle(slots.sellerStatus).icon, color: getStatusStyle(slots.sellerStatus).color, saturation: getStatusStyle(slots.sellerStatus).saturation })))),
                                        slots.buyerAvailability.length > 0 && (React.createElement("div", { className: "pb-small-12 px-small-12 ml-7" },
                                            React.createElement("hr", { className: "lighter my-2" }),
                                            React.createElement("div", { className: "dis-fl-col jc-b" },
                                                React.createElement("h6", { className: "mb-1" }, translateTo('Suggested Dates:', lang)),
                                                slots.buyerAvailability.map((visit, f) => (React.createElement("div", { key: `visit${f.toString()}`, className: "dis-f a-c" },
                                                    React.createElement("span", { className: "px-1" }, " \u2022 "),
                                                    React.createElement("span", { className: "mr-1" }, visit.start ? DateTime.fromMillis(visit.start, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                    }).toFormat('dd LLL yyyy') : null),
                                                    React.createElement("span", null, visit.start ? DateTime.fromMillis(visit.start, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                    }).toFormat('HH:mm') : null),
                                                    React.createElement("span", { className: "mx-snall-4" }, "-"),
                                                    React.createElement("span", null, visit.end ? DateTime.fromMillis(visit.end, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                    }).toFormat('HH:mm') : null)))))))))))))),
                        React.createElement("div", { className: "feedback dis-fl-col mb-5" },
                            React.createElement("div", { className: "dis-fl-row a-c jc-b mb-3" },
                                React.createElement("span", { className: "overline" }, translateTo('Feedback', lang))),
                            React.createElement("div", { className: "brdRadius bgWhite brdText100 brdSmall pos-r dis-fl-col p-small-12 w-perc-100" },
                                React.createElement("div", { className: "dis-fl-row jc-b" },
                                    React.createElement("div", { className: "dis-f a-c" },
                                        React.createElement(BrixelIcon, { icon: "calendar", background: typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 'green' : 'light', saturation: typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 100 : 100, color: typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 'green' : 'text', saturationTxt: typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 400 : 900, className: "mr-2" }),
                                        typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? (React.createElement("span", { className: activeSingleVisitFeedback?.isInterested ? 'txtGreen400' : 'txtRed400' }, activeSingleVisitFeedback?.isInterested ? translateTo('Interested 👍', lang) : translateTo('Not interested 👎', lang))) : (React.createElement("span", null, "No feedback")))),
                                typeof activeSingleVisitFeedback?.isInterested === 'boolean' && (React.createElement("div", { className: "dis-fl-col" },
                                    typeof activeSingleVisitFeedback?.isInterested !== 'undefined' && (React.createElement("div", { className: `mt-1 dis-fl-row jc-b ${showFullFeedback === true ? 'mb-2' : ''}` },
                                        React.createElement("span", { className: "txtText900 fsize-300" },
                                            translateTo('Details:', lang),
                                            " "),
                                        React.createElement(BrixelIcon, { iconSize: "small", icon: `${showFullFeedback === true ? 'arrow-simple-up' : 'dropdown'}`, className: "txtText900 cur-poi pr-1", onClick: (e) => {
                                                if (e)
                                                    e.preventDefault();
                                                setShowFullFeedback(!showFullFeedback);
                                            } }))),
                                    showFullFeedback && (React.createElement("div", { className: "dis-fl-col fsize-300 txtText600" },
                                        activeSingleVisitFeedback?.reasons && activeSingleVisitFeedback?.reasons.length > 0 && (React.createElement("div", null,
                                            React.createElement("span", { className: "mr-1" }, "Reasons:"),
                                            activeSingleVisitFeedback?.reasons.filter(el => el !== 'other').map((reason, index) => (React.createElement(React.Fragment, { key: `reason${index.toString()}` },
                                                index > 0 && (React.createElement("span", null, ", ")),
                                                React.createElement("span", { key: `reason${index.toString()}` }, feedbackReason.find((itm) => (itm.value === reason))?.label)))),
                                            activeSingleVisitFeedback?.reasons.filter(el => el === 'other').length === 1 && activeSingleVisitFeedback?.reasonsOther && (React.createElement(React.Fragment, null,
                                                ",",
                                                React.createElement(React.Fragment, null, "\u00A0"),
                                                React.createElement("span", null,
                                                    translateTo('Other: ', lang),
                                                    activeSingleVisitFeedback?.reasonsOther))))),
                                        activeSingleVisitFeedback?.involvedPurchaseProperty && (React.createElement("div", null,
                                            React.createElement("span", { className: "mr-1" }, "Current status:"),
                                            React.createElement("span", null, feedbackInvoled.find((itm) => itm.value === activeSingleVisitFeedback.involvedPurchaseProperty)?.label))),
                                        activeSingleVisitFeedback?.note && (React.createElement("div", null,
                                            React.createElement("span", { className: "mr-1" }, "Note:"),
                                            React.createElement("span", null, activeSingleVisitFeedback.note))))))))),
                        React.createElement("div", { className: "offers dis-fl-col mb-5" },
                            React.createElement("span", { className: "overline dis-b mb-3" }, translateTo('Offer', lang)),
                            React.createElement("div", { className: "brdRadius brdSmall brdText100 pos-r dis-fl-col bgWhite p-2 w-perc-100" },
                                !activeSingleOffer.id && (React.createElement("div", { className: "dis-fl-row jc-b" },
                                    React.createElement("div", { className: "dis-f a-c" },
                                        React.createElement(BrixelIcon, { icon: "money", background: "yellow", saturation: 50, color: "yellow", saturationTxt: 800, className: "mr-1" }),
                                        React.createElement("span", { className: 'fweight-500' }, translateTo('No offer yet', lang))))),
                                activeSingleOffer.id && (React.createElement("div", { className: `dis-fl-col fsize-300 txt${getOfferTextColor()}` },
                                    React.createElement(BrixelSingleTag, { status: activeSingleOffer?.status, message: {
                                            pending: 'Pending',
                                            accepted: 'Accepted',
                                            rejected: 'Rejected',
                                        }, lang: lang }),
                                    React.createElement("h5", { className: `mt-2 ff-mono ${Helpers.getDataByStatus(activeSingleOffer).color}` },
                                        React.createElement("span", { className: "mr-1" }, activeSingleOffer.currency || 'CHF'),
                                        React.createElement("span", null, Helpers.formatNumberValue(activeSingleOffer.amount, activeSingleOffer.currency))),
                                    activeSingleOffer.updatedAt && (React.createElement("p", { className: "txtText600 fsize-300" }, DateTime.fromMillis(activeSingleOffer.updatedAt, {}).toFormat('dd LLL yyyy, HH:mm'))),
                                    React.createElement("div", { className: "dis-f a-c mt-2" },
                                        React.createElement(BrixelButtonSecondary, { className: "mr-2", rounded: true, label: translateTo('View details', lang), onClick: () => history.push(`/${propID}/prospect/${dealID}/offer`) }),
                                        activeSingleOffer?.status === 'pending' && (React.createElement(BrixelButtonPrimary, { className: "", rounded: true, label: translateTo('Review', lang), onClick: () => onClickReview() }))))))))))))))) : (React.createElement("div", { className: "dashboardContainer mt-0 mt-md-3", id: "dashboard" },
        React.createElement("div", { className: "pb-2" },
            React.createElement(BrixelButtonIcon, { icon: "arrow-left-small", ghost: true, theme: "text", onClick: () => history.push(`/${activeSingleProperty.id}/prospects`) })),
        React.createElement("div", { className: "dis-f mt-2 mt-lg-0 p-2 p-lg-0 mb-lg-4" },
            React.createElement("div", { className: "w-fix-40 h-fix-40 brdCircle skeletonBg" }),
            React.createElement("div", { className: "div" },
                React.createElement("div", { className: "w-fix-96 skeletonBg h-fix-24 ml-2" }),
                React.createElement("div", { className: "w-fix-192 skeletonBg h-fix-16 mt-1 ml-2" }))),
        React.createElement("div", { className: "py-2 px-lg-0 dis-f flex-wrap mb-lg-2 pos-r" },
            React.createElement("div", { className: "col-12 col-lg-7 pr-0" },
                React.createElement("div", { className: "w-fix-96 skeletonBg h-fix-24" }),
                React.createElement("div", { className: "dis-f" },
                    React.createElement("div", { className: "mt-2 dis-fl-col w-perc-50" },
                        React.createElement("div", { className: "w-fix-96 skeletonBg h-fix-8" }),
                        React.createElement("div", { className: "w-fix-192 skeletonBg h-fix-16 mt-1" })),
                    React.createElement("div", { className: "mt-2 dis-fl-col w-perc-50" },
                        React.createElement("div", { className: "w-fix-96 skeletonBg h-fix-8" }),
                        React.createElement("div", { className: "w-fix-192 skeletonBg h-fix-16 mt-1" })))),
            React.createElement("div", { className: "col-5 px-lg-0 mt-3 mt-lg-0" },
                React.createElement("div", { className: "w-fix-96 skeletonBg h-fix-24" }),
                React.createElement("div", { className: "dis-f jc-b" },
                    React.createElement("div", { className: "mt-2 dis-fl-col" },
                        React.createElement("div", { className: "w-fix-192 skeletonBg h-fix-16 mt-1" }))))),
        React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-b py-3 px-2 mt-3 mt-lg-5 h-perc-50" },
            React.createElement("div", { className: "w-perc-100 w-perc-sm-50 pr-sm-2 h-perc-50" },
                React.createElement("div", { className: "w-fix-96 skeletonBg h-fix-8" }),
                React.createElement("div", { className: "w-perc-100 brdRadius skeletonBg h-perc-100 mt-3" })),
            React.createElement("div", { className: "w-perc-100 w-perc-sm-50 pl-sm-2 h-perc-50" },
                React.createElement("div", { className: "w-fix-96 skeletonBg h-fix-8" }),
                React.createElement("div", { className: "w-perc-100 brdRadius skeletonBg h-perc-100 mt-3" })))))));
};
const mapStateToProps = (state) => ({
    activeSingleOffer: state?.deal?.activeSingleOffer || {},
    activeSingleVisitFeedback: get(state, 'property.activeScheduleVisit[0].visitFeedback', {}),
    activeDealHistoryList: get(state, 'deal.activeSingleDealHistory', {}),
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
    isSuperAdmin: get(state, 'common.superAdmin', false),
    lang: get(state, 'common.language', 'en'),
    scheduleVisit: get(state, 'deal.scheduleVisit', []),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    getActiveDeal: bindActionCreators(getActiveSingleDeal, dispatch),
    getDealNotes: bindActionCreators(getNoteListings, dispatch),
    getHistoryList: bindActionCreators(getHistoryListings, dispatch),
    handleGetActiveSingleOffer: bindActionCreators(getActiveSingleOffer, dispatch),
    handleGetScheduleVisit: bindActionCreators(getScheduleVisit, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleSaveDeal: bindActionCreators(saveActiveSingleDeal, dispatch),
    handleSaveMultipleDeal: bindActionCreators(updateMultipleDeals, dispatch),
    setActiveSingleDealHistory: bindActionCreators(setDealHistoryListings, dispatch),
    setActiveSingleDealOwnerHistory: bindActionCreators(setDealOwnerHistoryListings, dispatch),
    setDeal: bindActionCreators(setActiveSingleDeal, dispatch),
    setDealNotes: bindActionCreators(setDealNoteListings, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(SingleDeal);
