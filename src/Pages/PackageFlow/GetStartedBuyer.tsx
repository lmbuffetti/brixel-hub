import React, {useEffect, useState} from 'react';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {change, destroy, initializeForm, reset} from '@brixel/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import Cookies from 'universal-cookie';
import {spinnerOff, spinnerOn} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {createActiveSingleProperty, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {createUserSearchProfile} from '../../actions/SearchProfileActions';
import {doLogin, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Flows/onBoardingBuyer';
import {setCookie} from '../../utils/helpers';
import {titleSearchProfile} from '../../utils/titleCreationSearchProfile';
import type {GetStartedType} from '../../@types/Pages/PackageFlow/GetStartedBuyer';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';
import FlowScreen from '../../components/FlowScreen';

const cookie = new Cookies();

const GetStartedBuyer = (props: GetStartedType) => {
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
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleCreateSearchProfile,
    handleSpinnerOff,
    handleSpinnerOn,
    handleValidateUser,
    initForm,
    initialValues,
    isLoading,
    lang = 'en',
    loggedInUser,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue, 'GetStarted'));
  const [currentIndex, setCurrentIndex] = useState(0);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [loadingRequest, setLoadingRequest] = useState(false);
  const companyStub = get(match, 'companyStub', null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm();
  }, []);



  // FUNCTION TO SAVE DATA
  const saveData = async (action = '') => {
    if (isLoading || loadingRequest) return false;
    const dataForm = cloneDeep(formValue);
    const dataFormAnswer = cloneDeep(formValue);
    setCookie('brixelSplashHome', 'buyerWelcome');
    const { login, register } = dataForm;
    // delete dataForm.login;
    changeFieldValue('register.password', '');
    delete dataFormAnswer.register.password;
    // delete dataForm.company;
    // BROWSER AND META USER DATA
    const metaUserData = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in navigator) {
      metaUserData[key] = navigator[key];
    }

    const dataSearchProfile = {
      characteristics: get(dataFormAnswer, 'characteristics', {}),
      location: get(dataFormAnswer, 'locations', {}),
      profile: get(dataFormAnswer, 'profile', {}),
      finance: get(dataFormAnswer, 'finance', {}),
    };
    // PROPERTY DATA
    const data = {
      dataSearchProfile,
      addSearchProfile: true,
      redirectToUserFlow: false,
      redirectToUrl: '/buy',
      extraLoading: true,
      owner: '',
      company: company.stub,
    };
    if (action === 'accept' && company.stub === 'baloise') {
      set(data, 'termsBaloiseBank', true);
      set(data, 'termsBaloiseInsurance', true);
    }
    if (action === 'accept' && company.stub === 'ubs') {
      set(data, 'termsUBS', true)
    }
    const page = get(formValue, 'signupScreen', null);
    // IF USER IS LOGGED IN SAVE DIRECTLY THE PAGE
    handleSpinnerOn();
    if (formValue.owner) {
      data.owner = get(loggedInUser, 'user.id', '');
      // DISPATCH TO SAVE THE PROPERTY
      set(data.dataSearchProfile, 'user', get(loggedInUser, 'user.id', ''))
      await handleCreateSearchProfile(data);
    } else if (page === 'login') {
      changeFieldValue('register.email', login?.email || '');
      // IF USER DO THE LOG IN, DO THE LOGIN AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      const userData = {
        username: (login?.email || '').toLowerCase(),
        password: login.password,
      };
      set(data, 'user', userData);
      // DISPATCH TO DO LOGIN
      await handleDoLogin(data);
    } else {
      changeFieldValue('login.email', register.email || '');
      // IF USER DO THE SIGN UP, DO THE REGISTRATION AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      const userData = {
        ...register,
        email: (register?.email || '').toLowerCase(),
        acceptTerms: get(register, 'privacy[0]', true),
        acceptMarketing: get(register, 'acceptMarketing[0]', false),
        name: `${register.firstName} ${get(register, 'lastName', '')}`,
        userType: 'buyer',
        signupAccept: true,
        buyer: true,
        signupChannel: get(formValue, 'channel', 'default'),
        signupProduct: null,
        language: lang || 'en',
        createUser: true,
        company: company.stub,
        ignoreEmail: false,
        redirectTo: {
          pathname: '/packageFlow/getstartedBuyer/success',
          state: { hideClose: true },
        },
      };
      set(data, 'user', userData);
      if (activeSingleCompany.stub === 'baloise' || activeSingleCompany.stub === 'ubs') {
        const userType = 'buyer';
        set(data, 'redirectToUrl', `/termsConditionFlow/${activeSingleCompany.stub}/${userType}?url=/buy`);
      }
      // DISPATCH TO DO REGISTRATION USER
      setLoadingRequest(true);
      setCookie('brixelFirstTime', 'true');
      await handleValidateUser(data);
    }
    setTimeout(() => {
      setLoadingRequest(false);
    }, 500)
  };

  useEffect(() => {
    if (get(loggedInUser, 'user.id', null)) changeFieldValue('owner', get(loggedInUser, 'user.id', null));
  }, [get(loggedInUser, 'user.id', null)]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      let defComp = get(companyByUrl, 'company', companyCookie);
      if (companyStub && companyStub !== get(questions, '[0].history', null)) defComp = companyStub;
      handleGetActiveSingleCompany({ stub: defComp || 'default' });
      setCookie('brixelStubCompany', defComp);
      history.push(`/packageFlow/getStartedBuyer/${defComp}/${get(questions, '[0].history', null)}`);
    } else {
      handleGetActiveSingleCompany({ stub: 'default' });
      // changeFieldValue('location.countryCode', 'all');`
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
    setQuestions(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue, 'GetStarted'));
  }, [lang]);

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

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      const getLang = cookie.get('brixelLang');
      const companyCountry = get(company, 'country.code', 'CH');
      changeFieldValue('location.countryCode', companyCountry);
      setCookie('brixelStubCompany', company.stub);
      changeFieldValue('company', company.stub);
      changeFieldValue('finance.currency', get(company, 'country.currency', 'CHF'));
      changeFieldValue('price.currency', get(company, 'country.currency', 'CHF'));
      setQuestions(QuestionsList(getLang, companyCountry, changeFieldValue, 'GetStarted'));
      const companyCountryCode = get(company, 'country.code', 'CH');
      const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
      changeFieldValue('register.phone.prefix', countryPhoneCode?.dial_code || null);
    }
    if (get(formValue, 'locations', []).length === 0) initForm(initialValues);
  }, [get(company, 'id', null)]);

  return (

    <>
      {
        activeSingleCompany.id && (
          <FlowScreen
            baseURL={`/packageFlow/getStartedBuyer/${activeSingleCompany.stub}`}
            onChangeCurrentIndex={(index) => setCurrentIndex(index)}
            formName="GetStarted"
            onSaveData={() => saveData()}
            QuestionsList={questions}
          />
        )
      }
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const urlSearch = queryString.parse(get(ownProps.history, 'location.search', ''));
  const channel = get(urlSearch, 'channel', 'default');
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    initialValues: {
      channel,
      changeCountry: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      company: get(state, 'companies.activeSingleCompany.stub', null),
      location: {
        countryCode: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      },
      locations: get(state, 'brixelForm.GetStarted.values.locations', []),
      characteristics: {
        livingArea: {
          min: 0,
          max: 300,
        },
        bedrooms: {min: 0, max: 9},
      },
      owner: get(state, 'user.loggedInUser.user.id', null),
      user: get(state, 'user.loggedInUser.user.id', null),
      login: {},
      finance: {
        currency: get(state, 'companies.activeSingleCompany.country.currency', {}),
      },
      price: {
        currency: get(state, 'companies.activeSingleCompany.country.currency', {}),
      },
      profile: {},
      register: {
        phone: {
          prefix: countryPhoneCode?.dial_code,
          number: '',
        },
      },
      signup: get(state, 'user.loggedInUser.id', null) !== null,
    },
    isLoading: get(state, 'common.isLoading', 0) > 0,
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
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
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedBuyer);
