import React, {useEffect, useRef, useState} from 'react';
import {
  BrixelAvatar,
  BrixelButtonIcon,
  BrixelButtonSecondary,
  BrixelDropdownMini,
  BrixelIcon,
  FactsOptions,
  Helpers,
  useOutsideAlerter,
} from '@brixel-io/brixel-components';
import {change} from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
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
  getActiveSingleDeal,
  saveActiveSingleDeal,
  setActiveSingleDeal,
  updateMultipleDeals,
} from '../../actions/DealActions';
import {getHistoryListings, setDealHistoryListings, setDealOwnerHistoryListings} from '../../actions/HistoryActions';
import {getNoteListings, setDealNoteListings} from '../../actions/NoteActions';

// COMPONENTS
import ProgressBar from '../../components/ProgressBar';
import Timeline from '../../components/Timeline';
import {formatPrice} from '../../utils/helpers';
import translateTo from '../../utils/translation';

import TimelineStubs from '../../resources/Utilities/timelineActionStubs';
import type {SingleDealType} from '../../@types/Pages/Deals/SingleDeal';
import {DealType} from '@brixel-io/brixel-components/dist/@types/Model';

const SingleDeal = (props: SingleDealType) => {
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
  const [activeDealFeedback, setActiveDealFeedback] = useState<DealType>();
  const [showFullFeedback, setShowFullFeedback] = useState(false);
  const [showFullOffer, setShowFullOffer] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const {
    factsOptions,
  } = FactsOptions;

  const propID = get(match, 'propID', null);

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
        actionStubs: TimelineStubs.Deal,
        smallLoader: 'getDealHistory',
      };
      getActiveDeal({ id: dealID, property: propID, smallLoader: 'getDeal' });
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

  const getIcon = () => {
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 'calendar-check';
    return 'calendar';
  };

  const getColor = () => {
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 'text';
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
    if (activeSingleDeal.visit < +new Date().setHours(0, 0, 0, 0)) return 'Text900';
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
    get(activeSingleDeal, 'closing.stageOffer.offer.buyer.dateBirth', 0),
    {
      locale: lang,
    },
  ).toFormat('yyyy-MM-dd')}
    </span></span>      </br><span>${translateTo('Marital status:', lang)}</span><span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.buyer.maritialStatus', ''), lang)} </span>
      </br><span>${translateTo('Place of origin:', lang)}</span><span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.buyer.placeOfOrigin', ''), lang)} </span>
      </br><span>${translateTo('Type of purchase:', lang)}</span><span class="ml-small-4">${translateTo(get(activeSingleDeal, 'closing.stageOffer.offer.buyer.typeOfPurchase', ''), lang)} </span>
      <span class="dis-b"><span>${translateTo('Comment', lang)}<span class="lh-in">:</span> </span><span class="word-b fweight-500">${get(activeSingleDeal, 'closing.stageOffer.offer.noteByBuyer', '')} </span></span></br>`;
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
    if (activeDealFeedback) {
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
                            onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                          />
                        </div>
                        <OptionsDropdown className="pt-2 pt-lg-0" showMobile showDesktop />
                      </div>
                      <div className="top dis-fl-row jc-b mb-0 mb-lg-4 pb-3">
                        <div className="user dis-fl-row col-md-7">
                          <BrixelAvatar
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
                      <div className="mid dis-fl-row-md flex-wrap mb-lg-2 pos-r">
                        <div className="left dis-fl-col col-md-6 p-0">
                          <span className="fsize-200 overline tt-up mb-2">{translateTo('Information', lang)}</span>

                          <div className="detail-part dis-fl-row">
                            <div className="dis-fl-col col-6 p-0">
                              <div className="dis-fl-col ta-l mb-2">
                                <span className="subtitle fsize-200 txtText600">{translateTo('Phone', lang)}</span>
                                {
                                  get(activeSingleDeal, 'user.phone.number', null) ? (
                                    <span className="value txtText900">{Helpers.telephoneFormat(activeSingleDeal.user.phone)}</span>
                                  ) : (
                                    <span className="value txtText900">-</span>
                                  )
                                }
                              </div>
                            </div>
                          </div>

                        </div>
                        <div className="right dis-fl-col col-md-6 p-0">
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
                          {
                            (get(activeSingleDeal, 'visit', null) && get(activeSingleDeal, 'visit', '').toString().length !== 0) && (
                              <>
                                <span className="overline mb-3">{translateTo('Visit', lang)}</span>
                                <div className="brdRadius brdSmall brdText200 pos-r dis-fl-col bgWhite p-small-12 w-perc-100 mb-4">
                                  <div className="dis-f a-c">
                                    <BrixelIcon
                                      icon={getIcon()}
                                      background={getBackground()}
                                      saturation={getSaturation()}
                                      color={getColor()}
                                      saturationTxt={700}
                                      className="mr-2"
                                    />
                                    <span className={`txt${getTextColor()}`}>{DateTime.fromMillis(activeSingleDeal.visit, { locale: lang }).toFormat('d LLL yyyy, H:mm')}</span>
                                  </div>
                                  {
                                    activeDealFeedback && activeDealFeedback.createdAt && (
                                      <div className="dis-fl-col">
                                        <div className={`mt-1 dis-fl-row jc-b ${showFullFeedback === true ? 'mb-2' : ''}`}>
                                          {
                                            activeDealFeedback.meta.visitFeedback.isInterested === true ? (
                                              <span className="txtText900 fsize-300">{translateTo('Still interested 👍', lang)}</span>
                                            ) : (
                                              <span className="txtText900 fsize-300">{translateTo('Not interested anymore 👎', lang)}</span>
                                            )
                                          }
                                          <BrixelIcon
                                            icon={`${showFullFeedback === true ? 'arrow-simple-up' : 'dropdown'}`}
                                            className="txtText900 cur-poi"
                                            onClick={() => setShowFullFeedback(!showFullFeedback)}
                                          />
                                        </div>
                                        {
                                          showFullFeedback && (
                                            <div
                                              className="txtText900 fsize-300"
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

                          <span className="overline dis-b mb-3">{translateTo('Offer', lang)}</span>
                          <div className="brdRadius brdSmall brdText200 pos-r dis-fl-col bgWhite p-small-12 w-perc-100">
                            <div className="dis-fl-row jc-b">
                              <div className="dis-f a-c">
                                <BrixelIcon
                                  icon="money"
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
                                    <span className="txtText900 fsize-300">{translateTo('Offer details:', lang)}</span>
                                    <BrixelIcon
                                      icon={`${showFullOffer === true ? 'arrow-simple-up' : 'dropdown'}`}
                                      className="txtText900 cur-poi pr-1"
                                      onClick={() => setShowFullOffer(!showFullOffer)}
                                    />
                                  </div>
                                  {
                                    showFullOffer && (
                                      <div
                                        className="txtText900 fsize-300"
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
                <div className='w-fix-96 skeletonBg h-fix-24 ml-2' />
                <div className='w-fix-192 skeletonBg h-fix-16 mt-1 ml-2' />
              </div>
            </div>
            <div className="py-2 px-lg-0 dis-f flex-wrap mb-lg-2 pos-r">
              <div className="col-12 col-lg-7 pr-0">
                <div className='w-fix-96 skeletonBg h-fix-24' />
                <div className="dis-f">
                  <div className="mt-2 dis-fl-col w-perc-50">
                    <div className='w-fix-96 skeletonBg h-fix-8' />
                    <div className='w-fix-192 skeletonBg h-fix-16 mt-1' />
                  </div>
                  <div className="mt-2 dis-fl-col w-perc-50">
                    <div className='w-fix-96 skeletonBg h-fix-8' />
                    <div className='w-fix-192 skeletonBg h-fix-16 mt-1' />
                  </div>
                </div>
              </div>
              <div className="col-5 px-lg-0 mt-3 mt-lg-0">
                <div className='w-fix-96 skeletonBg h-fix-24' />
                <div className="dis-f jc-b">
                  <div className="mt-2 dis-fl-col">
                    <div className='w-fix-192 skeletonBg h-fix-16 mt-1' />
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
