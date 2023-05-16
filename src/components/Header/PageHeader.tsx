import {BrixelAvatar, BrixelButtonIcon, BrixelIcon, FactsOptions, useOutsideAlerter} from '@brixel/brixel-components';
import logoMobile from '@brixel/brixel-components/dist/configuration/images/logo_colors_icon_new.svg';
import logo from '@brixel/brixel-components/dist/configuration/images/logo_colors_v2.svg';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelSelect, destroy} from '@brixel/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {setLanguage} from '../../actions/CommonActions';
import {
  getPackageProperty,
  getPackagesProperty,
  setActiveSingleProperty,
  setActiveSinglePropertyActivePackage,
} from '../../actions/PropertyActions';
import {saveActiveSingleUser, setUserTypes} from '../../actions/UserActions';
import {sidebarNavigationBuyer, sidebarNavigationSeller} from '../../resources/Utilities/navigationRoutes';
import {setCookie} from '../../utils/helpers';
import translateTo from '../../utils/translation';
import lazyWithRetry from '../LazyWithRetry';
import type {LanguagesType, PageHeaderType} from '../../@types/components/Header/PageHeader';
import {OptionsType} from '@brixel/brixel-components/dist/@types/Form/Input';
import isEmpty from 'lodash/isEmpty';
import {ServicePackageType} from '@brixel/brixel-components/dist/@types/Model';

const RightFlowHeader = lazyWithRetry(() => import('./RightHeaderFlow'));
const AccountDropdown = lazyWithRetry(() => import('../AccountDropdown'));
const MenuSidebar = lazyWithRetry(() => import('./MenuSidebar'));
const ProgressSellerStage = lazyWithRetry(() => import('../ProgressSellerStage'));

const { factsOptions } = FactsOptions;

function PageHeader(props: PageHeaderType) {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeCompanyPackages,
    activeSingleProperty,
    changeZIndex = () => 1,
    handleSaveActiveSingleUser,
    handleSetActiveSingleProperty,
    handleSetActiveSinglePropertyActivePackage,
    handleSetLanguage,
    handleSetUserTypes,
    isFlow = false,
    lang = 'en',
    languages,
    loggedInUser = {},
    onClose,
    ownerProperties,
    packagesProperty,
    showFooter,
    userType,
    windowDimensions,
  } = props;
  // STATE
  const [langMenu, setLangMenu] = useState<OptionsType[]>([]);
  const [langSel, setSelLang] = useState(lang);
  const [openMenu, setOpenMenu] = useState(false);
  const [packageName, setPackageName] = useState('Basic');
  const [section, setSection] = useState(translateTo('Sell', lang));
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProgressStage, setShowProgressStage] = useState(false);
  const [stepIndexProgrss, setIndexProgrss] = useState(0);

  const isBuyer = history.location.pathname.includes('buyer');

  // REF
  const profileMenu = useRef(null);
  const menuHub = useRef(null);
  const currentPathName = get(history, 'location.pathname', '').split('/')[get(history, 'location.pathname', '').split('/').length - 1];

  // URL PARAMS
  let propID: string | null = history.location.pathname.split('/')[1];
  if (propID === 'buyer') propID = history.location.pathname.split('/')[2];
  if (propID === 'home' || propID === 'seller') propID = null;

  // FOOTER HEIGHT
  const footer = document.getElementsByClassName('footerWrap')[0] as HTMLDivElement;
  const footerHeight =  footer ? footer.offsetHeight : '';

  useEffect(() => {
    if (get(activeSingleProperty, 'id', null)) {
      const defState = factsOptions.progressBarOptions.find((item) => item.value === get(activeSingleProperty, 'progress.state', ''));
      if (defState) {
        const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === get(activeSingleProperty, 'progress.state', null));
        if (defState.label === 'Sales Lead') defState.label = 'Onboarding';
        setIndexProgrss(defIndexState);
      }
      if (get(activeSingleProperty, 'sellerStatus', null) === 'success') setIndexProgrss(5);
    }
  }, [get(activeSingleProperty, 'id', null)]);

  useEffect(() => {
    // TODO check servicePackageType error
    const activeSinglePropertyPackage: ServicePackageType[] = cloneDeep(packagesProperty);
    setPackageName('Basic');
    const basicPackage = activeCompanyPackages.find((pkg) => pkg.type === 'basic');
    handleSetActiveSinglePropertyActivePackage(basicPackage);
    if (activeSinglePropertyPackage.length > 0) {
      const sortedPackage: any = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
      const getActivePackage: any = sortedPackage.find((pkg) => pkg.started);
      if (getActivePackage && get(getActivePackage, 'servicePackage', null)) {
        handleSetActiveSinglePropertyActivePackage(getActivePackage.servicePackage);
        setPackageName(getActivePackage?.servicePackage?.name || '');
      } else if (get(sortedPackage[0], 'servicePackage', null)) {
        handleSetActiveSinglePropertyActivePackage(sortedPackage[0].servicePackage);
        setPackageName(sortedPackage[0]?.servicePackage?.name || '');
      }
    }
  }, [packagesProperty.length]);

  // GET LANGUAGE LISTS
  useEffect(() => {
    const langHeader: OptionsType[] = [];
    languages.map((lng: LanguagesType) => {
      langHeader.push({
        value: lng.code,
        shortLabel: lng.code,
        label: lng.name,
      })
      return null;
    });
    setLangMenu(langHeader);
  }, [languages]);

  // FUNCTION TO CHANGE  THE LANGUAGE
  const newLang = (langCode) => {
    // handleChangeLanguage(lang);
    const defLangCode = get(langCode, 'value', null) ? langCode.value : langCode;
    setSelLang(defLangCode);
    if (defLangCode) setCookie('brixelLang', defLangCode);
    handleSetLanguage(defLangCode);
    if (get(loggedInUser, 'id', null) && !isEmpty(defLangCode)) {
      const userData = {
        id: get(loggedInUser, 'id', null),
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
          get(activeSingleProperty, 'id', null) &&
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
  }, [get(history, 'location.pathname', null), isFlow, userType, propID, get(activeSingleProperty, 'id', null)]);

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
    return currentPath || {name: '', path: '', title: ''};
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
    const dashContentEl = document.getElementsByClassName('hubDasContent')[0] as HTMLDivElement;
    if (dashContentEl) {
      dashContentEl.addEventListener('scroll', () => {
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
    if (userType === 'seller' || propID === 'sell') setSection(translateTo('Sell', lang));
    else setSection(translateTo('Buy', lang));
  }, [get(history, 'location', null), userType]);

  const urlBackAction = () => {
    if (get(history, 'location.pathname', '').includes('buyer')) {
      if (get(history, 'location.pathname', '').includes('docubox')) {
        history.push(`/buyer/${get(activeSingleProperty, 'id', '')}/property`);
      } else if (currentPathName === getCurrentRoute().name) {
        history.push('/buy');
      } else if (get(history, 'location.pathname', '').includes('closing')) {
        history.push(`/buyer/${get(activeSingleProperty, 'id', '')}/property`);
      } else {
        history.push(`/buyer${getCurrentRoute().path.replace(':propID', get(activeSingleProperty, 'id', ''))}`);
      }
    } else if (currentPathName === getCurrentRoute().name) {
      history.push(`/${get(activeSingleProperty, 'id', '')}/home`);
    } else if (getCurrentRoute().path.includes(':propID')) {
      history.push(`${getCurrentRoute().path.replace(':propID', get(activeSingleProperty, 'id', ''))}`);
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
                    className={`dis-f a-c pl-0 pl-lg-3 logoWrapper ${isFlow ? '' : 'min-w-fix-lg-232'} w-fit min-w-fix-40 ${((!isFlow && get(activeSingleProperty, 'id', '') && propID && propID.length > 9) || (propID === 'sell' || propID === 'buy') || showProgressStage) ? 'brdSmallRight brdText100' : ''} w-fit`}
                  >
                    <div className={`${isFlow ? '' : 'brdSmallRight brdText100'} min-w-88 w-perc-100 h-fix-72 dis-f a-c pr-2`}>
                      <img
                        loading="lazy"
                        onClick={() => {
                          handleSetUserTypes('seller');
                          handleSetActiveSingleProperty({});
                          history.push(isBuyer ? '/buy' : '/sell');
                        }}
                        className={`${windowDimensions.width <= 590 || (propID !== 'buy' && propID !== 'sell') ? 'max-w-fix-32' : ''} pos-r cur-poi`}
                        src={windowDimensions.width <= 590 || (propID !== 'buy' && propID !== 'sell') ? logoMobile : logo}
                        alt="Brixel Logo"
                        id="logo"
                      />
                    </div>
                    {
                      ((get(activeSingleProperty, 'id', '') && propID && propID.length > 9) || (propID === 'sell' || propID === 'buy')) && !isFlow && (

                        <div className={`hubNavigation ${openMenu ? 'open' : 'close'}`} ref={menuHub}>
                          <div className="dis-f titleSection txtText900" onClick={() => setOpenMenu(!openMenu)}>
                            <span>{translateTo(section, lang)}</span>
                            <BrixelIcon
                              icon={openMenu ? 'dropdown-open' : 'dropdown-close'}
                            />
                          </div>
                          {
                            openMenu && (
                              <div className="hubMenu">
                                <ul>
                                  <li onClick={() => onClickMenu('/sell')}>
                                    {translateTo('Sell', lang)}
                                  </li>
                                  <li onClick={() => onClickMenu('/buy')}>
                                    {translateTo('Buy', lang)}
                                  </li>
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
                          smallLayout={windowDimensions.width < 1025 ? isFlow : !isFlow}
                          xSmallMobile={windowDimensions.width < 480}
                          stepIndexProgress={history.location.pathname.includes('welcomeSeller') ? 0 : stepIndexProgrss}
                          lang={lang}
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
                    theme="text"
                    bgTransparent
                    onClick={() => urlBackAction()}
                  />
                </div>
              )
            }
            {
              isFlow ? (
                <RightFlowHeader
                  onClose={onClose ? () => onClose() : undefined}
                  languages={langMenu}
                />
              ) : (
                <div className="dis-f a-c">
                  {
                    (
                      propID !== 'buy' && propID !== 'sell' && !get(history, 'location.pathname', '').includes('buyer/')
                    ) && (
                      <div className="ws-nw flex-nowrap dis-f a-c txtText900 pb-sm-1 pr-0 pr-sm-1 pr-lg-0 pb-lg-0 pr-lg-4">
                        <span className="hide dis-b-md">
                          {translateTo('Your Plan:', lang)}
                        </span>
                        {
                          has(ownerProperties, 'total') || get(activeSingleProperty, 'id', null) ? (
                            <span
                              className="fweight-600 td-u-colored dis-f cur-poi"
                              onClick={() => onUpgrade()}
                            >
                              {translateTo(packageName, lang)}
                            </span>
                          ) : (
                            <span
                              className="fweight-600 dis-f cur-poi txtText200 bgText200"
                            >
                              {translateTo('Loading...', lang)}
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
                                        avatarImg={get(loggedInUser, 'avatarUrl', undefined)}
                                        name={get(loggedInUser, 'email')}
                                        isIcon
                                        profileId={get(loggedInUser, 'id', '')}
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
                          style={{ height: showMobileMenu ? (showFooter ? windowDimensions.height - +footerHeight : windowDimensions.height ) : '0px' }}
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
                                      className="link txtText900 fweight-500 fsize-300 mb-2"
                                      href={`${baseByData?.loginBasePath}/account/account?url=${get(window, 'location.href', '')}`}
                                    >
                                      {translateTo('Password', lang)}
                                    </a>
                                    <a
                                      className="link txtText900 fweight-500 fsize-300 mb-2"
                                      href={`${baseByData?.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`}
                                    >
                                      {translateTo('Preferences', lang)}
                                    </a>
                                    <a
                                      className="link txtText900 fweight-500 fsize-300"
                                      href={`${baseByData?.loginBasePath}/logout?url=${get(window, 'location.href', '')}`}
                                    >
                                      {translateTo('Logout', lang)}
                                    </a>
                                  </div>
                                </>
                              )
                            }
                            {
                              get(activeSingleProperty, 'id', '') && (
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
                                            <div className="ws-nw flex-nowrap dis-f a-c txtText900">
                                              <span>{translateTo('Your Plan:', lang)}</span>
                                              <span
                                                className="fweight-600 td-u-colored dis-f cur-poi"
                                                onClick={() => onUpgrade()}
                                              >
                                                {translateTo(packageName, lang)}
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
                                            avatarImg={get(loggedInUser, 'avatarUrl', undefined)}
                                            name={get(loggedInUser, 'email')}
                                            isIcon
                                            profileId={get(loggedInUser, 'id', '')}
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
                                        className="link txtText900 fweight-500 fsize-300 mb-2"
                                        href={`${baseByData?.loginBasePath}/account/account?url=${get(window, 'location.href', '')}`}
                                      >
                                        {translateTo('Password', lang)}
                                      </a>
                                      <a
                                        className="link txtText900 fweight-500 fsize-300 mb-2"
                                        href={`${baseByData?.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`}
                                      >
                                        {translateTo('Preferences', lang)}
                                      </a>
                                      <a
                                        className="link txtText900 fweight-500 fsize-300"
                                        href={`${baseByData?.loginBasePath}/logout?url=${get(window, 'location.href', '')}`}
                                      >
                                        {translateTo('Logout', lang)}
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
                    {translateTo(getCurrentRoute().title, lang)}
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

const mapStateToProps = (state) => ({
  activeCompanyPackages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  lang: get(state, 'common.language', 'en'),
  languages: get(state, 'common.languages', []),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
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
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
