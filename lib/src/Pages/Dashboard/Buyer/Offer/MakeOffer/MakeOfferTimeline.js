import React from 'react';
import '../../../../../styles/SCSS/components/makeOfferTimeline.scss';
import { BrixelSingleTag, Helpers, } from '@brixel-io/brixel-components';
import { DateTime } from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import translateTo from '../../../../../utils/translation';
import { setWindowDimensions } from '../../../../../actions/CommonActions';
import get from 'lodash/get';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const MakeOfferTimeline = ({ activeProofofFinancing, activeSingleOffer, buyerInfo, handleViewOffer, isSeller, lang, windowDimensions, }) => {
    const offerRow = (singleOffer, isArchived, index) => {
        let titleText = [''];
        let colorPrice = 'txtGreen400';
        // const type = singleOffer?.status && singleOffer.status !== 'pending' ? 'seller' : 'buyer'
        let icon = singleOffer?.status ? 'house' : 'key';
        const isActive = false;
        if (isSeller) {
            switch (singleOffer?.status) {
                case 'accepted':
                    titleText = ['You accepted the offer of:'];
                    colorPrice = 'txtGreen400';
                    icon = 'house';
                    break;
                case 'rejected':
                    titleText = ['You rejected the offer of:'];
                    colorPrice = 'txtRed400';
                    icon = 'house';
                    break;
                case 'pending':
                    titleText = [buyerInfo?.firstName, 'made an offer:'];
                    icon = 'key';
                    break;
                default:
                    titleText = [buyerInfo?.firstName, 'made an offer:'];
                    break;
            }
        }
        else {
            switch (singleOffer?.status) {
                case 'accepted':
                    titleText = ['The owner accepted your offer of:'];
                    colorPrice = 'txtGreen400';
                    icon = 'house';
                    break;
                case 'rejected':
                    titleText = ['The owner rejected your offer of:'];
                    colorPrice = 'txtRed400';
                    icon = 'house';
                    break;
                case 'pending':
                    titleText = ['You made an offer:'];
                    icon = 'key';
                    break;
                default:
                    titleText = ['You made an offer:'];
                    break;
            }
        }
        return (React.createElement("li", { className: `${icon}` },
            React.createElement("div", { className: "brdBottom dis-fl-col dis-fl-row-xl jc-b" },
                React.createElement("div", { className: 'w-perc-100' },
                    React.createElement("div", { className: 'dis-f a-t' },
                        React.createElement("div", { className: 'flex-1' },
                            titleText.map((text, f) => (React.createElement("span", { key: `title${f.toString()}`, className: `${singleOffer.status === 'accepted' ? `${colorPrice} fweight-700` : ''} ${isActive ? 'fweight-600' : 'fweight-500'} ${titleText.length > 1 && f === 0 ? 'fweight-600 mr-small-4' : ''}` }, translateTo(text, lang)))),
                            React.createElement("span", { className: `${singleOffer.status === 'accepted' ? `${colorPrice} fweight-700` : ''} ${isActive ? 'fweight-600' : 'fweight-500'}` }),
                            React.createElement("span", { className: `${colorPrice} fweight-700 pl-1` },
                                React.createElement("span", { className: "pr-1 ff-mono" }, singleOffer?.currency || 'CHF'),
                                React.createElement("span", { className: "ff-mono" }, Helpers.formatNumberValue(singleOffer?.amount, singleOffer?.currency || 'CHF')))),
                        isArchived && index === 0 && (React.createElement(BrixelSingleTag, { lang: lang, status: "archived", message: { archived: 'archived' } }))),
                    singleOffer?.noteBySeller && icon === 'house' && (React.createElement("p", { className: "fs-i txtText600" }, translateTo(singleOffer?.noteBySeller, lang))),
                    singleOffer?.noteByBuyer && icon === 'key' && (React.createElement("p", { className: "fs-i txtText600" }, translateTo(singleOffer?.noteByBuyer, lang))),
                    singleOffer?.historyCreatedAt && (React.createElement("p", { className: "fsize-300 txtText600" }, DateTime.fromMillis(singleOffer?.historyCreatedAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm')))),
                !isArchived && ((index === 0 && activeSingleOffer.status === 'pending') || index === 1 && activeSingleOffer.status !== 'pending') && (React.createElement("div", { className: 'mt-1 mt-xl-0 ml-0 ml-xl-2' },
                    React.createElement(BrixelButtonSecondary, { rounded: true, fullWidth: windowDimensions.width <= 1024, label: translateTo(isSeller && (activeSingleOffer.status === 'pending' || !activeSingleOffer.status) ? 'Review' : 'View', lang), onClick: () => handleViewOffer() }))))));
    };
    const offerTimelineGroup = () => {
        const defResult = [[]];
        if (activeSingleOffer.history) {
            let numArray = 0;
            activeSingleOffer.history.forEach((history, index) => {
                if (!defResult[numArray])
                    defResult[numArray] = [];
                defResult[numArray].push(history);
                if (activeSingleOffer.status === 'pending' && index % 2 === 0)
                    numArray++;
                else if (activeSingleOffer.status !== 'pending' && index > 0 && index % 2 !== 0)
                    numArray++;
            });
        }
        return defResult;
    };
    return (React.createElement("div", { className: "makeOfferTimeline" },
        offerTimelineGroup() && offerTimelineGroup().map((group, index) => (React.createElement("div", { className: "bgWhite brdRadius py-2 pl-4 pr-2 py-xl-3 pl-xl-5 pr-xl-3 mb-2 pos-r brdSmall brdText100", key: `historyParent${index.toString()}` },
            React.createElement("ul", { className: `session ${index > 0 ? 'opacity6' : ''}` }, group.map((history, subIndex) => (React.createElement(React.Fragment, { key: `history${subIndex.toString()}` }, offerRow(history, index > 0, subIndex)))))))),
        activeProofofFinancing?.id && (React.createElement("div", { className: "bgWhite brdRadius py-2 pl-4 pr-2 py-xl-3 pl-xl-5 pr-xl-3 mb-2 pos-r brdSmall brdText100" },
            React.createElement("ul", { className: 'session' },
                React.createElement("li", { className: 'key' },
                    React.createElement("div", { className: "brdBottom dis-fl-col dis-fl-row-xl jc-b" },
                        React.createElement("div", { className: "w-perc-100" },
                            React.createElement("div", { className: "flex-1" },
                                React.createElement("span", null, translateTo('You applied for a proof of financing with our partners', lang)),
                                React.createElement("p", { className: "txtText600" }, translateTo('They will review your information.', lang)),
                                activeProofofFinancing?.createdAt && (React.createElement("p", { className: "fsize-300 txtText600" }, DateTime.fromMillis(activeProofofFinancing?.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm'))))))))))));
};
const mapStateToProps = (state) => ({
    activeProofofFinancing: get(state, 'deal.activeProofofFinancing', {}),
    windowDimensions: get(state, 'common.windowDimensions', { width: 0, height: 0 }),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MakeOfferTimeline);
