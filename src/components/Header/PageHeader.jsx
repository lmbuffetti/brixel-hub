/* global Transifex */
import {
  BrixelAvatar,
  BrixelButtonIcon,
  BrixelIcon,
  FactsOptions,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import {
  BrixelSelect,
  destroy,
} from '@brixel/brixel-components/dist/form';
import logoMobile from '@brixel/brixel-configuration-partner/src/images/logo_colors_icon_new.svg';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_colors_v2.svg';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  getPackageProperty,
  getPackagesProperty,
  setActiveSingleProperty,
  setActiveSinglePropertyActivePackage,
} from '../../actions/PropertyActions';
import { saveActiveSingleUser, setUserTypes } from '../../actions/UserActions';
import { sidebarNavigationBuyer, sidebarNavigationSeller } from '../../resources/navigationRoutes';
import { setCookie } from '../../utils/helpers';
import lazyWithRetry from '../LazyWithRetry';

const RightFlowHeader = lazyWithRetry(() => import('./RightHeaderFlow'));
const AccountDropdown = lazyWithRetry(() => import('../AccountDropdown'));
const MenuSidebar = lazyWithRetry(() => import('./MenuSidebar'));
const ProgressSellerStage = lazyWithRetry(() => import('../ProgressSellerStage'));

const { factsOptions } = FactsOptions;

function PageHeader(props) {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeCompanyPackages,
    activeSingleProperty,
    changeZIndex,
    handleSaveActiveSingleUser,
    handleSetActiveSingleProperty,
    handleSetActiveSinglePropertyActivePackage,
    handleSetUserTypes,
    isFlow,
    lang,
    loggedInUser,
    ownerProperties,
    packagesProperty,
    userType,
    windowDimensions,
  } = props;
  // STATE
  const [langMenu, setLangMenu] = useState([]);
  const [langSel, setSelLang] = useState(lang);
  const [openMenu, setOpenMenu] = useState(false);
  const [packageName, setPackageName] = useState('Basic');
  const [section, setSection] = useState('Sell');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProgressStage, setShowProgressStage] = useState(false);
  const [stepIndexProgrss, setIndexProgrss] = useState(0);
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;

  // REF
  const profileMenu = useRef(null);
  const menuHub = useRef(null);
  const currentPathName = get(history, 'location.pathname', '').split('/')[get(history, 'location.pathname', '').split('/').length - 1];

  // URL PARAMS
  let propID = history.location.pathname.split('/')[1];
  if (propID === 'buyer') propID = history.location.pathname.split('/')[2];
  if (propID === 'home' || propID === 'seller') propID = null;

  useEffect(() => {
    if (activeSingleProperty.id) {
      const defState = factsOptions.progressBarOptions.find((item) => item.value === get(activeSingleProperty, 'progress.state', ''));
      if (defState) {
        const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === activeSingleProperty.progress.state);
        if (defState.label === 'Sales Lead') defState.label = 'Onboarding';
        setIndexProgrss(defIndexState);
      }
      if (get(activeSingleProperty, 'sellerStatus', '') === 'success') setIndexProgrss(5);
    }
  }, [activeSingleProperty.id]);

  useEffect(() => {
    const activeSinglePropertyPackage = cloneDeep(packagesProperty);
    setPackageName('Basic');
    const basicPackage = activeCompanyPackages.find((pkg) => pkg.type === 'basic');
    handleSetActiveSinglePropertyActivePackage(basicPackage);
    if (activeSinglePropertyPackage.length > 0) {
      const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
      const getActivePackage = sortedPackage.find((pkg) => pkg.started);
      if (get(getActivePackage, 'servicePackage', null)) {
        handleSetActiveSinglePropertyActivePackage(getActivePackage.servicePackage);
        setPackageName(getActivePackage.servicePackage.name);
      } else if (get(sortedPackage[0], 'servicePackage', null)) {
        handleSetActiveSinglePropertyActivePackage(sortedPackage[0].servicePackage);
        setPackageName(sortedPackage[0].servicePackage.name);
      }
    }
  }, [packagesProperty.length]);

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

  // ON CHANGE PAGE
  useEffect(() => {
    setShowAccountMenu(false);
    if (
      windowDimensions.width > 1024 && (
        (
          !isFlow &&
        activeSingleProperty.id &&
        propID &&
        propID.length > 9 &&
        userType === 'seller'
        ) || (
          history.location.pathname.includes('welcomeSeller')
        )
      )
    ) {
      setShowProgressStage(true);
    } else {
      setShowProgressStage(false);
    }
  }, [get(history, 'location.pathname', null), isFlow, userType, propID, activeSingleProperty.id]);

  // SHOW/HIDE MOBILE MENU
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowAccountMenu(false);
    changeZIndex(!showMobileMenu ? 8 : 1);
    if (showMobileMenu) document.body.classList.remove('ov-h');
    else document.body.classList.add('ov-h');
  };

  // WHEN CLICK ON UPGRADE BUTTON
  const onUpgrade = () => {
    const propertyID = get(activeSingleProperty, 'id', get(activeSingleProperty, 'customID', ''));
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propertyID || 'company'}/upgrade`);
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
        if (showMobileMenu) {
          dashContentEl.classList.add('menuOn');
          dashContentEl.style.overflowY = 'hidden';
        } else {
          dashContentEl.style.overflowY = '';
          dashContentEl.classList.remove('menuOn');
        }
      });
    }
  }, [showMobileMenu]);

  useEffect(() => {
    if (userType === 'seller' || propID === 'sell') setSection('Sell');
    else setSection('Buy');
  }, [get(history, 'location', null), userType]);

  const urlBackAction = () => {
    if (get(history, 'location.pathname', '').includes('buyer')) {
      if (get(history, 'location.pathname', '').includes('docubox')) {
        history.push(`/buyer/${activeSingleProperty.id}/property`);
      } else if (currentPathName === getCurrentRoute().name) {
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

  const onClickMenu = (href) => {
    history.push(href);
    setOpenMenu(false);
    setShowMobileMenu(false);
  };

  useOutsideAlerter(menuHub, {
    action: 'function',
    func: () => {
      setOpenMenu(false);
    },
  });

  return (
    <>
      <header className={`bgOverlay hubDasHeader ${showMobileMenu ? 'menu-active' : ''} bgWhite`}>
        <div className="dasHeaderContainer">
          <div className="wrapperHeader pl-2 pl-lg-0 dis-f a-c pr-2 pr-lg-3 jc-b pos-r">
            {
              (windowDimensions.width > 1024 || get(history, 'location.pathname', '').includes('home') || !getCurrentRoute().name || isFlow) ? (
                <div
                  className={`header-section dis-fl-row a-c jc-b w-perc-100 w-perc-lg-80 ${showMobileMenu ? 'hide' : ''}`}
                >
                  <div
                    className={`dis-f a-c pl-0 pl-lg-3 logoWrapper ${isFlow ? '' : 'min-w-fix-lg-232'} w-fit min-w-fix-40 ${((!isFlow && activeSingleProperty.id && propID && propID.length > 9) || (propID === 'sell' || propID === 'buy') || showProgressStage) ? 'brdSmallRight brdAltGrey200' : ''} w-fit`}
                  >
                    <div className={`${isFlow ? '' : 'brdSmallRight brdAltGrey200'} min-w-88 w-perc-100 h-fix-72 dis-f a-c pr-2`}>
                      <img
                        onClick={() => {
                          handleSetUserTypes('seller');
                          handleSetActiveSingleProperty({});
                          history.push('/sell');
                        }}
                        className={`${windowDimensions.width <= 590 || (propID !== 'buy' && propID !== 'sell') ? 'max-w-fix-32' : ''} pos-r cur-poi`}
                        src={windowDimensions.width <= 590 || (propID !== 'buy' && propID !== 'sell') ? logoMobile : logo}
                        alt="Brixel Logo"
                        id="logo"
                      />
                    </div>
                    {
                      ((activeSingleProperty.id && propID && propID.length > 9) || (propID === 'sell' || propID === 'buy')) && !isFlow && (

                        <div className={`hubNavigation ${openMenu ? 'open' : 'close'}`} ref={menuHub}>
                          <div className="dis-f titleSection txtDark700" onClick={() => setOpenMenu(!openMenu)}>
                            <span>{section}</span>
                            <BrixelIcon
                              icon="dropdown"
                            />
                          </div>
                          {
                            openMenu && (
                              <div className="hubMenu">
                                <ul>
                                  <li onClick={() => onClickMenu('/sell')}>Sell</li>
                                  <li onClick={() => onClickMenu('/buy')}>Buy</li>
                                </ul>
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                  </div>
                  {
                    showProgressStage && (
                      <div className="quickNav mr-a dis-f fsize-300 fsize-sm-400 pl-2 pl-md-4">
                        <ProgressSellerStage
                          smallLayout={windowDimensions.width < 1025 ? !!isFlow : !isFlow}
                          xSmallMobile={windowDimensions.width < 480}
                          stepIndexProgress={history.location.pathname.includes('welcomeSeller') ? 0 : stepIndexProgrss}
                        />
                      </div>
                    )
                  }
                </div>
              ) : (
                <div>
                  <BrixelButtonIcon
                    className="dis-b hide-lg"
                    icon="arrow-left-small"
                    theme="dark"
                    ghost
                    onClick={() => urlBackAction()}
                  />
                </div>
              )
            }

            {
              isFlow ? (
                <RightFlowHeader />
              ) : (
                <div className="dis-f a-c">
                  {
                    (
                      propID !== 'buy' && propID !== 'sell' && !get(history, 'location.pathname', null).includes('buyer/')
                    ) && (
                      <div className="ws-nw flex-nowrap dis-f a-c txtDark700 pb-sm-1 pr-0 pr-sm-1 pr-lg-0 pb-lg-0 pr-lg-4">
                        <span className="hide dis-b-md">Your Plan:&nbsp;</span>
                        {
                          has(ownerProperties, 'total') || get(activeSingleProperty, 'id', null) ? (
                            <span
                              className="fweight-600 td-u-colored dis-f cur-poi"
                              onClick={() => onUpgrade()}
                            >
                              {packageName}
                            </span>
                          ) : (
                            <span
                              className="fweight-600 dis-f cur-poi txtLight400 bgLight400"
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
                          className={`dis-f-md a-c cur-poi pos-r ${propID !== 'sell' && propID !== 'buy' ? '' : ''} zIndex0`}
                          onClick={() => setShowProfileMenu(!showProfileMenu)}
                          ref={profileMenu}
                        >
                          <AccountDropdown />
                        </div>
                      </>
                    )
                  }
                  { /* SECTION SIDEBAR MENU MOBILE */}
                  {
                    windowDimensions.width <= 1024 && (
                      <div className="ml-1 ml-sm-2 h-fix-72 dis-f a-c">
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
                                <MenuSidebar
                                  onClickLink={() => setShowMobileMenu(false)}
                                />
                              )
                            }
                            {
                              propID !== 'sell' && propID !== 'buy' && (
                                <div className={`bottomMenu ${showMobileMenu ? 'bottomMenuOn' : ''}`}>
                                  <hr className="lighter" />
                                  <div
                                    className={`account-menu pb-2 dis-fl-col px-2 ${showAccountMenu ? 'opened' : 'closed'}`}
                                  >
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
              )
            }
          </div>
        </div>
      </header>
      {
        windowDimensions.width <= 1024 && !history.location.pathname.includes('home') && !history.location.pathname.includes('/buyer/') && getCurrentRoute().title && getCurrentRoute().title !== 'Prospects' && !history.location.pathname.includes('closing/') && !isFlow && (
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

PageHeader.propTypes = {
  activeCompanyPackages: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  changeZIndex: PropTypes.func,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetActiveSinglePropertyActivePackage: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  isFlow: PropTypes.bool,
  lang: PropTypes.oneOfType([PropTypes.any]),
  loggedInUser: PropTypes.object,
  ownerProperties: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  userType: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

PageHeader.defaultProps = {
  changeZIndex: () => 1,
  isFlow: false,
  lang: 'en',
  loggedInUser: {},
};

const mapStateToProps = (state) => ({
  activeCompanyPackages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  lang: get(state, 'common.language', []),
  languages: get(state, 'common.languages', []),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  ownerProperties: get(state, 'market.ownerProperties', {}),
  packagesProperty: get(state, 'property.activeSinglePropertyPackage', []),
  property: get(state, 'property.activeSingleProperty', {}),
  userType: get(state, 'user.userTypes', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleGetPackagesProperty: bindActionCreators(getPackagesProperty, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetActiveSinglePropertyActivePackage: bindActionCreators(setActiveSinglePropertyActivePackage, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
