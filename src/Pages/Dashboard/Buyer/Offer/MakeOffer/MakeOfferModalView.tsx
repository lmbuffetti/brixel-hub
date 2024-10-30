import React from 'react';
import {
  BrixelIcon,
  FactsOptions,
  Helpers,
} from '@brixel-io/brixel-components';
import {connect} from 'react-redux';
import get from 'lodash/get';
import translateTo from '../../../../../utils/translation';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import PageHeader from '../../../../../components/Header/PageHeader';
import PageFooter from '../../../../../components/Footer/PageFooter';

const { factsOptions } = FactsOptions;

type MakeOfferModalViewType = {
  activeSingleOffer: OfferType;
  closeModal: () => void;
  lang: string;
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
      name: 'additionalBuyerInfo.fullName',
    },
    {
      title: 'Email',
      name: 'additionalBuyerInfo.email',
    },
    {
      title: 'Phone number',
      name: 'additionalBuyerInfo.phone',
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

const MakeOfferModalView = ({
  activeSingleOffer,
  closeModal,
  lang,
}: MakeOfferModalViewType) => {
  const purchaseType = factsOptions.purchaseType.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.typeOfPurchase', ''));
  const martialStatus = factsOptions.martialStatus.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.maritialStatus', ''));
  const matrimonialPropertyRegime = factsOptions.matrimonialPropertyRegime.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.matrimonialPropertyRegime', ''));


  const returnData = (item) => {
    if (item.name === 'additionalBuyerInfo.phone') {
      return Helpers.telephoneFormat(get(activeSingleOffer, item.name, ''));
    }
    if (item.name === 'additionalBuyerInfo.dateBirth') {
      return DateTime.fromMillis(get(activeSingleOffer, item.name, 0), {locale: lang}).toFormat('dd/MM/yyyy')
    }
    if (item.name === 'additionalBuyerInfo.typeOfPurchase') {
      return purchaseType?.label || '';
    }
    if (item.name === 'additionalBuyerInfo.maritialStatus') {
      return martialStatus?.label || '';
    }
    if (item.name === 'additionalBuyerInfo.matrimonialPropertyRegime') {
      return matrimonialPropertyRegime?.label || '';
    }
    if (item.name === 'location')  {
      return `${get(activeSingleOffer, item.name, {}).street} ${get(activeSingleOffer, item.name, {}).streetNumber}, ${get(activeSingleOffer, item.name, {}).zipCode} ${get(activeSingleOffer, item.name, {}).city}`;
    }

    return get(activeSingleOffer, item.name, '')
  }

  return (
    <div className="h-perc-100 dis-fl-col bgText25">
      <PageHeader
        isFlow
        onClose={() => closeModal()}
        showFooter
      />
      <div className="max-w-fix-600 mx-a w-perc-100 h-perc-100">
        <h2 className="ta-c pt-3">
          {translateTo('Your offer details', lang)}
        </h2>
        <div className='mt-4'>
          <h6 className="mb-2 fweight-600">{translateTo('Your offer details', lang)}</h6>

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
                    get(activeSingleOffer, item.name, '') && (
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

          <h6 className="mb-2 fweight-600">{translateTo('Your personal details', lang)}</h6>

          <div className="brdRadius bgWhite brdSmall brdText100 p-3">

            {
              objAnswer.personalDetail.map((item, index) => (
                <React.Fragment key={`personalDetail${index.toString()}`}>
                  {
                    get(activeSingleOffer, item.name, '') && (
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

        <div className="mt-4">
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
                        <div className="dis-f a-c">
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
      </div>
      <PageFooter />
    </div>
  )
  ;
}


const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || null,
  activeSingleOffer: state?.deal?.activeSingleOffer || {},
  formValue: state?.brixelForm?.makeOffer?.values || {},
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(MakeOfferModalView);
