/* global Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { BrixelDropdown, BrixelSelect, BrixelAvatar } from '@brixel/brixel-components';
import has from 'lodash/has';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';
import { setUnsavedChangesModal } from '../actions/CommonActions';
import { saveActiveSingleUser } from '../actions/UserActions';
import { setCookie } from '../utils/helpers';

const AccountDropdown = (props) => {
  // PROPS
  const {
    className,
    handleSaveActiveSingleUser,
    lang,
    loggedInUser,
    preventExit,
    setUnsavedModal,
  } = props;

  // STATE
  const [langMenu, setLangMenu] = useState([]);
  const [langSel, setSelLang] = useState(lang);
  const [closeDropDown, setCloseDropdown] = useState(false);
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;

  // GET LANGUAGE LISTS
  useEffect(() => {
    if (typeof Transifex !== 'undefined') {
      if (Transifex.live.getAllLanguages()) {
        const langHeader = [];
        Transifex.live.getAllLanguages().map((lng, i) => {
          langHeader[i] = lng;
          langHeader[i].value = lng.code;
          langHeader[i].label = lng.name;
          return null;
        });
        setLangMenu(langHeader);
      }
    }
  }, [localTransifex]);

  // FUNCTION TO CHANGE  THE LANGUAGE
  const newLang = (langCode) => {
    // handleChangeLanguage(lang);
    const defLangCode = get(langCode, 'value', null) ? langCode.value : langCode;
    if (typeof Transifex !== 'undefined') {
      setTimeout(() => {
        Transifex.live.translateTo(defLangCode);
      }, 100);
      setSelLang(defLangCode);
      localStorage.setItem('lang', defLangCode);
      setCookie('brixelLang', defLangCode);
    }
    if (get(loggedInUser, 'user.id', null)) {
      const userData = {
        id: get(loggedInUser, 'user.id', null),
        language: defLangCode,
        setLoggedInUser: true,
        smallLoader: 'saveData',
      };
      handleSaveActiveSingleUser(userData);
    }
    setCloseDropdown(true);
  };

  // FUNCTIONS TO CREATE THE PROFILE DROPDOWN MENU
  const dropdownAccount = useCallback(() => (
    [
      {
        component: {
          component: BrixelSelect,
          params: {
            options: langMenu,
            input: {
              value: langSel,
              name: 'lang',
              onChange: (val) => newLang(val),
            },
          },
        },
      },
      {
        href: `${baseByData().loginBasePath}/account/profile?url=${get(window, 'location.href', '')}`,
        label: 'Personal Information',
      },
      {
        href: `${baseByData().loginBasePath}/account/account?url=${get(window, 'location.href', '')}`,
        label: 'Password',
      },
      {
        href: `${baseByData().loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`,
        label: 'Preferences',
      },
      {
        href: `${baseByData().loginBasePath}/logout?url=${get(window, 'location.href', '')}`,
        label: 'Logout',
      },
    ]
  ), [langMenu, langSel, loggedInUser]);

  return (
    <>
      {
        (loggedInUser && loggedInUser.user) && (
          <div className={`${className}`}>
            <BrixelDropdown
              compact
              className="account-dropdown zIndex1"
              alignmentDropList="right"
              bgTransparent
              noBorder
              color="dark"
              saturationTxt={400}
              lang={lang}
              closeDropDown={closeDropDown}
              selectedComponent={{
                component: BrixelAvatar,
                props: {
                  baseURL: baseByData().shortPath,
                  profileId: get(loggedInUser, 'user.id', null),
                  name: get(loggedInUser, 'user.firstName', ''),
                  isIcon: true,
                },
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
                window.location.assign(keys.href);
              }}
              ulClass="w-fix-200"
              liClass="fsize-300"
            />
          </div>
        )
      }
    </>
  );
};

AccountDropdown.propTypes = {
  className: PropTypes.string,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
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
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AccountDropdown);
