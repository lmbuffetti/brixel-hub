/* eslint-disable react-hooks/exhaustive-deps */
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon, BrixelTabs } from '@brixel/brixel-components';
import get from 'lodash/get';
import has from 'lodash/has';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { bindActionCreators, compose } from 'redux';
import { setHistory, setSplashType } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import MarketCard from '../../components/Cards/MarketCard';
import { setActiveMarketOverlayProperty, setEstimation } from '../../actions/PropertyActions';
import MarketCardSmall from '../../components/Cards/MarketCardSmall';
import lazyWithRetry from '../../components/LazyWithRetry';
import Pagination from '../../components/Pagination';
import SearchProfileBanner from '../../components/SearchProfileBanner';
import SearchProfileField from '../../components/SearchProfileField';
import SplashScreen from '../../components/SplashScreen';
import teaserAnimation from '../../images/Market/teaserAnimate.svg';
import searchProfileDeskImg from '../../images/Market/searchProfileDesk.svg';
import searchProfileMobileImg from '../../images/Market/searchProfileMobile.svg';
import { QuestionsList } from '../../resources/Flows/onBoardingBuyer';
import { titleSearchProfile } from '../../utils/titleCreationSearchProfile';
import translateTo from '../../utils/translation';

const CarouselWrapper = lazyWithRetry(() => import('../../components/CarouselWrapper'));
const SearchProfileModal = lazyWithRetry(() => import('./SearchProfile/SearchProfileModal'));

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
    allProperties,
    activeSearchProfile,
    handleGetActiveSingleCompany,
    lang,
    loggedInUser,
    onPageChange,
    ownerEstimations,
    page,
    preMarketStats,
    premiumEuropeProperties,
    premiumProperties,
    setSplashScreen,
    splashScreenType,
    userSearchProfiles,
    windowDimensions,
    wishlistProperties,
  } = props;
  // STATE
  const [numWishProp, setWishProp] = useState(4);
  const [activeTopTab, setActiveTopTab] = useState('wishlist');
  const [topTab, setTopTab] = useState([]);
  const [fieldsSearchProfile, setFieldsSearchProfile] = useState([]);
  
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fields = [...fieldsSearchProfile];
    QuestionsList('en', 'searchProfile').forEach((inputs) => {
      if (inputs.inputs) {
        inputs.inputs.forEach((field) => {
          if (field.name !== 'location.countryCode') {
            if (field.name.includes('location')) fields.push('location');
            else if (!field.name.includes('register')) fields.push(field.name);
          }
        });
      }
    });
    setFieldsSearchProfile(fields);
  }, []);

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
  
  useEffect(() => {
    if (get(loggedInUser, 'id', null)) {
      let cmpID;
      if (loggedInUser.company) cmpID = loggedInUser.company.id;
      else if (loggedInUser.companies) cmpID = loggedInUser.companies[0];
      handleGetActiveSingleCompany({id: cmpID});
    }
  }, [loggedInUser.id]);
  
  
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
    <>
      {
        get(history, 'location.pathname', '').includes('searchProfile') && (
          <SearchProfileModal />
        )
      }
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
                  <h3>{translateTo('Welcome 🖐', lang)}</h3>
                  <span className="txtDark200 pt-2 pb-5">
                    {translateTo('This is our Brixel market. A place where you can do great things.', lang)}
                  </span>
                  <div className="mb-5">
                    <div className="dis-f mb-2">
                      <div className="dis-f a-c min-w-fix-64 jc-fe">
                        <BrixelIcon
                          icon="favorite-fill"
                          color="red"
                        />
                      </div>
                      <span className="max-w-fix-424 txtDark700 pl-2">
                        {translateTo('Manage your favorites and buy your new home directly on Brixel.', lang)}
                      </span>
                    </div>
                    <div className="dis-f mb-2">
                      <div className="dis-f a-c min-w-fix-64 jc-fe">
                        <span className="category-tag bgPrimary300">
                          {translateTo('Pre', lang)}
                        </span>
                      </div>
                      <span className="max-w-fix-424 txtDark700 pl-2">
                        {translateTo('Discover exclusive properties which are not on the market yet, but waiting for your first move.', lang)}
                      </span>
                    </div>
                    <div className="dis-f">
                      <div className="dis-f a-c min-w-fix-64 jc-fe">
                        <span className="category-tag bgRed400">
                          {translateTo('Premium', lang)}
                        </span>
                      </div>
                      <span className="max-w-fix-424 txtDark700 pl-2">
                        {translateTo('Explore our Premium properties with 3D tour, detailed documentation and verified informations.', lang)}
                      </span>
                    </div>
                  </div>
                  <BrixelButtonPrimary
                    label={translateTo('ok, got it!', lang)}
                    rounded
                    onClick={() => onCloseWelcome()}
                  />
                </div>
              </SplashScreen>
            )
          }
  
          { /* WHISLIST AND ESTIMATION PROPERTIES */}
          <div className="container">
            {
              topTab.length > 0 && (
                <BrixelTabs
                  className="mb-2"
                  clicksList={topTab.map((item) => item.value)}
                  labels={topTab.map((item) => translateTo(item.label, lang))}
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
                                  lang={lang}
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
                      get(wishlistProperties, 'total', 0) > numWishProp && (
                        <div
                          className="brdSmall brdRadius dis-f a-c jc-c brdPrimary400 min-w-fix-80 h-fix-80 ml-4 cur-poi"
                          onClick={() => history.push('/buy/wishlist')}
                        >
                          <span className="txtGreen400 fweight-600 fsize-500">
                            + {get(wishlistProperties, 'total', 0) - numWishProp}
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
                                    lang={lang}
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
                                  lang={lang}
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
  
          { /* SEEARCH PROFILE */}
          <div className="bgBlue100 mt-10">
            {
              !userSearchProfiles ? (
                <div className="container py-10">
                  <div className="w-perc-100 ov-h brdRadius h-fix-md-152 mb-4 dis-f">
                    <div className="ml-md-4 ml-2 h-perc-100 dis-fl-col a-c w-perc-100 py-2 ta-c">
                      <p className="h-fix-40 skeletonBgInner w-perc-60"> </p>
                      <p className="h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-30"> </p>
                      <p className="h-fix-16 mt-a-md mt-2 skeletonBgInner w-perc-50"> </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="container">
                  {
                    activeSearchProfile.id ? (
                      <div className="dis-f jc-b-lg a-c py-10">
                        <div className="w-perc-100 ta-c">
                          <Link
                            className="fweight-600 td-u"
                            to='/buy/searchProfile'
                          >
                            {translateTo('Manage Search Profiles', lang)}
                          </Link>
                          <h3 className="txtBlue700 fweight-600 mt-4">
                            {get(activeSearchProfile, 'name', null) || titleSearchProfile(activeSearchProfile, lang)}
                          </h3>
                          <p>
                            {translateTo('Search profiles allow you to keep track of the properties that match your needs.', lang)}
                          </p>
                          <div className="dis-f flex-wrap a-t jc-c mt-4">
                            {
                              fieldsSearchProfile.map((field, index) => (
                                <React.Fragment key={`search${index.toString()}`}>
                                  {
                                    field !== 'isDefault' && field !== 'name' && (
                                      <>
                                        <SearchProfileField
                                          onClick={() => history.push(`/buy/searchProfile/edit/${activeSearchProfile.id}`, {state: { state: '/buy' }})}
                                          searchProfile={activeSearchProfile}
                                          field={field}
                                          lang={lang}
                                        />
                                      </>
                                    )
                                  }
                                </React.Fragment>
                              ))
                            }
                            <BrixelIcon
                              background="white"
                              saturation={0}
                              color="green"
                              icon="settings"
                              rounded
                              iconSize="large"
                              iconWidth={48}
                              onClick={() => history.push(`/buy/searchProfile/edit/${activeSearchProfile.id}`, {state: { url: '/buy' }})}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="dis-f jc-b-lg a-c flex-wrap">
                        {
                          windowDimensions.width <= 768 && (
                            <div className="mx-a">
                              <img src={searchProfileMobileImg} alt="Search Profile" />
                            </div>
                          )
                        }
                        <div className="w-perc-md-50 w-perc-100 pb-8 pb-md-0 ta-c ta-l-md">
                          <h3 className="txtBlue700 fweight-600 mt-4 mt-md-0">
                            {translateTo('Search Profile')}
                          </h3>
                          <p>
                            {translateTo('Create different search profiles to keep track of the properties that match your needs.', lang)}
                          </p>
                          <BrixelButtonPrimary
                            onClick={() => history.push('/buy/searchProfile')}
                            className="mt-3 mt-lg-5 mx-a mx-md-0"
                            rounded
                            label={translateTo('Create search Profile', lang)}
                          />
                        </div>
                        {
                          windowDimensions.width > 768 && (
                            <div className="w-perc-50">
                              <img src={searchProfileDeskImg} alt="Search Profile" />
                            </div>
                          )
                        }
                      </div>
                    )
                  }
                </div>
              )
            }

          </div>

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
  
          {
            premiumEuropeProperties.total > 0 && (
              <div className="pt-7 pb-8 bgBlue700">
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
              </div>
            )
          }

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
                    <span>{translateTo('There are', lang)}</span>
                    <span className="mx-small-4 txtBlue700">{preMarketStats.total}</span>
                    <span className="mx-small-4 txtBlue700">
                      {translateTo('new properties', lang)}
                    </span>
                    <span>{translateTo('on our Pre-Market.', lang)}</span>
                  </h3>
                  <h5 className="fweight-400 mt-3 txtDark700">
                    {translateTo('Be ahead of the market.', lang)}
                  </h5>
                  <BrixelButtonPrimary
                    onClick={() => setSplashScreen('marketOverlayCarousel')}
                    className="mt-3 mt-lg-5"
                    rounded
                    label={translateTo('Rate them now', lang)}
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
          
          <div className="container">
            <div className="ta-c max-w-fix-264 mx-a my-5">
              <h4 className="fweight-600">
                <span>{get(allProperties, 'total', 0)}</span>
                <span className="ml-1">{translateTo('Results', lang)}</span>
              </h4>
              <p className="txtAltGrey700 fSizePx14">
                {translateTo('Properties could already be for sale or still in the Pre-Market. Learn more.', lang)}
              </p>
            </div>
            <div className="row-cols-3-gut-3">
              {
                get(allProperties, 'data', []).map((property, index) => (
                  <MarketCard
                    layout="singleOwnCard"
                    type="premium"
                    key={`nmCrd_${index.toString()}`}
                    item={property}
                    lang={lang}
                  />
                ))
              }
            </div>
            <div className="mb-8">
              <Pagination
                totalItems={allProperties.total}
                itemsPerPage={9}
                activePage={page[activeTab]}
                paginate={(resultsPerPage, pageNumber) => {
                  onPageChange(resultsPerPage, pageNumber, activeTab);
                }}
                showResultsPerPage={false}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

MarketCategoryListBuyer.propTypes = {
  activeSearchProfile: PropTypes.object,
  allProperties: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  onPageChange: PropTypes.func.isRequired,
  ownerEstimations: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
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
  activeSearchProfile: null,
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  allProperties: get(state, 'market.allProperties', {}),
  activeSearchProfile: get(state, 'user.activeSearchProfile', null),
  estimation: get(state, 'property.estimation', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  preMarketStats: get(state, 'market.preMarketStats', {}),
  premiumEuropeProperties: get(state, 'market.premiumEuropeProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListBuyer);
