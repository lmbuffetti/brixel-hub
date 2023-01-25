import React, {useCallback, useEffect, useState} from 'react';
import {BrixelAvatar, BrixelDropdown} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelSelect} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {setUnsavedChangesModal} from '../actions/CommonActions';
import {saveActiveSingleUser} from '../actions/UserActions';
import {setCookie} from '../utils/helpers';
import translateTo from '../utils/translation';
import type {AccountDropdownType} from '../@types/components/AccountDropdown';
import {OptionsType} from '@brixel/brixel-components/dist/@types/Form/Input';

const AccountDropdown = (props: AccountDropdownType) => {
  // PROPS
  const {
    className,
    handleSaveActiveSingleUser,
    lang,
    languages,
    loggedInUser,
    preventExit,
    setUnsavedModal,
  } = props;

  // STATE
  const [langMenu, setLangMenu] = useState<OptionsType[]>([]);
  const [langSel, setSelLang] = useState(lang);
  const [closeDropDown, setCloseDropdown] = useState(false);

  // GET LANGUAGE LISTS
  useEffect(() => {
    const langHeader: OptionsType[] = [];
    languages.map((lng, i) => {
      langHeader[i].value = lng.code;
      langHeader[i].label = lng.name;
      return null;
    });
    setLangMenu(langHeader);
  }, [languages]);

  // FUNCTION TO CHANGE  THE LANGUAGE
  const newLang = (langCode) => {
    // handleChangeLanguage(lang);
    const defLangCode = get(langCode, 'value', null) ? langCode.value : langCode;
    setSelLang(defLangCode);
    localStorage.setItem('lang', defLangCode);
    setCookie('brixelLang', defLangCode);
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
        href: `${baseByData.loginBasePath}/account/profile?url=${get(window, 'location.href', '')}`,
        label: translateTo('Personal Information', lang),
      },
      {
        href: `${baseByData.loginBasePath}/account/account?url=${get(window, 'location.href', '')}`,
        label: translateTo('Password', lang),
      },
      {
        href: `${baseByData.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`,
        label: translateTo('Preferences', lang),
      },
      {
        href: `${baseByData.loginBasePath}/logout?url=${get(window, 'location.href', '')}`,
        label: translateTo('Logout', lang),
      },
    ]
  ), [langMenu, langSel, loggedInUser]);

  return (
    <>
      {
        (loggedInUser && loggedInUser.id) && (
          <div className={`${className}`}>
            <BrixelDropdown
              compact
              className="account-dropdown zIndex1"
              alignmentDropList="right"
              bgTransparent
              noBorder
              color="dark"
              saturationTxt={400}
              closeDropDown={closeDropDown}
              selectedComponent={{
                // @ts-ignore
                component: BrixelAvatar,
                props: {
                  // @ts-ignore
                  baseURL: (baseByData.shortPath).toString(),
                  profileId: get(loggedInUser, 'user.id', ''),
                  name: get(loggedInUser, 'user.firstName', ''),
                  isIcon: true,
                },
              }}
              options={dropdownAccount()}
              onSelect={(e, keys) => {
                if (preventExit) {
                  setUnsavedModal({
                    state: true,
                    link: get(keys, 'href', ''),
                  });
                  return;
                }
                window.location.assign(get(keys, 'href', ''));
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

const mapStateToProps = (state) => ({
  configUrl: get(state, 'common.configUrl', {}),
  lang: get(state, 'common.language', 'en'),
  languages: get(state, 'common.languages', '[]'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  preventExit: get(state, 'common.preventExitFromScreen', false),
});

const mapDispatchToProps = (dispatch) => ({
  setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AccountDropdown);
