/* global Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import {
  BrixelButtonText,
  BrixelButtonIcon,
  destroy,
  BrixelSelect,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_full_v2.svg';
import logoMobile from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import useOutsideAlerter from './OutsideElement';
import { setCookie } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';
import MenuNavigationSubmenu from './MenuNavigationSubmenu';
import {
  firstRoutes,
  firstRoutesBuyer,
  secondRoutes,
  secondRoutesBuyer,
} from '../resources/navigationRoutes';
import { saveActiveSingleUser, setUserTypes } from '../actions/UserActions';
import { setActiveSingleProperty } from '../actions/PropertyActions';
import AccountDropdown from './AccountDropdown';
import MenuSidebar from './MenuSidebar';

function PageHeaderDashboard(props) {
  // PROPS
  const {
    activeSingleProperty,
    changeZIndex,
    destroyForm,
    formValue,
    handleSaveActiveSingleUser,
    handleSetActiveSingleProperty,
    handleSetLanguage,
    handleSetUserTypes,
    history,
    lang,
    loggedInUser,
    userType,
    windowDimensions,
  } = props;
  // STATE
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [langMenu, setLangMenu] = useState([]);
  const [langSel, setSelLang] = useState(lang);
  const [section, setSection] = useState('Sell');
  const [linkSection, setLinkSection] = useState('Sell');
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  // REF
  const profileMenu = useRef(null);

  // URL PARAMS
  let propID = history.location.pathname.split('/')[1];
  if (propID === 'buyer') propID = history.location.pathname.split('/')[3];
  if (propID === 'home' || propID === 'seller') propID = null;

  // ON CHANGE HISTORY THE MOBILE MENU IS CLOSED
  useEffect(() => {
    setShowMobileMenu(false);
  }, [history]);

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
  };

  // CHECK IF USER IS LOGGED IN AND LOAD GAME HISTORY IF NO DATA
  useEffect(() => {
    if (loggedInUser && loggedInUser.user) {
      const langUsr = loggedInUser.user.language;
      handleSetLanguage(lang);
      setCookie('brixelLang', langUsr);
      if (typeof Transifex !== 'undefined') {
        setTimeout(() => {
          Transifex.live.translateTo(langUsr);
        }, 100);
      }
    }
  }, [loggedInUser, localTransifex]);

  // FUNCTION LOADED WHEN SCREEN RESIZED
  const screenResize = () => {
    if (window.innerWidth >= 1024) {
      document.body.classList.remove('ov-h');
    }
  };

  // FUNCTION TO INITIALIZE THE EVENT LISTENER FOR SCREEN RESIZE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => screenResize());
    }
  }, []);

  // SHOW/HIDE MOBILE MENU
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowAccountMenu(false);
    changeZIndex(!showMobileMenu ? 8 : 1);
    if (!showMobileMenu) document.body.classList.remove('ov-h');
  };

  // WHEN CLICK ON UPGRADE BUTTON
  const onUpgrade = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/upgrade`);
  };

  // FUNCTION TO GET CURRENT URL LOCATION
  const getCurrentRoute = () => {
    const path = history.location.pathname;
    const currentPath = firstRoutes.concat(secondRoutes, firstRoutesBuyer, secondRoutesBuyer).find((item) => path.includes(item.name));
    return currentPath || {};
  };

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(profileMenu, {
    action: 'function',
    func: () => {
      setShowProfileMenu(false);
    },
  });
  // add shadow header on body scroll
  useEffect(() => {
    const dashContentEl = document.getElementsByClassName('hubDasContent')[0];
    const dashWrapperEl = document.getElementsByClassName('hubDashboard')[0];
    if (dashContentEl) {
      dashContentEl.addEventListener('scroll', () => {
        if (dashContentEl.scrollTop > 5) {
          dashWrapperEl.classList.add('scrollingHeader');
        } else {
          dashWrapperEl.classList.remove('scrollingHeader');
        }
        if (dashContentEl.scrollTop > 40) {
          dashWrapperEl.classList.add('longScroll');
        } else {
          dashWrapperEl.classList.remove('longScroll');
        }
      });
    }
  }, [showMobileMenu]);

  useEffect(() => {
    const dashContentEl = document.getElementsByClassName('hubDasContent')[0];
    if (dashContentEl) {
      if (showMobileMenu) {
        dashContentEl.classList.add('menuOn');
        dashContentEl.style.overflowY = 'hidden';
      } else {
        dashContentEl.style.overflowY = '';
        dashContentEl.classList.remove('menuOn');
      }
    }
  }, [showMobileMenu]);

  // FUNCTION TO MAANGE THE TAB CLICK
  const onTabClick = (val, act = 'url') => {
    if (act === 'state' || val === 'support' || val === '/support') {
      setActiveMenu(val.replace('/', ''));
    } else {
      const url = val.replace(':propID', propID);
      history.push(url);
      setActiveMenu(null);
    }
  };

  // FUNCTION TO SHOW/HIDE THE SUPPORT MENU (history.push({state: {showSupport: true}}))
  useEffect(() => {
    if (get(history, 'location.state.showSupport', null) === true) {
      onTabClick('support');
      history.push({ state: { showSupport: false } });
    }
  }, [get(history, 'location.state', null)]);

  useEffect(() => {
    if (userType === 'seller') setSection('Sell');
    else setSection('Buy');
  }, [get(history, 'location.state', null), userType]);

  useEffect(() => {
    switch (section) {
      case 'Buy':
        setLinkSection('/buy');
        break;
      default:
        setLinkSection('/sell');
        break;
    }
  }, [section]);

  return (
    <>
      <MenuNavigationSubmenu
        windowDimensions={windowDimensions}
        activeMenu={activeMenu}
        onClose={() => setActiveMenu(null)}
      />
      <header className={`hubDasHeader ${showMobileMenu ? 'menu-active' : ''}`}>
        <div className="dasHeaderContainer">
          <div className="wrapperHeader dis-f a-c h-fix-64 px-2 px-lg-3 jc-b pos-r bgWhite">
            <div className="header-section py-1 dis-fl-row a-c jc-b">
              <div className="dis-f a-c logoWrapper">
                {
                  windowDimensions.width <= 590 ? (
                    <img
                      onClick={() => {
                        handleSetUserTypes('seller');
                        handleSetActiveSingleProperty({});
                        history.push('/sell');
                      }}
                      className="pos-r cur-poi"
                      src={logoMobile}
                      alt="Brixel Logo"
                      id="logo"
                    />
                  ) : (
                    <img
                      onClick={() => {
                        handleSetUserTypes('seller');
                        handleSetActiveSingleProperty({});
                        history.push('/sell');
                      }}
                      className="pos-r cur-poi"
                      src={logo}
                      alt="Brixel Logo"
                      id="logo"
                    />
                  )
                }
              </div>
              <div className="quickNav dis-f ml-3 pl-3 fsize-300">
                {
                  activeSingleProperty.id && propID && propID !== 'home' && propID !== 'buyer' && propID !== 'seller' && propID !== 'buy' && propID !== 'sell' ? (
                    <>
                      <span
                        className="cur-poi"
                        onClick={() => history.push(linkSection)}
                      >
                        {section}
                      </span>
                      <span className="px-1"> &gt; </span>
                      <span className="propertyTitle txtDark700">{get(formValue, 'title', '')}</span>
                    </>
                  ) : (
                    <>
                      <span
                        className={`pr-3 cur-poi ${history.location.pathname.includes('/sell') ? 'fweight-600 txtDark600' : ''}`}
                        onClick={() => {
                          handleSetUserTypes('seller');
                          handleSetActiveSingleProperty({});
                          history.push('/sell');
                        }}
                      >
                        Sell
                      </span>
                      <span
                        className={`cur-poi ${history.location.pathname.includes('/buy') ? 'fweight-600 txtDark600' : ''}`}
                        onClick={() => {
                          destroyForm();
                          handleSetUserTypes('buyer');
                          handleSetActiveSingleProperty({});
                          history.push('/buy');
                        }}
                      >
                        Buy
                      </span>
                    </>
                  )
                }
              </div>
            </div>
            <div className="dis-f a-c">
              {
                windowDimensions.width > 1024 && (
                  <BrixelButtonText
                    className=""
                    label="Support"
                    rounded
                    onClick={() => onTabClick('support')}
                  />
                )
              }
              {
                propID && windowDimensions.width > 1024 && userType === 'seller' && propID !== 'sell' && propID !== 'buy' && (
                  <>
                    <BrixelButtonText
                      className="hide dis-f-md ml-2 mr-2"
                      label="Upgrade"
                      theme="red"
                      rounded
                      onClick={() => onUpgrade()}
                    />
                  </>
                )
              }

              {
                windowDimensions.width > 1024 && (
                  <>
                    <div className="dis-f-md a-c cur-poi pos-r zIndex5" onClick={() => setShowProfileMenu(!showProfileMenu)} ref={profileMenu}>
                      <AccountDropdown />
                    </div>
                  </>
                )
              }
              { /* SECTION SIDEBAR MENU MOBILE */ }
              {
                windowDimensions.width <= 1024 && (
                  <div className="ml-2">
                    <button
                      type="button"
                      className="brixel-page-toggle pos-r zIndex2"
                      onClick={() => toggleMobileMenu()}
                    >
                      <span />
                      <span />
                      <span />
                    </button>
                    {
                      showMobileMenu && (
                        <div className="mobile-menu scaleUp bgWhite w-perc-100 h-perc-100 pos-a dis-fl-col a-c pt-small-12 zIndex3" style={{ height: windowDimensions.height }}>
                          <div className="px-2 dis-f jc-b a-c w-perc-100">
                            <img className="pos-r w-fix-80" src={logo} alt="Brixel Logo" id="logo" />
                            <BrixelButtonIcon
                              className="as-fe"
                              icon="close-small"
                              ghost
                              theme="dark"
                              onClick={() => toggleMobileMenu()}
                            />
                          </div>
                          <div className="px-2 links dis-fl-col as-b w-perc-100 h-perc-100 pb-2 ov-a">
                            <MenuSidebar />
                            <button
                              type="button"
                              onClick={() => setShowAccountMenu(true)}
                            >
                              Open Account Menu
                            </button>
                          </div>

                          <div className={`mini-menu dis-fl-col ${showAccountMenu ? 'activeMenu py-3 px-2' : ''}`}>
                            <span
                              className="cur-poi link txtDark700 fweight-500 fsize-300 mb-2"
                              onClick={() => {
                                onTabClick('support');
                              }}
                            >
                              Support
                            </span>

                            {
                              propID && userType === 'seller' && (
                                <div className="mb-2">
                                  <a
                                    onClick={(e) => {
                                      e.preventDefault();
                                      onUpgrade();
                                    }}
                                    className="cur-poi link txtRed400 fweight-500 fsize-300 ta-r"
                                  >
                                    Upgrade
                                  </a>
                                </div>
                              )
                            }
                            <div className="dis-f mb-2">
                              <BrixelSelect
                                options={langMenu}
                                input={{
                                  value: langSel,
                                  name: 'lang',
                                  onChange: (val) => newLang(val),
                                }}
                              />
                            </div>
                            <a
                              className="link txtDark700 fweight-500 fsize-300 mb-2"
                              href={`${baseByData().loginBasePath}/account/account?url=${get(window, 'location.href', '')}`}
                            >
                              Password
                            </a>
                            <a
                              className="link txtDark700 fweight-500 fsize-300 mb-2"
                              href={`${baseByData().loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`}
                            >
                              Preferences
                            </a>
                            <a
                              className="link txtDark700 fweight-500 fsize-300"
                              href={`${baseByData().loginBasePath}/logout?url=${get(window, 'location.href', '')}`}
                            >
                              Logout
                            </a>
                          </div>
                        </div>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
        </div>
        {
          windowDimensions.width <= 1024 && !history.location.pathname.includes('home') && !history.location.pathname.includes('/buyer/') && getCurrentRoute().title && (
            <div className="mobileTitle dis-f jc-b a-c px-2 py-1">
              {
                getCurrentRoute().title && (
                  <div className="header-section dis-fl-row a-c jc-b">
                    <h5 className="">{getCurrentRoute().title}</h5>
                  </div>
                )
              }
            </div>
          )
        }
      </header>
    </>
  );
}

PageHeaderDashboard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  changeZIndex: PropTypes.func,
  destroyForm: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.oneOfType([PropTypes.any]),
  loggedInUser: PropTypes.object,
  userType: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

PageHeaderDashboard.defaultProps = {
  changeZIndex: () => 1,
  lang: 'en',
  loggedInUser: {},
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  awards: get(state, 'user.awards', 0),
  brixelPoints: get(state, 'user.brixelPoints', 0),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  lang: get(state, 'common.language', []),
  languages: get(state, 'common.languages', []),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  userBrixelPoint: get(state, 'user.brixelPoints', []),
  userType: get(state, 'user.userTypes', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeaderDashboard));
