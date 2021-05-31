/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  Helpers, BrixelButtonText,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import generatingBestimate from '../../images/Bestimate/generatingBestimate.svg';
import startBestimate from '../../images/Bestimate/startBestimate.svg';
import { setSplashType, setHistory } from '../../actions/CommonActions';
import { getCompanyListing } from '../../actions/CompanyActions';
import { setEstimation, getEstimation, setActiveMarketOverlayProperty } from '../../actions/PropertyActions';
// import CardImageText from '../../components/Skeleton/CardImageText';
import Loading from '../../components/Loading';
import marketSkelton from '../../images/market-skelton.svg';
import marketSkeltonMobile from '../../images/market-skelton-mobile.svg';
import EmptyHubImg from '../../images/emptyHub.svg';

const CarouselWrapper = Loadable({
  loader: () => import('../../components/CarouselWrapper' /* webpackChunkName: "CarouselWrapper" */),
  loading: () => null,
});

const MarketCategoryListSeller = (props) => {
  // PROPS
  const {
    activeMarketOverlayProperty,
    bestimate,
    estimation,
    handleGetEstimation,
    handleSetHistory,
    handleGetCompanyListing,
    history,
    loggedInUser,
    notification,
    ownerProperties,
    premiumProperties,
    setPropertyEstimation,
    setSplashScreen,
    setMarketOverlayProperty,
    splashScreenType,
  } = props;

  const marketCookie = getCookie('brixelMarketBestimate');
  const [bestimateMessage, setBestimateMessage] = useState(marketCookie === 'true');

  useEffect(() => {
    setBestimateMessage(marketCookie === 'true');
  }, [marketCookie]);

  useEffect(() => {
    handleGetCompanyListing();
  }, []);

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
    if (getCookie('brixelSplashHome') === 'bestimateTeaser') {
      setCookie('brixelMarketBestimate', false);
      setCookie('brixelSplashHome', null);
      setSplashScreen('bestimateTeaser');
    }
    if (getCookie('brixelSplashHome') === 'sellerWelcome' && get(ownerProperties, 'data', []).length === 1) {
      setSplashScreen('sellerWelcome');
    }
  }, [getCookie('brixelSplashHome'), ownerProperties, notification]);

  const onCloseWelcome = () => {
    setCookie('brixelMarketWelcome', true);
    setCookie('brixelSplashHome', null);
    setSplashScreen('');
  };

  const openBestimate = () => {
    setCookie('brixelMarketWelcome', false);
    setCookie('brixelMarketBestimate', true);
    setCookie('brixelSplashHome', 'bestimateResult');
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

  const onBestimateFlow = () => {
    history.push(`/${activeMarketOverlayProperty.id}/rewards/achievement/bestimate/step1`);
    setMarketOverlayProperty({});
    setSplashScreen('');
    handleSetHistory({ source: '/sell' });
  };

  const openSupport = (e) => {
    e.preventDefault();
    history.push({ state: { showSupport: true } });
    setSplashScreen('');
    setCookie('brixelSplashHome', null);
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
      {/* SECTION: seller welcome message  */}
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
                  <p className="max-w-fix-440 txtDark700 pl-2">
                    <span>Are you thinking about selling? Get in touch with</span>
                    <a
                      href="#"
                      className="link ml-small-4"
                      onClick={(e) => openSupport(e)}
                    >
                      <span>support</span>
                    </a>
                    <span className="ml-small-4">and get a free consultation by our experts.</span>
                  </p>
                </div>
                <div className="dis-f mb-2">
                  <p className="max-w-fix-440 txtDark700 pl-2">
                    <span>Do you want to know how much your home is worth? Get a free price indication with our</span>
                    <a
                      href="#"
                      className="link ml-small-4"
                      onClick={(e) => openBestimate(e)}
                    >
                      <span>Bestimate®</span>
                    </a>
                  </p>
                </div>
                <div className="dis-f">
                  <p className="max-w-fix-440 txtDark700 pl-2">Are you looking for a property to buy? Define your
                    <a
                      className="link ml-small-4"
                      href={`/packageFlow/getStartedBuyer?company=${get(loggedInUser, 'company.stub', '')}`}
                    >
                      <span>&nbsp;search profile</span>
                    </a> and get exclusive access to hundreds of properties that are not yet on market.
                  </p>
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

      {/* SECTION: bestimate result */}
      {
        !bestimateMessage && splashScreenType === 'bestimateResult' && bestimate.higherValue !== 0 && get(estimation, 'status', 'active') !== 'pending' && (
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
            <div className="dis-fl-col jc-c a-c pb-2 pos-r">
              {
                !has(bestimate, 'higherValue') && (
                  <>
                    <Loading isLoading />
                  </>
                )
              }
              <h3>This is your Bestimate<sup>&reg;</sup>  </h3>
              <>
                <p className="ta-c mt-2 txtDark700"> Your property is worth up to </p>
                <p className="fsize-600 ff-mono txtPrimary700 fweight-600 mb-3 mt-2">{get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'}</p>
              </>
              <span className="txtDark700"> Similar transactions were sold within this price range. </span>
              <div className="pt-2 pb-3 max-w-fix-480 w-perc-100">
                <div className="ff-mono txtPrimary700 fsize-300 ta-c besitmate-range dis-f jc-c">
                  <span> {get(bestimate, 'currency', '')} {bestimate.lowerValue ? Helpers.formatNumberValue(get(bestimate, 'lowerValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'} </span>
                  <span className="w-fix-120" />
                  <span> {get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'}</span>
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

      {/* SECTION: bestimate teaser */}
      {
        !bestimateMessage && splashScreenType === 'bestimateTeaser' && (
          <SplashScreen
            className="result-popup"
            closeOutside={false}
          >
            {
              (get(activeMarketOverlayProperty, 'location.countryCode', null) !== 'PT' && get(activeMarketOverlayProperty, 'location.countryCode', null) !== 'CH') ? (
                <>
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
                        <span>&nbsp;support</span>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="dis-f jc-fe mb-2 mb-sm-1 my-1">
                    <BrixelButtonIcon
                      ghost
                      theme="dark"
                      icon="close-small"
                      onClick={() => onCloseBestimateTeaser()}
                    />
                  </div>
                  <div className="dis-fl-col jc-c a-c pb-2">
                    <h3>Get a free price indication. </h3>
                    <span className="max-w-fix-448 ta-c txtDark700 py-2"> Compare your property to real transaction data to better define the pricing. </span>

                    <img src={startBestimate} alt="Generating Bestimate" className="w-fix-96 my-5" />

                    <div className="dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100">
                      <span
                        className="pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi"
                        onClick={() => {
                          setCookie('brixelMarketBestimate', true);
                          setBestimateMessage(true);
                        }}
                      >
                        <span>Thanks, not now</span>
                      </span>
                      <BrixelButtonPrimary
                        rounded
                        label="Get free Bestimate&reg;"
                        className="m-a"
                        onClick={() => onBestimateFlow()}
                        rightIcon="arrow-right"
                      />
                    </div>
                  </div>
                </>
              )
            }
          </SplashScreen>
        )
      }

      {/* SECTION: bestimate missing */}
      {
        !bestimateMessage && splashScreenType === 'bestimateResult' && (bestimate.higherValue === 0 || get(estimation, 'status', 'active') === 'pending') && (
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
              <h3>Bestimate&reg; is missing 🙁 </h3>
              <span className="max-w-fix-448 ta-c txtDark700 py-2"> We could not calculate your Bestimate&reg;. No problem. Our support team will do it for you manually. </span>

              <img src={startBestimate} alt="Generating Bestimate" className="w-fix-96 my-5" />

              <div className="dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100">
                <span
                  className="pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi"
                  onClick={() => {
                    onCloseBestimateResult();
                  }}
                >
                  <span>Thanks, not now</span>
                </span>
                <BrixelButtonPrimary
                  rounded
                  label="Contact support"
                  className="m-a"
                  onClick={(e) => openSupport(e)}
                  rightIcon="arrow-right"
                />
              </div>
            </div>
          </SplashScreen>
        )
      }

      <div className={`mb-5 mb-sm-3 ${ownerProperties.total !== 0 && ownerProperties.total === undefined ? '' : ''} mt-4-neg mt-sm-10-neg`}>
        <div className="">
          {
            ownerProperties.total > 0 && (
              <CarouselWrapper
                layout="singleOwnCard"
                className="market-category-carousel type-own"
                type="own"
                items={ownerProperties.data}
                total={ownerProperties.total}
              />
            )
          }
          {
            (ownerProperties.total !== 0 && ownerProperties.total === undefined) && (
              <div className="">
                <div className="">
                  <div className="marketSellBanner">
                    <div className="m-a max-w-fix-768 pt-2">
                      <img className="hide dis-b-sm" src={marketSkelton} alt="marketSkelton" />
                      <img className="hide-sm m-a dis-b" src={marketSkeltonMobile} alt="marketSkelton" />
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          {
            ownerProperties.total === 0 && (
              <div className="mb-8">
                <div className="dis-f jc-b a-c">
                  <h4 className="fweight-700 fsize-600 mb-4">Your properties</h4>
                  <BrixelButtonText
                    className="fsize-300 show-all pos-r"
                    label="+ Add new"
                    onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'company.stub', '')}`)}
                  />
                </div>
                <div className="ml-1-neg">
                  <div className="bgWhite ta-c p-3 p-lg-5 max-w-fix-800 ml-a mr-a">
                    <img src={EmptyHubImg} alt="Emtpy Hub" />
                    <h4 className="ta-c mt-3 mb-2 fweight-700 mb-2">Anybody home?</h4>
                    <h5 className="ta-c fSizePx18 mb-2 m-a">For using the Brixel Hub you need at least one property.</h5>
                    <BrixelButtonPrimary
                      rounded
                      className="m-a mt-3"
                      label="+ Add new"
                      onClick={() => history.push(`/packageFlow/getStarted?company==${get(loggedInUser, 'user.company.stub', '')}`)}
                    />
                  </div>
                </div>
              </div>
            )
          }
        </div>

      </div>

      <div className={`${ownerProperties.total !== 0 && ownerProperties.total === undefined ? '' : 'paddingOffset bgLight300'}  `}>
        <div className="container">
          {
            premiumProperties.total > 0 && (
              <CarouselWrapper
                title="Others selling with Brixel"
                titleClass="fweight-600 fsize-600"
                className="market-category-carousel"
                type="premium"
                items={premiumProperties.data}
                total={premiumProperties.total}
              />
            )
          }
        </div>
      </div>
    </>
  );
};

MarketCategoryListSeller.propTypes = {
  activeMarketOverlayProperty: PropTypes.object.isRequired,
  bestimate: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  handleGetCompanyListing: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleSetHistory: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  notification: PropTypes.object.isRequired,
  ownerProperties: PropTypes.object.isRequired,
  premiumProperties: PropTypes.object.isRequired,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  splashScreenType: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  activeMarketOverlayProperty: get(state, 'property.activeMarketOverlayProperty', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  bestimate: get(state, 'property.estimation.result', {}),
  estimation: get(state, 'property.estimation', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  lastViewedProperties: get(state, 'market.lastViewedProperties', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  newProperties: get(state, 'market.newProperties', {}),
  notification: get(state, 'common.notification', {}),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  ownerProperties: get(state, 'market.ownerProperties', {}),
  preMarketProperties: get(state, 'market.preMarketProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  handleGetCompanyListing: bindActionCreators(getCompanyListing, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListSeller);
