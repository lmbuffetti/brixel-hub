/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import { BrixelDropdown, BrixelModal } from '@brixel/brixel-components';
import logoNorm from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import Loadable from 'react-loadable';
import { setCookie } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';
import { getGameHistory } from '../actions/GamificationActions';
import { translateTo } from '../utils/translation';
import awards from '../images/BrxielComingTown/awards.svg';
import brixels from '../images/BrxielComingTown/brixels.svg';
import BrixelButtonIcon from '@brixel/brixel-components/dist/components/BrixelButtonIcon';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

const AvatarImage = Loadable({
  loader: () => import('./AvatarImage' /* webpackChunkName: "AvatarImage" */),
  loading: () => '',
});

function PageHeader(props) {
  // PROPS
  const {
    lang, languages, loggedInUser, userAwards, userBrixelPoint,
    handleSetLanguage, history, handleGetGame, property, gameHistory,
  } = props;
  // STATE
  const [currentLang, setCurrentLang] = useState(lang);
  const [dropLang, setDropLang] = useState([]);
  const [modal, setModal] = useState(false);
  const [widthScreen, setWidthScreen] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
      setShowMobileMenu(false);
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
      setShowMobileMenu(true);
      document.body.classList.add('ov-h');
    } else {
      window.open(baseByData(null,'io').profileURL, '_blank');
    }
  };

  const onClickMenu = (link) => {
    history.push(link);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className={`${(history.location.pathname.includes('onBoarding') || history.location.pathname.includes('packageFlow')) ? '' : 'dashboardHeader'} shadow-1dp`}>
        <div className={`container dis-f a-c p-1 p-md-2 jc-b pos-r zIndex4 ${(history.location.pathname.includes('onBoarding') || history.location.pathname.includes('packageFlow')) ? '' : 'jc-fe-md'}`}>
          <img className={`logo dis-b w-fix-40 ${(history.location.pathname.includes('onBoarding') || history.location.pathname.includes('packageFlow')) ? '' : 'hide-md'}`} src={logoNorm} alt="Brixel Logo" id="header-logo" />
          <div className="dis-f a-c">
            {
              userAwards >= 0 && (
                <div className="cur-poi" onClick={() => setModal('awards')}>
                  <img src={awards} alt="icon awards" className="mr-1" />
                  <span className="ff-mono txtGreen600">{userAwards}</span>
                </div>
              )
            }
            {
              userBrixelPoint >= 0 && (
                <div className="cur-poi ml-2" onClick={() => setModal('brixelPoints')}>
                  <img src={brixels} alt="icon awards" className="mr-1" />
                  <span className="ff-mono txtRed600">{userBrixelPoint}</span>
                </div>
              )
            }
            {
              Object.keys(userAwards).length > 0 && (
                <div className="cur-poi" onClick={() => setModal('awards')}>
                  <img src={awards} alt="icon awards" className="mr-1" />
                  <span className="ff-mono txtGreen600">{Object.keys(userAwards).length}</span>
                </div>
              )
            }
            {
              Object.keys(userBrixelPoint).length > 0 && (
                <div className="cur-poi ml-2" onClick={() => setModal('brixelPoints')}>
                  <img src={brixels} alt="icon awards" className="mr-1" />
                  <span className="ff-mono txtRed600">{userBrixelPoint.reduce((prev,next) => prev + next.point,0)}</span>
                </div>
              )
            }
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
      </header>
      {
        modal && (
          <>
            {
              modal === 'awards' && (
                <BrixelModal
                  saturationTxt={600}
                  onClose={() => setModal(false)}
                >
                  <div className="modal-title">
                    <div className="title-container dis-f a-c">
                      <div className={`w-fix-48 h-fix-48 brdRadius dis-f a-c jc-c p-1 mr-2`}>
                        <img
                          src={awards}
                          className={`title-img w-perc-100`}
                          alt="Awards Icon"
                        />
                      </div>
                      <span className="heading3">{translateTo(lang, "Awards")}</span>
                    </div>
                  </div>
                  <p>{translateTo(lang, "Who does not like awards? To honor your effort and endurance we award you for specific achievements.")}</p>
                  <p>{translateTo(lang, "Keep on going to collect more and enjoy the ride.")}</p>
                </BrixelModal>
              )
            }
            {
              modal === 'brixelPoints' && (
                <BrixelModal
                  onClose={() => setModal(false)}
                >
                  <div className="modal-title">
                    <div className="title-container dis-f a-c">
                      <div className={`w-fix-48 h-fix-48 brdRadius dis-f a-c jc-c p-1 mr-2`}>
                        <img
                          src={brixels}
                          className={`title-img w-perc-100`}
                          alt="Brixels Point Icon"
                        />
                      </div>
                      <span className="heading3">{translateTo(lang, "Brixels")}</span>
                    </div>
                  </div>
                  <p>{translateTo(lang, "This is our currency you can earn by fullfilling tasks along the way.")}</p>
                  <p>{translateTo(lang, "During your journey you can use Brixels to unlock addintional features and gifts.")}</p>
                  <p>{translateTo(lang, "So keep collecting your Brixels.")}</p>
                </BrixelModal>
              )
            }
          </>
        )
      }
      {
        showMobileMenu && (
          <div className="mobile-menu bgGreen700 w-perc-100 h-perc-100 pos-a dis-fl-col a-c p-1 zIndex5">
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
                onClick={() => onClickMenu(`/${property.id}/property/list`)}
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
                href={baseByData.profileURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </a>
            </div>
          </div>
        )
      }
    </>
  );
}

PageHeader.propTypes = {
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
};

PageHeader.defaultProps = {
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
});

const mapDispatchToProps = (dispatch) => ({
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetGame: bindActionCreators(getGameHistory, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeader));
