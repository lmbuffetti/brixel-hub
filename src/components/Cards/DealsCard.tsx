import { BrixelAvatar, BrixelButtonIcon, BrixelIcon, BrixelStatus, Helpers } from '@brixel/brixel-components';
import get from 'lodash/get';
import has from 'lodash/has';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose } from 'redux';
import api from '../../controllers/api/config';
import timelineActionStubs from '../../resources/Utilities/timelineActionStubs';
import translateTo from '../../utils/translation';

import type { DealsCardProps } from '../../@types/components/Cards/DealsCard';
import { HistoryType, ScheduleVisitRequestType } from '@brixel/brixel-components/dist/@types/Model';
import BrixelSingleTag from '@brixel/brixel-components/dist/components/BrixelSingleTag';

const DealsCard = (props: DealsCardProps) => {
  const match = useParams();
  const {
    archOnClick = () => '',
    archived,
    avatarImg,
    className,
    date,
    feedback,
    id,
    isNew,
    isWinner,
    lang,
    name,
    offer,
    parentOnClick = () => '',
    profileId,
    stage,
  } = props;

  const [lastAction, setLastAction] = useState<HistoryType>({});
  const [visitDate, setVisitDate] = useState<ScheduleVisitRequestType['visit']>();
  const [visitStatus, setVisitStatus] = useState<{status: string; text: string; color: string;}>();

  const propID = get(match, 'propID', null);

  const returnMessage = () => {
    if (lastAction && Object.keys(lastAction).length > 0) {
      if (get(lastAction, 'actionStub') === 'default') return translateTo('Default', lang);
      if (get(lastAction, 'actionStub') === 'user-add-favorite') return translateTo('Marked page as favorite', lang);
      if (get(lastAction, 'actionStub') === 'user-schedule') return translateTo('Requested showing', lang);
      if (get(lastAction, 'actionStub') === 'user-get-document') return translateTo('Requested documents', lang);
      if (get(lastAction, 'actionStub') === 'user-phone-call') return translateTo('Made a phone call', lang);
      if (get(lastAction, 'actionStub') === 'user-portal-create-deal') return translateTo('Interacted through portal', lang);
      if (get(lastAction, 'actionStub') === 'user-portal') return translateTo('Interacted through portal', lang);
      if (get(lastAction, 'actionStub') === 'user-message') return translateTo('Sent a message', lang);
      if (get(lastAction, 'actionStub') === 'user-portal-create-message') return `<span><span>${translateTo('Sent new message on', lang)}</span> <span>${get(lastAction, 'meta.portal')}</span></span>`;
      if (get(lastAction, 'actionStub') === 'user-send-message') {
        return `"${get(lastAction, 'meta.message')}"`;
      }
    } else if (offer === '') return translateTo('Made an offer', lang);
    return '';
  };

  const visitDateStatus = (visitData) => {
    let data = {
      color: 'txtYellow400',
      text: 'Pending',
      status: 'pending',
    };
    if (visitData && visitData.visit.date < new Date().valueOf()) {
      data = {
        color: 'txtBlue400',
        text: 'Visited',
        status: 'visited',
      };
    } else if (visitData && visitData?.sellerStatus === 'rejected' || visitData && visitData?.buyerStatus === 'rejected') {
      data = {
        color: 'txtRed400',
        text: 'Cancelled',
        status: 'cancelled',
      };
    } else if (visitData && visitData?.sellerStatus === 'accepted' || visitData && visitData?.buyerStatus === 'accepted') {
      data = {
        color: 'txtGreen400',
        text: 'Confirmed',
        status: 'accepted',
      };
    }
    setVisitStatus(data);
  }

  useEffect(() => {
    if (id && stage === 'Visit') {
      api.deal.getScheduleVisit(id).then((res) => {
        setVisitDate(res?.data[0]?.visit || {});
        visitDateStatus(res?.data[0] || {});
      })
    }
  }, [id]);

  useEffect(() => {
    if (stage === 'Interested' && propID) {
      const queryParams = `?parent=${profileId}&child=${propID}&order=DESC&direction=createdAt&historyType=user`;
      api.history.getHistoryList(1, 0, queryParams, timelineActionStubs.DealLastAction)
        .then((res) => {
          setLastAction(get(res, 'data.data.[0]', {}));
        });
    }
  }, [profileId]);

  const getOfferColor = () => {
    if (get(offer, 'offer.status') === 'pending') return 'Yellow';
    if (get(offer, 'offer.status') === 'accepted') return 'Green';
    if (get(offer, 'offer.status') === 'rejected') return 'Red';
    return 'Dark';
  };

  const getFeedback = () => {
    if (get(feedback, 'isInterested') === true) return translateTo('Still interested 👍', lang);
    if (get(feedback, 'isInterested') === false) return translateTo('Not interested anymore 👎', lang);
    return translateTo('No date', lang);
  };

  return (
    <>
      <div
        className={`dealsCard ${archived ? '' : 'cur-as'} dis-f p-small-12 mb-3 shadow-1dp brdRadius h-fix-120 ${className}`}
        onClick={() => parentOnClick()}
      >
        <div className="leftPanel pr-2">
          <BrixelAvatar
            avatarImg={avatarImg}
            name={name}
            profileId={profileId}
            className="notranslate"
          />
        </div>
        <div className="rightPanel dis-fl-col jc-b">
          <div className="topPart">
            <span className={`name dis-b txtText900 fsize-300 notranslate fweight-600 ${name === 'No name' ? 'txtText500' : 'txtText900'}`}> {name} </span>
            {
              stage === 'Interested' && (
                <span
                  className={`metaMessage fsize-300 txtText900 dis-b ${!lastAction ? 'isLoadingDiv' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: Helpers.sanitizeText(returnMessage()),
                  }}
                />
              )
            }
            {
              stage === 'Visit' && (
                !visitDate?.date ? (
                  <div className="dis-fl-row a-c">
                    <BrixelIcon
                      icon="calendar-add"
                      color="text"
                      className="mr-1"
                      iconWidth="w-fix-16"
                    />
                    <span className="fsize-300 txtText900">{translateTo('No date', lang)}</span>
                  </div>
                ) : (
                  <>
                    {
                      (get(feedback, 'isInterested') === true || get(feedback, 'isInterested') === false) ? (
                        <span className="fsize-300 txtText900">{getFeedback()}</span>
                      ) : (
                        <div className="mb-1">
                          {
                            visitStatus && (
                              <>
                                <BrixelSingleTag
                                  className="mt-1 mb-1"
                                  lang={lang}
                                  message={{
                                    lang: lang,
                                    [visitStatus.status]: translateTo(visitStatus.text, lang),
                                  }}
                                  status={visitStatus.status}
                                  text={translateTo(visitStatus.text, lang)}
                                />
                                {
                                  !visitDate?.date && visitStatus?.status === 'pending' && !visitStatus ? (
                                    <p className="fsize-200">
                                      No date
                                    </p>
                                  ) : (
                                    <p className={`fsize-200 ${visitStatus.color}`}>
                                      {DateTime.fromMillis(visitDate.date, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                                    </p>
                                  )
                                }
                              </>
                            )
                          }
                        </div>
                      )
                    }
                  </>
                )
              )
            }
            {
              stage === 'Offer' && (
                <div className="dis-fl-row a-c">
                  {
                    has(offer, 'offer.amount') ? (
                      <>
                        <BrixelIcon
                          icon="money"
                          color={getOfferColor()}
                          saturationTxt={400}
                          className="mr-1"
                          iconWidth="w-fix-16"
                        />
                        <span className={`txt${getOfferColor()}400 fsize-300`}>{get(offer, 'offer.currency', '')} {Helpers.formatNumberValue(get(offer, 'offer.amount', 0), get(offer, 'offer.currency', ''))}</span>
                      </>
                    ) : (
                      <>
                        <BrixelIcon
                          icon="money"
                          color="text"
                          saturationTxt={200}
                          className="mr-1"
                          iconWidth="w-fix-16"
                        />
                        <span className="fsize-300 txtText600">{translateTo('No offer', lang)}</span>
                      </>
                    )
                  }
                </div>
              )
            }
          </div>
          <div className="dis-f a-c notranslate">
            {
              isNew ? (
                <div className="dis-fl-row a-c">
                  <BrixelStatus
                    className="mr-1 zIndex0"
                    color="primary"
                  />
                  <span className="date fsize-200 fweight-600 txtText900">
                    {date}
                  </span>
                </div>
              ) : (
                <span className="date fsize-100 txtText600">
                  {date}
                </span>
              )
            }
            {
              isWinner && (
                <span className="cardTag green ml-1"> {translateTo('Winner', lang)} </span>
              )
            }
          </div>
        </div>
      </div>
      <BrixelButtonIcon
        theme="text"
        ghost
        icon="archive"
        className="archiveBtn pos-a bt x-r mr-1 mb-1"
        onClick={(e) => {
          e.preventDefault();
          archOnClick();
        }}
        label={archived ? translateTo('Unarchive', lang) : translateTo('Archive', lang)}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(connect(mapStateToProps, null))(DealsCard);
