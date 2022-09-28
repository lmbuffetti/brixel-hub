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
import getConfigEnv from '@brixel/brixel-components/dist/configuration/Settings';
import {
  BrixelAvatar,
  BrixelButtonIcon,
  BrixelButtonSecondary,
  Helpers,
  FactsOptions,
  useOutsideAlerter,
  BrixelDropdownMini,
  BrixelIcon, translateTo,
} from '@brixel/brixel-components';
import { change } from '@brixel/brixel-components/dist/form';
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

const ActionStubs = require('../../resources/Utilities/timelineActionStubs');

const SingleDeal = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeDealHistoryList,
    activeSingleDeal,
    activeSingleProperty,
    activeSinglePropertyDeals,
    getActiveDeal,
    getDealNotes,
    getHistoryList,
    handleSaveDeal,
    handleSaveMultipleDeal,
    lang,
    setActiveSingleDealHistory,
    setActiveSingleDealOwnerHistory,
    setDeal,
    setDealNotes,
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
      getActiveDeal({ id: dealID, prop: activeSingleProperty.id, smallLoader: 'getDeal' });
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
    if (has(activeSingleDeal, 'closing.stageOffer.offer.status')) return `${get(activeSingleDeal, 'closing.stageOffer.offer.currency', '')} ${formatPrice(get(activeSingleDeal, 'closing.stageOffer.offer.amount'), lang)}`;
    return translateTo('No offer', lang);
  };

  const getCompleteOffer = () => {
    let answerText = '';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.buyer') && Object.keys(activeSingleDeal.closing.stageOffer.offer.buyer).length > 0) {
      answerText += `<span>${translateTo('Buyer details:', lang)}</span></br>
      <span class="dis-b"><span>${translateTo('Date of birth:', lang)}</span><span class="fweight-500">
      ${(typeof get(activeSingleDeal, 'closing.stageOffer.offer.buyer.dateBirth', '') === 'string' && get(activeSingleDeal, 'closing.stageOffer.offer.buyer.dateBirth', '').includes('-')) ? get(activeSingleDeal, 'closing.stageOffer.offer.buyer.dateBirth', '') : DateTime.fromMillis(
    get(activeSingleDeal, 'closing.stageOffer.offer.buyer.dateBirth', ''),
    {
      locale: lang,
    },
  ).toFormat('yyyy-MM-dd')}
    </span></span>      </br><span>${translateTo('Marital status:', lang)}</span><span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.buyer.maritialStatus', ''), lang)} </span>
      </br><span>${translateTo('Place of origin:', lang)}</span><span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.buyer.placeOfOrigin', ''), lang)} </span>
      </br><span>${translateTo('Type of purchase:', lang)}</span><span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.buyer.typeOfPurchase', ''), lang)} </span>`;
    }
    if (get(activeSingleDeal, 'closing.stageOffer.offer.location') && Object.keys(activeSingleDeal.closing.stageOffer.offer.location).length > 0) {
      answerText += `</br></br><span>${translateTo('Buyer location:', lang)}</span></br>
      <span>${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.location.street', ''), lang)}</span>
      <span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.location.streetNumber', ''), lang)}</span>
      <span class="ml-small-4">${translateTo(`, ${get(activeSingleDeal, 'closing.stageOffer.offer.location.zipCode', '')}`, lang)} </span>
      <span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.location.City', ''), lang)}</span>`;
    }

    if (get(activeSingleDeal, 'closing.stageOffer.offer.financeCertificate') === 0 || get(activeSingleDeal, 'closing.stageOffer.offer.financeCertificate') === 1) {
      answerText += `</br></br><span>${translateTo('Financial certificate:', lang)}</span><span class="ml-small-4">${translateTo(activeSingleDeal.closing.stageOffer.offer.financeCertificate === 1 ? 'Yes' : 'No', lang)} </span>`;
    }
    return answerText;
  };

  const getCompleteFeedback = () => {
    let answerText = '';
    if (get(activeDealFeedback, 'meta.visitFeedback.reasons', []) && activeDealFeedback.meta.visitFeedback.reasons.length > 0) {
      answerText += translateTo('Main reason:', lang);
      activeDealFeedback.meta.visitFeedback.reasons.forEach((answer, key) => {
        answerText += `<span>${translateTo(`${answer}${key !== (activeDealFeedback.meta.visitFeedback.reasons.length - 1) ? ', ' : ''}`, lang)}</span>`;
      });
    }
    if (get(activeDealFeedback, 'meta.visitFeedback.otherReason', '') && activeDealFeedback.meta.visitFeedback.otherReason.length > 0) {
      answerText += `</br><span>${translateTo('Additional note:', lang)}</br></span><span>${translateTo(activeDealFeedback.meta.visitFeedback.otherReason, lang)} </span>`;
    }
    if (get(activeDealFeedback, 'meta.visitFeedback.priceChangeAlert') === true || get(activeDealFeedback, 'meta.visitFeedback.priceChangeAlert') === false) {
      answerText += `</br><span>${translateTo('Price update:', lang)}</span><span>${translateTo(activeDealFeedback.meta.visitFeedback.priceChangeAlert === true ? 'Yes' : 'No', lang)}</span>`;
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
                <div className="actions dis-fl-row jc-b pb-2">
                  <div className="pt-2 pr-1 pr-lg-0 pt-lg-0">
                    <BrixelButtonIcon
                      icon="arrow-left-small"
                      ghost
                      theme="dark"
                      onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                    />
                  </div>
                  <OptionsDropdown showDesktop />
                </div>
                <div className="top dis-fl-row jc-b mb-0 mb-lg-4">
                  <div className="user dis-fl-row col-7 p-2 p-lg-0">
                    <BrixelAvatar
                      baseURL={get(getConfigEnv, 'shortPath', '')}
                      name={Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', null), get(activeSingleDeal, 'user.lastName', null), get(activeSingleDeal, 'user.name', null)) === 'No Name' ? get(activeSingleDeal, 'user.email', '') : Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', null), get(activeSingleDeal, 'user.lastName', null), get(activeSingleDeal, 'user.name', null))}
                      profileId={get(activeSingleDeal.user, 'id', '')}
                    />
                    <div className="title dis-fl-col ml-2">
                      <span
                        className={`name dis-b fsize-500 fweight-500 ${get(activeSingleDeal, 'user.name') ? 'txtDark700' : 'txtDark100'}`}
                      >
                        {Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', null), get(activeSingleDeal, 'user.lastName', null), get(activeSingleDeal, 'user.name', null))}
                      </span>
                      <div className="dis-f">
                        {
                          get(activeSingleDeal, 'user.email', null) && (
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
                          get(activeSingleDeal, 'winner', null) && (
                            <span className="cardTag green mr-2">{translateTo('Winner', lang)}</span>
                          )
                        }
                        {
                          !activeSingleDeal.active && (
                            <span className="cardTag">{translateTo('Archived', lang)}</span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* middle panel */}
                <div className="mid p-2 dis-fl-row flex-wrap mb-lg-2 pos-r">
                  <div className="left dis-fl-col col-7 p-0 min-w-perc-100 min-w-perc-lg-0">
                    <span className="fsize-200 overline tt-up mb-2">{translateTo('Information', lang)}</span>

                    <div className="detail-part dis-fl-row">

                      <div className="dis-fl-col col-6 p-0">
                        <div className="dis-fl-col ta-l mb-2">
                          <span className="subtitle fsize-200 txtDark200">{translateTo('Phone', lang)}</span>
                          {
                            get(activeSingleDeal, 'user.phone.number', null) ? (
                              <span className="value txtDark700">{Helpers.telephoneFormat(activeSingleDeal.user.phone)}</span>
                            ) : (
                              <span className="value txtDark700">-</span>
                            )
                          }
                        </div>
                      </div>

                      <div className="dis-fl-col col-6 p-0">
                        <div className="dis-fl-col ta-l mb-2">
                          <span className="subtitle fsize-200 txtDark200">{translateTo('Signed Up', lang)}</span>
                          {
                            get(activeSingleDeal, 'user.createdAt', null) ? (
                              <span className="value txtDark700">{DateTime.fromMillis(activeSingleDeal.user.createdAt, { locale: lang }).toFormat('dd LLL yy, H:mm')}</span>
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
                          lang={lang}
                          className="mb-3"
                          options={factsOptions.progressBarDealsOptions}
                          progressState={has(activeSingleDeal, 'stage') ? activeSingleDeal.stage : ''}
                          readOnly={false}
                          updateProgressBarFunc={(value) => progressChange(value)}
                        />
                      )
                    }

                    <div className="mb-3 hide">
                      <span className="overline mb-2">{translateTo('Showings', lang)}</span>
                      <BrixelButtonSecondary
                        className="p-0 as-fs"
                        label={translateTo('Add date', lang)}
                        rounded
                        color="light"
                        saturation={700}
                        bgTransparent
                        leftIcon="calendar"
                        onClick={() => ''}
                      />
                    </div>
                    <div className="hide">
                      <span className="overline mb-2">{translateTo('Offers', lang)}</span>
                      <BrixelButtonSecondary
                        className="p-0 as-fs"
                        label={translateTo('Add offer', lang)}
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
                <div className="bottom dis-fl-col dis-fl-row-sm w-perc-100 h-perc-100 py-3 pos-r">
                  <OptionsDropdown
                    btnClass="shadow-3dp"
                    className="pos-a-fix x-t-0 x-r-0 mt-2-neg"
                    showMobile
                  />
                  <Timeline
                    countryLang={lang}
                    isDeal
                    className="col-12 col-sm-6 p-0"
                  />
                  <div className="dis-fl-col-md col-12 col-sm-6">
                    {
                      (get(activeSingleDeal, 'visit', null) && get(activeSingleDeal, 'visit', '').toString().length !== 0) && (
                        <>
                          <span className="overline mb-3">{translateTo('Visit', lang)}</span>
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
                              <span className={`txt${getTextColor()}`}>{DateTime.fromMillis(activeSingleDeal.visit, { locale: lang }).toFormat('d LLL yyyy, H:mm')}</span>
                            </div>
                            {
                              activeDealFeedback.createdAt && (
                                <div className="dis-fl-col">
                                  <div className={`mt-1 dis-fl-row jc-b ${showFullFeedback === true ? 'mb-2' : ''}`}>
                                    {
                                      activeDealFeedback.meta.visitFeedback.isInterested === true ? (
                                        <span className="txtDark700 fsize-300">{translateTo('Still interested 👍', lang)}</span>
                                      ) : (
                                        <span className="txtDark700 fsize-300">{translateTo('Not interested anymore 👎', lang)}</span>
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
                    <div className="brdRadius shadow-1dp pos-r dis-fl-col bgWhite p-small-12 w-perc-100">
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
                              <span className="txtDark700 fsize-300">{translateTo('Offer details:', lang)}</span>
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
  lang: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

SingleDeal.defaultProps = {};

const mapStateToProps = (state) => ({
  activeDealHistoryList: get(state, 'deal.activeSingleDealHistory', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
  isSuperAdmin: get(state, 'common.superAdmin', false),
  lang: get(state, 'common.language', 'en'),
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
