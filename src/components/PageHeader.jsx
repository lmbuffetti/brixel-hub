/* eslint-disable react-hooks/exhaustive-deps */
/* global Transifex */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { BrixelDropdown, BrixelModal } from '@brixel/brixel-components';
// import logoColorIcon from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import logoColor from '@brixel/brixel-configuration-partner/src/images/logo_color.svg';
import logoColorIcon from '@brixel/brixel-configuration-partner/src/images/logo_color_icon.svg';
import Loadable from 'react-loadable';
import BrixelButtonIcon from '@brixel/brixel-components/dist/components/BrixelButtonIcon';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { setCookie, checkBrowser } from '../utils/helpers';
import { setLanguage } from '../actions/CommonActions';
import { getGameHistory } from '../actions/GamificationActions';
import { translateTo } from '../utils/translation';
import awards from '../images/BrxielComingTown/awards.svg';
import brixels from '../images/BrxielComingTown/brixels.svg';

const AvatarImage = Loadable({
  loader: () => import('./AvatarImage' /* webpackChunkName: "AvatarImage" */),
  loading: () => '',
});

function PageHeader(props) {
  // PROPS
  const {
    brixelPoints,
    handleSetLanguage,
    history,
    lang,
    languages,
    loggedInUser,
    property,
    userAwards,
  } = props;

  // STATE
  const [currentLang, setCurrentLang] = useState(lang);
  const [dropLang, setDropLang] = useState([]);
  const [modal, setModal] = useState(false);
  const [widthScreen, setWidthScreen] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // FUNCTION TO CHECK IF USER IS LOGGED IN
  useEffect(() => {
    if (loggedInUser && loggedInUser.user) {
      const langUsr = loggedInUser.user.language;
      setCurrentLang(lang);
      handleSetLanguage(lang);
      setCookie('brixelLang', langUsr);
      // if (!gameHistory.data && !history.location.pathname.includes('getStarted')) handleGetGame();
    }
  }, [loggedInUser, lang]);

  // FUNCTION TO POPULATE THE DROPDOWN LANGUAGE MENU
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

  // FUNCTION TO TRANSLATE THE CONTENT USING TRANSIFEX
  useEffect(() => {
    setCurrentLang(lang);
    if (typeof Transifex !== 'undefined') Transifex.live.translateTo(lang);
  }, [lang]);

  // FUNCTION LOADED WHEN SCREEN IS RESIZED
  const screenResize = useCallback(() => {
    setWidthScreen(window.innerWidth);
    if (window.innerWidth > 1024) {
      setShowMobileMenu(false);
      document.body.classList.remove('ov-h');
    }
  }, [window]);

  // FUNCTION TO INITIALIZE THE EVENT LISTENER FOR SCREEN RESIZE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidthScreen(window.innerWidth);
      window.addEventListener('resize', () => screenResize());
    }
  }, []);

  // FUNCTION TO INITIALIZE THE EVENT LISTENER FOR SCREEN RESIZE
  useEffect(() => {
    document.body.classList.add('flowBody');

    if (history.location.pathname.includes('/resume')) {
      document.body.classList.add('flowResume');
    } else {
      document.body.classList.remove('flowResume');
    }

    if (history.location.pathname.includes('/createProfile')) {
      document.body.classList.add('flowProfile');
    } else {
      document.body.classList.remove('flowProfile');
    }
    return () => {
      //  clean up
      document.body.classList.remove('flowProfile');
      document.body.classList.remove('flowBody');
      document.body.classList.remove('flowResume');
    };
  }, [history.location.pathname]);

  useEffect(() => {
    // this changes the scrolling behavior to "smooth"
    if (window.innerWidth < 590) {
      if (checkBrowser() > 0) {
        window.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, []);

  // FUNCTION TO SET THE LANGUAGE WHEN SELECTED
  const newLang = useCallback((e, langCode) => {
    e.stopPropagation();
    setCurrentLang(langCode.value);
    handleSetLanguage(langCode.value);
    if (typeof Transifex !== 'undefined') Transifex.live.translateTo(langCode.value);
    setCookie('brixelLang', langCode.value);
  }, [Transifex]);

  // FUNCTION WHEN CLICKED ON AVATAR - DIFFERENT IF DESKTOP OR MOBILE
  const avatarAction = useCallback(() => {
    // Mobile actions for the avatar click
    if (widthScreen < 769) {
      setShowMobileMenu(true);
      document.body.classList.add('ov-h');
    } else {
      window.open(baseByData(null, 'io').profileURL, '_blank');
    }
  }, [widthScreen]);

  // FUNCTION WHEN MENU ELEMENT IS CLICKED
  const onClickMenu = useCallback((link) => {
    history.push(link);
    setShowMobileMenu(false);
  }, []);

  return (
    <>
      <header className="flowHeader">
        <div className="container">
          <div className={`dis-f a-c dis-f a-c  jc-b pos-r jc-b pos-r pt-2 pb-3 py-sm-5 ${(history.location.pathname.includes('onBoarding') || history.location.pathname.includes('packageFlow')) ? '' : 'jc-fe-md'}`}>
            <div className="dis-f jc-c a-c w-fix-88 min-h-fix-40 h-perc-100">
              <img
                className={`logo w-perc-100 ${widthScreen <= 600 ? 'w-fix-32 mr-2' : 'max-w-fix-84 ov-h'} ${(history.location.pathname.includes('onBoarding') || history.location.pathname.includes('packageFlow')) ? '' : 'hide-md'}`}
                src={`${widthScreen <= 600 ? logoColorIcon : logoColor}`}
                alt="Brixel Logo"
                id="header-logo"
              />
              {/* {
                supportPhone && (
                  <div className="support dis-f a-c ml-2 ml-sm-4 notranslate">
                    <a className="fweight-500 dis-f a-c ff-mono" href={`tel:${Helpers.telephoneFormat(supportPhone)}`}>
                      <img className="w-fix-24 w-fix-sm-32 mr-1" src={CallUsImg} alt="Call Us" />
                      <span className="body2 txtPrimary600 fweight-500">{Helpers.telephoneFormat(supportPhone)}</span>
                    </a>
                  </div>
                )
              } */}
            </div>
            <div className="dis-f a-c">
              {
                !history.location.pathname.includes('packageFlow') &&
                !history.location.pathname.includes('onBoarding') && (
                  <>
                    {
                      userAwards >= 0 && (
                        <div className={`cur-poi ${userAwards >= 1 ? 'scaleUp' : ''}`} onClick={() => setModal('awards')}>
                          <img src={awards} alt="icon awards" className="mr-1" />
                          <span className="ff-mono txtGreen600">{userAwards}</span>
                        </div>
                      )
                    }

                    {
                      brixelPoints >= 0 && (
                        <div className={`cur-poi ml-2 ${brixelPoints >= 1 ? 'scaleUp' : ''}`} onClick={() => setModal('brixelPoints')}>
                          <img src={brixels} alt="icon awards" className="mr-1" />
                          <span className="ff-mono txtRed600">{brixelPoints}</span>
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
                      Object.keys(brixelPoints).length > 0 && (
                        <div className="cur-poi ml-2" onClick={() => setModal('brixelPoints')}>
                          <img src={brixels} alt="icon awards" className="mr-1" />
                          <span className="ff-mono txtRed600">{brixelPoints.reduce((prev, next) => prev + next.point, 0)}</span>
                        </div>
                      )
                    }
                  </>
                )
              }
              {
                !loggedInUser.token ? (
                  <div className="">
                    <BrixelDropdown
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
                    {
                      !history.location.pathname.includes('packageFlow') && (
                        <AvatarImage
                          avatarImg={has(loggedInUser, 'user.avatar[0]') ? `${baseByData.shortPath}${loggedInUser.user.avatar[0].thumbnailPath}` : null}
                          name={loggedInUser.user.name}
                          size={40}
                          onClick={() => avatarAction()}
                        />
                      )
                    }
                    {
                      history.location.pathname.includes('packageFlow') &&
                      !(get(history, 'location.state.hideClose', null)) && (
                        <BrixelButtonIcon
                          ghost
                          className="zIndex11"
                          theme="dark"
                          icon="close-small"
                          onClick={() => (history.location.pathname.toLowerCase().includes('getstartedbuyer') ? history.push('/buy') : history.push('/sell'))}
                        />
                      )
                    }
                  </div>
                )
              }
            </div>
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
                      <div className="w-fix-48 h-fix-48 brdRadius dis-f a-c jc-c p-1 mr-2">
                        <img
                          src={awards}
                          className="title-img w-perc-100"
                          alt="Awards Icon"
                        />
                      </div>
                      <span className="heading3">{translateTo(lang, 'Awards')}</span>
                    </div>
                  </div>
                  <p>{translateTo(lang, 'Who does not like awards? To honor your effort and endurance we award you for specific achievements.')}</p>
                  <p>{translateTo(lang, 'Keep on going to collect more and enjoy the ride.')}</p>
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
                      <div className="w-fix-48 h-fix-48 brdRadius dis-f a-c jc-c p-1 mr-2">
                        <img
                          src={brixels}
                          className="title-img w-perc-100"
                          alt="Brixels Point Icon"
                        />
                      </div>
                      <span className="heading3">{translateTo(lang, 'Brixels')}</span>
                    </div>
                  </div>
                  <p>{translateTo(lang, 'This is our currency you can earn by fullfilling tasks along the way.')}</p>
                  <p>{translateTo(lang, 'During your journey you can use Brixels to unlock additional features and gifts.')}</p>
                  <p>{translateTo(lang, 'So keep collecting your Brixels.')}</p>
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
              theme="green"
              onClick={() => {
                setShowMobileMenu(false);
                document.body.classList.remove('ov-h');
              }}
            />
            <div className="links dis-fl-col as-b pl-4">
              <button
                type="button"
                className="txtLight100 fweight-700 fSizePx28 mb-4"
                onClick={() => onClickMenu(`/${property.id}/property/list`)}
              >
                Properties
              </button>
              <button
                type="button"
                className="txtDark200 fweight-700 fSizePx28 mb-4 poi-none ta-l"
                onClick={() => ''}
              >
                Messages
              </button>
              <button
                type="button"
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
  handleSetLanguage: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object),
  lang: PropTypes.string,
  loggedInUser: PropTypes.object,
  history: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  userAwards: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.number]),
  brixelPoints: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.number]),
};

PageHeader.defaultProps = {
  languages: [],
  lang: 'en',
  loggedInUser: {},
  userAwards: [],
  brixelPoints: [],
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  languages: get(state, 'common.languages', []),
  lang: get(state, 'common.language', ''),
  userAwards: get(state, 'user.awards', []),
  property: get(state, 'property.activeSingleProperty', {}),
  brixelPoints: get(state, 'user.brixelPoints', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetGame: bindActionCreators(getGameHistory, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageHeader));
