/* eslint-disable react-hooks/exhaustive-deps */
import { BrixelIcon, ProgressRing } from '@brixel/brixel-components';
import documentConfig from '@brixel/brixel-configuration-partner/src/DocumentsConfig';
import get from 'lodash/get';
import has from 'lodash/has';
import isNaN from 'lodash/isNaN';
import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import sanitizeHtml from 'sanitize-html';
import { getHistoryListings } from '../../../actions/HistoryActions';
import { getNoteListings } from '../../../actions/NoteActions';
import { feedMessage } from '../../../resources/dashboardHistory';
import timelineActionStubs from '../../../resources/timelineActionStubs';
import { arrayMove, calcPercentageProEstimation } from '../../../utils/helpers';

const SellerSidebar = (props) => {
  // PROPS
  const {
    activeCompanyPackages,
    activeSingleProperty,
    activeSinglePropertyHistory,
    activeSinglePropertyNotes,
    activeSingleUserHistory,
    documents,
    handleGetHistoryFeed,
    handleGetNoteListings,
    loggedInUser,
    progressStep,
  } = props;
  const match = useParams();
  // STATE
  const [fullUpdates, setFullUpdates] = useState([]);
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);

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

  useEffect(() => {
    if (has(activeSingleProperty, 'location.countryCode')) {
      if (documentConfig.mandatoryDocuments[get(activeSingleProperty, 'location.countryCode')]) {
        setMandatoryDocuments(documentConfig.mandatoryDocuments[get(activeSingleProperty, 'location.countryCode')][get(activeSingleProperty, 'properties.propertyType')]);
      } else {
        setMandatoryDocuments(documentConfig.mandatoryDocuments.EN[get(activeSingleProperty, 'properties.propertyType')]);
      }
    }
  }, [activeSingleProperty]);

  const countMandatoryDocuments = () => {
    let count = 0;
    if (documents && mandatoryDocuments) {
      documents.forEach((doc) => {
        mandatoryDocuments.forEach((el) => {
          if (el === doc.type) count += 1;
        });
      });
    }
    return count;
  };

  const convertFeedMessage = (stub, type, history) => {
    if (activeSingleProperty.id) {
      const data = feedMessage(loggedInUser, history, activeCompanyPackages, activeSingleProperty);
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

        {
          progressStep.step === 1 && (
            <div>
              <div className="p-3">
                <p className="fweight-600 txtDark700 mb-2">Tasks</p>

                <div className="update-item brdRadius brdSmall p-2 dis-f mb-2 brdGreen100">
                  <div>
                    <BrixelIcon
                      saturation={0}
                      color="green"
                      saturationTxt={400}
                      padding="p-small-12 brdSmall brdGreen200"
                      icon="check"
                      rounded
                      className="as-fs"
                      iconSize="large"
                    />
                  </div>
                  <div className="ml-3">
                    <span>{countMandatoryDocuments()}</span>
                    <span className="ml-small-4">of</span>
                    <span className="ml-small-4">{mandatoryDocuments ? mandatoryDocuments.length : 0}</span>
                    <span className="ml-small-4">uplaoded on your docubox</span>

                    <Link
                      className="dis-b mt-1"
                      to={{
                        pathname: `/${propID}/docubox`,
                      }}
                    >
                      Upload
                    </Link>
                  </div>
                </div>

                <div className="update-item brdRadius brdSmall p-2 dis-f mb-2 brdGreen100">

                  <ProgressRing
                    progress={calcPercentageProEstimation().realPerc}
                    size={48}
                    strokeWidth={10}
                    circleOneStroke="#DCF2E8"
                    circleTwoStroke="#009877"
                    showIcon={false}
                  />
                  <div className="ml-3">
                    <span>{calcPercentageProEstimation().realPerc}%</span>
                    <span className="ml-small-4">of Pro Estimation complete</span>

                    <Link
                      className="dis-b mt-1"
                      to={{
                        pathname: calcPercentageProEstimation().realPerc < 100 ? `/${propID}/property/price/formFlow` : `/${propID}/property/price`,
                      }}
                    >
                      {calcPercentageProEstimation().realPerc < 100 ? 'Next step' : 'View'}
                    </Link>

                  </div>
                </div>
              </div>

              <hr />
            </div>
          )
        }

        <div className="p-3">
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
                  <p
                    className="fsize-300 txtDark600 dont-break-out"
                    dangerouslySetInnerHTML={{ __html: parseNote(convertFeedMessage(history.actionStub, 'message', history), typeof history.actionStub === 'undefined') }}
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
    </div>
  );
};

SellerSidebar.propTypes = {
  activeSingleProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeCompanyPackages: PropTypes.arrayOf(PropTypes.object).isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSinglePropertyHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSinglePropertyNotes: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleUserHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetHistoryFeed: PropTypes.func.isRequired,
  handleGetNoteListings: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  progressStep: PropTypes.object,
};

SellerSidebar.defaultProps = {
  progressStep: {},
};

const mapStateToProps = (state) => ({
  activeCompanyPackages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  documents: get(state, 'property.activeSingleProperty.documents', []),
  activeSinglePropertyHistory: get(state, 'history.activeSinglePropertyHistory.data', []),
  activeSinglePropertyNotes: get(state, 'notes.activeSinglePropertyNotes', []),
  activeSingleUserHistory: get(state, 'history.activeSingleUserHistory.data', []),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetHistoryFeed: bindActionCreators(getHistoryListings, dispatch),
  handleGetNoteListings: bindActionCreators(getNoteListings, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SellerSidebar);
