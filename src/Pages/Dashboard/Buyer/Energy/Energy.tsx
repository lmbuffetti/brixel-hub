import React from 'react';
import {connect} from 'react-redux';
import translateTo from '../../../../utils/translation';
import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';

type EnergieCertificateProps = {
  activeSingleCompany: CompanyType
  lang: string;
}

const EnergieCertificate = ({
  activeSingleCompany,
  lang,
}: EnergieCertificateProps) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const propID = get(match, 'propID', null);
  if (activeSingleCompany?.stub && activeSingleCompany?.stub !== 'ubs') history.push(`/buyer/${propID}/home`)
  return (
    <>
      <h3 className="mb-3 hide dis-b-lg  fweight-600">
        {translateTo('Energy', lang)}
      </h3>
      <div className="dis-f h-perc-lg-100">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100">
          <SectionMobileTitle
            title="Energy"
          />
          <div>
            Bla bla
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  activeSingleCompany: state?.companies?.activeSingleCompany || {},
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(EnergieCertificate);
