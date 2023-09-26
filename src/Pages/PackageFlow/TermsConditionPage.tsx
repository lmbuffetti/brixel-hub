import React, {useEffect, useState} from 'react';
import {change, destroy, initializeForm, reset} from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerOff, spinnerOn, spinnerSmall} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {
  createActiveSingleProperty,
  getActiveSingleProperty,
  saveActiveSingleProperty,
  setPageTermsAcceptance,
} from '../../actions/PropertyActions';
import {doLogin, saveActiveSingleUser, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Companies/TermsCondition/TermsConditionPage';
import type {TermsPublishPageType} from '../../@types/Pages/PackageFlow/TermsConditionPage';
import FlowScreen from '../../components/FlowScreen';
import {activeSingleProperty} from '@brixel-io/brixel-components/dist/resources/property';

const TermsCondition = (props: TermsPublishPageType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    destroyForm,
    formValue,
    handleGetActiveSingleCompany,
    handleGetActiveSingleProperty,
    handleSetSmallLoading,
    handleSpinnerOff,
    handleAcceptPageTerms,
    initForm,
    initialValues,
    lang = 'en',
    translations,
  } = props;
  // GET URL PARAMS
  const propID = get(match, 'pageID', null);

  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang));
  const [currentIndex, setCurrentIndex] = useState(0);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    history.push(`/${propID}/termsConditionPage`);
    return () => destroyForm();
  }, []);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    if (activeSingleProperty.company && (!activeSingleCompany.id || activeSingleCompany.id !== activeSingleProperty.company)) {
      handleGetActiveSingleCompany({id: activeSingleProperty.company});
    }
  }, [activeSingleProperty.id]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    if (!activeSingleProperty.id || activeSingleProperty.id !== propID) {
      handleGetActiveSingleProperty({
        fullVersion: true,
        id: propID,
      });
    }
    handleGetActiveSingleProperty({
      fullVersion: true,
      id: propID,
    });
  }, [propID]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    let payload: Record<string, object | string> = {
      id: propID || '',
      data: formValue,
    }
    if (handleSetSmallLoading) handleSetSmallLoading({sendData: true});
    payload = {
      ...payload,
      smallLoader: 'sendData',
    }
    handleAcceptPageTerms(payload);
  };

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    if (activeSingleCompany.stub) {
      setQuestions(QuestionsList(lang));
    }
  }, [lang, activeSingleCompany.stub, translations, formValue]);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(formValue, 'properties.propertyType', null) === null) initForm(initialValues);
  }, [get(activeSingleCompany, 'id', null)]);

  return (
    <FlowScreen
      QuestionsList={questions}
      baseURL={`/${propID}/termsConditionPage`}
      closeLink={`/${propID}/home`}
      formName="TermsCondition"
      newCurrentIndex={currentIndex}
      onChangeCurrentIndex={(index) => setCurrentIndex(index)}
      onSaveData={() => saveData()}
    />
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
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
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleAcceptPageTerms: bindActionCreators(setPageTermsAcceptance, dispatch),
  handleSetSmallLoading: bindActionCreators(spinnerSmall, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TermsCondition);
