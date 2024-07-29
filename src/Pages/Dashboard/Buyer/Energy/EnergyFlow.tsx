import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import FlowScreen from '../../../../components/FlowScreen';
import {QuestionsList} from '../../../../resources/Dashboard/EnergyCertificate';
import {bindActionCreators} from 'redux';
import {getActiveSingleProperty} from '../../../../actions/PropertyActions';
import {spinnerSmall} from '../../../../actions/CommonActions';


type EnergieCertificateProps = {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType
  handleGetActiveSingleProperty: (data: object) => void
  handleSetSmallLoading: (data: object) => void
  lang: string;
}

const EnergyFlow = ({
  activeSingleProperty,
  activeSingleCompany,
  handleGetActiveSingleProperty,
  handleSetSmallLoading,
  lang,
}: EnergieCertificateProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const QuestionData = QuestionsList(lang, activeSingleCompany);
  const match = useParams();
  const propID = match?.propID || '';

  useEffect(() => {
    if (propID && propID !== 'propertyLists' && propID !== activeSingleProperty?.id) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
  }, [propID]);

  const saveData = () => {
    handleSetSmallLoading({sendData: true});
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      handleSetSmallLoading({sendData: false});
    }, 1000)
  }

  return (
    <>
      <FlowScreen
        baseURL={`/buyer/${propID}/energy/energyFlow`}
        onChangeCurrentIndex={(index) => setCurrentIndex(index)}
        formName="currentIndex"
        onSaveData={() => saveData()}
        QuestionsList={QuestionData}
        closeLink={`/buyer/${propID}/energy`}
        newCurrentIndex={currentIndex}
        closeLabel="Back to home"
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || {},
  activeSingleCompany: state?.companies?.activeSingleCompany || {},
  lang: state?.common?.language || 'en',
});

const mapDispatchToProps = (dispatch) => ({
  handleSetSmallLoading: bindActionCreators(spinnerSmall, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnergyFlow);
