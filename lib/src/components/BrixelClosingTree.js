import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { BrixelButtonSecondary, BrixelIcon, Helpers } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import ReviewOffer from '../Pages/Closing/Offers/ReviewOffer';
import { setModal } from '../actions/CommonActions';
import ClosingTree from './Skeleton/ClosingTree';
const BrixelClosingTree = (props) => {
    const sectionNumber = new Array(5).fill('');
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleClosing, activeSingleDeal, activeSingleOffer, className = '', dealID, handleSetModal, isBuyer = false, lang, propID, windowDimensions, } = props;
    // STATE
    const userType = isBuyer ? 'buyer' : 'seller';
    const [showTabSection, setShowTabSection] = useState(null);
    const [collapsed, setCollapsed] = useState({});
    //const [collapsedNum, setCollapsedNum] = useState(null);
    // TODO: add active/inactive lock logic
    const onClickOffer = useCallback((action) => {
        if (action === 'add') {
            history.push(`/packageFlow/${propID}/makeOffer`);
        }
        else {
            handleSetModal({
                state: true,
                classname: 'manageOffer',
                component: React.createElement(ReviewOffer, null),
                small: true,
                layout: 'xlarge',
            });
        }
    }, []);
    const closingDefaultText = [
        {
            name: 'offer',
            onClick: (action) => onClickOffer(action),
            stageName: 'stageOffer',
            subtitle: get(activeSingleOffer, 'offer.amount', 0) > 0 ?
                `<span class="ff-mono fsize-400">${get(activeSingleOffer, 'offer.currency', 0)}</span><span class="ff-mono fsize-400 ml-1">${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', 'EUR'))}</span>` :
                translateTo('Add your first offer to start.', lang),
            title: translateTo('Offer', lang),
        },
        {
            name: 'identification',
            button: (action) => onClickOffer(action),
            stageName: 'stageIdentification',
            subtitle: translateTo('Submit ID and personal information.', lang),
            title: translateTo('Identification', lang),
        },
        {
            name: 'lock',
            onClick: (action) => onClickOffer(action),
            stageName: 'stageLock',
            subtitle: translateTo('Reserve the property for closing.', lang),
            title: translateTo('Lock', lang),
            statusText: translateTo('Lock', lang),
        },
        {
            name: 'finance',
            onClick: (action) => onClickOffer(action),
            stageName: 'stageFinance',
            subtitle: translateTo('Plan early for your financial situation.', lang),
            title: translateTo('Finance', lang),
            statusText: translateTo('Checked', lang),
        },
        {
            name: 'contract',
            onClick: (action) => onClickOffer(action),
            stageName: 'stageContract',
            subtitle: translateTo('Approve the terms of the contract.', lang),
            title: translateTo('Contract', lang),
            statusText: translateTo('Approved', lang),
        },
        {
            name: 'notary',
            onClick: (action) => onClickOffer(action),
            stageName: 'stageNotary',
            subtitle: translateTo('Sign the contract at the notary.', lang),
            title: translateTo('Notary', lang),
            statusText: translateTo('Signed', lang),
        },
    ];
    const [closingStage, setClosingStage] = useState(closingDefaultText);
    const status = {
        accepted: {
            icon: 'check-small-fill',
            label: translateTo('Accepted', lang),
            color: 'green',
            colorText: 'txtGreen400',
        },
        rejected: {
            icon: 'close-circle',
            label: translateTo('Rejected', lang),
            color: 'red',
            colorText: 'txtRed400',
        },
        pending: {
            icon: 'check-small',
            label: translateTo('Pending', lang),
            color: 'yellow',
            colorText: 'txtYellow400',
        },
        default: {
            icon: 'check-small',
            label: translateTo('', lang),
            color: 'text',
            colorText: 'txtText700',
        },
    };
    const statusIdentification = (usrType) => {
        if (get(activeSingleClosing, `stageIdentification.${usrType}.completedBy`, null))
            return 'accepted';
        if (get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length > 0 && !get(activeSingleClosing, `stageIdentification.${usrType}.completedBy`, null))
            return 'pending';
        return 'default';
    };
    useEffect(() => {
        if (windowDimensions.width < 1024 && !showTabSection) {
            setShowTabSection('buyer');
        }
        else if (windowDimensions.width >= 1024) {
            setShowTabSection(null);
        }
    }, [windowDimensions]);
    useEffect(() => {
        const stageText = cloneDeep(closingStage);
        if (get(activeSingleDeal, 'id', null)) {
            if (get(activeSingleOffer, 'offer.status', null) === 'rejected') {
                stageText[0].subtitle = `<span class="fsize-400 txtRed400">${get(activeSingleOffer, 'offer.currency', 0)}</span><span class="fsize-400 ml-1 txtRed400">${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}</span><span class="ml-1 txtRed400">${translateTo('(Rejected)', lang)}</span>`;
            }
            else if (get(activeSingleOffer, 'offer.amount', 0) > 0) {
                stageText[0].subtitle = `<span class="fsize-400">${get(activeSingleOffer, 'offer.currency', 0)}</span><span class="fsize-400 ml-1">${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}</span>`;
            }
            if (statusIdentification(userType) === 'pending' && (!showTabSection || (showTabSection === userType))) {
                stageText[1].subtitle = translateTo('Identification currently being verified', lang);
            }
            else {
                stageText[1].subtitle = translateTo('Submit ID and personal information.', lang);
            }
        }
        setClosingStage(stageText);
    }, [activeSingleOffer, showTabSection]);
    if (!activeSingleDeal.id) {
        return (React.createElement("div", { className: `closing-tree max-w-fix-1200 dis-fl-col w-perc-100 ${className}` },
            React.createElement("div", { className: "body dis-fl-row" },
                React.createElement("div", { className: "phases dis-fl-col h-perc-100 w-perc-100" }, sectionNumber.map((_item, i) => (React.createElement("div", { key: `sctNm_${i.toString()}`, className: `offer-container ${get(activeSingleClosing, 'stageOffer.active', null) ? 'active' : 'locked'}` },
                    React.createElement("div", { className: "hide dis-b-md" },
                        React.createElement(ClosingTree, { className: "bgWhite my-3 shadow-3dp brdRadius" })))))))));
    }
    const onCollapse = (stageName) => {
        setCollapsed({ ...collapsed, [stageName]: !get(collapsed, stageName, false) });
    };
    const personsInfo = (usrType, classNamePersons = '') => (React.createElement(React.Fragment, null, get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length > 0 && (React.createElement("div", { className: `dis-f a-c txtGreen400 brdRadius w-perc-100 jc-b py-1 px-2 ${classNamePersons} ${(isBuyer && usrType === 'buyer') || (!isBuyer && usrType === 'seller') ? '' : 'filterGray'} ${statusIdentification('seller') === 'accepted' || statusIdentification('buyer') === 'accepted' ? 'disabled' : ''} bgBlue50x25 personsListIdentification` },
        React.createElement("div", { className: "dis-f a-c wrapName" },
            React.createElement(BrixelIcon, { className: "mr-1", rounded: true, background: "white", saturation: 0, color: "green", icon: "account" }),
            React.createElement("span", { className: "personsName" }, get(activeSingleClosing, `stageIdentification.${usrType}.persons[0].fullName`, ''))),
        React.createElement("div", { className: "dis-f a-c" },
            get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length > 1 && (React.createElement("span", { className: "mr-1" },
                "+",
                get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length - 1)),
            ((isBuyer && usrType === 'buyer') || (!isBuyer && usrType === 'seller')) && (React.createElement(BrixelIcon, { color: "green", icon: "pencil", className: "editIcon", onClick: () => history.push(`/packageFlow/${propID}/${dealID}/closing/${usrType}/identification/`) })))))));
    const buyerSection = (stage, id) => {
        switch (stage) {
            case 'stageOffer':
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead p-2 h-fix-56" },
                        React.createElement("div", { className: "secStatus" }, get(activeSingleClosing, 'stageOffer.active', null) === false ? (React.createElement(BrixelIcon, { icon: "locked", color: "text", className: "mb-1" })) : (React.createElement(React.Fragment, null, get(activeSingleOffer, 'offer.amount', 0) > 0 && get(activeSingleOffer, 'offer.status', null) !== 'rejected' ? (React.createElement("div", { className: "dis-f a-c jc-b w-perc-100" },
                            React.createElement("div", { className: "dis-f a-c" },
                                React.createElement(BrixelIcon, { icon: "check-small-fill", color: "green", className: "mr-1", iconWidth: "w-fix-24" }),
                                React.createElement("span", null, translateTo('Buyer', lang))),
                            React.createElement("span", { className: "fsize-300 fsize-lg-400 txtGreen400" }, translateTo('Sent', lang)))) : (React.createElement(React.Fragment, null,
                            React.createElement(BrixelIcon, { icon: "check-small", className: "mr-1", color: "text", iconWidth: "w-fix-24" }),
                            React.createElement("span", null, translateTo('Buyer', lang)))))))),
                    React.createElement("div", { className: "secDetails brdText50 closed" },
                        React.createElement("div", { className: "p-2" },
                            get(activeSingleOffer, 'offer.amount', 0) > 0 &&
                                get(activeSingleOffer, 'offer.status', null) !== 'rejected' && (React.createElement(React.Fragment, null, get(activeSingleOffer, 'offer.createdAt', null) && (React.createElement("p", { className: "fsize-300 txtText600" }, DateTime.fromMillis(activeSingleOffer.offer.createdAt, { locale: lang }).toFormat('d LLL yyyy, H:mm'))))),
                            (!get(activeSingleOffer, 'offer.status', null) || (get(activeSingleOffer, 'offer.status', '') !== 'pending' &&
                                get(activeSingleOffer, 'offer.status', '') !== 'accepted')) &&
                                isBuyer && (React.createElement(BrixelButtonSecondary, { rounded: true, className: "", label: translateTo('Add offer', lang), onClick: () => onClickOffer('add') }))))));
            case 'stageIdentification':
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead p-2 h-fix-56" },
                        React.createElement("div", { className: "secStatus" }, get(activeSingleClosing, 'stageIdentification.active', null) === false ? (React.createElement("div", { className: "dis-f jc-b" },
                            React.createElement("span", null, translateTo('Buyer', lang)),
                            React.createElement(BrixelIcon, { icon: "locked", color: "text", iconWidth: "w-fix-24" }))) : (React.createElement("div", { className: "dis-f jc-b w-perc-100" },
                            React.createElement("div", { className: "dis-f jc-b w-perc-100" },
                                React.createElement("div", { className: "" },
                                    get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length > 0 ? (React.createElement(BrixelIcon, { icon: status[statusIdentification('buyer')].icon, color: status[statusIdentification('buyer')].color, iconWidth: "w-fix-24", className: "mr-1" })) : (React.createElement(BrixelIcon, { icon: "check-small", color: "text", className: "mr-1", iconWidth: "w-fix-24" })),
                                    React.createElement("span", null, translateTo('Buyer', lang))),
                                React.createElement("div", { className: "div" },
                                    statusIdentification('buyer') === 'accepted' && (React.createElement("span", { className: "ml-1 txtGreen400 fsize-300 fsize-lg-400" }, translateTo('Verified', lang))),
                                    statusIdentification('buyer') === 'pending' && (React.createElement("span", { className: "ml-1 txtYellow400 fsize-300 fsize-lg-400" }, translateTo('Pending', lang))))),
                            get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length === 0 && (React.createElement("div", { className: "" }, isBuyer && (React.createElement("span", { className: `${status[statusIdentification('buyer')].colorText}` }, translateTo('Pending', lang))))))))),
                    React.createElement("div", { className: "secDetails" },
                        React.createElement("div", { className: "p-2" }, get(activeSingleClosing, 'stageIdentification.active', null) !== false && (React.createElement("div", null, get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length === 0 ? (React.createElement("div", null, isBuyer && (React.createElement(BrixelButtonSecondary, { rounded: true, label: translateTo('Add buyer', lang), onClick: () => history.push(`/packageFlow/${propID}/${dealID}/closing/buyer/identification/`) })))) : (React.createElement(React.Fragment, null,
                            personsInfo('buyer', ''),
                            " "))))))));
            case 'stageFinance':
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead dis-f jc-b p-2 h-fix-56" }, get(activeSingleClosing, 'stageFinance.active', null) ? (React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.buyer.status`, null) ? 'check-small-fill' : 'check-small', color: get(activeSingleClosing, `${stage}.buyer.status`, null) ? 'green' : 'text', className: "mr-1", iconWidth: "w-fix-24" }),
                            React.createElement("span", null, translateTo('Buyer', lang))),
                        get(activeSingleClosing, `${stage}.buyer.status`, null) !== true ? (React.createElement("span", { className: "txtYellow400" }, translateTo('Pending', lang))) : (React.createElement("span", { className: "txtGreen400" }, closingDefaultText[id].statusText)))) : (React.createElement(React.Fragment, null,
                        React.createElement("span", null, translateTo('Buyer', lang)),
                        React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked', color: "text", iconWidth: "w-fix-24" })))),
                    React.createElement("div", { className: "secDetails" })));
            default:
                return (React.createElement(React.Fragment, null, get(activeSingleClosing, `${stage}.active`, null) ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead dis-f jc-b p-2 h-fix-56" },
                        React.createElement("div", null,
                            React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.buyer.status`, null) ? 'check-small-fill' : 'check-small', color: get(activeSingleClosing, `${stage}.buyer.status`, null) ? 'green' : 'text', className: "mr-1", iconWidth: "w-fix-24" }),
                            React.createElement("span", null, translateTo('Buyer', lang))),
                        get(activeSingleClosing, `${stage}.buyer.status`, null) !== true ? (React.createElement("span", { className: "txtYellow400" }, translateTo('Pending', lang))) : (React.createElement("span", { className: "txtGreen400" }, closingDefaultText[id].statusText))),
                    React.createElement("div", { className: "secDetails" }, get(activeSingleClosing, `${stage}.completedBySeller.completedAt`, null) ? (React.createElement("span", { className: "fsize-100 txtText600" }, DateTime.fromMillis(activeSingleClosing[stage].completedBySeller.completedAt, { locale: lang }).toFormat('d LLL yyyy, H:mm'))) : (React.createElement(React.Fragment, null))))) : (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead dis-f jc-b p-2 h-fix-56" },
                        React.createElement("span", null, translateTo('Buyer', lang)),
                        React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked', color: "text", iconWidth: "w-fix-24" })),
                    React.createElement("div", { className: "secDetails" })))));
        }
    };
    const sellerSection = (stage, id) => {
        switch (stage) {
            case 'stageOffer':
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead dis-f jc-b h-fix-56" },
                        React.createElement("div", { className: "secStatus p-2 w-perc-100" }, get(activeSingleClosing, 'stageOffer.active', null) === false ? (React.createElement(BrixelIcon, { icon: "locked", color: "text", iconWidth: "w-fix-16" })) : (React.createElement(React.Fragment, null, !get(activeSingleOffer, 'offer.status', null) || !status[get(activeSingleOffer, 'offer.status', '')] ? (React.createElement(React.Fragment, null,
                            React.createElement(BrixelIcon, { icon: "check-small", className: "mr-1", color: "text", iconWidth: "w-fix-24" }),
                            React.createElement("span", null, translateTo('Seller', lang)))) : (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "dis-f a-c jc-b w-perc-100" },
                                React.createElement("div", { className: "dis-f a-c" },
                                    React.createElement(BrixelIcon, { icon: status[get(activeSingleOffer, 'offer.status', '')].icon, color: status[get(activeSingleOffer, 'offer.status', '')].color, className: "mr-1", iconWidth: "w-fix-24" }),
                                    React.createElement("span", null, translateTo('Seller', lang))),
                                React.createElement("span", { className: `${status[get(activeSingleOffer, 'offer.status', '')].colorText} fsize-300 fsize-lg-400` }, translateTo(status[get(activeSingleOffer, 'offer.status', '')].label, lang)))))))),
                        get(activeSingleClosing, 'stageOffer.active', null) !== false && (React.createElement("div", { className: "collExBtn p-2 dis-f a-c brdSmallLeft brdText50" },
                            React.createElement(BrixelIcon, { icon: collapsed['stageOffer'] ? 'dropdown-open' : 'dropdown-close', color: "text", onClick: () => onCollapse('stageOffer') })))),
                    React.createElement("div", { className: "secDetails closed" },
                        React.createElement("div", { className: "p-2" }, get(activeSingleClosing, 'stageOffer.active', null) !== false && (React.createElement(React.Fragment, null, !get(activeSingleOffer, 'offer.status', null) || !status[get(activeSingleOffer, 'offer.status', '')] ? (React.createElement(React.Fragment, null)) : (React.createElement(React.Fragment, null,
                            get(activeSingleOffer, 'offer.reviewedAt', null) && (React.createElement("p", { className: "fsize-300 txtText600" }, DateTime.fromMillis(activeSingleOffer.offer.reviewedAt, { locale: lang }).toFormat('d LLL yyyy, H:mm'))),
                            get(activeSingleOffer, 'offer.status', '') === 'pending' && !isBuyer && (React.createElement(BrixelButtonSecondary, { rounded: true, className: "", label: translateTo('Review offer', lang), onClick: () => onClickOffer('review') }))))))))));
            case 'stageIdentification':
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead dis-f jc-b h-fix-56" },
                        React.createElement("div", { className: "secStatus p-2 w-perc-100" }, get(activeSingleClosing, 'stageIdentification.active', null) === false ? (React.createElement("div", { className: "dis-f jc-b" },
                            React.createElement("span", null, translateTo('Seller', lang)),
                            React.createElement(BrixelIcon, { icon: "locked", color: "text", iconWidth: "w-fix-24" }))) : (React.createElement("div", { className: "dis-f jc-b" },
                            React.createElement("div", { className: "dis-f jc-b w-perc-100" },
                                React.createElement("div", { className: "" },
                                    get(activeSingleClosing, 'stageIdentification.seller.persons', []).length > 0 ? (React.createElement(BrixelIcon, { icon: status[statusIdentification('seller')].icon, color: status[statusIdentification('seller')].color, iconWidth: "w-fix-24", className: "mr-1" })) : (React.createElement(React.Fragment, null,
                                        React.createElement(BrixelIcon, { icon: status[statusIdentification('buyer')].icon, color: status[statusIdentification('buyer')].color, iconWidth: "w-fix-24", className: "mr-1" }))),
                                    React.createElement("span", null, translateTo('Seller', lang))),
                                React.createElement("div", { className: "" },
                                    statusIdentification('seller') === 'accepted' && (React.createElement("span", { className: "ml-1 txtGreen400" }, translateTo('Verified', lang))),
                                    statusIdentification('seller') === 'pending' && (React.createElement("span", { className: "ml-1 txtYellow400" }, translateTo('Pending', lang))))),
                            get(activeSingleClosing, 'stageIdentification.seller.persons', []).length === 0 && (React.createElement("div", null, !isBuyer && (React.createElement(React.Fragment, null,
                                React.createElement("span", { className: `${status[statusIdentification('buyer')].colorText} ml-1 fsize-300 fsize-lg-400` }, translateTo('Pending', lang))))))))),
                        React.createElement("div", { className: "collExBtn p-2 dis-f a-c brdSmallLeft brdText50" },
                            React.createElement(BrixelIcon, { icon: collapsed['stageIdentification'] ? 'dropdown-open' : 'dropdown-close', color: "text", onClick: () => onCollapse('stageIdentification') }))),
                    React.createElement("div", { className: "secDetails" },
                        React.createElement("div", { className: "p-2" }, get(activeSingleClosing, 'stageIdentification.active', null) !== false && (React.createElement("div", null,
                            get(activeSingleClosing, 'stageIdentification.seller.persons', []).length === 0 && (React.createElement("div", { className: "dis-f a-c jc-fe jc-fs-lg" }, !isBuyer && (React.createElement(BrixelButtonSecondary, { rounded: true, label: translateTo('Add seller', lang), onClick: () => history.push(`/packageFlow/${propID}/${dealID}/closing/seller/identification/`) })))),
                            personsInfo('seller', '')))))));
            case 'stageFinance':
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead dis-f jc-b h-fix-56" },
                        React.createElement("div", { className: "secStatus p-2 w-perc-100" },
                            React.createElement("div", { className: "dis-f a-c jc-b" }, get(activeSingleClosing, 'stageFinance.active', null) ? (React.createElement(React.Fragment, null,
                                React.createElement("div", null,
                                    React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.seller.status`, null) ? 'check-small-fill' : 'check-small', color: get(activeSingleClosing, `${stage}.seller.status`, null) ? 'green' : 'text', className: "mr-1", iconWidth: "w-fix-24" }),
                                    React.createElement("span", null, translateTo('Seller', lang))),
                                get(activeSingleClosing, `${stage}.seller.status`, null) !== true ? (React.createElement("span", { className: "txtYellow400" }, translateTo('Pending', lang))) : (React.createElement("span", { className: "txtGreen400" }, closingDefaultText[id].statusText)))) : (React.createElement(React.Fragment, null,
                                React.createElement("span", null, translateTo('Seller', lang)),
                                React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked', color: "text", iconWidth: "w-fix-24" }))))),
                        React.createElement("div", { className: "collExBtn p-2 dis-f a-c brdSmallLeft brdText50" },
                            React.createElement(BrixelIcon, { icon: collapsed[stage] ? 'dropdown-open' : 'dropdown-close', color: "text", onClick: () => onCollapse(stage) }))),
                    React.createElement("div", { className: "secDetails" })));
            default:
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "secHead dis-f jc-b h-fix-56" },
                        React.createElement("div", { className: "secStatus p-2 w-perc-100" },
                            React.createElement("div", { className: "dis-f a-c jc-b" }, get(activeSingleClosing, `${stage}.active`, null) ? (React.createElement(React.Fragment, null,
                                React.createElement("div", null,
                                    React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.seller.status`, null) ? 'check-small-fill' : 'check-small', color: get(activeSingleClosing, `${stage}.seller.status`, null) ? 'green' : 'text', className: "mr-1", iconWidth: "w-fix-24" }),
                                    React.createElement("span", null, translateTo('Seller', lang))),
                                get(activeSingleClosing, `${stage}.seller.status`, null) !== true ? (React.createElement("span", { className: "txtYellow400" }, translateTo('Pending', lang))) : (React.createElement("span", { className: "txtGreen400" }, closingDefaultText[id].statusText)))) : (React.createElement(React.Fragment, null,
                                React.createElement("span", null, translateTo('Seller', lang)),
                                React.createElement(BrixelIcon, { icon: get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked', color: "text", iconWidth: "w-fix-24" }))))),
                        get(activeSingleClosing, 'stageOffer.active', null) !== false && (React.createElement("div", { className: "collExBtn p-2 dis-f a-c brdSmallLeft brdText50" },
                            React.createElement(BrixelIcon, { icon: collapsed[stage] ? 'dropdown-open' : 'dropdown-close', color: "text", onClick: () => onCollapse(stage) })))),
                    React.createElement("div", { className: "secDetails" }, get(activeSingleClosing, `${stage}.active`, null) && get(activeSingleClosing, `${stage}.completedBySeller.completedAt`, null) ? (React.createElement("span", { className: "fsize-100 txtText600" }, DateTime.fromMillis(activeSingleClosing[stage].completedBySeller.completedAt, { locale: lang }).toFormat('d LLL yyyy, H:mm'))) : (React.createElement(React.Fragment, null, " ")))));
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `w-perc-100 max-w-fix-1200 ${className} closingTree` },
            React.createElement("div", { className: "dis-fl-row" },
                React.createElement("div", { className: "phases dis-fl-col h-perc-100 w-perc-100 txtText900" }, closingStage.map((stage, i) => (React.createElement("div", { className: `tableWrapper brdRadius mb-3 shadow-3dp ${get(activeSingleClosing, `${stage.stageName}.active`, null) ? 'active' : 'locked'} ${collapsed[stage.stageName] ? 'collapsed' : ''}`, key: `clsStg_${i.toString()}` },
                    React.createElement("div", { className: "tableItem" },
                        React.createElement("div", { className: "secHead p-2 h-fix-56 dis-f jc-b" },
                            React.createElement("div", { className: "" },
                                React.createElement("span", { className: "brdCircle bgGreen400 dis-if a-c jc-c h-fix-24 w-fix-24 txtWhite ta-c ff-mono fsize300" }, i + 1),
                                React.createElement("span", { className: "fsize-400 fweight-600 pl-1" }, stage.title)),
                            get(activeSingleClosing, `${stage.stageName}.active`, null) ? (React.createElement(React.Fragment, null)) : (React.createElement(React.Fragment, null, windowDimensions.width < 1026 && (React.createElement(BrixelIcon, { icon: "locked", color: "text", iconWidth: "w-fix-24" }))))),
                        React.createElement("div", { className: "secDetails closed" },
                            React.createElement("span", { className: "p-2 dis-b fsize-400", dangerouslySetInnerHTML: { __html: stage.subtitle } }))),
                    React.createElement("div", { className: "tableItem" }, buyerSection(stage.stageName, i)),
                    React.createElement("div", { className: "tableItem" }, sellerSection(stage.stageName, i))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleClosing: get(state, 'deal.activeSingleDeal.closing', {}),
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleOffer: get(state, 'deal.activeSingleDeal.closing.stageOffer', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    lang: get(state, 'common.language', 'en'),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(BrixelClosingTree);
