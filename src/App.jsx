/* global ga */
import React, { useEffect } from 'react';
import {
  Switch, Route, withRouter,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
// COMPONENTS
import Loading from './components/Loading';
import { checkToken } from './actions/UserActions';
import { setLanguages } from './actions/CommonActions';
import { BrixelIcon, BrixelNotification, BrixelModal } from '@brixel/brixel-components';
import PageHeader from './components/PageHeader';
import ReactGA from 'react-ga';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { setModal } from './actions/CommonActions';

ReactGA.initialize(baseByData.googleAnalyticsIdHub);

// GET STARTED ADD ADD PROPERTY
const GetStarted = Loadable({
  loader: () => import('./Pages/PackageFlow/GetStarted' /* webpackChunkName: "GetStarted" */),
  loading: Loading,
});

const Rewards = Loadable({
  loader: () => import('./Pages/PackageFlow/Rewards' /* webpackChunkName: "PackageFlow-Rewards" */),
  loading: Loading,
});

const Advisory = Loadable({
  loader: () => import('./Pages/PackageFlow/Advisory' /* webpackChunkName: "PackageFlow-Advisory" */),
  loading: Loading,
});

const ThankYou = Loadable({
  loader: () => import('./Pages/PackageFlow/ThankYou' /* webpackChunkName: "PackageFlow-ThankYou" */),
  loading: Loading,
});

// ADMIN ROUTES
const ProtectedRoute = Loadable({
  loader: () => import('./components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: Loading,
});

const ModalProtectedRoute = Loadable({
  loader: () => import('./components/ModalProtectedRoute' /* webpackChunkName: "InputSheet" */),
  loading: Loading,
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

const InputSheet = Loadable({
  loader: () => import('./Pages/InputSheet/Facts' /* webpackChunkName: "InputSheet" */),
  loading: Loading,
});

const Documents = Loadable({
  loader: () => import('./components/Documents' /* webpackChunkName: "InputSheet" */),
  loading: Loading,
});

const MarketChecker = Loadable({
  loader: () => import('./Pages/MarketChecker' /* webpackChunkName: "PackageFlow-Rewards" */),
  loading: Loading,
});

const cookies = new Cookies();

const App = (props) => {
  const {
    history,
    handleCheckToken,
    handleSetModal,
    isLoading,
    loggedUser,
    modal,
    notification,
    redirectTo,
  } = props;

  useEffect(() => {
    if (cookies && cookies.get('brixelToken')) handleCheckToken();
  }, []);

  useEffect(() => {
    if (history && history.location) {
      ReactGA.pageview(history.location.pathname);
      ga('send', 'pageview', history.location.pathname);
    }
  }, [history.location]);

  useEffect(() => {
    if (redirectTo && redirectTo.history) {
      history.push(redirectTo.history);
      ReactGA.pageview(redirectTo.history);
    }
  }, [redirectTo]);

  if (!loggedUser) {
    return (
      <Loading isLoading={isLoading} />
    )
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <PageHeader />
      <Switch>
        { /* INFO: <Route> for free access <ProtectedRoute> for restricted access */ }
        { /* SECTION: ONBOARDING */ }
        <Route path="/onBoarding/brixelComingInTown" component={UserFlow} />
        <Route path="/onBoarding/" component={OnBoarding} />

        { /* SECTION: INSERT TOKEN */ }
        <Route path="/tokeninput" component={InsertToken} />

        { /* SECTION: GET STARTED*/ }
        <Route path="/packageFlow/getstarted/" component={GetStarted} />
        <ProtectedRoute path="/packageFlow/:propId/rewards" component={Rewards} />
        <ProtectedRoute path="/packageFlow/:propId/advisory" component={Advisory} />
        <ProtectedRoute path="/packageFlow/:propId/thankyou" component={ThankYou} />

        { /* SECTION: HUB DASHBOARD */ }
        <ProtectedRoute path="/:propId/inputSheet" exact component={InputSheet} />
        <ProtectedRoute path="/" exact component={Dashboard} />
        <ProtectedRoute path="/:propId?/home" component={Dashboard} />
        <ProtectedRoute path="/:propId?/property" component={Dashboard} />
        <ProtectedRoute path="/:propId?/support" component={Dashboard} />
        { /* SECTION: REDIRECT */ }

      </Switch>

      { /* SECTION: GENERAL MODAL - use redux modal to populate */ }
      {
        modal.state && (
          <BrixelModal
            classHeight={modal.height}
            title={modal.title}
            titleIcon={modal.titleIcon}
            color={modal.color}
            saturationTxt={modal.saturationTxt}
            layout={modal.layout}
            onClose={() => {
              handleSetModal({ state: false });
            }}
            actions={modal.action}
            multiActions={modal.multiActions}
            clickOutsideToClose={modal.clickOutsideToClose}
          >
            <div>{modal.body}</div>
          </BrixelModal>
        )
      }

      { /* SECTION: GENERAL NOTIFICATION - use redux notification to populate */ }
      {
        (notification.small || notification.label) && (
          <>
            {
              notification.small ? (
                <div className="brxNotification">
                  <BrixelIcon icon={notification.icon} />
                  <span>{notification.text}</span>
                </div>
              ) : (
                <BrixelNotification
                  label={notification.label}
                  type={notification.type}
                  icon={notification.icon}
                  actions={notification.actions}
                />
              )
            }
          </>
        )
      }

      { /* SECTION: SIDEBAR */ }
      <div className="zIndex3">
        <Switch>
          {/* SECTION: DOCUMENTS */}
          <Route path="/:propId?/:act/documents" component={Documents} />
        </Switch>
      </div>

      { /* SECTION: MODAL */ }
      <div className="zIndex3">
        <Switch>
          {/* SECTION: DOCUMENTS */}
          <ModalProtectedRoute
            path="/:propId?/:act/achievement/market-checker"
            closePath="../"
            component={MarketChecker}
            title=""
          />
        </Switch>
      </div>
    </>
  );
};

App.propTypes = {
  history: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  loggedUser: PropTypes.object.isRequired,
  notification: PropTypes.object,
  match: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  redirectTo: PropTypes.object,
};

App.defaultProps = {
  isLoading: false,
  notification: null,
  redirectTo: null,
};

const mapStateToProps = (state) => ({
  config: get(state, 'common.config', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  loggedUser: get(state, 'user.loggedUser', null),
  modal: get(state, 'common.modal', {}),
  notification: get(state, 'common.notification', null),
  redirectTo: get(state, 'common.redirectTo', null),
});

const mapDispatchToProps = (dispatch) => ({
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetLanguages: bindActionCreators(setLanguages, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
