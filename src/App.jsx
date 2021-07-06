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
  BrixelNotification,
  reset,
} from '@brixel/brixel-components';
import Loading from './components/Loading';
import { checkToken, setUserTypes } from './actions/UserActions';
import {
  setLanguage, setModal, setWindowDimensions, setScreenNotification,
} from './actions/CommonActions';

import BrixelModalAwards from './components/BrixelModalAwards';
import { getImageType } from './actions/UploadActions';
import TeaserBanner from './components/TeaserBanner';
import SplashScreen from './components/SplashScreen';

// GET STARTED ADD ADD PROPERTY
const GetStarted = lazy(() => import('./Pages/PackageFlow/GetStarted'));

const GetStartedSeller = lazy(() => import('./Pages/PackageFlow/GetStartedSeller'));

const GetStartedBuyer = lazy(() => import('./Pages/PackageFlow/GetStartedBuyer'));

const GetStartedEstimation = lazy(() => import('./Pages/PackageFlow/GetStartedEstimation'));

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

const cookies = new Cookies();

const App = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    handleCheckToken,
    handleGetImageType,
    handleReset,
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
    windowDimensions,
  } = props;
  // STATE
  // CONSTANT TO PREVENT TRANSIFEX ERROR
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  const [isLoaded, setIsLoaded] = useState(false);
  const [classMain, setClassMain] = useState('w-perc-100 pos-r hubContainer');

  const [isSecLevel, setIsSecLevel] = useState(false);

  const [zIndex, setZIndex] = useState(1);
  const [isFlow, setIsFlow] = useState(false);
  // const [extraHeight, setExtraHeight] = useState(0);

  // USEREF TO MANAGE DOM ELEMENT
  const dashContentRef = useRef(null);
  const dashWrapperRef = useRef(null);
  const dashWrapperEl = dashWrapperRef.current;

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
  }, [history.location]);

  // FUNCTION TO MANAGE THE REDIRECT FROM REDUX REDUCER
  useEffect(() => {
    if (get(redirectTo, 'history', null)) {
      if (get(redirectTo, 'history.pathname', null)) {
        history.push({
          pathname: get(redirectTo, 'history.pathname', ''),
          state: get(redirectTo, 'history.state', {}),
        });
      } else if (redirectTo.history.includes('rewards')) {
        window.location.href = redirectTo.history;
      } else {
        history.push(redirectTo.history);
      }
    }
    if (get(redirectTo, 'url', null)) {
      window.location.href = redirectTo.url;
    }
  }, [redirectTo]);

  // FUCNTION TO SEPARATE THE DESIGN IN BASE OF HISTORY LOCATION (packageFLow, onBoarding, upgrade)
  useEffect(() => {
    if (
      history.location.pathname.includes('packageFlow') ||
      history.location.pathname.includes('onBoarding') ||
      history.location.pathname.includes('upgrade') ||
      history.location.pathname.includes('trialRequest')
    ) {
      if (history.location.pathname.includes('packageFlow')) {
        setClassMain('flowContainer packageFlow w-perc-100');
      } else {
        setClassMain('flowContainer w-perc-100');
      }
      setIsFlow(true);
      setZIndex(6);
    } else {
      if (history.location.pathname.includes('rewards')) {
        setClassMain('w-perc-100 pos-r hubContainer rewardsTop withTopBar sellerHub');
      } else if (history.location.pathname.includes('property') || history.location.pathname.includes('deal')) {
        if (history.location.pathname.includes('buyer')) {
          setClassMain('w-perc-100 pos-r hubContainer buyerHub propertyTop');
        } else {
          setClassMain('w-perc-100 pos-r hubContainer propertyTop withTopBar sellerHub');
        }
      } else if (history.location.pathname.includes('listings')) {
        setClassMain('w-perc-100 pos-r hubContainer listingsTop withTopBar sellerHub');
      } else if (history.location.pathname.includes('deals')) {
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
        history.location.pathname.includes('listings/') ||
        history.location.pathname.includes('deals/') ||
        history.location.pathname.includes('rewards/')
      ) &&
      windowDimensions.width <= 1024 &&
      !history.location.pathname.includes('buyer')
    ) {
      setIsSecLevel(true);
      if (dashWrapperEl) {
        dashWrapperEl.classList.add('secondLevelActive');
      }
    } else {
      setIsSecLevel(false);
      if (dashWrapperEl) {
        dashWrapperEl.classList.remove('secondLevelActive');
      }
    }
  }, [history.location.pathname, dashWrapperEl]);

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
        contentHeight = `calc(100vh - ${calcHeaderHeight()}px)`;
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
      if (!history.location.pathname.includes('packageFlow') && !history.location.pathname.includes('onBoarding')) data = { hideLoad: true };
      handleCheckToken(data);
    }
    /*  window.addEventListener('resize', () => {
      handleSetWindowsDimension({
        height: window.innerHeight,
        width: window.innerWidth,
      });
      headerCalc();
      calcHeaderHeight();
      calcFlowHeaderHeight();
    }); */
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
    if (history.location.pathname.includes('deals') && !history.location.pathname.includes('offers')) return 'ov-y-h ov-x-h';
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
    <main
      className={`${!isFlow ? 'hubDashboard h-perc-100' : 'flowWrapper'} dis-fl-row jc-b`}
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
                (history.location.pathname.includes('packageFlow') || history.location.pathname.includes('onBoarding') || history.location.pathname.includes('trialRequest')) && (
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
                  !history.location.pathname.includes('onBoarding')) &&
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
                (!history.location.pathname.includes('sell') || history.location.pathname.includes('homebase')) &&
                (!history.location.pathname.includes('buy') || history.location.pathname.includes('buyer')) &&
                !history.location.pathname.includes('onBoarding') &&
                !history.location.pathname.includes('upgrade') &&
                !history.location.pathname.includes('trialRequest') &&
                !history.location.pathname.includes('achievement') &&
                !history.location.pathname.includes('propertyLists') &&
                !history.location.pathname.includes('pageLists') &&
                loggedInUser &&
                (
                  <MenuSidebar />
                )
                }
                <div className="w-perc-100 innerWrap">
                  {
                    !history.location.pathname.includes('packageFlow') &&
                  !history.location.pathname.includes('onBoarding') &&
                  !history.location.pathname.includes('buyer') &&
                    (
                      <TeaserBanner />
                    )
                  }
                  <Switch>
                    { /* SECTION: ONBOARDING */ }
                    <Route exact path="/packageFlow/" component={GetStarted} />
                    <Route path="/packageFlow/getstarted/" component={GetStartedSeller} />
                    <Route path="/packageFlow/getstartedBuyer/" component={GetStartedBuyer} />
                    <Route path="/packageFlow/getstartedEstimation/" component={GetStartedEstimation} />

                    { /* SECTION: INSERT TOKEN */ }
                    <Route path="/tokeninput" component={InsertToken} />

                    { /* SECTION: HUB DASHBOARD */ }
                    {
                      !history.location.pathname.includes('packageFlow') &&
                    !history.location.pathname.includes('onBoarding') &&
                    !history.location.pathname.includes('buyer') &&
                      (
                        <>
                          <ProtectedRoute path="/sell" component={MarketSeller} />
                          <ProtectedRoute path="/buy/:cat?/:id?" component={MarketBuyer} />
                          <ProtectedRoute path="/seller/pageLists" component={DashboardSeller} />
                          <ProtectedRoute path="/" exact component={DashboardSeller} />
                          <ProtectedRoute path="/:propId?/rewards" component={DashboardSeller} />
                          <ProtectedRoute path="/:propId?/property" component={DashboardSeller} />
                          <ProtectedRoute path="/:propId?/listings" component={DashboardSeller} />
                          <ProtectedRoute path="/:propId?/support" component={DashboardSeller} />
                          <ProtectedRoute path="/:propId?/deals" component={DashboardSeller} />
                          <ProtectedRoute path="/:propId?/upgrade" component={DashboardSeller} />
                          <ProtectedRoute path="/:propId?/trialRequest" component={DashboardSeller} />
                        </>
                      )
                    }
                    {
                      !history.location.pathname.includes('packageFlow') &&
                    !history.location.pathname.includes('onBoarding') &&
                      (
                        <>
                          <ProtectedRoute path="/buyer" exact component={DashboardBuyer} />
                          <ProtectedRoute path="/buyer/propertyLists" exact component={DashboardBuyer} />
                          <ProtectedRoute path="/buyer/:propID/:act" component={DashboardBuyer} />
                        </>
                      )
                    }
                  </Switch>
                </div>
              </div>
            </div>

          </div>
        </div>

        { /* SECTION: ACHIVEMENT FLOW */ }
        {
          <Switch>
            <ProtectedRoute path="/:propId?/rewards/achievement/market-checker" component={MarketChecker} protect={userTypes ? userTypes !== 'seller' : false} />
            <ProtectedRoute path="/:propId?/rewards/achievement/assessor" component={Assessor} allowAccess="seller" />
            <ProtectedRoute path="/:propId?/rewards/achievement/bestimate" component={Bestimate} allowAccess="seller" />
            <ProtectedRoute path="/:propId?/rewards/achievement/media" component={MediaExplanation} allowAccess="seller" />
            <ProtectedRoute path="/:propId?/rewards/achievement/facts" component={Facts} allowAccess="seller" />
            <ProtectedRoute path="/buyer/:act/:propID/showings/add" component={AddShowingsBuyer} />
            <ProtectedRoute path="/buyer/:act/:propID/contact/add" component={AddContactBuyer} />
            <ProtectedRoute exact path="/:propID/deals/lists/:dealID/deal" component={SingleDeal} />
            <ProtectedRoute exact path="/:propID/deals/lists/newDeal" component={CreateDeal} />
          </Switch>
        }

        { /* SECTION: GENERAL MODAL - use redux modal to populate */ }
        {
          modal.showAwardsInfo && (
            <BrixelModalAwards />
          )
        }
        {
          modal.state && (
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

        { /* SPLASH SCREEN */ }
        {
          splashScreenType === 'marketOverlay' && (
            <SplashScreen
              className="result-market-overlay"
              closeOutside={false}
              type="marketOverlay"
            />
          )
        }

        {
          has(splashScreenType, 'component') && (
            React.createElement(splashScreenType.component)
          )
        }

        { /* SECTION: GENERAL NOTIFICATION - use redux notification to populate */ }
        {
          notification && notification.length > 0 &&
        !history.location.pathname.includes('rewards') &&
        !history.location.pathname.includes('packageFlow') &&
        !history.location.pathname.includes('upgrade') &&
        !history.location.pathname.includes('trialRequest') &&
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
            path="/:propID/property/documents/:docID/editDocument"
            component={SingleDocument}
          />
          <Route exact path="/:propID/deals/newDeal" component={CreateDeal} />
        </Switch>
      </Suspense>
    </main>
  );
};

App.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
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
  windowDimensions: PropTypes.object.isRequired,
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
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleReset(form, value) {
    dispatch(reset(form, value));
  },
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
