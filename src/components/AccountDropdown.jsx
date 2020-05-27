/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { BrixelDropdown } from '@brixel/brixel-components';
import { setUnsavedChangesModal } from '../actions/CommonActions';
import has from 'lodash/has';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';
import AvatarImage from './AvatarImage';

const AccountDropdown = (props) => {
  const {
    className,
    lang,
    loggedInUser,
    preventExit,
    setUnsavedModal,
  } = props;

  const dropdownAccount = () => (
    [
      {
        href: `${baseByData().loginBasePath}/account/account?url=${window.location.href}`,
        label: 'Password',
        icon: 'properties',
      },
      {
        href: `${baseByData().loginBasePath}/account/preferences?url=${window.location.href}`,
        label: 'Preferences',
        icon: 'account',
      },
      {
        href: `${baseByData().loginBasePath}/logout?url=${window.location.href}`,
        label: 'Logout',
        icon: 'logout',
      },
    ]
  );

  return (
    <>
      {
        (loggedInUser && loggedInUser.id) && (
          <div className={`${className}`}>
            <BrixelDropdown
              compact={true}
              className="account-dropdown zIndex1 pr-2"
              alignmentDropList="right"
              bgTransparent
              noBorder
              color="dark"
              saturationTxt={400}
              lang={lang}
              selectedComponent={{
                component: AvatarImage,
                props: {
                  avatarImg: has(loggedInUser, 'user.avatar[0]') ? `${baseByData().shortPath}${loggedInUser.user.avatar[0].thumbnailPath}` : null,
                  name: has(loggedInUser, 'user.name') ? loggedInUser.user.name : '',
                  size: 32
                }
              }}
              options={dropdownAccount()}
              onSelect={(e, keys) => {
                if (preventExit) {
                  setUnsavedModal({
                    state: true,
                    link: keys.href,
                  });
                  return;
                }
                window.open(keys.href);
              }}
              ulClass="w-fix-200"
            />
          </div>
        )
      }
    </>
  );
};

AccountDropdown.propTypes = {
  className: PropTypes.string,
  configUrl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  preventExit: PropTypes.bool.isRequired,
  setUnsavedModal: PropTypes.func.isRequired,
};

AccountDropdown.defaultProps = {
  className: null,
};

const mapStateToProps = (state) => ({
  configUrl: get(state, 'common.configUrl', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  preventExit: get(state, 'common.preventExitFromScreen', false),
});

const mapDispatchToProps = (dispatch) => ({
  setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AccountDropdown);
