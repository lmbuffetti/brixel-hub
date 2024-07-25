import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import translateTo from '../../../../utils/translation';

type EnergieCertificateProps = {
  lang: string;
}

const EnergieCertificate = ({lang}: EnergieCertificateProps) => {
  return (
    <div>
      {translateTo('TEST', lang)}
    </div>

  )
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default connect(mapStateToProps, null)(EnergieCertificate);
