/* global ga, gtag, Transifex */
// COMPONENTS
import { BrixelIcon, BrixelModal, BrixelNotification } from '@brixel/brixel-components';
import BrixelPage500 from '@brixel/brixel-components/dist/components/BrixelPage500';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { reset } from '@brixel/brixel-components/dist/form';
import { getTranslations } from '@brixel/brixel-components/dist/utils/TranslationsRedux.Functions';
import get from 'lodash/get';
import has from 'lodash/has';
import PropTypes from 'prop-types';
import queryString from 'query-string';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import smoothscrollPolyfill from 'smoothscroll-polyfill';
import Cookies from 'universal-cookie';
import {
  sendSlackNotification,
  setLanguage,
  setModal,
  setScreenNotification,
  setWindowDimensions,
} from './actions/CommonActions';
import { setActiveSingleDeal } from './actions/DealActions';
import { setActiveSingleProperty } from './actions/PropertyActions';
import { getImageType } from './actions/UploadActions';
import { checkToken, setUserTypes } from './actions/UserActions';
import BestimateCardOverlay from './components/BestimateCardOverlay';
import WizardCard from './components/Cards/WizardCard';
import PageFooter from './components/Footer/PageFooter';

import lazyWithRetry from './components/LazyWithRetry';
import Loading from './components/Loading';
// IMAGES
import Android192 from './images/android-icon-192x192.png';
import AppleTouch120 from './images/apple-touch-icon-120x120.png';
import AppleTouch152 from './images/apple-touch-icon-152x152.png';
import AppleTouch180 from './images/apple-touch-icon-180x180.png';
import AppleTouch76 from './images/apple-touch-icon-76x76.png';
import browserDetection from './utils/browserDetection';
import translateTo from './utils/translation';

const SplashScreen = lazyWithRetry(() => import('./components/SplashScreen'));
const Support = lazyWithRetry(() => import('./components/Support'));
const ErrorBoundering = lazyWithRetry(() => import('./components/ErrorBoundering'));
// GET STARTED AND ADD PROPERTY
const GetStarted = lazyWithRetry(() => import('./Pages/PackageFlow/GetStarted'));
const GetStartedSeller = lazyWithRetry(() => import('./Pages/PackageFlow/GetStartedSeller'));
const GetStartedBuyer = lazyWithRetry(() => import('./Pages/PackageFlow/GetStartedBuyer'));
const GetStartedEstimation = lazyWithRetry(() => import('./Pages/PackageFlow/GetStartedEstimation'));
const TermsCondition = lazyWithRetry(() => import('./Pages/PackageFlow/TermsCondition'));
const WelcomeSeller = lazyWithRetry(() => import('./Pages/WelcomeSellerModal/WelcomeSeller'));
const ScanTrialFlow = lazyWithRetry(() => import('./Pages/PackageFlow/ScanTrialFlow'));
const MakeOffer = lazyWithRetry(() => import('./Pages/Closing/Offers/Flow/MakeOffer'));
const Financing = lazyWithRetry(() => import('./Pages/Closing/Financing/Financing'));
const IdentificationFlow = lazyWithRetry(() => import('./Pages/Closing/Identification/IdentificationFlow'));

// GENERAL COMPONENTS
const PageHeader = lazyWithRetry(() => import('./components/Header/PageHeader'));

const MenuSidebar = lazyWithRetry(() => import('./components/Header/MenuSidebar'));

// ADMIN ROUTES
const ProtectedRoute = lazyWithRetry(() => import('./components/ProtectedRoute'));

const InsertToken = lazyWithRetry(() => import('./Pages/InsertToken'));

// HUB DASHBOARD - SELLER
const DashboardSeller = lazyWithRetry(() => import('./Pages/Dashboard/Seller/Dashboard'));

// HUB DASHBOARD - BUYER
const DashboardBuyer = lazyWithRetry(() => import('./Pages/Dashboard/Buyer/Dashboard'));

// PARTNER
const Contact = lazyWithRetry(() => import('./Pages/ContactFlow/Companies/Contact'));

// FLOW SELLER
const Bestimate = lazyWithRetry(() => import('./Pages/Bestimate'));

const ProEstimationFlow = lazyWithRetry(() => import('./Pages/SingleProperty/ProEstimationFlow'));

const BrixelModalFullScreen = lazyWithRetry(() => import('./components/BrixelModalFullScreen'));

const SingleDocument = lazyWithRetry(() => import('./Pages/SingleProperty/SingleDocument'));

const CreateDeal = lazyWithRetry(() => import('./Pages/Deals/CreateDeal'));
const VisitFeedback = lazyWithRetry(() => import('./Pages/Deals/VisitFeedback'));

const AddShowingsBuyer = lazyWithRetry(() => import('./Pages/Dashboard/Buyer/AddShowingsBuyer'));

const AddContactBuyer = lazyWithRetry(() => import('./Pages/Dashboard/Buyer/AddContactBuyer'));

const SingleDeal = lazyWithRetry(() => import('./Pages/Deals/SingleDeal'));

const MarketSeller = lazyWithRetry(() => import('./Pages/Market/MarketSeller'));

const MarketBuyer = lazyWithRetry(() => import('./Pages/Market/MarketBuyer'));

const WarningScreen = lazyWithRetry(() => import('./components/WarningScreen'));

const cookies = new Cookies();

const App = (props) => {
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
    handleGetImageType,
    handleReset,
    handleSetActiveSingleDeal,
    handleSetActiveSingleProperty,
    handleSetLanguage,
    handleSetModal,
    handleSetNotification,
    handleGetTranslations,
    handleSetUserTypes,
    handleSetWindowsDimension,
    isLoading,
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
    userTypes,
    windowDimensions,
    wizard,
  } = props;
  // STATE
  // CONSTANT TO PREVENT TRANSIFEX ERROR
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  const [langURL, setLangURL] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [classMain, setClassMain] = useState('w-perc-100 pos-r hubContainer');

  const [isSecLevel, setIsSecLevel] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const [zIndex, setZIndex] = useState(1);
  const [isFlow, setIsFlow] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  // const [extraHeight, setExtraHeight] = useState(0);

  // USEREF TO MANAGE DOM ELEMENT
  const dashContentRef = useRef(null);
  const dashWrapperRef = useRef(null);
  const dashWrapperEl = dashWrapperRef.current;
  const el = document.getElementsByClassName('thirdLevel');

  useEffect(() => {
    if (smoothscrollPolyfill) smoothscrollPolyfill.polyfill();
    const queryURL = queryString.parse(get(history, 'location.search', ''));
    if (get(queryURL, 'lang', null)) setLangURL(queryURL.lang.toLowerCase());
  }, []);

  // FUCNTION TO INITIALIZE TRANSIFEX AND LOAD THE TRANSLATIONS
  useEffect(() => {
    let userLang = 'en';
    if (loggedInUser.user && localTransifex) {
      userLang = loggedInUser.user.language === 'en_US' ? 'en' : loggedInUser.user.language;
      handleSetLanguage(userLang);
      if (typeof Transifex !== 'undefined') Transifex.live.translateTo(lang || 'en');
    } else if (activeSingleCompany.id && !loggedInUser.user) {
      userLang = cookies.get('brixelLang') || langURL || activeSingleCompany.language.code || 'en';
      handleSetLanguage(userLang);
    }
    if (typeof Transifex !== 'undefined') {
      Transifex.live.onReady(() => {
        setIsLoaded(true);
      });
    }
    if (typeof Transifex !== 'undefined') {
      const data = {
        user: get(loggedInUser, 'id', ''),
        page: get(activeSingleProperty, 'id', ''),
        meta: `Browser Info: ${browserDetection().debug}\n Language: ${cookies.get('brixelLang')}`,
        url: window.location.href,
        apiResource: '',
      };
      Transifex.live.onError(function (err) {
        data.meta += `${JSON.stringify(err)} - ${data.meta}`;
        // eslint-disable-next-line no-console
        console.error(data, err);
        setIsLoaded(true);
        const element = document.getElementsByTagName('BODY')[0];
        element.classList.remove('txlive');
      });
    }
  }, [localTransifex, loggedInUser, activeSingleCompany.id]);
  
  useEffect(() => {
    if (languages.length > 0) {
      let languagesList = languages;
      if (languagesList) {
        languagesList = languagesList.filter((lng) => lng.code !== 'en');
        handleGetTranslations(languagesList, config.apiPath);
      }
    }
  }, [languages]);
  

  // FUNCTION TO LOAD THE USER TYPE BUYER OR SELLER
  useEffect(() => {
    if (((get(activeSingleProperty, 'owner', 'a') === get(loggedInUser, 'user.id', 'b') || get(activeSingleProperty, 'owner', 'a') === get(loggedInUser, 'user.id', 'b')) && !get(history, 'location.pathname', '').includes('buyer')) || get(history, 'location.pathname', '').includes('seller')) {
      handleSetUserTypes('seller');
    } else {
      handleSetUserTypes('buyer');
    }
    if (!activeSingleProperty.documents) handleSetActiveSingleDeal({});
  }, [activeSingleProperty.id, loggedInUser]);

  const bodyModal = document.getElementById('bodyModalWrapper');
  useEffect(() => {
    const hubDash = document.getElementsByClassName('hubDashboard')[0];
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
        send_to: baseByData.googleAnalyticsId,
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
    if (get(redirectTo, 'history', null)) {
      if (get(redirectTo, 'history.pathname', null)) {
        history.push({
          pathname: get(redirectTo, 'history.pathname', ''),
          state: get(redirectTo, 'history.state', {}),
        });
      } else if (redirectTo.history.includes('home')) {
        window.location.assign(redirectTo.history);
      } else {
        history.push(redirectTo.history);
      }
    }
    if (get(redirectTo, 'url', null)) {
      window.location.assign(redirectTo.url);
    }
  }, [redirectTo]);

  // FUCNTION TO SEPARATE THE DESIGN IN BASE OF HISTORY LOCATION (packageFLow, onBoarding, upgrade)
  useEffect(() => {
    if (
      history.location.pathname.includes('packageFlow') ||
      history.location.pathname.includes('Flow') ||
      history.location.pathname.includes('scheduleVisit') ||
      history.location.pathname.includes('visitFeedback') ||
      history.location.pathname.includes('onBoarding') ||
      history.location.pathname.includes('upgrade') ||
      history.location.pathname.includes('trialRequest') ||
      history.location.pathname.includes('contactFlow') ||
      history.location.pathname.includes('upgrade')    ) {
      if (
        history.location.pathname.includes('packageFlow') ||
        history.location.pathname.includes('Flow') ||
        history.location.pathname.includes('scheduleVisit') ||
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
      } else if (history.location.pathname.includes('property') || history.location.pathname.includes('closing') || history.location.pathname.includes('docubox') || history.location.pathname.includes('prospects') || history.location.pathname.includes('prospect') || history.location.pathname.includes('financing')) {
        if (history.location.pathname.includes('buyer')) {
          setClassMain('w-perc-100 pos-r hubContainer buyerHub propertyTop');
        } else {
          setClassMain('w-perc-100 pos-r hubContainer propertyTop withTopBar sellerHub');
        }
      } else if (history.location.pathname.includes('marketing')) {
        setClassMain('w-perc-100 pos-r hubContainer marketingTop withTopBar sellerHub');
        // eslint-disable-next-line no-dupe-else-if
      } else if (history.location.pathname.includes('prospects') || history.location.pathname.includes('closing')) {
        setClassMain('w-perc-100 pos-r hubContainer dealsTop withTopBar sellerHub');
      } else if (history.location.pathname.includes('/sell') || history.location.pathname.includes('/buy')) {
        setClassMain('w-perc-100 pos-r ov-h marketHome');
      } else if (history.location.pathname.includes('offers')) {
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
      !history.location.pathname.includes('sell') &&
      (!history.location.pathname.includes('buy') || history.location.pathname.includes('buyer'))
    ) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }

  }, [history.location.pathname, dashWrapperEl, [...el].length]);

  const calcHeaderHeight = useCallback(() => {
    const head = document.getElementsByClassName('hubDasHeader');
    return head[0] ? head[0].offsetHeight : 0;
  }, []);

  const headerCalc = useCallback(() => {
    let contentHeight;
    if (!isFlow) {
      if (windowDimensions.width <= 1024) {
        if ((history.location.pathname.includes('buy') && !history.location.pathname.includes('buyer')) || history.location.pathname.includes('sell')) {
          contentHeight = windowDimensions.height;
        } else {
          contentHeight = windowDimensions.height;
        }
      } else {
        contentHeight = windowDimensions.height;
      }
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
        !history.location.pathname.includes('scheduleVisit') &&
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
    return null;
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

  const overflowClass = useCallback(() => {
    if (history.location.pathname.includes('prospects') && !history.location.pathname.includes('offers')) {
      // if (windowDimensions.width <= 1024) return 'ov-y-a ov-x-h';
      return 'ov-y-a ov-x-h';
    }
    return 'ov-y-a ov-x-h';
  }, []);

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

  // CONDITION TO VIEW THE ELEMENTS AFTER LOADING
  if (
    !loggedInUser ||
    (!userTypes && get(activeSingleProperty, 'id', null)) ||
    !isLoaded
  ) {
    return (
      <Loading isLoading={isLoading} />
    );
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
                  className={`content dis-fl-col ${!isFlow ? `hubDasContent ${overflowClass()}` : 'flowContent'} ${notification && notification.state ? 'saveActionOn pb-8' : ''}`}
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
                    <Routes>
                      <Route path="/500" element={<ErrorBoundering />} />
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
                      <Route path="/termsConditionFlow/:companyStub/:userType" element={<TermsCondition />} />

                      <Route path="/packageFlow/:propID/WelcomeSeller/*" element={<ProtectedRoute><WelcomeSeller /></ProtectedRoute>} />
                      <Route path="/packageFlow/testDrive/*" element={<ScanTrialFlow />} />
                      <Route path="/visitFeedback/:dealID/:pageID" element={<VisitFeedback />} />
                      <Route path="/buyer/:propID/scheduleVisit" element={<ProtectedRoute><AddShowingsBuyer /></ProtectedRoute>} />
                      <Route path="/buyer/:id/financingFlow/*" element={<Financing />} />

                      { /* PARTNER CONTACT FLOW */}
                      <Route path="/:propID/contactFlow/*" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                      <Route path="/buyer/:propID/contactFlow/*" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

                      { /* SECTION: INSERT TOKEN */}
                      <Route path="/tokeninput" element={<InsertToken />} />

                      { /* SECTION: CLOSING FLOWS */}
                      <Route path="/packageFlow/:id/makeOffer/*" element={<MakeOffer />} />
                      <Route path="/packageFlow/:propID/:dealID/closing/:userType/identification/*" element={<IdentificationFlow />} />

                      { /* SECTION: HUB DASHBOARD */ }
                      {
                        !history.location.pathname.includes('packageFlow') &&
                        !history.location.pathname.includes('Flow') &&
                        !history.location.pathname.includes('scheduleVisit') &&
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
                                  <Route path="/:propID?/docubox/*" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/closing/*" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/property" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/marketing" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/support" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/prospects" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/offers" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/deal/*" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID/prospect/:dealID" element={<ProtectedRoute><SingleDeal /></ProtectedRoute>} />
                                  <Route path="/:propID?/upgrade" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                  <Route path="/:propID?/trialRequest" element={<ProtectedRoute><DashboardSeller /></ProtectedRoute>} />
                                </>
                              )
                            }
                          </>
                        )
                      }
                      {
                        !history.location.pathname.includes('packageFlow') &&
                        !history.location.pathname.includes('Flow') &&
                        !history.location.pathname.includes('scheduleVisit') &&
                        !history.location.pathname.includes('visitFeedback') &&
                        !history.location.pathname.includes('onBoarding') &&
                        (
                          <>
                            <Route path="/buyer/:propID/*" element={<ProtectedRoute><DashboardBuyer /></ProtectedRoute>} />
                            <Route path="/buyer/propertyList" element={<ProtectedRoute><DashboardBuyer /></ProtectedRoute>} />
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
                            className={`dis-f jc-b a-c cur-poi bgWhite p-1 brdFullRadius zIndex1 pr-2 shadow-2dp ${windowDimensions.width > 1024 ? '' : ''}`}
                            onClick={() => setShowSupport(!showSupport)}
                          >
                            <div className="dis-f jc-b a-c">
                              {
                                teamAvatars.map((imgTeam, i) => (
                                  <img loading="lazy"
                                    key={`avt_${i.toString()}`}
                                    src={`${baseByData.shortPath}${imgTeam.path}`}
                                    alt="Support Team"
                                    className="w-fix-32 mr-1-neg square brdLarge brdWhite brdCircle"
                                  />
                                ))
                              }
                            </div>
                            <span className="ml-2 txtDark700 fweight-500">
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
                        lang={lang}
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
            <Route path="/:propID/singleFlow/achievement/bestimate/*" element={<ProtectedRoute><Bestimate /></ProtectedRoute>} userTypes="seller" />
            <Route path="/buyer/:act/:propID/contact/add" element={<ProtectedRoute><AddContactBuyer /></ProtectedRoute>} />
            <Route path="/:propID/prospects/newDeal" element={<ProtectedRoute><CreateDeal /></ProtectedRoute>} />
            <Route path="/:propID/property/price/proEstimation" element={<ProtectedRoute><ProEstimationFlow /></ProtectedRoute>} />
            <Route path="*" element={null} />
          </Routes>

          {
            modal.state && !modal.type && !modal.small && (
              <BrixelModalFullScreen
                lang={lang}
                title={modal.title}
                onClose={() => {
                  handleSetModal({ state: false });
                }}
              >
                {modal.body}
              </BrixelModalFullScreen>
            )
          }
          {
            modal.state && !modal.type && modal.small && (
              <BrixelModal
                bodyActionsClass={modal.bodyActionsClass}
                bodyClassColor={modal.bodyClassColor}
                classContainer={modal.classContainer}
                classImg={modal.classImg}
                classTitle={modal.classTitle}
                layout={modal.layout}
                multiActions={modal.multiActions}
                multiBodyActions={modal.multiBodyActions}
                title={modal.title}
                titleImg={modal.titleImg}
                onClose={() => {
                  handleSetModal({ state: false });
                }}
              >
                <div className={modal.bodyInnerClass} dangerouslySetInnerHTML={{ __html: modal.body }} />
                {
                  modal.showSupport && (
                    <Support
                      expanded
                      isFixed={false}
                      hideClose
                      layout={modal.supportLayout || "onboarding"}
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
                saveFunc={() => modal.saveFunc()}
                title={modal.title}
                formName={modal.formName}
                onClose={() => modal.onClose()}
              />
            )
          }

          {
            modal.state && modal.type === 'bestimate' && (
              <BestimateCardOverlay
                lang={lang}
                activeSinglePropertyId={activeSingleProperty.id}
                clearEstimation={false}
                type="modal"
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
            has(splashScreenType, 'component') && (
              React.createElement(splashScreenType.component, splashScreenType.props)
            )
          }

          {
            get(wizard, 'type', null) && get(wizard, 'type', '') !== 'preMarketOverlay' && (
              <WizardCard lang={lang} />
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
                        label={translateTo(not.label, lang)}
                        notification={not}
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
            notification && (notification.small || notification.state) && (
              <>
                {
                  notification.small && (
                    <div className="brxNotification">
                      <BrixelIcon icon={notification.icon} />
                      <span>{notification.text}</span>
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
            <Route path="/:propID/prospects/newDeal" element={<CreateDeal />} />
            <Route path="*" element={null} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

App.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSetActiveSingleDeal: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleSetNotification: PropTypes.func.isRequired,
  handleGetTranslations: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  handleSetWindowsDimension: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSmallLoading: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object).isRequired,
  loggedInUser: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  notification: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageError: PropTypes.bool.isRequired,
  redirectTo: PropTypes.object,
  splashScreenType: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  teamAvatars: PropTypes.arrayOf(PropTypes.object).isRequired,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
};

App.defaultProps = {
  isLoading: false,
  redirectTo: null,
  userTypes: null,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  config: get(state, 'common.config', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  lang: get(state, 'common.language', 'en'),
  languages: get(state, 'common.languages', '[]'),
  loggedInUser: get(state, 'user.loggedInUser', null),
  modal: get(state, 'common.modal', {}),
  notification: get(state, 'common.notification', []),
  pageError: get(state, 'common.setPageData.pageError', false),
  redirectTo: get(state, 'common.redirectTo', null),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  teamAvatars: get(state, 'companies.activeSingleCompany.teamAvatars', get(state, 'user.loggedInUser.user.company.teamAvatars', [])),
  userTypes: get(state, 'user.userTypes', null),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  wizard: get(state, 'common.wizard', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleReset(form, value) {
    dispatch(reset(form, value));
  },
  handleGetTranslations(langList, baseURL) {
    dispatch(getTranslations(langList, baseURL))
  },
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleSendSlackNotifications: bindActionCreators(sendSlackNotification, dispatch),
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);
