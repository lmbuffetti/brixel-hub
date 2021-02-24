/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonIcon,
  Helpers,
  BrixelDropdown,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import generatingBestimate from '../../images/Bestimate/generatingBestimate.svg';
import { setSplashType } from '../../actions/CommonActions';
import { setEstimation, setActivePremarketProperty, getEstimation } from '../../actions/PropertyActions';
import CardImageText from '../../components/Skeleton/CardImageText';

const CarouselWrapper = Loadable({
  loader: () => import('../../components/CarouselWrapper' /* webpackChunkName: "CarouselWrapper" */),
  loading: () => null,
});

const MarketCategoryList = (props) => {
  // PROPS
  const {
    // activePreMarketProperty,
    activeSingleCompany,
    bestimate,
    favoritesProperties,
    handleGetEstimation,
    history,
    loggedInUser,
    match,
    newProperties,
    ownerProperties,
    preMarketProperties,
    premiumProperties,
    setPropertyEstimation,
    setSplashScreen,
    splashScreenType,
    userSearchProfiles,
    windowDimensions,
  } = props;

  const marketCookie = getCookie('brixelMarketBestimate');
  const [bestimateMessage, setBestimateMessage] = useState(marketCookie === 'true');

  useEffect(() => {
    setBestimateMessage(marketCookie === 'true');
  }, [marketCookie]);

  // Update market card when bestimate changes
  useEffect(() => {
    if (getCookie('brixelSplashHome') === 'bestimateResult' && get(ownerProperties, 'data', []).length > 0) {
      if (ownerProperties.data[0].location.countryCode === 'CH' || ownerProperties.data[0].location.countryCode === 'PT') {
        if (!has(ownerProperties.data[0], 'estimation.result')) {
          const payload = {
            type: 'market',
            id: ownerProperties.data[0].id,
          };
          handleGetEstimation(payload);
        }
        setCookie('brixelMarketBestimate', false);
        setCookie('brixelSplashHome', null);
        setSplashScreen('bestimateResult');
        setPropertyEstimation(get(ownerProperties.data[0], 'estimation', {}));
      } else {
        setCookie('brixelMarketBestimate', false);
        setCookie('brixelSplashHome', null);
        setSplashScreen('bestimateTeaser');
      }
    }
    if (getCookie('brixelSplashHome') === 'buyerWelcome') {
      setSplashScreen('buyerWelcome');
    }
    if (getCookie('brixelSplashHome') === 'sellerWelcome' && ownerProperties.data.length === 1) {
      setSplashScreen('sellerWelcome');
    }
  }, [getCookie('brixelSplashHome'), ownerProperties]);

  const onCloseWelcome = () => {
    setCookie('brixelMarketWelcome', true);
    setCookie('brixelSplashHome', null);
    setSplashScreen('');
  };

  const onCloseBestimateResult = () => {
    setCookie('brixelMarketBestimate', true);
    setBestimateMessage(true);
    setSplashScreen('');
    setPropertyEstimation({});
  };

  const onCloseBestimateTeaser = () => {
    setCookie('brixelMarketBestimate', true);
    setBestimateMessage(true);
    setSplashScreen('');
  };

  const openSupport = (e) => {
    e.preventDefault();
    history.push({ state: { showSupport: true } });
  };

  const scrollToTopEdit = () => {
    const scrollEl = document.getElementsByClassName('hubDasContent')[0];
    if (scrollEl) scrollEl.scrollTop = 0;
  };

  const selectMobileFilter = (e, value) => {
    if (e) e.preventDefault();
    history.push(`${match.url}/${value}`);
  };

  useEffect(() => {
    const catList = document.getElementsByClassName('market-container')[0];
    if (catList) catList.classList.add('market-listings');
    return () => {
      if (catList) catList.classList.remove('market-listings');
    };
  }, []);

  return (
    <>
      {/* buyer welcome message  */}
      {
        splashScreenType === 'buyerWelcome' && (
          <SplashScreen
            className="result-popup"
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

      {
        splashScreenType === 'sellerWelcome' && (
          <SplashScreen
            className="result-popup"
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

      {/* bestimate result */}
      {
        !bestimateMessage && splashScreenType === 'bestimateResult' && (
          <SplashScreen
            className="result-popup"
            closeOutside={false}
          >
            <div className="dis-f jc-fe mb-2">
              <BrixelButtonIcon
                ghost
                theme="dark"
                icon="close-small"
                onClick={() => onCloseBestimateResult()}
              />
            </div>
            <div className="dis-fl-col jc-c a-c pb-2">
              <h3>This is your Bestimate<sup>&reg;</sup>  </h3>
              <>
                <p className="ta-c mt-2 txtDark700"> Your property is worth up to </p>
                <p className="fsize-600 ff-mono txtPrimary700 fweight-600 mb-3 mt-2">{get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(bestimate.higherValue, get(activeSingleCompany, 'country.currency', 'CHF')) : '-'}</p>
              </>
              <span className="txtDark700"> Similar transactions were sold within this price range. </span>
              <div className="pt-2 pb-3 max-w-fix-480 w-perc-100">
                <div className="ff-mono txtPrimary700 fsize-300 ta-c besitmate-range dis-f jc-c">
                  <span> {get(bestimate, 'currency', '')} {bestimate.lowerValue ? Helpers.formatNumberValue(bestimate.lowerValue, get(activeSingleCompany, 'country.currency', 'CHF')) : '-'} </span>
                  <span className="w-fix-120" />
                  <span> {get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(bestimate.higherValue, get(activeSingleCompany, 'country.currency', 'CHF')) : '-'}</span>
                </div>
                <span className="besitmate-bar"> </span>
              </div>
              {
                get(bestimate, 'alfredo', false) === true && (
                  <span className="txtDark200 max-w-fix-480 mb-5">
                    Bestimate<sup>&reg;</sup> is a first price indication calculated with a few inputs. It is based on real property transactions, as well as an average of current market values. For a more accurate and complete estimation, we suggest booking an on-site appointment with one of our experts (limited to specific areas).
                  </span>
                )
              }
              {
                get(bestimate, 'iazi', false) === true && (
                  <span className="txtDark200 max-w-fix-480 mb-5">
                    Bestimate<sup>&reg;</sup> is calculated based on similar transactions. This is a first price indication calculated with few inputs. To have a more accurate estimation we suggest to book our free on-site estimation.
                  </span>
                )
              }
              <BrixelButtonPrimary
                label="ok, got it!"
                rounded
                className="w-perc-100 max-w-fix-192"
                onClick={() => onCloseBestimateResult()}
              />
            </div>
          </SplashScreen>
        )
      }

      {/* bestimate teaser */}
      {
        !bestimateMessage && splashScreenType === 'bestimateTeaser' && (
          <SplashScreen
            className="result-popup"
            closeOutside={false}
          >
            <div className="dis-f jc-fe mb-2">
              <BrixelButtonIcon
                ghost
                theme="dark"
                icon="close-small"
                onClick={() => onCloseBestimateTeaser()}
              />
            </div>
            <div className="dis-fl-col jc-c a-c pb-2">
              <h3>Generating your estimation... </h3>
              <span className="max-w-fix-448 ta-c txtDark700 py-2"> Our experts are validating the data and generating an estimation report just for you. </span>

              <img src={generatingBestimate} alt="Generating Bestimate" className="w-fix-160 my-5" />

              <div className="dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100">
                <span>If you have any questions please contact our </span>
                <span
                  className="cur-poi link txtPrimary400"
                  onClick={(e) => {
                    openSupport(e);
                  }}
                >
                  &nbsp;support
                </span>
              </div>
            </div>
          </SplashScreen>
        )
      }

      {
        loggedInUser.seller && (
          <div className={` ${ownerProperties.total === 0 ? '' : 'min-h-fix-552 min-h-fix-sm-344'}`}>
            {
              ownerProperties.total > 0 && (
                <CarouselWrapper
                  title="Your properties"
                  className="market-category-carousel type-own mb-8"
                  type="own"
                  items={ownerProperties.data}
                  total={ownerProperties.total}
                />
              )
            }
            {
              (ownerProperties.total !== 0 && ownerProperties.total === undefined) && (
                <div className="mb-8">
                  <h4 className="fweight-700 fsize-600 mb-3">Your properties</h4>
                  <div className="ml-1-neg">
                    <CardImageText type="own" />
                  </div>
                </div>
              )
            }

          </div>
        )
      }

      {
        favoritesProperties.total > 0 && (
          <div className={`min-h-fix-448 ${favoritesProperties.total === 0 ? '' : 'mb-8'}`}>
            <CarouselWrapper
              title="Your favorites"
              className="market-category-carousel"
              type="favorite"
              items={favoritesProperties.data}
              total={favoritesProperties.total}
            />
          </div>
        )
      }
      {
        (favoritesProperties.total !== 0 && favoritesProperties.total === undefined) && (
          <div className="min-h-fix-448">
            <h4 className="fweight-700 fsize-600 mb-3">Your favorite</h4>
            <div className="ml-1-neg max-w-fix-304">
              <CardImageText type="favorite" />
            </div>
          </div>
        )
      }

      <div className="dis-fl-col mb-8">
        <div className="dis-fl-row jc-b flex-wrap">
          <div className="dis-fl-col mb-3">
            <h4 className="fweight-700">Discover our market</h4>
            {
              has(userSearchProfiles, '[0].id') && (
                <span className="fsize-300"><span>There are </span> <span className="fweight-600">{get(newProperties, 'total', '')}</span><span className="fweight-600"> properties</span> <span>that match your criteria.</span></span>
              )
            }
          </div>
          {
            has(userSearchProfiles, '[0].id') ? (
              <div
                className="searchProfileArea brdRadius py-1 px-sm-2 pr-5 pl-2 shadow-1dp dis-fl-row a-c fweight-500 txtDark500 fsize-300 flex-wrap pos-r as-b mb-3 cur-poi"
                onClick={() => history.push(`/packageFlow/getStartedBuyer?company=${get(loggedInUser, 'company.stub', '')}`)}
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
                <BrixelButtonIcon
                  icon="edit"
                  rounded
                  theme="light"
                  small
                  className="editSearchProfile"
                />
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
                  favoritesProperties.total > 0 && {
                    label: 'Your favorites',
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
                  onSelect={(e, value) => {
                    scrollToTopEdit();
                    selectMobileFilter(e, value.value);
                  }}
                />
              ) : (
                <>
                  <div className="dis-fl-row flex-wrap">
                    <BrixelButtonSecondary
                      onClick={() => {
                        history.push(`${match.url}/all`);
                        scrollToTopEdit();
                      }}
                      label="All"
                      rounded
                      theme="light"
                      themeSat={300}
                      className="fsize-300 mb-1 txtDark400 mr-1"
                    />
                    {/* <BrixelButtonSecondary
                      onClick={() => history.push(`${match.url}/own`)}
                      label="Your properties"
                      rounded
                      theme="light"
                      themeSat={300}
                      className="fsize-300 mb-1 txtDark400 mr-1"
                    /> */}
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
                          onClick={() => {
                            history.push(`${match.url}/favorites`);
                            scrollToTopEdit();
                          }}
                          label="Your favorites"
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
                          onClick={() => {
                            history.push(`${match.url}/radar`);
                            scrollToTopEdit();
                          }}
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
                          onClick={() => {
                            history.push(`${match.url}/preMarket`);
                            scrollToTopEdit();
                          }}
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
                          onClick={() => {
                            history.push(`${match.url}/premium`);
                            scrollToTopEdit();
                          }}
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
                  onClick={() => {
                    history.push({ pathname: `${match.url}/all`, state: 'showMap' });
                    scrollToTopEdit();
                  }}
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

      {/* <div className="mb-4">
        {
          lastViewedProperties.length > 0 && (
            <CarouselWrapper
              title="Last viewed"
              className="market-category-carousel"
              type="lastViewed"
              items={lastViewedProperties}
            />
          )
        }
      </div> */}

      <div className="mb-8">
        {
          newProperties.total > 0 && (
            <CarouselWrapper
              title="New in your radar"
              className="market-category-carousel"
              type="new"
              items={newProperties.data}
              total={newProperties.total}
            />
          )
        }
      </div>

      <div className="mb-8">
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

      <div className="mb-8">
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
    </>
  );
};

MarketCategoryList.propTypes = {
  // activePreMarketProperty: PropTypes.object.isRequired,
  activeSingleCompany: PropTypes.object.isRequired,
  bestimate: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  newProperties: PropTypes.object.isRequired,
  ownerProperties: PropTypes.object.isRequired,
  preMarketProperties: PropTypes.object.isRequired,
  premiumProperties: PropTypes.object.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  splashScreenType: PropTypes.string.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
  windowDimensions: PropTypes.object.isRequired,
};

MarketCategoryList.defaultProps = {
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  ownerProperties: get(state, 'market.ownerProperties', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  activePreMarketProperty: get(state, 'property.activePreMarketProperty', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  bestimate: get(state, 'property.estimation.result', {}),
  lastViewedProperties: get(state, 'market.lastViewedProperties', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  newProperties: get(state, 'market.newProperties', {}),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  preMarketProperties: get(state, 'market.preMarketProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  setPreMarketProperty: bindActionCreators(setActivePremarketProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryList);
