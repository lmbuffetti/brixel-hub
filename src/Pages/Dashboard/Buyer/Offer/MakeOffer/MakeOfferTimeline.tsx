import React from 'react';
import '../../../../../styles/SCSS/components/makeOfferTimeline.scss'
import {
  BrixelSingleTag,
  Helpers,
} from '@brixel-io/brixel-components';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import translateTo from '../../../../../utils/translation';

type MakeOfferTimelineType = {
  activeSingleOffer: OfferType;
  handleViewOffer: () => void;
  lang: string;
}

const MakeOfferTimeline = ({
  activeSingleOffer,
  handleViewOffer,
  lang,
}: MakeOfferTimelineType) => {


  const offerRow = (singleOffer, status, icon, showViewBtn = false, isActive = false) => {
    let titleText = ''
    let colorPrice = 'txtRed400'
    if (icon === 'house') {
      switch (status) {
        case 'accepted':
          titleText = 'The property owner accepted your offer of:'
          colorPrice = 'txtGreen400'
          break;
        case 'rejected':
          titleText = 'The property owner rejected your offer of:'
          colorPrice = 'txtRed400'
          break;
        case 'pending':
          titleText = 'Your offer is pending'
          break;
        default:
          titleText = 'Your offer is pending'
          break;
      }
    }
    if (icon === 'key') {
      switch (status) {
        case 'accepted':
          titleText = 'You made an offer of:'
          colorPrice = 'txtGreen400'
          break;
        case 'rejected':
          titleText = 'You made an offer of:'
          colorPrice = 'txtRed400'
          break;
        case 'pending':
          titleText = 'You made an offer of:'
          break;
        default:
          titleText = 'You made an offer of:'
          break;
      }
    }
    return (
      <li className={`${icon}`}>
        <div className="brdBottom dis-f a-c jc-b">
          <div>
            <h6>
              <span className={`${isActive ? 'fweight-600' : 'fweight-500'}`}>
                {translateTo(titleText, lang)}
              </span>
              <span className={`${colorPrice} fweight-700 ml-1`}>
                <span className="mr-1">
                  {singleOffer?.currency || 'CHF'}
                </span>
                <span className="ff-mono">
                  {Helpers.formatNumberValue(singleOffer?.amount, singleOffer?.currency || 'CHF')}
                </span>
              </span>
            </h6>
            {
              singleOffer?.noteBySeller && icon === 'house' && (
                <p className="fs-i txtText600">
                  {singleOffer?.noteBySeller}
                </p>
              )
            }
            {
              singleOffer?.noteByBuyer && icon === 'key' && (
                <p className="fs-i txtText600">
                  {singleOffer?.noteByBuyer}
                </p>
              )
            }
            {
              singleOffer?.updatedAt && icon === 'house' && (
                <p className="fsize-300 txtText600">
                  {DateTime.fromMillis(singleOffer?.updatedAt, {locale: lang}).toFormat('dd LLL yyyy, H:mm')}
                </p>
              )
            }
            {
              singleOffer?.createdAt && icon === 'key' && (
                <p className="fsize-300 txtText600">
                  {DateTime.fromMillis(singleOffer?.createdAt, {locale: lang}).toFormat('dd LLL yyyy, H:mm')}
                </p>
              )
            }
          </div>
          {
            showViewBtn && (
              <BrixelButtonSecondary
                rounded
                label={translateTo('View', lang)}
                onClick={() => handleViewOffer()}
              />
            )
          }
        </div>
      </li>
    )
  }

  return (
    <div className="makeOfferTimeline">

      {
        activeSingleOffer.status !== 'pending' && (
          <div className=" bgWhite brdRadius py-3 px-6 mb-2">
            <ul className="sessions">
              {offerRow(activeSingleOffer, activeSingleOffer.status, 'house', false, true)}
              {activeSingleOffer.status === 'rejected' && offerRow(activeSingleOffer, activeSingleOffer.status, 'key', true)}
            </ul>
          </div>
        )
      }
      {
        activeSingleOffer.history && activeSingleOffer.history.map((history, index) => (
          <div
            className="bgWhite brdRadius py-3 pl-6 pr-3 mb-2 pos-r"
            key={`history${index.toString()}`}
          >
            <BrixelSingleTag
              className="pos-a-fix x-r-3"
              lang={lang}
              status="archived"
              message={{archived: 'archived'}}
            />
            <ul className="session opacity6">
              {offerRow(history, history.status, 'house')}
              {history.status === 'rejected' && offerRow(history, history.status, 'key')}
            </ul>
          </div>
        ))
      }
    </div>
  )
}

export default MakeOfferTimeline;
