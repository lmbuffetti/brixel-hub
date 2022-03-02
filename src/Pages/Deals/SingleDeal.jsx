/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, useRef,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import { DateTime } from 'luxon';
import {
  bindActionCreators, compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import {
  BrixelAvatar, BrixelButtonIcon, BrixelButtonSecondary, Helpers,
  FactsOptions, useOutsideAlerter, change, BrixelDropdownMini,
  BrixelIcon,
} from '@brixel/brixel-components';
import {
  getActiveSingleDeal, saveActiveSingleDeal, updateMultipleDeals,
  setActiveSingleDeal,
} from '../../actions/DealActions';
import {
  getNoteListings, setDealNoteListings,
} from '../../actions/NoteActions';
import {
  getHistoryListings, setDealHistoryListings, setDealOwnerHistoryListings,
} from '../../actions/HistoryActions';
import {
  formatPrice,
} from '../../utils/helpers';

// COMPONENTS
import ProgressBar from '../../components/ProgressBar';
import Timeline from '../../components/Timeline';

const ActionStubs = require('../../resources/timelineActionStubs');

const SingleDeal = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeSingleDeal,
    activeDealHistoryList,
    activeSingleProperty,
    activeSinglePropertyDeals,
    getActiveDeal,
    getDealNotes,
    getHistoryList,
    handleSaveDeal,
    handleSaveMultipleDeal,
    setActiveSingleDealHistory,
    setActiveSingleDealOwnerHistory,
    setDeal,
    setDealNotes,
    userLang,
    windowDimensions,
  } = props;

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [winnerId, setWinnerId] = useState('');
  const [activeDealFeedback, setActiveDealFeedback] = useState({});
  const [showFullFeedback, setShowFullFeedback] = useState(false);
  const [showFullOffer, setShowFullOffer] = useState(false);

  const {
    factsOptions,
  } = FactsOptions;

  const optionsRef = useRef(null);

  useEffect(() => () => {
    setDeal({});
    setDealNotes([]);
    setActiveSingleDealHistory({});
    setActiveSingleDealOwnerHistory({});
  }, []);

  useEffect(() => {
    const dealID = get(match, 'dealID', null);
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
        order: '',
        direction: 'DESC',
        actionStubs: ActionStubs.Deal,
        smallLoader: 'getDealHistory',
      };
      getActiveDeal({ id: dealID, smallLoader: 'getDeal' });
      getDealNotes(payloadNote);
      getHistoryList(payloadDealHistory);
    }
  }, [activeSingleDeal.id]);

  useEffect(() => {
    forEach(activeSinglePropertyDeals, (el) => {
      if (has(el, 'winner') && el.winner === true) setWinnerId(el.id);
    });
  }, [activeSinglePropertyDeals]);

  useEffect(() => {
    if (activeDealHistoryList.total > 0 && activeDealHistoryList.data.length > 0) {
      // Process deal feedback visit to use on visit container (outside of timeline)
      const feedbackArray = filter(activeDealHistoryList.data, (item) => (item.actionStub === 'deal-feedback-visit' && item.meta.visit === activeSingleDeal.visit));
      if (feedbackArray.length > 0) {
        const mostRecentFeedbackTime = Math.max(...feedbackArray.map((o) => o.createdAt));
        const mostRecentFeedback = find(feedbackArray, (obj) => obj.createdAt === mostRecentFeedbackTime);
        setActiveDealFeedback(mostRecentFeedback);
      }
    }
  }, [activeDealHistoryList]);

  const saveData = () => {
    const deal = cloneDeep(activeSingleDeal);
    const data = {
      id: deal.id,
      data: deal,
      smallLoader: 'saveData',
    };
    // For now we still dont use the diff object (TODO: API ticket)
    // diff(initialValues, formValue)
    handleSaveDeal(data);
  };

  const archiveDeal = () => {
    if (activeSingleDeal.newSeller === true) set(activeSingleDeal, 'newSeller', false);
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
      return (
        <div className={`pos-r mr-2 ${className}`} ref={optionsRef}>
          <BrixelButtonIcon
            icon="options-vertical"
            className={`ml-a ${btnClass}`}
            theme="dark"
            ghost
            onClick={() => {
              setOptionsOpen(!optionsOpen);
            }}
          />
          {
            optionsOpen && (
              <BrixelDropdownMini
                rightAligned
                topOffset={48}
                links={
                  [
                    {
                      label: get(activeSingleDeal, 'winner', null) ? 'Remove winner' : 'Winner',
                      clickFunc: () => { winDeal(); setOptionsOpen(false); },
                      className: 'txtPrimary400',
                    },
                    {
                      label: get(activeSingleDeal, 'newSeller', null) ? 'Mark as read' : 'Mark as new',
                      clickFunc: () => { newDeal(); setOptionsOpen(false); },
                      className: 'txtPrimary400',
                    },
                    {
                      label: get(activeSingleDeal, 'active', null) ? 'Archive' : 'Unarchive',
                      clickFunc: () => { archiveDeal(); setOptionsOpen(false); },
                      className: 'txtPrimary400',
                    },
                  ]
                }
              />
            )
          }
        </div>
      );
    }
    return null;
  };

  const getIcon = () => {
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 'calendar-check';
    return 'calendar';
  };

  const getColor = () => {
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 'dark';
    return 'green';
  };

  const getBackground = () => {
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 'light';
    return 'green';
  };

  const getSaturation = () => {
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 200;
    return 100;
  };

  const getTextColor = () => {
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 'Dark700';
    return 'Green400';
  };

  const getOfferBackground = () => {
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'accepted') return 'green';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'pending') return 'yellow';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'rejected') return 'red';
    return 'light';
  };

  const getOfferColor = () => {
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'accepted') return 'green';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'pending') return 'yellow';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'rejected') return 'red';
    return 'dark';
  };

  const getOfferSaturation = () => {
    if (has(activeSingleDeal, 'closing.stageOffer.offer.status')) return 100;
    return 200;
  };

  const getOfferTextColor = () => {
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'accepted') return 'Green400';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'pending') return 'Yellow400';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'rejected') return 'Red400';
    return 'Dark700';
  };

  const getOfferText = () => {
    if (has(activeSingleDeal, 'closing.stageOffer.offer.status')) return `${get(activeSingleDeal, 'closing.stageOffer.offer.currency', '')} ${formatPrice(get(activeSingleDeal, 'closing.stageOffer.offer.amount'), userLang)}`;
    return 'No offer';
  };

  const getCompleteOffer = () => {
    let answerText = '';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.buyer') && Object.keys(activeSingleDeal.closing.stageOffer.offer.buyer).length > 0) {
      answerText += `<span>Buyer details: </br></span>
      <span>Date of birth: </span><span>${get(activeSingleDeal, 'closing.stageOffer.offer.buyer.dateBirth', '')} </span>
      </br><span>Marital status: </span><span>${get(activeSingleDeal, 'closing.stageOffer.offer.buyer.maritialStatus', '')} </span>
      </br><span>Place of origin: </span><span>${get(activeSingleDeal, 'closing.stageOffer.offer.buyer.placeOfOrigin', '')} </span>
      </br><span>Type of purchase: </span><span>${get(activeSingleDeal, 'closing.stageOffer.offer.buyer.typeOfPurchase', '')} </span>`;
    }
    if (get(activeSingleDeal, 'closing.stageOffer.offer.location') && Object.keys(activeSingleDeal.closing.stageOffer.offer.location).length > 0) {
      answerText += `</br></br><span>Buyer location: </br></span>
      <span>${get(activeSingleDeal, 'closing.stageOffer.offer.location.street', '')} </span>
      <span>${get(activeSingleDeal, 'closing.stageOffer.offer.location.streetNumber', '')} </span>
      <span>, ${get(activeSingleDeal, 'closing.stageOffer.offer.location.zipCode', '')} </span>
      <span>${get(activeSingleDeal, 'closing.stageOffer.offer.location.City', '')} </span>`;
    }

    if (get(activeSingleDeal, 'closing.stageOffer.offer.financeCertificate') === 0 || get(activeSingleDeal, 'closing.stageOffer.offer.financeCertificate') === 1) {
      answerText += `</br></br><span>Financial certificate: </span><span>${activeSingleDeal.closing.stageOffer.offer.financeCertificate === 1 ? 'Yes' : 'No'} </span>`;
    }
    return answerText;
  };

  const getCompleteFeedback = () => {
    let answerText = '';
    if (get(activeDealFeedback, 'meta.visitFeedback.reasons', []) && activeDealFeedback.meta.visitFeedback.reasons.length > 0) {
      answerText += 'Main reason: ';
      activeDealFeedback.meta.visitFeedback.reasons.forEach((answer, key) => {
        answerText += `<span>${answer}${key !== (activeDealFeedback.meta.visitFeedback.reasons.length - 1) ? ', ' : ''} </span>`;
      });
    }
    if (get(activeDealFeedback, 'meta.visitFeedback.otherReason', '') && activeDealFeedback.meta.visitFeedback.otherReason.length > 0) {
      answerText += `</br><span>Additional note: </br></span><span>${activeDealFeedback.meta.visitFeedback.otherReason} </span>`;
    }
    if (get(activeDealFeedback, 'meta.visitFeedback.priceChangeAlert') === true || get(activeDealFeedback, 'meta.visitFeedback.priceChangeAlert') === false) {
      answerText += `</br><span>Price update: </span><span>${activeDealFeedback.meta.visitFeedback.priceChangeAlert === true ? 'Yes' : 'No'} </span>`;
    }
    return answerText;
  };

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
  useOutsideAlerter(optionsRef, {
    action: 'function',
    func: () => {
      setOptionsOpen(false);
    },
  });

  return (
    <>
      {
        activeSingleDeal.id && (
          <div className="dashboardContainer mt-0 mt-md-3 dis-f jc-b" id="dashboard">
            <div className="w-perc-100">
              <div className="single-deal dis-fl-col">
                {/* top panel */}
                <div className="top dis-fl-row jc-b mb-0 mb-lg-4">
                  <div className="user dis-fl-row col-7 p-2 p-lg-0">
                    <BrixelAvatar
                      baseURL={get(getConfigEnv, 'shortPath', '')}
                      name={Helpers.userNameVal(activeSingleDeal.user.firstName, activeSingleDeal.user.lastName, activeSingleDeal.user.name) === 'No Name' ? get(activeSingleDeal.user, 'email', '') : Helpers.userNameVal(activeSingleDeal.user.firstName, activeSingleDeal.user.lastName, activeSingleDeal.user.name)}
                      profileId={get(activeSingleDeal.user, 'id', '')}
                    />
                    <div className="title dis-fl-col ml-2">
                      <span
                        className={`name dis-b fsize-500 fweight-500 ${get(activeSingleDeal, 'user.name') ? 'txtDark700' : 'txtDark100'}`}
                      >
                        {Helpers.userNameVal(activeSingleDeal.user.firstName, activeSingleDeal.user.lastName, activeSingleDeal.user.name)}
                      </span>
                      <div className="dis-f">
                        {
                          has(activeSingleDeal, 'user.email') && (
                            <a
                              className="txtDark700 link mr-2"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`mailto:${activeSingleDeal.user.email}?subject=From Brixel`}
                            >
                              {activeSingleDeal.user.email}
                            </a>
                          )
                        }
                        {
                          has(activeSingleDeal, 'winner') && activeSingleDeal.winner && (
                            <span className="cardTag green mr-2"> Winner </span>
                          )
                        }
                        {
                          !activeSingleDeal.active && (
                            <span className="cardTag"> Archived </span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="actions dis-fl-row jc-fe col-5 p-0">
                    <OptionsDropdown showDesktop />
                    <div className="pt-2 pr-1 pr-lg-0 pt-lg-0">
                      <BrixelButtonIcon
                        icon="close-small"
                        ghost
                        theme="dark"
                        onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                      />
                    </div>
                  </div>
                </div>

                {/* middle panel */}
                <div className="mid p-2 dis-fl-row flex-wrap mb-lg-2 pos-r">
                  <div className="left dis-fl-col col-7 p-0 min-w-perc-100 min-w-perc-lg-0">
                    <span className="fsize-200 overline tt-up mb-2">Information</span>

                    <div className="detail-part dis-fl-row">

                      <div className="dis-fl-col col-6 p-0">
                        <div className="dis-fl-col ta-l mb-2">
                          <span className="subtitle fsize-200 txtDark200">Phone</span>
                          {
                            (has(activeSingleDeal, 'user.phone.number') && activeSingleDeal.user.phone.number.length > 0) ? (
                              <span className="value txtDark700">{Helpers.telephoneFormat(activeSingleDeal.user.phone)}</span>
                            ) : (
                              <span className="value txtDark700">-</span>
                            )
                          }
                        </div>
                      </div>

                      <div className="dis-fl-col col-6 p-0">
                        <div className="dis-fl-col ta-l mb-2">
                          <span className="subtitle fsize-200 txtDark200">Signed Up</span>
                          {
                            get(activeSingleDeal, 'user.createdAt', null) ? (
                              <span className="value txtDark700">{DateTime.fromMillis(activeSingleDeal.user.createdAt, { locale: userLang }).toFormat('dd LLL yy, H:mm')}</span>
                            ) : (
                              <span className="value txtDark700">-</span>
                            )
                          }

                        </div>
                      </div>

                    </div>

                  </div>
                  <div className="right dis-fl-col col-5 p-0 min-w-perc-100 min-w-perc-lg-0">
                    {
                      activeSingleDeal.id && (
                        <ProgressBar
                          className="mb-3"
                          options={factsOptions.progressBarDealsOptions}
                          progressState={has(activeSingleDeal, 'stage') ? activeSingleDeal.stage : ''}
                          readOnly={false}
                          updateProgressBarFunc={(value) => progressChange(value)}
                        />
                      )
                    }

                    <div className="mb-3 hide">
                      <span className="overline mb-2">Showings</span>
                      <BrixelButtonSecondary
                        className="p-0 as-fs"
                        label="Add date"
                        rounded
                        color="light"
                        saturation={700}
                        bgTransparent
                        leftIcon="calendar"
                        onClick={() => ''}
                      />
                    </div>
                    <div className="hide">
                      <span className="overline mb-2">Offers</span>
                      <BrixelButtonSecondary
                        className="p-0 as-fs"
                        label="Add offer"
                        rounded
                        color="light"
                        saturation={700}
                        bgTransparent
                        leftIcon="money"
                        onClick={() => ''}
                      />
                    </div>
                  </div>
                </div>

                {/* bottom panel */}
                <div className="bottom dis-fl-col dis-fl-row-sm brdSmall brdAltGrey100 brdRadius bgLight100 px-2 w-perc-100 h-perc-100 py-3 pos-r">
                  <OptionsDropdown
                    btnClass="shadow-3dp"
                    className="pos-a-fix x-t-0 x-r-0 mt-2-neg"
                    showMobile
                  />
                  <Timeline
                    countryLang={userLang}
                    isDeal
                    className="col-12 col-sm-6"
                  />
                  <div className="dis-fl-col-md col-12 col-sm-6">
                    {
                      (get(activeSingleDeal, 'visit', null) && get(activeSingleDeal, 'visit', '').toString().length !== 0) && (
                        <>
                          <span className="overline mb-3">Visit</span>
                          <div className="visit-container brdRadius shadow-1dp dis-fl-col p-small-12">
                            <div className="dis-f a-c">
                              <BrixelIcon
                                icon={getIcon()}
                                noBorder
                                background={getBackground()}
                                saturation={getSaturation()}
                                color={getColor()}
                                saturationTxt={700}
                                className="mr-2"
                              />
                              <span className={`txt${getTextColor()}`}>{DateTime.fromMillis(activeSingleDeal.visit, { locale: userLang }).toFormat('d LLL yyyy, H:mm')}</span>
                            </div>
                            {
                              activeDealFeedback.createdAt && (
                                <div className="dis-fl-col">
                                  <div className={`mt-1 dis-fl-row jc-b ${showFullFeedback === true ? 'mb-2' : ''}`}>
                                    {
                                      activeDealFeedback.meta.visitFeedback.isInterested === true ? (
                                        <span className="txtDark700 fsize-300">Still interested 👍</span>
                                      ) : (
                                        <span className="txtDark700 fsize-300">Not interested anymore 👎</span>
                                      )
                                    }
                                    <BrixelIcon
                                      fontSize={8}
                                      icon={`${showFullFeedback === true ? 'arrow-simple-up' : 'dropdown'}`}
                                      className="txtDark700 cur-poi"
                                      onClick={() => setShowFullFeedback(!showFullFeedback)}
                                    />
                                  </div>
                                  {
                                    showFullFeedback && (
                                      <div
                                        className="txtDark700 fsize-300"
                                        dangerouslySetInnerHTML={{
                                          __html: getCompleteFeedback(),
                                        }}
                                      />
                                    )
                                  }
                                </div>
                              )
                            }
                          </div>
                        </>
                      )
                    }

                    <span className="overline mb-3">Offer</span>
                    <div className="brdRadius shadow-1dp pos-r dis-fl-col p-small-12 w-perc-100">
                      <div className="dis-fl-row jc-b">
                        <div className="dis-f a-c">
                          <BrixelIcon
                            icon="money"
                            noBorder
                            background={getOfferBackground()}
                            saturation={getOfferSaturation()}
                            color={getOfferColor()}
                            saturationTxt={700}
                            className="mr-2"
                          />
                          <span className={`txt${getOfferTextColor()}`}>{getOfferText()}</span>
                        </div>
                      </div>
                      {
                        has(activeSingleDeal, 'closing.stageOffer.offer.status') && (
                          <div className="dis-fl-col">
                            <div className={`mt-1 dis-fl-row jc-b ${showFullOffer === true ? 'mb-2' : ''}`}>
                              <span className="txtDark700 fsize-300">Offer details: </span>
                              <BrixelIcon
                                fontSize={8}
                                icon={`${showFullOffer === true ? 'arrow-simple-up' : 'dropdown'}`}
                                className="txtDark700 cur-poi pr-1"
                                onClick={() => setShowFullOffer(!showFullOffer)}
                              />
                            </div>
                            {
                              showFullOffer && (
                                <div
                                  className="txtDark700 fsize-300"
                                  dangerouslySetInnerHTML={{
                                    __html: getCompleteOffer(),
                                  }}
                                />
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

SingleDeal.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  activeDealHistoryList: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDeals: PropTypes.arrayOf(PropTypes.object).isRequired,
  getActiveDeal: PropTypes.func.isRequired,
  getDealNotes: PropTypes.func.isRequired,
  getHistoryList: PropTypes.func.isRequired,
  handleSaveDeal: PropTypes.func.isRequired,
  handleSaveMultipleDeal: PropTypes.func.isRequired,
  setActiveSingleDealHistory: PropTypes.func.isRequired,
  setActiveSingleDealOwnerHistory: PropTypes.func.isRequired,
  setDeal: PropTypes.func.isRequired,
  setDealNotes: PropTypes.func.isRequired,
  userLang: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

SingleDeal.defaultProps = {};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
  activeDealHistoryList: get(state, 'deal.activeSingleDealHistory', {}),
  isSuperAdmin: get(state, 'common.superAdmin', false),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  getActiveDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  getDealNotes: bindActionCreators(getNoteListings, dispatch),
  getHistoryList: bindActionCreators(getHistoryListings, dispatch),
  handleSaveDeal: bindActionCreators(saveActiveSingleDeal, dispatch),
  handleSaveMultipleDeal: bindActionCreators(updateMultipleDeals, dispatch),
  setActiveSingleDealHistory: bindActionCreators(setDealHistoryListings, dispatch),
  setActiveSingleDealOwnerHistory: bindActionCreators(setDealOwnerHistoryListings, dispatch),
  setDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  setDealNotes: bindActionCreators(setDealNoteListings, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SingleDeal);
