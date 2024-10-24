import React from 'react';
import {connect} from 'react-redux';
import translateTo from '../../../../../utils/translation';
import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';

type ProofOfFinancingTermsConditionProps = {
  activeSingleCompany: CompanyType
  lang: string;
}

const ProofOfFinancingTermsCondition = ({
  activeSingleCompany,
  lang,
}: ProofOfFinancingTermsConditionProps) => {

  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const propID = get(match, 'propID', null);
  if (activeSingleCompany?.stub && activeSingleCompany?.stub !== 'ubs') history.push(`/buyer/${propID}/home`)

  return (
    <div className="max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText100 p-2 p-sm-4">
      <p className='fsize-300 txtText700'>
        {
          activeSingleCompany.stub === 'baloise' ? (
            <>
              {translateTo('I agree that my data (surname, first name, telephone number, email) may be transmitted to Baloise Insurance Ltd, Baloise Life Ltd and Baloise Bank Ltd for the purpose of contacting me for consultation on home financing including risk protection as well as the information that I use the Brixel service for the purpose of evaluating and optimising the service.', lang)}
            </>
          ) : (
            <>
              {translateTo('I agree that my data (surname, first name, address, postal code, telephone number, e-mail address) is transmitted to UBS for reporting and advisory purposes.', lang)}
            </>
          )
        }
      </p>
    </div>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || {},
  activeSingleCompany: state?.companies?.activeSingleCompany || {},
  windowDimensions: get(state, 'common.windowDimensions', {}),
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(ProofOfFinancingTermsCondition);
