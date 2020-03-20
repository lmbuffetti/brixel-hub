/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import { BrixelDropdown, BrixelTabs, BrixelButtonPrimary } from '@brixel/brixel-components';
import Loadable from 'react-loadable';
import { setCookie } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';
import { getGameHistory } from '../actions/GamificationActions';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import noCover from '../images/no_cover.jpg';
import has from 'lodash/has';

const AvatarImage = Loadable({
  loader: () => import('./AvatarImage' /* webpackChunkName: "AvatarImage" */),
  loading: () => '',
});

function PageHeaderDashboard(props) {
  // PROPS
  const {
    lang,
    languages,
    loggedInUser,
    gameHistory,
    handleGetGame,
    handleSetLanguage,
    history,
    property,
    windowDimensions,
  } = props;
  // STATE
  const [currentLang, setCurrentLang] = useState(lang);
  const [dropLang, setDropLang] = useState([]);
  const [widthScreen, setWidthScreen] = useState(0);

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
      setCurrentLang(lang);
      handleSetLanguage(lang);
      setCookie('brixelLang', langUsr);
      if (!gameHistory.data) handleGetGame();
    }
  }, [loggedInUser, lang]);

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

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  const screenResize = () => {
    setWidthScreen(window.innerWidth);
    if (window.innerWidth > 768) {
      document.body.classList.remove('ov-h');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidthScreen(window.innerWidth);
      window.addEventListener('resize', () => screenResize());
    }
  }, []);

  const newLang = (e, langCode) => {
    e.stopPropagation();
    setCurrentLang(langCode.value);
    handleSetLanguage(langCode.value);
    setCookie('brixelLang', langCode.value);
  };

  const avatarAction = () => {
    // Mobile actions for the avatar click
    if (widthScreen < 769) {
      document.body.classList.add('ov-h');
    } else {
      window.open(baseByData(null,'io').profileURL, '_blank');
    }
  };

  return (
    <>
      <header className={`dashboardHeaderHub`}>
        <div className={`container dis-f a-c p-1 p-md-2 jc-b pos-r zIndex4`}>

          <div className="header-section dis-fl-row a-c jc-b">
            <div className="dis-fl-row a-c">
              <div className="avatar w-fix-48 brdCircle h-fix-48 a-c jc-c">
                {
                  property.coverPhoto && property.coverPhoto.path ? (
                    <img className="avatar w-fix-48 h-fix-48 brdRadius pos-r" src={`${baseByData.shortPath}${property.coverPhoto.thumbnailPath}`} alt="Brixel Logo" id="avatar" />
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

          <div className="dis-f a-c">
            <BrixelButtonPrimary label="UPGRADE" background="red" rounded />
            {
              !loggedInUser.token ? (
                <div className="">
                  <BrixelDropdown
                    bgTransparent
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
                <div className="ml-2">
                  <AvatarImage
                    avatarImg={ loggedInUser.user.avatar && loggedInUser.user.avatar[0] ? `${baseByData.shortPath}${loggedInUser.user.avatar[0].thumbnailPath}` : null}
                    name={loggedInUser.user.name}
                    size={40}
                    onClick={() => avatarAction()}
                  />
                </div>
              )
            }
          </div>
        </div>

        <div className="dis-f jc-b w-perc-100 a-t brdLight100 brixelNavMenu">
          <BrixelTabs
            classNameLi="dis-fl-col"
            classNameUl="zIndex4"
            labels={['Rewards', 'Property', 'Listings']}
            labelsIcons={windowDimensions.width < 768 ? ['first-time-occupancy', 'property-house', 'upload'] : []}
            clicksList={['rewards', 'property', 'listings']}
            classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
            activeTab={checkActiveTab()}
            fullWidth={windowDimensions.width < 768}
            onClick={(val) => history.push(`/${propID}/${val}`)}
            showFull={false}
          />
          <button className="fsize-400 txtLight400 hide dis-b-md mr-2">Support</button>
        </div>

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
