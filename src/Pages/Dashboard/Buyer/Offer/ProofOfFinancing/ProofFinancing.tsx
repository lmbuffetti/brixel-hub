import React, {useEffect, useState} from 'react';
import {change, destroy, reset} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerOff, spinnerOn, spinnerSmall} from '../../../../../actions/CommonActions';
import {getActiveSingleCompany} from '../../../../../actions/CompanyActions';
import {
  getActiveSingleProperty,
  saveActiveSingleProperty,
} from '../../../../../actions/PropertyActions';
import {doLogin, saveActiveSingleUser, validateUser} from '../../../../../actions/UserActions';
import {QuestionsList} from '../../../../../resources/Offers/ProofOfFinancing';
import {
  CompanyType,
  PropertyType,
  QuestionsListType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import FlowScreen from '../../../../../components/FlowScreen';
import type {FormValueType} from '../../../../../@types/Pages/PackageFlow/GetStartedSeller';

type ProofFinancingType = {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  destroyForm: () => void;
  formValue: FormValueType;
  handleGetActiveSingleProperty: (data: object) => void;
  handelSetSmallSpinner: (data: object) => void;
  lang?: string;
}

const ProofFinancing = (props: ProofFinancingType) => {
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    activeSingleCompany,
    changeFieldValue,
    destroyForm,
    formValue,
    handleGetActiveSingleProperty,
    handelSetSmallSpinner,
    lang = 'en',
  } = props;
  const propID = get(match, 'propID', null);
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(changeFieldValue, lang));

  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  // const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS

  // DESTROY FORM ON EXIT
  useEffect(() => {
    return () => destroyForm();
  }, []);

  useEffect(() => {
    if (!activeSingleProperty.id) {
      handleGetActiveSingleProperty({ id: propID });
    }
  }, [propID]);

  useEffect(() => {
    setQuestions(QuestionsList(changeFieldValue, lang));
  }, [formValue]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    handelSetSmallSpinner({sendData: true});
    setTimeout(() => {
      handelSetSmallSpinner({sendData: false});
    }, 2000)
  };

  return (
    <div className="flex-1">
      {
        activeSingleCompany.id && (
          <FlowScreen
            baseURL={`/buyer/${propID}/offerFlow/proofFinancing`}
            formName="ProofOfFinancing"
            onSaveData={() => saveData()}
            QuestionsList={questions}
            successCustomButtons={[]}
          />
        )
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.ProofOfFinancing.syncErrors', {}),
    formValue: get(state, 'brixelForm.ProofOfFinancing.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isTest: get(state, 'common.isTest', false),
    lang: get(state, 'common.language', 'de'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.GetStarted', null),
    translations: get(state, 'translations', { }),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('ProofOfFinancing', field, value));
  },
  destroyForm() {
    dispatch(destroy('ProofOfFinancing'));
  },
  handleReset(initialValue) {
    (dispatch(reset('ProofOfFinancing', initialValue)));
  },
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handelSetSmallSpinner: bindActionCreators(spinnerSmall, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ProofFinancing);
