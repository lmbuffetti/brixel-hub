/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  useLocation,
  useNavigate, useParams,
} from 'react-router-dom';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
  BrixelIcon,
  Helpers, translateTo,
} from '@brixel/brixel-components';
import { SkeletonPackages } from '@brixel/brixel-components/dist/skeleton';
import Slider from 'react-slick';
import { getPackageProperty } from '../../actions/PropertyActions';
import { getActiveSingleCompany, getActiveSingleCompanyPackages } from '../../actions/CompanyActions';
import lazyWithRetry from '../../components/LazyWithRetry';
// import { CompaniesData } from '../../resources/Layout/Companies';

import BookOnlineImg from '../../images/Upgrade/bookOnline.svg';
import CallUsImg from '../../images/Upgrade/callUs.svg';
import NotNowImg from '../../images/Upgrade/notNow.svg';
import WrireUsImg from '../../images/Upgrade/writeUs.svg';
import Testimonial1CH from '../../images/getstarted/testimonial-1_CH.jpeg';
import Testimonial2CH from '../../images/getstarted/testimonial-2_CH.jpeg';
import Testimonial3CH from '../../images/getstarted/testimonial-3_CH.jpeg';
import Testimonial1PT from '../../images/getstarted/testimonial-1_PT.jpg';
import Testimonial2PT from '../../images/getstarted/testimonial-2_PT.jpg';
import Testimonial3PT from '../../images/getstarted/testimonial-3_PT.jpg';
import EmptyHubImg from '../../images/emptyHub.svg';

const PackagesComparePlans = lazyWithRetry(() => import('../../components/PackagesComparePlans'));
const BoxTrialTestDirve = lazyWithRetry(() => import('../../components/BoxTrialTestDirve'));

const IntroUpgrade = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleCompanyPackages,
    activeSingleProperty,
    companyListings,
    handleGetActiveCompanyPackages,
    activeSinglePropertyPackage,
    handleGetActiveSingleCompany,
    lang,
    loggedInUser,
    ownerProperties,
    packages,
    scrollHash,
  } = props;
  // STATE
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [packageName, setPackageName] = useState({ });
  const propID = get(match, 'propID', null);
  // const [activeCompanyData, setActiveCompanyData] = useState({});

  // SLIDER
  const sliderInstance = useRef(null);
  const settingSlider = {
    dots: false,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 3,
    draggable: false,
    centerPadding: '8px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          draggable: true,
        },
      },
    ],
  };


  /* useEffect(() => {
    if (CompaniesData[activeSingleCompany.stub]) setActiveCompanyData(CompaniesData[activeSingleCompany.stub].footer);
    else setActiveCompanyData(CompaniesData.default.footer);
  }, [activeSingleCompany.id]); */

  const bookNow = () => {
    if (activeSingleProperty.id) {
      localStorage.setItem('backUrl', history.location.pathname);
      history.push(`/${activeSingleProperty.id}/trialRequest`);
    }
  };

  const scrollTo = (id) => {
    document.body.classList.add('scrollSmooth');
    setTimeout(() => {
      const scrollPage = document.getElementsByClassName('flowScrollWrap')[0];
      const scrollEl = document.getElementById(id);
      if (scrollPage) {
        scrollPage.scrollTop = scrollEl.getBoundingClientRect().top + scrollPage.scrollTop;
      }
    }, 100);
  };

  useEffect(() => {
    if (propID === 'company' && loggedInUser.id) {
      const company = get(loggedInUser, 'company.id',  loggedInUser.company) || loggedInUser.companies[0];
      handleGetActiveSingleCompany({ id: company});
    }
  }, [propID, loggedInUser.id]);

  useEffect(() => {
    if (get(activeSingleProperty, 'id', null)) {
      handleGetActiveCompanyPackages({ id: get(activeSingleProperty, 'company.id', activeSingleProperty.company) , smallLoader: 'getPackages' });
    }
  }, [activeSingleProperty.id]);

  useEffect(() => {
    const basicPackage = activeSingleCompanyPackages.find((pkg) => pkg.type === 'basic');
    if (activeSinglePropertyPackage && packages.length > 0) {
      const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
      const activePackage = activeSinglePropertyPackage.find((item) => item.started);
      if (activePackage) {
        setPackageName({
          name: get(activePackage, 'servicePackage.name', ''),
          type: get(activePackage, 'servicePackage.type', ''),
          stub: get(activePackage, 'servicePackage.stub', ''),
        });
      } else if (sortedPackage[0]) {
        setPackageName({
          name: get(sortedPackage[0], 'servicePackage.name', ''),
          type: get(sortedPackage[0], 'servicePackage.type', ''),
          stub: get(sortedPackage[0], 'servicePackage.stub', ''),
        });
      } else {
        setPackageName(basicPackage);
      }
      if (scrollHash) scrollTo(scrollHash.replace('#', ''));
    }
  }, [activeSinglePropertyPackage, packages]);

  useEffect(() => {
    let filtPkg = packages.filter((pkg) => pkg.availableToCustomer);
    // eslint-disable-next-line no-return-assign
    filtPkg.map((pkg) => pkg.price.total = +pkg.price.total);
    filtPkg = orderBy(filtPkg, ['price.total'], ['asc']);
    setFilteredPackages(filtPkg);
  }, [packages]);

  const openNewFlow = (url) => {
    localStorage.setItem('backUrlBis', `/${activeSingleProperty.id}/upgrade`);
    history.push(url);
  };

  const getCompanyStub = () => {
    // TODO: Company management for "Add new" property flow
    if (ownerProperties.total === 0) return get(loggedInUser, 'company.stub', '')
    else {
      const company = companyListings.find((cmp) => cmp.id === get(ownerProperties, 'data[0].company', ''));
      return company.stub;
    }
  };

  useEffect(() => {
    document.body.classList.add('packageBody');
    return () => {
      //  clean up
      document.body.classList.remove('packageBody');
    };
  }, []);

  return (
    <main id="rewards" className="introScanFlow pt-2 pt-sm-4 pb-2 pb-sm-4 h-perc-100 txtDark700">

      <section className="max-w-fix-1200 intro container">

        <h2 className="mb-3 mb-lg-5 fsize-600 fsize-md-800 fweight-600">
          {translateTo('Boost your private sale with an upgrade.', lang)} <br/>
          {translateTo('by Brixel.', lang)}
        </h2>
      </section>

      <section className="max-w-fix-1200 container packages py-6">
        {
          filteredPackages.length === 0 ? (
            <div className="dis-fl-col dis-fl-row-md pb-3 jc-c a-c">
              <SkeletonPackages className="w-perc-100 max-w-fix-400" type="big" />
              <SkeletonPackages className="mx-lg-4 w-perc-100 max-w-fix-400" type="big" />
              <SkeletonPackages className="w-perc-100 max-w-fix-400" type="big" />
            </div>
          ) : (
            <>
              {
                get(activeSingleCompany, 'stub') === "ubs_key4" || get(activeSingleCompany, 'stub') === "baloise" ? (
                  <>
                    <div className="packageWrap a-s partnerPackage dis-fl-col dis-fl-row-lg pb-3 jc-c">
                      <>
                        {
                          filteredPackages.map((pkg, i) => (
                            <div
                              className={`packageBox bgWhite mb-2 mb-lg-0 w-perc-100 ${pkg.type} ${ i === 1 ? 'packageTwo' : ''} dis-fl-col jc-b pos-r`}
                              key={`fltPkg_${i.toString()}`}
                            >

                              <div className="p-4 pb-4 pb-sm-5">
                                <div className="dis-f jc-b a-c">
                                  <h5 className={`fweight-600 fSizePx18 ${i === 1  ? 'txtGreen400' : ''}`}>{pkg.name}</h5>
                                </div>
                                <p className="mt-4 txtDark700 min-h-fix-md-80">
                                  {translateTo(pkg.description, lang)}
                                </p>

                                {
                                  get(pkg, 'price.total', 0) > 0 ? (
                                    <>
                                      <div className="min-h-fix-sm-80 dis-fl-col jc-fe mb-1">
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
                                        <h3 className="fweight-600 fsize-800">
                                          <span>
                                            <span className="mr-1">{get(pkg, 'price.currency', '')}</span>
                                            {
                                              get(pkg, 'price.discountTotal', 0) > 0 ? (
                                                <span>{Helpers.formatNumberValue(pkg.price.discountTotal, get(pkg, 'price.currency', ''))}</span>
                                              ) : (
                                                <span>{Helpers.formatNumberValue(pkg.price.total, get(pkg, 'price.currency', ''))}</span>
                                              )
                                            }
                                          </span>
                                          <sup className="fsize-300 pl-1">{translateTo('incl. VAT', lang)}</sup>
                                        </h3>
                                      </div>

                                      <BrixelButtonPrimary
                                        rounded
                                        fullWidth
                                        label={translateTo('Try now for free', lang)}
                                        onClick={() => scrollTo('#')}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <h3 className="fweight-600 h-fix-80 mb-1 dis-f a-b">
                                        {translateTo('Free', lang)}
                                      </h3>
                                      <BrixelButtonSecondary
                                        rounded
                                        theme="dark"
                                        themeSat="700"
                                        fullWidth
                                        label={translateTo('Try now for free', lang)}
                                        onClick={() => scrollTo('#')}
                                      />
                                    </>
                                  )
                                }

                                <ul className="checked mt-4 txtDark700">
                                  {
                                    pkg.details && get(pkg, 'details', []).map((detail, f) => (
                                      <li
                                        key={`pkgDtl_${f.toString()}`}
                                        className={i > 0 && f === 0 ? 'fweight-600' : ''}
                                      >
                                        {translateTo(detail.description, lang)}
                                      </li>
                                    ))
                                  }
                                </ul>
                                {/* {
                                  pkg.price.total > 0 && (
                                    <BrixelButtonText
                                      className="mt-4 mb-2 mb-sm-0 ml-a mr-a"
                                      label={translateTo('Learn more', lang)}
                                      theme="green"
                                    />
                                  )
                                } */}
                              </div>
                              {
                                pkg.price.total > 0 && (
                                  <div className="p-4 pb-4 pb-sm-5 bgGreen100 dis-fl-col jc-fe pos-r">
                                    <BrixelIcon
                                      icon="plus"
                                      color="green"
                                      className="bgWhite pos-a-sm y-c w-fix-48 h-fix-48 large ml-sm-3-neg mobilePos"
                                      rounded
                                    />
                                    {
                                      get(activeSingleCompany, 'stub') === "ubs_key4" && (
                                        <>
                                          <span className="fweight-600 fsize-500 dis-b">Exclusive benefits for UBS clients</span>
                                          <span className="fweight-600 mt-1 dis-b p-2 bgBlue100">You only pay if the property is sold.</span>
                                          <ul className="checked mt-2 txtDark700">
                                            <li>Support in terminating or transferring the mortgage</li>
                                            <li>Investment and pension advice</li>
                                            <li>Advice on the tax implications of selling real estate</li>
                                            <li>Information on inheritance and estate planning</li>
                                            <li>Checking the selling price</li>
                                          </ul>
                                        </>
                                      )
                                    }
                                    {
                                      get(activeSingleCompany, 'stub') === "baloise" && (
                                        <>
                                          <span className="fweight-600 fsize-500 dis-b">Exclusive benefits for Baloise clients</span>
                                          <span className="fweight-600 mt-1 dis-b p-2 bgBlue100">You only pay if the property is sold.</span>
                                          <ul className="checked mt-2 txtDark700">
                                            <li>Clarification of the existing mortgage</li>
                                            <li>Baloise gives you as a customer CHF 1,000 as a gift</li>
                                            <li>Information on inheritance and estate planning</li>
                                          </ul>
                                        </>
                                      )
                                    }
                                    {/*  <span className="dis-b ml-4 mt-4 txtAltGrey400 fsize-300 mb-1">
                                      {translateTo('Your partner in financial matters', lang)}
                                    </span>
                                    {
                                      get(activeCompanyData, 'logos', []).length > 0 && (
                                        <div className="dis-f ml-4">
                                          {
                                            get(activeCompanyData, 'logos', []).map((logo, x) => (
                                              <>
                                                <span className="max-h-fix-40 dis-b">
                                                  <img
                                                    key={`logo${x.toString()}`}
                                                    src={logo}
                                                    alt={`${activeSingleCompany.name} logo ${x}`}
                                                    className={`${x > 0 ? 'ml-2' : ''} h-perc-100`}
                                                  />
                                                </span>
                                              </>
                                            ))
                                          }
                                        </div>
                                      )
                                    } */}
                                  </div>
                                )
                              }
                            </div>
                          ))
                        }
                      </>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="packageWrap regularPackage is-fl-col dis-fl-row-md pb-3 jc-c a-c a-t-md">
                      <>
                        {
                          filteredPackages.map((pkg, i) => (
                            <div
                              className={`packageBox mb-2 mb-lg-0 w-perc-100 ${pkg.type} dis-fl-col jc-b pos-r`}
                              key={`fltPkg_${i.toString()}`}
                            >
                              <div className="p-4">
                                <div className="dis-f jc-b a-c">
                                  <h5 className="fweight-600 fsize-700">{pkg.name}</h5>
                                  {pkg.stub === packageName.stub && (
                                    <div className="bgDark500 py-small-4 px-1 brdRadius txtWhite">{translateTo('Your plan', lang)}</div>
                                  )}
                                </div>
                                <p className="mt-4 txtDark700">
                                  {translateTo(pkg.description, lang)}
                                </p>

                                <ul className="checked mt-4 txtDark700">
                                  {
                                    pkg.details && get(pkg, 'details', []).map((detail, f) => (
                                      <li
                                        key={`pkgDtl_${f.toString()}`}
                                        className={i > 0 && f === 0 ? 'fweight-600' : ''}
                                      >
                                        {translateTo(detail.description, lang)}
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>
                              {
                                pkg.price.total > 0 ? (
                                  <h6 className="px-4 py-2 txtWhite">
                                    <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}</span>
                                    <small>{translateTo('incl. VAT', lang)}</small>
                                  </h6>
                                ) : (
                                  <h6 className="px-4 py-2 txtWhite">
                                    {translateTo('Free', lang)}
                                  </h6>
                                )
                              }
                              {
                                pkg.type === 'one' && get(activeSingleCompany, 'meta.additionalPackage.price', 0) > 0 && (
                                  <span className="fsize-300 txtLight700 pos-a bt w-perc-100 mb-6-neg ta-c">
                                    <span>{translateTo('Let us handle all showings for additional', lang)}</span>
                                    <span className="ml-small-4">
                                      {get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(get(activeSingleCompany, 'meta.additionalPackage.price', 0), get(activeSingleCompany, 'country.currency', ''))}.
                                    </span>
                                  </span>
                                )
                              }
                            </div>
                          ))
                        }
                      </>
                    </div>
                    <div className="dis-f jc-c mt-5">
                      <BrixelButtonSecondary
                        rounded
                        ghost
                        theme="dark"
                        label={translateTo('Compare all details', lang)}
                        onClick={() => scrollTo('comparePlan')}
                      />
                    </div>
                  </>
                )
              }
            </>
          )}

      </section>

      <section className="max-w-fix-1200 container contact-section py-3 py-md-6">
        <h3 className="ta-c fweight-600 fsize-600 fsize-sm-700">{translateTo('Do you want to upgrade or change plans?', lang)}</h3>

        <div className="dis-fl-col dis-fl-row-md a-fs jc-b mt-8 max-w-fix-928 m-a">
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
            <img className="w-fix-56 w-fix-lg-104" src={BookOnlineImg} alt="Call Us" />
            <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3">

              <h6>{translateTo('Book Online', lang)}</h6>
              <BrixelButtonText
                bgTransparent
                onClick={() => bookNow()}
                className="ml-a mr-a"
                label={translateTo('Request Now', lang)}
              />
            </div>
          </div>
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
            <img className="w-fix-56 w-fix-lg-104" src={CallUsImg} alt="Call Us" />
            <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3">

              <h6>{translateTo('Call Us', lang)}</h6>
              <BrixelButtonText
                bgTransparent
                onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
                className="ml-a mr-a"
                label={Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
              />
            </div>
          </div>
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
            <img className="w-fix-56 w-fix-lg-104" src={WrireUsImg} alt="Call Us" />
            <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3">

              <h6>{translateTo('Write Us', lang)}</h6>
              <BrixelButtonText
                bgTransparent
                onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
                className="ml-a mr-a"
                label={get(activeSingleCompany, 'contact.email', '')}
              />
            </div>
          </div>
          {
            propID !== 'company' && (
              <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md">
                <img className="w-fix-56 w-fix-lg-104" src={NotNowImg} alt="Call Us" />
                <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3">

                  <h6>{translateTo('Not Sure', lang)}</h6>
                  <BrixelButtonText
                    bgTransparent
                    onClick={() => openNewFlow(`/${activeSingleProperty.id}/trialRequest`)}
                    className="ml-a mr-a"
                    label={translateTo('Test drive our service', lang)}
                  />
                </div>
              </div>
            )
          }
        </div>
      </section>

      <hr className="lighter my-2 my-ms-5" />

      <section className="max-w-fix-1200 container testimonial py-3 py-md-6 pb-8">
        <h3 className="ta-c fweight-600 mb-3 mb-md-8 fsize-600 fsize-sm-700">{translateTo('You’re in good company', lang)}</h3>

        <div className="w-perc-100 ml-a mr-a testimonialsSlide">

          {
            get(activeSingleProperty, 'location.countryCode', '') === 'CH' ? (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial1CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>{translateTo('"Absolutely perfect and uncomplicated"', lang)}</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">{translateTo('M. Hardegger', lang)}</h5>
                  <p className="ta-c txtPrimary400 fsize-500">{translateTo('House sold', lang)}</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial2CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>{translateTo('"We would sell with Brixel again anytime."', lang)}</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">{translateTo('F. Pfiffner', lang)}</h5>
                  <p className="ta-c txtPrimary400 fsize-500">{translateTo('Saved CHF 30\'700', lang)}</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial3CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>{translateTo('"Excellent service with flexible fees."', lang)}</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">{translateTo('M. Callaghan', lang)}</h5>
                  <p className="ta-c txtPrimary400 fsize-500">{translateTo('Saved CHF 44\'050', lang)}</p>
                </div>
              </Slider>
            ) : (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial1PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>{translateTo('"Always quick in responding, friendly, professional."', lang)}</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">{translateTo('Katrien Willems', lang)}</h5>
                  <p className="ta-c txtPrimary400 fsize-500" />
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial2PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>{translateTo('"Everything went incredibly well, it doesn\'t even seem real!"', lang)}</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">{translateTo('Luca Benussi', lang)}</h5>
                  <p className="ta-c txtPrimary400 fsize-500">{translateTo('Saved 18.400€', lang)}</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial3PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>{translateTo('"The sale was done even faster than expected."', lang)}</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">{translateTo('Márcia Traça', lang)}</h5>
                  <p className="ta-c txtPrimary400 fsize-500">{translateTo('Saved 13.000€', lang)}</p>
                </div>
              </Slider>
            )
          }

        </div>

      </section>

      {
        get(activeSingleCompany, 'stub') === "ubs_key4" || get(activeSingleCompany, 'stub') === "baloise" ? (
          <>
          </>
        ) : (
          <>
            <section className="compairePlans bgLight100 py-3 py-md-9" id="comparePlan">
              <div className="container">
                <h3 className="ta-c mb-3 mb-md-7 fweight-600 fsize-600 fsize-sm-700">{translateTo('Compare all plans', lang)}</h3>
                <PackagesComparePlans
                  lang={lang}
                  packages={filteredPackages}
                />
              </div>

            </section>
          </>
        )
      }

      <section className="testdrive-teaser dis-f jc-c bgWhite pb-2">

        {
          propID === 'company' ? (
            <div className="px-2 px-md-0 mt-5 mt-sm-3">
              <div className="p-2 px-sm-3 bgWhite min-h-fix-240 max-w-fix-800 ml-a mr-a pos-r mb-8 py-5 py-3">
                <img className="ml-a mr-a dis-b" width="80" src={EmptyHubImg} alt="Emtpy Hub" />
                <h4 className="ta-c mt-3 mb-2 fweight-700 mb-2">{translateTo('Anybody home?', lang)}</h4>
                <h5 className="ta-c fSizePx18 mb-2 m-a">{translateTo('For using the Brixel Hub you need at least one property.', lang)}</h5>
                <BrixelButtonPrimary
                  rounded
                  className="m-a mt-3"
                  label={translateTo('+ Add new', lang)}
                  onClick={() => history.push(`/packageFlow/getStarted?company=${getCompanyStub()}`)}
                />
              </div>
            </div>
          ) : (
            <BoxTrialTestDirve lang={lang} isLarge />
          )
        }

      </section>

    </main>
  );
};

IntroUpgrade.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleCompanyPackages: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyPackage: PropTypes.arrayOf(PropTypes.object).isRequired,
  companyListings: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetActiveCompanyPackages: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  ownerProperties: PropTypes.object.isRequired,
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
  scrollHash: PropTypes.string,
};

IntroUpgrade.defaultProps = {
  scrollHash: null,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleCompanyPackages: get(state, 'companies.activeSingleCompanyPackages', []),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyPackage: get(state, 'property.activeSinglePropertyPackage', []),
  companyListings: get(state, 'companies.companyListings.data', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  ownerProperties: get(state, 'market.ownerProperties', {}),
  packages: get(state, 'companies.activeSingleCompanyPackages', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleGetActiveCompanyPackages: bindActionCreators(getActiveSingleCompanyPackages, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(IntroUpgrade);
