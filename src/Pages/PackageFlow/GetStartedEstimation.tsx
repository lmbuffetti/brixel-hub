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
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import Cookies from 'universal-cookie';
import {spinnerOff, spinnerOn} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {createEstimation} from '../../actions/EstimationActions';
import {createActiveSingleProperty, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {doLogin, saveActiveSingleUser, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Flows/onBoardingEstimation';
import {calcPercentageFacts, setCookie} from '../../utils/helpers';
import {titleProperty} from '../../utils/titleCreation';
import type {
  FormToSaveData,
  FormValueType,
  GetStartedEstimationType,
} from '../../@types/Pages/PackageFlow/GetStartedEstimation';
import FlowScreen from '../../components/FlowScreen';

const cookie = new Cookies();

const GetStartedEstimation = (props: GetStartedEstimationType) => {
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
    handleCreateActiveSingleProperty,
    handleCreateEstimation,
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleSpinnerOn,
    handleValidateUser,
    initForm,
    initialValues,
    isLoading,
    isTest = false,
    lang = 'en',
    loggedInUser,
    translations,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'), changeFieldValue));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newCurrentIndex, setNewCurrentIndex] = useState(0);
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [loadingRequest, setLoadingRequest] = useState(false);
  // GET URL PARAMS
  const companyStub = get(match, 'companyStub', null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    return () => destroyForm();
  }, []);

  useEffect(() => {
    if (!isLoading) setLoadingRequest(false);
  }, [isLoading]);

  const getCurrency = () => {
    const result = {currency: 'EUR'};
    if (get(formValue, 'location.countryCode', '')) {
      const currency = DataByCountry(get(formValue, 'location.countryCode', ''));
      result.currency = (currency || 'CHF').toString();
      changeFieldValue('price.currency', result.currency);
    }
    return result;
  };

  // FUNCTION TO SAVE DATA
  const saveData = async (action = '') => {
    if (isLoading || loadingRequest) return false;
    const dataForm = cloneDeep(formValue);
    const dataFormAnswer = cloneDeep(formValue);
    delete dataFormAnswer.id;
    delete dataForm.id;
    const { login, register } = dataForm;
    setCookie('brixelSplashHome', 'bestimateResult');
    // delete dataForm.login;
    // changeFieldValue('register.password', '');
    // delete dataFormAnswer.register.password;
    // delete dataForm.company;
    // BROWSER AND META USER DATA
    const metaUserData = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in navigator) {
      metaUserData[key] = navigator[key];
    }
    // PROPERTY DATA
    delete dataFormAnswer.login;
    if (get(dataFormAnswer, 'estimationType', null) === 'seller' && action === 'skip') delete dataFormAnswer.baloiseInfo;
    if (!dataFormAnswer?.properties?.typology?.bathrooms) set(dataFormAnswer, 'properties.typology.bathrooms', 0);
    set(dataFormAnswer, 'properties.parking', {
      garage: dataFormAnswer?.properties?.parking?.garage || 0,
      outside: dataFormAnswer?.properties?.parking?.outside || 0,
      underground: dataFormAnswer?.properties?.parking?.underground || 0,
    });
    let saveLangUser = 'en';
    const checkValidLang = languagesList.find((lng) => lng.code === lang);
    if (checkValidLang) saveLangUser = lang;
    let data: FormToSaveData = {
      ...dataFormAnswer,
      packageFlowProcess: {
        answers: dataFormAnswer,
        rewardScreenData: {},
        metaUser: metaUserData,
      },
      preMarketVisible: get(dataFormAnswer, 'estimationType', null) === 'seller',
      ownerType: get(dataFormAnswer, 'estimationType', null) === 'buyer' ? 'buyer' : 'seller',
      language: saveLangUser,
      title: formValue.pageTitle,
      purpose: get(dataFormAnswer, 'estimationType', ''),
      status: 'on-request',
      listed: false,
      active: true,
      published: false,
      addProperty: get(dataFormAnswer, 'estimationType', null) !== 'buyer',
      price: get(formValue, 'price', getCurrency()),
      redirectToUserFlow: false,
      createEstimation: true,
      company: company.stub,
      redirectToUrl: '/sell',
      extraLoading: true,
    };
    if (get(dataFormAnswer, 'estimationType', null) === 'buyer') {
      data = {
        data,
        createEstimation: data.createEstimation,
        addProperty: data.addProperty,
        extraLoading: data.extraLoading,
        generate: true,
        redirectTo: '/buy/estimations',
      };
    }
    if (formValue.pageID) data.id = formValue.pageID;
    if (get(dataFormAnswer, 'estimationType', null) !== 'buyer') set(data, 'packageFlowProcess.answers.userType', get(dataFormAnswer, 'estimationType', ''));
    else {
      data.data = {
        ...data.data,
        answers: get(dataFormAnswer, 'estimationType', ''),
      };
    }
    const page = get(formValue, 'signupScreen', null);
    handleSpinnerOn();
    // IF USER IS LOGGED IN SAVE DIRECTLY THE PAGE
    if (formValue.owner) {
      data.owner = get(loggedInUser, 'user.id', '');
      // DISPATCH TO SAVE THE PROPERTY
      data.redirectToRewards = true;
      if (get(dataFormAnswer, 'estimationType', null) !== 'buyer') {
        await handleCreateActiveSingleProperty(data);}
      else {
        if (action === 'accept' && company.stub === 'baloise') {
          set(data, 'termsBaloiseBank', true);
          set(data, 'termsBaloiseInsurance', true);
        }
        if (action === 'accept' && company.stub === 'ubs') {
          set(data, 'termsUBS', true)
        }
        handleCreateEstimation(data);
      }
    } else if (page === 'login') {
      changeFieldValue('register.email', login?.email || '');
      // IF USER DO THE LOG IN, DO THE LOGIN AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      set(data, 'user', {
        username: (login?.email || '').toLowerCase(),
        password: login?.password || '',
      });
      // DISPATCH TO DO LOGIN
      set(data, 'redirectToHome', true);
      await handleDoLogin(data);
    } else {
      changeFieldValue('login.email', register?.email || '');
      // IF USER DO THE SIGN UP, DO THE REGISTRATION AND THEN SAVE DIRECTLY THE PAGE
      // USER DATA
      data.redirectToRewards = true;
      set(data, 'user', {
        ...register,
        email: (register?.email || '').toLowerCase(),
        acceptTerms: get(register, 'privacy[0]', true),
        acceptMarketing: get(register, 'acceptMarketing[0]', false),
        name: get(formValue, 'register.name', ''),
        userType: 'seller',
        signupAccept: true,
        signupChannel: get(formValue, 'channel', 'default'),
        signupProduct: null,
        language: saveLangUser,
        createUser: true,
        company: company.stub,
        ignoreEmail: false,
        seller: true,
        redirectTo: {
          pathname: `/packageFlow/getStartedEstimation/${activeSingleCompany.stub}/success`,
          state: { hideClose: true },
        },
      });
      const sellerType = [
        'seller',
        'inheritance',
        'price-development',
        'mortgage',
      ];
      const buyerType = [
        'buyer',
      ];
      if (sellerType.includes(get(dataForm, 'estimationType', ''))) {
        set(data, 'user.seller', true);
        set(data, 'user.buyer', false);
      }
      if (buyerType.includes(get(dataForm, 'estimationType', ''))) {
        set(data, 'user.seller', false);
        set(data, 'user.buyer', true);
      }
      if (activeSingleCompany.stub === 'baloise' || activeSingleCompany.stub === 'ubs') {
        const userType = get(data, 'user.buyer', null) === true ? 'buyer' : 'seller';
        set(data, 'redirectToUrl', `/termsConditionFlow/${activeSingleCompany.stub}/${userType}?url=/:pageID/home`);
      }
      // DISPATCH TO DO REGISTRATION USER
      setLoadingRequest(true);
      setCookie('brixelFirstTime', 'true');
      await handleValidateUser(data);
    }
  };

  useEffect(() => {
    if (get(loggedInUser, 'user.id', null)) changeFieldValue('owner', get(loggedInUser, 'user.id', null));
  }, [get(loggedInUser, 'user.id', null)]);

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    const inputSheet: FormValueType['inputSheet'] = cloneDeep(get(formValue, 'inputSheet', {}) || {});
    if (calcPercentageFacts('GetStarted').calcPerc !== calcPercentageFacts('GetStarted').savedPerc && inputSheet.totalComplete !== calcPercentageFacts('GetStarted').calcPerc) {
      inputSheet.totalComplete = calcPercentageFacts('GetStarted').calcPerc;
      changeFieldValue('inputSheet', inputSheet);
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
      if (currentIndex < 2) {
        history.push(`/packageFlow/getStartedEstimation/${defComp}/${get(questions, '[0].history', null)}`);
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
    setNewCurrentIndex(currentIndex);
  }, [lang, translations, formValue, currentIndex]);

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

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      const companyCountry = get(company, 'country.code', 'CH');
      changeFieldValue('location.countryCode', companyCountry);
      setCookie('brixelStubCompany', company.stub);
      changeFieldValue('company', company.stub);
    }
    if (get(formValue, 'properties.propertyType', null) === null) initForm(initialValues);
  }, [get(company, 'id', null)]);

  // REMOVE FADEIN CLASS TO INITIATE ANIMATION FOR EVERY STEP
  const getStartedEl = document.querySelector('.getStarted');
  useEffect(() => {
    setTimeout(() => {
      if (getStartedEl) getStartedEl.classList.remove('slideUpTrans');
    }, 350);
  }, [currentIndex]);

  return (
    <>
      {
        activeSingleCompany.id && (
          <FlowScreen
            baseURL={`/packageFlow/getStartedEstimation/${activeSingleCompany.stub}`}
            onChangeCurrentIndex={(index) => setCurrentIndex(index)}
            newCurrentIndex={newCurrentIndex}
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
  const channelCookie = cookie.get('brixelChannelSignup') || null;
  const channel = get(urlSearch, 'channel', channelCookie);
  const propertyType = get(state, 'brixelForm.GetStarted.values.properties.propertyType', get(urlSearch, 'propertyType', null));
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
      // price: {
      //   currency: get(state, 'companies.activeSingleCompany.country.currency', null),
      // },
      pageID: get(state, 'brixelForm.GetStarted.values.pageID', null),
      location: {
        ...get(state, 'brixelForm.GetStarted.values.location', { }),
        countryCode: get(state, 'companies.activeSingleCompany.country.code', 'all'),
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
          grossArea: {
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
      },
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
  handleCreateEstimation: bindActionCreators(createEstimation, dispatch),
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
)(GetStartedEstimation);
