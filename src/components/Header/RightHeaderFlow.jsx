/* eslint-disable react-hooks/exhaustive-deps */
/* global Transifex */
import React, {
  useState, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import { BrixelDropdown } from '@brixel/brixel-components';
import BrixelButtonIcon from '@brixel/brixel-components/dist/components/BrixelButtonIcon';
import queryString from 'query-string';
import { setCookie, checkBrowser } from '../../utils/helpers';
import { setLanguage } from '../../actions/CommonActions';

function RightHeaderFlow(props) {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    handleSetLanguage,
    lang,
    languages,
    loggedInUser,
  } = props;

  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  // GET URL PARAMS
  const fullURL = get(history, 'location.pathname', '').split('/');
  const propID = fullURL[2];
  const dealID = fullURL[3];

  // STATE
  const [currentLang, setCurrentLang] = useState(lang);
  const [dropLang, setDropLang] = useState([]);

  useEffect(() => {
    if (get(history, 'location.search', null) && get(history, 'location.search', '').includes('?url=')) {
      const urlParams = queryString.parse(get(history, 'location.search', ''));
      localStorage.setItem('backUrl', urlParams.url);
      localStorage.setItem('backUrlBis', urlParams.url);
    }
  }, [history]);

  // FUNCTION TO CHECK IF USER IS LOGGED IN
  useEffect(() => {
    if (loggedInUser && loggedInUser.user) {
      const langUsr = loggedInUser.user.language;
      setCurrentLang(lang);
      handleSetLanguage(lang);
      setCookie('brixelLang', langUsr);
    }
  }, [loggedInUser, lang]);

  // FUNCTION TO POPULATE THE DROPDOWN LANGUAGE MENU
  useEffect(() => {
    const drpLng = [];
    languages.map((lng, i) => {
      drpLng[i] = {
        value: lng.value,
        label: lng.label.replace('_US', ''),
      };
      return null;
    });
    setDropLang(drpLng);
  }, [languages]);

  // FUNCTION TO TRANSLATE THE CONTENT USING TRANSIFEX
  useEffect(() => {
    setCurrentLang(lang);
    if (typeof Transifex !== 'undefined') Transifex.live.translateTo(lang);
  }, [lang]);

  // FUNCTION TO INITIALIZE THE EVENT LISTENER FOR SCREEN RESIZE
  useEffect(() => {
    document.body.classList.add('flowBody');
    return () => {
      //  clean up
      document.body.classList.remove('flowBody');
    };
  }, []);

  useEffect(() => {
    // this changes the scrolling behavior to "smooth"
    if (window.innerWidth < 590) {
      if (checkBrowser() > 0) {
        window.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, []);

  // FUNCTION TO SET THE LANGUAGE WHEN SELECTED
  const newLang = useCallback((e, langCode) => {
    e.stopPropagation();
    setCurrentLang(langCode.value);
    handleSetLanguage(langCode.value);
    if (typeof Transifex !== 'undefined') Transifex.live.translateTo(langCode.value);
    setCookie('brixelLang', langCode.value);
  }, [localTransifex]);

  const closeOverlay = () => {
    if (
      history.location.pathname.toLowerCase().includes('getstartedbuyer') ||
      history.location.pathname.toLowerCase().includes('visitfeedback')
    ) {
      history.push('/buy');
    } else if (history.location.pathname.toLowerCase().includes('makeoffer') || history.location.pathname.toLowerCase().includes('closing')) {
      const userType = history.location.pathname.toLowerCase().includes('/buyer/') ? 'buyer' : 'seller';
      if (userType === 'seller') {
        history.push(`/${propID}/closing/${dealID}`);
      } else {
        history.push(`/buyer/${propID}/closing/${dealID}`);
      }
    } else {
      let url = localStorage.getItem('backUrlBis');
      if (url) {
        localStorage.removeItem('backUrlBis');
      } else {
        url = localStorage.getItem('backUrl');
        localStorage.removeItem('backUrl');
      }
      history.push(url || '/sell');
    }
  };

  return (
    <div className="dis-f a-c">
      {
        !loggedInUser.token ? (
          <div className="">
            <BrixelDropdown
              noBorder
              className="langMenu"
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
          <div className="ml-1">
            <BrixelButtonIcon
              ghost
              className="zIndex11"
              theme="altGrey"
              icon="close-small"
              onClick={() => closeOverlay()}
            />
          </div>
        )
      }
    </div>
  );
}

RightHeaderFlow.propTypes = {
  handleSetLanguage: PropTypes.func.isRequired,
  lang: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.object),
  loggedInUser: PropTypes.object,
};

RightHeaderFlow.defaultProps = {
  languages: [],
  lang: 'en',
  loggedInUser: {},
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  lang: get(state, 'common.language', ''),
  languages: get(state, 'common.languages', []),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  pageState: get(state, 'common.setPageData', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightHeaderFlow);
