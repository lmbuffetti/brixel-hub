import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import ThankYouImg from '../../images/Boutique/Doc_House.svg';
import translateTo from '../../utils/translation';
import get from 'lodash/get';
import MessageIcon from '../../images/Boutique/messageIcon.svg';
import PhoneIcon from '../../images/Boutique/phoneIcon.svg';
import MailIcon from '../../images/Boutique/mailIcon.svg';
import {
  BrixelButtonText,
  Helpers,
} from '@brixel-io/brixel-components';
import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Models/Companies';

type BrixelBoutiqueThankYouType = {
  activeSingleCompany: CompanyType
  lang: string;
}

const BrixelBoutiqueThankYou = (props: BrixelBoutiqueThankYouType) => {
  const {
    activeSingleCompany,
    lang,
  } = props;

  return (
    <div className="h-perc-100 max-w-fix-600 mx-a pt-32">
      <div className="ta-c">
        <img src={ThankYouImg} />
        <h2 className="boutiqueFont mt-5">{translateTo('Thank You', lang)}</h2>
        <p className="mt-2">{translateTo('Our Boutique experts will contact you shortly to clarify any questions and to proceed with the next steps.', lang)}</p>
      </div>

      <div className="mt-10">
        <b className="ta-c dis-b">
          {translateTo('We look forward to hearing from you', lang)}
        </b>

        <div className="dis-fl-col dis-fl-row-sm flex-wrap jc-b-sm jc-fs mt-3">
          <div className="dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-sm">
            <img loading="lazy" className="w-fix-56 w-fix-lg-104" src={PhoneIcon} alt="Call Us" />
            <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-sm">
              <div className="dis-fl-col as-fs a-c-lg pl-2 pl-lg-0 mt-3">

                <h6>{translateTo('Give us a call', lang)}</h6>
                <BrixelButtonText
                  bgTransparent
                  onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
                  label={Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
                />
              </div>
            </div>
          </div>
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-sm">
            <img loading="lazy" className="w-fix-56 w-fix-lg-104" src={MessageIcon} alt="Call Us" />
            <div className="dis-fl-col pl-2 pl-lg-0 mt-3">

              <h6>{translateTo('Message us on WhatsApp', lang)}</h6>
              <div className='as-c-sm'>

                <BrixelButtonText
                  bgTransparent
                  onClick={() => window.open(`https://wa.me/${get(activeSingleCompany, 'contact.whatsapp.prefix', '')}${get(activeSingleCompany, 'contact.whatsapp.number', '')}`, '_blank')}
                  label={Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))}
                />
              </div>
            </div>
          </div>
          <div className="dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-sm">
            <img loading="lazy" className="w-fix-56 w-fix-lg-104" src={MailIcon} alt="Call Us" />
            <div className="dis-fl-col as-fs a-c-lg pl-2 pl-lg-0 mt-3">

              <h6>{translateTo('Send us an email', lang)}</h6>
              <BrixelButtonText
                bgTransparent
                onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
                label={get(activeSingleCompany, 'contact.email', '')}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: state?.companies?.activeSingleCompany || {},
  lang: state?.common?.language || 'de',
});

export default compose(
  connect(mapStateToProps, null),
)(BrixelBoutiqueThankYou);
