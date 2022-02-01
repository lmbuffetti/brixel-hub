/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  Helpers,
  BrixelButtonText,
  SkeletonPackages,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';
import lazyWithRetry from '../../components/LazyWithRetry';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import BestimateCardOverlay from '../../components/BestimateCardOverlay';
import generatingBestimate from '../../images/Bestimate/generatingBestimate.svg';
import startBestimate from '../../images/Bestimate/startBestimate.svg';
import { setSplashType, setHistory } from '../../actions/CommonActions';
import { getCompanyListing, setActiveSingleCompany } from '../../actions/CompanyActions';
import {
  setEstimation, getEstimation, setActiveMarketOverlayProperty, setActiveSingleProperty, getPackageProperty,
} from '../../actions/PropertyActions';
import ArticlesList from '../../resources/homeArticles';
import EmptyHubImg from '../../images/emptyHub.svg';
// images
import testdrive from '../../images/Market/testdrive.jpeg';
import skeletonOwnCard from '../../images/Market/skeletonOwnCard.svg';
import marketSkeltonMobile from '../../images/Market/skeletonCardMobile.svg';

const CarouselWrapper = lazyWithRetry(() => import('../../components/CarouselWrapper'));

const MarketCategoryListSeller = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeMarketOverlayProperty,
    activeSingleProperty,
    activeSinglePropertyActivePackage,
    activeSinglePropertyPackage,
    bestimate,
    companyListings,
    estimation,
    handleGetCompanyListing,
    handleGetEstimation,
    handleGetPackageProperty,
    handleSetActiveSingleProperty,
    handleSetActiveSingleCompany,
    handleSetHistory,
    isSmallLoading,
    loggedInUser,
    notification,
    ownerProperties,
    premiumProperties,
    setMarketOverlayProperty,
    setPropertyEstimation,
    setSplashScreen,
    skeleton,
    splashScreenType,
  } = props;

  const marketCookie = getCookie('brixelMarketBestimate');
  const [bestimateMessage, setBestimateMessage] = useState(marketCookie === 'true');
  const [propertyId, setPropertyId] = useState(null);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [companyDetail, setCompanyDetail] = useState({ });
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [artByCountry, setArtByCountry] = useState(ArticlesList.default);

  useEffect(() => {
    setBestimateMessage(marketCookie === 'true');
  }, [marketCookie]);

  useEffect(() => {
    handleGetCompanyListing();
  }, []);

  useEffect(() => {
    if (companyListings.length > 0) {
      if (propertyId) {
        const indexOwn = ownerProperties.data.findIndex((page) => page.id === propertyId);
        handleSetActiveSingleProperty({ customID: propertyId, setID: indexOwn });
        const singleCmp = companyListings.find((cmp) => cmp.id === ownerProperties.data[indexOwn].company);
        handleSetActiveSingleCompany(singleCmp);
        handleGetPackageProperty({ id: propertyId, smallLoader: 'package' });
      } else handleSetActiveSingleProperty({});
    }
  }, [propertyId, companyListings.length]);

  useEffect(() => {
    const packages = get(companyDetail, 'servicePackages', null);
    let filtPkg = [];
    if (packages) {
      filtPkg = packages.filter((pkg) => pkg.availableToCustomer);
    }
    if (activeSinglePropertyPackage.length > 0) {
      // filtPkg = activeSinglePropertyPackage;
    }
    // eslint-disable-next-line no-return-assign
    filtPkg.map((pkg) => pkg.price.total = +pkg.price.total);
    filtPkg = orderBy(filtPkg, ['price.total'], ['asc']);
    setFilteredPackages(filtPkg);
  }, [get(companyDetail, 'servicePackages', null), activeSinglePropertyPackage]);

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

  useEffect(() => {
    if (has(ownerProperties, 'total')) {
      if (ownerProperties.total === 0) {
        setActiveCompanyId(loggedInUser.company.id);
      } else {
        setActiveCompanyId(ownerProperties.data[0].company.id || ownerProperties.data[0].company);
      }
    }
  }, [ownerProperties, loggedInUser]);

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
    history.push(`/${activeMarketOverlayProperty.id}/singleFlow/achievement/bestimate/step1`);
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

  useEffect(() => {
    if (companyListings && activeCompanyId) {
      const actCompany = companyListings.find((item) => item.id === activeCompanyId);
      if (actCompany) setCompanyDetail(actCompany);
      const actCountry = get(actCompany, 'country.code', '').toLowerCase();
      setArtByCountry(ArticlesList[actCountry] || ArticlesList.default);
    }
  }, [activeCompanyId, companyListings]);

  const bookNow = () => {
    if (propertyId) {
      localStorage.setItem('backUrl', '/sell');
      history.push(`/${propertyId}/trialRequest?url${baseByData.hubUrl}sell`);
    }
  };

  return (
    <Suspense fallback="">
      {/* SECTION: bestimate result */}
      {
        !bestimateMessage && splashScreenType === 'bestimateResult' && bestimate.higherValue !== 0 && get(estimation, 'status', 'active') !== 'pending' && (
          <BestimateCardOverlay
            activeSinglePropertyId={activeSingleProperty.customID}
            setBestimateMessage={(val) => setBestimateMessage(val)}
            clearEstimation
          />
        )
      }

      {/* SECTION: bestimate teaser */}
      {
        !bestimateMessage && splashScreenType === 'bestimateTeaser' && (
          <SplashScreen
            className="result-popup centered"
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
                    <h3 className="ta-c">Get a free price indication. </h3>
                    <span className="max-w-fix-448 ta-c txtDark700 py-2">Compare your property to real transaction data to better define the pricing.</span>

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
            className="result-popup centered"
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
      {
        ownerProperties.total === 0 ? (
          <div className="px-2 px-md-0 mb-5 mb-sm-3">
            <div className="p-2 px-sm-3 brdRadius brdSmall brdLight200 bgWhite shadow-2dp min-h-fix-240 max-w-fix-800 ml-a mr-a pos-r mb-8 py-5 py-3">
              <img className="ml-a mr-a dis-b" width="80" src={EmptyHubImg} alt="Emtpy Hub" />
              <h4 className="ta-c mt-3 mb-2 fweight-700 mb-2">Anybody home?</h4>
              <h5 className="ta-c fSizePx18 mb-2 m-a">For using the Brixel Hub you need at least one property.</h5>
              <BrixelButtonPrimary
                rounded
                className="m-a mt-3"
                label="+ Add new"
                onClick={() => history.push(`/packageFlow/getStarted?company==${get(loggedInUser, 'company.stub', '')}`)}
              />
            </div>
          </div>
        ) : (
          <div className="mb-5 mb-sm-3 mt-4-neg mt-sm-10-neg">

            <div className="marketSellBanner dis-fl-col dis-fl-row-sm a-c jc-c pb-2 mt-2-neg mt-sm-0">
              <div className="max-w-fix-144 min-h-fix-200 min-h-fix-sm-360 max-w-fix-sm-264 w-perc-100">
                <img src={testdrive} alt="testdrive" />
              </div>
              <div className="max-w-fix-360 ml-sm-5 pt-sm-8 ta-c ta-l-sm">
                <h3 className="fweight-600 fsize-600 fsize-sm-800 mb-1 pt-2 pt-sm-5">Test drive our service. <br /> No strings attached.</h3>
                <h5 className="fSizePx18 min-h-fix-56 fsize-sm-500 fweight-400 mb-3 px-2 px-sm-0">
                  {
                    companyDetail && get(companyDetail, 'meta.teaserPackage.price', 0) > 0 ? (
                      <>
                        <span>Get the full Brixel experience <br /> worth</span>
                        <span className="ml-small-4">{get(companyDetail, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(companyDetail, 'meta.teaserPackage.price', ''), get(companyDetail, 'meta.teaserPackage.currency', ''))}.</span>
                      </>
                    ) : (
                      <span>Get the full Brixel experience</span>
                    )
                  }
                  { companyDetail && get(companyDetail, 'meta.teaserPackage.price', 0) === 0 && (
                    <span className="dis-b"> worth . . . </span>
                  )}
                </h5>
                <BrixelButtonPrimary
                  rounded
                  theme="red"
                  label="Request now"
                  onClick={() => bookNow()}
                  className="mb-2 ml-a ml-sm-0 mr-sm-0 mr-a"
                />

              </div>

            </div>
            <div className="actionTop bgWhite pos-r zIndex2 py-1 px-1 dis-f hide-sm a-c jc-b">
              <BrixelButtonText
                className="fsize-300 show-all pos-r mr-1"
                label={`<span>View all properties</span> <span class="ml-1">(${get(ownerProperties, 'total', '-')})</span>`}
                onClick={() => history.push('/sell/own')}
              />
              <BrixelButtonText
                className="fsize-300 show-all pos-r"
                label="+ Add new"
                onClick={() => history.push(`/packageFlow/getStarted?company=${get(loggedInUser, 'user.company.stub', '')}`)}
              />
            </div>
            {
              ownerProperties.total > 0 && (
                <CarouselWrapper
                  layout="singleOwnCard"
                  className="market-category-carousel type-own"
                  type="own"
                  items={ownerProperties.data}
                  total={ownerProperties.total}
                  setPropertyId={(id) => setPropertyId(id)}
                  setActiveSingleCompany={(id) => setActiveCompanyId(id)}
                  slideToGo={ownerProperties.data.findIndex((page) => page.id === activeSingleProperty.customID)}
                />
              )
            }
            {
              (ownerProperties.total !== 0 && ownerProperties.total === undefined) && (
                <div className="marketSellBanner mb-10">
                  <div className="m-a px-2 px-sm-0 max-w-fix-480 max-w-fix-sm-768">
                    <div className="p-2 py-sm-3 px-sm-3 brdRadius brdSmall brdLight200 bgWhite shadow-2dp min-h-fix-240">
                      <img className="hide dis-b-sm" src={skeletonOwnCard} alt="marketSkelton" />
                      <img className="hide-sm m-a dis-b" src={marketSkeltonMobile} alt="marketSkelton" />
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        )
      }

      <div className="bgLight100 pt-6 pt-sm-8 pb-4 pb-sm-7">
        <div className="container">
          <h3 className="ta-c mb-7 max-w-fix-416 fsize-600 fsize-sm-800 fweight-600 m-a">
            Boost your private sale with an upgrade.
          </h3>

          <div className="dis-fl-col dis-fl-row-md jc-c">
            {
              (filteredPackages.length === 0 && (isSmallLoading.loadPackages !== false || skeleton.own)) ? (
                <>
                  <SkeletonPackages className="mx-sm-2 max-w-fix-400 w-perc-100" type="small" />
                  <SkeletonPackages className="my-2 my-sm-0 mx-sm-2 max-w-fix-400 w-perc-100" type="small" />
                  <SkeletonPackages className="mx-sm-2 max-w-fix-400 w-perc-100" type="small" />
                </>
              ) : (
                <>
                  {
                    filteredPackages.map((pkg, i) => (
                      <div
                        onClick={() => window.location.assign(`/${propertyId || 'company'}/upgrade`)}
                        key={i.toString()}
                        className={`${pkg.type} bgWhite txtDark700 mb-2 mb-lg-0 mx-0 mx-lg-2 w-perc-100 brdSmall brdRadius py-3 px-4 min-h-fix-248 cur-poi max-w-fix-400 w-perc-100`}
                      >
                        <div className="dis-f jc-b a-c">
                          <h4 className="fweight-500 txtDark700">{pkg.name}</h4>
                          {
                            activeSinglePropertyActivePackage.stub === pkg.stub && (
                              <div className="bgDark500 py-small-4 px-1 brdRadius txtWhite">Your plan</div>
                            )
                          }
                        </div>
                        {
                          pkg.price.total > 0 ? (
                            <p className="mt-1 mb-3 fsize-500 dis-f a-b txtDark700">
                              <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}</span>
                              <small className="ml-1 fsize-300 txtDark700">incl. VAT</small>
                            </p>
                          ) : (
                            <p className="mt-1 mb-3 fsize-500 dis-f a-b txtDark700">
                              Free
                            </p>
                          )
                        }
                        <p className="txtDark700">{pkg.description}</p>
                      </div>
                    ))
                  }
                </>
              )
            }
          </div>

          <div className="dis-fl-col dis-fl-row-sm jc-c a-c mt-4">

            <BrixelButtonPrimary
              rounded
              label="Upgrade your plan"
              onClick={() => window.location.assign(`/${propertyId || 'company'}/upgrade`)}

            />
            <span className="mx-sm-1 mt-2 my-sm-0">or</span>
            <BrixelButtonText
              rounded
              label="compare all plans"
              onClick={() => window.location.assign(`/${propertyId || 'company'}/upgrade#comparePlan`)}
              theme="AltGrey"
              themeSat={700}
            />

          </div>
        </div>
      </div>

      <div className="mt-6 mt-sm-10">
        <div className="container">
          <h4 className="mb-4 fweight-600 txtDark700">This may interest you</h4>

          <div className="dis-fl-col dis-fl-row-sm a-t flex-wrap">
            {
              artByCountry.map((article, i) => (
                <div
                  key={i.toString()}
                  className={`dis-fl-col jc-b a-t w-perc-100 w-perc-sm-50 mb-3 mb-sm-0 ${i % 2 === 0 ? 'pr-0 pr-sm-2' : 'pl-0 pl-sm-2'}`}
                >
                  <a className="txtDark700 td-u fsize-300 mb-3 dis-b" href={article.url} target="_blank" rel="noreferrer">
                    <img src={article.img} alt={`Article ${i}`} />
                  </a>
                  {article.title && (<h5 className=" fweight-600 mb-1">{article.title}</h5>)}
                  <p className="mb-2 txtDark700">{article.desc}</p>
                  <a className="txtDark700 td-u fsize-300" href={article.url} target="_blank" rel="noreferrer">Read more</a>
                </div>
              ))
            }
          </div>

        </div>
      </div>

      <span className="mt-4 mb-6 hr lighter" />

      <div className="mb-5 mb-sm-10">
        <div className="container">
          {
            premiumProperties.total > 0 && (
              <CarouselWrapper
                title="Others selling with Brixel"
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

MarketCategoryListSeller.propTypes = {
  activeMarketOverlayProperty: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyActivePackage: PropTypes.object.isRequired,
  activeSinglePropertyPackage: PropTypes.arrayOf(PropTypes.object).isRequired,
  bestimate: PropTypes.object.isRequired,
  companyListings: PropTypes.arrayOf(PropTypes.object).isRequired,
  estimation: PropTypes.object.isRequired,
  handleGetCompanyListing: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  handleSetActiveSingleCompany: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetHistory: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  notification: PropTypes.arrayOf(PropTypes.object).isRequired,
  ownerProperties: PropTypes.object.isRequired,
  premiumProperties: PropTypes.object.isRequired,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  splashScreenType: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  activeMarketOverlayProperty: get(state, 'property.activeMarketOverlayProperty', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyActivePackage: get(state, 'property.activeSinglePropertyActivePackage', {}),
  activeSinglePropertyPackage: get(state, 'property.activeSinglePropertyPackage', []),
  bestimate: get(state, 'property.estimation.result', {}),
  companyListings: get(state, 'companies.companyListings.data', []),
  estimation: get(state, 'property.estimation', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lastViewedProperties: get(state, 'market.lastViewedProperties', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  newProperties: get(state, 'market.newProperties', {}),
  notification: get(state, 'common.notification', []),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  ownerProperties: get(state, 'market.ownerProperties', {}),
  preMarketProperties: get(state, 'market.preMarketProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  skeleton: get(state, 'common.skeleton', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetCompanyListing: bindActionCreators(getCompanyListing, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetActiveSingleCompany: bindActionCreators(setActiveSingleCompany, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListSeller);
