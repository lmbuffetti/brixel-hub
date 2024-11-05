import React from 'react';
import '../../../../../styles/SCSS/components/makeOfferTimeline.scss'
import {
  BrixelSingleTag,
  Helpers,
} from '@brixel-io/brixel-components';
import {HistoryOfferType, OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import translateTo from '../../../../../utils/translation';
import {DealType} from '@brixel-io/brixel-components/dist/@types/Model';

type MakeOfferTimelineType = {
  activeSingleOffer: OfferType;
  buyerInfo?: DealType['user']
  handleViewOffer: () => void;
  isSeller?: boolean;
  lang: string;
}

const MakeOfferTimeline = ({
  activeSingleOffer,
  buyerInfo,
  handleViewOffer,
  isSeller,
  lang,
}: MakeOfferTimelineType) => {


  const offerRow = (singleOffer: HistoryOfferType, isArchived: boolean, index: number) => {
    let titleText = ''
    let colorPrice = 'txtGreen400'
    const type = singleOffer?.noteByBuyer ? 'seller' : 'buyer'
    let icon = type === 'seller' ? 'key' : 'house'
    const isActive = false
    if (type === 'seller') {
      switch (singleOffer?.status) {
        case 'accepted':
          titleText = 'The property owner accepted your offer of:'
          if (isSeller) titleText = 'You accepted your offer of:'
          colorPrice = 'txtGreen400'
          icon = 'house'
          break;
        case 'rejected':
          titleText = 'The property owner rejected your offer of:'
          if (isSeller) titleText = 'You rejected your offer of:'
          colorPrice = 'txtRed400'
          icon = 'house'
          break;
        case 'pending':
          titleText = 'You made an offer:'
          if (isSeller) titleText = '{{0}} made an offer:'
          icon = 'key'
          break;
        default:
          titleText = 'You made an offer:'
          if (isSeller) titleText = '{{0}} made an offer:'
          break;
      }
    } else if (!singleOffer.status) {
      titleText = 'You made an offer of:'
      colorPrice = 'txtGreen400'
    } else {
      switch (singleOffer?.status) {
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
          colorPrice = 'txtGreen400'
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
              <span
                className={`${singleOffer.status === 'accepted' ? `${colorPrice} fweight-700` : ''} ${isActive ? 'fweight-600' : 'fweight-500'}`}
                dangerouslySetInnerHTML={{__html: translateTo(titleText, lang, [`<b>${buyerInfo?.firstName}</b>`])}}
              />
              <span className={`${colorPrice} fweight-700 ml-1`}>
                <span className="mr-1 ff-mono">
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
              singleOffer?.historyCreatedAt && (
                <p className="fsize-300 txtText600">
                  {DateTime.fromMillis(singleOffer?.historyCreatedAt, {locale: lang}).toFormat('dd LLL yyyy, H:mm')}
                </p>
              )
            }
          </div>
          {
            !isArchived && ((index === 0 && activeSingleOffer.status === 'pending') || index === 1 && activeSingleOffer.status !== 'pending') && (
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

  const offerTimelineGroup = () => {
    const defResult: HistoryOfferType[][] = [[]];
    if (activeSingleOffer.history) {
      let numArray = 0;
      activeSingleOffer.history.forEach((history, index) => {
        if (!defResult[numArray]) defResult[numArray] = [];
        defResult[numArray].push(history);
        if (activeSingleOffer.status === 'pending' && index % 2 === 0) numArray++;
        else if (activeSingleOffer.status !== 'pending' && index > 0 && index % 2 !== 0) numArray++;
      })
    }
    return defResult;
  }

  return (
    <div className="makeOfferTimeline">
      {
        offerTimelineGroup() && offerTimelineGroup().map((group, index) => (
          <div
            className="bgWhite brdRadius py-2 pl-4 pr-2 py-md-3 pl-md-5 pr-md-3 mb-2 pos-r"
            key={`historyParent${index.toString()}`}
          >
            {
              index > 0 && (
                <BrixelSingleTag
                  className="pos-a-fix x-r-3"
                  lang={lang}
                  status="archived"
                  message={{archived: 'archived'}}
                />
              )
            }
            <ul className={`session ${index > 0 ? 'opacity6' : ''}`}>
              {
                group.map((history, subIndex) => (
                  <React.Fragment
                    key={`history${subIndex.toString()}`}
                  >
                    {offerRow(history, index > 0, subIndex)}

                  </React.Fragment>
                ))
              }
            </ul>
          </div>
        ))
      }
    </div>
  )
}

export default MakeOfferTimeline;
