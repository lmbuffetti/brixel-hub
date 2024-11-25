import React from 'react';
import {connect} from 'react-redux';
import {
  BrixelButtonSecondary,
  Helpers,
} from '@brixel-io/brixel-components';
import translateTo from '../../../../../utils/translation';
import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';
import PhoneIcon from '../../../../../images/Boutique/phoneIcon.svg';
import MessageIcon from '../../../../../images/Boutique/messageIcon.svg';
import MailIcon from '../../../../../images/Boutique/mailIcon.svg';
import DocumentFullIcon from '../../../../../images/documentsIcon/documentFull.svg';
import type {formValueType} from '../../../../../resources/Offers/ProofOfFinancing';

type ProofOfFinancingThankYouProps = {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType
  formValue: formValueType;
  lang: string;
}

const ProofOfFinancingThankYou = ({
  activeSingleProperty,
  activeSingleCompany,
  formValue,
  lang,
}: ProofOfFinancingThankYouProps) => {

  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const propID = get(match, 'propID', null);
  if (activeSingleCompany?.stub && activeSingleCompany?.stub !== 'ubs') history.push(`/buyer/${propID}/home`)
  const isElegible = formValue.affordabilityCheck && formValue.loanValueCheck;
  const documentsList = [
    'Latest tax declaration',
    'Latest proof of income, incl. proof of bonus if applicable',
    'Pension fund statement',
  ]
  const brochurePDF = activeSingleProperty?.documents ? activeSingleProperty?.documents.find((doc) => doc.isBrochure) : null;

  return (
    <>
      {
        isElegible ? (
          <>
            <div className="max-w-fix-456 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-3 p-sm-4">
              <p className="fweight-600">
                {translateTo('To ensure a smooth process, please prepare the following documents:', lang)}
              </p>
              <div>
                {
                  documentsList.map((doc, index) => (
                    <div
                      key={`docsList${index.toString()}`}
                      className="dis-f a-c mt-2"
                    >
                      <img
                        width={40}
                        height={40}
                        src={DocumentFullIcon}
                        alt={doc}
                        className="mr-2"
                      />
                      <span>{translateTo(doc, lang)}</span>
                    </div>
                  ))
                }
                {
                  brochurePDF && (
                    <div
                      className="dis-f a-c mt-2"
                    >
                      <img
                        width={40}
                        height={40}
                        src={DocumentFullIcon}
                        alt="Property Exposé"
                        className="mr-2"
                      />
                      <span>{translateTo('Property exposé -', lang)}</span>
                      <a href={brochurePDF?.loadUrl || ''} className="td-u ml-1 txtText900">{translateTo('download here', lang)}</a>
                    </div>
                  )
                }
              </div>

              <p className="txtText600 mt-3 fsize-300 fs-i">
                {translateTo('You can check this later again.', lang)}
              </p>
            </div>
            <BrixelButtonSecondary
              bgTransparent
              rounded
              label={translateTo('Go back to Offer', lang)}
              onClick={() => history.push(`/buyer/${propID}/offer`)}
              className="mt-4 mx-a"
            />
          </>
        )  :(
          <>
            <BrixelButtonSecondary
              bgTransparent
              rounded
              label={translateTo('Go back to Offer', lang)}
              onClick={() => history.push(`/buyer/${propID}/offer`)}
              className="mt-4 mx-a"
            />
            <div className="dis-fl-col dis-fl-row-md a-c jc-c mx-a mt-10 contactSection">
              <div className="dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100">
                <div className="bgGreen100 brdCircle p-1">
                  <img loading="lazy" className="w-fix-40 w-fix-md-56" src={PhoneIcon} alt="Call Us" />
                </div>

                <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3">

                  <h6>{translateTo('Call us', lang)}</h6>
                  <span
                    className='dis-b cur-poi txtGreen400 td-u'
                    onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
                  >
                    {Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
                  </span>
                </div>

              </div>
              <div className="dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100 mx-md-2">
                <div className="bgGreen100 brdCircle p-1">
                  <img loading="lazy" className="w-fix-40 w-fix-md-56" src={MessageIcon} alt="Call Us" />
                </div>
                <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3">

                  <h6>{translateTo('Text us via WhatsApp', lang)}</h6>

                  <span
                    className='dis-b cur-poi txtGreen400 td-u'
                    onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''), false, false, true))}
                  >
                    {Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))}
                  </span>
                </div>
              </div>
              <div className="dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100">
                <div className="bgGreen100 brdCircle p-1">
                  <img loading="lazy" className="w-fix-40 w-fix-md-56" src={MailIcon} alt="Call Us" />
                </div>
                <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3">

                  <h6>{translateTo('Write us', lang)}</h6>
                  <span
                    className='dis-b cur-poi txtGreen400 td-u'
                    onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
                  >
                    {get(activeSingleCompany, 'contact.email', '')}
                  </span>
                </div>
              </div>
            </div>
          </>
        )
      }

    </>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || {},
  activeSingleCompany: state?.companies?.activeSingleCompany || {},
  formValue: get(state, 'brixelForm.ProofOfFinancing.values', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(ProofOfFinancingThankYou);
