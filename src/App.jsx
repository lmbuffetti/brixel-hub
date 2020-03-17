/* global ga */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Switch, Route, withRouter, Redirect,
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
import { setModal, setWindowDimensions } from './actions/CommonActions';
import { setUserTypes } from './actions/UserActions';

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

const DetailMedia = Loadable({
  loader: () => import('./Pages/EditProperty/Media/DetailMedia' /* webpackChunkName: "DetailMedia" */),
  loading: Loading,
});

// FLOW SELLER
const MarketChecker = Loadable({
  loader: () => import('./Pages/MarketChecker' /* webpackChunkName: "MarketCheckFlow" */),
  loading: Loading,
});

const Assessor = Loadable({
  loader: () => import('./Pages/Assessor' /* webpackChunkName: "AssessorFlow" */),
  loading: Loading,
});

const Bestimate = Loadable({
  loader: () => import('./Pages/Bestimate' /* webpackChunkName: "BestimateFlow" */),
  loading: Loading,
});

const cookies = new Cookies();

const App = (props) => {
  // PROPS
  const {
    userTypes,
    handleSetActiveUsertype,
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

  useEffect(() => {
    if (cookies && cookies.get('brixelToken')) handleCheckToken();
    window.addEventListener('resize', () => {
      handleSetWindowsDimension({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    })
  }, []);

  useEffect(() => {
    if (property && property.id && loggedInUser.user && (property.owner === loggedInUser.user.id || property.owner.id === loggedInUser.user.id)) {
      handleSetActiveUsertype('seller');
    } else if (property && property.id) {
      handleSetActiveUsertype('buyer');
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

  if (!loggedInUser || (!userTypes && property.id)) {
    return (
      <Loading isLoading={isLoading} />
    )
  }

  let classMain = 'container pos-r ov-h';
  if (history.location.pathname.includes('packageFlow') || history.location.pathname.includes('onBoarding')) classMain = '';

  return (
    <main className={`dis-fl-row jc-b`}>

      <Loading isLoading={isLoading} />

      <div className={classMain}>
        <div className="dis-f">
          {
            !history.location.pathname.includes('packageFlow') && !history.location.pathname.includes('onBoarding') && loggedInUser && (
              <div className="sidebar zIndex2 hide dis-md" id="menu-sidebar">
                <MenuSidebar />
              </div>
            )
          }
          <div className="zIndex1 w-perc-100 dis-fl-col" style={{ height: windowDimensions.height }}>
            {
              (history.location.pathname.includes('packageFlow') || history.location.pathname.includes('onBoarding')) && (
                <PageHeader />
              )
            }
            {
              (!history.location.pathname.includes('packageFlow') && !history.location.pathname.includes('onBoarding')) && (
                <PageHeaderDashboard />
              )
            }
            <Switch>
              { /* SECTION: ONBOARDING */ }
              <Route path="/onBoarding/brixelComingInTown" component={UserFlow} />
              <Route path="/onBoarding/" component={OnBoarding} />

              { /* SECTION: INSERT TOKEN */ }
              <Route path="/tokeninput" component={InsertToken} />

              { /* SECTION: GET STARTED*/ }
              <Route path="/packageFlow/getstarted/" component={GetStarted} />

              { /* SECTION: HUB DASHBOARD */ }
              <ProtectedRoute path="/" exact component={Dashboard} />
              { /* SECTION: ALL USER DASHBOARD */ }
              <ProtectedRoute path="/:propId?/rewards" component={Dashboard} />
              <ProtectedRoute path="/:propId?/property" component={Dashboard} />
              <ProtectedRoute path="/:propId?/listings" component={Dashboard} />
              <ProtectedRoute path="/:propId?/support" component={Dashboard} />
              <Redirect path="/:propId?/*" to="/:propId?/rewards" component={Dashboard} />
            </Switch>
          </div>

        </div>
      </div>


      { /* SECTION: SIDEBAR RIGHT */ }
      <div className="zIndex3">
        <Switch>
          {/* SECTION: DOCUMENTS */ }
          {
            userTypes === 'seller' && (
              <>
                <Switch>
                  <Route path="/:propId?/property/photos/:imgId/:editType" exact component={DetailMedia} />
                </Switch>
              </>
            )
          }
        </Switch>
      </div>

      { /* SECTION: ACHIVEMENT FLOW */ }
      {
        <Switch>
          <ProtectedRoute path="/:propId?/rewards/achievement/market-checker" exact component={MarketChecker} protect={userTypes ? userTypes !== 'seller' : false} />
          <ProtectedRoute path="/:propId?/rewards/achievement/assessor" exact component={Assessor} allowAccess={'seller'} />
          <ProtectedRoute path="/:propId?/rewards/achievement/bestimate" exact component={Bestimate} allowAccess={'seller'} />
        </Switch>
      }


      { /* SECTION: GENERAL MODAL - use redux modal to populate */ }
      {
        modal.state && (
          <BrixelModal
            classHeight={modal.height}
            classWidth={modal.width}
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
            <h6 className="mb-2" dangerouslySetInnerHTML={{ __html: modal.hint}} />
            <div className="body2" dangerouslySetInnerHTML={{ __html: modal.body}} />
          </BrixelModal>
        )
      }

      { /* SECTION: GENERAL NOTIFICATION - use redux notification to populate */ }
      {
        notification && (notification.small || notification.label) && (
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
                  className="zIndex5"
                />
              )
            }
          </>
        )
      }
      { /* SECTION: GENERAL MODAL - use redux modal to populate */ }
      {
        modal.state && (
          <BrixelModal
            classHeight={modal.height}
            classWidth={modal.width}
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
            <h6 className="mb-2" dangerouslySetInnerHTML={{ __html: modal.hint}} />
            <div className="body2" dangerouslySetInnerHTML={{ __html: modal.body}} />
          </BrixelModal>
        )
      }

      { /* SECTION: GENERAL NOTIFICATION - use redux notification to populate */ }
      {
        notification && (notification.small || notification.label) && (
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
                  className="zIndex5"
                />
              )
            }
          </>
        )
      }
    </main>
  );
};

App.propTypes = {
  handleSetActiveUsertype: PropTypes.func.isRequired,
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
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
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
  handleSetActiveUsertype: bindActionCreators(setUserTypes, dispatch),
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
