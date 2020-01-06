/* global Transifex */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Cookies from 'universal-cookie';
import { BrixelDropdown, BrixelButtonIcon } from '@brixel/brixel-components';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import logoNorm from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import { setCookie } from '../utils/helpers';

const cookies = new Cookies();

function PageHeader(props) {
  const defaultLang = Transifex.live.selected_lang || Transifex.live.detectLanguage();
  // STATE
  const [currentLang, setCurrentLang] = useState('en');
  const [dropLang, setDropLang] = useState([]);
  // PROPS
  const {
    lang, languages, loggedUser,
  } = props;

  useEffect(() => {
    const lang = Transifex.live.selected_lang === 'en_US' ? 'en' : Transifex.live.selected_lang;
    setCurrentLang(lang);
    if (typeof loggedUser.token !== 'undefined') {
      Transifex.live.translateTo(loggedUser.user.language);
      setCurrentLang(loggedUser.user.language);
      setCookie('brixelLang', loggedUser.user.language);
    }
  }, [Transifex.live.selected_lang, loggedUser]);

  useEffect(() => {
    const drpLng = [];
    languages.map((lng, i) => {
      drpLng[i] = {
        value: lng.value,
        label: lng.value.replace('_US', ''),
      }
    });
    setDropLang(drpLng);
  }, [languages]);

  const newLang = (e, langCode) => {
    e.stopPropagation();
    console.log(langCode);
    if (typeof Transifex !== 'undefined') {
      if (langCode.value) Transifex.live.translateTo(langCode.value);
      else Transifex.live.translateTo(langCode);
      setCurrentLang(langCode.label);
    }
  };

  const dropdownAccount = () => (
    [
      {
        href: getConfigEnv.dashboardPath,
        label: 'My Properties',
        icon: 'properties',
      },
      {
        href: getConfigEnv.profileURL,
        label: 'Account',
        icon: 'account',
      },
      {
        href: `${getConfigEnv.loginBasePath}/logout`,
        label: 'Logout',
        icon: 'logout',
      },
    ]
  );

  return (
    <>
      <header>
        <div className={`container dis-f a-c jc-b p-2 h-fix-88 pos-r zIndex5`}>
          <img className="logo dis-b max-h-perc-100" src={logoNorm} alt="Brixel Logo" id="header-logo" />
          {
            !loggedUser.token ? (
              <div className="">
                <BrixelDropdown
                  bgTransparent
                  noBorder
                  color="dark"
                  saturationTxt={700}
                  lang={lang}
                  keyType="label"
                  selected={currentLang}
                  options={dropLang}
                  onSelect={(e, keys) => newLang(e, keys)}
                  liClass="tt-low"
                />
              </div>
            ) : (
              <div className="mr-2">
                <BrixelDropdown
                  alignmentDropList="right"
                  bgTransparent
                  noBorder
                  color="dark"
                  saturationTxt={100}
                  lang={lang}
                  selected={loggedUser.user.avatar[0] ? `<img class=" dis-b w-fix-64 brdCircle" src="${getConfigEnv.shortPath}${loggedUser.user.avatar[0].thumbnailPath}" alt="User Avatar" />` : '<i class="icon-account" />'}
                  options={dropdownAccount()}
                  onSelect={(e, keys) => window.open(keys.href)}
                  ulClass="w-fix-200"
                />
              </div>
            )
          }
        </div>

      </header>

    </>
  );
}

PageHeader.propTypes = {
  languages: PropTypes.arrayOf(PropTypes.object),
  loggedUser: PropTypes.object,
};

PageHeader.defaultProps = {
  languages: [],
  loggedUser: {},
  noMenu: false,
  withShadow: false,
};

const mapStateToProps = (state) => ({
  loggedUser: get(state, 'user.loggedUser', {}),
  languages: get(state, 'common.languages', []),
});

const mapPropsToState = (dispatch) => ({

});

export default withRouter(connect(mapStateToProps, mapPropsToState)(PageHeader));
