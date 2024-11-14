import React, {useEffect, useState} from 'react';
import {change, destroy, reset} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerSmall} from '../../../../../actions/CommonActions';
import {getActiveSingleCompany} from '../../../../../actions/CompanyActions';
import {
  getActiveSingleProperty,
} from '../../../../../actions/PropertyActions';
import {QuestionsList} from '../../../../../resources/Offers/ProofOfFinancing';
import {
  CompanyType,
  PropertyType,
  QuestionsListType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import FlowScreen from '../../../../../components/FlowScreen';
import type {formValueType} from '../../../../../resources/Offers/ProofOfFinancing';
import {getBuyerDeal, getProofOfFinancing, saveProofOfFinancing} from '../../../../../actions/DealActions';

type ProofFinancingType = {
  activeProofofFinancing: any
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  dealID: string
  destroyForm: () => void;
  formValue: formValueType;
  handleGetBuyerDeal: (data: object) => void;
  handleGetProofofFinancing: (data: object) => void;
  handleGetActiveSingleProperty: (data: object) => void;
  handleSaveProofOfFinancing: (data: object) => void;
  isSmallLoading: {
    sendData: boolean
  }
  lang?: string;
}

const ProofFinancing = (props: ProofFinancingType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeProofofFinancing,
    activeSingleProperty,
    activeSingleCompany,
    changeFieldValue,
    dealID,
    destroyForm,
    formValue,
    handleGetBuyerDeal,
    handleGetProofofFinancing,
    handleGetActiveSingleProperty,
    handleSaveProofOfFinancing,
    isSmallLoading,
    lang = 'en',
  } = props;
  const propID = get(match, 'propID', null);
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(changeFieldValue, lang, activeSingleCompany));

  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  // const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS

  // DESTROY FORM ON EXIT
  useEffect(() => {
    return () => destroyForm();
  }, []);

  useEffect(() => {
    if (activeProofofFinancing?.id && typeof isSmallLoading.sendData === 'undefined') {
      history.push(`/buyer/${propID}/offerFlow/proofFinancing`);
    }
  }, [activeProofofFinancing])

  useEffect(() => {
    if (!activeSingleProperty.id) {
      handleGetActiveSingleProperty({ id: propID, fullVersion: false });
    }
    if (!dealID) {
      handleGetBuyerDeal({ id: propID });
    }
  }, [propID]);

  useEffect(() => {
    if (dealID) {
      handleGetProofofFinancing({ id: dealID });
    }
  }, [dealID]);

  useEffect(() => {
    setQuestions(QuestionsList(changeFieldValue, lang, activeSingleCompany));
  }, [formValue]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    if (dealID) {
      const data = {
        id: dealID,
        calculationResults: {
          ...formValue,
        },
        smallLoader: 'sendData',
      }
      handleSaveProofOfFinancing(data);
    }
  };

  const affordabilityCheck = typeof formValue?.affordabilityCheck === 'undefined' ? null :  formValue?.affordabilityCheck
  const loanValueCheck = typeof formValue?.loanValueCheck === 'undefined' ? null :  formValue?.loanValueCheck

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
            isSaveEnable={affordabilityCheck !== null && loanValueCheck !== null}
          />
        )
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return ({
    activeProofofFinancing: state?.deal.activeProofofFinancing || null,
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    dealID: state.deal.activeSingleDeal.id || null,
    errorValue: get(state, 'brixelForm.ProofOfFinancing.syncErrors', {}),

    formValue: get(state, 'brixelForm.ProofOfFinancing.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: state?.common?.isSmallLoading  || {},
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
  handleSaveProofOfFinancing: bindActionCreators(saveProofOfFinancing, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetProofofFinancing: bindActionCreators(getProofOfFinancing, dispatch),
  handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
  handelSetSmallSpinner: bindActionCreators(spinnerSmall, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ProofFinancing);
