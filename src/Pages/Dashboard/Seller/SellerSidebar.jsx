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
import { feedMessage } from '../../../resources/Dashboard/dashboardHistory';
import timelineActionStubs from '../../../resources/Utilities/timelineActionStubs';
import { arrayMove } from '../../../utils/helpers';
import translateTo from '../../../utils/translation';

const SellerSidebar = (props) => {
  // PROPS
  const {
    activeCompanyPackages,
    activeSingleProperty,
    activeSinglePropertyHistory,
    activeSinglePropertyNotes,
    activeSingleUserHistory,
    handleGetHistoryFeed,
    handleGetNoteListings,
    lang,
    loggedInUser,
  } = props;
  const match = useParams();
  // STATE
  const [fullUpdates, setFullUpdates] = useState([]);

  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (propID) {
      const payloadPageHistory = {
        actionStubs: timelineActionStubs.SellerSidebar,
        parent: propID,
        resultsPerPage: 50,
        offset: 0,
        order: 'createdAt',
        direction: 'DESC',
        smallLoader: 'getPageHistory',
        type: 'page',
      };
      const payloadNote = {
        object: propID,
        type: 'page',
        resultsPerPage: 50,
        offset: 0,
        text: '',
        order: 'createdAt',
        direction: 'DESC',
        company: '',
        smallLoader: 'pageNotes',
      };
      handleGetHistoryFeed(payloadPageHistory);
      handleGetNoteListings(payloadNote);
    }
  }, [propID]);

  useEffect(() => {
    if (loggedInUser.id) {
      const payloadUserHistory = {
        actionStubs: timelineActionStubs.SellerSidebar,
        parent: loggedInUser.id,
        child: propID,
        resultsPerPage: 50,
        offset: 0,
        order: 'createdAt',
        direction: 'DESC',
        smallLoader: 'getPageHistory',
        type: 'user',
      };
      handleGetHistoryFeed(payloadUserHistory);
    }
  }, [loggedInUser.id]);

  useEffect(() => {
    let mergedFeed = activeSinglePropertyHistory.concat(activeSinglePropertyNotes);
    mergedFeed = activeSingleUserHistory.concat(mergedFeed);
    mergedFeed = orderBy(mergedFeed, ['createdAt'], ['desc']);
    let newId = 0;
    mergedFeed.forEach((item, i) => {
      if (item.pinned) {
        arrayMove(mergedFeed, i, newId);
        newId += 1;
      }
    });
    setFullUpdates(mergedFeed);
  }, [activeSinglePropertyHistory, activeSingleUserHistory, activeSinglePropertyNotes]);

  const convertFeedMessage = (stub, type, history) => {
    if (activeSingleProperty.id) {
      const data = feedMessage(loggedInUser, history, activeCompanyPackages, activeSingleProperty, lang);
      if (data[stub] && data[stub][type]) return data[stub][type];
      if (history.content) return data.note[type];
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

  return (
    <div className="seller-sidebar w-perc-100 max-w-fix-384">
      <div className="updates dis-fl-col">
        <div className="p-3">
          <p className="fweight-600 txtDark700 mb-2">
            {translateTo('Feed', lang)}
          </p>

          {
            get(fullUpdates, null) && (
              <div className="">
                <div className="h-fix-96 mb-2 w-perc-100 skeletonBg brdRadius" />
                <div className="h-fix-96 mb-3 w-perc-100 skeletonBg brdRadius" />
              </div>
            )
          }


          {
            fullUpdates.map((history, i) => (
              <div
                className={`update-item brdRadius p-2 dis-f mb-2 ${convertFeedMessage(history.actionStub, 'className', history)}`}
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
                  <p
                    className="fsize-300 txtDark600 dont-break-out"
                    dangerouslySetInnerHTML={{ __html: translateTo(parseNote(convertFeedMessage(history.actionStub, 'message', history), typeof history.actionStub === 'undefined'), lang) }}
                  />
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
                          locale: lang,
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
    </div>
  );
};

SellerSidebar.propTypes = {
  activeCompanyPackages: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSinglePropertyNotes: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleUserHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetHistoryFeed: PropTypes.func.isRequired,
  handleGetNoteListings: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeCompanyPackages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyHistory: get(state, 'history.activeSinglePropertyHistory.data', []),
  activeSinglePropertyNotes: get(state, 'notes.activeSinglePropertyNotes', []),
  activeSingleUserHistory: get(state, 'history.activeSingleUserHistory.data', []),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetHistoryFeed: bindActionCreators(getHistoryListings, dispatch),
  handleGetNoteListings: bindActionCreators(getNoteListings, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SellerSidebar);
