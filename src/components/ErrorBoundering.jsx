import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import BrixelPage500 from '@brixel/brixel-components/dist/components/BrixelPage500';
import { sendSlackNotification } from '../actions/CommonActions';

class ErrorBoundary extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state to show the fallback UI during the next render phase
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (!url.includes('500') && !url.includes('localhost')) {
        const {
          activeSingleProperty,
          handleSendSlackNotifications,
          loggedInUser,
        } = this.props;
        // logging the error details
        const channel = 'frontend-dev';
        const data = {
          user: get(loggedInUser, 'id', ''),
          page: get(activeSingleProperty, 'id', ''),
          meta: `Cause: ${error}.\nStackTrace: ${info.componentStack}`,
          url: window.location.href,
          apiResource: '',
        };
        handleSendSlackNotifications({ data, channel });
      }
    }
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
        <BrixelPage500
          errorMessage="You can try again or go back to the dashboard"
          buttons={[
            {
              label: 'Dashboard',
              onClick: () => window.location.assign('/sell'),
            }, {
              label: 'Try again',
              className: 'ml-2',
              onClick: () => window.location.reload(),
            },
          ]}
        />
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
