import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {
  Helpers,
} from '@brixel-io/brixel-components';
import type {
  CompanyType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import {saveMakeOffer} from '../../../../../actions/DealActions';
import translateTo from '../../../../../utils/translation';
import DocumentFullIcon from '../../../../../images/documentsIcon/documentFull.svg';
import PhoneIcon from '../../../../../images/Boutique/phoneIcon.svg';
import get from 'lodash/get';
import MessageIcon from '../../../../../images/Boutique/messageIcon.svg';
import MailIcon from '../../../../../images/Boutique/mailIcon.svg';

type ProofOfFinancingModalPrepareType = {
  activeSingleCompany: CompanyType
  lang?: string;
}

const documentsList = [
  'Latest tax declaration',
  'Latest proof of income, incl. proof of bonus if applicable',
  'Pension fund statement',
  'Property exposé - download here',
]

const ProofOfFinancingModalPrepare = (props: ProofOfFinancingModalPrepareType) => {
  // PROPS
  const {
    activeSingleCompany,
    lang = 'en',
  } = props;

  return (
    <div>
      <div className="px-3 pb-3">
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
      </div>

      <hr/>

      <div className="p-2">
        <div
          className="dis-f a-c mb-2 bgGreen25 p-1 brdRadius w-perc-100">
          <div>
            <img loading="lazy" className="w-fix-40 w-fix-md-56" src={PhoneIcon} alt="Call Us" />
          </div>

          <div className="dis-f a-fs a-c-lg pl-2">

            <h6>{translateTo('Call Us', lang)}</h6>
            <span
              className='dis-b cur-poi txtGreen400 td-u ml-1'
              onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
            >
              {Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
            </span>
          </div>

        </div>
        <div
          className="dis-f a-c mb-2 bgGreen25 p-1 brdRadius w-perc-100">
          <div>
            <img loading="lazy" className="w-fix-40 w-fix-md-56" src={MessageIcon} alt="Call Us" />
          </div>
          <div className="dis-f a-fs a-c-lg pl-2">

            <h6>{translateTo('Text us via WhatsApp', lang)}</h6>

            <span
              className="dis-b cur-poi txtGreen400 td-u ml-1"
              onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''), false, false, true))}
            >
              {Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))}
            </span>
          </div>
        </div>
        <div
          className="dis-f a-c mb-2 bgGreen25 p-1 brdRadius w-perc-100">
          <div>
            <img loading="lazy" className="w-fix-40 w-fix-md-56" src={MailIcon} alt="Call Us" />
          </div>
          <div className="dis-f a-fs a-c-lg pl-2">

            <h6>{translateTo('Write Us', lang)}</h6>
            <span
              className="dis-b cur-poi txtGreen400 td-u ml-1"
              onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
            >
              {get(activeSingleCompany, 'contact.email', '')}
            </span>
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
