/* global ga, Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import {
  Switch, Route, withRouter,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import moment from 'moment';
import 'moment/locale/de-ch';
import 'moment/locale/pt';
import 'moment/locale/nl';
import 'moment/locale/se';
import 'moment/locale/da';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/fr';
import 'moment/locale/de-at';
import 'moment/locale/en-gb';
// COMPONENTS
import { BrixelIcon, BrixelNotification } from '@brixel/brixel-components';
import Loading from './components/Loading';
import { checkToken, setUserTypes } from './actions/UserActions';
import { setLanguage, setModal, setWindowDimensions } from './actions/CommonActions';

import BrixelModalAwards from './components/BrixelModalAwards';
import { getImageType } from './actions/UploadActions';
import TeaserBanner from './components/TeaserBanner';

// GET STARTED ADD ADD PROPERTY
const GetStarted = Loadable({
  loader: () => import('./Pages/PackageFlow/GetStarted' /* webpackChunkName: "GetStarted" */),
  loading: Loading,
});

const GetStartedBuyer = Loadable({
  loader: () => import('./Pages/PackageFlow/GetStartedBuyer' /* webpackChunkName: "GetStartedBuyer" */),
  loading: Loading,
});

// GENERAL COMPONENTS
const PageHeaderDashboard = Loadable({
  loader: () => import('./components/PageHeaderDashboard' /* webpackChunkName: "PageHeaderDashboard" */),
  loading: Loading,
});

const PageHeader = Loadable({
  loader: () => import('./components/PageHeader' /* webpackChunkName: "PageHeader" */),
  loading: Loading,
});

const MenuSidebar = Loadable({
  loader: () => import('./components/MenuSidebar' /* webpackChunkName: "MenuSidebar" */),
  loading: Loading,
});

// ADMIN ROUTES
const ProtectedRoute = Loadable({
  loader: () => import('./components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: () => null,
});

const InsertToken = Loadable({
  loader: () => import('./Pages/InsertToken' /* webpackChunkName: "InsertToken" */),
  loading: Loading,
});

// HUB DASHBOARD - SELLER
const DashboardSeller = Loadable({
  loader: () => import('./Pages/Dashboard/Seller/Dashboard' /* webpackChunkName: "DashboardSeller" */),
  loading: Loading,
});

// HUB DASHBOARD - BUYER
const DashboardBuyer = Loadable({
  loader: () => import('./Pages/Dashboard/Buyer/Dashboard' /* webpackChunkName: "DashboardBuyer" */),
  loading: Loading,
});

// FLOW SELLER
const MarketChecker = Loadable({
  loader: () => import('./Pages/GameHistory/MarketChecker' /* webpackChunkName: "MarketCheckFlow" */),
  loading: Loading,
});

const Assessor = Loadable({
  loader: () => import('./Pages/GameHistory/Assessor' /* webpackChunkName: "AssessorFlow" */),
  loading: Loading,
});

const Bestimate = Loadable({
  loader: () => import('./Pages/GameHistory/Bestimate' /* webpackChunkName: "BestimateFlow" */),
  loading: Loading,
});

const Facts = Loadable({
  loader: () => import('./Pages/GameHistory/Facts' /* webpackChunkName: "FactsFlow" */),
  loading: Loading,
});

const MediaExplanation = Loadable({
  loader: () => import('./Pages/GameHistory/SecondLevel/MediaExplanation' /* webpackChunkName: "MediaFlow" */),
  loading: Loading,
});

const BrixelModalFullScreen = Loadable({
  loader: () => import('./components/BrixelModalFullScreen' /* webpackChunkName: "BrixelModalFullScreen" */),
  loading: Loading,
});

const SingleDocument = Loadable({
  loader: () => import('./Pages/EditProperty/SingleDocument' /* webpackChunkName: "SingleDocument" */),
  loading: Loading,
});

const CreateDeal = Loadable({
  loader: () => import('./Pages/Deals/CreateDeal' /* webpackChunkName: "CreateDeal" */),
  loading: Loading,
});

const AddShowingsBuyer = Loadable({
  loader: () => import('./Pages/Dashboard/Buyer/AddShowingsBuyer' /* webpackChunkName: "AddShowingsBuyer" */),
  loading: Loading,
});

const SingleDeal = Loadable({
  loader: () => import('./Pages/Deals/SingleDeal' /* webpackChunkName: "SingleDeal" */),
  loading: Loading,
});

const Market = Loadable({
  loader: () => import('./Pages/Market/Market' /* webpackChunkName: "Market" */),
  loading: Loading,
});

const cookies = new Cookies();

const App = (props) => {
  // PROPS
  const {
    userTypes,
    handleSetUserTypes,
    history,
    handleCheckToken,
    handleSetLanguage,
    handleSetModal,
    handleSetWindowsDimension,
    handleGetImageType,
    isLoading,
    loggedInUser,
    modal,
    notification,
    activeSingleProperty,
    redirectTo,
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
  const [extraHeight, setExtraHeight] = useState(0);

  // USEREF TO MANAGE DOM ELEMENT
  const dashContentRef = useRef(null);
  const dashWrapperRef = useRef(null);
  const dashWrapperEl = dashWrapperRef.current;
  const dashContentEl = dashContentRef.current;

  // FUCNTION TO INITIALIZE TRANSIFEX AND LOAD THE TRANSLATIONS
  useEffect(() => {
    if (loggedInUser.user && localTransifex) {
      const lang = loggedInUser.user.language === 'en_US' ? 'en' : loggedInUser.user.language;
      handleSetLanguage(lang);
      if (typeof Transifex !== 'undefined') Transifex.live.translateTo(lang);
      if (lang === 'ch' || lang === 'de') {
        moment.locale('de-ch');
      } else if (lang === 'en' || lang === 'en_US') {
        moment.locale('en-gb');
      } else {
        moment.locale(lang);
      }
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
    if ((activeSingleProperty && activeSingleProperty.id && loggedInUser.user && (activeSingleProperty.owner === loggedInUser.user.id || activeSingleProperty.owner.id === loggedInUser.user.id) && !get(history, 'location.pathname', '').includes('buyer')) || get(history, 'location.pathname', '').includes('seller')) {
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
    if (get(history, 'location', null)) {
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
      } else if (history.location.pathname.includes('property')) {
        if (history.location.pathname.includes('buyer')) {
          setClassMain('w-perc-100 pos-r hubContainer propertyTop');
        } else {
          setClassMain('w-perc-100 pos-r hubContainer propertyTop withTopBar sellerHub');
        }
      } else if (history.location.pathname.includes('listings')) {
        setClassMain('w-perc-100 pos-r hubContainer listingsTop withTopBar sellerHub');
      } else if (history.location.pathname.includes('deals')) {
        setClassMain('w-perc-100 pos-r hubContainer dealsTop withTopBar sellerHub');
      } else if (history.location.pathname.includes('/home')) {
        setClassMain('w-perc-100 pos-r ov-h marketHome');
      } else {
        setClassMain('w-perc-100 pos-r hubContainer ov-h');
      }
      setIsFlow(false);
      setZIndex(1);
    }

    // add class to container when secondlevel visible on mobile
    if (
      (history.location.pathname.includes('property/') ||
      history.location.pathname.includes('listings/')) &&
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
  }, [history.location.pathname]);

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('hubDasHeader');
    return head[0] ? head[0].offsetHeight : 0;
  };

  const calcFlowHeaderHeight = () => {
    const flowHead = document.getElementsByClassName('flowHeader');
    return flowHead[0] ? flowHead[0].offsetHeight : 0;
  };

  const headerHeight = document.getElementsByClassName('hubDasHeader')[0];

  useEffect(() => {
    if (dashContentEl && headerHeight) {
      if (history.location.pathname.includes('deals')) {
        setExtraHeight(124);
      } else if (history.location.pathname.includes('propertyLists') ||
      history.location.pathname.includes('pageList')) {
        setExtraHeight(100);
      }
    }
    // console.log(extraHeight);
  }, []);

  useEffect(() => {
    if (dashContentEl) {
      dashContentEl.addEventListener('scroll', () => {
        if (dashContentEl.scrollTop > 1) {
          if (history.location.pathname.includes('propertyLists') ||
          history.location.pathname.includes('pageList')) {
            setExtraHeight(40);
          } else if (history.location.pathname.includes('deals')) {
            setExtraHeight(100);
          } else {
            setExtraHeight(100);
          }
        } else if (history.location.pathname.includes('deals')) {
          setExtraHeight(124);
        } else if (history.location.pathname.includes('propertyLists') ||
        history.location.pathname.includes('pageList')) {
          setExtraHeight(100);
        } else if (history.location.pathname.includes('buyer')) {
          setExtraHeight(100);
        } else {
          setExtraHeight(164);
        }
      });
    }
  }, [dashContentEl]);

  const headerCalc = () => {
    let contentHeight;
    if (!isFlow) {
      if (windowDimensions.width <= 1024) {
        if (history.location.pathname.includes('home')) {
          contentHeight = '';
        } else {
          contentHeight = windowDimensions.height - extraHeight;
        }
      } else {
        contentHeight = `calc(100vh - ${calcHeaderHeight()}px)`;
      }
    } else {
      contentHeight = windowDimensions.height - calcFlowHeaderHeight();
    }
    return contentHeight;
  };

  // DID MOUNT TO CHECK THE USER TOKEN AND INITIALIZE THE WINDOW SIZE LISTENER
  useEffect(() => {
    if (cookies && cookies.get('brixelToken')) {
      let data = {};
      if (!history.location.pathname.includes('packageFlow') && !history.location.pathname.includes('onBoarding')) data = { hideLoad: true };
      handleCheckToken(data);
    }
    window.addEventListener('resize', () => {
      handleSetWindowsDimension({
        height: window.innerHeight,
        width: window.innerWidth,
      });
      headerCalc();
      calcHeaderHeight();
      calcFlowHeaderHeight();
    });
    handleGetImageType();
  }, []);

  const contentLayout = () => {
    if (!isFlow) {
      if (isSecLevel) {
        return { height: '100%' };
      }
      if (windowDimensions.width <= 1024) {
        return { height: windowDimensions.height };
      }
    }
    return null;
  };

  const overflowClass = () => {
    if (history.location.pathname.includes('deals')) return 'ov-y-h ov-x-h';
    return 'ov-y-a ov-x-h';
  };

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

  const bodyPadding = () => {
    let classPadding = 'pt-3';
    if ((history.location.pathname.includes('home') && !history.location.pathname.includes('homebase')) || history.location.pathname.includes('packageFlow')) classPadding = '';
    return classPadding;
  };

  return (
    <main
      className={`${!isFlow ? 'hubDashboard h-perc-100' : 'flowWrapper'} dis-fl-row jc-b`}
      ref={dashWrapperRef}
    >

      <Loading isLoading={isLoading} />

      <div className={`${classMain} ${history.location.pathname.includes('buyer/property/') ? 'buyerHub' : ''} ${isSecLevel ? 'fixedLayout' : ''}`}>
        <div className="dis-f">
          <div
            className={`zIndex${zIndex} w-perc-100 dis-fl-col ${!isFlow ? 'hubTopWrapper' : ''}`}
            style={contentLayout()}
          >
            {
              (history.location.pathname.includes('packageFlow') || history.location.pathname.includes('onBoarding')) && (
                <>
                  <PageHeader />
                </>
              )
            }
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
            <div
              id="bodyScroll"
              className={`content ${!isFlow ? `hubDasContent ${overflowClass()} ${!history.location.pathname.includes('home') ? 'bgLight100' : 'bgWhite'}` : 'flowContent'} ${notification && notification.state ? 'saveActionOn pb-8' : ''} dis-f`}
              style={isSecLevel ? { height: '100%' } : { height: headerCalc() }}
              ref={dashContentRef}
            >
              {
                !history.location.pathname.includes('packageFlow') &&
                (!history.location.pathname.includes('home') || history.location.pathname.includes('homebase')) &&
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
              <div className="w-perc-100 hubInner">
                {
                  !history.location.pathname.includes('home') &&
                  !history.location.pathname.includes('packageFlow') &&
                  !history.location.pathname.includes('onBoarding') &&
                  !history.location.pathname.includes('buyer') && (
                    <TeaserBanner />
                  )
                }
                <Switch>
                  { /* SECTION: ONBOARDING */ }
                  <Route path="/packageFlow/getstarted/" component={GetStarted} />
                  <Route path="/packageFlow/getstartedBuyer/" component={GetStartedBuyer} />

                  { /* SECTION: INSERT TOKEN */ }
                  <Route path="/tokeninput" component={InsertToken} />

                  { /* SECTION: HUB DASHBOARD */ }
                  {
                    !history.location.pathname.includes('packageFlow') &&
                    !history.location.pathname.includes('onBoarding') &&
                    !history.location.pathname.includes('buyer') && (
                      <>
                        <ProtectedRoute path="/home" component={Market} />
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
                    !history.location.pathname.includes('onBoarding') && (
                      <>
                        <ProtectedRoute path="/buyer" exact component={DashboardBuyer} />
                        <ProtectedRoute path="/buyer/propertyLists" exact component={DashboardBuyer} />
                        <ProtectedRoute path="/buyer/:act/:propID" component={DashboardBuyer} />
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
          <ProtectedRoute exact path="/:propID/deals/:dealID/deal" component={SingleDeal} />
          <ProtectedRoute exact path="/:propID/deals/newDeal" component={CreateDeal} />
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

      { /* SECTION: GENERAL NOTIFICATION - use redux notification to populate */ }
      {
        notification &&
        !history.location.pathname.includes('rewards') &&
        !history.location.pathname.includes('packageFlow') &&
        !history.location.pathname.includes('upgrade') &&
        !history.location.pathname.includes('trialRequest') &&
        notification.type === ('infoHub') && (
          <BrixelNotification
            saveBar
            label={notification.label}
            type={notification.type}
            icon={notification.icon}
            actions={notification.actions}
            className={`zIndex6 jc-fe pr-2 pr-md-4 ${notification.className ? notification.className : ''} ${notification.state ? 'open' : 'close'}`}
          />
        )
      }
      {
        notification && history.location.pathname.includes('packageFlow') && notification.type === ('alert') && (
          <BrixelNotification
            label={notification.label}
            type={notification.type}
            icon={notification.icon}
            actions={notification.actions}
            className={`zIndex6 jc-fe pr-2 pr-md-4 ${notification.className ? notification.className : ''} ${notification.state ? 'open' : 'close'}`}
          />
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
    </main>
  );
};

App.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  handleSetWindowsDimension: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  loggedInUser: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  notification: PropTypes.object,
  redirectTo: PropTypes.object,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

App.defaultProps = {
  isLoading: false,
  notification: null,
  redirectTo: null,
  userTypes: null,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  config: get(state, 'common.config', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser', null),
  modal: get(state, 'common.modal', {}),
  notification: get(state, 'common.notification', null),
  redirectTo: get(state, 'common.redirectTo', null),
  userTypes: get(state, 'user.userTypes', null),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
