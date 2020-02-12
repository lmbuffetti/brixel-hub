/* global ga */
import React, { useEffect } from 'react';
import {
  Redirect, Switch, Route, withRouter,
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
import queryString from 'query-string';
import { BrixelIcon, BrixelNotification } from '@brixel/brixel-components';
import PageHeader from './components/PageHeader';
import ReactGA from 'react-ga';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

ReactGA.initialize(baseByData.googleAnalyticsIdHub);

const Dashboard = Loadable({
  loader: () => import('./Pages/Dashboard' /* webpackChunkName: "Dashboard" */),
  loading: Loading,
});

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

const GoToPro = Loadable({
  loader: () => import('./Pages/Estimations/GoToPro' /* webpackChunkName: "Estimation-GoToPro" */),
  loading: Loading,
});

const ProtectedRoute = Loadable({
  loader: () => import('./components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: Loading,
});

const InsertToken = Loadable({
  loader: () => import('./Pages/InsertToken' /* webpackChunkName: "InsertToken" */),
  loading: Loading,
});

const OnBoarding = Loadable({
  loader: () => import('./Pages/BrixelComingTown/OnBoarding' /* webpackChunkName: "OnBoarding" */),
  loading: Loading,
});

const UserFlow = Loadable({
  loader: () => import('./Pages/BrixelComingTown/UserFlow' /* webpackChunkName: "UserFlow" */),
  loading: Loading,
});

const cookies = new Cookies();

const App = (props) => {
  const {
    history,
    handleCheckToken,
    handleSetLanguages,
    isLoading,
    loggedUser,
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

  const fireTracking = () => {
    ReactGA.pageview(window.location.hash);
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <PageHeader />
      <Switch>
        { /* SECTION: FREE ROOUTE */ }
        <Route path="/onBoarding/brixelComingInTown" component={UserFlow} />
        <Route path="/onBoarding/" component={OnBoarding} />
        <Route path="/tokeninput" component={InsertToken} />
        <Route path="/packageFlow/getstarted/" component={GetStarted} />
        <ProtectedRoute path="/packageFlow/:propId/rewards" component={Rewards} />
        <ProtectedRoute path="/packageFlow/:propId/advisory" component={Advisory} />
        <ProtectedRoute path="/packageFlow/:propId/thankyou" component={ThankYou} />
        <ProtectedRoute path="/estimation/:propId/questions/" component={GoToPro} />
        { /* SECTION: PROTECED ROUTE WITH REDIRECT TO LOGIN */ }
        {/*<ProtectedRoute path="/" exact component={Dashboard} />*/}
        { /* SECTION: REDIRECT */ }
        <Redirect from="/packageFlow/:propId/goToPro" to="/estimation/:propId/questions/" />
        <Redirect from="*" to="/onBoarding" />
      </Switch>
      {
        notification && (
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
    </>
  );
};

App.propTypes = {
  history: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
  notification: PropTypes.object,
  isLoading: PropTypes.bool,
  match: PropTypes.object.isRequired,
  redirectTo: PropTypes.object,
};

App.defaultProps = {
  isLoading: false,
  notification: null,
  redirectTo: null,
};

const mapStateToProps = (state) => ({
  notification: get(state, 'common.notification', null),
  redirectTo: get(state, 'common.redirectTo', null),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  loggedUser: get(state, 'user.loggedUser', null),
  config: get(state, 'common.config', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleSetLanguages: bindActionCreators(setLanguages, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
