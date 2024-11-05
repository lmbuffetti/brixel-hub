import React, {useEffect, useRef, useState} from 'react';
import {
  BrixelAvatar,
  BrixelButtonIcon,
  BrixelButtonSecondary,
  BrixelDropdownMini,
  BrixelIcon,
  BrixelSingleTag,
  FactsOptions,
  Helpers,
  useOutsideAlerter,
} from '@brixel-io/brixel-components';
import {change} from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import {DateTime} from 'luxon';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {
  getActiveSingleDeal, getActiveSingleOffer, getScheduleVisit,
  saveActiveSingleDeal,
  setActiveSingleDeal,
  updateMultipleDeals,
} from '../../actions/DealActions';
import {getHistoryListings, setDealHistoryListings, setDealOwnerHistoryListings} from '../../actions/HistoryActions';
import {getNoteListings, setDealNoteListings} from '../../actions/NoteActions';

// COMPONENTS
import ProgressBar from '../../components/ProgressBar';
import Timeline from '../../components/Timeline';
import translateTo from '../../utils/translation';

import TimelineStubs from '../../resources/Utilities/timelineActionStubs';
import type {SingleDealType} from '../../@types/Pages/Deals/SingleDeal';
import {feedbackInvoled, feedbackReason} from '@brixel-io/brixel-components/dist/constants/FeedbackEmail';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import ReviewOfferModal from './Offer/ReviewOfferModal';
import {setModal} from '../../actions/CommonActions';

const SingleDeal = (props: SingleDealType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeSingleOffer,
    activeSingleDeal,
    activeSingleProperty,
    activeSinglePropertyDeals,
    activeSingleVisitFeedback,
    getActiveDeal,
    getDealNotes,
    getHistoryList,
    handleGetActiveSingleOffer,
    handleGetScheduleVisit,
    handleSaveDeal,
    handleSaveMultipleDeal,
    handleSetModal,
    lang,
    scheduleVisit,
    setActiveSingleDealHistory,
    setActiveSingleDealOwnerHistory,
    setDeal,
    setDealNotes,
    windowDimensions,
  } = props;

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [winnerId, setWinnerId] = useState('');
  const [showFullFeedback, setShowFullFeedback] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const {
    factsOptions,
  } = FactsOptions;

  const propID = get(match, 'propID', null);
  const dealID = get(match, 'dealID', null);

  const optionsRef = useRef(null);

  useEffect(() => () => {
    setDeal({});
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
      })
    }
  }, [activeSingleDeal.id]);

  useEffect(() => {
    if (dealID) {
      handleGetActiveSingleOffer({ id: dealID, smallLoader: 'getOffer' });
    }
  }, [dealID]);

  useEffect(() => {
    forEach(activeSinglePropertyDeals, (el) => {
      if (has(el, 'winner') && el.winner === true) setWinnerId(el.id);
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
    find(factsOptions.progressBarDealsOptions, (element: {label: string, value: string}) => {
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
            theme="text"
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
    return 'text';
  };

  const getOfferSaturation = () => {
    if (has(activeSingleDeal, 'closing.stageOffer.offer.status')) return 100;
    return 200;
  };

  const getOfferTextColor = () => {
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'accepted') return 'Green400';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'pending') return 'Yellow400';
    if (get(activeSingleDeal, 'closing.stageOffer.offer.status') === 'rejected') return 'Red400';
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
      component: <ReviewOfferModal closeModal={() => handleSetModal({})} />,
    })
  }

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
          icon: 'close-circle',
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

  setTimeout(() => {setIsReady(true)}, 300);

  return (
    <>
      {
        isReady ? (
          <>
            {
              activeSingleDeal.id && (
                <div className="dashboardContainer mt-0 mt-md-3 dis-f jc-b" id="dashboard">
                  <div className="w-perc-100">
                    <div className="single-deal dis-fl-col max-w-fix-1024">
                      {/* top panel */}
                      <div className="actions dis-fl-row jc-b pb-2">
                        <div className="pt-2 pr-1 pr-lg-0 pt-lg-0">
                          <BrixelButtonIcon
                            icon="arrow-left-small"
                            ghost
                            theme="text"
                            onClick={() => history.push(`/${propID}/prospects`)}
                          />
                        </div>
                        <OptionsDropdown className="pt-2 pt-lg-0" showMobile showDesktop />
                      </div>
                      <div className="top dis-fl-row jc-b mb-0 mb-lg-4 pb-3">
                        <div className="user dis-fl-row col-md-7">
                          <BrixelAvatar
                            size='M'
                            avatarImg={activeSingleDeal.user?.avatarUrl}
                            name={Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', ''), get(activeSingleDeal, 'user.lastName', ''), get(activeSingleDeal, 'user.name', '')) === 'No Name' ? get(activeSingleDeal, 'user.email', '') : Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', ''), get(activeSingleDeal, 'user.lastName', ''), get(activeSingleDeal, 'user.name', ''))}
                            profileId={get(activeSingleDeal.user, 'id', '')}
                          />

                          <div className="title dis-fl-col ml-2">
                            <span
                              className={`name dis-b fsize-500 fweight-500 ${get(activeSingleDeal, 'user.name') ? 'txtText900' : 'txtText500'}`}
                            >
                              {Helpers.userNameVal(get(activeSingleDeal, 'user.firstName', ''), get(activeSingleDeal, 'user.lastName', ''), get(activeSingleDeal, 'user.name', ''))}
                            </span>
                            <div className="dis-f">
                              {
                                get(activeSingleDeal, 'user.email', null) && (
                                  <a
                                    className="txtText900 link mr-2"
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

                            {
                              get(activeSingleDeal, 'user.phone.number', null) ? (
                                <span className="value txtText900">{Helpers.telephoneFormat(activeSingleDeal.user.phone)}</span>
                              ) : (
                                <span className="value txtText900">-</span>
                              )
                            }
                          </div>
                        </div>
                        {/* <div className="pos-r dis-f a-c">
                          <OptionsDropdown
                            btnClass="shadow-3dp"
                            className=""
                            showMobile
                          />
                        </div> */}
                      </div>

                      {/* middle panel */}
                      <div className="mid dis-fl-row-md flex-wrap mb-lg-0 pos-r">
                        <div className="left dis-fl-col col-md-6 p-0">
                          <div className="detail-part dis-fl-row">
                            <div className="dis-fl-col col-6 p-0">

                            </div>
                          </div>

                        </div>
                        <div className="right dis-fl-col col-md-6 p-0">


                          <div className="mb-3 hide">
                            <span className="overline mb-2">{translateTo('Showings', lang)}</span>
                            <BrixelButtonSecondary
                              className="p-0 as-fs"
                              label={translateTo('Add date', lang)}
                              rounded
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
                              bgTransparent
                              leftIcon="money"
                              onClick={() => ''}
                            />
                          </div>
                        </div>
                      </div>

                      {/* bottom panel */}
                      <div className="bottom dis-fl-col dis-fl-row-sm w-perc-100 h-perc-100 py-3 pos-r p-0">
                        <Timeline
                          isDeal
                          className="col-12 col-sm-6 p-0"
                        />
                        <div className="dis-fl-col-md col-12 col-sm-6 px-0">

                          <div className="progress dis-fl-col mb-5">
                            <div>
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
                            </div>
                          </div>

                          <div className="visit dis-fl-col mb-5">
                            <span className="overline dis-b mb-3">{translateTo('Visit', lang)}</span>
                            <div>
                              {
                                scheduleVisit.length === 0 && (
                                  <div className="dis-f a-c p-small-12 brdText100 brdSmall brdRadius bgWhite">
                                    <BrixelIcon
                                      icon="calendar"
                                      background="blue"
                                      saturation={50}
                                      color="blue"
                                      saturationTxt={400}
                                      className="mr-2"
                                    />
                                    <span
                                      className={`txt${getOfferTextColor()} fweight-500`}>{translateTo('No visit requests yet', lang)}</span>
                                  </div>
                                )
                              }
                              {
                                scheduleVisit.map((slots, i) => (
                                  <div
                                    className="visit-container mb-2 brdRadius bgWhite brdText100 brdSmall dis-fl-col"
                                    key={`visitsList${i.toString()}`}
                                  >
                                    {
                                      slots.buyerAvailability.length > 0 && !slots?.visit?.date && (
                                        <>
                                          <div className="dis-fl-row p-small-12">
                                            <BrixelIcon
                                              icon="calendar"
                                              background="blue"
                                              saturation={50}
                                              color="blue"
                                              saturationTxt={400}
                                              className="mr-2 as-fs"
                                            />
                                            <div className="dis-fl-col jc-b">
                                              <h6 className="mb-1">{translateTo('Suggested Dates:', lang)}</h6>
                                              {
                                                slots.buyerAvailability.map((visit, f) => (
                                                  <div
                                                    key={`visit${f.toString()}`}
                                                    className="dis-f a-c"
                                                  >
                                                    <span className="px-1"> &bull; </span>
                                                    <span className="mr-1">
                                                      {visit.start ? DateTime.fromMillis(visit.start, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                      }).toFormat('dd LLL yyyy') : null}
                                                    </span>
                                                    <span>
                                                      {visit.start ? DateTime.fromMillis(visit.start, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                      }).toFormat('HH:mm') : null}
                                                    </span>
                                                    <span className="mx-snall-4">-</span>
                                                    <span>
                                                      {visit.end ? DateTime.fromMillis(visit.end, {
                                                        locale: lang,
                                                        zone: visit.timezone,
                                                      }).toFormat('HH:mm') : null}
                                                    </span>
                                                  </div>
                                                ))
                                              }
                                            </div>
                                          </div>
                                        </>
                                      )
                                    }
                                    {
                                      slots?.visit?.date && (
                                        <>
                                          <div className="dis-fl-row jc-fs px-small-12 pt-small-12">
                                            <BrixelIcon
                                              icon="calendar"
                                              background="blue"
                                              saturation={50}
                                              color="blue"
                                              saturationTxt={400}
                                              className="mr-2 as-fs"
                                            />
                                            <div className="dis-fl-row a-c jc-b">
                                              <div className="dis-fl-col">
                                                <h6>{translateTo('Visit Date:', lang)}</h6>
                                                <div className="dis-f a-c jc-b">
                                                  <p className="txtGreen400 fweight-500">
                                                    {DateTime.fromMillis(slots.visit.date, {
                                                      locale: lang,
                                                      zone: slots.visit.timezone,
                                                    }).toFormat('dd LLL yyyy, HH:mm')}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                          </div>
                                          <div className="pb-small-12 px-small-12 ml-7">
                                            <hr className="lighter my-2" />
                                            <h6>{translateTo('Confirmation:', lang)}</h6>
                                            <div>
                                              <div className="dis-f a-c jc-b">
                                                <span>{translateTo('Buyer', lang)}</span>
                                                <BrixelIcon
                                                  icon={getStatusStyle(slots.buyerStatus).icon}
                                                  color={getStatusStyle(slots.buyerStatus).color}
                                                  saturation={getStatusStyle(slots.buyerStatus).saturation}
                                                />
                                              </div>
                                              <div className="dis-f a-c jc-b">
                                                <span>{translateTo('Seller', lang)}</span>
                                                <BrixelIcon
                                                  icon={getStatusStyle(slots.sellerStatus).icon}
                                                  color={getStatusStyle(slots.sellerStatus).color}
                                                  saturation={getStatusStyle(slots.sellerStatus).saturation}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {
                                            slots.buyerAvailability.length > 0 && (
                                              <div className="pb-small-12 px-small-12 ml-7">
                                                <hr className="lighter my-2" />
                                                <div className="dis-fl-col jc-b">
                                                  <h6 className="mb-1">{translateTo('Suggested Dates:', lang)}</h6>
                                                  {
                                                    slots.buyerAvailability.map((visit, f) => (
                                                      <div
                                                        key={`visit${f.toString()}`}
                                                        className="dis-f a-c"
                                                      >
                                                        <span className="px-1"> &bull; </span>
                                                        <span className="mr-1">
                                                          {visit.start ? DateTime.fromMillis(visit.start, {
                                                            locale: lang,
                                                            zone: visit.timezone,
                                                          }).toFormat('dd LLL yyyy') : null}
                                                        </span>
                                                        <span>
                                                          {visit.start ? DateTime.fromMillis(visit.start, {
                                                            locale: lang,
                                                            zone: visit.timezone,
                                                          }).toFormat('HH:mm') : null}
                                                        </span>
                                                        <span className="mx-snall-4">-</span>
                                                        <span>
                                                          {visit.end ? DateTime.fromMillis(visit.end, {
                                                            locale: lang,
                                                            zone: visit.timezone,
                                                          }).toFormat('HH:mm') : null}
                                                        </span>
                                                      </div>
                                                    ))
                                                  }
                                                </div>
                                              </div>
                                            )
                                          }
                                        </>
                                      )
                                    }
                                  </div>
                                ))
                              }
                            </div>
                          </div>

                          <div className="feedback dis-fl-col mb-5">
                            <div className="dis-fl-row a-c jc-b mb-3">
                              <span className="overline">{translateTo('Feedback', lang)}</span>
                            </div>
                            <div
                              className="brdRadius bgWhite brdText100 brdSmall pos-r dis-fl-col p-small-12 w-perc-100">
                              <div className="dis-fl-row jc-b">
                                <div className="dis-f a-c">
                                  <BrixelIcon
                                    icon="calendar"
                                    background={typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 'green' : 'light'}
                                    saturation={typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 100 : 100}
                                    color={typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 'green' : 'text'}
                                    saturationTxt={typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? 400 : 900}
                                    className="mr-2"
                                  />
                                  {typeof activeSingleVisitFeedback?.isInterested === 'boolean' ? (
                                    <span
                                      className={activeSingleVisitFeedback?.isInterested ? 'txtGreen400' : 'txtRed400'}>
                                      {activeSingleVisitFeedback?.isInterested ? translateTo('Interested 👍', lang) : translateTo('Not interested 👎', lang)}
                                    </span>
                                  ) : (
                                    <span>No feedback</span>
                                  )
                                  }
                                </div>
                              </div>
                              {
                                typeof activeSingleVisitFeedback?.isInterested === 'boolean' && (
                                  <div className="dis-fl-col">
                                    {
                                      typeof activeSingleVisitFeedback?.isInterested !== 'undefined' && (
                                        <div className={`mt-1 dis-fl-row jc-b ${showFullFeedback === true ? 'mb-2' : ''}`}>
                                          <span className="txtText900 fsize-300">{translateTo('Details:', lang)} </span>
                                          <BrixelIcon
                                            iconSize="small"
                                            icon={`${showFullFeedback === true ? 'arrow-simple-up' : 'dropdown'}`}
                                            className="txtText900 cur-poi pr-1"
                                            onClick={(e) => {
                                              if (e) e.preventDefault();
                                              setShowFullFeedback(!showFullFeedback);
                                            }}
                                          />
                                        </div>
                                      )
                                    }
                                    {
                                      showFullFeedback && (
                                        <div className="dis-fl-col fsize-300 txtText600">
                                          {
                                            activeSingleVisitFeedback?.reasons && activeSingleVisitFeedback?.reasons.length > 0 && (
                                              <div>
                                                <span className="mr-1">Reasons:</span>
                                                {
                                                  activeSingleVisitFeedback?.reasons.filter(el => el !== 'other').map((reason, index) => (
                                                    <React.Fragment key={`reason${index.toString()}`}>
                                                      {index > 0 && (<span>, </span>)}
                                                      <span key={`reason${index.toString()}`}>
                                                        {feedbackReason.find((itm) => (itm.value === reason))?.label}
                                                      </span>

                                                    </React.Fragment>
                                                  ))

                                                }
                                                {
                                                  activeSingleVisitFeedback?.reasons.filter(el => el === 'other').length === 1 && activeSingleVisitFeedback?.reasonsOther && (
                                                    <>,<>&nbsp;</>
                                                      <span>{translateTo('Other: ', lang)}{activeSingleVisitFeedback?.reasonsOther}</span></>
                                                  )
                                                }
                                              </div>
                                            )
                                          }
                                          {
                                            activeSingleVisitFeedback?.involvedPurchaseProperty && (
                                              <div>
                                                <span className="mr-1">Current status:</span>
                                                <span>{feedbackInvoled.find((itm) => itm.value === activeSingleVisitFeedback.involvedPurchaseProperty)?.label}</span>
                                              </div>
                                            )
                                          }
                                          {
                                            activeSingleVisitFeedback?.note && (
                                              <div>
                                                <span className="mr-1">Note:</span>
                                                <span>{activeSingleVisitFeedback.note}</span>
                                              </div>
                                            )
                                          }
                                        </div>
                                      )
                                    }
                                  </div>
                                )
                              }
                            </div>
                          </div>

                          <div className="offers dis-fl-col mb-5">
                            <span className="overline dis-b mb-3">{translateTo('Offer', lang)}</span>
                            <div
                              className="brdRadius brdSmall brdText100 pos-r dis-fl-col bgWhite p-2 w-perc-100">
                              {
                                !activeSingleOffer.id && (
                                  <div className="dis-fl-row jc-b">
                                    <div className="dis-f a-c">
                                      <BrixelIcon
                                        icon="money"
                                        background={getOfferBackground()}
                                        saturation={getOfferSaturation()}
                                        color={getOfferColor()}
                                        saturationTxt={400}
                                        className="mr-2"
                                      />
                                      <span
                                        className={'fweight-500'}>
                                        {translateTo('No Offer', lang)}
                                      </span>
                                    </div>
                                  </div>
                                )
                              }
                              {
                                activeSingleOffer.id && (
                                  <div className={`dis-fl-col fsize-300 txt${getOfferTextColor()}`}>
                                    <BrixelSingleTag
                                      status={activeSingleOffer?.status}
                                      message={{
                                        pending: 'Pending',
                                        accepted: 'Accepted',
                                        rejected: 'Rejected',
                                      }}
                                      lang={lang}
                                    />
                                    <h3 className={`mt-2 ${Helpers.getDataByStatus(activeSingleOffer).color}`}>
                                      <span className="mr-1">{activeSingleOffer.currency || 'CHF'}</span>
                                      <span>{Helpers.formatNumberValue(activeSingleOffer.amount, activeSingleOffer.currency)}</span>
                                    </h3>

                                    {
                                      activeSingleOffer.updatedAt && (
                                        <p className="txtText600 fsize-300">
                                          {DateTime.fromMillis(activeSingleOffer.updatedAt, {}).toFormat('dd LLL yyyy, HH:mm')}
                                        </p>
                                      )
                                    }
                                    <div className="dis-f a-c mt-2">
                                      <BrixelButtonSecondary
                                        className="mr-2"
                                        rounded
                                        label={translateTo('View details', lang)}
                                        onClick={() => history.push(`/${propID}/prospect/${dealID}/offer`)}
                                      />
                                      <BrixelButtonPrimary
                                        className=""
                                        rounded
                                        label={translateTo('Review', lang)}
                                        onClick={() => onClickReview()}
                                      />
                                    </div>
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </>
        ) : (
          <div className="dashboardContainer mt-0 mt-md-3" id="dashboard">
            <div className="pb-2">
              <BrixelButtonIcon
                icon="arrow-left-small"
                ghost
                theme="text"
                onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
              />
            </div>
            <div className="dis-f mt-2 mt-lg-0 p-2 p-lg-0 mb-lg-4">
              <div className="w-fix-40 h-fix-40 brdCircle skeletonBg"></div>
              <div className="div">
                <div className="w-fix-96 skeletonBg h-fix-24 ml-2" />
                <div className="w-fix-192 skeletonBg h-fix-16 mt-1 ml-2" />
              </div>
            </div>
            <div className="py-2 px-lg-0 dis-f flex-wrap mb-lg-2 pos-r">
              <div className="col-12 col-lg-7 pr-0">
                <div className="w-fix-96 skeletonBg h-fix-24" />
                <div className="dis-f">
                  <div className="mt-2 dis-fl-col w-perc-50">
                    <div className="w-fix-96 skeletonBg h-fix-8" />
                    <div className="w-fix-192 skeletonBg h-fix-16 mt-1" />
                  </div>
                  <div className="mt-2 dis-fl-col w-perc-50">
                    <div className="w-fix-96 skeletonBg h-fix-8" />
                    <div className="w-fix-192 skeletonBg h-fix-16 mt-1" />
                  </div>
                </div>
              </div>
              <div className="col-5 px-lg-0 mt-3 mt-lg-0">
                <div className="w-fix-96 skeletonBg h-fix-24" />
                <div className="dis-f jc-b">
                  <div className="mt-2 dis-fl-col">
                    <div className="w-fix-192 skeletonBg h-fix-16 mt-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="dis-fl-col dis-fl-row-sm jc-b py-3 px-2 mt-3 mt-lg-5 h-perc-50">
              <div className="w-perc-100 w-perc-sm-50 pr-sm-2 h-perc-50">
                <div className="w-fix-96 skeletonBg h-fix-8"></div>
                <div className="w-perc-100 brdRadius skeletonBg h-perc-100 mt-3"></div>
              </div>
              <div className="w-perc-100 w-perc-sm-50 pl-sm-2 h-perc-50">
                <div className="w-fix-96 skeletonBg h-fix-8"></div>
                <div className="w-perc-100 brdRadius skeletonBg h-perc-100 mt-3"></div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
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
  handleGetActiveSingleOffer:bindActionCreators(getActiveSingleOffer, dispatch),
  handleGetScheduleVisit: bindActionCreators(getScheduleVisit, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
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
