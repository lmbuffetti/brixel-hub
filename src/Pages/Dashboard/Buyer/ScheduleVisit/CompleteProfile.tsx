import React, {useEffect, useState} from 'react';
import {change, destroy, initializeForm, reset} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerOff, spinnerOn, spinnerSmallOff} from '../../../../actions/CommonActions';
import {getActiveSingleCompany} from '../../../../actions/CompanyActions';
import {
  createActiveSingleProperty,
  getActiveSingleProperty,
  saveActiveSingleProperty, saveBuyerQualification,
} from '../../../../actions/PropertyActions';
import {createUserSearchProfile} from '../../../../actions/SearchProfileActions';
import {doLogin, validateUser} from '../../../../actions/UserActions';
import {QuestionsList} from '../../../../resources/Dashboard/CompleteProfile';
import {titleSearchProfile} from '../../../../utils/titleCreationSearchProfile';
import type {CompleteProfileType} from '../../../../@types/Pages/Dashboard/Buyer/CompleteProfile';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import FlowScreen from '../../../../components/FlowScreen';

export const initVal = {
  applyFinancingProof: false,
  buyerStatus: '',
  buyerStatusOther: '',
  involvedPurchaseProperty: '',
  involvedPurchasePropertyOther: '',
  financingProof: '',
  relationshipLocationProperty: '',
  watch3dTour: '',
  propertyAppealed: [],
};

const GetStartedBuyer = (props: CompleteProfileType) => {
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    activeSingleCompany,
    changeFieldValue,
    destroyForm,
    formValue,
    handleGetActiveSingleCompany,
    handleSetIsSmallLoading,
    handleGetActiveSingleProperty,
    handleSaveBuyerQualification,
    initForm,
    lang = 'en',
    translations,
  } = props;
  const propID = get(match, 'id', null);
  const scheduleVisitID = get(match, 'scheduleVisitID', null);
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang, 'CompleteProfile', activeSingleProperty.stub || ''));
  const [currentIndex, setCurrentIndex] = useState(0);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [newCurrentIndex, setNewCurrentIndex] = useState(0);
  const [isEnableSave, setIsEnableSave] = useState(false);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    if (!activeSingleProperty.id || activeSingleProperty.id !== propID) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
    return () => destroyForm();
  }, [propID]);

  useEffect(() => {
    if (!activeSingleCompany.id && activeSingleProperty.id) {
      initForm(initVal)
      handleGetActiveSingleCompany({ id: activeSingleProperty.company});
    }
  }, [activeSingleProperty.id]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    if (isEnableSave) {
      handleSaveBuyerQualification({
        id: scheduleVisitID,
        data: formValue,
      });
      setCurrentIndex(1);
      handleSetIsSmallLoading({})
    }
  };

  useEffect(() => {
    let isEnable = false;
    Object.keys(formValue).forEach((key) => {
      if (typeof formValue[key] === 'string' && formValue[key]) {
        isEnable = true;
      }
      if (typeof formValue[key] === 'object' && formValue[key].length > 0) {
        isEnable = true;
      }
    })
    setIsEnableSave(isEnable);
  }, [formValue]);


  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    setQuestions(QuestionsList(lang, 'CompleteProfile', activeSingleProperty.stub || ''));
    setNewCurrentIndex(currentIndex);
  }, [lang, translations, formValue, currentIndex]);

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    const rooms: {max?: number; min?: number} = get(formValue, 'characteristics.bedrooms', {});
    const propertyType = get(formValue, 'characteristics.propertyType', []);
    const locations = get(formValue, 'locations', []);
    const searchProfileName = get(formValue, 'name', null);
    if (propertyType.length > 0 && locations.length > 0 && rooms.max && !searchProfileName) {
      changeFieldValue('name', titleSearchProfile(formValue, lang))
    }
  }, [get(formValue, get(questions, `[${currentIndex}].inputs[0].name`, ''), null)]);

  return (

    <div className="CompleteProfile">
      {
        activeSingleCompany.id && (
          <FlowScreen
            isSaveEnable={isEnableSave}
            closeLink={`/buyer/${propID}/home`}
            closeButton={newCurrentIndex === 0}
            baseURL={`/buyer/${propID}/scheduleVisit/completeProfileFlow`}
            onChangeCurrentIndex={(index) => setCurrentIndex(index)}
            newCurrentIndex={newCurrentIndex}
            formName="CompleteProfile"
            onSaveData={() => saveData()}
            QuestionsList={questions}
            closeLabel="Back to home"
          />
        )
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.CompleteProfile.syncErrors', {}),
    formValue: get(state, 'brixelForm.CompleteProfile.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    lang: get(state, 'common.language', 'en'),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.CompleteProfile', null),
    translations: get(state, 'translations', { }),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('CompleteProfile', field, value));
  },
  destroyForm() {
    dispatch(destroy('CompleteProfile'));
  },
  initForm(value) {
    dispatch(initializeForm('CompleteProfile', value));
  },
  handleReset(initialValue) {
    (dispatch(reset('CompleteProfile', initialValue)));
  },
  handleSaveBuyerQualification: bindActionCreators(saveBuyerQualification, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSetIsSmallLoading: bindActionCreators(spinnerSmallOff, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedBuyer);
