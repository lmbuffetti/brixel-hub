/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  lazy, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import {
  BrixelButtonSecondary,
  BrixelButtonText,
  Helpers,
  SkeletonPackages,
} from '@brixel/brixel-components';
import Slider from 'react-slick';
import BrixelIcon from '@brixel/brixel-components/dist/components/BrixelIcon';
import { getPackageProperty } from '../../actions/PropertyActions';

// import BookOnlineImg from '../../images/Upgrade/bookOnline.svg';
import CallUsImg from '../../images/Upgrade/callUs.svg';
import NotNowImg from '../../images/Upgrade/notNow.svg';
import WrireUsImg from '../../images/Upgrade/writeUs.svg';
import Testimonial1CH from '../../images/getstarted/testimonial-1_CH.jpeg';
import Testimonial2CH from '../../images/getstarted/testimonial-2_CH.jpeg';
import Testimonial3CH from '../../images/getstarted/testimonial-3_CH.jpeg';
import Testimonial1PT from '../../images/getstarted/testimonial-1_PT.jpg';
import Testimonial2PT from '../../images/getstarted/testimonial-2_PT.jpg';
import Testimonial3PT from '../../images/getstarted/testimonial-3_PT.jpg';

const PackagesComparePlans = lazy(() => import('../../components/PackagesComparePlans'));
const BoxTrialTestDirve = lazy(() => import('../../components/BoxTrialTestDirve'));

const IntroUpgrade = (props) => {
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    activeSinglePropertyPackage,
    history,
    packages,
    scrollHash,
  } = props;
  // STATE
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [packageName, setPackageName] = useState({ });

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

  const scrollTo = (id) => {
    document.body.classList.add('scrollSmooth');
    setTimeout(() => {
      const flowHeader = document.getElementsByClassName('flowHeader')[0];
      const scrollPage = document.getElementsByClassName('flowScrollWrap')[0];
      const scrollEl = document.getElementById(id);
      const headerHeight = flowHeader.offsetHeight / 2;
      if (flowHeader && scrollPage) {
        scrollPage.scrollTop = scrollEl.getBoundingClientRect().top + scrollPage.scrollTop - headerHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (activeSinglePropertyPackage && packages.length > 0) {
      const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
      const activePackage = activeSinglePropertyPackage.find((item) => item.started);
      if (activePackage) {
        const filtPackages = packages.find((item) => activePackage.id === item.id);
        if (filtPackages) {
          setPackageName({
            name: filtPackages.name,
            type: filtPackages.type,
          });
        } else {
          setPackageName({
            name: 'Basic',
            type: 'basic',
          });
        }
      } else if (sortedPackage[0]) {
        const filtPackage = packages.find((item) => sortedPackage[0].id === item.id);
        if (filtPackage) {
          setPackageName({
            name: filtPackage.name,
            type: filtPackage.type,
          });
        } else {
          setPackageName({
            name: 'Basic',
            type: 'basic',
          });
        }
      } else {
        setPackageName({
          name: 'Basic',
          type: 'basic',
        });
      }
      if (scrollHash) scrollTo(scrollHash.replace('#', ''));
    }
  }, [activeSinglePropertyPackage, packages]);

  useEffect(() => {
    let filtPkg = packages.filter((pkg) => pkg.type === 'one' || pkg.type === 'premium' || pkg.type === 'private');
    // eslint-disable-next-line no-return-assign
    filtPkg.map((pkg) => pkg.price.total = +pkg.price.total);
    filtPkg = orderBy(filtPkg, ['price.total'], ['asc']);
    setFilteredPackages(filtPkg);
  }, [packages]);

  const openNewFlow = (url) => {
    localStorage.setItem('backUrlBis', `/${activeSingleProperty.id}/upgrade`);
    history.push(url);
  };

  useEffect(() => {
    document.body.classList.add('packageBody');
    return () => {
      //  clean up
      document.body.classList.remove('packageBody');
    };
  }, []);

  return (
    <main id="rewards" className="introScanFlow pt-2 pb-2 pb-sm-4 h-perc-100 txtAltColor100">

      <section className="intro container">

        <h2 className="mb-3 mb-lg-5 fsize-600 fsize-md-800 fweight-600">
          Boost your private sale with an upgrade.
        </h2>

        <div className="dis-fl-col dis-fl-row-sm">
          <h4 className="fsize-500 fsize-md-600 w-perc-100 max-w-fix-392">
            <span>Your current plan</span>
            {
              packageName.name ? (
                <span className={`dis-b ${packageName.type} fweight-600`}>{packageName.name}</span>
              ) : (
                <span className="dis-b bgLight400 txtLight400 fweight-600">Loading...</span>
              )
            }
          </h4>

          {
            packageName.type === 'basic' && (
              <ul className="fullGreenList w-perc-100 pt-2 pt-sm-0">
                <li>
                  <BrixelIcon className="dis-b" color="AltColor" saturationTxt={200} iconWidth="w-fix-32" icon="check-small-fill" />
                  <div className="pl-2">
                    <b>Brixel Hub</b>
                    <p>Your client portal to digitalize your property</p>
                  </div>
                </li>

                <li>
                  <BrixelIcon className="dis-b" color="AltColor" saturationTxt={200} iconWidth="w-fix-32" icon="check-small-fill" />
                  <div className="pl-2">
                    <b>Pre-market</b>
                    <p>Test your demand anonymously</p>
                  </div>
                </li>

                <li>
                  <BrixelIcon className="dis-b" color="AltColor" saturationTxt={200} iconWidth="w-fix-32" icon="check-small-fill" />
                  <div className="pl-2">
                    <b>Brixel Page</b>
                    <p>Your property website to share in your network</p>
                  </div>
                </li>

              </ul>
            )
          }
        </div>
      </section>

      <section className="container packages py-6">
        <div className="dis-fl-col dis-fl-row-md pb-3">
          {
            filteredPackages.length === 0 ? (
              <>
                <SkeletonPackages className="w-perc-100" type="big" />
                <SkeletonPackages className="mx-lg-2 w-perc-100" type="big" />
                <SkeletonPackages className="w-perc-100" type="big" />
              </>
            ) : (
              <>
                {
                  filteredPackages.map((pkg, i) => (
                    <div
                      className={`packageBox mb-2 mb-lg-0 w-perc-100 ${pkg.type} dis-fl-col jc-b pos-r`}
                      key={i.toString()}
                    >
                      <div className="p-4">
                        <h5 className="fweight-600 fsize-700">{pkg.name}</h5>
                        <p className="mt-2">
                          {pkg.description}
                        </p>

                        <ul className="checked mt-3">
                          {
                            pkg.details && get(pkg, 'details', []).map((detail, f) => (
                              <li
                                key={f.toString()}
                                className={i > 0 && f === 0 ? 'fweight-600' : ''}
                              >
                                {detail.description}
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                      <h6 className="px-4 py-2">
                        <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}</span>
                        <small>incl. VAT</small>
                      </h6>
                      {
                        pkg.type === 'one' && get(activeSingleCompany, 'meta.additionalPackage.price', 0) > 0 && (
                          <span className="fsize-300 txtLight700 pos-a bt w-perc-100 mb-6-neg mb-sm-4-neg ta-c">
                            <span>Let us handle all showings for additional</span>
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
            )
          }
        </div>
        <div className="dis-f jc-c mt-5">
          <BrixelButtonSecondary
            rounded
            ghost
            theme="dark"
            label="Compare all details"
            onClick={() => scrollTo('comparePlan')}
          />
        </div>
      </section>

      <section className="container contact-section py-6">
        <h3 className="ta-c fweight-600 fsize-600 fsize-sm-700">Do you want to upgrade or change plans?</h3>

        <div className="dis-fl-col dis-fl-row-md a-fs jc-sa mt-8 max-w-fix-920 m-a">
          {/* <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0">
            <img className="w-fix-56 w-fix-lg-104" src={BookOnlineImg} alt="Book Online" />
            <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0">

              <h6>Book online</h6>
              <BrixelButtonText
                className="ml-a mr-a"
                label="Request now"
              />
            </div>
          </div> */}
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0">
            <img className="w-fix-56 w-fix-lg-104" src={CallUsImg} alt="Call Us" />
            <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0">

              <h6>Call Us</h6>
              <BrixelButtonText
                onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
                className="ml-a mr-a"
                label={Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
              />
            </div>
          </div>
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0">
            <img className="w-fix-56 w-fix-lg-104" src={WrireUsImg} alt="Call Us" />
            <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0">

              <h6>Write Us</h6>
              <BrixelButtonText
                onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
                className="ml-a mr-a"
                label={get(activeSingleCompany, 'contact.email', '')}
              />
            </div>
          </div>
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0">
            <img className="w-fix-56 w-fix-lg-104" src={NotNowImg} alt="Call Us" />
            <div className="dis-fl-col a-fs a-c-lg pl-2 pl-lg-0">

              <h6>Not Sure</h6>
              <BrixelButtonText
                onClick={() => openNewFlow(`/${activeSingleProperty.id}/trialRequest`)}
                className="ml-a mr-a"
                label="Test drive our service"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="lighter my-2 my-ms-5" />

      <section className="container testimonial py-6">
        <h3 className="ta-c fweight-600 mb-8 fsize-600 fsize-sm-700">You’re in good company</h3>

        <div className="w-perc-100 ml-a mr-a testimonialsSlide">

          {
            get(activeSingleProperty, 'location.countryCode', '') === 'CH' ? (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial1CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;Absolutely perfect and uncomplicated&quot;</i></h2>

                  <h5 className="ta-c txtAltColor200 fweight-600">M. Hardegger</h5>
                  <p className="ta-c txtAltColor200 fsize-500">House sold</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial2CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;We would sell with Brixel again anytime.&quot;</i></h2>

                  <h5 className="ta-c txtAltColor200 fweight-600">F. Pfiffner</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved CHF 30&apos;700</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial3CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;Excellent service with flexible fees.&quot;</i></h2>

                  <h5 className="ta-c txtAltColor200 fweight-600">M. Callaghan</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved CHF 44&apos;050</p>
                </div>
              </Slider>
            ) : (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial1PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;Always quick in responding, friendly, professional.&quot;</i></h2>

                  <h5 className="ta-c txtAltColor200 fweight-600">Katrien Willems</h5>
                  <p className="ta-c txtAltColor200 fsize-500" />
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial2PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;Everything went incredibly well, it doesn&apos;t even seem real!&quot;</i></h2>

                  <h5 className="ta-c txtAltColor200 fweight-600">Luca Benussi</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved 18.400€</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial3PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;The sale was done even faster than expected.&quot;</i></h2>

                  <h5 className="ta-c txtAltColor200 fweight-600">Márcia Traça</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved 13.000€</p>
                </div>
              </Slider>
            )
          }

        </div>

      </section>

      <section className="compairePlans bgAltColor2100 py-9" id="comparePlan">
        <div className="container">
          <h3 className="ta-c mb-7 fweight-600 fsize-600 fsize-sm-700">Compare all plans</h3>
          <PackagesComparePlans
            packages={filteredPackages}
          />
        </div>

      </section>

      <section className="container testdrive-teaser dis-f jc-c bgWhite">

        <BoxTrialTestDirve isLarge />

      </section>

    </main>
  );
};

IntroUpgrade.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyPackage: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
  scrollHash: PropTypes.string,
};

IntroUpgrade.defaultProps = {
  scrollHash: null,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyPackage: get(state, 'property.activeSingleProperty.servicePackages', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  packages: get(state, 'companies.activeSingleCompany.servicePackages', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(IntroUpgrade);
