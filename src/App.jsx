/* global ga, Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, useRef, useCallback, Fragment, lazy, Suspense,
} from 'react';
import {
  Switch, Route, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
// COMPONENTS
import {
  BrixelIcon,
  BrixelModal,
  BrixelNotification,
  reset,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import smoothscrollPolyfill from 'smoothscroll-polyfill';
import Loading from './components/Loading';
import WizardCard from './components/WizardCard';
import { checkToken, setUserTypes } from './actions/UserActions';
import {
  setLanguage, setModal, setWindowDimensions, setScreenNotification,
} from './actions/CommonActions';
import { setActiveSingleProperty } from './actions/PropertyActions';

import BrixelModalAwards from './components/BrixelModalAwards';
import { getImageType } from './actions/UploadActions';
// import TeaserBanner from './components/TeaserBanner';
import SplashScreen from './components/SplashScreen';
import Support from './components/Support';

// SIGNUP
const Signup = lazy(() => import('./Pages/Signup/Signup'));
// GET STARTED ADD ADD PROPERTY
const GetStarted = lazy(() => import('./Pages/PackageFlow/GetStarted'));
const GetStartedSeller = lazy(() => import('./Pages/PackageFlow/GetStartedSeller'));
const GetStartedBuyer = lazy(() => import('./Pages/PackageFlow/GetStartedBuyer'));
const GetStartedEstimation = lazy(() => import('./Pages/PackageFlow/GetStartedEstimation'));
const ScanTrialFlow = lazy(() => import('./Pages/PackageFlow/ScanTrialFlow'));
const MakeOffer = lazy(() => import('./Pages/Offers/Flow/MakeOffer'));

// GENERAL COMPONENTS
const PageHeaderDashboard = lazy(() => import('./components/PageHeaderDashboard'));

const PageHeader = lazy(() => import('./components/PageHeader'));

const MenuSidebar = lazy(() => import('./components/MenuSidebar'));

// ADMIN ROUTES
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const InsertToken = lazy(() => import('./Pages/InsertToken'));

// HUB DASHBOARD - SELLER
const DashboardSeller = lazy(() => import('./Pages/Dashboard/Seller/Dashboard'));

// HUB DASHBOARD - BUYER
const DashboardBuyer = lazy(() => import('./Pages/Dashboard/Buyer/Dashboard'));

// FLOW SELLER
const MarketChecker = lazy(() => import('./Pages/GameHistory/MarketChecker'));

const Assessor = lazy(() => import('./Pages/GameHistory/Assessor'));

const Bestimate = lazy(() => import('./Pages/GameHistory/Bestimate'));

const ProEstimationFlow = lazy(() => import('./Pages/EditProperty/ProEstimationFlow'));

const Facts = lazy(() => import('./Pages/GameHistory/Facts'));

const MediaExplanation = lazy(() => import('./Pages/GameHistory/SecondLevel/MediaExplanation'));

const BrixelModalFullScreen = lazy(() => import('./components/BrixelModalFullScreen'));

const SingleDocument = lazy(() => import('./Pages/EditProperty/SingleDocument'));

const CreateDeal = lazy(() => import('./Pages/Deals/CreateDeal'));

const AddShowingsBuyer = lazy(() => import('./Pages/Dashboard/Buyer/AddShowingsBuyer'));

const AddContactBuyer = lazy(() => import('./Pages/Dashboard/Buyer/AddContactBuyer'));

const SingleDeal = lazy(() => import('./Pages/Deals/SingleDeal'));

const MarketSeller = lazy(() => import('./Pages/Market/MarketSeller'));

const MarketBuyer = lazy(() => import('./Pages/Market/MarketBuyer'));

const WarningScreen = lazy(() => import('./components/WarningScreen'));

const cookies = new Cookies();

const App = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    handleCheckToken,
    handleGetImageType,
    handleReset,
    handleSetActiveSingleProperty,
    handleSetLanguage,
    handleSetModal,
    handleSetNotification,
    handleSetUserTypes,
    handleSetWindowsDimension,
    history,
    isLoading,
    isSmallLoading,
    loggedInUser,
    modal,
    notification,
    redirectTo,
    splashScreenType,
    userTypes,
    teamAvatars,
    windowDimensions,
    wizard,
  } = props;
  // STATE
  // CONSTANT TO PREVENT TRANSIFEX ERROR
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  const [isLoaded, setIsLoaded] = useState(false);
  const [classMain, setClassMain] = useState('w-perc-100 pos-r hubContainer');

  const [isSecLevel, setIsSecLevel] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const [zIndex, setZIndex] = useState(1);
  const [isFlow, setIsFlow] = useState(false);
  // const [extraHeight, setExtraHeight] = useState(0);

  // USEREF TO MANAGE DOM ELEMENT
  const dashContentRef = useRef(null);
  const dashWrapperRef = useRef(null);
  const dashWrapperEl = dashWrapperRef.current;
  const el = document.getElementsByClassName('thirdLevel');

  useEffect(() => {
    smoothscrollPolyfill.polyfill();
  }, []);

  // FUCNTION TO INITIALIZE TRANSIFEX AND LOAD THE TRANSLATIONS
  useEffect(() => {
    if (loggedInUser.user && localTransifex) {
      const lang = loggedInUser.user.language === 'en_US' ? 'en' : loggedInUser.user.language;
      handleSetLanguage(lang);
      if (typeof Transifex !== 'undefined') Transifex.live.translateTo(lang);
    }
    if (typeof Transifex !== 'undefined') {
      Transifex.live.onReady(() => {
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true);
      const element = document.getElementsByTagName('BODY')[0];
      element.classList.remove('txlive');
    }
  }, [localTransifex, loggedInUser]);

  // FUNCTION TO LOAD THE USER TYPE BUYER OR SELLER
  useEffect(() => {
    if ((activeSingleProperty && activeSingleProperty.id && loggedInUser.user && (activeSingleProperty.owner === loggedInUser.user.id || get(activeSingleProperty, 'owner.id', '') === loggedInUser.user.id) && !get(history, 'location.pathname', '').includes('buyer')) || get(history, 'location.pathname', '').includes('seller')) {
      handleSetUserTypes('seller');
    } else {
      handleSetUserTypes('buyer');
    }
  }, [activeSingleProperty]);

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
    if (get(history, 'location', null) && typeof ga !== 'undefined') {
      ga('send', 'pageview', history.location.pathname);
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
      history.location.pathname.includes('onBoarding') ||
      history.location.pathname.includes('upgrade') ||
      history.location.pathname.includes('trialRequest') ||
      history.location.pathname.includes('upgrade') ||
      history.location.pathname.includes('signup')
    ) {
      if (history.location.pathname.includes('packageFlow') || history.location.pathname.includes('signup')) {
        setClassMain('flowContainer packageFlow w-perc-100');
      } else {
        setClassMain('flowContainer w-perc-100');
      }
      setIsFlow(true);
      setZIndex(6);
    } else {
      if (history.location.pathname.includes('home')) {
        setClassMain('w-perc-100 pos-r hubContainer rewardsTop withTopBar sellerHub');
      } else if (history.location.pathname.includes('property') || history.location.pathname.includes('closing') || history.location.pathname.includes('docubox') || history.location.pathname.includes('prospects') || history.location.pathname.includes('financing')) {
        if (history.location.pathname.includes('buyer')) {
          setClassMain('w-perc-100 pos-r hubContainer buyerHub propertyTop');
        } else {
          setClassMain('w-perc-100 pos-r hubContainer propertyTop withTopBar sellerHub');
        }
      } else if (history.location.pathname.includes('marketing')) {
        setClassMain('w-perc-100 pos-r hubContainer marketingTop withTopBar sellerHub');
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
  }, [history.location.pathname, dashWrapperEl, [...el].length]);

  const calcHeaderHeight = useCallback(() => {
    const head = document.getElementsByClassName('hubDasHeader');
    return head[0] ? head[0].offsetHeight : 0;
  }, []);

  const calcFlowHeaderHeight = useCallback(() => {
    const flowHead = document.getElementsByClassName('flowHeader');
    return flowHead[0] ? flowHead[0].offsetHeight : 0;
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
        contentHeight = '100vh';
      }
    } else {
      contentHeight = 'auto';
    }
    return contentHeight;
  }, [isFlow, calcHeaderHeight, calcFlowHeaderHeight, windowDimensions]);

  // DID MOUNT TO CHECK THE USER TOKEN AND INITIALIZE THE WINDOW SIZE LISTENER
  useEffect(() => {
    if (cookies && cookies.get('brixelToken')) {
      let data = {};
      if (!history.location.pathname.includes('packageFlow') && !history.location.pathname.includes('onBoarding') && !history.location.pathname.includes('signup')) data = { hideLoad: true };
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
      calcFlowHeaderHeight();
    });
  }, [window]);

  const overflowClass = useCallback(() => {
    if (history.location.pathname.includes('prospects') && !history.location.pathname.includes('offers')) {
      // if (windowDimensions.width <= 1024) return 'ov-y-a ov-x-h';
      return 'ov-y-h ov-x-h';
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
      <main
        className={`${!isFlow ? 'hubDashboard h-perc-100' : 'flowWrapper'} dis-fl-row jc-b ${history.location.pathname.includes('upgrade/packages') ? 'upgradePackages' : ''}`}
        ref={dashWrapperRef}
      >
        <Loading isLoading={isLoading} />
        <Suspense fallback={<Loading isLoading />}>
          <div className={`${classMain} ${history.location.pathname.includes('property/') || history.location.pathname.includes('deal') ? 'dealsPage' : ''} ${isSecLevel ? 'fixedLayout' : ''}`}>
            <div className="dis-f">
              <div
                className={`zIndex${zIndex} w-perc-100 dis-fl-col ${!isFlow ? 'hubTopWrapper' : 'flowScrollWrap'}`}
                style={contentLayout()}
              >
                {
                  (history.location.pathname.includes('packageFlow') || history.location.pathname.includes('onBoarding') || history.location.pathname.includes('trialRequest') || history.location.pathname.includes('upgrade') || history.location.pathname.includes('signup')) && (
                    <>
                      <PageHeader />
                    </>
                  )
                }

                <div
                  id="bodyScroll"
                  className={`content ${!isFlow ? `hubDasContent dis-fl-col ${overflowClass()}` : 'flowContent dis-f'} ${notification && notification.state ? 'saveActionOn pb-8' : ''}`}
                  style={isSecLevel ? { height: '100%' } : { height: headerCalc() }}
                  ref={dashContentRef}
                >
                  {
                    (
                      !history.location.pathname.includes('packageFlow') &&
                      !history.location.pathname.includes('onBoarding') &&
                      !history.location.pathname.includes('signup')
                    ) &&
                    !history.location.pathname.includes('upgrade') &&
                    !history.location.pathname.includes('trialRequest') &&
                    (
                      <>
                        <PageHeaderDashboard changeZIndex={(index) => { setZIndex(index); }} />
                      </>
                    )
                  }
                  {
                    !history.location.pathname.includes('packageFlow') &&
                    !history.location.pathname.includes('signup') &&
                    (!history.location.pathname.includes('sell') || history.location.pathname.includes('homebase')) &&
                    (!history.location.pathname.includes('buy') || history.location.pathname.includes('buyer')) &&
                    !history.location.pathname.includes('onBoarding') &&
                    !history.location.pathname.includes('upgrade') &&
                    !history.location.pathname.includes('trialRequest') &&
                    !history.location.pathname.includes('achievement') &&
                    !history.location.pathname.includes('propertyLists') &&
                    !history.location.pathname.includes('pageLists') &&
                    loggedInUser &&
                    windowDimensions.width > 1024 &&
                    (
                      <MenuSidebar />
                    )
                  }
                  <div className="w-perc-100 innerWrap">
                    {/*  {
                    !history.location.pathname.includes('packageFlow') &&
                  !history.location.pathname.includes('onBoarding') &&
                  !history.location.pathname.includes('buyer') &&
                    (
                      // <TeaserBanner />
                    )
                  } */}
                    <Switch>
                      { /* SECTION: ONBOARDING */ }
                      <Route exact path="/packageFlow/" component={GetStarted} />
                      <Route path="/packageFlow/getstarted/" component={GetStartedSeller} />
                      <Route path="/packageFlow/getstartedBuyer/" component={GetStartedBuyer} />
                      <Route path="/packageFlow/getstartedEstimation/" component={GetStartedEstimation} />
                      <Route path="/packageFlow/testDrive/" component={ScanTrialFlow} />
                      <ProtectedRoute path="/packageFlow/:id/makeOffer" component={MakeOffer} />

                      {/* SECTION: SIGNUP */}
                      <Route path="/signup" component={Signup} />

                      { /* SECTION: INSERT TOKEN */ }
                      <Route path="/tokeninput" component={InsertToken} />

                      { /* SECTION: HUB DASHBOARD */ }
                      {
                        !history.location.pathname.includes('packageFlow') &&
                        !history.location.pathname.includes('onBoarding') &&
                        !history.location.pathname.includes('buyer') &&
                        !history.location.pathname.includes('signup') &&
                        (
                          <>
                            <ProtectedRoute path="/sell" component={MarketSeller} />
                            <ProtectedRoute path="/buy/:cat?/:id?" component={MarketBuyer} />
                            <ProtectedRoute path="/seller/pageLists" component={DashboardSeller} />
                            <ProtectedRoute path="/" exact component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/home" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/singleFlow" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/docubox" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/closing" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/property" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/marketing" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/support" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/prospects" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/offers" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/deal" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/upgrade" component={DashboardSeller} />
                            <ProtectedRoute path="/:propId?/trialRequest" component={DashboardSeller} />
                          </>
                        )
                      }
                      {
                        !history.location.pathname.includes('packageFlow') &&
                        !history.location.pathname.includes('onBoarding') &&
                        !history.location.pathname.includes('signup') &&
                        (
                          <>
                            <ProtectedRoute path="/buyer" exact component={DashboardBuyer} />
                            <ProtectedRoute path="/buyer/propertyLists" exact component={DashboardBuyer} />
                            <ProtectedRoute path="/buyer/:propID/:act" component={DashboardBuyer} />
                          </>
                        )
                      }
                    </Switch>
                    <div
                      className="dis-fl-col a-b jc-fe supportBtn"
                      style={{

                      }}
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
                      <div
                        className={`dis-f jc-b a-c cur-poi bgWhite p-1 brdFullRadius zIndex1 pr-2 shadow-2dp ${windowDimensions.width > 1024 ? '' : ''}`}
                        onClick={() => setShowSupport(!showSupport)}
                      >
                        <div className="dis-f jc-b a-c">
                          {
                            teamAvatars.map((imgTeam, i) => (
                              <img
                                key={i.toString()}
                                src={`${baseByData.shortPath}${imgTeam.path}`}
                                alt="Support Team"
                                className="w-fix-32 mr-1-neg square brdLarge brdWhite brdCircle"
                              />
                            ))
                          }
                        </div>
                        <span className="ml-2 txtDark700 fweight-500">Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          { /* SECTION: ACHIVEMENT FLOW */ }
          {
            <Switch>
              <ProtectedRoute path="/:propId?/singleFlow/achievement/market-checker" component={MarketChecker} protect={userTypes ? userTypes !== 'seller' : false} />
              <ProtectedRoute path="/:propId?/singleFlow/achievement/assessor" component={Assessor} userTypes="seller" />
              <ProtectedRoute path="/:propId?/singleFlow/achievement/bestimate" component={Bestimate} userTypes="seller" />
              <ProtectedRoute path="/:propId?/singleFlow/achievement/media" component={MediaExplanation} userTypes="seller" />
              <ProtectedRoute path="/:propId?/singleFlow/achievement/facts" component={Facts} userTypes="seller" />
              <ProtectedRoute path="/buyer/:act/:propID/showings/add" component={AddShowingsBuyer} />
              <ProtectedRoute path="/buyer/:act/:propID/contact/add" component={AddContactBuyer} />
              <ProtectedRoute exact path="/:propID/prospects/:dealID/deal" component={SingleDeal} />
              <ProtectedRoute exact path="/:propID/prospects/newDeal" component={CreateDeal} />
              <ProtectedRoute path="/:propID/property/price/formFlow" component={ProEstimationFlow} />
            </Switch>
          }

          { /* SECTION: GENERAL MODAL - use redux modal to populate */ }
          {
            modal.showAwardsInfo && (
              <BrixelModalAwards />
            )
          }
          {
            modal.state && !modal.type && !modal.small && (
              <BrixelModalFullScreen
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
                classTitle={modal.classTitle}
                title={modal.title}
                onClose={() => {
                  handleSetModal({ state: false });
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: modal.body }} />
                {
                  modal.showSupport && (
                    <Support
                      expanded
                      isFixed={false}
                      hideClose
                      layout="onboarding"
                    />
                  )
                }
              </BrixelModal>
            )
          }

          {
            modal.state && modal.type === 'confirmExit' && (
              <WarningScreen
                saveFunc={() => modal.saveFunc()}
                title={modal.title}
                formName={modal.formName}
                onClose={() => modal.onClose()}
              />
            )
          }

          { /* SPLASH SCREEN */ }
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
              <WizardCard />
            )
          }

          { /* SECTION: GENERAL NOTIFICATION - use redux notification to populate */ }
          {
            notification && notification.length > 0 &&
            !history.location.pathname.includes('home') &&
            !history.location.pathname.includes('packageFlow') &&
            !history.location.pathname.includes('upgrade') &&
            !history.location.pathname.includes('trialRequest') &&
            !history.location.pathname.includes('upgrade') &&
            !history.location.pathname.includes('docubox') &&
            !history.location.pathname.includes('signup') &&
            (
              <div className="brixel-notifications">
                {
                  notification.map((not, i) => (
                    <Fragment key={i.toString()}>
                      <BrixelNotification
                        className={not.state ? 'fadeInLeft' : 'fadeOutLeft'}
                        handleSetNotification={(data) => handleSetNotification(data)}
                        isSmallLoading={isSmallLoading}
                        icon={not.icon}
                        label={not.label}
                        notification={not}
                        resetForm={(form, data) => handleReset(form, data)}
                        type={not.type}
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
          <Switch>
            <Route
              exact
              path="/:propID/docubox/:docID/editDocument"
              component={SingleDocument}
            />
            <Route exact path="/:propID/prospects/newDeal" component={CreateDeal} />
          </Switch>
        </Suspense>
      </main>
    </>
  );
};

App.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleSetNotification: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  handleSetWindowsDimension: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  notification: PropTypes.arrayOf(PropTypes.object).isRequired,
  redirectTo: PropTypes.object,
  splashScreenType: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  userTypes: PropTypes.string,
  teamAvatars: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
};

App.defaultProps = {
  isLoading: false,
  redirectTo: null,
  userTypes: null,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  config: get(state, 'common.config', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  loggedInUser: get(state, 'user.loggedInUser', null),
  modal: get(state, 'common.modal', {}),
  notification: get(state, 'common.notification', []),
  redirectTo: get(state, 'common.redirectTo', null),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userTypes: get(state, 'user.userTypes', null),
  teamAvatars: get(state, 'companies.activeSingleCompany.teamAvatars', get(state, 'user.loggedInUser.user.company.teamAvatars', [])),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  wizard: get(state, 'common.wizard', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleReset(form, value) {
    dispatch(reset(form, value));
  },
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
