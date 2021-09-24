/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, lazy, Suspense, useState,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonIcon,
  initializeForm,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import { setSplashType, setHistory } from '../../actions/CommonActions';
import { setEstimation, getEstimation, setActiveMarketOverlayProperty } from '../../actions/PropertyActions';
import MarketCardSmall from '../../components/MarketCardSmall';
import SearchProfileBanner from '../../components/SearchProfileBanner';
import { createUserSearchProfile } from '../../actions/SearchProfileActions';

const CarouselWrapper = lazy(() => import('../../components/CarouselWrapper'));

const MarketCategoryListBuyer = (props) => {
  // PROPS
  const {
    history,
    initialValues,
    initForm,
    preMarketStats,
    premiumProperties,
    setSplashScreen,
    splashScreenType,
    userSearchProfiles,
    wishlistProperties,
    windowDimensions,
  } = props;
  // STATE
  const [numWishProp, setWishProp] = useState(4);

  useEffect(() => {
    if (get(userSearchProfiles, 'id', null)) initForm(initialValues);
  }, [get(userSearchProfiles, 'id', null)]);

  // Update data by user screen
  useEffect(() => {
    if (windowDimensions.width < 768) setWishProp(1);
    else if (windowDimensions.width < 1024) setWishProp(2);
    else if (windowDimensions.width < 1440) setWishProp(3);
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

        {/* WHISHLIST */}
        <div className="container">
          <h5 className="fweight-600 mb-3 txtAltGrey400">Wishlist</h5>
          <div className="dis-f jc-b">
            <div className={`row-cols-${numWishProp}-gut-4 w-perc-100`}>
              {
                get(wishlistProperties, 'data', []).map((fav, i) => (
                  <React.Fragment key={i.toString()}>
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
                  className="brdSmall brdRadius dis-f a-c jc-c brdAltGreen400 min-w-fix-80 h-fix-80 ml-4 cur-poi"
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

        <div className="bgAltMist200 mt-5 pt-3">
          {/* SEARCH PROFILE */}
          <div className="container">
            <SearchProfileBanner preMarketStats={preMarketStats} />
          </div>

          <div className="dis-f jc-fe container pt-6 pb-8 infoBannerMarketBuyer">
            <div className="w-perc-md-50">
              <h3 className="max-w-fix-320 fweight-600 fsize-700">
                <span>There are</span>
                <span className="mx-small-4 txtAltBlue400">{preMarketStats.total}</span>
                <span className="mx-small-4 txtAltBlue400">new properties</span>
                <span>on our Pre-Market</span>.
              </h3>
              <h5 className="fweight-400 mt-3">
                Be ahead of the market.
              </h5>
              <BrixelButtonPrimary
                onClick={() => setSplashScreen('marketOverlayCarousel')}
                className="mt-5"
                rounded
                theme="altGreen"
                themeSat={300}
                label="Rate them now"
              />
            </div>

          </div>

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
      </div>
    </Suspense>
  );
};

MarketCategoryListBuyer.propTypes = {
  history: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  preMarketStats: PropTypes.object.isRequired,
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
    favoritesProperties: get(state, 'market.favoritesProperties', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    initialValues: {
      ...initVal,
      countryCode: get(initVal, 'location[0].countryCode', get(userCompany, 'country.code', 'CH')),
      finance: {
        ...get(initVal, 'finance', {}),
        currency: get(initVal, 'finance.currency', get(userCompany, 'country.currency', 'CHF')),
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
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListBuyer);
