/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, Suspense, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonIcon,
  initializeForm,
  BrixelTabs,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import lazyWithRetry from '../../components/LazyWithRetry';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import { setSplashType, setHistory } from '../../actions/CommonActions';
import { setEstimation, setActiveMarketOverlayProperty } from '../../actions/PropertyActions';
import MarketCardSmall from '../../components/Cards/MarketCardSmall';
import SearchProfileBanner from '../../components/SearchProfileBanner';
import teaserAnimation from '../../images/Market/teaserAnimate.svg';
import { createUserSearchProfile } from '../../actions/SearchProfileActions';

const CarouselWrapper = lazyWithRetry(() => import('../../components/CarouselWrapper'));

const MarketCategoryListBuyer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const settingSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    arrows: false,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
          draggable: true,
        },
      },
      {
        breakpoint: 590,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          draggable: true,
        },
      },
    ],
    draggable: false,
  };

  const sliderInstance = useRef(null);

  // PROPS
  const {
    initialValues,
    initForm,
    ownerEstimations,
    preMarketStats,
    premiumEuropeProperties,
    premiumProperties,
    setSplashScreen,
    splashScreenType,
    userSearchProfiles,
    wishlistProperties,
    windowDimensions,
  } = props;
  // STATE
  const [numWishProp, setWishProp] = useState(4);
  const [activeTopTab, setActiveTopTab] = useState('wishlist');
  const [topTab, setTopTab] = useState([]);

  useEffect(() => {
    if (get(userSearchProfiles, 'id', null)) initForm(initialValues);
  }, [get(userSearchProfiles, 'id', null)]);

  const showArrow = () => {
    const selectResponsive = settingSlider.responsive.filter((itm) => windowDimensions.width < itm.breakpoint);
    if (selectResponsive[selectResponsive.length - 1]) {
      return ownerEstimations.total > selectResponsive[selectResponsive.length - 1].settings.slidesToShow;
    }
    return ownerEstimations.total > settingSlider.slidesToShow;
  };

  useEffect(() => {
    if (has(ownerEstimations, 'total') && has(wishlistProperties, 'total')) {
      const tabMenu = [];
      if (wishlistProperties.total > 0) tabMenu.push({ label: 'Wishlist', value: 'wishlist' });
      if (ownerEstimations.total > 0) tabMenu.push({ label: 'Estimations', value: 'estimations' });
      if (ownerEstimations.total > 0 && wishlistProperties.total === 0) setActiveTopTab('estimations');
      setTopTab(tabMenu);
    }
  }, [ownerEstimations.total, wishlistProperties.total]);

  // Update data by user screen
  useEffect(() => {
    if (windowDimensions.width < 768) setWishProp(1);
    else if (windowDimensions.width < 1024) setWishProp(3);
    else if (windowDimensions.width < 1440) setWishProp(4);
    else setWishProp(4);
  }, [windowDimensions.width]);

  // Update market card when bestimate changes
  useEffect(() => {
    if (getCookie('brixelSplashHome') === 'buyerWelcome') {
      setSplashScreen('buyerWelcome');
    }
  }, [getCookie('brixelSplashHome')]);

  const onCloseWelcome = () => {
    setCookie('brixelMarketWelcome', true);
    setCookie('brixelSplashHome', null);
    setSplashScreen('');
  };

  useEffect(() => {
    const catList = document.getElementsByClassName('market-container')[0];
    if (catList) catList.classList.add('market-listings');
    return () => {
      if (catList) catList.classList.remove('market-listings');
    };
  }, []);

  const moveSlide = (action) => {
    const slider = sliderInstance.current;
    if (slider) {
      if (action === 'next') slider.slickNext();
      else slider.slickPrev();
    }
  };

  return (
    <Suspense fallback="">
      <div className="buyerMarket">
        {/* SECTION: buyer welcome message  */}
        {
          splashScreenType === 'buyerWelcome' && (
            <SplashScreen
              className="result-popup centered"
              closeOutside={false}
            >
              <div className="dis-f jc-fe mb-2">
                <BrixelButtonIcon
                  ghost
                  theme="dark"
                  icon="close-small"
                  onClick={() => onCloseWelcome()}
                />
              </div>
              <div className="dis-fl-col jc-c a-c pb-2">
                <h3>Welcome 🖐 </h3>
                <span className="txtDark200 pt-2 pb-5"> This is our Brixel market. A place where you can do great things. </span>
                <div className="mb-5">
                  <div className="dis-f mb-2">
                    <div className="dis-f a-c min-w-fix-64 jc-fe">
                      <BrixelIcon
                        icon="favorite-fill"
                        color="red"
                      />
                    </div>
                    <span className="max-w-fix-424 txtDark700 pl-2"> Manage your favorites and buy your new home directly on Brixel.</span>
                  </div>
                  <div className="dis-f mb-2">
                    <div className="dis-f a-c min-w-fix-64 jc-fe">
                      <span className="category-tag bgPrimary300">
                        Pre
                      </span>
                    </div>
                    <span className="max-w-fix-424 txtDark700 pl-2"> Discover exclusive properties which are not on the market yet, but waiting for your first move.</span>
                  </div>
                  <div className="dis-f">
                    <div className="dis-f a-c min-w-fix-64 jc-fe">
                      <span className="category-tag bgRed400">
                        Premium
                      </span>
                    </div>
                    <span className="max-w-fix-424 txtDark700 pl-2"> Explore our Premium properties with 3D tour, detailed documentation and verified informations.</span>
                  </div>
                </div>
                <BrixelButtonPrimary
                  label="ok, got it!"
                  rounded
                  onClick={() => onCloseWelcome()}
                />
              </div>
            </SplashScreen>
          )
        }

        <div className="container">
          {
            topTab.length > 0 && (
              <BrixelTabs
                className="mb-2"
                clicksList={topTab.map((item) => item.value)}
                labels={topTab.map((item) => item.label)}
                activeTab={activeTopTab}
                onClick={(tab) => setActiveTopTab(tab)}
              />
            )
          }

          {/* WHISHLIST */}
          {
            get(wishlistProperties, 'data', []).length > 0 && activeTopTab === 'wishlist' && (
              <div>
                <div className="dis-f jc-b">
                  <div className={`row-cols-${numWishProp}-gut-4 w-perc-100`}>
                    {
                      get(wishlistProperties, 'data', []).map((fav, i) => (
                        <React.Fragment key={`wsh_${i.toString()}`}>
                          {
                            i < numWishProp && (
                              <MarketCardSmall
                                type="fav"
                                item={fav}
                              />
                            )
                          }
                        </React.Fragment>
                      ))
                    }
                  </div>
                  {
                    get(wishlistProperties, 'data', []).length > numWishProp && (
                      <div
                        className="brdSmall brdRadius dis-f a-c jc-c brdPrimary400 min-w-fix-80 h-fix-80 ml-4 cur-poi"
                        onClick={() => history.push('/buy/wishlist')}
                      >
                        <span className="txtGreen400 fweight-600 fsize-500">
                          + {get(wishlistProperties, 'data', []).length - numWishProp}
                        </span>
                      </div>
                    )
                  }
                </div>
              </div>
            )
          }

          {/* ESTIMATIONS */}
          {
            get(ownerEstimations, 'data', []).length > 0 && activeTopTab === 'estimations' && (
              <div>
                <div className="dis-f a-c jc-b">
                  <div className={showArrow() ? 'slide-with-arrow' : 'slide-without-arrow'}>
                    {
                      showArrow() ? (
                        <Slider ref={sliderInstance} {...settingSlider}>
                          {
                            get(ownerEstimations, 'data', []).map((fav, i) => (
                              <div
                                key={`ownProp_${i.toString()}`}
                                className="max-w-fix-sm-304"
                              >
                                <MarketCardSmall
                                  key={`ownPro_${i.toString()}`}
                                  type="estimation"
                                  estimation={fav.result}
                                  item={fav.data}
                                />
                              </div>
                            ))
                          }
                        </Slider>
                      ) : (
                        <div className={`row-cols-${ownerEstimations.total}-gut-4`}>
                          {
                            get(ownerEstimations, 'data', []).map((fav, i) => (
                              <MarketCardSmall
                                key={`ownEst_${i.toString()}`}
                                type="estimation"
                                estimation={fav.result}
                                item={fav.data}
                              />
                            ))
                          }
                        </div>
                      )
                    }
                  </div>
                  {
                    showArrow() && (
                      <div className="dis-f a-c jc-c w-perc-100 pl-2">
                        <BrixelButtonIcon
                          onClick={() => moveSlide('prev')}
                          icon="arrow-simple-left"
                          theme="light"
                          saturation={400}
                          secondary
                          small
                        />
                        <BrixelButtonIcon
                          className="ml-1"
                          onClick={() => moveSlide('next')}
                          icon="arrow-simple-right"
                          theme="light"
                          saturation={400}
                          secondary
                          small
                        />
                      </div>
                    )
                  }
                </div>
              </div>
            )
          }

        </div>

        <div className={`${get(wishlistProperties, 'data', []).length <= 0 && get(ownerEstimations, 'data', []).length <= 0 ? 'mt-3-neg pt-3' : 'mt-5'} bgSvg bgOverlay`}>

          <div className="container pt-3 pb-4 pb-lg-8">

            {/* SEARCH PROFILE */}
            <div className="">
              <SearchProfileBanner
                preMarketStats={preMarketStats}
                onStatsFunc={{ matching: () => setSplashScreen('marketOverlayCarousel') }}
              />
            </div>

            <div className="dis-f jc-fe-lg pt-1 pt-lg-9 mt-9 mt-lg-10 infoBannerMarketBuyer">
              <div className="w-perc-md-50 w-perc-100">
                <h3 className="max-w-fix-320 fweight-600 fsize-800">
                  <span>There are</span>
                  <span className="mx-small-4 txtBlue700">{preMarketStats.total}</span>
                  <span className="mx-small-4 txtBlue700">new properties</span>
                  <span>on our Pre-Market.</span>
                </h3>
                <h5 className="fweight-400 mt-3 txtDark700">
                  Be ahead of the market.
                </h5>
                <BrixelButtonPrimary
                  onClick={() => setSplashScreen('marketOverlayCarousel')}
                  className="mt-3 mt-lg-5"
                  rounded
                  label="Rate them now"
                />
              </div>

            </div>
          </div>

        </div>
        {
          windowDimensions.width < 1025 && (
            <div className="bgBlue200">
              <object width="100%" data={teaserAnimation}> </object>
            </div>
          )
        }

        <div className="mt-7 pb-8 container">
          {
            premiumProperties.total > 0 && (
              <CarouselWrapper
                title="Premium properties"
                className="market-category-carousel"
                type="premium"
                items={premiumProperties.data}
                total={premiumProperties.total}
              />
            )
          }
        </div>

        <div className="pt-7 pb-8 bgBlue700">
          {
            premiumEuropeProperties.total > 0 && (
              <div className="container">
                <CarouselWrapper
                  theme="light"
                  title="Explore"
                  subtitle="Random Brixel properties all over Europe"
                  className="market-category-carousel"
                  type="premium"
                  items={premiumEuropeProperties.data}
                  total={premiumEuropeProperties.total}
                />
              </div>
            )
          }
        </div>
      </div>
    </Suspense>
  );
};

MarketCategoryListBuyer.propTypes = {
  estimation: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  ownerEstimations: PropTypes.object.isRequired,
  preMarketStats: PropTypes.object.isRequired,
  premiumEuropeProperties: PropTypes.object.isRequired,
  premiumProperties: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  splashScreenType: PropTypes.string.isRequired,
  userSearchProfiles: PropTypes.object,
  windowDimensions: PropTypes.object.isRequired,
  wishlistProperties: PropTypes.object.isRequired,
};

MarketCategoryListBuyer.defaultProps = {
  userSearchProfiles: null,
};

const mapStateToProps = (state) => {
  const searchProfile = get(state, 'user.userSearchProfiles', []);
  const initVal = searchProfile ? searchProfile[searchProfile.length - 1] : searchProfile;
  const userCompany = get(state, 'user.loggedInUser.user.comapny', {});
  return ({
    estimation: get(state, 'property.estimation', {}),
    favoritesProperties: get(state, 'market.favoritesProperties', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    initialValues: {
      ...initVal,
      countryCode: get(initVal, 'location[0].countryCode', get(userCompany, 'country.code', 'CH')),
      finance: {
        ...get(initVal, 'finance', {}),
        currency: get(initVal, 'finance.currency', get(userCompany, 'country.currency', 'CHF')),
      },
      location: {
        countryCode: get(initVal, 'location[0].countryCode', get(userCompany, 'country.code', 'CH')),
      },
      locations: get(state, 'user.userSearchProfiles[0].location', []),
    },
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'user.loggedInUser.user.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    newProperties: get(state, 'market.newProperties', {}),
    ownerEstimations: get(state, 'market.ownerEstimations', {}),
    preMarketProperties: get(state, 'market.preMarketProperties', {}),
    preMarketStats: get(state, 'market.preMarketStats', {}),
    premiumEuropeProperties: get(state, 'market.premiumEuropeProperties', {}),
    premiumProperties: get(state, 'market.premiumProperties', {}),
    splashScreenType: get(state, 'common.splashScreenType', ''),
    userSearchProfiles: searchProfile ? searchProfile[searchProfile.length - 1] : searchProfile,
    windowDimensions: get(state, 'common.windowDimensions', {}),
    wishlistProperties: get(state, 'market.wishlistProperties', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('GetStarted', value));
  },
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListBuyer);
