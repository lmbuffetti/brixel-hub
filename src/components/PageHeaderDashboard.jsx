/* global Transifex */
/* eslint-disable react-hooks/exhaustive-deps */
/* global Transifex */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelButtonIcon,
  BrixelTabs,
  destroy,
  BrixelSelect,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_full_v2.svg';
import useOutsideAlerter from './OutsideElement';
import { setCookie, sortObject } from '../utils/helpers';
import { setLanguage, setModal } from '../actions/CommonActions';
import { getGameHistory } from '../actions/GamificationActions';
import MenuNavigationSubmenu from './MenuNavigationSubmenu';
import {
  firstRoutes,
  firstRoutesBuyer,
  secondRoutes,
  secondRoutesBuyer,
} from '../resources/navigationRoutes';
import { saveActiveSingleUser, setUserTypes } from '../actions/UserActions';
import { setActiveSingleProperty, getActiveSinglePropertyDealsCount, setActiveSinglePropertyDealsCount } from '../actions/PropertyActions';
// import brixels from '../images/BrxielComingTown/brixels.svg';
import CoverPropertyImage from './CoverPropertyImage';
import AccountDropdown from './AccountDropdown';

function PageHeaderDashboard(props) {
  // PROPS
  const {
    handleSetUserTypes,
    handleSetActiveSingleProperty,
    destroyForm,
    activeSingleProperty,
    // awards,
    // brixelPoints,
    changeZIndex,
    formValue,
    gameGroup,
    gameHistory,
    // handleGetGame,
    handleSetLanguage,
    // handleSetModal,
    handleSaveActiveSingleUser,
    history,
    lang,
    loggedInUser,
    userType,
    windowDimensions,
    getPropertyDealsCount,
    setDealsCount,
    activeSinglePropertyDealsCount,
  } = props;
  // STATE
  // const [currentLang, setCurrentLang] = useState(lang);
  // const [dropLang, setDropLang] = useState([]);
  const [routeNav, setRouteNav] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [langMenu, setLangMenu] = useState([]);
  const [langSel, setSelLang] = useState(lang);
  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  // REF
  const profileMenu = useRef(null);
  const proTitleRef = useRef(null);

  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];

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
        smallLoader: true,
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
      // if (!gameHistory.data) handleGetGame();
    }
  }, [loggedInUser]);

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

  // FUNCTION TO LOAD THE GAME GROUP AND THE GAME HISTORY AND CALC THE NUMBER OF SECTION (number iside red circle)
  // FUNCTION TO CALC THE NUMBER OF NEW DEALS IN ORDER TO HIGHLIGHT DEALS TAB
  useEffect(() => {
    if (gameGroup && gameHistory && userType === 'seller') {
      getPropertyDealsCount(activeSingleProperty.id);
      // let numDone = 0;
      let numTodo = 0;
      let newSellerCount = 0;
      const usrGroups = gameGroup.sort(sortObject('stub', 'asc'));
      usrGroups.forEach((groups) => {
        if (groups.stub.includes(userType)) {
          groups.achievements.forEach((group) => {
            if (gameHistory.data) {
              const selElTodo = gameHistory.data.find((game) => game.achievement.stub === group.stub && game.page === propID);
              if (typeof selElTodo === 'undefined') {
                numTodo += 1;
              } else {
                // numDone += 1;
              }
            }
          });
        }
      });
      if (
        get(formValue, 'location.countryCode', 'CH') !== 'CH' &&
        get(formValue, 'location.countryCode', 'CH') !== 'PT'
      ) numTodo -= 2;
      const nav = cloneDeep(firstRoutes);
      if (Object.keys(activeSinglePropertyDealsCount).length > 0) {
        Object.keys(activeSinglePropertyDealsCount).forEach((label) => {
          newSellerCount += activeSinglePropertyDealsCount[label].new;
        });
        if (numTodo > 0) nav[0].title += `<span class="numRecords notranslate txtWhite">${numTodo}</span>`;
        if (newSellerCount > 0) nav[3].title += `<span class="numRecords notranslate txtWhite">${newSellerCount}</span>`;
        setRouteNav([...nav]);
      } else {
        if (numTodo > 0) nav[0].title += `<span class="numRecords notranslate txtWhite">${numTodo}</span>`;
        setRouteNav([...nav]);
      }
    }
  }, [gameGroup, gameHistory, activeSingleProperty, userType, Object.keys(activeSinglePropertyDealsCount).length > 0]);

  // SHOW DETAILS WHEN CLICK ON BRIXELS POINTS
  /* const brixelsAchievementDetail = () => {
    handleSetModal({
      showAwardsInfo: true,
    });
  };

  // FUNCTION TO MANAGE CLICK ON MOBILE MENU
  const onClickMobileMenu = (link) => {
    setShowMobileMenu(false);
    setActiveMenu(link);
    changeZIndex(1);
    document.body.classList.remove('ov-h');
  }; */

  // SHOW/HIDE MOBILE MENU
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    changeZIndex(!showMobileMenu ? 8 : 1);
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
        if (dashContentEl.scrollTop > 0) {
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
  }, []);

  // FUNCTION TO CALC IF TITLE IS LONG OR NOT AND ASSIGN THE DIFFERENT CLASS
  /* useEffect(() => {
    if (proTitleEl) {
      const titleHeight = proTitleEl.offsetHeight;
      if (titleHeight > 42) {
        proTitleEl.classList.add('longTitle');
      }
    }
  }); */

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

  // FUNCTION TO GO TO SELLERS/BUYERS PROPERTIES
  const onBackProperties = () => {
    handleSetActiveSingleProperty({});
    setDealsCount({});
    if (userType === 'seller') history.push('/seller/pageLists');
    else history.push('/buyer/propertyLists');
  };

  // CHECK TAB BY URL
  const checkActiveTab = () => {
    let curTab = '';
    if (history) {
      if (history.location.pathname.includes('rewards')) curTab = 'rewards';
      else if (history.location.pathname.includes('property')) curTab = 'property';
      else if (history.location.pathname.includes('listings')) curTab = 'listings';
      else if (history.location.pathname.includes('deals')) curTab = 'deals';
    }
    return curTab;
  };

  // LABEL ICONS FOR THE MENU TAB
  const labelIcons = () => {
    if (windowDimensions.width <= 1024) {
      if (has(activeSingleProperty, 'id')) return routeNav.map((item) => item.icon);
    }
    return [];
  };

  return (
    <>
      <header className="hubDasHeader">
        <div className="dasHeaderContainer">
          <div className="wrapperHeader dis-f a-c px-2 px-md-3 h-fix-64 jc-b pos-r bgWhite">

            {
              activeSingleProperty.id ? (
                <div className="propertyPanel dis-f a-c">
                  <div
                    className="image-ratio flex-48 squared shadow-2dp w-fix-48 h-fix-48 brdRadius ov-h"
                    onClick={() => {
                      if (!history.location.pathname.includes('rewards')) history.push(`/${propID}/rewards`);
                    }}
                  >
                    <CoverPropertyImage
                      className="cover"
                      coverPhoto={get(formValue, 'coverPhoto.galleryThumbnailPath', undefined)}
                      propertyType={get(formValue, 'properties.propertyType', undefined)}
                    />
                  </div>
                  <div className="ml-2">
                    {
                      windowDimensions.width > 1024 && (
                        <div
                          className="dis-f a-c cur-poi fsize-300 txtLight600 fweight-600 smallIconLink"
                          onClick={() => onBackProperties()}
                        >
                          <BrixelIcon className="mr-1" icon="arrow-left-small" />
                          <span>All properties</span>
                        </div>
                      )
                    }
                    <h4 ref={proTitleRef} className="fsize-400 fweight-600"> {get(formValue, 'title', '')}</h4>
                  </div>
                </div>
              ) : (
                <div className="header-section dis-fl-row a-c jc-b">
                  {
                    getCurrentRoute().title === 'Property' ? (
                      <>
                        <BrixelIcon
                          icon="favorite-fill"
                          color="red"
                          saturationTxt={400}
                          background="red"
                          saturation={100}
                          className="noRadius w-fix-40 h-fix-40 shadow-2dp dis-f jc-c a-c"
                        />
                        <div className="ml-2">
                          <span className="fsize-300 fweight-500">Buy</span>
                          <h5>Favorites</h5>
                        </div>
                      </>
                    ) : (
                      <>
                        <BrixelIcon
                          icon={getCurrentRoute().icon}
                          color="dark"
                          saturationTxt={400}
                          background="primary"
                          saturation={100}
                          className="noRadius w-fix-40 h-fix-40 shadow-2dp dis-f jc-c a-c"
                        />
                        <div className="ml-2">
                          <h5>{getCurrentRoute().title}</h5>
                        </div>
                      </>
                    )
                  }
                </div>
              )
            }

            {/*
              windowDimensions.width > 1024 && (
                <div className="header-section dis-fl-row a-c jc-b">
                  <BrixelIcon icon={getCurrentRoute().icon} color="dark" saturationTxt={700} />
                  <h5 className="ml-2">{getCurrentRoute().title}</h5>
                </div>
              )
            }
            {
              windowDimensions.width <= 1024 && (
                <div
                  className="propertyPanel dis-f a-c"
                  onClick={() => {
                    if (!history.location.pathname.includes('rewards')) history.push(`/${propID}/rewards`);
                  }}
                >
                  <div className="image-ratio flex-48 squared shadow-2dp w-fix-48 h-fix-48 brdRadius ov-h">
                    <CoverPropertyImage
                      className="cover"
                      coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                      propertyType={get(formValue, 'properties.propertyType', undefined)}
                    />
                  </div>
                  <h4 ref={proTitleRef} className="ml-2 fsize-400 fweight-600"> {get(formValue, 'title', '')}</h4>
                </div>
              )
            */}

            <div className="dis-f a-c">
              {/*
                windowDimensions.width > 1024 && (
                  <div className="dis-f a-c" onClick={() => brixelsAchievementDetail()}>
                    {
                      awards >= 0 && (
                        <div className="cur-poi dis-f a-c">
                          <BrixelIcon iconSize="fsize-600" icon="cup-awards" color="green" />
                          <span className="ff-mono fsize-300 pl-1 txtDark700">{awards}</span>
                        </div>
                      )
                    }
                    {
                      brixelPoints >= 0 && (
                        <div className="cur-poi dis-f a-c ml-2">
                          <img className="max-w-fix-24" src={brixels} alt="icon awards" />
                          <span className="ff-mono fsize-300 pl-1 txtDark700">{brixelPoints}</span>
                        </div>
                      )
                    }
                  </div>
                )
              */}
              {
                propID && windowDimensions.width > 1024 && userType === 'seller' && (
                  <BrixelButtonText
                    className="hide dis-f-md mx-3"
                    label="Upgrade"
                    color="red"
                    rounded
                    onClick={() => onUpgrade()}
                  />
                )
              }

              {
                windowDimensions.width > 1024 && (
                  <div className="dis-f-md a-c cur-poi pos-r zIndex5" onClick={() => setShowProfileMenu(!showProfileMenu)} ref={profileMenu}>
                    <AccountDropdown />
                  </div>
                )
              }
              { /* SECTION SIDEBAR MENU MOBILE */ }
              <div className="hide-md ml-2">
                <BrixelButtonIcon
                  bgTransparent
                  color="primary"
                  saturationTxt={400}
                  noBorder
                  className="shadow-2dp btnMainMenu"
                  icon={showMobileMenu ? 'close-small' : 'menu'}
                  onClick={() => toggleMobileMenu()}
                />
                {
                  showMobileMenu && (
                    <div className="mobile-menu bgWhite w-perc-100 h-100 pos-a dis-fl-col a-c pt-small-12 pr-2 pl-3 pb-2 zIndex5" style={{ height: windowDimensions.height }}>
                      <div className="dis-f jc-b a-c w-perc-100">
                        <img className="pos-r w-fix-80" src={logo} alt="Brixel Logo" id="logo" />
                        <BrixelButtonIcon
                          className="as-fe"
                          icon="close-small"
                          background="light"
                          saturation={100}
                          color="green"
                          saturationTxt={700}
                          onClick={() => {
                            toggleMobileMenu();
                            document.body.classList.remove('ov-h');
                          }}
                        />
                      </div>
                      <div className="links dis-fl-col as-b w-perc-100">
                        <div className="sidebarNav mt-5">
                          <BrixelButtonPrimary
                            label="Sell"
                            labelClass="fsize-300"
                            leftIcon="property-house"
                            className={`${userType === 'seller' ? 'active' : ''}`}
                            onClick={() => {
                              handleSetUserTypes('seller');
                              handleSetActiveSingleProperty({});
                              history.push('/seller/pageLists');
                              toggleMobileMenu();
                            }}
                          />
                          <BrixelButtonPrimary
                            label="Buy"
                            labelClass="fsize-300"
                            leftIcon="favorite"
                            className={`${userType === 'buyer' ? 'active' : ''}`}
                            onClick={() => {
                              destroyForm();
                              handleSetUserTypes('buyer');
                              handleSetActiveSingleProperty({});
                              history.push('/buyer/propertyLists');
                              toggleMobileMenu();
                            }}
                          />
                          <BrixelButtonText
                            className="fsize-300 txtLight700 px-1 td-n"
                            label="Support"
                            leftIcon="conversation"
                            onClick={() => onTabClick('support')}
                          />
                        </div>

                        <hr className="my-3" />

                        <div className="mini-menu dis-fl-col txtLight100">
                          {
                            userType === 'seller' && (
                              <div className="mb-2">
                                <a
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onUpgrade();
                                  }}
                                  className="px-2 link txtRed400 fweight-500 fsize-300 ta-l"
                                >
                                  Upgrade
                                </a>
                              </div>
                            )
                          }
                          <BrixelSelect
                            options={langMenu}
                            className="mb-2"
                            input={{
                              value: langSel,
                              name: 'lang',
                              onChange: (val) => newLang(val),
                            }}
                          />
                          <a
                            className="px-2 link txtDark700 fweight-500 fsize-300 mb-2 ta-l"
                            href={`${baseByData().loginBasePath}/account/account?url=${window.location.href}`}
                          >
                            Password
                          </a>
                          <a
                            className="px-2 link txtDark700 fweight-500 fsize-300 mb-2 ta-l"
                            href={`${baseByData().loginBasePath}/account/preferences?url=${window.location.href}`}
                          >
                            Preferences
                          </a>
                          <a
                            className="px-2 link txtDark700 fweight-500 fsize-300 ta-l"
                            href={`${baseByData().loginBasePath}/logout?url=${window.location.href}`}
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
              <MenuNavigationSubmenu
                windowDimensions={windowDimensions}
                activeMenu={activeMenu}
                onClose={() => setActiveMenu(null)}
              />
            </div>
          </div>
        </div>
        <div className="tabWrapper">
          {
            has(activeSingleProperty, 'id') && (
              <>
                {
                  userType === 'seller' ? (
                    <BrixelTabs
                      classNameLi="dis-fl-col dis-fl-row-md py-1 py-md-0 pos-r"
                      classNameUl="zIndex4"
                      labels={has(activeSingleProperty, 'id') ? routeNav.map((item) => item.title) : []}
                      labelsIcons={labelIcons()}
                      clicksList={has(activeSingleProperty, 'id') ? routeNav.map((item) => item.path) : []}
                      clicksListName={has(activeSingleProperty, 'id') ? routeNav.map((item) => item.name) : []}
                      classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
                      activeTab={activeMenu || checkActiveTab()}
                      onClick={(val) => onTabClick(val)}
                      showFull={false}
                      fullWidth={windowDimensions.width <= 1024}
                      classNameIcon="fsize-md-400 txtLight600"
                      classNameLabel={`${windowDimensions.width <= 1024 ? 'fsize-300' : 'fsize-400'} txtLight600 dis-f a-c ml-1`}
                    />
                  ) : (
                    <>
                      {/* <BrixelTabs
                      classNameLi="dis-fl-col dis-fl-row-md py-1 py-md-0 pos-r"
                      classNameUl="zIndex4"
                      labels={has(activeSingleProperty, 'id') ? firstRoutesBuyer.map((item) => item.title) : []}
                      labelsIcons={has(activeSingleProperty, 'id') ? firstRoutesBuyer.map((item) => item.icon) : []}
                      clicksList={has(activeSingleProperty, 'id') ? firstRoutesBuyer.map((item) => item.path) : []}
                      clicksListName={has(activeSingleProperty, 'id') ? firstRoutesBuyer.map((item) => item.name) : []}
                      classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
                      activeTab={activeMenu || checkActiveTab()}
                      onClick={(val) => onTabClick(val)}
                      showFull={false}
                      classNameIcon="fsize-md-400 txtLight600"
                      classNameLabel="fsize-300 txtLight600 dis-f a-c ml-1"
                    /> */}
                    </>
                  )
                }
              </>
            )
          }
        </div>
        {
          windowDimensions.width <= 1024 && getCurrentRoute().name !== 'deals' && (
            <div className="mobileTitle dis-f jc-b a-c px-2 py-1">
              <div className="header-section dis-fl-row a-c jc-b">
                {/* <BrixelIcon icon={getCurrentRoute().icon} color="dark" saturationTxt={700} /> */}
                <h5 className="">{getCurrentRoute().title}</h5>
              </div>
              {/*
              <div className="dis-f a-c" onClick={() => brixelsAchievementDetail()}>
                {
                  awards >= 0 && (
                    <div className="cur-poi dis-f a-c">
                      <BrixelIcon iconSize="fsize-600" icon="cup-awards" color="green" />
                      <span className="ff-mono fsize-300 pl-1 txtDark700">{awards}</span>
                    </div>
                  )
                }
                {
                  brixelPoints >= 0 && (
                    <div className="cur-poi dis-f a-c ml-2">
                      <img className="max-w-fix-24" src={brixels} alt="icon awards" />
                      <span className="ff-mono fsize-300 pl-1 txtDark700">{brixelPoints}</span>
                    </div>
                  )
                }
              </div>
              */}
            </div>
          )
        }
      </header>
    </>
  );
}

PageHeaderDashboard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDealsCount: PropTypes.object.isRequired,
  // awards: PropTypes.number.isRequired,
  // brixelPoints: PropTypes.number.isRequired,
  changeZIndex: PropTypes.func,
  destroyForm: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameHistory: PropTypes.object.isRequired,
  // handleGetGame: PropTypes.func.isRequired,
  handleSaveActiveSingleUser: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  // handleSetModal: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object,
  userType: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
  getPropertyDealsCount: PropTypes.func.isRequired,
  setDealsCount: PropTypes.func.isRequired,
};

PageHeaderDashboard.defaultProps = {
  lang: 'en',
  loggedInUser: {},
  changeZIndex: () => 1,
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
  handleGetGame: bindActionCreators(getGameHistory, dispatch),
  handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  getPropertyDealsCount: bindActionCreators(getActiveSinglePropertyDealsCount, dispatch),
  setDealsCount: bindActionCreators(setActiveSinglePropertyDealsCount, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeaderDashboard));
