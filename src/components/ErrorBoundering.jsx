import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { sendSlackNotification } from '../actions/CommonActions';

class ErrorBoundary extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state to show the fallback UI during the next render phase
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const {
      activeSingleProperty,
      handleSendSlackNotifications,
      loggedInUser,
    } = this.props;
    // logging the error details
    const bodyErrorMessage = `URL: ${window.location.href}\nCause: ${error}.\nStackTrace: ${info.componentStack}`;
    const channel = 'backend-dev';
    const data = {
      user: get(loggedInUser, 'id', ''),
      page: get(activeSingleProperty, 'id', ''),
      meta: `Cause: ${error}.\nStackTrace: ${info.componentStack}`,
      url: window.location.href,
      apiResource: '',
    };
    handleSendSlackNotifications({ data, channel });
    // eslint-disable-next-line no-console
    console.log(bodyErrorMessage, info);
  }

  render() {
    const {
      hasError,
    } = this.state;
    const {
      children,
    } = this.props;
    if (hasError) {
      // Return the fallback UI
      return (
        <div className="min-h-100 h-perc-100 bgAltBlue100 dis-fl-col jc-c container">
          <h1 className="fweight-400 txtAltBlue400">Hmmm.</h1>
          <p className="max-w-fix-400 txtAltBlue400 fsize-400">It seems that you lost in a perpetual black hole. Let us hel guide you out and get you back home.</p>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.any]).isRequired,
  handleSendSlackNotifications: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty.id', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSendSlackNotifications: bindActionCreators(sendSlackNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
