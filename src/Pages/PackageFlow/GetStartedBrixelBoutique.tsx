import React, {useEffect, useState} from 'react';
import {DataByCountry} from '@brixel-io/brixel-components';
import {languagesList} from '@brixel-io/brixel-components/dist/configuration/Constants';
import {phonecode} from '@brixel-io/brixel-components/dist/constants/CountryCodePhone';
import {change, destroy, initializeForm, reset} from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import Cookies from 'universal-cookie';
import {spinnerOff, spinnerOn} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {createActiveSingleProperty, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {doLogin, saveActiveSingleUser, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Flows/OnBoaridngBoutique';
import {calcPercentageFacts, setCookie} from '../../utils/helpers';
import {titleProperty} from '../../utils/titleCreation';
import {CompanyType, LoggedUserType, QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import FlowScreen from '../../components/FlowScreen';
import { testData } from '../../../cypress/helpers/constants';
import type {FormValueType} from '../../@types/Pages/PackageFlow/GetStartedSeller';
const { companies } = testData;

const cookie = new Cookies();

type GetStartedBrixelBoutiqueType = {
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  company: CompanyType;
  destroyForm: () => void;
  formValue: FormValueType;
  handleCreateActiveSingleProperty: (data: object) => void;
  handleDoLogin: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleValidateUser: (data: object) => void;
  initForm: (data: object) => void;
  initialValues: object;
  isLoading: boolean;
  isTest?: boolean;
  lang?: string;
  loggedInUser: LoggedUserType;
  translations: object;
}

const GetStartedBrixelBoutique = (props: GetStartedBrixelBoutiqueType) => {
  const companyStub = 'brixel_boutique'
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleCompany,
    changeFieldValue,
    company,
    destroyForm,
    formValue,
    handleCreateActiveSingleProperty,
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleValidateUser,
    initForm,
    initialValues,
    isLoading,
    isTest,
    lang = 'en',
    loggedInUser,
    translations,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newCurrentIndex, setNewCurrentIndex] = useState(0);
  const [loadingRequest, setLoadingRequest] = useState(false);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  // const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS

  // DESTROY FORM ON EXIT
  useEffect(() => {
    return () => destroyForm();
  }, []);

  const getCurrency = () => {
    const result: object = {};
    if (get(formValue, 'location.countryCode', '')) {
      const currency = DataByCountry(get(formValue, 'location.countryCode', ''));
      set(result, 'currency', currency || 'CHF');
      changeFieldValue('price.currency', get(result, 'currency', ''));
    }
    return result;
  };

  useEffect(() => {
    if (!isLoading) setLoadingRequest(false);
  }, [isLoading]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    if (isLoading || loadingRequest) return false;
    setLoadingRequest(true);
    const dataForm = cloneDeep(formValue);
    const dataFormAnswer = cloneDeep(formValue);
    delete dataFormAnswer.id;
    delete dataForm.id;
    setCookie('brixelSplashHome', 'sellerWelcome');
    const { login, register } = dataForm;
    const formCompany = dataForm.company;
    // delete dataForm.login;
    // changeFieldValue('register.password', '');
    if (dataFormAnswer.register) delete dataFormAnswer.register.password;
    // delete dataForm.company;
    // BROWSER AND META USER DATA
    const metaUserData = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in navigator) {
      metaUserData[key] = navigator[key];
    }
    set(dataFormAnswer, 'properties.typology.bathrooms', 0);
    set(dataFormAnswer, 'dataFormAnswer.properties.parking', {
      garage: 0,
      outside: 0,
      underground: 0,
    });
    // PROPERTY DATA
    delete dataFormAnswer.login;
    let saveLangUser = 'en';
    const checkValidLang = languagesList.find((lng) => lng.code === lang);
    if (checkValidLang) saveLangUser = lang;
    const data = {
      ...dataFormAnswer,
      packageFlowProcess: {
        answers: dataFormAnswer,
        rewardScreenData: {},
        metaUser: metaUserData,
      },
      ownerType: 'seller',
      purpose: 'seller',
      preMarketVisible: true,
      language: saveLangUser,
      title: formValue.pageTitle,
      status: 'on-request',
      listed: false,
      active: true,
      price: get(formValue, 'price', getCurrency()),
      createEstimation: true,
      published: false,
      addProperty: true,
      // redirectToUrl: '/sell',
      company: formCompany,
      extraLoading: true,
      smallLoader: 'savingData',
    };
    if (formValue.pageID) data.id = formValue.pageID;
    const page = get(formValue, 'signupScreen', null);
    // IF USER IS LOGGED IN SAVE DIRECTLY THE PAGE
    if (formValue.owner && get(data, 'price.currency', null)) {
      data.owner = get(loggedInUser, 'id', '');
      // DISPATCH TO SAVE THE PROPERTY
      await handleCreateActiveSingleProperty(data);
    } else if (page === 'login') {
      changeFieldValue('register.email', login?.email || '');
      // IF USER DO THE LOG IN, DO THE LOGIN AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      set(data, 'user', {
        username: (login?.email || '').toLowerCase(),
        password: login?.password || '',
      });
      // DISPATCH TO DO LOGIN
      await handleDoLogin(data);
    } else {
      changeFieldValue('login.email', register?.email || '');
      // IF USER DO THE SIGN UP, DO THE REGISTRATION AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      set(data, 'user', {
        ...register,
        email: (register?.email || '').toLowerCase(),
        acceptTerms: get(register, 'privacy[0]', true),
        termsUBS: get(register, 'termsUBS[0]', false),
        termsBaloiseBank: get(register, 'termsBaloiseBank[0]', false),
        termsBaloiseInsurance: get(register, 'termsBaloiseInsurance[0]', false),
        acceptMarketing: get(register, 'acceptMarketing[0]', false),
        name: get(formValue, 'register.name', ''),
        userType: 'seller',
        signupAccept: true,
        signupChannel: get(formValue, 'channel', 'default'),
        signupProduct: null,
        language: saveLangUser,
        createUser: true,
        company: formCompany,
        ignoreEmail: false,
        seller: true,
        redirectTo: {
          pathname: '/packageFlow/brixelBoutique/success',
          state: { hideClose: true },
        },
      });
      setCookie('brixelFirstTime', 'true');
      // DISPATCH TO DO REGISTRATION USER
      await handleValidateUser(data);
    }
  };

  useEffect(() => {
    if (get(loggedInUser, 'id', null)) changeFieldValue('owner', get(loggedInUser, 'id', null));
  }, [get(loggedInUser, 'id', null)]);

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    if (company.stub) {
      const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
      if (calcPercentageFacts('GetStarted').calcPerc !== calcPercentageFacts('GetStarted').savedPerc && get(inputSheet, 'totalComplete', 0) !== calcPercentageFacts('GetStarted').calcPerc) {
        set(inputSheet, 'totalComplete', calcPercentageFacts('GetStarted').calcPerc);
        changeFieldValue('inputSheet', inputSheet);
      }
    }
  }, [formValue]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    let defComp = get(companyByUrl, 'company', companyStub) || companyCookie;
    if (companyStub && companyStub !== get(questions, '[0].history', null)) defComp = companyStub;
    if (defComp) {
      handleGetActiveSingleCompany({ stub: defComp || 'default' });
      setCookie('brixelStubCompany', defComp);
      changeFieldValue('company', defComp);
      if (currentIndex < 1) {
        history.push(`/packageFlow/brixelBoutique/${get(questions, '[0].history', null)}`);
      }
    } else if (!isTest) {
      const companyUser = get(loggedInUser, 'company.stub', null);
      if (companyUser) handleGetActiveSingleCompany({ stub: companyUser });
      else handleGetActiveSingleCompany({ stub: 'default' });
      changeFieldValue('location.countryCode', 'all');
    }
    if (get(companyByUrl, 'channel', channelCookie)) {
      const defChan = get(companyByUrl, 'channel', channelCookie);
      changeFieldValue('channel', defChan);
      setCookie('brixelChannelSignup', defChan);
    } else {
      changeFieldValue('channel', channelCookie);
    }
  }, []);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue));
    if (get(formValue, 'propertyType', null)) setNewCurrentIndex(currentIndex);
  }, [lang, company.stub, translations, formValue, currentIndex]);

  // FUNCTION TO CALC THE LIVING SPACE FROM GROSS AREA
  useEffect(() => {
    if (get(formValue, 'properties.typology.floorSpace.value', 0) > 0) {
      changeFieldValue('properties.typology.livingArea.value', get(formValue, 'properties.typology.floorSpace.value', 0));
    }
    if (get(formValue, 'properties.typology.lotArea.value', 0) > 0) {
      changeFieldValue('properties.typology.livingArea.value', get(formValue, 'properties.typology.lotArea.value', 0));
    }
  }, [currentIndex]);

  // FUNCTION TO CHANGE THE TITLE ON CHANGING LOCATION
  useEffect(() => {
    if (get(formValue, 'properties.propertyType', null) && get(formValue, 'location.address', null)) {
      const propertyType = get(formValue, 'properties.propertyType', null);
      const pageTitle = titleProperty(formValue.location, propertyType, lang);
      if (pageTitle) changeFieldValue('pageTitle', pageTitle);
    }
  }, [get(formValue, 'properties.propertyType', null), get(formValue, 'location.city', null), lang]);

  useEffect(() => {
    if (get(formValue, 'properties.propertyType', null) && newCurrentIndex === 0) {
      setNewCurrentIndex(newCurrentIndex + 1);
    }
  }, [get(formValue, 'properties.propertyType', null)]);


  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      setCookie('brixelStubCompany', company.stub);
      changeFieldValue('company', company.stub);
    }
    initForm(initialValues);
  }, [get(company, 'id', null)]);

  return (
    <div className="brixelBoutique flex-1">
      {
        activeSingleCompany.id && (
          <FlowScreen
            baseURL={'/packageFlow/brixelBoutique'}
            onChangeCurrentIndex={(index) => setCurrentIndex(index)}
            newCurrentIndex={newCurrentIndex}
            formName="GetStarted"
            onSaveData={() => saveData()}
            QuestionsList={questions}
          />
        )
      }
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const urlSearch = queryString.parse(get(ownProps.history, 'location.search', ''));
  const channelCookie = cookie.get('brixelChannelSignup') || null;
  const channel = get(urlSearch, 'channel', channelCookie);
  const propertyType = get(urlSearch, 'propertyType', null);
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const company = get(state, 'companies.activeSingleCompany.stub', null);
  const isTest = get(state, 'common.isTest', false);
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    initialValues: ownProps.testValue ? ownProps.testValue : {
      ...get(state, 'brixelForm.GetStarted.initialValues', {}),
      channel,
      pageID: get(state, 'brixelForm.GetStarted.values.pageID', null),
      changeCountry: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      company: get(state, 'companies.activeSingleCompany.stub', null),
      id: isTest && company ? companies[company].propID : null,
      location: {
        ...get(state, 'brixelForm.GetStarted.values.location', { }),
        countryCode: get(state, 'companies.activeSingleCompany.country.code', 'CH'),
      },
      login: {},
      owner: get(state, 'user.loggedInUser.user.id', null),
      properties: {
        propertyType,
        typology: {
          bathrooms: 0,
          bedrooms: 3,
          livingArea: {
            unit: 'm2',
          },
          floorSpace: {
            unit: 'm2',
          },
        },
        parking: {
          garage: 0,
          outside: 0,
          underground: 0,
        },
        location: {
          'address': 'Ernastrasse, 8004 Zürich, Switzerland',
          'city': 'Zürich',
          'cityZip': '8004 Zürich',
          'country': 'Switzerland',
          'countryCode': 'CH',
          'geometry': {
            'bounds': {
              'south': 47.3795486,
              'west': 8.515450399999999,
              'north': 47.3814977,
              'east': 8.519061899999999,
            },
            'location': {
              'lat': 47.3804936,
              'lng': 8.5172735,
            },
            'location_type': 'GEOMETRIC_CENTER',
            'viewport': {
              'south': 47.3791741697085,
              'west': 8.515450399999999,
              'north': 47.3818721302915,
              'east': 8.519061899999999,
            },
          },
          'latitude': 47.3804936,
          'longitude': 8.5172735,
          'name': 'Ernastrasse',
          'searchAddress': 'Ernastrasse, 8004 Zürich, Switzerland',
          'state': 'Zürich',
          'stateCode': 'ZH',
          'vicinity': null,
          'zip': '8004',
        },
      },
      register: {
        phone: {
          prefix: countryPhoneCode?.dial_code,
          number: '',
        },
      },
      signup: get(state, 'user.loggedInUser.user.id', null) !== null,
    },
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isTest: get(state, 'common.isTest', false),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.GetStarted', null),
    translations: get(state, 'translations', { }),
  });
};

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
  handleReset(initialValue) {
    (dispatch(reset('GetStarted', initialValue)));
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
)(GetStartedBrixelBoutique);
