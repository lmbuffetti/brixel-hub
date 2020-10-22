/* eslint-disable react-hooks/exhaustive-deps */
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
  BrixelButtonSecondary,
  BrixelButtonIcon,
  BrixelTabs,
  BrixelButtonTertiary,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';
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
import brixels from '../images/BrxielComingTown/brixels.svg';
import CoverPropertyImage from './CoverPropertyImage';
import AccountDropdown from './AccountDropdown';

function PageHeaderDashboard(props) {
  // PROPS
  const {
    activeSingleProperty,
    awards,
    brixelPoints,
    changeZIndex,
    formValue,
    gameGroup,
    gameHistory,
    handleGetGame,
    handleSetLanguage,
    handleSetModal,
    history,
    lang,
    loggedInUser,
    userType,
    windowDimensions,
  } = props;
  // STATE
  // const [currentLang, setCurrentLang] = useState(lang);
  // const [dropLang, setDropLang] = useState([]);
  const [routeNav, setRouteNav] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  // REF
  const profileMenu = useRef(null);
  const proTitleRef = useRef(null);

  const proTitleEl = proTitleRef.current;
  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];

  // ON CHANGE HISTORY THE MOBILE MENU IS CLOSED
  useEffect(() => {
    setShowMobileMenu(false);
  }, [history]);

  // CHECK IF USER IS LOGGED IN AND LOAD GAME HISTORY IF NO DATA
  useEffect(() => {
    if (loggedInUser && loggedInUser.user) {
      const langUsr = loggedInUser.user.language;
      handleSetLanguage(lang);
      setCookie('brixelLang', langUsr);
      if (!gameHistory.data) handleGetGame();
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
  useEffect(() => {
    if (gameGroup && gameHistory && userType === 'seller') {
      // let numDone = 0;
      let numTodo = 0;
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
      console.log(numTodo, gameHistory, gameGroup, userType);
      nav[0].title = '<span>Home</span>';
      if (numTodo > 0) nav[0].title += `<span class="numRecords notranslate txtWhite">${numTodo}</span>`;
      setRouteNav([...nav]);
    }
  }, [gameGroup, gameHistory, activeSingleProperty, userType]);

  // SHOW DETAILS WHEN CLICK ON BRIXELS POINTS
  const brixelsAchievementDetail = () => {
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
  };

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
  });

  // FUNCTION TO CALC IF TITLE IS LONG OR NOT AND ASSIGN THE DIFFERENT CLASS
  useEffect(() => {
    if (proTitleEl) {
      const titleHeight = proTitleEl.offsetHeight;
      if (titleHeight > 42) {
        proTitleEl.classList.add('longTitle');
      }
    }
  });

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

  // CHECK TAB BY URL
  const checkActiveTab = () => {
    let curTab = '';
    if (history) {
      if (history.location.pathname.includes('rewards')) curTab = 'rewards';
      else if (history.location.pathname.includes('property')) curTab = 'property';
      else if (history.location.pathname.includes('listings')) curTab = 'listings';
    }
    return curTab;
  };

  return (
    <>
      <header className="hubDasHeader">
        <div className="dasHeaderContainer">
          <div className="dis-f a-c px-2 px-md-3 h-fix-64 jc-b pos-r bgWhite">

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
                      coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                      propertyType={get(formValue, 'properties.propertyType', undefined)}
                    />
                  </div>
                  <div className="ml-2">
                    {
                      windowDimensions.width > 1024 && (
                        <div
                          className="dis-f a-c cur-poi fsize-300 txtLight600 fweight-600 smallIconLink"
                          onClick={() => console.log('TODO')}
                        >
                          <BrixelIcon className="mr-1" icon="arrow-left-small" />
                          <span>Back to the list</span>
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
              {
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
              }
              {
                propID && windowDimensions.width > 1024 && userType === 'seller' && (
                  <BrixelButtonSecondary
                    className="hide dis-f-md p-0 px-1 brdMedium mx-3"
                    label="Upgrade"
                    color="red"
                    rounded
                    onClick={() => onUpgrade()}
                  />
                )
              }

              {
                windowDimensions.width > 1024 && (
                  <div className="dis-f-md a-c cur-poi pos-r" onClick={() => setShowProfileMenu(!showProfileMenu)} ref={profileMenu}>
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
                    <div className="mobile-menu bgGreen700 w-perc-100 h-100 pos-a dis-fl-col a-c pt-small-12 pr-2 pl-2 pb-2 zIndex5" style={{ height: windowDimensions.height }}>
                      <BrixelButtonIcon
                        className="as-fe mb-5"
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
                      <div className="links dis-fl-col as-b w-perc-100">
                        <button
                          type="button"
                          className="txtLight100 fweight-700 fSizePx28 mb-4 ta-l"
                          onClick={() => onClickMobileMenu('propertyList')}
                        >
                          All properties
                        </button>
                        {/* <button
                          className="txtDark200 fweight-700 fSizePx28 mb-4 poi-none ta-l"
                          onClick={() => ''}
                        >
                          Messages
                        </button>
                        <button
                          className="txtDark200 fweight-700 fSizePx28 mb-4 poi-none ta-l"
                          onClick={() => ''}
                        >
                          Calendar
                        </button> */}
                        <div className="mini-menu dis-fl-col txtLight100">
                          <hr className="mb-4" />
                          <a
                            className="link txtLight100 fweight-500 fsize-500 mb-3 ta-l"
                            href={`${baseByData().loginBasePath}/account/profile?url=${window.location.href}`}
                          >
                            Profile
                          </a>
                          <a
                            className="link txtLight100 fweight-500 fsize-500 mb-3 ta-l"
                            href={`${baseByData().loginBasePath}/account/account?url=${window.location.href}`}
                          >
                            Password
                          </a>
                          <a
                            className="link txtLight100 fweight-500 fsize-500 mb-3 ta-l"
                            href={`${baseByData().loginBasePath}/account/preferences?url=${window.location.href}`}
                          >
                            Preferences
                          </a>
                          <a
                            className="link txtRed400 fweight-500 fsize-500 ta-l"
                            href={`${baseByData().loginBasePath}/logout?url=${window.location.href}`}
                          >
                            Logout
                          </a>
                        </div>
                        <hr className="my-4" />
                        {
                          userType === 'seller' && (
                            <div>
                              <BrixelButtonSecondary
                                className=" p-0 px-1 brdMedium"
                                label="Upgrade"
                                color="red"
                                rounded
                                bgTransparent
                                onClick={() => onUpgrade()}
                              />
                            </div>
                          )
                        }
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
                      labelsIcons={has(activeSingleProperty, 'id') ? routeNav.map((item) => item.icon) : []}
                      clicksList={has(activeSingleProperty, 'id') ? routeNav.map((item) => item.path) : []}
                      clicksListName={has(activeSingleProperty, 'id') ? routeNav.map((item) => item.name) : []}
                      classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
                      activeTab={activeMenu || checkActiveTab()}
                      onClick={(val) => onTabClick(val)}
                      showFull={false}
                      fullWidth={windowDimensions.width <= 1024}
                      classNameIcon="fsize-md-400 txtLight600"
                      classNameLabel="fsize-300 txtLight600 dis-f a-c ml-1"
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
          windowDimensions.width <= 1024 && (
            <div className="mobileTitle dis-f jc-b a-c px-2 py-1">
              <div className="header-section dis-fl-row a-c jc-b">
                {/* <BrixelIcon icon={getCurrentRoute().icon} color="dark" saturationTxt={700} /> */}
                <h5 className="">{getCurrentRoute().title}</h5>
              </div>
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

            </div>
          )
        }
      </header>
    </>
  );
}

PageHeaderDashboard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  awards: PropTypes.number.isRequired,
  brixelPoints: PropTypes.number.isRequired,
  changeZIndex: PropTypes.func,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameHistory: PropTypes.object.isRequired,
  handleGetGame: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object,
  userType: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

PageHeaderDashboard.defaultProps = {
  lang: 'en',
  loggedInUser: {},
  changeZIndex: () => 1,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
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
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetGame: bindActionCreators(getGameHistory, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeaderDashboard));
