/* global Transifex */
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
import { BrixelNotification } from '@brixel/brixel-components'

const Dashboard = Loadable({
  loader: () => import('./Pages/Dashboard' /* webpackChunkName: "Page" */),
  loading: Loading,
});

const GetStarted = Loadable({
  loader: () => import('./Pages/GetStarted' /* webpackChunkName: "Page" */),
  loading: Loading,
});

const App = (props) => {
  const {
    history, handleCheckToken, handleSetLanguages, isLoading, loggedUser, notification,
  } = props;

  useEffect(() => {
    handleCheckToken();
  }, []);

  useEffect(() => {
    if (Transifex.live) {
      const lang = [];
      if (Transifex.live.getAllLanguages()) {
        Transifex.live.getAllLanguages().map((lng, i) => {
          lang[i] = lng;
          lang[i].value = lng.code;
          lang[i].label = lng.name;
        });
      }
      handleSetLanguages(lang);
    }
  }, [Transifex.live]);

  if (!loggedUser) {
    return (
      <Loading isLoading={isLoading} />
    )
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <Switch>
        <Route path="/packageFlow/getstarted" component={GetStarted} />
        {
          loggedUser.token && (
            <>
              <Route path="/" exact component={Dashboard} />
            </>
          )
        }
        <Redirect from="*" to="/" />
      </Switch>
      {
        notification && (
          <BrixelNotification
            label={notification.label}
            type={notification.type}
            icon={notification.icon}
            actions={notification.actions}
          />
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
};

App.defaultProps = {
  isLoading: false,
  notification: null,
};

const mapStateToProps = (state) => ({
  notification: get(state, 'common.notification', null),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  loggedUser: get(state, 'user.loggedUser', null),
  config: get(state, 'common.config', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleSetLanguages: bindActionCreators(setLanguages, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
