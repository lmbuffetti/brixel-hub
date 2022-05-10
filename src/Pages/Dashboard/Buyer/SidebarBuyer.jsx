/* eslint-disable react-hooks/exhaustive-deps */
import { BrixelIcon } from '@brixel/brixel-components';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import sanitizeHtml from 'sanitize-html';
import { getHistoryListings } from '../../../actions/HistoryActions';
import { getNoteListings } from '../../../actions/NoteActions';
import { feedMessage } from '../../../resources/dashboardHistory';
import timelineActionStubs from '../../../resources/timelineActionStubs';
import { arrayMove } from '../../../utils/helpers';

const SidebarBuyer = (props) => {
  // PROPS
  const {
    activeDealHistory,
    activeSinglePropertyDeals,
    activeCompanyPackages,
    activeSinglePropertyHistory,
    activeSingleUserHistory,
    handleGetHistoryFeed,
    loggedInUser,
  } = props;
  const match = useParams();
  // STATE
  const [fullUpdates, setFullUpdates] = useState([]);
  
  const propID = get(match, 'propID', null);
  
  useEffect(() => {
    if (loggedInUser.id && activeSinglePropertyDeals.id) {
      const payloadPageHistory = {
        actionStubs: timelineActionStubs.BuyerSidebarPage,
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
        actionStubs: timelineActionStubs.BuyerSidebarUser,
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
        actionStubs: timelineActionStubs.BuyerSidebarDeal,
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
    mergedFeed = mergedFeed.filter((item) => item.actionStub !== 'update-deal' || (item.actionStub === 'update-deal' && item.meta.name === 'visit'))
    mergedFeed.forEach((item, i) => {
      if (get(item, 'pinned', null)) {
        arrayMove(mergedFeed, i, newId);
        newId += 1;
      }
    });
    setFullUpdates(mergedFeed);
  }, [activeSinglePropertyHistory, activeSingleUserHistory, activeDealHistory]);

  const convertFeedMessage = (stub, type, history) => {
    const data = feedMessage(loggedInUser, history, activeCompanyPackages);
    if (data[stub] && data[stub][type]) return data[stub][type];
    if (history.content) return data.note[type];
    return data.default[type];
  };

  const parseNote = (text) => {
    let textConverted = sanitizeHtml(text);
    textConverted = textConverted.replace(/(?:\r\n|\r|\n)/g, '<br>');

    const expMatch = /(\b(https?|):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/ig;
    const elementContent = textConverted.replace(expMatch, '<a target="_blank" href="$1">$1</a>');
    const newExpMatch = /(^|[^\\/])(www\.[\S]+(\b|$))/gim;
    const newContent = elementContent.replace(newExpMatch, '$1<a target="_blank" href="http://$2">$2</a>');
    return newContent;
  };

  return (
    <div className="seller-sidebar w-perc-100 max-w-fix-368 p-3">
      <div className="updates dis-fl-col">
        <p className="fweight-600 txtDark700 mb-2">Feed</p>
        {
          fullUpdates.map((history, i) => (
            <div
              className={`update-item brdRadius brdSmall p-2 dis-f mb-2 ${convertFeedMessage(history.actionStub, 'className', history)}`}
              key={`fllUpd_${i.toString()}`}
            >
              <BrixelIcon
                background={convertFeedMessage(history.actionStub, 'colorBgIcon', history)}
                saturation={convertFeedMessage(history.actionStub, 'colorIconSat', history)}
                color={convertFeedMessage(history.actionStub, 'colorIcon', history)}
                saturationTxt={convertFeedMessage(history.actionStub, 'colorBgIconSat', history)}
                padding="p-small-12"
                icon={convertFeedMessage(history.actionStub, 'icon', history)}
                rounded
                className="as-fs"
                iconSize="large"
              />
              <div className="pl-2 desc">
                <p className="fsize-300 txtDark600 dont-break-out" dangerouslySetInnerHTML={{ __html: parseNote(convertFeedMessage(history.actionStub, 'message', history)) }} />
                {
                  !isNaN(get(history, 'createdAt', null)) && (
                    <p className="fsize-200 pt-small-4 txtLight400">
                      {
                        get(history, 'history[0].author.name', null) && (
                          <>
                            {get(history, 'history[0].author.name', '')} -
                          </>
                        )
                      }
                      {DateTime.fromMillis(history.createdAt, {
                        locale: loggedInUser.language,
                      }).toFormat('d LLL yyyy, H:mm')}
                    </p>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

SidebarBuyer.propTypes = {
  activeSinglePropertyDeals: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeCompanyPackages: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSinglePropertyHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeDealHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleUserHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetHistoryFeed: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSinglePropertyDeals: get(state, 'deal.activeSingleDeal', {}),
  activeCompanyPackages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyHistory: get(state, 'history.activeSinglePropertyHistory.data', []),
  activeDealHistory: get(state, 'deal.activeSingleDealHistory.data', []),
  activeSingleUserHistory: get(state, 'history.activeSingleUserHistory.data', []),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetHistoryFeed: bindActionCreators(getHistoryListings, dispatch),
  handleGetNoteListings: bindActionCreators(getNoteListings, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SidebarBuyer);
