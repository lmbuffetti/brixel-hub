import React, {useEffect, useState} from 'react';
import {change, destroy, initializeForm, reset} from '@brixel-io/brixel-components/dist/form';
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
import {formValueMekOffer, QuestionsList} from '../../../../../resources/Offers/MakeOffer';
import type {
  CompanyType,
  PropertyType,
  QuestionsListType,
  LoggedUserType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import FlowScreen from '../../../../../components/FlowScreen';

type MakeOfferType = {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  company: CompanyType;
  destroyForm: () => void;
  formValue: formValueMekOffer;
  handleGetActiveSingleProperty: (data: object) => void;
  handelSetSmallSpinner: (data: object) => void;
  initForm: (data: object) => void;
  lang?: string;
  loggedInUser?: LoggedUserType
}

const MakeOffer = (props: MakeOfferType) => {
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    activeSingleCompany,
    changeFieldValue,
    company,
    destroyForm,
    formValue,
    handleGetActiveSingleProperty,
    handelSetSmallSpinner,
    initForm,
    lang = 'en',
    loggedInUser,
  } = props;
  const propID = get(match, 'propID', null);
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang));
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
    if (loggedInUser?.id && activeSingleProperty?.id) {
      const buyer = {
        fullName: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
      }
      const defaultData = {
        additionalBuyerInfo: {
          ...buyer,
        },
      }
      initForm(defaultData);
    }
  }, [loggedInUser,activeSingleProperty]);

  useEffect(() => {
    setQuestions(QuestionsList(lang));
  }, [formValue]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    handelSetSmallSpinner({sendData: true});
    setTimeout(() => {
      handelSetSmallSpinner({sendData: false});
    }, 2000)
  };

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      changeFieldValue('company', company.stub);
    }
  }, [get(company, 'id', null)]);

  return (
    <div className="flex-1">
      {
        activeSingleCompany.id && (
          <FlowScreen
            baseURL={`/buyer/${propID}/offerFlow/MakeOffer`}
            formName="makeOffer"
            onSaveData={() => saveData()}
            QuestionsList={questions}
            closeLabel="Go to offer overview"
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
    errorValue: get(state, 'brixelForm.makeOffer.syncErrors', {}),
    formValue: get(state, 'brixelForm.makeOffer.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isTest: get(state, 'common.isTest', false),
    lang: get(state, 'common.language', 'de'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.makeOffer', null),
    translations: get(state, 'translations', { }),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('makeOffer', field, value));
  },
  destroyForm() {
    dispatch(destroy('makeOffer'));
  },
  initForm(value) {
    dispatch(initializeForm('makeOffer', value));
  },
  handleReset(initialValue) {
    (dispatch(reset('makeOffer', initialValue)));
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
)(MakeOffer);
