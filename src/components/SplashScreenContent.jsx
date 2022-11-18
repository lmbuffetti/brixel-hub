/* global Transifex */
import { BrixelButtonIcon, useOutsideAlerter } from '@brixel/brixel-components';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setSplashType, setWizard } from '../actions/CommonActions';
import {
  getFavoritesProperties,
  getLastViewedProperties,
  getNewProperties,
  getPremarketProperties,
  getPremarketStats,
  getPremiumProperties,
  getWishlistProperties,
} from '../actions/MarketActions';
import { setActiveMarketOverlayProperty, setActiveMarketOverlayPropertyLists } from '../actions/PropertyActions';
import { addNotInterested, updateFavorite } from '../actions/UserActions';
import { getCookie } from '../utils/helpers';
import MarketCardOverlay from './Cards/MarketCardOverlay';
import WizardCard from './Cards/WizardCard';

const SplashScreen = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeMarketOverlayProperty,
    activeMarketOverlayPropertyLists,
    closeLink,
    closeOutside,
    favoritesProperties,
    handleGetFavoritesProperties,
    handleGetNewProperties,
    handleGetPreMarketProperties,
    handleGetPremarketStats,
    handleGetPremiumProperties,
    handleGetWishlistProperties,
    handleMarkNotInterested,
    handleSetActiveMarketOverlayPropertyLists,
    handleSetWizard,
    handleUpdateFavorites,
    isSmallLoading,
    lang,
    loggedInUser,
    preMarketProperties,
    preMarketStats,
    setMarketOverlayProperty,
    setSplashScreen,
    splashScreen,
    type,
    userSearchProfiles,
    windowDimensions,
    wizard,
  } = props;

  const localTransifex = typeof Transifex !== 'undefined' ? Transifex : null;
  const drawerRef = useRef(null);
  const sliderInstance = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [totalSlide, setTotalSlide] = useState(preMarketProperties.total);
  const [newPreMarketStats, setNewPreMarketStats] = useState(preMarketStats);

  const updateData = useCallback(() => {
    const wrapCarousel = document.getElementById('overlayCarousel');
    wrapCarousel.classList.remove('animate');
    if (wrapCarousel) {
      const getAllslides = wrapCarousel.getElementsByClassName('slick-slide');
      let activeIndex;
      for (let numSlide = 0; numSlide < getAllslides.length; numSlide += 1) {
        if (getAllslides[numSlide] && getAllslides[numSlide].classList.contains('slick-active')) {
          activeIndex = numSlide;
        }
      }
      if (activeIndex !== activeSlide) {
        let inactiveNum = 0;
        for (let num = 0; num < getAllslides.length; num += 1) {
          if (getAllslides[num]) {
            getAllslides[num].className = 'slick-slide';
            if (activeIndex === num) {
              getAllslides[num].classList.add('active', 'slick-active', 'slick-current');
            } else if (activeIndex > num) {
              getAllslides[num].classList.add('done');
            } else {
              getAllslides[num].classList.remove(`space-${inactiveNum}`);
              getAllslides[num].classList.add('toDo');
              getAllslides[num].classList.add(`space-${inactiveNum}`);
              inactiveNum += 1;
            }
          }
        }
        setActiveSlide(activeIndex);
        setTimeout(() => {
          wrapCarousel.classList.remove('animateCard');
        }, 1000);
        const timeDelay = activeIndex > activeSlide ? 500 : 1000;
        setTimeout(() => {
          const removeEl = document.getElementsByClassName('cloneElement');
          while (removeEl[0]) {
            removeEl[0].parentNode.removeChild(removeEl[0]);
          }
        }, timeDelay);
      }
    }
    return null;
  }, [activeSlide, preMarketProperties]);

  useEffect(() => {
    setNewPreMarketStats(preMarketStats);
  }, [preMarketStats]);

  useEffect(() => {
    const cookieWizardPreMarket = getCookie('wizardPreMarket');
    if (activeMarketOverlayPropertyLists && !cookieWizardPreMarket && splashScreen !== 'marketOverlay') {
      setTimeout(() => {
        handleSetWizard({ type: 'preMarketOverlay', step: 1 });
      }, 1500);
    }
  }, [activeMarketOverlayPropertyLists]);

  useEffect(() => {
    if (get(wizard, 'type', null) === 'preMarketOverlay' && get(wizard, 'step', null) === 1 && windowDimensions.width < 768) {
      setTimeout(() => {
        const getModal = document.getElementsByClassName('wrapSplash')[0];
        const scrollContainer = getModal.getElementsByClassName('ov-a')[0];
        scrollContainer.scrollTo({ top: 1400, behavior: 'smooth' });
      }, 1000);
    }
  }, [get(wizard, 'type', null)]);

  useEffect(() => {
    updateData();
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (sliderInstance.current) {
      if (typeof Transifex !== 'undefined') {
        Transifex.live.translateTo(lang);
      }
    }
  }, [sliderInstance.current, localTransifex, lang]);

  useEffect(() => {
    if (activeSlide && activeMarketOverlayPropertyLists && activeMarketOverlayPropertyLists.length - 3 === activeSlide) {
      const profileID = get(userSearchProfiles, '[0].id', null);
      const data = {
        overlayCard: true,
        resultsPerPage: preMarketProperties.quantity,
        offset: preMarketProperties.offset + preMarketProperties.quantity,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
      };
      if (profileID) set(data, 'searchProfileId', profileID);
      handleGetPreMarketProperties(data);
    }
  }, [activeSlide]);

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(drawerRef, {
    action: 'function',
    func: () => {
      if (closeOutside === true) {
        document.body.classList.remove('ov-h');
        history.push(closeLink);
      }
    },
  });

  const closeOverlay = () => {
    setSplashScreen('');
    setMarketOverlayProperty({});
    handleSetActiveMarketOverlayPropertyLists(null);
    const data = {
      resultsPerPage: 10,
      offset: 0,
      order: 'updatedAt',
      direction: 'DESC',
      setAsSingle: true,
      multiLoader: true,
      searchProfileId: get(userSearchProfiles[0], 'id', null),
      resultType: get(history, 'location.pathname', '').includes('buy') ? 'buyer' : 'seller',
    };
    handleGetNewProperties(data);
    handleGetPreMarketProperties(data);
    handleGetPremiumProperties(data);
    handleGetFavoritesProperties(data);
    const dataWishList = {
      resultsPerPage: 10,
      offset: 0,
      order: 'updatedAt',
      direction: 'DESC',
      setAsSingle: true,
      multiLoader: true,
      ownerId: loggedInUser.id,
      isBuyer: true,
    };
    handleGetWishlistProperties(dataWishList);
    handleGetPremarketStats({ id: data.searchProfileId });
  };

  const checkFavorite = () => {
    let findIndex = -1;
    if (favoritesProperties.data) {
      findIndex = favoritesProperties.data.findIndex((prop) => prop.id === activeMarketOverlayProperty.id);
      if (activeMarketOverlayPropertyLists && activeSlide >= 0) {
        findIndex = favoritesProperties.data.findIndex((prop) => prop.id === activeMarketOverlayPropertyLists[activeSlide].id);
      }
    }
    return findIndex > -1;
  };

  const saveFavorite = (action) => {
    let property = activeMarketOverlayProperty;
    const slider = sliderInstance.current;
    if (activeMarketOverlayPropertyLists && activeMarketOverlayPropertyLists.length > 0) property = activeMarketOverlayPropertyLists[activeSlide];
    if (activeMarketOverlayPropertyLists && activeMarketOverlayPropertyLists.length > 1 && activeMarketOverlayPropertyLists.length === activeSlide + 1) {
      setActiveSlide(0);
      slider.slickGoTo(0);
    } else if (sliderInstance.current && activeMarketOverlayPropertyLists && activeMarketOverlayPropertyLists.length > 0) {
      const data = {
        act: action,
        id: property.id,
        property,
        data: {
          email: get(loggedInUser, 'email', ''),
          language: loggedInUser.lang,
        },
      };
      handleUpdateFavorites(data);
      slider.slickNext();
      const wrapCarousel = document.getElementById('overlayCarousel');
      wrapCarousel.classList.add('actionActive');
      const itm = wrapCarousel.getElementsByClassName('slick-current')[0];
      const cln = itm.cloneNode(true);
      wrapCarousel.appendChild(cln).className = 'cloneElement favorite';
      const listProp = cloneDeep(activeMarketOverlayPropertyLists);
      listProp.splice(activeSlide, 1);
      handleSetActiveMarketOverlayPropertyLists(listProp);
      // setActiveSlide(activeSlide + 1);
      updateData();
      setNewPreMarketStats({ ...newPreMarketStats, likedTotal: newPreMarketStats.likedTotal + 1, total: newPreMarketStats.total - 1 });
      setTimeout(() => {
        const removeEl = document.getElementsByClassName('cloneElement');
        while (removeEl[0]) {
          removeEl[0].parentNode.removeChild(removeEl[0]);
        }
        wrapCarousel.classList.remove('actionActive');
      }, 500);
      setTotalSlide(totalSlide - 1);
    }
  };

  const notInterested =() => {
    let propID = activeMarketOverlayProperty.id;
    const slider = sliderInstance.current;
    if (activeMarketOverlayPropertyLists && activeMarketOverlayPropertyLists.length > 0) propID = activeMarketOverlayPropertyLists[activeSlide].id;
    if (activeMarketOverlayPropertyLists && activeMarketOverlayPropertyLists.length > 1 && activeMarketOverlayPropertyLists.length === activeSlide + 1) {
      setActiveSlide(0);
      slider.slickGoTo(0);
    } else if (activeMarketOverlayPropertyLists && activeMarketOverlayPropertyLists.length > 0) {
      handleMarkNotInterested(propID);
      slider.slickNext();
      const wrapCarousel = document.getElementById('overlayCarousel');
      wrapCarousel.classList.add('actionActive');
      const itm = wrapCarousel.getElementsByClassName('slick-current')[0];
      const cln = itm.cloneNode(true);
      wrapCarousel.appendChild(cln).className = 'cloneElement discard';
      const listProp = cloneDeep(activeMarketOverlayPropertyLists);
      listProp.splice(activeSlide, 1);
      handleSetActiveMarketOverlayPropertyLists(listProp);
      // setActiveSlide(activeSlide + 1);
      updateData();
      setNewPreMarketStats({ ...newPreMarketStats, dislikedTotal: newPreMarketStats.dislikedTotal + 1, total: newPreMarketStats.total - 1 });
      setTimeout(() => {
        const removeEl = document.getElementsByClassName('cloneElement');
        while (removeEl[0]) {
          removeEl[0].parentNode.removeChild(removeEl[0]);
        }
        wrapCarousel.classList.remove('actionActive');
      }, 500);
      setTotalSlide(totalSlide - 1);
    } else {
      closeOverlay();
    }
  };

  return (
    <>
      <div className={`dis-f p-2 a-c jc-fe ${type !== 'marketOverlayCarousel' ? 'pos-a w-perc-100' : ''}`}>
        {
          !get(wizard, 'type', null) && (
            <BrixelButtonIcon
              className="pos-r zIndex1"
              ghost
              theme="dark"
              icon="close-small"
              onClick={() => closeOverlay()}
            />
          )
        }
      </div>

      <div className={`middle-part ${type === 'marketOverlayCarousel' ? 'slider-card' : 'static-card'} ${showContent ? 'opacity10' : 'opacity0'} ${type !== 'marketOverlayCarousel' ? '' : 'pos-r zIndex1'} ${type !== 'marketOverlayCarousel' ? 'fullScreenCard' : ''}`} id="wizard-preMarketOverlay-parent">
        {
          get(wizard, 'type', null) && type === 'marketOverlayCarousel' && (
            <WizardCard lang={lang} />
          )
        }
        {
          type !== 'marketOverlayCarousel' && (
            <div className="carousel3d open m-0 h-perc-100" id="overlayCarousel">
              <MarketCardOverlay
                lang={lang}
                item={activeMarketOverlayProperty}
                fullCard
              />
            </div>
          )
        }

      </div>
      {
        type !== 'marketOverlayCarousel' && (
          <div className="fixed-footer dis-fl-row a-c pos-r w-perc-100 p-3 shadow-1dp jc-c pos-r zIndex2">
            <div className="dis-fl-row jc-c a-c">
              {
                (activeMarketOverlayPropertyLists || !get(activeMarketOverlayProperty, 'tags', []).includes('premium')) && (
                  <BrixelButtonIcon
                    rounded
                    secondary
                    className="mr-4"
                    theme="red"
                    onClick={() => notInterested()}
                    icon="close-small"
                    isLoading={isSmallLoading === `notInterested-${activeMarketOverlayProperty.id}`}
                  />
                )
              }
              <BrixelButtonIcon
                rounded
                secondary
                theme="green"
                onClick={() => saveFavorite(checkFavorite() ? 'remove' : 'add')}
                icon={checkFavorite() ? 'favorite-fill' : 'favorite'}
                isLoading={isSmallLoading === `favorite-${activeMarketOverlayProperty.id}`}
              />
            </div>
          </div>
        )
      }
    </>
  );
};

SplashScreen.propTypes = {
  activeMarketOverlayProperty: PropTypes.object,
  activeMarketOverlayPropertyLists: PropTypes.arrayOf(PropTypes.object),
  closeLink: PropTypes.string,
  closeOutside: PropTypes.bool,
  favoritesProperties: PropTypes.object,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremarketStats: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetWishlistProperties: PropTypes.func.isRequired,
  handleMarkNotInterested: PropTypes.func.isRequired,
  handleSetActiveMarketOverlayPropertyLists: PropTypes.func.isRequired,
  handleSetWizard: PropTypes.func.isRequired,
  handleUpdateFavorites: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object,
  preMarketProperties: PropTypes.object,
  preMarketStats: PropTypes.object.isRequired,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  splashScreen: PropTypes.string,
  type: PropTypes.string.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
  windowDimensions: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
};

SplashScreen.defaultProps = {
  activeMarketOverlayProperty: {},
  activeMarketOverlayPropertyLists: [],
  closeLink: null,
  closeOutside: false,
  favoritesProperties: {},
  loggedInUser: {},
  preMarketProperties: {},
  splashScreen: null,
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  activeMarketOverlayProperty: get(state, 'property.activeMarketOverlayProperty', {}),
  activeMarketOverlayPropertyLists: get(state, 'property.activeMarketOverlayPropertyLists', null),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  preMarketProperties: get(state, 'market.preMarketProperties', {}),
  preMarketStats: get(state, 'market.preMarketStats', {}),
  splashScreen: get(state, 'common.splashScreenType', null),
  userSearchProfiles: get(state, 'user.userSearchProfiles', {}),
  wizard: get(state, 'common.wizard', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetPremarketStats: bindActionCreators(getPremarketStats, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
  handleMarkNotInterested: bindActionCreators(addNotInterested, dispatch),
  handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
  handleSetWizard: bindActionCreators(setWizard, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
