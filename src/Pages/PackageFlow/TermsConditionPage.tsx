import React, {useEffect, useState} from 'react';
import {change, destroy, initializeForm, reset} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerOff, spinnerOn} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {createActiveSingleProperty, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {doLogin, saveActiveSingleUser, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Companies/TermsCondition/TermsConditionPage';
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
    company,
    destroyForm,
    formValue,
    handleSpinnerOff,
    initForm,
    initialValues,
    isSmallLoading,
    lang = 'en',
    translations,
  } = props;
  // GET URL PARAMS
  const propID = get(match, 'pageID', null);
  const userType = get(match, 'userType', null);
  // STATE
  const isBuyer = userType === 'buyer';
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang));
  const [redirectURL, setRedirectURL] = useState('');

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    const parmsURL = queryString.parse(get(history, 'location.search', ''));
    setRedirectURL((get(parmsURL, 'url', '') || '').toString());
    history.push(`/${propID}/termsConditionPage`);
    return () => destroyForm();
  }, []);

  useEffect(() => {
    if(get(isSmallLoading, 'sentData', null) || get(isSmallLoading, 'sendData', null)) {
      const defaultRedirect = isBuyer ? '/buy' : '/sell';
      history.push(redirectURL || defaultRedirect);
    }
  }, [get(isSmallLoading, 'sentData', null), get(isSmallLoading, 'sendData', null)]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    // eslint-disable-next-line no-console
    console.log(formValue);
  };

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    if (company.stub) {
      setQuestions(QuestionsList(lang));
    }
  }, [lang, company.stub, translations, formValue]);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(formValue, 'properties.propertyType', null) === null) initForm(initialValues);
  }, [get(company, 'id', null)]);

  return (
    <FlowScreen
      baseURL={`/${propID}/termsConditionPage`}
      formName="TermsCondition"
      onSaveData={() => saveData()}
      QuestionsList={questions}
    />
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, 'brixelForm.TermsCondition.syncErrors', {}),
  formValue: get(state, 'brixelForm.TermsCondition.values', {}),
  initialValues: get(state, 'brixelForm.TermsCondition.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  packagesProperty: get(state, 'property.packagesProperty', []),
  startForm: get(state, 'brixelForm.TermsCondition', null),
  translations: get(state, 'translations', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('TermsCondition', field, value));
  },
  destroyForm() {
    dispatch(destroy('TermsCondition'));
  },
  initForm(value) {
    dispatch(initializeForm('TermsCondition', value));
  },
  handleReset(val) {
    (dispatch(reset('TermsCondition', val)));
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
