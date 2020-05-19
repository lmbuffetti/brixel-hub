/* global ga, Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef} from 'react';
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
import 'moment/locale/de-at';
import 'moment/locale/en-gb';
// COMPONENTS
import Loading from './components/Loading';
import { checkToken } from './actions/UserActions';
import { setLanguages } from './actions/CommonActions';
import { BrixelIcon, BrixelNotification } from '@brixel/brixel-components';
import { setModal, setWindowDimensions } from './actions/CommonActions';
import { setUserTypes } from './actions/UserActions';
import BrixelModalAwards from './components/BrixelModalAwards';

// GET STARTED ADD ADD PROPERTY
const GetStarted = Loadable({
  loader: () => import('./Pages/PackageFlow/GetStarted' /* webpackChunkName: "GetStarted" */),
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

// ONBOARDING FLOW
const OnBoarding = Loadable({
  loader: () => import('./Pages/BrixelComingTown/OnBoarding' /* webpackChunkName: "OnBoarding" */),
  loading: Loading,
});

const UserFlow = Loadable({
  loader: () => import('./Pages/BrixelComingTown/UserFlow' /* webpackChunkName: "UserFlow" */),
  loading: Loading,
});

// HUB DASHBOARD
const Dashboard = Loadable({
  loader: () => import('./Pages/Dashboard/Dashboard' /* webpackChunkName: "Dashboard" */),
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

const MediaExplanation = Loadable({
  loader: () => import('./Pages/GameHistory/SecondLevel/MediaExplanation' /* webpackChunkName: "MediaFlow" */),
  loading: Loading,
});

const BrixelModalFullScreen = Loadable({
  loader: () => import('./components/BrixelModalFullScreen' /* webpackChunkName: "BrixelModalFullScreen" */),
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
    handleSetModal,
    handleSetWindowsDimension,
    isLoading,
    loggedInUser,
    modal,
    notification,
    property,
    redirectTo,
    windowDimensions,
  } = props;
  // STATE
  const [isLoaded, setIsLoaded] = useState(false);
  const [classMain, setClassMain] = useState('w-perc-100 pos-r hubContainer');

  const [isSecLevel, setIsSecLevel] = useState(false);

  const [zIndex, setZIndex] = useState(1);
  const [isFlow, setIsFlow] = useState(false);
  const [extraHeight, setExtraHeight] = useState(0);

  const dashContentRef = useRef(null);
  const dashWrapperRef = useRef(null);
  const dashWrapperEl = dashWrapperRef.current;
  const dashContentEl = dashContentRef.current;


  useEffect(() => {
    if (cookies && cookies.get('brixelToken')) {
      let data = {};
      if (!history.location.pathname.includes('packageFlow') && !history.location.pathname.includes('onBoarding')) data = {hideLoad: true};
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
    })
  }, []);

  useEffect(() => {
    if (loggedInUser.user) {
      const lang = loggedInUser.user.language === 'en_US' ? 'en' : loggedInUser.user.language;
      Transifex.live.translateTo(lang);
      if (lang === 'ch' || lang === 'de') {
        moment.locale('de-ch');
      } else if (lang === 'en' || lang === 'en_US') {
        moment.locale('en-gb');
      } else {
        moment.locale(lang);
      }
    }
    Transifex.live.onReady(() => {
      setIsLoaded(true);
    });
  }, [Transifex, loggedInUser]);

  useEffect(() => {
    if (property && property.id && loggedInUser.user && (property.owner === loggedInUser.user.id || property.owner.id === loggedInUser.user.id)) {
      handleSetUserTypes('seller');
    } else if (property && property.id) {
      handleSetUserTypes('seller');
    }
  }, [property]);

  useEffect(() => {
    if (history && history.location) {
      ga('send', 'pageview', history.location.pathname);
    }
  }, [history.location]);

  useEffect(() => {
    if (redirectTo && redirectTo.history) {
      history.push(redirectTo.history);
    }
    if (redirectTo && redirectTo.url) {
      window.location.href = redirectTo.url;
    }
  }, [redirectTo]);

  useEffect(() => {
    if (dashContentEl) {
      dashContentEl.addEventListener('scroll', () => {
        if (dashContentEl.scrollTop > 0) {
          setExtraHeight(74)
        } else {
          setExtraHeight(0)
        }
      })
    }
  });

  useEffect(() => {
    if (
      history.location.pathname.includes('packageFlow') ||
      history.location.pathname.includes('onBoarding') ||
      history.location.pathname.includes('upgrade')
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
        setClassMain('w-perc-100 pos-r hubContainer rewardsTop');
      } else if (history.location.pathname.includes('property')) {
        setClassMain('w-perc-100 pos-r hubContainer propertyTop');
      } else if (history.location.pathname.includes('listings')) {
        setClassMain('w-perc-100 pos-r hubContainer listingsTop');
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
      windowDimensions.width <= 1024
    ) {
      setIsSecLevel(true);
      if (dashWrapperEl) {
        dashWrapperEl.classList.add('secondLevelActive');
      }
    } else {
      setIsSecLevel(false);
      if (dashWrapperEl) {
        dashWrapperEl.classList.remove('secondLevelActive')
      }
    }

  }, [history.location.pathname, setExtraHeight, setIsSecLevel]);

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('hubDasHeader');
    return head[0] ? head[0].offsetHeight : 0;
  };

  const calcFlowHeaderHeight = () => {
    const flowHead = document.getElementsByClassName('flowHeader');
    return flowHead[0] ? flowHead[0].offsetHeight : 0;
  };

  const headerCalc = () => {
    return (
      !isFlow ?
        windowDimensions.width <= 1024 ? {height: (windowDimensions.height + extraHeight) - 174} : {height: 'calc(100vh - ' + calcHeaderHeight() +'px)'} :
        {height: windowDimensions.height - calcFlowHeaderHeight()}
    )
  }

  if (!loggedInUser || (!userTypes && property.id) || !isLoaded) {
    return (
      <Loading isLoading={isLoading} />
    )
  }

  return (
    <main
      className={`${!isFlow ? 'hubDashboard h-perc-100' : 'flowWrapper'} dis-fl-row jc-b`}
      ref={dashWrapperRef}
    >

      <Loading isLoading={isLoading} />

      <div className={`${classMain} ${isSecLevel ? 'fixedLayout' : ''}`}>
        <div className="dis-f">
          {
            !history.location.pathname.includes('packageFlow') &&
            !history.location.pathname.includes('onBoarding') &&
            !history.location.pathname.includes('upgrade') &&
            loggedInUser &&
             (
               <MenuSidebar />
             )
          }
          <div
            className={`zIndex${zIndex} w-perc-100 dis-fl-col`}
            style={!isFlow ? isSecLevel ? {height: '100%'} : windowDimensions.width <= 1024 ? { height: windowDimensions.height } : null : null}
          >
            {
              (history.location.pathname.includes('packageFlow') || history.location.pathname.includes('onBoarding')) && (
                <PageHeader />
              )
            }
            {
              (
                !history.location.pathname.includes('packageFlow') &&
                !history.location.pathname.includes('onBoarding')) &&
                !history.location.pathname.includes('upgrade') &&
              (
                <PageHeaderDashboard changeZIndex={(index) => {setZIndex(index)}} />
              )
            }
            <div
              id="bodyScroll"
              className={`${!isFlow ? 'hubDasContent bgLight100 ov-y-a ov-x-h' : 'flowContent'} ${notification && notification.state ? 'saveActionOn pb-8' : ''}`}
              style={ isSecLevel ? {height: '100%'} : headerCalc()}
              ref={dashContentRef}
            >
              <Switch>
                { /* SECTION: ONBOARDING */ }
                <Route path="/onBoarding/brixelComingInTown" component={UserFlow} />
                <Route path="/onBoarding/" component={OnBoarding} />

                { /* SECTION: INSERT TOKEN */ }
                <Route path="/tokeninput" component={InsertToken} />

                { /* SECTION: GET STARTED*/ }
                <Route path="/packageFlow/getstarted/" component={GetStarted} />

                { /* SECTION: HUB DASHBOARD */ }
                {
                  !history.location.pathname.includes('packageFlow') &&
                  !history.location.pathname.includes('onBoarding') && (
                    <>
                      <ProtectedRoute path="/" exact component={Dashboard}/>
                      <ProtectedRoute path="/:propId?" exact component={Dashboard}/>
                      <ProtectedRoute path="/:propId?/rewards" component={Dashboard} />
                      <ProtectedRoute path="/:propId?/property" component={Dashboard} />
                      <ProtectedRoute path="/:propId?/listings" component={Dashboard} />
                      <ProtectedRoute path="/:propId?/support" component={Dashboard} />
                      <ProtectedRoute path="/:propId?/upgrade" component={Dashboard} />
                    </>
                  )
                }
              </Switch>
            </div>
          </div>

        </div>
      </div>

      { /* SECTION: ACHIVEMENT FLOW */ }
      {
        <Switch>
          <ProtectedRoute path="/:propId?/rewards/achievement/market-checker" component={MarketChecker} protect={userTypes ? userTypes !== 'seller' : false} />
          <ProtectedRoute path="/:propId?/rewards/achievement/assessor" component={Assessor} allowAccess={'seller'} />
          <ProtectedRoute path="/:propId?/rewards/achievement/bestimate" component={Bestimate} allowAccess={'seller'} />
          <ProtectedRoute path="/:propId?/rewards/achievement/bestimate" component={Bestimate} allowAccess={'seller'} />
          <ProtectedRoute path="/:propId?/rewards/achievement/media" component={MediaExplanation} allowAccess={'seller'} />
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
        notification && ( (!history.location.pathname.includes('rewards') && !history.location.pathname.includes('packageFlow')) || notification.type === 'alert') && (
          <BrixelNotification
            saveBar
            label={notification.label}
            type={notification.type}
            icon={notification.icon}
            actions={notification.actions}
            className={`zIndex5 jc-fe pr-2 pr-md-4 ${notification.className} ${notification.state ? 'open' : 'close'}`}
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
    </main>
  );
};

App.propTypes = {
  handleSetUserTypes: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleSetWindowsDimension: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  loggedInUser: PropTypes.object.isRequired,
  notification: PropTypes.object,
  match: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  redirectTo: PropTypes.object,
  windowDimensions: PropTypes.object.isRequired,
};

App.defaultProps = {
  isLoading: false,
  notification: null,
  redirectTo: null,
};

const mapStateToProps = (state) => ({
  config: get(state, 'common.config', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser', null),
  modal: get(state, 'common.modal', {}),
  notification: get(state, 'common.notification', null),
  property: get(state, 'property.activeSingleProperty', {}),
  redirectTo: get(state, 'common.redirectTo', null),
  userTypes: get(state, 'user.userTypes', null),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetLanguages: bindActionCreators(setLanguages, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
