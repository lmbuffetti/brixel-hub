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
  BrixelButtonSecondary,
  BrixelButtonIcon,
  Helpers,
  BrixelButtonText, translateTo,
} from '@brixel/brixel-components';
import { SkeletonPackages } from '@brixel/brixel-components/dist/skeleton';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';
import lazyWithRetry from '../../components/LazyWithRetry';
import MarketCard from '../../components/Cards/MarketCard';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import BestimateCardOverlay from '../../components/BestimateCardOverlay';
import generatingBestimate from '../../images/Bestimate/generatingBestimate.svg';
import startBestimate from '../../images/Bestimate/startBestimate.svg';
import { setSplashType, setHistory } from '../../actions/CommonActions';
import {
  getCompanyListing,
  setActiveSingleCompany,
  getActiveSingleCompanyPackages,
  getActiveSingleCompany,
} from '../../actions/CompanyActions';
import {
  getEstimation,
  getPackageProperty,
  setActiveMarketOverlayProperty,
  setActiveSingleProperty,
  setEstimation,
} from '../../actions/PropertyActions';
import ArticlesList from '../../resources/Dashboard/homeArticles';
import EmptyHubImg from '../../images/emptyHub.svg';
// images
import testdrive from '../../images/Market/testDriveSell.svg';
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
    activeSingleCompanyPackages,
    activeSingleProperty,
    activeSinglePropertyActivePackage,
    activeSinglePropertyPackage,
    bestimate,
    companyListings,
    estimation,
    handleGetActiveSingleCompany,
    handleGetActiveCompanyPackages,
    handleGetCompanyListing,
    handleGetEstimation,
    handleGetPackageProperty,
    handleSetActiveSingleCompany,
    handleSetActiveSingleProperty,
    handleSetHistory,
    isSmallLoading,
    lang,
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
    if (activeSingleCompanyPackages.length > 0) {
      const packages = activeSingleCompanyPackages;
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
    }
  }, [activeSingleCompanyPackages, activeSinglePropertyPackage]);
  
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
    if (ownerProperties.length > 0) {
      setPropertyId(ownerProperties.data[0].id);
    }
  }, [getCookie('brixelSplashHome'), ownerProperties, notification]);
  
  useEffect(() => {
    if (has(ownerProperties, 'total')) {
      if (ownerProperties.total === 0) {
        let cmpID;
        if (loggedInUser.company) cmpID = loggedInUser.company.id;
        else if (loggedInUser.companies) cmpID = loggedInUser.companies[0];
        handleGetActiveSingleCompany({id: cmpID});
        setActiveCompanyId(cmpID);
      } else {
        handleGetActiveSingleCompany({id: ownerProperties.data[0].company.id || ownerProperties.data[0].company});
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
  
  useEffect(() => {
    if (activeCompanyId && !isSmallLoading.pkgComapny) {
      const dataCompany = {
        id: activeCompanyId,
        smallLoader: 'pkgComapny'
      };
      handleGetActiveCompanyPackages(dataCompany);
    }
  }, [activeCompanyId]);
  
  
  const bookNow = () => {
    if (propertyId) {
      localStorage.setItem('backUrl', '/sell');
      history.push(`/${propertyId}/trialRequest?url${baseByData.hubUrl}sell`);
    }
  };
  
  const getCompanyStub = () => {
    // TODO: Company management for "Add new" property flow
    if (ownerProperties.total === 0) return get(loggedInUser, 'company.stub', '')
    else {
      const company = companyListings.find((cmp) => cmp.id === get(ownerProperties, 'data[0].company', ''));
      return company.stub;
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
            lang={lang}
            clearEstimation
          />
        )
      }
      
      {/* SECTION: bestimate teaser */}
      {
        (!bestimateMessage && splashScreenType === 'bestimateTeaser') && (
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
                    <h3>{translateTo('Generating your estimation...', lang)}</h3>
                    <span className="max-w-fix-448 ta-c txtDark700 py-2">
                      {translateTo('Our experts are validating the data and generating an estimation report just for you.', lang)}
                    </span>
                    
                    <img src={generatingBestimate} alt="Generating Bestimate" className="w-fix-160 my-5" />
                    
                    <div className="dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100">
                      <span>
                        {translateTo('If you have any questions please contact our', lang)}
                      </span>
                      <span
                        className="cur-poi link txtPrimary400"
                        onClick={(e) => {
                          openSupport(e);
                        }}
                      >
                        <span className="ml-small-4">{translateTo('support', lang)}</span>
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
                    <h3 className="ta-c">
                      {translateTo('Get a free price indication.', lang)}</h3>
                    <span className="max-w-fix-448 ta-c txtDark700 py-2">
                      {translateTo('Compare your property to real transaction data to better define the pricing.', lang)}
                    </span>
                    
                    <img src={startBestimate} alt="Generating Bestimate" className="w-fix-96 my-5" />
                    
                    <div className="dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100">
                      <span
                        className="pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi"
                        onClick={() => {
                          setCookie('brixelMarketBestimate', true);
                          setBestimateMessage(true);
                        }}
                      >
                        <span>{translateTo('Thanks, not now', lang)}</span>
                      </span>
                      <BrixelButtonPrimary
                        rounded
                        label={translateTo('Get free Bestimate®', lang)}
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
        (!bestimateMessage && splashScreenType === 'bestimateResult' && (bestimate.higherValue === 0 || get(estimation, 'status', 'active') === 'pending')) && (
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
              <h3>{translateTo('Bestimate® is missing 🙁', lang)}</h3>
              <span className="max-w-fix-448 ta-c txtDark700 py-2">
                {translateTo('We could not calculate your Bestimate®. No problem. Our support team will do it for you manually.', lang)}
              </span>
              
              <img src={startBestimate} alt="Generating Bestimate" className="w-fix-96 my-5" />
              
              <div className="dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100">
                <span
                  className="pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi"
                  onClick={() => {
                    onCloseBestimateResult();
                  }}
                >
                  <span>{translateTo('Thanks, not now', lang)}</span>
                </span>
                <BrixelButtonPrimary
                  rounded
                  label={translateTo('Contact support', lang)}
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
              <h4 className="ta-c mt-3 mb-2 fweight-700 mb-2">
                {translateTo('Anybody home?', lang)}
              </h4>
              <h5 className="ta-c fSizePx18 mb-2 m-a">
                {translateTo('For using the Brixel Hub you need at least one property.', lang)}
              </h5>
              <BrixelButtonPrimary
                rounded
                className="m-a mt-3"
                label={translateTo('+ Add new', lang)}
                onClick={() => history.push(`/packageFlow/getStarted?company=${getCompanyStub()}`)}
              />
            </div>
          </div>
        ) : (
          <div className="mb-5 mb-sm-3 container">
            <div className="dis-f a-c jc-b">
              <h1 className="fsize-400 fsize-sm-700">
                <span>{ownerProperties.total}</span>
                <span className="ml-small-4">
                  {translateTo(`${ownerProperties.total === 1 ? 'Property' : 'Properties'} added by you`, lang)}
                </span>
              </h1>
              <BrixelButtonText
                label={translateTo('+ Add new', lang)}
                theme="dark"
                labelClass="ws-nw"
                themeSat={700}
                onClick={() => history.push(`/packageFlow/getStarted?company=${getCompanyStub()}`)}
              />
            </div>
            
            {
              ownerProperties.total > 0 && (
                <>
                  {
                    ownerProperties.data.map((prop, i) => (
                      <div
                        className="shadow-3dp p-2 mt-3 brdRadiusSmall"
                        key={`ownProp_${i.toString()}`}
                      >
                        {
                          i === 0 && ((prop.servicePackage && prop.servicePackage.length === 0) || (get(prop, 'servicePackage[0].servicePackage.type', '') === 'basic')) && (
                            <div
                              className="w-perc-100 dis-f a-c jc-fs bgBlue100 brdRadiusSmall px-2 px-md-6 mb-2 mb-sm-3 cur-poi"
                              onClick={() => history.push(`/${prop.id}/trialRequest?url=/sell`)}
                            >
                              <div className="hide dis-b-md">
                                <img width="176" height="158" src={testdrive} alt="testdrive" />
                              </div>
                              <div className="ml-md-5">
                                <h3 className="fsize-500 fsize-md-700 fweight-600 pt-2">
                                  {translateTo('Test drive our service. No strings attached.', lang)}
                                </h3>
                                <h5 className="fweight-400 fsize-300 fsize-md-400 mt-1 mb-1 mb-sm-3 txtBlue700">
                                  {
                                    companyDetail && get(companyDetail, 'meta.teaserPackage.price', 0) > 0 ? (
                                      <>
                                        <span>
                                          {translateTo('Get the full Brixel experience worth', lang)}
                                        </span>
                                        <span className="ml-small-4">{get(companyDetail, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(companyDetail, 'meta.teaserPackage.price', ''), get(companyDetail, 'meta.teaserPackage.currency', ''))}.</span>
                                      </>
                                    ) : (
                                      <span>
                                        {translateTo('Get the full Brixel experience', lang)}
                                      </span>
                                    )
                                  }
                                </h5>
                                <div>
                                  <ul className="checked mt-1 mt-md-4 txtDark700 dis-fl-row-sm fsize-400 mb-2 hide">
                                    <li>
                                      {translateTo('Personal consultation', lang)}
                                    </li>
                                    <li className="ml-0 ml-md-3" dangerouslySetInnerHTML={{ __html: translateTo('Free 3D tour &amp; HD photos', lang)}} />
                                    <li className="ml-0 ml-md-3">
                                      {translateTo('Full estimation by an expert', lang)}
                                    </li>
                                  </ul>
                                </div>
                              
                              </div>
                            
                            </div>
                          )
                        }
                        <MarketCard
                          layout="singleOwnCard"
                          type="own"
                          item={prop}
                          onSetActiveProperty={(id) => setPropertyId(id)}
                          bookProp={() => bookNow()}
                          lang={lang}
                        />
                      </div>
                    ))
                  }
                </>
              )
            }
            {
              (ownerProperties.total !== 0 && ownerProperties.total === undefined) && (
                <div className="marketSellBanner mb-10">
                  <div className="m-a w-perc-100">
                    <div className="brdRadius shadow-3dp p-2 mb-3 mt-3 pb-4">
                      <img className="hide dis-b-sm" src={skeletonOwnCard} alt="marketSkelton" />
                      <hr className="lighter hide dis-b-sm pos-a-fix mt-4-neg max-w-perc-97" />
                      <img className="hide-sm m-a dis-b" src={marketSkeltonMobile} alt="marketSkelton" />
                    </div>
                  </div>
                </div>
              )
            }
            
            {
              ownerProperties.total > 0 && (
                <BrixelButtonSecondary
                  label={translateTo('View all', lang)}
                  rounded
                  rightIcon="arrow-simple-right"
                  className="m-a mt-3"
                  onClick={() => history.push('/sell/own')}
                />
              )
            }
          
          </div>
        )
      }
      
      <div className="bgLight100 pt-6 pt-sm-8 pb-4 pb-sm-7">
        <div className="container">
          <h3 className="ta-c mb-7 max-w-fix-416 fsize-600 fsize-sm-800 fweight-600 m-a">
            {translateTo('Boost your private sale with an upgrade.', lang)}
          </h3>
          
          <div className="dis-fl-col dis-fl-row-sm jc-c pkgsWrap">
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
                        key={`fltPkg_${i.toString()}`}
                        className={`${pkg.type} bgWhite txtDark700 mb-2 mb-sm-0 mx-0 mx-sm-2 w-perc-100 brdSmall brdRadius py-3 px-4 min-h-fix-248 cur-poi max-w-fix-400 w-perc-100`}
                      >
                        <div className="dis-f jc-b a-c">
                          <h4 className="fweight-500 txtDark700">{translateTo(pkg.name, lang)}</h4>
                          {
                            (activeSinglePropertyActivePackage.stub === pkg.stub || (!activeSinglePropertyActivePackage.stub && pkg.type === 'basic')) && (
                              <div className="bgDark500 py-small-4 px-1 brdRadius txtWhite">Your plan</div>
                            )
                          }
                        </div>
                        {
                          pkg.price.total > 0 ? (
                            <p className="mt-1 mb-3 fsize-500 dis-f a-b txtDark700">
                              {
                                get(pkg, 'price.discountTotal', 0) > 0 && (
                                  <>
                                    <span
                                      className="dis-b txtAltGrey400 fsize-300 mt-2 mt-sm-0"
                                    >
                                      <span className="">{translateTo('Original price', lang)}</span>
                                      <span className="td-lt lh-in ml-2 dis-ib pt-small-2">
                                        <span className="mr-1">{get(pkg, 'price.currency', '')}</span>
                                        <span>{Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))}</span>
                                      </span>
                                    </span>
                                  </>
                                )
                              }
                              {/* <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}</span> */}
                              {
                                get(pkg, 'price.discountTotal', 0) > 0 ? (
                                  <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.discountTotal, get(pkg, 'price.currency', ''))}</span>
                                ) : (
                                  <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, get(pkg, 'price.currency', ''))}</span>
                                )
                              }
                              <small className="ml-1 fsize-300 txtDark700">
                                {translateTo('incl. VAT', lang)}
                              </small>
                            </p>
                          ) : (
                            <p className="mt-1 mb-3 fsize-500 dis-f a-b txtDark700">
                              {translateTo('Free', lang)}
                            </p>
                          )
                        }
                        <p className="txtDark700">{translateTo(pkg.description, lang)}</p>
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
              label={translateTo('Upgrade your plan', lang)}
              onClick={() => window.location.assign(`/${get(ownerProperties, 'data[0].id', 'company')}/upgrade`)}
            
            />
            <span className="mx-sm-1 mt-2 my-sm-0">{translateTo('or', lang)}</span>
            <BrixelButtonText
              rounded
              label={translateTo('compare all plans', lang)}
              onClick={() => window.location.assign(`/${get(ownerProperties, 'data[0].id', 'company')}/upgrade#comparePlan`)}
              theme="AltGrey"
              themeSat={700}
            />
          
          </div>
        </div>
      </div>
      
      <div className="mt-6 mt-sm-10">
        <div className="container">
          <h4 className="mb-4 fweight-600 txtDark700">{translateTo('This may interest you', lang)}</h4>
          
          <div className="dis-fl-col dis-fl-row-sm a-t flex-wrap">
            {
              artByCountry.map((article, i) => (
                <div
                  key={`artCnt_${i.toString()}`}
                  className={`dis-fl-col jc-b a-t w-perc-100 w-perc-sm-50 mb-3 mb-sm-0 ${i % 2 === 0 ? 'pr-0 pr-sm-2' : 'pl-0 pl-sm-2'}`}
                >
                  <a className="txtDark700 td-u fsize-300 mb-3 dis-b" href={article.url} target="_blank" rel="noreferrer">
                    <img src={article.img} alt={`Article ${i}`} />
                  </a>
                  {article.title && (<h5 className=" fweight-600 mb-1">{translateTo(article.title, lang)}</h5>)}
                  <p className="mb-2 txtDark700">{translateTo(article.desc, lang)}</p>
                  <a className="txtDark700 td-u fsize-300" href={article.url} target="_blank" rel="noreferrer">{translateTo('Read more', lang)}</a>
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
  activeSingleCompanyPackages: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyActivePackage: PropTypes.object.isRequired,
  activeSinglePropertyPackage: PropTypes.arrayOf(PropTypes.object).isRequired,
  bestimate: PropTypes.object.isRequired,
  companyListings: PropTypes.arrayOf(PropTypes.object).isRequired,
  estimation: PropTypes.object.isRequired,
  handleGetActiveCompanyPackages: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetCompanyListing: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  handleSetActiveSingleCompany: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  handleSetHistory: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
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
  activeSingleCompanyPackages: get(state, 'companies.activeSingleCompanyPackages', []),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyActivePackage: get(state, 'property.activeSinglePropertyActivePackage', {}),
  activeSinglePropertyPackage: get(state, 'property.activeSinglePropertyPackage', []),
  bestimate: get(state, 'property.estimation.result', {}),
  companyListings: get(state, 'companies.companyListings.data', []),
  estimation: get(state, 'property.estimation', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  notification: get(state, 'common.notification', []),
  ownerProperties: get(state, 'market.ownerProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  skeleton: get(state, 'common.skeleton', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveCompanyPackages: bindActionCreators(getActiveSingleCompanyPackages, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetCompanyListing: bindActionCreators(getCompanyListing, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleSetActiveSingleCompany: bindActionCreators(setActiveSingleCompany, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListSeller);
