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

import {setWindowDimensions} from '../../../../../actions/CommonActions';
import get from 'lodash/get';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

type MakeOfferTimelineType = {
  activeSingleOffer: OfferType;
  buyerInfo?: DealType['user']
  handleViewOffer: () => void;
  isSeller?: boolean;
  lang: string;
  windowDimensions: { width: number, height: number }
}

const MakeOfferTimeline = ({
  activeSingleOffer,
  buyerInfo,
  handleViewOffer,
  isSeller,
  lang,
  windowDimensions,
}: MakeOfferTimelineType) => {


  const offerRow = (singleOffer: HistoryOfferType, isArchived: boolean, index: number) => {
    let titleText = ['']
    let colorPrice = 'txtGreen400'
    // const type = singleOffer?.status && singleOffer.status !== 'pending' ? 'seller' : 'buyer'
    let icon = singleOffer?.status ? 'house' : 'key'
    const isActive = false
    if (isSeller) {
      switch (singleOffer?.status) {
        case 'accepted':
          titleText = ['You accepted the offer:'];
          colorPrice = 'txtGreen400'
          icon = 'house'
          break;
        case 'rejected':
          titleText = ['You rejected the offer of:'];
          colorPrice = 'txtRed400'
          icon = 'house'
          break;
        case 'pending':
          titleText = [buyerInfo?.firstName, 'made an offer:'];
          icon = 'key'
          break;
        default:
          titleText = [buyerInfo?.firstName, 'made an offer:']
          break;
      }
    } else {
      switch (singleOffer?.status) {
        case 'accepted':
          titleText = ['The owner accepted the offer:'];
          colorPrice = 'txtGreen400'
          icon = 'house'
          break;
        case 'rejected':
          titleText = ['The owner rejected your offer of:'];
          colorPrice = 'txtRed400'
          icon = 'house'
          break;
        case 'pending':
          titleText = ['You made an offer:'];
          icon = 'key'
          break;
        default:
          titleText = ['You made an offer:'];
          break;
      }
    }
    return (
      <li className={`${icon}`}>
        <div className="brdBottom dis-fl-col dis-fl-row-md jc-b">
          <div className='w-perc-100'>
            <div className='dis-f a-t'>
              <div className='flex-1'>
                {
                  titleText.map((text, f) => (
                    <span
                      key={`title${f.toString()}`}
                      className={`${singleOffer.status === 'accepted' ? `${colorPrice} fweight-700` : ''} ${isActive ? 'fweight-600' : 'fweight-500'} ${titleText.length > 1 && f === 0 ? 'fweight-600 mr-small-4' : ''}`}
                    >
                      {translateTo(text, lang)}
                    </span>
                  ))
                }
                <span
                  className={`${singleOffer.status === 'accepted' ? `${colorPrice} fweight-700` : ''} ${isActive ? 'fweight-600' : 'fweight-500'}`}
                />
                <span className={`${colorPrice} fweight-700 pl-1`}>
                  <span className="pr-1 ff-mono">
                    {singleOffer?.currency || 'CHF'}
                  </span>
                  <span className="ff-mono">
                    {Helpers.formatNumberValue(singleOffer?.amount, singleOffer?.currency || 'CHF')}
                  </span>
                </span>
              </div>
              {
                isArchived && index === 0 && (

                  <BrixelSingleTag
                    lang={lang}
                    status="archived"
                    message={{archived: 'archived'}}
                  />
                )
              }
            </div>
            {
              singleOffer?.noteBySeller && icon === 'house' && (
                <p className="fs-i txtText600">
                  {translateTo(singleOffer?.noteBySeller, lang)}
                </p>
              )
            }
            {
              singleOffer?.noteByBuyer && icon === 'key' && (
                <p className="fs-i txtText600">
                  {translateTo(singleOffer?.noteByBuyer, lang)}
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
              <div className='mt-1 mt-md-0 ml-0 ml-lg-2'>
                <BrixelButtonSecondary
                  rounded
                  fullWidth={windowDimensions.width <= 1024}
                  label={translateTo(isSeller && (activeSingleOffer.status === 'pending' || !activeSingleOffer.status) ? 'Review' : 'View', lang)}
                  onClick={() => handleViewOffer()}
                />
              </div>
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
            className="bgWhite brdRadius py-2 pl-4 pr-2 py-md-3 pl-md-5 pr-md-3 mb-2 pos-r brdSmall brdText100"
            key={`historyParent${index.toString()}`}
          >
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

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', { width: 0, height: 0 }),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MakeOfferTimeline);
