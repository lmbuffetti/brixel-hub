import React from 'react';
import '../../../../../styles/SCSS/components/makeOfferTimeline.scss'
import {
  Helpers,
  translateTo} from '@brixel-io/brixel-components';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';

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


  const offerRow = (status, icon) => {
    let titleText = ''
    switch (status) {
      case 'accepted':
        titleText = 'The property owner accepted your offer of:'
        break;
      case 'rejected':
        titleText = 'The property owner rejected your offer of:'
        break;
      case 'pending':
        titleText = 'Your offer is pending'
        break;
      default:
        titleText = 'Your offer is pending'
        break;
    }
    return (
      <li className={`${icon}`}>
        <div className="brdBottom">
          <h6 className="time">
            <span>
              {translateTo(titleText, lang)}
            </span>
            <span className="txtRed400 fweight-700 ml-1">
              <span className="mr-1">
                {activeSingleOffer?.currency || 'CHF'}
              </span>
              <span className="ff-mono">
                {Helpers.formatNumberValue(activeSingleOffer?.amount, activeSingleOffer?.currency || 'CHF')}
              </span>
            </span>
          </h6>
          {
            activeSingleOffer?.noteBySeller && (
              <p className="fs-i txtText600">
                {activeSingleOffer?.noteBySeller}
              </p>
            )
          }
          {
            activeSingleOffer?.updatedAt && (
              <p className="fsize-300 txtText600">
                {DateTime.fromMillis(activeSingleOffer?.updatedAt, {locale: lang}).toFormat('dd LLL yyyy, H:mm')}
              </p>
            )
          }
        </div>
      </li>
    )
  }

  return (
    <div className="makeOfferTimeline bgWhite brdRadius py-3 px-6">
      <ul className="sessions">
        {
          activeSingleOffer.status === 'rejected' && (
            <>
              {offerRow(activeSingleOffer.status, 'house')}

              {offerRow(activeSingleOffer.status, 'key')}
            </>
          )
        }
        {
          activeSingleOffer.history && activeSingleOffer.history.map((history, index) => (
            <React.Fragment key={`history${index.toString()}`}>
              {offerRow(history.status, 'house')}
            </React.Fragment>
          ))
        }
      </ul>
    </div>
  )
}

export default MakeOfferTimeline;
