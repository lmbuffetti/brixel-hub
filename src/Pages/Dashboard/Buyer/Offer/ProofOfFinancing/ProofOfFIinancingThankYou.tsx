import React from 'react';
import {connect} from 'react-redux';
import {
  BrixelButtonText,
  BrixelButtonSecondary,
  Helpers,
} from '@brixel-io/brixel-components';
import translateTo from '../../../../../utils/translation';
import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';
import PhoneIcon from '../../../../../images/Boutique/phoneIcon.svg';
import MessageIcon from '../../../../../images/Boutique/messageIcon.svg';
import MailIcon from '../../../../../images/Boutique/mailIcon.svg';
import DocumentFullIcon from '../../../../../images/documentsIcon/documentFull.svg';
import {formValueType} from '../../../../../resources/Offers/ProofOfFinancing';

type ProofOfFinancingThankYouProps = {
  activeSingleCompany: CompanyType
  formValue: formValueType;
  lang: string;
}

const ProofOfFinancingThankYou = ({
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
    'Property exposé - download here',
  ]
  return (
    <>
      {
        isElegible ? (
          <>
            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-3 p-sm-5">
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
              </div>

              <p className="txtText600 mt-3 fsize-300">
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
            <div className="dis-f a-c jc-b mt-3">
              <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
                <img loading="lazy" className="w-fix-56 w-fix-lg-104" src={PhoneIcon} alt="Call Us" />
                <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
                  <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3">

                    <h6>{translateTo('Call Us', lang)}</h6>
                    <BrixelButtonText
                      bgTransparent
                      onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
                      className="ml-a mr-a"
                      label={Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
                    />
                  </div>
                </div>
              </div>
              <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
                <img loading="lazy" className="w-fix-56 w-fix-lg-104" src={MessageIcon} alt="Call Us" />
                <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3">

                  <h6>{translateTo('Text us via WhatsApp', lang)}</h6>
                  <BrixelButtonText
                    bgTransparent
                    onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''), false, false, true))}
                    className="ml-a mr-a"
                    label={Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))}
                  />
                </div>
              </div>
              <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
                <img loading="lazy" className="w-fix-56 w-fix-lg-104" src={MailIcon} alt="Call Us" />
                <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3">

                  <h6>{translateTo('Write Us', lang)}</h6>
                  <BrixelButtonText
                    bgTransparent
                    onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
                    className="ml-a mr-a"
                    label={get(activeSingleCompany, 'contact.email', '')}
                  />
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
