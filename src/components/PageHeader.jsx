/* global Transifex */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Cookies from 'universal-cookie';
import { BrixelDropdown, BrixelButtonIcon } from '@brixel/brixel-components';
import logoNorm from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import { configLang } from '../constants/global';

const cookies = new Cookies();

function PageHeader(props) {
  // STATE
  const [currentLang, setCurrentLang] = useState(Transifex.live.selected_lang === 'en_US' ? 'en' : Transifex.live.selected_lang);
  const [dropLang, setDropLang] = useState([]);
  // PROPS
  const {
    lang, languages, loggedUser,
  } = props;

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
    if (typeof Transifex !== 'undefined') {
      if (langCode.value) Transifex.live.translateTo(langCode.value);
      else Transifex.live.translateTo(langCode);
    }
  };

  return (
    <>
      <header>
        <div className={`container dis-f a-c jc-b p-2 h-fix-88`}>
          <img className="logo dis-b max-h-perc-100" src={logoNorm} alt="Brixel Logo" id="header-logo" />
          {
            !loggedUser.token && (
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
