import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {DealType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {translateTo} from '@brixel-io/brixel-components/dist';
import FlowScreen from '../../../../components/FlowScreen';
import {QuestionsList} from '../../../../resources/Dashboard/EnergyCertificate';
import {bindActionCreators} from 'redux';
import {getActiveSingleProperty} from '../../../../actions/PropertyActions';
import {spinnerSmall} from '../../../../actions/CommonActions';
import api from '../../../../controllers/api/config';


type EnergieCertificateProps = {
  activeSingleDeal: DealType
  activeSingleProperty: PropertyType
  handleGetActiveSingleProperty: (data: object) => void
  formValue: object
  handleSetSmallLoading: (data: object) => void
  lang: string;
}

const EnergyFlow = ({
  activeSingleDeal,
  activeSingleProperty,
  handleGetActiveSingleProperty,
  formValue,
  handleSetSmallLoading,
  lang,
}: EnergieCertificateProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const QuestionData = QuestionsList(lang);
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
    const data = {
      ...formValue,
    }
    if (activeSingleDeal?.id) {
      api.deal.sendSequestVerifiedEnergyCertificate(data, activeSingleDeal?.id)
        .then((res) => {
          console.log(res);
          handleSetSmallLoading({sendData: false});
          setCurrentIndex(currentIndex + 1);
        })
    }
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
        closeLabel={translateTo('Back to home', lang)}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  activeSingleDeal: state?.deal?.activeSingleDeal || {},
  activeSingleProperty: state?.property?.activeSingleProperty || {},
  formValue: state?.brixelForm?.energyRequest?.values || {},
  lang: state?.common?.language || 'en',
});

const mapDispatchToProps = (dispatch) => ({
  handleSetSmallLoading: bindActionCreators(spinnerSmall, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnergyFlow);
