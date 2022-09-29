import { translateTo } from '../utils/translation';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import BrixelPage500 from '@brixel/brixel-components/dist/components/BrixelPage500';
import Cookies from 'universal-cookie';
import browserDetection from '../utils/browserDetection';
import { sendSlackNotification } from '../actions/CommonActions';

const cookies = new Cookies();

const PageHasBeenForceRefreshed = "page-has-been-force-refreshed";

class ErrorBoundary extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state to show the fallback UI during the next render phase
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem(PageHasBeenForceRefreshed) || "false"
    );
    if (pageHasAlreadyBeenForceRefreshed === false || pageHasAlreadyBeenForceRefreshed === 'false') {
      window.localStorage.setItem(PageHasBeenForceRefreshed, "true");
      return window.location.reload();
    } else {
      window.localStorage.setItem(PageHasBeenForceRefreshed, "false");
      if (typeof window !== 'undefined') {
        const url = get(window, 'location.href', '');
        const {
          activeSingleProperty,
          handleSendSlackNotifications,
          lang,
          loggedInUser,
          pageError,
        } = this.props;
        // logging the error details
        const channel = 'frontend-dev';
        const data = {
          user: get(loggedInUser, 'id', ''),
          page: get(activeSingleProperty, 'id', ''),
          meta: `Browser Info: ${browserDetection().debug}\n Language: ${lang || cookies.get('brixelLang')}\n Cause: ${error}.\nStackTrace: ${get(info, 'componentStack', null)}`,
          url: window.location.href,
          apiResource: '',
        };
        let txtError = '';
        if (typeof error === 'string' && error) txtError = error;
        if (!pageError) {
          if (url && !url.includes('500') && !url.includes('localhost') && !txtError.includes('ChunkLoadError:') && !txtError.includes('Loading CSS chunk')) {
            handleSendSlackNotifications({ data, channel });
          } else {
            // eslint-disable-next-line no-console
            console.error(data);
          }
        }
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
              label: translateTo('Go to the dashboard', this.props.lang),
              type: 'primary',
              onClick: () => window.location.assign('/'),
            },
            {
              className: 'ml-2',
              label: translateTo('Try again', this.props.lang),
              type: 'secondary',
              onClick: () => window.location.reload(),
            }
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
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  pageError: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  pageError: get(state, 'common.setPageData.pageError', false),
});

const mapDispatchToProps = (dispatch) => ({
  handleSendSlackNotifications: bindActionCreators(sendSlackNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
