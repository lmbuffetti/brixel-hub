import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import getConfigEnv from '@brixel/brixel-components/dist/configuration/Settings';
import {
  BrixelButtonIcon,
  BrixelAvatar,
  BrixelStatus,
  BrixelIcon,
  Helpers,
} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import { useParams } from 'react-router-dom';
import {
  DateTime,
} from 'luxon';
import TimelineActionStubs from '../../resources/Utilities/timelineActionStubs';
import api from '../../controllers/api/config';

const DealsCard = (props) => {
  const match = useParams();
  const {
    className,
    name,
    parentOnClick,
    archOnClick,
    date,
    feedback,
    offer,
    profileId,
    archived,
    isWinner,
    isNew,
    stage,
    visit,
    lang,
  } = props;
  
  const [lastAction, setLastAction] = useState({})

  const propID = get(match, 'propID', null);

  const returnMessage = () => {
    if (Object.keys(lastAction).length > 0) {
      if (lastAction.actionStub === 'user-add-favorite') return translateTo('Marked page as favorite', lang);
      if (lastAction.actionStub === 'user-schedule') return translateTo('Requested showing', lang);
      if (lastAction.actionStub === 'user-get-document') return translateTo('Requested documents', lang);
      if (lastAction.actionStub === 'user-phone-call') return translateTo('Made a phone call', lang);
      if (lastAction.actionStub === 'user-portal-create-deal') return translateTo('Interacted through portal', lang);
      if (lastAction.actionStub === 'user-portal') return translateTo('Interacted through portal', lang);
      if (lastAction.actionStub === 'user-message') return translateTo('Sent a message', lang);
      if (lastAction.actionStub === 'user-portal-create-message') return `<span><span>${translateTo('Sent new message on', lang)}</span> <span>${lastAction.meta.portal}</span></span>`;
      if (lastAction.actionStub === 'user-send-message') {
        return translateTo(`"${lastAction.meta.message}"`, lang);
      }
    } else if (offer === '') return translateTo('Made an offer', lang);
    return '';
  };
  
  useEffect(() => {
    if (stage === 'Interested') {
      const queryParams = `?parent=${profileId}&child=${propID}&order=DESC&direction=createdAt&historyType=user`;
      api.history.getHistoryList(1, 0, queryParams, TimelineActionStubs.DealLastAction)
        .then((res) => {
          setLastAction(get(res, 'data.data.[0]', {}));
        });
    }
  }, [profileId]);

  const getIcon = () => {
    if (visit < +new Date().setHours(0, 0, 0, 0)) return 'calendar-check';
    return 'calendar';
  };

  const getColor = () => {
    if (visit < +new Date().setHours(0, 0, 0, 0)) return 'dark';
    return 'green';
  };

  const getSaturation = () => {
    if (visit < +new Date().setHours(0, 0, 0, 0)) return 700;
    return 400;
  };

  const getTextColor = () => {
    if (visit < +new Date().setHours(0, 0, 0, 0)) return 'Dark700';
    return 'Green400';
  };

  const getVisit = () => {
    if (visit < +new Date().setHours(0, 0, 0, 0)) return translateTo('Visited', lang);
    return DateTime.fromMillis(visit, { locale: lang }).toFormat('d LLL yyyy, H:mm');
  };

  const getOfferColor = () => {
    if (offer.offer.status === 'pending') return 'Yellow';
    if (offer.offer.status === 'accepted') return 'Green';
    if (offer.offer.status === 'rejected') return 'Red';
    return 'Dark';
  };

  const getFeedback = () => {
    if (feedback.isInterested === true) return translateTo('Still interested 👍', lang);
    if (feedback.isInterested === false) return translateTo('Not interested anymore 👎', lang);
    return 'Visited';
  };

  return (
    <>
      <div
        className={`dealsCard ${archived ? '' : 'cur-as'} dis-f p-small-12 mb-3 shadow-1dp brdRadius h-fix-120 ${className}`}
        onClick={() => parentOnClick()}
      >
        <div className="leftPanel pr-2">
          <BrixelAvatar
            baseURL={get(getConfigEnv, 'shortPath', '')}
            name={name}
            profileId={profileId}
            className="notranslate"
          />
        </div>
        <div className="rightPanel dis-fl-col jc-b">
          <div className="topPart">
            <span className={`name dis-b txtDark700 fsize-300 notranslate fweight-600 ${name === 'No name' ? 'txtDark100' : 'txtDark700'}`}> {name} </span>
            {
              stage === 'Interested' && (
                <span
                  className="metaMessage fsize-300 txtDark700 dis-b"
                  dangerouslySetInnerHTML={{
                    __html: returnMessage(),
                  }}
                />
              )
            }
            {
              stage === 'Visit' && (
                // eslint-disable-next-line no-nested-ternary
                visit === null || visit.length === 0 ? (
                  <div className="dis-fl-row a-c">
                    <BrixelIcon
                      icon="calendar-add"
                      color="dark"
                      className="mr-1"
                      iconWidth="w-fix-16"
                    />
                    <span className="fsize-300 txtDark700">{translateTo('No date', lang)}</span>
                  </div>
                ) : (
                  (get(feedback, 'isInterested') === true || get(feedback, 'isInterested') === false) ? (
                    <span className="fsize-300 txtDark700">{getFeedback()}</span>
                  ) : (
                    <div className="dis-fl-row a-c">
                      <BrixelIcon
                        icon={getIcon()}
                        noBorder
                        color={getColor()}
                        saturationTxt={getSaturation()}
                        className="mr-1"
                        iconWidth="w-fix-16"
                      />
                      <span className={`txt${getTextColor()} fsize-300`}>{getVisit()}</span>
                    </div>
                  )
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
                          noBorder
                          color={getOfferColor()}
                          saturationTxt={400}
                          className="mr-1"
                          iconWidth="w-fix-16"
                        />
                        <span className={`txt${getOfferColor()}400 fsize-300`}>{get(offer, 'offer.currency', '')} {Helpers.formatNumberValue(get(offer, 'offer.amount', 0), get(offer, 'offer.currency', 0))}</span>
                      </>
                    ) : (
                      <>
                        <BrixelIcon
                          icon="money"
                          noBorder
                          color="dark"
                          saturationTxt={200}
                          className="mr-1"
                          iconWidth="w-fix-16"
                        />
                        <span className="fsize-300 txtDark200">{translateTo('No offer', lang)}</span>
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
                  <span className="date fsize-200 fweight-600 txtDark700">
                    {date}
                  </span>
                </div>
              ) : (
                <span className="date fsize-100 txtDark200">
                  {date}
                </span>
              )
            }
            {
              isWinner && (
                <span className="cardTag green ml-1">{translateTo('Winner', lang)}</span>
              )
            }
          </div>
        </div>
      </div>
      <BrixelButtonIcon
        theme="dark"
        ghost
        icon="archive"
        className="archiveBtn pos-a bt x-r mr-1 mb-1"
        onClick={(e) => {
          e.preventDefault();
          archOnClick();
        }}
      />
    </>
  );
};

DealsCard.propTypes = {
  archOnClick: PropTypes.func,
  archived: PropTypes.bool,
  className: PropTypes.string,
  date: PropTypes.string,
  feedback: PropTypes.object,
  isNew: PropTypes.bool,
  isWinner: PropTypes.bool,
  lang: PropTypes.string,
  name: PropTypes.string,
  offer: PropTypes.object,
  parentOnClick: PropTypes.func,
  profileId: PropTypes.string,
  stage: PropTypes.string,
  visit: PropTypes.number,
};

DealsCard.defaultProps = {
  archOnClick: () => '',
  archived: false,
  className: '',
  date: '',
  feedback: {},
  isNew: false,
  isWinner: false,
  lang: 'en',
  name: '',
  offer: {},
  parentOnClick: () => '',
  profileId: '',
  stage: '',
  visit: 0,
};

export default DealsCard;
