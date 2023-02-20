import React, {useEffect, useState} from 'react';
import {change, destroy, initializeForm, reset} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import set from 'lodash/set';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerOff, spinnerOn} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {createActiveSingleProperty, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {doLogin, saveActiveSingleUser, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Companies/TermsCondition/TermsCondition';
import {setCookie} from '../../utils/helpers';
import type {TermsConditionType} from '../../@types/Pages/PackageFlow/TermCondition';
import FlowScreen from '../../components/FlowScreen';

const TermsCondition = (props: TermsConditionType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    changeFieldValue,
    company,
    destroyForm,
    formValue,
    handleGetActiveSingleCompany,
    handleSaveActiveSingleUser,
    handleSpinnerOff,
    initForm,
    initialValues,
    isSmallLoading,
    lang = 'en',
    loggedInUser,
    translations,
  } = props;
  // GET URL PARAMS
  const companyStub = get(match, 'companyStub', null);
  const userType = get(match, 'userType', null);
  // STATE
  const isBuyer = userType === 'buyer';
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang, activeSingleCompany, isBuyer));
  const [redirectURL, setRedirectURL] = useState('');

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    const parmsURL = queryString.parse(get(history, 'location.search', ''));
    setRedirectURL((get(parmsURL, 'url', '') || '').toString());
    history.push(`/termsConditionFlow/${companyStub}/${userType}`);
    return () => destroyForm();
  }, []);

  useEffect(() => {

    if(get(isSmallLoading, 'sentData', null)) {
      history.push(redirectURL || '/sell');
    }
  }, [get(isSmallLoading, 'sentData', null)]);

  // FUNCTION TO SAVE DATA
  const saveData = async (action = '') => {
    const data = {
      smallLoader: 'sendData',
      id: loggedInUser.id,
    }
    if (action === 'accept' && activeSingleCompany.stub === 'ubs') {
      set(data, 'termsUBS', true);
    }
    if (action === 'accept' && activeSingleCompany.stub === 'baloise') {
      const baloiseInfo = get(formValue, 'baloiseInfo', null);
      if (baloiseInfo === 'baloiseInsurance' || baloiseInfo === 'both') set(data, 'termsBaloiseInsurance', true);
      if (baloiseInfo === 'baloiseBank' || baloiseInfo === 'both') set(data, 'termsBaloiseBank', true);
    }
    handleSaveActiveSingleUser(data);
  };

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    handleGetActiveSingleCompany({ stub: companyStub });
  }, []);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    if (company.stub) {
      setQuestions(QuestionsList(lang, activeSingleCompany, isBuyer));
    }
  }, [lang, company.stub, translations, formValue]);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      setCookie('brixelStubCompany', company.stub);
      changeFieldValue('company', company.stub);
    }
    if (get(formValue, 'properties.propertyType', null) === null) initForm(initialValues);
  }, [get(company, 'id', null)]);

  return (
    <FlowScreen
      baseURL={`/termsConditionFlow/${activeSingleCompany.stub}`}
      formName="GetStarted"
      onSaveData={(action) => saveData(action)}
      QuestionsList={questions}
    />
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
  formValue: get(state, 'brixelForm.GetStarted.values', {}),
  initialValues: get(state, 'brixelForm.GetStarted.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  packagesProperty: get(state, 'property.packagesProperty', []),
  startForm: get(state, 'brixelForm.GetStarted', null),
  translations: get(state, 'translations', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  destroyForm() {
    dispatch(destroy('GetStarted'));
  },
  initForm(value) {
    dispatch(initializeForm('GetStarted', value));
  },
  handleReset(val) {
    (dispatch(reset('GetStarted', val)));
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TermsCondition);
