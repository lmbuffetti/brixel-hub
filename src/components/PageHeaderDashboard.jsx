/* global Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import {
  BrixelAvatar,
  BrixelIcon,
  destroy,
  BrixelSelect, BrixelButtonIcon,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_colors_v2.svg';
import logoMobile from '@brixel/brixel-configuration-partner/src/images/logo_colors_icon_new.svg';
import orderBy from 'lodash/orderBy';
import useOutsideAlerter from './OutsideElement';
import { setCookie } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';
import MenuNavigationSubmenu from './MenuNavigationSubmenu';
import {
  sidebarNavigationBuyer,
  sidebarNavigationSeller,
} from '../resources/navigationRoutes';
import { saveActiveSingleUser, setUserTypes } from '../actions/UserActions';
import { getPackageProperty, setActiveSingleProperty, getPackagesProperty } from '../actions/PropertyActions';
import AccountDropdown from './AccountDropdown';
import MenuSidebar from './MenuSidebar';

function PageHeaderDashboard(props) {
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    changeZIndex,
    destroyForm,
    formValue,
    handleGetPackagesProperty,
    handleSaveActiveSingleUser,
    handleSetActiveSingleProperty,
    handleSetLanguage,
    handleSetUserTypes,
    history,
    lang,
    loggedInUser,
    ownerProperties,
    packagesProperty,
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
  const [packageName, setPackageName] = useState('Basic');
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  // REF
  const profileMenu = useRef(null);
  const currentPathName = get(history, 'location.pathname', '').split('/')[get(history, 'location.pathname', '').split('/').length - 1];

  // URL PARAMS
  let propID = history.location.pathname.split('/')[1];
  if (propID === 'buyer') propID = history.location.pathname.split('/')[3];
  if (propID === 'home' || propID === 'seller') propID = null;

  // ON CHANGE HISTORY THE MOBILE MENU IS CLOSED
  useEffect(() => {
    setShowMobileMenu(false);
  }, [history]);

  useEffect(() => {
    if (activeSingleCompany.id) {
      handleGetPackagesProperty({ id: activeSingleCompany.id, smallLoader: 'loadPackages' });
    }
  }, [activeSingleCompany]);

  useEffect(() => {
    let activeSinglePropertyPackage = get(activeSingleProperty, 'servicePackages', []);
    if (activeSingleProperty.customID && ownerProperties.data) {
      const prop = ownerProperties.data.find((page) => page.id === activeSingleProperty.customID);
      if (prop) activeSinglePropertyPackage = get(prop, 'servicePackages', []);
    }
    if (activeSinglePropertyPackage && packagesProperty.length > 0) {
      activeSinglePropertyPackage.forEach((pkg, i) => {
        const filtSortPackage = packagesProperty.find((item) => pkg.id === item.id);
        activeSinglePropertyPackage[i].price = filtSortPackage.price;
      });
      const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
      const activePackage = activeSinglePropertyPackage.find((item) => item.started);
      if (activePackage) {
        const filtPackages = packagesProperty.find((item) => activePackage.id === item.id);
        if (filtPackages) setPackageName(filtPackages.name);
        else setPackageName('Basic');
      } else if (sortedPackage[0]) {
        const filtPackage = packagesProperty.find((item) => sortedPackage[0].id === item.id);
        setPackageName(filtPackage.name);
      } else {
        setPackageName('Basic');
      }
    }
  }, [activeSingleProperty.id, activeSingleProperty.customID, ownerProperties, packagesProperty, activeSingleCompany.id]);

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
    if (showMobileMenu) document.body.classList.remove('ov-h');
    else document.body.classList.add('ov-h');
  };

  useEffect(() => {
    setShowMobileMenu(false);
    setShowAccountMenu(false);
  }, [get(history, 'location.pathname', null)]);

  // WHEN CLICK ON UPGRADE BUTTON
  const onUpgrade = () => {
    const propertyID = get(activeSingleProperty, 'id', get(activeSingleProperty, 'customID', ''));
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propertyID}/upgrade`);
  };

  // FUNCTION TO GET CURRENT URL LOCATION
  const getCurrentRoute = () => {
    const path = history.location.pathname;
    const currentPath = sidebarNavigationSeller.concat(sidebarNavigationBuyer).find((item) => path.includes(item.name) && item.name !== 'Prospects');
    return currentPath || {};
  };

  useEffect(() => {
    // this changes the scrolling behavior to "smooth"
    const dashContentEl = document.getElementsByClassName('hubDasContent')[0];
    if (dashContentEl) {
      dashContentEl.scrollTop = 0;
    }
  }, [history.location]);

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

  const urlBackAction = () => {
    if (get(history, 'location.pathname', '').includes('buyer')) {
      if (currentPathName === getCurrentRoute().name) {
        history.push('/buy');
      } else if (get(history, 'location.pathname', '').includes('closing')) {
        history.push(`/buyer/${activeSingleProperty.id}/property`);
      } else {
        history.push(`/buyer${getCurrentRoute().path.replace(':propID', activeSingleProperty.id)}`);
      }
    } else if (currentPathName === getCurrentRoute().name) {
      history.push(`/${activeSingleProperty.id}/home`);
    } else if (getCurrentRoute().path.includes(':propID')) {
      history.push(`${getCurrentRoute().path.replace(':propID', activeSingleProperty.id)}`);
    }
  };

  return (
    <>
      <MenuNavigationSubmenu
        windowDimensions={windowDimensions}
        activeMenu={activeMenu}
        onClose={() => setActiveMenu(null)}
      />
      <header className={`hubDasHeader ${showMobileMenu ? 'menu-active' : ''}`}>
        <div className="dasHeaderContainer">
          <div className="wrapperHeader pl-2 pl-lg-0 dis-f a-c h-fix-72 pr-2 pr-lg-3 jc-b pos-r">
            {
              windowDimensions.width > 1024 || get(history, 'location.pathname', '').includes('home') || !getCurrentRoute().name ? (
                <div className={`header-section dis-fl-row a-c jc-b w-perc-100 w-perc-lg-80 ${showMobileMenu ? 'hide' : ''}`}>
                  <div className="dis-f a-c pl-0 pl-lg-5 logoWrapper max-w-fix-64 max-w-fix-sm-120 max-w-fix-lg-256  min-w-fix-40 w-perc-sm-100">
                    {
                      windowDimensions.width <= 590 ? (
                        <img
                          onClick={() => {
                            handleSetUserTypes('seller');
                            handleSetActiveSingleProperty({});
                            history.push('/sell');
                          }}
                          className="pos-r max-w-fix-32 cur-poi"
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
                  <div className="quickNav mr-a dis-f fsize-300 fsize-sm-400 pl-lg-4">
                    {
                      activeSingleProperty.id && propID && propID !== 'home' && propID !== 'buyer' && propID !== 'seller' && propID !== 'buy' && propID !== 'sell' ? (
                        <>
                          <span
                            className="cur-poi"
                            onClick={() => history.push(linkSection)}
                          >
                            {section}
                          </span>
                          {
                            windowDimensions.width > 1024 && (
                              <>
                                <span className="px-1"> &gt; </span>
                                <span className="propertyTitle txtDark700">{get(formValue, 'title', '')}</span>
                              </>
                            )
                          }
                        </>
                      ) : (
                        <>
                          <span
                            className={`pr-1 pr-sm-3 cur-poi ${history.location.pathname.includes('/sell') ? 'fweight-600 txtDark600' : ''}`}
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
              ) : (
                <div>
                  <BrixelButtonIcon
                    className="dis-b hide-md"
                    icon="arrow-left-small"
                    theme="dark"
                    ghost
                    onClick={() => urlBackAction()}
                  />
                </div>
              )
            }
            <div className="dis-f a-c">
              {
                (
                  propID !== 'buy'
                ) && (
                  <div className="ws-nw flex-nowrap dis-f a-c txtDark700 pb-sm-1 pr-0 pr-sm-1 pr-lg-0 pb-lg-0 pr-lg-4">
                    <span className="hide dis-b-md">Your Plan:&nbsp;</span>
                    {
                      (activeSingleProperty.id || activeSingleProperty.customID) && activeSingleProperty.id !== 0 && activeSingleProperty.customID !== 0 ? (
                        <span
                          className="fweight-600 td-u-colored dis-f cur-poi"
                        >
                          {packageName}
                        </span>
                      ) : (
                        <span
                          className="fweight-600 dis-f cur-poi txtLight400 bgLight400"
                          onClick={() => onUpgrade()}
                        >
                          Loading...
                        </span>
                      )
                    }
                  </div>
                )
              }

              {
                windowDimensions.width > 1024 && (
                  <>
                    <div
                      className={`dis-f-md a-c cur-poi pos-r zIndex5 ${propID !== 'sell' && propID !== 'buy' ? '' : ''}`}
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      ref={profileMenu}
                    >
                      <AccountDropdown />
                    </div>
                  </>
                )
              }
              { /* SECTION SIDEBAR MENU MOBILE */ }
              {
                windowDimensions.width <= 1024 && (
                  <div className="ml-1 ml-sm-2">
                    {
                      (propID === 'sell' || propID === 'buy') ? (
                        <>
                          {
                            showMobileMenu ? (
                              <>
                                <button
                                  type="button"
                                  className="brixel-page-toggle pos-r zIndex5"
                                  onClick={() => toggleMobileMenu()}
                                >
                                  <span />
                                  <span />
                                  <span />
                                </button>
                              </>
                            ) : (
                              <div className="dis-f">
                                <button
                                  className="w-fix-32 h-fix-32"
                                  type="button"
                                  onClick={() => toggleMobileMenu()}
                                >
                                  <BrixelAvatar
                                    avatarImg={get(loggedInUser, 'user.avatar[0]', '') ? baseByData.shortPath + get(loggedInUser, 'user.avatar[0]', '').thumbnailPath : null}
                                    name={get(loggedInUser, 'user.email')}
                                    isIcon
                                    profileId={get(loggedInUser, 'user.id', '')}
                                  />
                                </button>
                              </div>
                            )
                          }
                        </>
                      ) : (
                        <button
                          type="button"
                          className="brixel-page-toggle pos-r zIndex5"
                          onClick={() => toggleMobileMenu()}
                        >
                          <span />
                          <span />
                          <span />
                        </button>
                      )
                    }

                    <div
                      className="mobile-menu w-perc-100 dis-fl-col a-c zIndex3"
                      style={{ height: showMobileMenu ? windowDimensions.height : '0px' }}
                    >
                      <div className="links dis-fl-col as-b jc-fe w-perc-100 ov-a">
                        {
                          (propID === 'sell' || propID === 'buy') && (
                            <>
                              <hr className="lighter mt-9" />
                              <div className="mini-menu whiteBg dis-fl-col px-3 pt-3">
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
                                  href={`${baseByData.loginBasePath}/account/account?url=${get(window, 'location.href', '')}`}
                                >
                                  Password
                                </a>
                                <a
                                  className="link txtDark700 fweight-500 fsize-300 mb-2"
                                  href={`${baseByData.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`}
                                >
                                  Preferences
                                </a>
                                <a
                                  className="link txtDark700 fweight-500 fsize-300"
                                  href={`${baseByData.loginBasePath}/logout?url=${get(window, 'location.href', '')}`}
                                >
                                  Logout
                                </a>
                              </div>
                            </>
                          )
                        }
                        {
                          activeSingleProperty.id && (
                            <MenuSidebar />
                          )
                        }
                        {
                          propID !== 'sell' && propID !== 'buy' && (
                            <div className={`bottomMenu ${showMobileMenu ? 'bottomMenuOn' : ''}`}>
                              <hr className="lighter" />
                              <div className={`account-menu pb-2 dis-fl-col px-2 ${showAccountMenu ? 'opened' : 'closed'}`}>
                                <div className={`dis-f a-c py-1 ${userType === 'seller' ? 'jc-b' : 'jc-fe'}  w-perc-100`}>
                                  {
                                    propID && userType === 'seller' && (
                                      <div>
                                        <div className="ws-nw flex-nowrap dis-f a-c txtDark700">
                                          <span>Your Plan:&nbsp;</span>
                                          <span
                                            className="fweight-600 td-u-colored dis-f cur-poi"
                                            onClick={() => onUpgrade()}
                                          >
                                            {packageName}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  }
                                  <button
                                    type="button"
                                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                                    className="dis-f w-fit a-c jc-b zIndex10 pos-r p-1 px-2"
                                  >
                                    <div className="dis-f w-perc-100 a-c">
                                      <BrixelAvatar
                                        avatarImg={get(loggedInUser, 'user.avatar[0]', '') ? baseByData.shortPath + get(loggedInUser, 'user.avatar[0]', '').thumbnailPath : null}
                                        name={get(loggedInUser, 'user.email')}
                                        isIcon
                                        profileId={get(loggedInUser, 'user.id', '')}
                                      />
                                      <BrixelIcon
                                        className="ml-1"
                                        icon={showAccountMenu ? 'arrow-simple-up' : 'arrow-simple-down'}
                                      />
                                    </div>
                                  </button>
                                </div>
                                <div className="mini-menu dis-fl-col">
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
                                    href={`${baseByData.loginBasePath}/account/account?url=${get(window, 'location.href', '')}`}
                                  >
                                    Password
                                  </a>
                                  <a
                                    className="link txtDark700 fweight-500 fsize-300 mb-2"
                                    href={`${baseByData.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`}
                                  >
                                    Preferences
                                  </a>
                                  <a
                                    className="link txtDark700 fweight-500 fsize-300"
                                    href={`${baseByData.loginBasePath}/logout?url=${get(window, 'location.href', '')}`}
                                  >
                                    Logout
                                  </a>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      </div>

                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </header>
      {
        windowDimensions.width <= 1024 && !history.location.pathname.includes('home') && !history.location.pathname.includes('/buyer/') && getCurrentRoute().title && getCurrentRoute().title !== 'Prospects' && !history.location.pathname.includes('closing/') && (
          <div className="mobileTitle dis-f jc-b a-c px-2 py-1">
            {
              getCurrentRoute().title && (
                <div className="dis-fl-row a-c jc-b">
                  <h4 className="fweight-700 pt-2">
                    {getCurrentRoute().title}
                  </h4>
                </div>
              )
            }
          </div>
        )
      }
    </>
  );
}

PageHeaderDashboard.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeZIndex: PropTypes.func,
  destroyForm: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetPackagesProperty: PropTypes.func.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.oneOfType([PropTypes.any]),
  loggedInUser: PropTypes.object,
  ownerProperties: PropTypes.object.isRequired,
  userType: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

PageHeaderDashboard.defaultProps = {
  changeZIndex: () => 1,
  lang: 'en',
  loggedInUser: {},
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
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
  ownerProperties: get(state, 'market.ownerProperties', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  packagesProperty: get(state, 'property.packagesProperty', []),
  userType: get(state, 'user.userTypes', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleGetPackagesProperty: bindActionCreators(getPackagesProperty, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeaderDashboard));
