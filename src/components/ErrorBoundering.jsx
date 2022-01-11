import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonPrimary, BrixelButtonSecondary } from '@brixel/brixel-components';
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
        <div className="min-h-100 h-perc-100 bgAltBlue100">
          <div className="dis-fl-col jc-c a-c container h-perc-100 ta-c">

            <span className="fweight-600 txtDark700 fsize-900">Something went wrong</span>
            <p className="fweight-500 txtDark500 fsize-400 max-w-fix-480 ml-a mr-a my-2 dis-b w-perc-100">You can either go back or report an issue to support.</p>
            <div className="dis-f w-perc-100 max-w-fix-480 jc-c">
              <BrixelButtonPrimary
                label="Go Back"
                rounded
              />
              <BrixelButtonSecondary
                label="Report an issue"
                bgTransparent
                rounded
                className="ml-2"
              />
            </div>
          </div>
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
