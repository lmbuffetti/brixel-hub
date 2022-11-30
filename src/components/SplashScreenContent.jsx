/* global Transifex */
import { BrixelButtonIcon, useOutsideAlerter } from '@brixel/brixel-components';
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
  getPremiumProperties,
  getWishlistProperties,
} from '../actions/MarketActions';
import { setActiveMarketOverlayProperty, setActiveMarketOverlayPropertyLists } from '../actions/PropertyActions';
import { addNotInterested, updateFavorite } from '../actions/UserActions';
import { getCookie } from '../utils/helpers';

const SplashScreen = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeMarketOverlayPropertyLists,
    closeLink,
    closeOutside,
    handleGetFavoritesProperties,
    handleGetNewProperties,
    handleGetPreMarketProperties,
    handleGetPremiumProperties,
    handleGetWishlistProperties,
    handleSetActiveMarketOverlayPropertyLists,
    handleSetWizard,
    lang,
    loggedInUser,
    preMarketProperties,
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
    </>
  );
};

SplashScreen.propTypes = {
  activeMarketOverlayProperty: PropTypes.object,
  activeMarketOverlayPropertyLists: PropTypes.arrayOf(PropTypes.object),
  closeLink: PropTypes.string,
  closeOutside: PropTypes.bool,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetWishlistProperties: PropTypes.func.isRequired,
  handleSetActiveMarketOverlayPropertyLists: PropTypes.func.isRequired,
  handleSetWizard: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object,
  preMarketProperties: PropTypes.object,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  splashScreen: PropTypes.string,
  type: PropTypes.string.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
  windowDimensions: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
};

SplashScreen.defaultProps = {
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
  activeMarketOverlayPropertyLists: get(state, 'property.activeMarketOverlayPropertyLists', null),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  splashScreen: get(state, 'common.splashScreenType', null),
  userSearchProfiles: get(state, 'user.userSearchProfiles', {}),
  wizard: get(state, 'common.wizard', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
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
