/* eslint-disable react-hooks/exhaustive-deps */
/* global Transifex */
import React, {
  useState, useEffect, useCallback, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { BrixelDropdown } from '@brixel/brixel-components';
// import logoColorIcon from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import logoColor from '@brixel/brixel-configuration-partner/src/images/logo_colors_new.svg';
import logoColorIcon from '@brixel/brixel-configuration-partner/src/images/logo_colors_icon_new.svg';
import BrixelButtonIcon from '@brixel/brixel-components/dist/components/BrixelButtonIcon';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import lazyWithRetry from './LazyWithRetry';
import ProgressSellerStage from './ProgressSellerStage';
import { setCookie, checkBrowser } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';

const AvatarImage = lazyWithRetry(() => import('./AvatarImage'));

function PageHeader(props) {
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
    pageState,
    property,
    windowDimensions,
  } = props;

  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  // GET URL PARAMS
  const fullURL = get(history, 'location.pathname', '').split('/');
  const propID = fullURL[2];
  const dealID = fullURL[3];

  // STATE
  const [currentLang, setCurrentLang] = useState(lang);
  const [dropLang, setDropLang] = useState([]);
  const [widthScreen, setWidthScreen] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  // FUNCTION LOADED WHEN SCREEN IS RESIZED
  const screenResize = useCallback(() => {
    setWidthScreen(window.innerWidth);
    if (window.innerWidth > 1024) {
      setShowMobileMenu(false);
      document.body.classList.remove('ov-h');
    }
  }, [window]);

  // FUNCTION TO INITIALIZE THE EVENT LISTENER FOR SCREEN RESIZE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidthScreen(window.innerWidth);
      window.addEventListener('resize', () => screenResize());
    }
  }, []);

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

  // FUNCTION WHEN CLICKED ON AVATAR - DIFFERENT IF DESKTOP OR MOBILE
  const avatarAction = useCallback(() => {
    // Mobile actions for the avatar click
    if (widthScreen < 769) {
      setShowMobileMenu(true);
      document.body.classList.add('ov-h');
    } else {
      window.open(baseByData(null, 'io').profileURL, '_blank');
    }
  }, [widthScreen]);

  // FUNCTION WHEN MENU ELEMENT IS CLICKED
  const onClickMenu = useCallback((link) => {
    history.push(link);
    setShowMobileMenu(false);
  }, []);

  const closeOverlay = () => {
    if (
      history.location.pathname.toLowerCase().includes('getstartedbuyer') ||
      history.location.pathname.toLowerCase().includes('visitfeedback')
    ) {
      history.push('/buy');
    } else if (history.location.pathname.toLowerCase().includes('makeoffer')) {
      history.push(`/buyer/${propID}/closing/${dealID}`);
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
    <>
      <header className={`flowHeader ${get(pageState, 'stage', null) || get(history, 'location.pathname', '').includes('/getStarted/') ? 'welcomeSellerHeader' : ''}`}>
        <div className="container">
          {/* eslint-disable-next-line max-len */}
          <div className={`w-perc-100 wcInnerWrap dis-f max-h-fix-136 a-c dis-f a-c  jc-b pos-r jc-b pos-r pb-1 ${history.location.pathname.includes('upgrade') ? 'pt-1 py-sm-2' : 'pt-2 py-sm-5'}  ${(history.location.pathname.includes('onBoarding') || history.location.pathname.includes('packageFlow') || history.location.pathname.includes('visitFeedback') || history.location.pathname.includes('signup') || history.location.pathname.includes('trialRequest') || history.location.pathname.includes('upgrade')) ? '' : 'jc-fe-md'}`}>
            <div className="dis-f a-c">
              <div className={`dis-f a-c min-h-fix-72 h-perc-100 ${get(pageState, 'stage', null) ? 'w-fix-48 w-fix-sm-104' : 'w-fix-104'} ${get(pageState, 'stage', null) || get(history, 'location.pathname', '').includes('/getStarted/') ? 'brdSmallRight brdLight200 pr-1 mr-1 pr-lg-3 mr-lg-3' : ''}`}>
                <img
                  className={`logo w-perc-100 ${window.innerWidth <= 600 ? 'w-fix-32' : 'max-w-fix-104 ov-h'} ${(history.location.pathname.includes('onBoarding') || history.location.pathname.includes('packageFlow') || history.location.pathname.includes('visitFeedback') || history.location.pathname.includes('signup') || history.location.pathname.includes('trialRequest') || history.location.pathname.includes('upgrade')) ? '' : 'hide-md'}`}
                  src={`${window.innerWidth <= 600 ? logoColorIcon : logoColor}`}
                  alt="Brixel Logo"
                  id="header-logo"
                />
              </div>
              {
                (get(pageState, 'stage', null) || get(history, 'location.pathname', '').includes('/getStarted/')) && (
                  <div>
                    <ProgressSellerStage
                      smallLayout={windowDimensions.width < 1025}
                      xSmallMobile={windowDimensions.width < 480}
                      stepIndexProgress={0}
                    />
                  </div>
                )
              }
            </div>
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
                    {
                      !history.location.pathname.includes('packageFlow') &&
                      !history.location.pathname.includes('visitFeedback') &&
                      !history.location.pathname.includes('trialRequest') &&
                      !history.location.pathname.includes('upgrade') &&
                      !history.location.pathname.includes('signup') && (
                        <Suspense fallback="">
                          <AvatarImage
                            avatarImg={has(loggedInUser, 'user.avatar[0]') ? `${baseByData.shortPath}${loggedInUser.user.avatar[0].thumbnailPath}` : null}
                            name={loggedInUser.user.name}
                            size={40}
                            onClick={() => avatarAction()}
                          />
                        </Suspense>
                      )
                    }
                    {
                      (
                        history.location.pathname.includes('packageFlow') ||
                        history.location.pathname.includes('visitFeedback') ||
                        history.location.pathname.includes('trialRequest') ||
                        history.location.pathname.includes('upgrade') ||
                        history.location.pathname.includes('signup')) &&
                      !(get(history, 'location.state.hideClose', null)) && (
                        <BrixelButtonIcon
                          ghost
                          className="zIndex11"
                          theme="altGrey"
                          icon="close-small"
                          onClick={() => closeOverlay()}
                        />
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </header>

      {
        showMobileMenu && (
          <div className="mobile-menu bgGreen700 w-perc-100 h-perc-100 pos-a dis-fl-col a-c p-1 zIndex5">
            <BrixelButtonIcon
              className="as-fe mb-5"
              icon="close-small"
              theme="green"
              onClick={() => {
                setShowMobileMenu(false);
                document.body.classList.remove('ov-h');
              }}
            />
            <div className="links dis-fl-col as-b pl-4">
              <button
                type="button"
                className="txtLight100 fweight-700 fSizePx28 mb-4"
                onClick={() => onClickMenu(`/${property.id}/property`)}
              >
                Properties
              </button>
              <button
                type="button"
                className="txtDark200 fweight-700 fSizePx28 mb-4 poi-none ta-l"
                onClick={() => ''}
              >
                Messages
              </button>
              <button
                type="button"
                className="txtDark200 fweight-700 fSizePx28 mb-4 poi-none ta-l"
                onClick={() => ''}
              >
                Calendar
              </button>
              <a
                className="txtLight100 fweight-700 fSizePx28 mb-4"
                href={baseByData.profileURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </a>
            </div>
          </div>
        )
      }
    </>
  );
}

PageHeader.propTypes = {
  handleSetLanguage: PropTypes.func.isRequired,
  lang: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.object),
  loggedInUser: PropTypes.object,
  pageState: PropTypes.object,
  property: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

PageHeader.defaultProps = {
  languages: [],
  lang: 'en',
  loggedInUser: {},
  pageState: null,
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

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
