import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { sendSlackNotification, setPageData } from '../actions/CommonActions';

class PartialErrorBoundering extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state to show the fallback UI during the next render phase
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      const {
        activeSingleProperty,
        handleSendSlackNotifications,
        handleSetPageData,
        loggedInUser,
        pageError,
      } = this.props;
      // logging the error details
      const channel = 'frontend-dev';
      const data = {
        user: get(loggedInUser, 'id', ''),
        page: get(activeSingleProperty, 'id', ''),
        meta: `Browser Info: ${this.getBrowserInfo()}\n Cause: ${error}.\nStackTrace: ${info.componentStack}`,
        url: window.location.href,
        apiResource: '',
      };
      let txtError = '';
      if (typeof error === 'string' && error) txtError = error;
      if (!pageError) {
        handleSetPageData({ pageError: true });
        if (url && !url.includes('500') && !url.includes('localhost') && ((!txtError.includes('ChunkLoadError:') && !txtError.includes('Loading CSS chunk')) || typeof error !== 'string')) {
          handleSendSlackNotifications({ data, channel });
        } else {
          // eslint-disable-next-line no-console
          console.error(data);
        }
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getBrowserInfo() {
    const module = {
      options: [],
      header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
      dataos: [
        { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
        { name: 'Windows', value: 'Win', version: 'NT' },
        { name: 'iPhone', value: 'iPhone', version: 'OS' },
        { name: 'iPad', value: 'iPad', version: 'OS' },
        { name: 'Kindle', value: 'Silk', version: 'Silk' },
        { name: 'Android', value: 'Android', version: 'Android' },
        { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
        { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
        { name: 'Macintosh', value: 'Mac', version: 'OS X' },
        { name: 'Linux', value: 'Linux', version: 'rv' },
        { name: 'Palm', value: 'Palm', version: 'PalmOS' },
      ],
      databrowser: [
        { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
        { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
        { name: 'Safari', value: 'Safari', version: 'Version' },
        { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
        { name: 'Opera', value: 'Opera', version: 'Opera' },
        { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
        { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' },
      ],
      init() {
        const agent = this.header.join(' ');
        const os = this.matchItem(agent, this.dataos);
        const browser = this.matchItem(agent, this.databrowser);
        return { os, browser };
      },
      matchItem(string, data) {
        let i = 0;
        let j = 0;
        let regex;
        let regexv;
        let match;
        let matches;
        let version;

        for (i = 0; i < data.length; i += 1) {
          regex = new RegExp(data[i].value, 'i');
          match = regex.test(string);
          if (match) {
            regexv = new RegExp(`${data[i].version}[- /:;]([\\d._]+)`, 'i');
            matches = string.match(regexv);
            version = '';
            if (matches) { if (matches[1]) { matches = matches[1]; } }
            if (matches) {
              matches = matches.split(/[._]+/);
              for (j = 0; j < matches.length; j += 1) {
                if (j === 0) {
                  version += `${matches[j]}.`;
                } else {
                  version += matches[j];
                }
              }
            } else {
              version = '0';
            }
            return {
              name: data[i].name,
              version: parseFloat(version),
            };
          }
        }
        return { name: 'unknown', version: 0 };
      },
    };

    const e = module.init();
    let debug = '';

    debug += `os.name = ${e.os.name}\n`;
    debug += `os.version = ${e.os.version}\n`;
    debug += `browser.name = ${e.browser.name}\n`;
    debug += `browser.version = ${e.browser.version}\n`;

    return debug;
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
        <div />
      );
    }

    return children;
  }
}

PartialErrorBoundering.propTypes = {
  activeSingleProperty: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.any]).isRequired,
  handleSendSlackNotifications: PropTypes.func.isRequired,
  handleSetPageData: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  pageError: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty.id', ''),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  pageError: get(state, 'common.setPageData.pageError', false),
});

const mapDispatchToProps = (dispatch) => ({
  handleSendSlackNotifications: bindActionCreators(sendSlackNotification, dispatch),
  handleSetPageData: bindActionCreators(setPageData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PartialErrorBoundering);
