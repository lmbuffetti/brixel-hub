import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {
  Helpers,
} from '@brixel-io/brixel-components';
import type {
  CompanyType, PropertyType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import {saveMakeOffer} from '../../../../../actions/DealActions';
import translateTo from '../../../../../utils/translation';
import DocumentFullIcon from '../../../../../images/documentsIcon/documentFull.svg';
import PhoneIcon from '../../../../../images/Boutique/phoneIcon.svg';
import get from 'lodash/get';
import MessageIcon from '../../../../../images/Boutique/messageIcon.svg';
import MailIcon from '../../../../../images/Boutique/mailIcon.svg';

type ProofOfFinancingModalPrepareType = {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType
  lang?: string;
}

const documentsList = [
  'Latest tax declaration',
  'Latest proof of income, incl. proof of bonus if applicable',
  'Pension fund statement',
]

const ProofOfFinancingModalPrepare = (props: ProofOfFinancingModalPrepareType) => {
  // PROPS
  const {
    activeSingleProperty,
    activeSingleCompany,
    lang = 'en',
  } = props;

  const brochurePDF = activeSingleProperty?.documents ? activeSingleProperty?.documents.find((doc) => doc.isBrochure) : null;

  return (
    <div>
      <div className="px-2 px-sm-3 pb-3">
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
                <div className="dis-f flex-wrap">
                  <span className='no-wrap'>{translateTo('Property exposé -', lang)}</span>
                  <a href={brochurePDF?.loadUrl || ''} className="td-u ml-1 no-wrap txtText900">{translateTo('download here', lang)}</a>
                </div>
              </div>
            )
          }
        </div>
      </div>

      <hr />

      <div className="p-2">
        <p className='pb-2 fsize-300 txtText700'>{translateTo('If you need immediate help, you can also:', lang)}</p>
        <div className="dis-fl-col a-c jc-c mx-a">
          <div className="dis-fl-row a-c mb-2 as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-100">
            <div className="">
              <img loading="lazy" className="w-fix-40" src={PhoneIcon} alt="Call us" />
            </div>

            <div className="dis-f a-fs pl-2 fsize-300 flex-wrap">

              <h6 className="fsize-300 pr-1">{translateTo('Call us', lang)}</h6>
              <span
                className='dis-b cur-poi txtGreen400 td-u'
                onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
              >
                {Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
              </span>
            </div>

          </div>
          <div className="dis-fl-row a-c mb-2 as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-100">
            <div className="">
              <img loading="lazy" className="w-fix-40" src={MessageIcon} alt="Call Us" />
            </div>
            <div className="dis-f a-fs pl-2 fsize-300 flex-wrap">

              <h6 className="fsize-300 pr-1">{translateTo('Text us via WhatsApp', lang)}</h6>

              <span
                className='dis-b cur-poi txtGreen400 td-u'
                onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''), false, false, true))}
              >
                {Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))}
              </span>
            </div>
          </div>
          <div className="dis-fl-row a-c mb-2 as-fs min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-100">
            <div className="">
              <img loading="lazy" className="w-fix-40" src={MailIcon} alt="Call Us" />
            </div>
            <div className="dis-f a-fs pl-2 fsize-300 flex-wrap">

              <h6 className="fsize-300 pr-1">{translateTo('Write us', lang)}</h6>
              <span
                className='dis-b cur-poi txtGreen400 td-u'
                onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
              >
                {get(activeSingleCompany, 'contact.email', '')}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const mapStateToProps = (state) => {
  return ({
    activeSingleCompany: state?.companies?.activeSingleCompany || {},
    activeSingleProperty: state?.property?.activeSingleProperty || {},
    activeSingleOffer: state?.deal?.activeSingleOffer || {},
    dealID: state?.deal?.activeSingleDeal?.id || null,
    isSmallLoading: state?.common?.isSmallLoading || {},
    lang: state?.common?.language || 'de',
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleSaveMakeOffer: bindActionCreators(saveMakeOffer, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ProofOfFinancingModalPrepare);
