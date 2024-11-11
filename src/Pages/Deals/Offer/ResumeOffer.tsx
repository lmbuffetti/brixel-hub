import React from 'react';
import {
  BrixelIcon,
  FactsOptions,
  Helpers,
} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import translateTo from '../../../utils/translation';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import {DealType} from '@brixel-io/brixel-components/dist/@types/Model';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';

const { factsOptions } = FactsOptions;

type ResumeOfferType = {
  activeSingleDeal: DealType
  activeSingleOffer: OfferType
  closeModal: () => void
  lang: string
  onClick: (action: 'accepted' | 'rejected') => void
}

const objAnswer = {
  offerDetail: [
    {
      title: 'Type of purchase',
      name: 'additionalBuyerInfo.typeOfPurchase',
    },
    {
      title: 'Comment',
      name: 'noteByBuyer',
      classAnswer: 'fs-i',
    },
  ],
  personalDetail: [
    {
      title: 'Full name',
      name: 'user.name',
    },
    {
      title: 'Email',
      name: 'user.email',
    },
    {
      title: 'Phone number',
      name: 'user.phone',
    },
    {
      title: 'Birth date',
      name: 'additionalBuyerInfo.dateBirth',
    },
    {
      title: 'Marital status',
      name: 'additionalBuyerInfo.maritialStatus',
    },
    {
      title: 'Matrimonial property regime',
      name: 'additionalBuyerInfo.matrimonialPropertyRegime',
    },
    {
      title: 'Living address',
      name: 'location',
    },
  ],
}

const ResumeOffer = ({
  activeSingleDeal,
  activeSingleOffer,
  closeModal,
  lang,
  onClick,
}: ResumeOfferType) => {
  const purchaseType = factsOptions.purchaseType.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.typeOfPurchase', ''));
  const martialStatus = factsOptions.martialStatus.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.maritialStatus', ''));
  const matrimonialPropertyRegime = factsOptions.matrimonialPropertyRegime.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.matrimonialPropertyRegime', ''));


  const returnData = (item) => {
    if (!item.name) return '';
    if (item.name.includes('user')) {
      if (item.name === 'user.phone') {
        return Helpers.telephoneFormat(get(activeSingleDeal, item.name, ''));
      }
      return get(activeSingleDeal, item.name, '')
    }
    if (item.name === 'additionalBuyerInfo.dateBirth') {
      return DateTime.fromMillis(get(activeSingleOffer, item.name, 0), {locale: lang}).toFormat('dd/MM/yyyy')
    }
    if (item.name === 'additionalBuyerInfo.typeOfPurchase') {
      return translateTo(purchaseType?.label || '', lang);
    }
    if (item.name === 'additionalBuyerInfo.maritialStatus') {
      return translateTo(martialStatus?.label || '', lang);
    }
    if (item.name === 'additionalBuyerInfo.matrimonialPropertyRegime') {
      return translateTo(matrimonialPropertyRegime?.label || '', lang);
    }
    if (item.name === 'location')  {
      return `${get(activeSingleOffer, item.name, {})?.street || ''} ${get(activeSingleOffer, item.name, {})?.streetNumber || ''}, ${get(activeSingleOffer, item.name, {})
        ?.zipCode || ''} ${get(activeSingleOffer, item.name, {})?.city || ''}`;
    }
    return translateTo(get(activeSingleOffer, item.name, ''), lang)
  }

  const getFirstName = () => {
    const fullName = get(activeSingleDeal, 'user.name', '');
    return fullName.split(' ')[0] || '';
  };

  return (
    <>
      <h2 className="ta-c fweight-600 pt-3">
        <span>{getFirstName()}</span>
        <span>{translateTo('\'s offer details', lang)}</span>
      </h2>

      {
        activeSingleOffer.status && activeSingleOffer.status !== 'pending' && (
          <div className={`${Helpers.getDataByStatus(activeSingleOffer).bg} dis-f a-c brdRadius p-2 mt-3`}>
            <BrixelIcon
              className="mr-1"
              icon={Helpers.getDataByStatus(activeSingleOffer).icon}
              color={Helpers.getDataByStatus(activeSingleOffer).colorName}
            />
            <p className={Helpers.getDataByStatus(activeSingleOffer).color}>
              {translateTo(activeSingleOffer.status === 'accepted' ? 'You’ve accepted this offer.' : 'You’ve rejected this offer.', lang)}
            </p>
          </div>
        )
      }


      <div className='mt-4'>
        <h6 className="mb-2 fweight-600">{translateTo('Offer details', lang)}</h6>

        <div className="brdRadius bgWhite brdSmall brdText100 p-3">
          <div className="mb-3">
            <p className="fsize-300 fweight-500 mb-small-4">{translateTo('Your offer', lang)}</p>
            <p className="fsize-600 txtGreen400">
              <span className="mr-1">{activeSingleOffer.currency}</span>
              <span className="ff-mono">
                {Helpers.formatNumberValue(activeSingleOffer.amount, activeSingleOffer.currency)}
              </span>
            </p>
          </div>

          {
            objAnswer.offerDetail.map((item, index) => (
              <React.Fragment key={`offerDetail${index.toString()}`}>
                {
                  returnData(item) && (
                    <div className={index < objAnswer.offerDetail.length - 1 ? 'mb-3' : ''}>
                      <p className="fsize-300 fweight-500 mb-small-4">{translateTo(item.title, lang)}</p>
                      <p>
                        {returnData(item)}
                      </p>
                    </div>
                  )
                }
              </React.Fragment>
            ))
          }

        </div>

      </div>
      <div className="mt-4">

        <h6 className="mb-2 fweight-600">{translateTo('Personal details', lang)}</h6>

        <div className="brdRadius bgWhite brdSmall brdText100 p-3">

          {
            objAnswer.personalDetail.map((item, index) => (
              <React.Fragment key={`personalDetail${index.toString()}`}>
                {
                  returnData(item)&& (
                    <div className={index < objAnswer.personalDetail.length - 1 ? 'mb-3' : ''}>
                      <p className="fsize-300 fweight-500 mb-small-4">{translateTo(item.title, lang)}</p>
                      <p>
                        {returnData(item)}
                      </p>
                    </div>
                  )
                }
              </React.Fragment>
            ))
          }

        </div>
      </div>

      <div className="mt-4 pb-5">
        <h6 className="mb-2 fweight-600">{translateTo('Proof of financing', lang)}</h6>
        <div className="brdRadius bgWhite brdSmall brdText100 p-2">
          {
            activeSingleOffer.documents && activeSingleOffer.documents.length > 0 ? (
              <>
                {
                  activeSingleOffer.documents.map((file, index) => (
                    <div
                      key={index}
                      className={`dis-f a-c jc-sb dis-f jc-b a-c ${index < activeSingleOffer.documents.length - 1 ? 'mb-3' : ''}`}
                    >
                      <div className="dis-f a-c mt-a mb-a">
                        <BrixelIcon
                          background="green"
                          saturation={100}
                          color="green"
                          saturationTxt={400}
                          icon="document"
                        />
                        <p className="fsize-300 ml-2">{file.name}</p>
                      </div>
                      <BrixelButtonSecondary
                        rounded
                        small
                        label={translateTo('View', lang)}
                        onClick={() => window.open(file.loadUrl, '_blank')}
                      />
                    </div>
                  ))
                }
              </>
            ) : (
              <div className="dis-f a-t">
                <BrixelIcon
                  icon='info'
                  color='green'
                />
                <div className="ml-1">
                  <p className="fweight-600 fsize-300">{translateTo('No proof of financing uploaded yet.', lang)}</p>
                  <p className='fsize-300'>{translateTo('You can apply for a free proof of financing from our partners later.', lang)}</p>
                </div>
              </div>
            )
          }
        </div>
      </div>

      {
        activeSingleOffer.status && activeSingleOffer.status !== 'pending' ? (
          <div className="dis-f jc-c a-c mb-4">
            <BrixelButtonPrimary
              rounded
              className="ml-small-4"
              label={translateTo('Close', lang)}
              onClick={() => closeModal()}
            />
          </div>
        ) : (
          <div className="dis-f jc-c a-c mb-4">
            <BrixelButtonSecondary
              rounded
              className="mr-small-4"
              label={translateTo('Reject', lang)}
              onClick={() => onClick('rejected')}
              theme="red"
            />
            <BrixelButtonPrimary
              rounded
              className="ml-small-4"
              label={translateTo('Accept', lang)}
              onClick={() => onClick('accepted')}
            />
          </div>
        )
      }


    </>
  )
  ;
}

export default ResumeOffer;
