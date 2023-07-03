import React, {Component} from 'react';
import BrixelPage500 from '@brixel-io/brixel-components/dist/components/BrixelPage500';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Cookies from 'universal-cookie';
import {sendSlackNotification} from '../actions/CommonActions';
import browserDetection from '../utils/browserDetection';
import translateTo from '../utils/translation';
import type {ErrorBoundaryType} from '../@types/components/ErrorBoundering';

const cookies = new Cookies();

const PageHasBeenForceRefreshed = 'page-has-been-force-refreshed';

class ErrorBoundary extends Component<ErrorBoundaryType> {
  state = { hasError: false, makeitTrue: false };

  static getDerivedStateFromError() {
    // Update state to show the fallback UI during the next render phase
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const pageHasAlreadyBeenForceRefreshed: boolean | string = window.sessionStorage.getItem(PageHasBeenForceRefreshed) || 'false';
    if ((typeof pageHasAlreadyBeenForceRefreshed === 'boolean' && pageHasAlreadyBeenForceRefreshed === false )|| pageHasAlreadyBeenForceRefreshed === 'false') {
      window.sessionStorage.setItem(PageHasBeenForceRefreshed, 'true');
      setTimeout(() => {
        // window.location.reload();
      }, 4000);
    } else {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(PageHasBeenForceRefreshed, 'false');
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
      //todo temporary 'makeitTrue', should be removed after 404 page test.
      makeitTrue,
    }: ErrorBoundaryType = this.props;
    if (hasError || makeitTrue) {
      // Return the fallback UI
      return (
        <BrixelPage500
          errorMessage="We&rsquo;re sorry but an error has occurred. We apologize for the inconvenience."
          buttons={[
            {
              className: 'mt-2',
              label: translateTo('Return to homepage', this.props.lang),
              type: 'primary',
              onClick: () => window.location.assign('/'),
            },
            {
              className: 'mt-2 ml-0 ml-sm-2',
              label: translateTo('Try again', this.props.lang),
              type: 'secondary',
              onClick: () => window.location.reload(),
            },
          ]}
        />
      );
    }
    return children;
  }
}
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
