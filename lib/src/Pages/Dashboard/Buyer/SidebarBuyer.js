import { BrixelIcon } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import sanitizeHtml from 'sanitize-html';
import { getHistoryListings } from '../../../actions/HistoryActions';
import { getNoteListings } from '../../../actions/NoteActions';
import { feedMessage } from '../../../resources/Dashboard/dashboardHistory';
import TimelineActionStubs from '../../../resources/Utilities/timelineActionStubs';
import { arrayMove } from '../../../utils/helpers';
const SidebarBuyer = (props) => {
    // PROPS
    const { activeSingleProperty, activeDealHistory, activeSinglePropertyDeals, activeCompanyPackages, activeSinglePropertyHistory, activeSingleUserHistory, handleGetHistoryFeed, lang, loggedInUser, } = props;
    const match = useParams();
    // STATE
    const [fullUpdates, setFullUpdates] = useState([]);
    const propID = get(match, 'propID', null);
    useEffect(() => {
        if (loggedInUser.id && activeSinglePropertyDeals.id) {
            const payloadPageHistory = {
                actionStubs: TimelineActionStubs.BuyerSidebarPage,
                parent: loggedInUser.id,
                child: propID,
                resultsPerPage: 50,
                offset: 0,
                order: 'createdAt',
                direction: 'DESC',
                smallLoader: 'getPageHistory',
                type: 'user',
            };
            handleGetHistoryFeed(payloadPageHistory);
            const payloadUserHistory = {
                actionStubs: TimelineActionStubs.BuyerSidebarUser,
                parent: loggedInUser.id,
                resultsPerPage: 50,
                offset: 0,
                order: 'createdAt',
                direction: 'DESC',
                smallLoader: 'getPageHistory',
                type: 'user',
            };
            handleGetHistoryFeed(payloadUserHistory);
            const payloadDealHistory = {
                actionStubs: TimelineActionStubs.BuyerSidebarDeal,
                parent: activeSinglePropertyDeals.id,
                resultsPerPage: 50,
                offset: 0,
                order: 'createdAt',
                direction: 'DESC',
                smallLoader: 'getPageHistory',
                type: 'deal',
            };
            handleGetHistoryFeed(payloadDealHistory);
        }
    }, [loggedInUser.id, propID, activeSinglePropertyDeals]);
    useEffect(() => {
        let mergedFeed = activeSinglePropertyHistory.concat(activeSingleUserHistory);
        mergedFeed = mergedFeed.concat(activeDealHistory);
        mergedFeed = orderBy(mergedFeed, ['createdAt'], ['desc']);
        let newId = 0;
        mergedFeed = mergedFeed.filter((item) => item.actionStub !== 'update-deal' || (item.actionStub === 'update-deal' && item?.meta?.name === 'visit'));
        mergedFeed.forEach((item, i) => {
            if (get(item, 'pinned', null)) {
                arrayMove(mergedFeed, i, newId);
                newId += 1;
            }
        });
        setFullUpdates(mergedFeed);
    }, [activeSinglePropertyHistory, activeSingleUserHistory, activeDealHistory]);
    const convertFeedMessage = (stub, type, history) => {
        if (activeSingleProperty.id) {
            const data = feedMessage(loggedInUser, history, activeCompanyPackages, activeSingleProperty, lang);
            if (data[stub] && data[stub][type])
                return data[stub][type];
            if (history.content)
                return data.note[type];
            return data.default[type];
        }
    };
    const parseNote = (text, isNote) => {
        if (isNote) {
            let textConverted = sanitizeHtml(text);
            textConverted = textConverted.replace(/(?:\r\n|\r|\n)/g, '<br>');
            const expMatch = /(\b(https?|):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/ig;
            const elementContent = textConverted.replace(expMatch, '<a target="_blank" href="$1">$1</a>');
            const newExpMatch = /(^|[^\\/])(www\.[\S]+(\b|$))/gim;
            const newContent = elementContent.replace(newExpMatch, '$1<a target="_blank" href="http://$2">$2</a>');
            return newContent;
        }
        return text;
    };
    return (React.createElement("div", { className: "seller-sidebar w-perc-100 max-w-fix-384 py-3 px-sm-2 px-3" },
        React.createElement("div", { className: "updates dis-fl-col" },
            React.createElement("p", { className: "fweight-600 txtText900 mb-2" }, translateTo('Feed', lang)),
            fullUpdates.map((history, i) => (React.createElement(React.Fragment, { key: `updt_${i.toString()}` }, history.actionStub && (React.createElement("div", { className: `update-item brdRadius brdSmall p-2 dis-f mb-2 ${convertFeedMessage(history.actionStub, 'className', history)}`, key: `fllUpd_${i.toString()}` },
                React.createElement(BrixelIcon, { background: convertFeedMessage(history.actionStub, 'colorBgIcon', history), saturation: convertFeedMessage(history.actionStub, 'colorIconSat', history), color: convertFeedMessage(history.actionStub, 'colorIcon', history), saturationTxt: convertFeedMessage(history.actionStub, 'colorBgIconSat', history), padding: "p-small-12", icon: convertFeedMessage(history.actionStub, 'icon', history), rounded: true, className: "as-fs", iconSize: "large" }),
                React.createElement("div", { className: "pl-2 desc" },
                    React.createElement("p", { className: "fsize-300 txtText800", dangerouslySetInnerHTML: { __html: translateTo(parseNote(convertFeedMessage(history.actionStub, 'message', history), typeof history.actionStub === 'undefined'), lang) } }),
                    get(history, 'createdAt', null) && !isNaN(+get(history, 'createdAt', '')) && (React.createElement("p", { className: "fsize-200 pt-small-4 txtText200" },
                        get(history, 'history[0].author.name', null) && (React.createElement(React.Fragment, null,
                            get(history, 'history[0].author.name', ''),
                            " -")),
                        history.createdAt && DateTime.fromMillis(history.createdAt, {
                            locale: lang,
                        }).toFormat('d LLL yyyy, H:mm'))))))))))));
};
const mapStateToProps = (state) => ({
    activeSinglePropertyDeals: get(state, 'deal.activeSingleDeal', {}),
    activeCompanyPackages: get(state, 'companies.activeSingleCompany.servicePackages', []),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyHistory: get(state, 'history.activeSinglePropertyHistory.data', []),
    activeDealHistory: get(state, 'deal.activeSingleDealHistory.data', []),
    activeSingleUserHistory: get(state, 'history.activeSingleUserHistory.data', []),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetHistoryFeed: bindActionCreators(getHistoryListings, dispatch),
    handleGetNoteListings: bindActionCreators(getNoteListings, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(SidebarBuyer);
