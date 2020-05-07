/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import { BrixelIcon, BrixelButtonSecondary, BrixelButtonIcon } from '@brixel/brixel-components';
import useOutsideAlerter from './OutsideElement';
import Loadable from 'react-loadable';
import { setCookie } from '../utils/helpers';
import { setLanguage, setModal } from '../actions/CommonActions';
import { getGameHistory } from '../actions/GamificationActions';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';
import has from 'lodash/has';
import MenuNavigationSubmenu from './MenuNavigationSubmenu';
import { firstRoutes, secondRoutes } from '../resources/navigationRoutes';
import brixels from '../images/BrxielComingTown/brixels.svg';
import CoverPropertyImage from './CoverPropertyImage';

const AvatarImage = Loadable({
  loader: () => import('./AvatarImage' /* webpackChunkName: "AvatarImage" */),
  loading: () => '',
});

function PageHeaderDashboard(props) {
  // PROPS
  const {
    awards,
    brixelPoints,
    changeZIndex,
    lang,
    loggedInUser,
    gameHistory,
    handleGetGame,
    handleSetModal,
    handleSetLanguage,
    history,
    windowDimensions,
    formValue,
  } = props;
  // STATE
  //const [currentLang, setCurrentLang] = useState(lang);
  //const [dropLang, setDropLang] = useState([]);
  const [widthScreen, setWidthScreen] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // REF
  const profileMenu = useRef(null);
  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];

  useEffect(() => {
    setShowMobileMenu(false);
  }, [history]);

  useEffect(() => {
    if (loggedInUser && loggedInUser.user) {
      const langUsr = loggedInUser.user.language;
      handleSetLanguage(lang);
      setCookie('brixelLang', langUsr);
      if (!gameHistory.data) handleGetGame();
    }
  }, [loggedInUser]);

  const screenResize = () => {
    setWidthScreen(window.innerWidth);
    if (window.innerWidth >= 768) {
      document.body.classList.remove('ov-h');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidthScreen(window.innerWidth);
      window.addEventListener('resize', () => screenResize());
    }
  }, []);

  const brixelsAchievementDetail = () => {
    handleSetModal({
      showAwardsInfo: true,
    })
  };

  const avatarAction = () => {
    // Mobile actions for the avatar click
    if (widthScreen <= 768) {
      document.body.classList.add('ov-h');
    } else {
      window.location.href = `${baseByData(undefined,'io').profileURL}?url=${window.location.href}`;
    }
  };

  const onClickMobileMenu = (link) => {
    setShowMobileMenu(false);
    setActiveMenu(link);
    changeZIndex(1)
    document.body.classList.remove('ov-h');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    changeZIndex(!showMobileMenu ? 8 : 1);
  };

  const onUpgrade = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/upgrade`);
  };

  const getCurrentRoute = () => {
    const path = history.location.pathname.split('/')[2];
    const currentPath = firstRoutes.concat(secondRoutes).find(item => item.name === path);
    return currentPath || {};
  };

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(profileMenu, {
    action: 'function',
    func: () => {
      setShowProfileMenu(false)
    },
  });

  // add shadow header on body scroll
  useEffect(() => {
    const dashContentEl = document.getElementsByClassName('hubDasContent')[0];
    const dashWrapperEl = document.getElementsByClassName('hubDashboard')[0];
    if (dashContentEl) {
      dashContentEl.addEventListener('scroll', () => {
        if (dashContentEl.scrollTop > 0) {
          dashWrapperEl.classList.add('scrollingHeader')
        } else {
          dashWrapperEl.classList.remove('scrollingHeader')
        }
        if (dashContentEl.scrollTop > 40) {
          dashWrapperEl.classList.add('longScroll')
        } else {
          dashWrapperEl.classList.remove('longScroll')
        }
      });
    }
  });

  return (
    <>
      <header className={`hubDasHeader`}>
        <div className="dasHeaderContainer">
          <div className={`dis-f a-c px-2 px-md-3 h-fix-64 jc-b pos-r bgWhite`}>
            {
              windowDimensions.width > 768 && (
                <div className="header-section dis-fl-row a-c jc-b">
                  <BrixelIcon icon={getCurrentRoute().icon} color="dark" saturationTxt={700} />
                  <h5 className="ml-2">{getCurrentRoute().title}</h5>
                </div>
              )
            }
            {
              windowDimensions.width <= 768 && (
                <div className="propertyPanel dis-f a-c">
                  <div className="image-ratio flex-48 squared shadow-2dp w-fix-48 h-fix-48 brdRadius ov-h">
                    <CoverPropertyImage
                      className="cover"
                      coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                      propertyType={get(formValue, 'properties.propertyType', undefined)}
                    />
                  </div>
                  <h4 className="ml-2 fsize-400 fweight-600">{get(formValue, 'title', '')}</h4>
                </div>
              )
            }

            <div className="dis-f a-c">
              {
                windowDimensions.width > 768 && (
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
                propID && windowDimensions.width > 768 && (
                  <BrixelButtonSecondary
                    className="hide dis-f-md min-h-fix-32 max-h-fix-32 p-0 px-1 min-w-fix-96 brdMedium mx-3"
                    label="Upgrade"
                    color="red"
                    rounded
                    onClick={() => onUpgrade()}
                  />
                )
              }

              {
                windowDimensions.width > 768 && (
                  <div className="dis-f-md a-c cur-poi pos-r" onClick={() => setShowProfileMenu(!showProfileMenu)} ref={profileMenu}>

                    <AvatarImage
                      avatarImg={ has(loggedInUser, 'user.avatar[0]') ? `${baseByData().shortPath}${loggedInUser.user.avatar[0].thumbnailPath}` : null}
                      name={has(loggedInUser, 'user.name') ? loggedInUser.user.name : ''}
                      size={32}
                      onClick={() => avatarAction()}
                    />
                    <p className="ml-1 fsize-300">{get(loggedInUser, 'user.name', '')}</p>
                    <BrixelIcon
                      className="ml-1"
                      iconSize="fsize-300"
                      icon={showProfileMenu ? "arrow-simple-up" : "arrow-simple-down"}
                    />
                    <div className={`${showProfileMenu ? 'open' : 'close'} accountMenu`}>
                      <ul>
                        <li>
                          <a
                            href={`${baseByData().loginBasePath}/account/profile?url=${window.location.href}`}
                            className="txtDark200 fweight-500"
                          >
                            Personal Information</a></li>
                        <li><a className="txtDark200 fweight-500" href={`${baseByData().loginBasePath}/account/account?url=${window.location.href}`}>Password</a></li>
                        <li><a className="txtDark200 fweight-500" href={`${baseByData().loginBasePath}/account/preferences?url=${window.location.href}`}>Preferences</a></li>
                        <li><a className="txtRed400 fweight-500" href={`${baseByData().loginBasePath}/logout?url=${window.location.href}`}>Logout</a></li>
                      </ul>
                    </div>
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
                  className={`shadow-2dp btnMainMenu`}
                  icon={showMobileMenu ? "close-small" : "menu"}
                  onClick={() => toggleMobileMenu()}
                />
                {
                  showMobileMenu && (
                    <div className="mobile-menu bgGreen700 w-perc-100 h-100 pos-a dis-fl-col a-c p-1 zIndex5" style={{ height: windowDimensions.height }}>
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
                      <div className="links dis-fl-col as-b px-3 w-perc-100">
                        <button
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
                          <hr className="mb-4"/>
                          <a
                            className="link txtLight100 fweight-500 fsize-500 mb-3 ta-l"
                            href={baseByData(null,'io').profileURL}
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
                            className="link txtRed400 fweight-500 fsize-500 mb-3 ta-l"
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
              <MenuNavigationSubmenu windowDimensions={windowDimensions} activeMenu={activeMenu} onClose={() => setActiveMenu(null)} />
            </div>
          </div>
        </div>
        {
          windowDimensions.width <= 768 && (
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
  awards: PropTypes.number.isRequired,
  changeZIndex: PropTypes.func,
  brixelPoints: PropTypes.number.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameHistory: PropTypes.object.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object),
  lang: PropTypes.string,
  loggedInUser: PropTypes.object,
  history: PropTypes.object.isRequired,
  handleGetGame: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
  userAwards: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.number]),
  userBrixelPoint: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.number]),
  windowDimensions: PropTypes.object.isRequired,
  userTypes: PropTypes.string,
};

PageHeaderDashboard.defaultProps = {
  languages: [],
  loggedInUser: {},
  changeZIndex: () => 1,
  noMenu: false,
  userAwards: [],
  userBrixelPoint: [],
  withShadow: false,
  userTypes: '',
};

const mapStateToProps = (state) => ({
  awards: get(state, 'user.awards', 0),
  brixelPoints: get(state, 'user.brixelPoints', 0),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  formValue: get(state, 'form.Property.values', {}),
  languages: get(state, 'common.languages', []),
  lang: get(state, 'common.language', []),
  userAwards: get(state, 'user.awards', []),
  property: get(state, 'property.activeSingleProperty', {}),
  userBrixelPoint: get(state, 'user.brixelPoints', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  userTypes: get(state, 'user.userTypes', null),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetGame: bindActionCreators(getGameHistory, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeaderDashboard));
