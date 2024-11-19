import { BrixelButtonIcon, BrixelStatus, BrixelTooltip, Helpers } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import has from 'lodash/has';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose } from 'redux';
import api from '../../controllers/api/config';
// import ProgressBarPercentage from '../ProgressBarPercentage';
import timelineActionStubs from '../../resources/Utilities/timelineActionStubs';
import translateTo from '../../utils/translation';

import type { DealsCardProps } from '../../@types/components/Cards/DealsCard';
import { HistoryType, ScheduleVisitRequestType } from '@brixel-io/brixel-components/dist/@types/Model';
import BrixelSingleTag from '@brixel-io/brixel-components/dist/components/BrixelSingleTag';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';

const DealsCard = (props: DealsCardProps) => {
  const match = useParams();
  const {
    archOnClick = () => '',
    archived,
    className,
    date,
    id,
    isNew,
    isWinner,
    isQualified,
    lang,
    name,
    offer,
    parentOnClick = () => '',
    profileId,
    stage,
    // probability,
  } = props;

  const [lastAction, setLastAction] = useState<HistoryType>({});
  const [visitDate, setVisitDate] = useState<ScheduleVisitRequestType['visit']>();
  const [visitStatus, setVisitStatus] = useState<{status: string; text: string; color: string;}>();
  const [offerData, setOfferData] = useState<OfferType | object>()
  const [feedback, setFeedback] = useState({})


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

  useEffect(() => {
    if (id && stage === 'Visit') {
      api.deal.getScheduleVisit(id).then((res) => {
        if (res?.data[0]) {
          setFeedback(res?.data[0]?.visitFeedback);
          setVisitDate(res?.data[0]?.visit || {});
          const visitInfo = Helpers.getDataByStatus(res?.data[0] || {});
          setVisitStatus(visitInfo);
        }
      })
    }
    if (id && stage === 'Offer') {
      api.deal.getOffer(id).then((res) => {
        setOfferData(res.data.payload)
      })
        .catch(() => {
          setOfferData({})
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
    if (get(offerData, 'status') === 'pending') return 'Yellow';
    if (get(offerData, 'status') === 'accepted') return 'Green';
    if (get(offerData, 'status') === 'rejected') return 'Red';
    return 'Dark';
  };

  const getFeedback = () => {
    if (get(feedback, 'isInterested') === true) return `<span class="txtGreen400">${translateTo('Interested 👍', lang)}</span>`;
    if (get(feedback, 'isInterested') === false) return `<span class="txtRed400">${translateTo('Not interested 👎', lang)}</span>`;
    return translateTo('Visited', lang);
  };

  //  const progressState = probability ? probability : undefined;


  return (
    <>
      <div
        className={`dealsCard ${archived ? '' : 'cur-as'} dis-fl-col p-small-12 mb-1 brdSmall  ${isWinner ? 'bgGreen50 brdGreen100' : 'brdText100 bgWhite'} brdRadius min-h-fix-136 ${className}`}
        onClick={() => parentOnClick()}
      >
        <div className="dis-f jc-b a-c">

          {/*  <ProgressBarPercentage
            progressState={progressState}
            dealCard
            small
            readOnly
          /> */}

          {
            !isWinner && get(offerData, 'status') && stage === 'Offer' && (
              <BrixelSingleTag
                className="statusTag pb-small-4"
                lang={lang}
                message={{
                  lang: lang,
                  [get(offerData, 'status') as string]: translateTo(get(offerData, 'status')!.charAt(0).toUpperCase() + get(offerData, 'status')!.slice(1), lang),
                }}
                status={get(offerData, 'status') as string}
                text={translateTo(get(offerData, 'status')!, lang)}
              />
            )
          }



          {
            !isWinner && visitStatus && stage === 'Visit' && (
              <BrixelSingleTag
                lang={lang}
                message={{
                  lang: lang,
                  [visitStatus.status]: translateTo(visitStatus.text, lang),
                }}
                status={visitStatus.status}
                text={translateTo(visitStatus.text, lang)}
              />
            )
          }
          {
            isWinner && (
              <span className="dis-f jc-c a-c px-1 pt-small-4 pb-small-2 bgGreen400 txtWhite fsize-200 brdRadiusSmall"> {translateTo('Winner', lang)} </span>
            )
          }
        </div>


        <div className="dis-fl-row a-c mt-1">
          <span className={`name dis-b txtText800 notranslate fweight-600 ${name === 'No name' ? 'txtText500' : 'txtText900'}`}> {name} </span>
          {
            isQualified && (
              <BrixelTooltip
                className="ml-1"
                theme="blue"
                description={`${translateTo('Qualified', lang)}`}
                width="auto"
                iconColor="green"
                icon="qualified"
              />
            )
          }
        </div>
        {
          stage === 'Interested' && (
            <span
              className={`metaMessage fsize-300 txtText700 dis-b ${!lastAction ? 'isLoadingDiv' : ''}`}
              dangerouslySetInnerHTML={{
                __html: Helpers.sanitizeText(returnMessage()),
              }}
            />
          )
        }
        {
          stage === 'Visit' && (
            <>

              <div className="mb-small-6">
                {
                  visitStatus && (
                    <>

                      {
                        !visitDate?.date ? (
                          <p className="fsize-300">
                            {translateTo('Waiting for visit date', lang)}
                          </p>
                        ) : (
                          <p className={`fsize-300 fweight-600 ${visitStatus.color} ${visitStatus.status === 'cancelled' ? 'td-lt' : ''}`}>
                            {DateTime.fromMillis(visitDate.date, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                          </p>
                        )
                      }
                    </>
                  )
                }
              </div>

              {
                (get(feedback, 'isInterested') === true || get(feedback, 'isInterested') === false) && (
                  <p>
                    <span className="fsize-300 txtText700">Feedback: </span>
                    <span className="fsize-300 txtText700" dangerouslySetInnerHTML={{ __html: getFeedback()}} />
                  </p>
                )
              }
            </>
          )
        }

        {
          stage === 'Offer' && (
            <div className="dis-fl-row a-c metaMessage">
              {
                has(offerData, 'amount') ? (
                  <>
                    <span className={`txt${getOfferColor()}400 fweight-600 ff-mono fsize-400 ${get(offerData, 'status') === 'rejected' ? 'td-lt' : ''}`}>
                      {get(offerData, 'currency', '')} {Helpers.formatNumberValue(offerData?.amount || 0, get(offerData, 'currency', ''))}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="fsize-400 txtText700">{translateTo('No offer', lang)}</span>
                  </>
                )
              }
            </div>
          )
        }

        <div className="dis-f a-c notranslate mt-a">
          {
            isNew ? (
              <div className="dis-fl-row a-c">

                <BrixelStatus
                  className="zIndex0"
                  color="primary"
                />

                <span className="date pl-1 fsize-300 fweight-600 txtText900">
                  {date}
                </span>
              </div>
            ) : (
              <span className="date fsize-300 txtText300">
                {date}
              </span>
            )
          }
        </div>

      </div>
      <BrixelButtonIcon
        theme="text"
        ghost
        small
        icon="archive"
        className={`archiveBtn pos-a bt x-r mr-1 ${archived? 'mb-4' : 'mb-1'}`}
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
