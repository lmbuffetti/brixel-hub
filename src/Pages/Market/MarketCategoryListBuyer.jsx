/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback, useEffect, lazy, Suspense, useState,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonIcon,
  BrixelDropdown,
  initializeForm,
  MultiFileldsReduxForm,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import { setSplashType, setHistory } from '../../actions/CommonActions';
import { setEstimation, getEstimation, setActiveMarketOverlayProperty } from '../../actions/PropertyActions';
import NoPropertiesImg from '../../images/searchProfile/no-found-properties.svg';
import MarketCardSmall from '../../components/MarketCardSmall';
import { QuestionsList } from '../../resources/onBoardingBuyer';

const CarouselWrapper = lazy(() => import('../../components/CarouselWrapper'));

const MarketCategoryListBuyer = (props) => {
  // PROPS
  const {
    favoritesProperties,
    formValue,
    history,
    initialValues,
    initForm,
    lang,
    loggedInUser,
    match,
    newProperties,
    preMarketProperties,
    premiumProperties,
    setSplashScreen,
    splashScreenType,
    userSearchProfiles,
    wishlistProperties,
    windowDimensions,
  } = props;
  // STATE
  const [numWhishProp, setWhishProp] = useState(4);
  const [showSearchProfileForm, setShowSearchProfileForm] = useState(false);
  const [fullForm, setFullForm] = useState([]);

  useEffect(() => {
    if (get(userSearchProfiles, '[0].id', null)) initForm(initialValues);
  }, [get(userSearchProfiles, '[0].id', null)]);

  // Update data by user screen
  useEffect(() => {
    if (windowDimensions.width < 768) setWhishProp(1);
    else if (windowDimensions.width < 1024) setWhishProp(2);
    else if (windowDimensions.width < 1440) setWhishProp(3);
    else setWhishProp(4);
  }, [windowDimensions.width]);

  useEffect(() => {
    const inputform = [];
    QuestionsList(lang, 'CH').forEach((form) => {
      inputform.push(form);
    });
    setFullForm(inputform);
  }, []);

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

  const scrollToTopEdit = () => {
    const scrollEl = document.getElementsByClassName('hubDasContent')[0];
    if (scrollEl) scrollEl.scrollTop = 0;
  };

  useEffect(() => {
    const catList = document.getElementsByClassName('market-container')[0];
    if (catList) catList.classList.add('market-listings');
    return () => {
      if (catList) catList.classList.remove('market-listings');
    };
  }, []);

  const showAll = useCallback((e, type) => {
    const baseUrl = match.url.includes('sell') ? 'sell' : 'buy';
    if (e) e.preventDefault();
    switch (type) {
      case 'own': {
        history.push(`/${baseUrl}/own`);
        break;
      }
      case 'wishlist': {
        history.push(`/${baseUrl}/wishlist`);
        break;
      }
      case 'favorite': {
        history.push(`/${baseUrl}/favorites`);
        break;
      }
      case 'new': {
        history.push(`/${baseUrl}/radar`);
        break;
      }
      case 'premium': {
        history.push(`/${baseUrl}/premium`);
        break;
      }
      case 'preMarket': {
        history.push(`/${baseUrl}/preMarket`);
        break;
      }
      case 'allMap': {
        history.push({ pathname: `/${baseUrl}/all`, state: 'showMap' });
        break;
      }
      default:
        history.push(`/${baseUrl}/all`);
    }
    scrollToTopEdit();
  }, []);

  return (
    <Suspense fallback="">
      <div>
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

        {/* WHISHLIST */}
        <div className="container">
          <h5>Whishlist</h5>
          <div className="dis-f jc-b">
            <div className={`row-cols-${numWhishProp}-gut-4 w-perc-100`}>
              {
                get(favoritesProperties, 'data', []).map((fav, i) => (
                  <React.Fragment key={i.toString()}>
                    {
                      i < numWhishProp && (
                        <MarketCardSmall
                          type="fav"
                          key={i.toString()}
                          item={fav}
                        />
                      )
                    }
                  </React.Fragment>
                ))
              }
            </div>
            {
              get(favoritesProperties, 'data', []).length > numWhishProp && (
                <div className="brdSmall brdRadius dis-f a-c jc-c brdAltGreen400 min-w-fix-80 h-fix-80 ml-4">
                  <span className="txtGreen400 fweight-600 fsize-500">
                    + {get(favoritesProperties, 'data', []).length - numWhishProp}
                  </span>
                </div>
              )
            }
          </div>
        </div>

        <div className="bgAltMist200 mt-5 pt-3">
          {/* SEARCH PROFILE */}
          <div className="container">
            <h5>Search Profile</h5>
            <div className="bgWhite brdRadius">
              {
                has(userSearchProfiles, '[0].id') ? (
                  <div
                    className="searchProfileArea py-1 px-sm-2 pr-5 pl-2 shadow-1dp dis-fl-row a-c fweight-500 txtDark500 fsize-300 flex-wrap pos-r as-b mb-3 cur-poi"
                    onClick={() => setShowSearchProfileForm(!showSearchProfileForm)}
                  >
                    <div className="dis-f">
                      {
                        get(userSearchProfiles[0], 'characteristics.propertyType', []).map((item, i) => (
                          <React.Fragment key={i.toString()}>
                            <span className="" key={i.toString()}>{item}</span>
                            <span className="px-1"> &middot; </span>
                          </React.Fragment>
                        ))
                      }
                      {
                        get(userSearchProfiles[0], 'location', []).length > 0 &&
                        get(userSearchProfiles[0], 'location', []).map((item, i) => (
                          <React.Fragment key={i.toString()}>
                            <span className="">{item.name}</span>
                            {
                              i !== userSearchProfiles[0].location.length - 1 && (
                                <span>,&nbsp;</span>
                              )
                            }
                          </React.Fragment>
                        ))
                      }
                      <span className="px-1"> &middot; </span>
                    </div>
                    <div className="dis-f">
                      <div className="dis-fl-row a-c ">
                        <span>
                          {get(userSearchProfiles[0], 'characteristics.bedrooms.min', 0)} - {get(userSearchProfiles[0], 'characteristics.bedrooms.max', 0)}
                        </span>
                        <span>&nbsp;Rooms</span>
                      </div>
                      <span className="px-1"> &middot; </span>
                      <div className="dis-fl-row a-c mr-2 ">
                        <span>
                          {get(userSearchProfiles[0], 'characteristics.livingArea.min', 0)} - {get(userSearchProfiles[0], 'characteristics.livingArea.max', 0)}
                        </span>
                        <span>&nbsp;m2</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pb-2">
                    <BrixelButtonPrimary
                      rounded
                      leftIcon="edit"
                      className="fsize-300"
                      label="Add search profile"
                      onClick={() => history.push(`/packageFlow/getStartedBuyer?company=${get(loggedInUser, 'company.stub', '')}`)}
                    />
                  </div>
                )
              }
              {
                showSearchProfileForm && (
                  <div className="row-cols-2-gut-4">
                    <MultiFileldsReduxForm
                      form="GetStarted"
                      disableNextBtn={false}
                      formValue={formValue}
                      nestedInputs={fullForm}
                      showSendButton
                    />
                  </div>
                )
              }
            </div>
          </div>
        </div>

        <div className="dis-fl-col pb-8">
          <div className="dis-fl-row jc-b flex-wrap">
            <div className="dis-fl-col mb-3">
              <h4 className="fweight-700">Discover our market</h4>
              {
                has(userSearchProfiles, '[0].id') && (
                  <span className="fsize-300"><span>There are </span> <span className="fweight-600">{get(newProperties, 'total', '')}</span><span className="fweight-600"> properties</span> <span>that match your criteria.</span></span>
                )
              }
            </div>
          </div>
          <div className="dis-fl-row a-c flex-wrap property-category">
            <div className="dis-fl-row flex-wrap a-c jc-b w-perc-100">

              {
                windowDimensions.width <= 590 ? (
                  <BrixelDropdown
                    compact
                    className="mobile-market-filter"
                    bgTransparent
                    borderColor="light"
                    bodyScrollclass="content"
                    selected="All"
                    options={[{
                      label: 'All',
                      value: 'all',
                    },
                    wishlistProperties.total > 0 && {
                      label: 'Wishlist',
                      value: 'wishlist',
                    },
                    favoritesProperties.total > 0 && {
                      label: 'Bookmarks',
                      value: 'favorites',
                    },
                    newProperties.total > 0 && {
                      label: 'New in your radar',
                      value: 'radar',
                    },
                    preMarketProperties.total > 0 && {
                      label: 'Pre-market properties',
                      value: 'preMarket',
                    },
                    premiumProperties.total > 0 && {
                      label: 'Premium properties',
                      value: 'premium',
                    }]}
                    onSelect={(e, value) => showAll(e, value.value)}
                  />
                ) : (
                  <>
                    <div className="dis-fl-row flex-wrap">
                      <BrixelButtonSecondary
                        onClick={() => showAll('all')}
                        label="All"
                        rounded
                        theme="light"
                        themeSat={300}
                        className="fsize-300 mb-1 txtDark400 mr-1"
                      />
                      {
                        get(wishlistProperties, 'total', 0) > 0 && (
                          <BrixelButtonSecondary
                            onClick={(e) => showAll(e, 'wishlist')}
                            label="Wishlist"
                            rounded
                            theme="light"
                            themeSat={300}
                            className="fsize-300 mb-1 txtDark400 mr-1"
                          />
                        )
                      }
                      {/* <BrixelButtonSecondary
                      onClick={() => history.push(`${match.url}/lastViewed`)}
                      label="Last viewed"
                      rounded
                      theme="light"
                      themeSat={300}
                      className="fsize-300 mb-1 txtDark400 mr-1"
                    /> */}
                      {
                        get(favoritesProperties, 'total', 0) > 0 && (
                          <BrixelButtonSecondary
                            onClick={(e) => showAll(e, 'favorites')}
                            label="Bookmarks"
                            rounded
                            theme="light"
                            themeSat={300}
                            className="fsize-300 mb-1 txtDark400 mr-1"
                          />
                        )
                      }
                      {
                        get(newProperties, 'total', 0) > 0 && (
                          <BrixelButtonSecondary
                            onClick={(e) => showAll(e, 'radar')}
                            label="New in your radar"
                            rounded
                            theme="light"
                            themeSat={300}
                            className="fsize-300 mb-1 txtDark400 mr-1"
                          />
                        )
                      }
                      {
                        get(preMarketProperties, 'total', 0) > 0 && (
                          <BrixelButtonSecondary
                            onClick={(e) => showAll(e, 'preMarket')}
                            label="Pre-market properties"
                            rounded
                            theme="light"
                            themeSat={500}
                            className="fsize-300 mb-1 txtDark400 mr-1"
                          />
                        )
                      }
                      {
                        get(premiumProperties, 'total', 0) > 0 && (
                          <BrixelButtonSecondary
                            onClick={(e) => showAll(e, 'premium')}
                            label="Premium properties"
                            rounded
                            theme="light"
                            themeSat={300}
                            className="fsize-300 mb-1 txtDark400 mr-1"
                          />
                        )
                      }
                    </div>
                  </>
                )
              }

              {
                get(preMarketProperties, 'total', 0) > 0 && (
                  <BrixelButtonSecondary
                    onClick={(e) => showAll(e, 'allMap')}
                    label="Show map"
                    rounded
                    theme="light"
                    leftIcon="roadmap"
                    themeSat={300}
                    className="fsize-300 mb-1 txtDark400"
                  />
                )
              }
            </div>
          </div>
        </div>

        {
          wishlistProperties.total > 0 && (
            <div className={`min-h-fix-448 ${wishlistProperties.total === 0 ? '' : 'pb-8'}`}>
              <CarouselWrapper
                title="Wishlist"
                className="market-category-carousel"
                type="wishlist"
                items={wishlistProperties.data}
                total={wishlistProperties.total}
              />
            </div>
          )
        }

        {
          favoritesProperties.total > 0 && (
            <div className={`min-h-fix-448 ${favoritesProperties.total === 0 ? '' : 'pb-8'}`}>
              <CarouselWrapper
                title="Bookmarks"
                className="market-category-carousel"
                type="favorite"
                items={favoritesProperties.data}
                total={favoritesProperties.total}
              />
            </div>
          )
        }

        <div className="pb-8">
          {
            newProperties.total !== 0 ? (
              <CarouselWrapper
                title="New in your radar"
                className="market-category-carousel"
                type="new"
                items={newProperties.data}
                total={newProperties.total}
              />
            ) : (
              <div className="h-fix-320 bgLight100 brdRadius dis-fl-col jc-c a-c">
                <img src={NoPropertiesImg} alt="No Properties on your New Radar" />
                <p className="fweight-700 mb-1 mt-3">No matching properties right now.</p>
                <p>Check again later for new properties.</p>
              </div>
            )
          }
        </div>

        <div className="pb-8">
          {
            preMarketProperties.total > 0 && (
              <CarouselWrapper
                title="Pre-market properties"
                className="market-category-carousel"
                type="preMarket"
                items={preMarketProperties.data}
                total={preMarketProperties.total}
              />
            )
          }
        </div>

        <div className="pb-8">
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
      </div>
    </Suspense>
  );
};

MarketCategoryListBuyer.propTypes = {
  favoritesProperties: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  newProperties: PropTypes.object.isRequired,
  preMarketProperties: PropTypes.object.isRequired,
  premiumProperties: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  splashScreenType: PropTypes.string.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
  windowDimensions: PropTypes.object.isRequired,
  wishlistProperties: PropTypes.object.isRequired,
};

MarketCategoryListBuyer.defaultProps = {
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  formValue: get(state, 'brixelForm.GetStarted.values', {}),
  initialValues: get(state, 'user.userSearchProfiles[0]', []),
  lang: get(state, 'user.loggedInUser.user.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  newProperties: get(state, 'market.newProperties', {}),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  preMarketProperties: get(state, 'market.preMarketProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('GetStarted', value));
  },
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListBuyer);
