import React from 'react';
import {
  BrixelTooltip,
  BrixelIcon,
  FactsOptions,
  Helpers,
} from '@brixel-io/brixel-components';
import MakeOfferPropertyCard from '../../../../../components/Cards/MakeOfferPropertyCard';
import {connect} from 'react-redux';
import get from 'lodash/get';
import translateTo from '../../../../../utils/translation';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';

const { factsOptions } = FactsOptions;

type MakeOfferResumeType = {
  formValue: any;
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

const MakeOfferResume = ({
  formValue,
  lang,
}: MakeOfferResumeType) => {
  const purchaseType = factsOptions.purchaseType.find((item) => item.value === get(formValue, 'additionalBuyerInfo.typeOfPurchase', ''));
  const martialStatus = factsOptions.martialStatus.find((item) => item.value === get(formValue, 'additionalBuyerInfo.maritialStatus', ''));
  const matrimonialPropertyRegime = factsOptions.matrimonialPropertyRegime.find((item) => item.value === get(formValue, 'additionalBuyerInfo.matrimonialPropertyRegime', ''));


  const returnData = (item) => {
    if (item.name === 'additionalBuyerInfo.phone') {
      return Helpers.telephoneFormat(get(formValue, item.name, ''));
    }
    if (item.name === 'additionalBuyerInfo.dateBirth') {
      return DateTime.fromMillis(get(formValue, item.name, 0), {locale: lang}).toFormat('dd/MM/yyyy')
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
      return `${get(formValue, item.name, {}).street} ${get(formValue, item.name, {}).streetNumber}, ${get(formValue, item.name, {}).zipCode} ${get(formValue, item.name, {}).city}`;
    }

    return get(formValue, item.name, '')
  }

  const showPDF = (data) => {
    const pdfWindow = window.open('');
    if (pdfWindow) {
      const base64Info = data.split('base64,')
      pdfWindow.document.write('<html<head><title>PDF</title><style>body{margin: 0px;}</style></head>');
      pdfWindow.document.write(`<body><embed width='100%' height='100%' src='${base64Info[0]}base64, ${encodeURI(base64Info[1])}#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>`);
      pdfWindow.document.close();
    }
  }

  return (
    <div className="max-w-fix-768 mx-a">
      <MakeOfferPropertyCard />

      <div>
        <h6 className="mb-2">{translateTo('Your offer details', lang)}</h6>

        <div className="brdRadius bgWhite brdSmall brdText100 p-3">
          <div className="mb-3">
            <p className="fsize-300 fweight-500 mb-small-4">{translateTo('Offer price', lang)}</p>
            <p className="fsize-600 txtGreen400">
              <span className="mr-1">{formValue.currency}</span>
              <span className="ff-mono">{Helpers.formatNumberValue(formValue.amount, formValue)}</span>
            </p>
          </div>

          {
            objAnswer.offerDetail.map((item, index) => (
              <React.Fragment key={`offerDetail${index.toString()}`}>
                {
                  get(formValue, item.name, '') && (
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

        <div className="dis-f a-c mt-2">
          <p className="mr-1">{translateTo('This is a non-binding offer.', lang)}</p>
          <BrixelTooltip
            description={translateTo('This offer does not create any legal obligations and serves as a preliminary proposal. Final terms may change after further discussion.', lang)}
          />
        </div>

      </div>
      <div className="mt-4">

        <h6 className="mb-2">{translateTo('Your personal details', lang)}</h6>

        <div className="brdRadius bgWhite brdSmall brdText100 p-3">

          {
            objAnswer.personalDetail.map((item, index) => (
              <React.Fragment key={`personalDetail${index.toString()}`}>
                {
                  get(formValue, item.name, '') && (
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
        <h6 className="mb-2">{translateTo('Proof of financing', lang)}</h6>
        <div className="brdRadius bgWhite brdSmall brdText100 p-3">
          {
            formValue.documents && formValue.documents.length > 0 ? (
              <>
                {
                  formValue.documents.map((file, index) => (
                    <div
                      key={index}
                      className={`dis-f a-c jc-sb dis-f jc-b a-c ${index < formValue.documents.length - 1 ? 'mb-3' : ''}`}
                    >
                      <div className="dis-f a-c">
                        <BrixelIcon
                          background="green"
                          saturation={100}
                          color="green"
                          saturationTxt={400}
                          icon="document"
                        />
                        <p className="fsize-300 txtText600 ml-2">{file.name}</p>
                      </div>
                      <BrixelButtonSecondary
                        rounded
                        label={translateTo('View', lang)}
                        onClick={() => showPDF(file.file)}
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
                  <p className="fweight-600">{translateTo('No proof of financing uploaded yet.', lang)}</p>
                  <p>{translateTo('You can apply for a free proof of financing from our partners later.', lang)}</p>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
  ;
}


const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || null,
  formValue: state?.brixelForm?.makeOffer?.values || {},
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(MakeOfferResume);
