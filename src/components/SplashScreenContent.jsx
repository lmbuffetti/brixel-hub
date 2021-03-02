import React, {
  useRef, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import {
  bindActionCreators,
  compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  BrixelButtonIcon,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import Slider from 'react-slick';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { setSplashType } from '../actions/CommonActions';
import { setActiveMarketOverlayProperty, setActiveMarketOverlayPropertyLists } from '../actions/PropertyActions';
import { updateFavorite, addNotInterested } from '../actions/UserActions';
import MarketCardOverlay from './MarketCardOverlay';
import { getNewProperties } from '../actions/MarketActions';

const SplashScreen = (props) => {
  const {
    activeMarketOverlayProperty,
    activeMarketOverlayPropertyLists,
    closeLink,
    closeOutside,
    favoritesProperties,
    handleGetNewProperties,
    handleMarkNotInterested,
    handleSetActiveMarketOverlayPropertyLists,
    handleUpdateFavorites,
    history,
    newProperties,
    isSmallLoading,
    loggedInUser,
    setMarketOverlayProperty,
    setSplashScreen,
    userSearchProfiles,
  } = props;

  const drawerRef = useRef(null);
  const sliderInstance = useRef(null);
  const [activeSlide, setActiveSlide] = useState(-1);
  const [showContent, setShowContent] = useState(false);

  const updateData = () => {
    const wrapCarousel = document.getElementById('overlayCarousel');
    if (wrapCarousel) {
      const getAllslides = wrapCarousel.getElementsByClassName('slick-slide');
      let activeIndex;
      for (let numSlide = 0; numSlide < getAllslides.length; numSlide += 1) {
        if (getAllslides[numSlide] && getAllslides[numSlide].classList.contains('slick-active')) {
          activeIndex = numSlide;
        }
      }
      if (activeIndex !== activeSlide) {
        const id = activeIndex;
        const page = (id / 10).toFixed();
        const relativeNumber = id - (10 * page);
        if (relativeNumber < 4 && getAllslides.length < newProperties.total) {
          const profileID = get(userSearchProfiles, '[0].id', null);
          const data = {
            overlayCard: true,
            resultsPerPage: 10,
            offset: (page + 1) * 10,
            order: 'updatedAt',
            direction: 'DESC',
            setAsSingle: true,
            multiLoader: true,
          };
          if (profileID) set(data, 'searchProfileId', profileID);
          handleGetNewProperties(data);
        }
        let num = 0;
        let inactiveNum = 0;
        while (getAllslides) {
          if (getAllslides[num]) {
            getAllslides[num].className = 'slick-slide';
            if (activeIndex === num) {
              getAllslides[num].classList.add('active', 'slick-active', 'slick-current');
            } else if (activeIndex - 1 === num) {
              getAllslides[num].classList.add('done', 'fadeOut');
            } else if (activeIndex > num) {
              getAllslides[num].classList.add('done');
            } else {
              getAllslides[num].classList.remove(`mt-${inactiveNum}`);
              getAllslides[num].classList.add('toDo');
              getAllslides[num].classList.add(`space-${inactiveNum}`);
              inactiveNum += 1;
            }
          } else {
            return false;
          }
          num += 1;
        }
        setActiveSlide(activeIndex);
      }
    }
  };

  const settingSlider = {
    fade: true,
    slidesToScroll: 1,
    dots: false,
    focusOnSelect: true,
    infinite: false,
    draggable: false,
    swipeToSlide: false,
    verticalSwiping: false,
    swipe: false,
    arrows: false,
    afterChange: () => {
      updateData();
    },
  };

  useEffect(() => {
    updateData();
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  }, []);

  // console.log(activeSlide);
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

  const checkFavorite = () => {
    const findIndex = favoritesProperties.data.findIndex((prop) => prop.id === activeMarketOverlayProperty.id);
    return findIndex > -1;
  };

  const saveFavorite = () => {
    let property = activeMarketOverlayProperty;
    if (activeMarketOverlayPropertyLists.length > 0) property = activeMarketOverlayPropertyLists[activeSlide];
    const data = {
      act: checkFavorite() ? 'remove' : 'add',
      id: property.id,
      property,
      data: {
        email: get(loggedInUser, 'email', ''),
        language: loggedInUser.lang,
      },
    };
    // handleUpdateFavorites(data);
    if (sliderInstance.current && activeMarketOverlayPropertyLists.length > 0) {
      // const slider = sliderInstance.current;
      // slider.slickNext();
      const wrapCarousel = document.getElementById('overlayCarousel');
      const itm = wrapCarousel.getElementsByClassName('slick-current')[0];
      const cln = itm.cloneNode(true);
      wrapCarousel.appendChild(cln).className = 'cloneElement favorite';
      const listProp = cloneDeep(activeMarketOverlayPropertyLists);
      listProp.splice(activeSlide, 1);
      handleSetActiveMarketOverlayPropertyLists(listProp);
      // setActiveSlide(activeSlide + 1);
      updateData();
      setTimeout(() => {
        const removeEl = document.getElementsByClassName('cloneElement');
        while (removeEl[0]) {
          removeEl[0].parentNode.removeChild(removeEl[0]);
        }
      }, 1000);
    }
  };

  const notInterested = () => {
    let propID = activeMarketOverlayProperty.id;
    if (activeMarketOverlayPropertyLists.length > 0) propID = activeMarketOverlayPropertyLists[activeSlide].id;
    handleMarkNotInterested(propID);
    if (activeMarketOverlayPropertyLists.length > 0) {
      // const slider = sliderInstance.current;
      // slider.slickNext();
      const wrapCarousel = document.getElementById('overlayCarousel');
      const itm = wrapCarousel.getElementsByClassName('slick-current')[0];
      const cln = itm.cloneNode(true);
      wrapCarousel.appendChild(cln).className = 'cloneElement discard';
      const listProp = cloneDeep(activeMarketOverlayPropertyLists);
      listProp.splice(activeSlide, 1);
      handleSetActiveMarketOverlayPropertyLists(listProp);
      // setActiveSlide(activeSlide + 1);
      updateData();
      setTimeout(() => {
        const removeEl = document.getElementsByClassName('cloneElement');
        while (removeEl[0]) {
          removeEl[0].parentNode.removeChild(removeEl[0]);
        }
      }, 1000);
    }
  };

  const changeProperty = (act) => {
    if (sliderInstance.current) {
      const slider = sliderInstance.current;
      if (act === 'back' && activeSlide > 0) slider.slickPrev();
      if (act === 'forward' && activeSlide < newProperties.total - 1) {
        slider.slickNext();
      }
    }
  };

  const closeOverlay = () => {
    setSplashScreen('');
    setMarketOverlayProperty({});
    handleSetActiveMarketOverlayPropertyLists([]);
  };

  return (
    <>
      <div className="dis-f jc-fe">
        <BrixelButtonIcon
          className="pos-r zIndex10"
          ghost
          theme="dark"
          icon="close-small"
          onClick={() => closeOverlay()}
        />
      </div>

      <div className={`dis-fl-col a-c jc- ${showContent ? 'opacity10' : 'opacity0'}`}>

        {
          activeMarketOverlayPropertyLists.length > 0 ? (
            <div className="carousel3d" id="overlayCarousel">
              <Slider ref={sliderInstance} {...settingSlider}>
                {
                  activeMarketOverlayPropertyLists.map((item, i) => (
                    <MarketCardOverlay
                      key={i.toString()}
                      item={item}
                    />
                  ))
                }
                <div />
                <div />
              </Slider>
            </div>
          ) : (
            <MarketCardOverlay
              item={activeMarketOverlayProperty}
            />
          )
        }

        <div className="dis-fl-row jc-b a-c pos-r w-perc-100 p-3 shadow-1dp">
          {
            activeMarketOverlayPropertyLists.length > 0 && (
              <BrixelButtonIcon
                rounded
                ghost
                theme="dark"
                onClick={() => changeProperty('back')}
                icon="arrow-left-small"
                disabled={activeSlide <= 0}
              />
            )
          }
          <div className="dis-fl-row jc-c a-c">
            <BrixelButtonIcon
              rounded
              className="mr-4"
              theme="red"
              onClick={() => notInterested()}
              icon="close-small"
              isLoading={isSmallLoading === `notInterested-${activeMarketOverlayProperty.id}`}
            />
            <BrixelButtonIcon
              rounded
              theme="green"
              onClick={() => saveFavorite()}
              icon={checkFavorite() ? 'favorite-fill' : 'favorite'}
              isLoading={isSmallLoading === `favorite-${activeMarketOverlayProperty.id}`}
            />
          </div>
          {
            activeMarketOverlayPropertyLists.length > 0 && (
              <BrixelButtonIcon
                rounded
                ghost
                theme="dark"
                onClick={() => changeProperty('forward')}
                icon="arrow-right-small"
                disabled={activeSlide >= newProperties.total}
              />
            )
          }
        </div>
      </div>
    </>
  );
};

SplashScreen.propTypes = {
  activeMarketOverlayProperty: PropTypes.object,
  activeMarketOverlayPropertyLists: PropTypes.arrayOf(PropTypes.object),
  closeLink: PropTypes.string,
  closeOutside: PropTypes.bool,
  favoritesProperties: PropTypes.object,
  handleGetNewProperties: PropTypes.func,
  handleMarkNotInterested: PropTypes.func,
  handleSetActiveMarketOverlayPropertyLists: PropTypes.func,
  handleUpdateFavorites: PropTypes.func,
  history: PropTypes.object.isRequired,
  newProperties: PropTypes.object,
  isSmallLoading: PropTypes.string,
  loggedInUser: PropTypes.object,
  setMarketOverlayProperty: PropTypes.func,
  setSplashScreen: PropTypes.func,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
};

SplashScreen.defaultProps = {
  activeMarketOverlayProperty: {},
  activeMarketOverlayPropertyLists: [],
  closeLink: null,
  closeOutside: false,
  favoritesProperties: {},
  handleGetNewProperties: () => '',
  handleMarkNotInterested: () => '',
  handleSetActiveMarketOverlayPropertyLists: () => '',
  handleUpdateFavorites: () => '',
  isSmallLoading: null,
  loggedInUser: {},
  newProperties: {},
  setMarketOverlayProperty: () => '',
  setSplashScreen: () => '',
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  activeMarketOverlayProperty: get(state, 'property.activeMarketOverlayProperty', {}),
  activeMarketOverlayPropertyLists: get(state, 'property.activeMarketOverlayPropertyLists', []),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  newProperties: get(state, 'market.newProperties', {}),
  userSearchProfiles: get(state, 'user.userSearchProfiles', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleMarkNotInterested: bindActionCreators(addNotInterested, dispatch),
  handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
