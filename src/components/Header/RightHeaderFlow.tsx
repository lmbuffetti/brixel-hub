import React, {useEffect, useState} from 'react';
import {BrixelDropdown} from '@brixel/brixel-components';
import BrixelButtonIcon from '@brixel/brixel-components/dist/components/BrixelButtonIcon';
import get from 'lodash/get';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {setLanguage} from '../../actions/CommonActions';
import {checkBrowser, setCookie} from '../../utils/helpers';
import type {RightHeaderFlowType} from '../../@types/components/Header/RightHeaderFlow';
import type {LanguagesType} from '../../@types/components/Header/PageHeader';

function RightHeaderFlow(props: RightHeaderFlowType) {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    handleSetLanguage,
    lang = 'en',
    languages = [],
    loggedInUser,
    userType,
  } = props;

  // GET URL PARAMS
  const fullURL = get(history, 'location.pathname', '').split('/');
  let propID = fullURL[2];
  const dealID = fullURL[3];
  const isBuyer = userType === 'buyer';

  // STATE
  const [currentLang, setCurrentLang] = useState(lang);
  const [dropLang, setDropLang] = useState<LanguagesType[]>([]);

  useEffect(() => {
    if (get(history, 'location.search', null) && get(history, 'location.search', '').includes('?url=')) {
      const urlParams = queryString.parse(get(history, 'location.search', ''));
      const url = get(urlParams, 'url', '') || '';
      localStorage.setItem('backUrl', url.toString());
      localStorage.setItem('backUrlBis', url.toString());
    }
  }, [history]);

  // FUNCTION TO CHECK IF USER IS LOGGED IN
  useEffect(() => {
    if (loggedInUser?.id) {
      const langUsr = loggedInUser.language;
      setCurrentLang(lang);
      if(langUsr) setCookie('brixelLang', langUsr);
    }
  }, [loggedInUser, lang]);

  // FUNCTION TO POPULATE THE DROPDOWN LANGUAGE MENU
  useEffect(() => {
    const capitalize = (item) => item.charAt(0).toUpperCase() + item.slice(1);
    const newLang = languages.map((lng) => ({...lng, label: capitalize(lng.shortLabel)}));
    setDropLang(newLang);
  }, [languages]);

  // FUNCTION TO TRANSLATE THE CONTENT USING TRANSIFEX
  useEffect(() => {
    setCurrentLang(lang);
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
        // @ts-ignore
        window.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, []);

  // FUNCTION TO SET THE LANGUAGE WHEN SELECTED
  const newLang = (e, langCode) => {
    e.stopPropagation();
    if (langCode.value) {
      setCurrentLang(langCode.value);
      handleSetLanguage(langCode.value);
      setCookie('brixelLang', langCode.value);
    }
  };

  const closeOverlay = () => {
    let url = localStorage.getItem('backUrl');
    if (
      history.location.pathname.toLowerCase().includes('getstartedbuyer') ||
      history.location.pathname.toLowerCase().includes('visitfeedback')
    ) {
      history.push('/buy');
    } else if (history.location.pathname.toLowerCase().includes('makeoffer') || history.location.pathname.toLowerCase().includes('closing')) {
      if (userType === 'seller') {
        history.push(url || `/${propID}/closing/${dealID}`);
      } else {
        history.push(url || `/buyer/${propID}/closing/${dealID}`);
      }
    } else if (history.location.pathname.toLowerCase().includes('schedulevisit')) {
      history.push(url || `/buyer/${propID}/home`);
    } else if (history.location.pathname.toLowerCase().includes('contactflow')) {
      const BASEURL = isBuyer ? '/buyer' : '';
      propID = isBuyer ? fullURL[2] : fullURL[1];
      history.push(url || `${BASEURL}/${propID}/home`);
    } else {
      url = localStorage.getItem('backUrlBis');
      const urlBuyer = localStorage.getItem('backUrlBuyerEstimations');
      if (url) {
        localStorage.removeItem('backUrlBis');
      }
      else {
        if (urlBuyer) {
          url = urlBuyer;
        } else {
          url = localStorage.getItem('backUrl');
        }
        localStorage.removeItem('backUrl');
        localStorage.removeItem('backUrlBuyerEstimations');
      }
      history.push(url || '/sell');
    }
  };

  return (
    <div className="dis-f a-c">
      <div className="">
        <BrixelDropdown
          noBorder
          className="langMenu"
          color="dark"
          saturationTxt={700}
          keyType="label"
          selected={currentLang || 'en'}
          options={dropLang}
          onSelect={(e, keys) => newLang(e, keys)}
          liClass="tt-low"
        />
      </div>
      {
        loggedInUser?.id && (
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

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  lang: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  pageState: get(state, 'common.setPageData', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  userType: get(state, 'user.userTypes', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightHeaderFlow);
