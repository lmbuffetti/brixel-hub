import React, {useEffect, useRef, useState} from 'react';
import {
  BrixelButtonSecondary,
  FactsOptions,
  useOutsideAlerter,
} from '@brixel-io/brixel-components';
import logoMobile from '@brixel-io/brixel-components/dist/configuration/images/logo_colors_icon_new.svg';
import logo from '@brixel-io/brixel-components/dist/configuration/images/logo_colors_v2.svg';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import {BrixelSelect, destroy} from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import {connect} from 'react-redux';
import {Link, useLocation, useNavigate} from 'react-router-dom';
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
import {OptionsType} from '@brixel-io/brixel-components/dist/@types/Form/Input';
import isEmpty from 'lodash/isEmpty';
import {ServicePackageType} from '@brixel-io/brixel-components/dist/@types/Model';

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
    handleSaveActiveSingleUser,
    handleSetActiveSinglePropertyActivePackage,
    handleSetLanguage,
    isFlow = false,
    isSecondLevelClass = false,
    lang = 'en',
    languages,
    loggedInUser = {},
    onClose,
    ownerProperties,
    packagesProperty,
    userType,
    windowDimensions,
  } = props;
  // STATE
  const [langMenu, setLangMenu] = useState<OptionsType[]>([]);
  // const [openMenu, setOpenMenu] = useState(false);
  // const [langSel, setSelLang] = useState(lang);
  const [packageName, setPackageName] = useState('Basic');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProgressStage, setShowProgressStage] = useState(false);
  const [stepIndexProgrss, setIndexProgrss] = useState(0);

  const isBuyer = history.location.pathname.includes('buyer');

  // REF
  const profileMenu = useRef(null);

  // URL PARAMS
  let propID: string | null = history.location.pathname.split('/')[1];
  if (propID === 'buyer') propID = history.location.pathname.split('/')[2];
  if (propID === 'home' || propID === 'seller') propID = null;

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
    languages.forEach((lng: LanguagesType) => {
      langHeader.push({
        value: lng.code,
        shortLabel: lng.code,
        label: lng.name,
      })
    });
    setLangMenu(langHeader);
  }, [languages]);

  // FUNCTION TO CHANGE  THE LANGUAGE
  const newLang = (langCode) => {
    const defLangCode = get(langCode, 'value', null) ? langCode.value : langCode;
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
    setShowMobileMenu(false);
  }, [get(history, 'location.pathname', null), isFlow, userType, propID, get(activeSingleProperty, 'id', null), windowDimensions?.width]);

  // SHOW/HIDE MOBILE MENU
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
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

  return (
    <>
      <header className={`bgOverlay hubDasHeader ${showMobileMenu ? 'menu-active' : ''} bgWhite`}>
        <div className="dasHeaderContainer">
          <div className="wrapperHeader pl-2 pl-lg-0 dis-f a-c pr-2 pr-lg-3 jc-b pos-r w-perc-100">
            <div
              className={'header-section dis-fl-row a-c jc-b'}
            >
              <div
                className={`dis-f a-c pl-0 pl-lg-3 logoWrapper w-fit min-w-fix-40 ${(propID === 'sell' || propID === 'buy' || isFlow || isBuyer || windowDimensions.width <= 590) ? '' : 'brdSmallRight brdText100 w-fix-md-232'} w-fit`}
              >
                <div className="min-w-88 w-perc-100 h-fix-72 dis-f a-c pr-2">
                  <img
                    loading="lazy"
                    className={`${windowDimensions.width <= 590 ? 'max-w-fix-32' : ''} pos-r cur-poi`}
                    src={windowDimensions.width <= 590 ? logoMobile : logo}
                    alt="Brixel Logo"
                    id="logo"
                  />
                </div>
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
              {
                !showMobileMenu && windowDimensions.width <= 1024 && propID !== 'buy' && propID !== 'sell' && !isFlow && (
                  <BrixelButtonSecondary
                    className="ml-2 delayFadeIn"
                    label={isBuyer ? 'Back to buy' : 'Back to sell'}
                    leftIcon="arrow-simple-left"
                    onClick={() => history.push(isBuyer ? '/buy' : '/sell')}
                    rounded
                    theme="text"
                    themeSat={900}
                  />
                )
              }
            </div>
            {
              ((propID === 'buy' || propID === 'sell') && !showMobileMenu) && (
                <div className="hubMenu delayFadeIn">
                  <nav>
                    <ul>
                      <li className={`${propID === 'sell' ? 'active' : ''} tt-up`}>
                        <Link to="/sell">
                          {translateTo('Sell', lang)}
                        </Link>
                      </li>
                      <li className={`${propID === 'buy' ? 'active' : ''} tt-up`}>
                        <Link to="/buy">
                          {translateTo('Buy', lang)}
                        </Link>
                      </li>
                    </ul>
                  </nav>
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
                    (propID !== 'buy' && propID !== 'sell' && !get(history, 'location.pathname', '').includes('buyer/')) && (
                      <>
                        {
                          windowDimensions.width > 1024 && (
                            <div className="ws-nw flex-nowrap a-c txtText900 pb-sm-1 pr-0 pr-sm-1 pr-lg-0 pb-lg-0 pr-lg-4 dis-f">
                              <span className="">
                                {translateTo('Your Plan:', lang)}
                              </span>
                              {
                                has(ownerProperties, 'total') || get(activeSingleProperty, 'id', null) ? (
                                  <span
                                    className="fweight-600 td-u dis-f cur-poi ml-1"
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
                      </>
                    )
                  }

                  {
                    windowDimensions.width > 1024 && (
                      <>
                        <div
                          className="dis-f-md a-c cur-poi pos-r zIndex0"
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
                          style={{ height: showMobileMenu ? windowDimensions.height - 72 : '0px' }}
                        >
                          <div className="links dis-fl-col as-b jc-fe w-perc-100 ov-a">
                            <hr className="lighter" />
                            <div className="mini-menu whiteBg dis-fl-col px-3 px-lg-0">
                              {
                                (propID === 'sell' || propID === 'buy') ? (
                                  <div className="dis-fl-col a-t pos-r p-3">
                                    <a
                                      className={`${propID === 'sell' ? 'txtText900' : 'txtText200'} link fweight-600 fsize-600 mb-2`}
                                      href={`${baseByData?.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`}
                                    >
                                      {translateTo('Sell', lang)}
                                    </a>
                                    <a
                                      className={`${propID === 'buy' ? 'txtText900' : 'txtText200'} link fweight-600 fsize-600`}
                                      href={`${baseByData?.loginBasePath}/logout?url=${get(window, 'location.href', '')}`}
                                    >
                                      {translateTo('Buy', lang)}
                                    </a>
                                  </div>
                                ) : (
                                  <MenuSidebar
                                    activePackageName={propID && userType === 'seller' ? translateTo(packageName, lang) : undefined}
                                    isBuyer={isBuyer}
                                  />
                                )
                              }
                              <hr className='lighter' />
                              {
                                propID && !isBuyer && (
                                  <div>
                                    <div className="px-3 py-4 ws-nw flex-nowrap dis-f a-c txtText900">
                                      <span>{translateTo('Your Plan:', lang)}</span>
                                      <span
                                        className="fweight-400 td-u txtGreen400 dis-f cur-poi ml-1"
                                        onClick={() => onUpgrade()}
                                      >
                                        {translateTo(packageName, lang)}
                                      </span>
                                    </div>
                                    <hr className='lighter' />
                                  </div>
                                )
                              }

                              <div className="pt-3 px-3 pos-r">
                                <div className="dis-f mb-2">
                                  <BrixelSelect
                                    options={langMenu}
                                    input={{
                                      value: lang,
                                      name: 'lang',
                                      onChange: (val) => newLang(val),
                                    }}
                                  />
                                </div>

                                <div className="dis-fl-col a-t pos-r">
                                  <a
                                    className="link txtText900 fweight-400 fsize-400 mb-2"
                                    href={`${baseByData?.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}`}
                                  >
                                    {translateTo('Your account', lang)}
                                  </a>
                                  <a
                                    className="link txtRed400 fweight-400 fsize-400"
                                    href={`${baseByData?.loginBasePath}/logout?url=${get(window, 'location.href', '')}`}
                                  >
                                    {translateTo('Logout', lang)}
                                  </a>
                                </div>
                              </div>
                            </div>
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
        windowDimensions.width <= 1024 && !history.location.pathname.includes('home') && !history.location.pathname.includes('/buyer/') && getCurrentRoute().title && getCurrentRoute().title !== 'Prospects' && !history.location.pathname.includes('closing/') && !isFlow && !isSecondLevelClass && (
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
