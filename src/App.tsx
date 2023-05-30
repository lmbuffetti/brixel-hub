import React, {Fragment, lazy, Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {
  BrixelIcon,
  BrixelModal,
  BrixelModalConfirm,
  BrixelNotification,
  BrixelImage,
} from '@brixel/brixel-components';
import BrixelPage500 from '@brixel/brixel-components/dist/components/BrixelPage500';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {reset} from '@brixel/brixel-components/dist/form';
import {getTranslations} from '@brixel/brixel-components/dist/utils/TranslationsRedux.Functions';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
// COMPONENTS
import {Helmet} from 'react-helmet';
import {connect} from 'react-redux';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import smoothscrollPolyfill from 'smoothscroll-polyfill';
import Cookies from 'universal-cookie';
import {
  sendSlackNotification,
  setLanguage,
  setModal,
  setScreenNotification,
  setWindowDimensions, spinnerOff,
} from './actions/CommonActions';
import {setActiveSingleDeal} from './actions/DealActions';
import {setActiveSingleProperty} from './actions/PropertyActions';
import {getImageType} from './actions/UploadActions';
import {checkToken, saveActiveSingleUser, setUserTypes} from './actions/UserActions';
import BestimateCardOverlay from './components/BestimateCardOverlay';
import PageFooter from './components/Footer/PageFooter';
import Loading from './components/Loading';
// IMAGES
import Android192 from './images/android-icon-192x192.png';
import AppleTouch120 from './images/apple-touch-icon-120x120.png';
import AppleTouch152 from './images/apple-touch-icon-152x152.png';
import AppleTouch180 from './images/apple-touch-icon-180x180.png';
import AppleTouch76 from './images/apple-touch-icon-76x76.png';
import translateTo from './utils/translation';
import type {AppType} from './@types/App';
import Financing from './Pages/Closing/Financing/Financing';
import {getActiveSingleCompany} from './actions/CompanyActions';
import {setCookie} from './utils/helpers';
const CustomerSatisfaction = lazy(() => import('./components/CustomerSatisfaction'));
const SplashScreen = lazy(() => import('./components/SplashScreen'));
const RemoveTrailingSlash = lazy(() => import('./components/RemoveTrailingSlash'));
const Support = lazy(() => import('./components/Support'));
const ErrorBoundering = lazy(() => import('./components/ErrorBoundering'));
// GET STARTED AND ADD PROPERTY
const GetStarted = lazy(() => import('./Pages/PackageFlow/GetStarted'));
const GetStartedSeller = lazy(() => import('./Pages/PackageFlow/GetStartedSeller'));
const GetStartedBuyer = lazy(() => import('./Pages/PackageFlow/GetStartedBuyer'));
const GetStartedEstimation = lazy(() => import('./Pages/PackageFlow/GetStartedEstimation'));
const TermsCondition = lazy(() => import('./Pages/PackageFlow/TermsCondition'));
const WelcomeSeller = lazy(() => import('./Pages/WelcomeSellerModal/WelcomeSeller'));
const ScanTrialFlow = lazy(() => import('./Pages/PackageFlow/ScanTrialFlow'));
const MakeOffer = lazy(() => import('./Pages/Closing/Offers/Flow/MakeOffer'));
const IdentificationFlow = lazy(() => import('./Pages/Closing/Identification/IdentificationFlow'));

// GENERAL COMPONENTS
const PageHeader = lazy(() => import('./components/Header/PageHeader'));

const MenuSidebar = lazy(() => import('./components/Header/MenuSidebar'));

// ADMIN ROUTES
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const InsertToken = lazy(() => import('./Pages/InsertToken'));

// HUB DASHBOARD - SELLER
const DashboardSeller = lazy(() => import('./Pages/Dashboard/Seller/Dashboard'));

// HUB DASHBOARD - BUYER
const DashboardBuyer = lazy(() => import('./Pages/Dashboard/Buyer/Dashboard'));

// PARTNER
const Contact = lazy(() => import('./Pages/ContactFlow/Companies/Contact'));

// FLOW SELLER
const Bestimate = lazy(() => import('./Pages/Bestimate'));

const ProEstimationFlow = lazy(() => import('./Pages/SingleProperty/ProEstimationFlow'));

const BrixelModalFullScreen = lazy(() => import('./components/BrixelModalFullScreen'));

const SingleDocument = lazy(() => import('./Pages/SingleProperty/SingleDocument'));
const SingleFolder = lazy(() => import('./Pages/SingleProperty/SingleFolder'));

const CreateDeal = lazy(() => import('./Pages/Deals/CreateDeal'));
const VisitFeedback = lazy(() => import('./Pages/Deals/VisitFeedback'));

const AddContactBuyer = lazy(() => import('./Pages/Dashboard/Buyer/AddContactBuyer'));

const SingleDeal = lazy(() => import('./Pages/Deals/SingleDeal'));

const MarketSeller = lazy(() => import('./Pages/Market/MarketSeller'));

const MarketBuyer = lazy(() => import('./Pages/Market/MarketBuyer'));

const WarningScreen = lazy(() => import('./components/WarningScreen'));

const cookies = new Cookies();

declare let ga;
declare let gtag;

const App = (props: AppType) => {
  const isOpenTransifex = cookies.get('transifex_sidebar');
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    config,
    handleCheckToken,
    handleGetActiveSingleCompany,
    handleGetImageType,
    handleGetTranslations,
    handleReset,
    handleSaveActiveSingleUser,
    handleSetActiveSingleDeal,
    handleSetActiveSingleProperty,
    handleSetLanguage,
    handleSetModal,
    handleSetNotification,
    handleSetUserTypes,
    handleSetWindowsDimension,
    handleSpinnerOff,
    isLoading = false,
    isSmallLoading,
    lang,
    languages,
    loggedInUser,
    modal,
    notification,
    pageError,
    redirectTo,
    splashScreenType,
    teamAvatars,
    translations,
    userRate,
    userTypes,
    windowDimensions,
  } = props;
  // STATE
  // CONSTANT TO PREVENT TRANSIFEX ERROR
  const [langURL, setLangURL] = useState<string | null>(null);
  const [classMain, setClassMain] = useState('w-perc-100 pos-r hubContainer');
  const [urlLang, setUrlLang] = useState<string>();

  const [isSecLevel, setIsSecLevel] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const [zIndex, setZIndex] = useState(1);
  const [isFlow, setIsFlow] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [showCustomerSatisfaction, setShowCustomerSatisfaction] = useState<any>();
  // const [extraHeight, setExtraHeight] = useState(0);

  // USEREF TO MANAGE DOM ELEMENT
  const dashContentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const dashWrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const dashWrapperEl = dashWrapperRef.current;
  const el = document.getElementsByClassName('thirdLevel');

  useEffect(() => {
    if (smoothscrollPolyfill) smoothscrollPolyfill.polyfill();
    const queryURL: { lang?: string } = queryString.parse(get(history, 'location.search', ''));
    if (queryURL?.lang) setLangURL(queryURL.lang.toLowerCase());
    if (history.location.pathname.includes('packageFlow')) handleSpinnerOff();
  }, []);

  useEffect(() => {
    const { search } = history.location;
    if (search && search.includes('=') && !search.includes('transifex') && search.includes('lang')) {
      const objURL = JSON.parse('{"' + search.replace('?', '').replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) {
        return key === '' ? value : decodeURIComponent(value) });
      if (objURL.lang) {
        setCookie('brixelLang', (objURL.lang).toLowerCase());
        handleSetLanguage( (objURL.lang).toLowerCase());
        setUrlLang((objURL.lang).toLowerCase());
      }
    }
  }, [history.location.search]);

  useEffect(() => {
    let currentLang = urlLang;
    if (loggedInUser.id && urlLang && (!isEmpty(currentLang) || isEmpty(loggedInUser.language)) && currentLang !== loggedInUser.language) {
      if (isEmpty(currentLang) && isEmpty(loggedInUser.language)) currentLang = 'en';
      const userData = {
        id: get(loggedInUser, 'id', null),
        language:currentLang,
        setLoggedInUser: true,
        smallLoader: 'saveData',
      };
      handleSaveActiveSingleUser(userData);
    }
  }, [loggedInUser.id, urlLang]);


  useEffect(() => {
    const companyID = activeSingleCompany.id;
    const companyPageID = (activeSingleProperty.company || '').toString();
    if (activeSingleProperty.company && (companyID !== companyPageID || !companyID)) {
      handleGetActiveSingleCompany({id: activeSingleProperty.company})
    }
  }, [activeSingleProperty.id]);

  useEffect(() => {
    if (
      userRate!== null && !userRate.rating &&
      (loggedInUser?.sentFeedback || 0) < 2 &&
      (loggedInUser?.sentFeedback || 0) >= 0 &&
      loggedInUser?.id &&
      !isFlow &&
      history.location.pathname.includes('buy') &&
      !history.location.pathname.includes('scheduleVisit') &&
      userTypes === 'buyer' &&
      activeSingleCompany.id &&
      !showCustomerSatisfaction
    ) {
      let isToday = false;
      const today = Math.floor(Date.now() / 1000);
      if (localStorage.brixelSatisfactionDay && today === localStorage.brixelSatisfactionDay) {
        isToday = true;
      }
      if (!isToday) {
        const interval = 60;
        let countdown = interval;
        if (!localStorage.brixelSatisfactionEndTime) {
          localStorage.brixelSatisfactionEndTime = interval;
        } else {
          countdown = localStorage.brixelSatisfactionEndTime;
        }
        const showCustomer = setInterval(() => {
          countdown -= 1;
          if (countdown === 0) {
            handleSetModal({
              clickOutsideToClose: false,
              hideHeader: true,
              hideClose: true,
              bodyClassColor: 'p-0 dis-fl-col',
              bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
              state: true,
              small: true,
              layout: 'large',
              component: <CustomerSatisfaction onClose={() => handleSetModal({})} />,
            })
            clearInterval(showCustomer);
            localStorage.brixelSatisfactionEndTime = interval;
          } else if (countdown >= 0) {
            localStorage.brixelSatisfactionEndTime = countdown;
          }
        }, 1000);
        setShowCustomerSatisfaction(showCustomer);
      }
    } else if (showCustomerSatisfaction && !history.location.pathname.includes('buy')) {
      clearInterval(showCustomerSatisfaction);
      setShowCustomerSatisfaction(undefined);
    }
  }, [loggedInUser.language, activeSingleCompany.id, userTypes, isFlow, history.location.pathname]);


  // FUCNTION TO INITIALIZE TRANSIFEX AND LOAD THE TRANSLATIONS
  useEffect(() => {
    let userLang: string | undefined = 'en';
    if (!urlLang) {
      if (loggedInUser.id) {
        userLang = loggedInUser.language === 'en_US' ? 'en' : loggedInUser.language;
        if (isEmpty(userLang)) userLang = 'en';
        handleSetLanguage(userLang || 'en');
      } else if (activeSingleCompany.id && !loggedInUser.id) {
        if (cookies.get('brixelLang') && cookies.get('brixelLang') !== 'undefined') {
          userLang = cookies.get('brixelLang');
        } else {
          userLang = langURL || activeSingleCompany.language.code || 'en';
        }
        if (isEmpty(userLang)) userLang = 'en';
        setCookie('brixelLang', userLang);
        if (userLang) handleSetLanguage(userLang);
      }
    }
  }, [loggedInUser.language, activeSingleCompany.id, userTypes]);

  useEffect(() => {
    if (languages.length > 0) {
      let languagesList = languages;
      if (languagesList) {
        languagesList = languagesList.filter((lng) => lng.code !== 'en');
        handleGetTranslations(languagesList, config.apiPath || '');
      }
    }
  }, [languages]);

  // FUNCTION TO LOAD THE USER TYPE BUYER OR SELLER
  useEffect(() => {
    if (
      activeSingleProperty?.id && (
        (
          get(activeSingleProperty, 'owner', null) === get(loggedInUser, 'id', 'b') ||
          get(activeSingleProperty, 'owner.id', null) === get(loggedInUser, 'id', 'b')
        ) &&
        !get(history, 'location.pathname', '').includes('buyer')
      ) ||
      get(history, 'location.pathname', '').includes('seller')
    ) {
      handleSetUserTypes('seller');
    } else {
      handleSetUserTypes('buyer');
    }
    if (!activeSingleProperty.documents) handleSetActiveSingleDeal({});
  }, [activeSingleProperty.id, loggedInUser.id, history.location.pathname]);

  const bodyModal = document.getElementById('bodyModalWrapper') as HTMLElement;
  useEffect(() => {
    const hubDash = document.getElementsByClassName('hubDashboard')[0] as HTMLElement;
    if (hubDash) {
      if (bodyModal) {
        hubDash.style.overflow = 'hidden';
      } else {
        hubDash.style.overflow = '';
      }
    }
  }, [bodyModal]);

  // FUNCTION USED TO SEND THE DATA TO HANALITYCS
  useEffect(() => {
    if (get(history, 'location.pathname', '') === '/' || !get(history, 'location.pathname', '')) {
      history.push('/sell');
    }
    if (get(history, 'location', null) && typeof ga === 'function') {
      ga('send', 'pageview', history.location.pathname);
    }
    if (get(history, 'location', null) && typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: 'Hub',
        page_location: window.location.href,
        send_to: baseByData?.googleAnalyticsId,
      })
    }
    const splittedURL = get(history, 'location.pathname', '').split('/');
    if (splittedURL[1] === 'sell') {
      const customID = get(activeSingleProperty, 'id', null);
      if (customID) handleSetActiveSingleProperty({ customID });
      else handleSetActiveSingleProperty({});
    }
    if (splittedURL[1] === 'buy') {
      handleSetActiveSingleProperty({ });
    }
    const scrollFlow = document.getElementsByClassName('flowScrollWrap')[0];
    if (scrollFlow) scrollFlow.scrollTop = 0;
  }, [history.location]);

  // FUNCTION TO MANAGE THE REDIRECT FROM REDUX REDUCER
  useEffect(() => {
    if (redirectTo && get(redirectTo, 'history', null)) {
      if (get(redirectTo, 'history.pathname', null)) {
        history.push(get(redirectTo, 'history.pathname', ''), { state: get(redirectTo, 'history.state', {}) });
      } else if (redirectTo.history.includes('home')) {
        // window.location.assign(redirectTo.history);
      } else {
        history.push(redirectTo.history);
      }
    }
    if (redirectTo && get(redirectTo, 'url', null)) {
      // window.location.assign(redirectTo.url);
    }
  }, [redirectTo]);

  // FUCNTION TO SEPARATE THE DESIGN IN BASE OF HISTORY LOCATION (packageFLow, onBoarding, upgrade)
  useEffect(() => {
    if (
      history.location.pathname.includes('packageFlow') ||
      history.location.pathname.includes('Flow') ||
      history.location.pathname.includes('visitFeedback') ||
      history.location.pathname.includes('onBoarding') ||
      history.location.pathname.includes('upgrade') ||
      history.location.pathname.includes('trialRequest') ||
      history.location.pathname.includes('contactFlow') ||
      history.location.pathname.includes('upgrade')    ) {
      if (
        history.location.pathname.includes('packageFlow') ||
        history.location.pathname.includes('Flow') ||
        history.location.pathname.includes('visitFeedback')
      ) {
        setClassMain('flowContainer packageFlow w-perc-100');
      } else {
        setClassMain('flowContainer w-perc-100');
      }
      setIsFlow(true);
      setZIndex(6);
    } else {
      if (history.location.pathname.includes('home')) {
        setClassMain('w-perc-100 pos-r hubContainer rewardsTop withTopBar sellerHub');
      } else if (history.location.pathname.includes('property') || history.location.pathname.includes('closing') || history.location.pathname.includes('docubox') || history.location.pathname.includes('prospects') || history.location.pathname.includes('prospect') || history.location.pathname.includes('financing') || history.location.pathname.includes('scheduleVisit')) {
        if (history.location.pathname.includes('buyer')) {
          setClassMain('w-perc-100 pos-r hubContainer buyerHub propertyTop');
        } else {
          setClassMain('w-perc-100 pos-r hubContainer propertyTop withTopBar sellerHub');
        }
      } else if (history.location.pathname.includes('marketing')) {
        setClassMain('w-perc-100 pos-r hubContainer marketingTop withTopBar sellerHub');
        // eslint-disable-next-line no-dupe-else-if
      } else if (history.location.pathname.includes('/sell') || history.location.pathname.includes('/buy')) {
        if (history.location.pathname.includes('/buy/favorites/map')) {
          setClassMain('w-perc-100 pos-r ov-h marketHome mapView');
        } else {
          setClassMain('w-perc-100 pos-r ov-h marketHome');
        }
      }  else if (history.location.pathname.includes('offers')) {
        setClassMain('w-perc-100 pos-r hubContainer offersTop withTopBar sellerHub');
      } else {
        setClassMain('w-perc-100 pos-r hubContainer ov-h');
      }
      setIsFlow(false);
      setZIndex(1);
    }

    // add class to container when secondlevel visible on mobile
    if (
      (
        history.location.pathname.includes('property/') ||
        history.location.pathname.includes('marketing/') ||
        history.location.pathname.includes('rewards/') ||
        history.location.pathname.includes('closing/')
      ) &&
      windowDimensions.width <= 1024 &&
      !history.location.pathname.includes('buyer')
    ) {
      setIsSecLevel(true);
      if ([...el].length > 0 && dashWrapperEl) {
        dashWrapperEl.classList.add('secondLevelActive');
      } else if (dashWrapperEl) {
        dashWrapperEl.classList.remove('secondLevelActive');
      }
    } else {
      setIsSecLevel(false);
      if (dashWrapperEl) {
        dashWrapperEl.classList.remove('secondLevelActive');
      }
    }

    if (
      (!history.location.pathname.includes('sell') || history.location.pathname.includes('termsConditionFlow')) &&
      (!history.location.pathname.includes('buy') || history.location.pathname.includes('buyer'))
    ) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }

  }, [history.location.pathname, dashWrapperEl, [...el].length]);

  const calcHeaderHeight = useCallback(() => {
    const head = document.getElementsByClassName('hubDasHeader') as HTMLCollectionOf<HTMLDivElement>;
    return head[0] ? head[0].offsetHeight : 0;
  }, []);

  const headerCalc = useCallback(() => {
    let contentHeight;
    if (!isFlow) {
      contentHeight = windowDimensions.height;
    } else {
      contentHeight = 'auto';
    }
    return contentHeight;
  }, [isFlow, calcHeaderHeight, windowDimensions]);

  // DID MOUNT TO CHECK THE USER TOKEN AND INITIALIZE THE WINDOW SIZE LISTENER
  useEffect(() => {
    if (cookies && cookies.get('brixelToken')) {
      let data = {};
      if (
        !history.location.pathname.includes('packageFlow') &&
        !history.location.pathname.includes('Flow') &&
        !history.location.pathname.includes('visitFeedback') &&
        !history.location.pathname.includes('onBoarding')
      ) data = { hideLoad: true };
      handleCheckToken(data);
    }
    handleGetImageType({ smallLoader: 'imgType' });
  }, []);

  const contentLayout = useCallback(() => {
    if (!isFlow) {
      if (isSecLevel) {
        return { height: '100%' };
      }
      if (windowDimensions.width <= 1024) {
        return { height: windowDimensions.height };
      }
    } else if (isFlow) {
      return { height: windowDimensions.height };
    }
    return undefined;
  }, [isFlow, windowDimensions]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      handleSetWindowsDimension({
        height: window.innerHeight,
        width: window.innerWidth,
      });
      headerCalc();
      calcHeaderHeight();
    });
  }, [window]);

  // add class to body when loading enabled
  useEffect(() => {
    const loadingClass = document.getElementsByClassName('elem-loader')[0];
    const body = document.getElementsByTagName('body')[0];
    if (loadingClass) {
      body.classList.add('bodyLoading');
    } else {
      body.classList.remove('bodyLoading');
    }
  });

  if (Object.keys(translations).length === 0) {
    return <Loading isLoading={true} />
  }

  return (
    <>
      <Helmet>
        <link rel="apple-touch-icon" href={AppleTouch76} />
        <link rel="apple-touch-icon" sizes="76x76" href={AppleTouch76} />
        <link rel="apple-touch-icon" sizes="120x120" href={AppleTouch120} />
        <link rel="apple-touch-icon" sizes="152x152" href={AppleTouch152} />
        <link rel="apple-touch-icon" sizes="180x180" href={AppleTouch180} />
        <link rel="icon" sizes="192x192" href={Android192} />
        <title>Brixel Hub</title>
      </Helmet>
      {
        ((!lang ||
          (isFlow && !activeSingleCompany.id)
        ) && !history.location.pathname.includes('tokeninput')) && (
          <Loading isLoading={true} isSmall />
        )
      }
      {
        pageError && (
          <BrixelPage500
            className="errorPage"
            errorMessage="You can try again or go back to the dashboard"
          />
        )
      }
      <main
        className={`${!isFlow ? 'hubDashboard h-perc-100' : 'flowWrapper'} dis-fl-row jc-b ${history.location.pathname.includes('upgrade/packages') ? 'upgradePackages' : ''} ${showFooter ? 'activeFooter' : ''} ${isOpenTransifex ? '' : 'notranslate'}`}
        ref={dashWrapperRef}
      >
        <Loading isLoading={isLoading} />
        <Suspense fallback={<Loading isLoading />}>
          <div
            className={`${classMain} ${history.location.pathname.includes('property/') || history.location.pathname.includes('deal') ? 'dealsPage' : ''} ${isSecLevel ? 'fixedLayout' : ''}`}
          >
            <div className="dis-f">
              <div
                className={`zIndex${zIndex} w-perc-100 dis-fl-col ${!isFlow ? 'hubTopWrapper' : 'flowScrollWrap'}`}
                style={contentLayout()}
              >
                <div
                  id="bodyScroll"
                  className={`content dis-fl-col ${!isFlow ? 'hubDasContent ov-y-a ov-x-h' : 'flowContent'} ${notification[0] && notification[0].state ? 'saveActionOn' : ''}`}
                  style={isSecLevel ? { height: '100%' } : { height: headerCalc() }}
                  ref={dashContentRef}
                >
                  <PageHeader
                    showFooter={showFooter}
                    changeZIndex={(index) => { setZIndex(index); }}
                    isFlow={isFlow}
                  />
                  {
                    !isFlow &&
                    !history.location.pathname.includes('sell') &&
                    (!history.location.pathname.includes('buy') || history.location.pathname.includes('buyer')) &&
                    loggedInUser &&
                    windowDimensions.width > 1024 &&
                    (
                      <MenuSidebar />
                    )
                  }
                  <div
                    className="w-perc-100 innerWrap"
                  >
                    <RemoveTrailingSlash/>
                    <Routes>
                      <Route path="/500" element={<ErrorBoundering><div /></ErrorBoundering>} />
                      { /* SECTION: ONBOARDING */}
                      <Route path="/packageFlow/" element={<GetStarted />} />
                      <Route path="/packageFlow/getstarted/*" element={<GetStartedSeller />} />
                      <Route path="/packageFlow/getstartedBuyer/*" element={<GetStartedBuyer />} />
                      <Route path="/packageFlow/getstartedEstimation/*" element={<GetStartedEstimation />} />
                      { /* SECTION: ONBOARDING WITH COMPANY STUB */}
                      <Route path="/packageFlow/:companyStub" element={<GetStarted />} />
                      <Route path="/packageFlow/getstarted/:companyStub/*" element={<GetStartedSeller />} />
                      <Route path="/packageFlow/getstartedBuyer/:companyStub/*" element={<GetStartedBuyer />} />
                      <Route path="/packageFlow/getstartedEstimation/:companyStub/*" element={<GetStartedEstimation />} />
                      <Route path="/termsConditionFlow/:companyStub/:userType" element={<ProtectedRoute><TermsCondition /></ProtectedRoute>} />

                      <Route path="/packageFlow/:propID/WelcomeSeller/*" element={<ProtectedRoute><WelcomeSeller /></ProtectedRoute>} />
                      <Route path="/packageFlow/testDrive/*" element={<ScanTrialFlow />} />
                      <Route path="/visitFeedback/:dealID/:pageID" element={<VisitFeedback />} />
                      <Route path="/buyer/:id/financingFlow/*" element={<ProtectedRoute><Financing /></ProtectedRoute>} />

                      { /* PARTNER CONTACT FLOW */}
                      <Route path="/:propID/contactFlow/*" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                      <Route path="/buyer/:propID/contactFlow/*" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

                      { /* SECTION: INSERT TOKEN */}
                      <Route path="/tokeninput" element={<InsertToken />} />

                      { /* SECTION: CLOSING FLOWS */}
                      <Route path="/packageFlow/:id/makeOffer/*" element={<ProtectedRoute><MakeOffer /></ProtectedRoute>} />
                      <Route path="/packageFlow/:propID/:dealID/closing/:userType/identification/*" element={<ProtectedRoute><IdentificationFlow /></ProtectedRoute>} />

                      { /* SECTION: HUB DASHBOARD */ }
                      {
                        !history.location.pathname.includes('packageFlow') &&
                        !history.location.pathname.includes('Flow') &&
                        !history.location.pathname.includes('visitFeedback') &&
                        !history.location.pathname.includes('onBoarding') &&
                        !history.location.pathname.includes('buyer') &&
                        (
                          <>
                            <Route path="/sell/*" element={<ProtectedRoute><MarketSeller /></ProtectedRoute>} />
                            <Route path="/buy/*" element={<ProtectedRoute><MarketBuyer /></ProtectedRoute>} />
                            {
                              ((get(history, 'location.pathname', '').split('/')[1] !== 'sell' &&
                                  get(history, 'location.pathname', '').split('/')[1] !== 'buy' &&
                                  get(history, 'location.pathname', '').split('/')[1].length > 18) ||
                                get(history, 'location.pathname', '').split('/')[1] === 'company') && (

                                <>
                                  <Route path="/:propID/*" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/singleFlow" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/support" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/deal/*" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID/prospect/:dealID" element={<ProtectedRoute><SingleDeal /></ProtectedRoute>} />
                                </>
                              )
                            }
                          </>
                        )
                      }
                      {
                        !history.location.pathname.includes('packageFlow') &&
                        !history.location.pathname.includes('Flow') &&
                        !history.location.pathname.includes('visitFeedback') &&
                        !history.location.pathname.includes('onBoarding') &&
                        (
                          <>
                            <Route
                              path="/buyer/:propID/*"
                              element={
                                <ProtectedRoute><DashboardBuyer /></ProtectedRoute>
                              }
                            />
                            <Route
                              path="/buyer/propertyList"
                              element={
                                <ProtectedRoute><DashboardBuyer /></ProtectedRoute>
                              }
                            />
                          </>
                        )
                      }
                      {
                        !get(history, 'location.pathname', '').includes('Flow') && (
                          <Route path="*" element={<Navigate to="/sell" />} />
                        )
                      }
                    </Routes>
                    <div
                      className="dis-fl-col a-b jc-fe supportBtn"
                    >
                      {
                        showSupport && (
                          <Support
                            layout="floatable"
                            expanded
                            isFixed
                            onClose={() => setShowSupport(false)}
                          />
                        )
                      }
                      {
                        !showSupport && (
                          <div
                            className="supportBubble dis-f jc-b a-c cur-poi bgWhite p-1 brdFullRadius zIndex1 pr-2 shadow-2dp"
                            onClick={() => setShowSupport(!showSupport)}
                          >
                            <div className="dis-f jc-b a-c">
                              {
                                teamAvatars.map((imgTeam, i) => (
                                  <BrixelImage
                                    loading="lazy"
                                    key={`avt_${i.toString()}`}
                                    url={imgTeam.url}
                                    size={'XS'}
                                    alt="Support Team"
                                    className="w-fix-32 mr-1-neg square brdLarge brdWhite brdCircle"
                                  />
                                ))
                              }
                            </div>
                            <span className="ml-2 txtText900 fweight-500">
                              {translateTo('Brixel Support', lang)}
                            </span>
                          </div>
                        )
                      }
                    </div>
                  </div>

                  {
                    showFooter && !isSecLevel && (
                      <PageFooter
                        activeSideBar={!isFlow}
                      />
                    )
                  }

                </div>
              </div>

            </div>
          </div>

          { /* SECTION: ACHIVEMENT FLOW */ }
          <Routes>
            <Route
              path="/:propID/singleFlow/achievement/bestimate/*"
              element={<ProtectedRoute><Bestimate /></ProtectedRoute>}
            />
            <Route path="/buyer/:act/:propID/contact/add" element={<ProtectedRoute><AddContactBuyer /></ProtectedRoute>} />
            <Route path="/:propID/prospects/newDeal" element={<ProtectedRoute><CreateDeal /></ProtectedRoute>} />
            <Route path="/:propID/property/price/proEstimation" element={<ProtectedRoute><ProEstimationFlow /></ProtectedRoute>} />
            <Route path="*" element={null} />
          </Routes>

          {
            modal.state && !modal.type && !modal.small && (
              <BrixelModalFullScreen
                lang={lang}
                title={modal.title || ''}
                onClose={() => {
                  handleSetModal({ state: false });
                }}
              >
                {modal.body}
              </BrixelModalFullScreen>
            )
          }
          {
            modal.type === 'confirm' && (
              <BrixelModalConfirm
                confirm={() => modal.confirm ? modal.confirm() : ''}
                cancel={() => modal.cancel ? modal.cancel() : ''}
                title={modal.title || ''}
                icon="alert"
                message={modal.message || ''}
              />
            )
          }
          {
            modal.state && !modal.type && modal.small && (
              <BrixelModal
                bodyActionsClass={modal.bodyActionsClass}
                bodyClassColor={modal.bodyClassColor}
                bodyInnerClass={modal.bodyInnerClass}
                classContainer={modal.classContainer}
                classImg={modal.classImg}
                className={modal.className}
                classTitle={modal.classTitle}
                hideHeader={modal.hideHeader}
                layout={modal.layout}
                multiActions={modal.multiActions}
                multiBodyActions={modal.multiBodyActions}
                onClose={() => modal.hideClose !== true && !modal.onClose ? handleSetModal({ state: false }) : modal.onClose && modal.onClose()}
                showLogoHeader={modal.showLogoHeader}
                title={modal.title}
                titleImg={modal.titleImg}
                titleTop={modal.titleTop}
                titleTopClass={modal.titleTopClass}
              >
                {
                  modal.body && (
                    <div className={modal.bodyInnerClass} dangerouslySetInnerHTML={{ __html: modal.body }} />
                  )
                }
                {
                  modal.component && (
                    <>
                      {modal.component}
                    </>
                  )
                }
                {
                  modal.showSupport && (
                    <Support
                      expanded
                      isFixed={false}
                      hideClose
                      layout={modal.supportLayout || 'onboarding'}
                    />
                  )
                }
              </BrixelModal>
            )
          }

          {
            modal.state && modal.type === 'confirmExit' && (
              <WarningScreen
                lang={lang}
                saveFunc={() => modal.saveFunc ? modal.saveFunc() : ''}
                title={modal.title}
                formName={modal.formName}
                onClose={() => modal.onClose ? modal.onClose() : ''}
              />
            )
          }

          {
            modal.state && modal.type === 'bestimate' && (
              <BestimateCardOverlay
                lang={lang}
                activeSinglePropertyId={activeSingleProperty.id}
                clearEstimation={false}
              />
            )
          }

          { /* SPLASH SCREEN */}
          {
            (splashScreenType === 'marketOverlay' || splashScreenType === 'marketOverlayCarousel') && (
              <SplashScreen
                className="result-market-overlay"
                closeOutside={false}
                type={splashScreenType}
              />
            )
          }

          {
            splashScreenType && typeof splashScreenType === 'object' && splashScreenType.component && (
              React.createElement(splashScreenType.component, splashScreenType.props)
            )
          }

          { /* SECTION: GENERAL NOTIFICATION - use redux notification to populate */}
          {
            notification && notification.length > 0 &&
            !history.location.pathname.includes('home') &&
            !isFlow &&
            (
              <div className="brixel-notifications">
                {
                  notification.map((not, i) => (
                    <Fragment key={`ntf_${i.toString()}`}>
                      <BrixelNotification
                        className={not.state ? 'fadeInLeft' : 'fadeOutLeft'}
                        handleSetNotification={(data) => handleSetNotification(data)}
                        isSmallLoading={isSmallLoading}
                        icon={not.icon}
                        label={translateTo(not.label || '', lang)}
                        notification={{...not, lang: lang}}
                        resetForm={(form, data) => handleReset(form, data)}
                        type={not.type}
                        lang={lang}
                      />
                    </Fragment>
                  ))
                }
              </div>
            )
          }

          {
            !history.location.pathname.includes('docubox') &&
            notification[0] && (notification[0].small || notification[0].state) && (
              <>
                {
                  notification[0].small && (
                    <div className="brxNotification">
                      <BrixelIcon icon={notification[0].icon || ''} />
                      <span>{notification[0].text}</span>
                    </div>
                  )
                }
              </>
            )
          }

          {/* Splash screens for single deal, create new deal and edit document */}
          <Routes>
            <Route
              path="/:propID/docubox/:docID/editDocument"
              element={<SingleDocument />}
            />
            <Route
              path="/:propID/docubox/:docID/addToFolder"
              element={<SingleFolder />}
            />
            <Route path="/:propID/prospects/newDeal" element={<CreateDeal />} />
            <Route path="*" element={null} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  config: get(state, 'common.configUrl', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  lang: get(state, 'common.language', null),
  languages: get(state, 'common.languages', '[]'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  modal: get(state, 'common.modal', {}),
  notification: get(state, 'common.notification', []),
  pageError: get(state, 'common.setPageData.pageError', false),
  redirectTo: get(state, 'common.redirectTo', null),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  teamAvatars: get(state, 'companies.activeSingleCompany.teamAvatars', get(state, 'user.loggedInUser.user.company.teamAvatars', [])),
  userTypes: get(state, 'user.userTypes', null),
  userRate: get(state, 'user.userRate', null),
  translations: get(state, 'translations', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleReset(form, value) {
    dispatch(reset(form, value));
  },
  handleGetTranslations(langList, baseURL) {
    dispatch(getTranslations(langList, baseURL))
  },
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSendSlackNotifications: bindActionCreators(sendSlackNotification, dispatch),
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);
