/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import { BrixelTabs, BrixelButtonPrimary, BrixelButtonIcon } from '@brixel/brixel-components';
import Loadable from 'react-loadable';
import { setCookie } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';
import { getGameHistory } from '../actions/GamificationActions';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';
import noCover from '../images/no_cover.jpg';
import has from 'lodash/has';
import MenuNavigationSubmenu from './MenuNavigationSubmenu';

const AvatarImage = Loadable({
  loader: () => import('./AvatarImage' /* webpackChunkName: "AvatarImage" */),
  loading: () => '',
});

function PageHeaderDashboard(props) {
  // PROPS
  const {
    lang,
    loggedInUser,
    gameHistory,
    handleGetGame,
    handleSetLanguage,
    history,
    property,
    windowDimensions,
  } = props;
  // STATE
  //const [currentLang, setCurrentLang] = useState(lang);
  //const [dropLang, setDropLang] = useState([]);
  const [widthScreen, setWidthScreen] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [righteMenu, setRighteMenu] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];

  const checkActiveTab = () => {
    let curTab = '';
    if (history) {
      if (history.location.pathname.includes('rewards')) curTab = 'rewards';
      else if (history.location.pathname.includes('property')) curTab = 'property';
      else if (history.location.pathname.includes('listings')) curTab = 'listings';
    }
    return curTab;
  };

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

  const avatarAction = () => {
    // Mobile actions for the avatar click
    if (widthScreen <= 768) {
      document.body.classList.add('ov-h');
    } else {
      window.open(baseByData(undefined,'io').profileURL, '_blank');
    }
  };

  const onClickMobileMenu = (link) => {
    setShowMobileMenu(false);
    setActiveMenu(link);
    document.body.classList.remove('ov-h');
  };

  const onUpgrade = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/upgrade`);
  };

  return (
    <>
      <header className={`hubDasHeader ${righteMenu ? 'rightMenuOpen' : ''}`}>
        <div className={`container dis-f a-t p-1 pt-md-2 pr-md-2 pl-md-3 jc-b pos-r zIndex4 bgWhite`}>

          <div className="header-section dis-fl-row a-t jc-b">
            <div className="dis-fl-row a-c">
              <div className="avatar w-fix-48 brdCircle h-fix-48 a-c jc-c">
                {
                  property.coverPhoto && property.coverPhoto.path ? (
                    <img className="avatar w-fix-48 h-fix-48 brdRadius pos-r" src={`${baseByData().shortPath}${property.coverPhoto.thumbnailPath}`} alt="Brixel Logo" id="avatar" />
                  ) : (
                    <i
                      className="avatar w-fix-48 h-fix-48 brdRadius pos-r"
                      style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'block',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: `url(${noCover})`,
                      }}
                    />
                  )
                }
              </div>
              <div className="title ml-1">
                <span className="name dis-fl-row body fweight-500 txtDark700 pt-1">
                  {(has(property.properties, 'typology') && has(property.properties.typology, 'bedrooms')) ? property.properties.typology.bedrooms : ''} {has(property.properties, 'propertyType') ? property.properties.propertyType : 'Property'}
                </span>
                <span className="address caption txtLight400">{has(property.location, 'zip') ? property.location.zip : ''} {has(property.location, 'state') ? property.location.state : ''}</span>
              </div>
            </div>
          </div>

          <div className="dis-f a-t">
            <BrixelButtonPrimary
              className="hide dis-b-md"
              label="UPGRADE"
              background="red"
              rounded
              onClick={() => onUpgrade()}
            />
            <div className="ml-2 hide dis-b-md cur-poi">
              <AvatarImage
                avatarImg={ has(loggedInUser, 'user.avatar[0]') ? `${baseByData().shortPath}${loggedInUser.user.avatar[0].thumbnailPath}` : null}
                name={has(loggedInUser, 'user.name') ? loggedInUser.user.name : ''}
                size={40}
                onClick={() => avatarAction()}
              />
            </div>
            { /* SECTION SIDEBAR MENU MOBILE */ }
            <div className="hide-md">
              <BrixelButtonIcon
                bgTransparent
                color="primary"
                saturationTxt={400}
                noBorder
                className={`shadow-2dp btnMainMenu`}
                icon={showMobileMenu ? "close-small" : "menu"}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
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
                        setShowMobileMenu(false);
                        document.body.classList.remove('ov-h');
                      }}
                    />
                    <div className="links dis-fl-col as-b pl-4">
                      <button
                        className="txtLight100 fweight-700 fSizePx28 mb-4"
                        onClick={() => onClickMobileMenu('propertyList')}
                      >
                        Properties
                      </button>
                      <button
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
                      </button>
                      <a
                        className="txtLight100 fweight-700 fSizePx28 mb-4"
                        href={baseByData(null,'io').profileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Profile
                      </a>
                    </div>
                  </div>
                )
              }
            </div>
            <MenuNavigationSubmenu windowDimensions={windowDimensions} activeMenu={activeMenu} onClose={() => setActiveMenu(null)} />
          </div>
        </div>
        <div className="dis-f jc-b w-perc-100 a-t brdLight100 pl-md-3 brixelNavMenu">
          <BrixelTabs
            classNameLi="dis-fl-col"
            classNameUl="zIndex4"
            labels={['Rewards', 'Property', 'Listings']}
            labelsRight={['Support']}
            labelsIcons={windowDimensions.width <= 768 ? ['first-time-occupancy', 'property-house', 'upload', 'question'] : []}
            clicksList={['rewards', 'property', 'listings', 'support']}
            classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
            activeTab={checkActiveTab()}
            fullWidth={windowDimensions.width <= 768}
            onClick={(val) => val === 'support' ? setRighteMenu(val) : history.push(`/${propID}/${val}`)}
            showFull={false}
          />
        </div>
        <MenuNavigationSubmenu windowDimensions={windowDimensions} rightMenu={righteMenu} onClose={() => setRighteMenu(null)} />
      </header>
    </>
  );
}

PageHeaderDashboard.propTypes = {
  gameHistory: PropTypes.object.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object),
  lang: PropTypes.string,
  loggedInUser: PropTypes.object,
  history: PropTypes.object.isRequired,
  handleGetGame: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
  userAwards: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.number]),
  userBrixelPoint: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.number]),
  windowDimensions: PropTypes.object.isRequired,
};

PageHeaderDashboard.defaultProps = {
  languages: [],
  loggedInUser: {},
  noMenu: false,
  userAwards: [],
  userBrixelPoint: [],
  withShadow: false,
};

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser', {}),
  languages: get(state, 'common.languages', []),
  lang: get(state, 'common.language', []),
  userAwards: get(state, 'user.awards', []),
  property: get(state, 'property.activeSingleProperty', {}),
  userBrixelPoint: get(state, 'user.brixelPoints', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetGame: bindActionCreators(getGameHistory, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeaderDashboard));
