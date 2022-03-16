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
  Helpers,
  SkeletonPackages,
} from '@brixel/brixel-components';
import Slider from 'react-slick';
import { getPackageProperty } from '../../actions/PropertyActions';
import { getActiveSingleCompany, getActiveSingleCompanyPackages } from '../../actions/CompanyActions';
import lazyWithRetry from '../../components/LazyWithRetry';

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
    handleGetActiveCompanyPackages,
    activeSinglePropertyPackage,
    handleGetActiveSingleCompany,
    loggedInUser,
    packages,
    scrollHash,
  } = props;
  // STATE
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [packageName, setPackageName] = useState({ });
  const propID = get(match, 'propID', null);

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
      const scrollPage = document.getElementsByClassName('flowScrollWrap')[0];
      const scrollEl = document.getElementById(id);
      if (scrollPage) {
        scrollPage.scrollTop = scrollEl.getBoundingClientRect().top + scrollPage.scrollTop;
      }
    }, 100);
  };
  
  useEffect(() => {
    if (propID === 'company' && loggedInUser.id) {
      handleGetActiveSingleCompany({ id: loggedInUser.company.id });
    }
  }, [propID, loggedInUser.id]);
  
  useEffect(() => {
    if (get(activeSingleProperty, 'company.id', '')) {
      handleGetActiveCompanyPackages({ id: activeSingleProperty.company.id, smallLoader: 'getPackages' });
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

  useEffect(() => {
    document.body.classList.add('packageBody');
    return () => {
      //  clean up
      document.body.classList.remove('packageBody');
    };
  }, []);

  return (
    <main id="rewards" className="introScanFlow pt-2 pt-sm-4 pb-2 pb-sm-4 h-perc-100 txtDark700">

      <section className="intro container">

        <h2 className="mb-3 mb-lg-5 fsize-600 fsize-md-800 fweight-600">
          Boost your private sale with an upgrade.
        </h2>
      </section>

      <section className="container packages py-6">
        <div className="dis-fl-col dis-fl-row-md pb-3 jc-c">
          {
            filteredPackages.length === 0 ? (
              <>
                <SkeletonPackages className="w-perc-100 max-w-fix-400" type="big" />
                <SkeletonPackages className="mx-lg-4 w-perc-100 max-w-fix-400" type="big" />
                <SkeletonPackages className="w-perc-100 max-w-fix-400" type="big" />
              </>
            ) : (
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
                            <div className="bgDark500 py-small-4 px-1 brdRadius txtWhite">Your plan</div>
                          )}
                        </div>
                        <p className="mt-4 txtDark700">
                          {pkg.description}
                        </p>

                        <ul className="checked mt-4 txtDark700">
                          {
                            pkg.details && get(pkg, 'details', []).map((detail, f) => (
                              <li
                                key={`pkgDtl_${f.toString()}`}
                                className={i > 0 && f === 0 ? 'fweight-600' : ''}
                              >
                                {detail.description}
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                      {
                        pkg.price.total > 0 ? (
                          <h6 className="px-4 py-2 txtWhite">
                            <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}</span>
                            <small>incl. VAT</small>
                          </h6>
                        ) : (
                          <h6 className="px-4 py-2 txtWhite">
                            Free
                          </h6>
                        )
                      }
                      {
                        pkg.type === 'one' && get(activeSingleCompany, 'meta.additionalPackage.price', 0) > 0 && (
                          <span className="fsize-300 txtLight700 pos-a bt w-perc-100 mb-6-neg ta-c">
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
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c">
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
          <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c">
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
          {
            propID !== 'company' && (
              <div className="dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c">
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
            )
          }
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

                  <h5 className="ta-c txtPrimary400 fweight-600">M. Hardegger</h5>
                  <p className="ta-c txtPrimary400 fsize-500">House sold</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial2CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;We would sell with Brixel again anytime.&quot;</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">F. Pfiffner</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved CHF 30&apos;700</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial3CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;Excellent service with flexible fees.&quot;</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">M. Callaghan</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved CHF 44&apos;050</p>
                </div>
              </Slider>
            ) : (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial1PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;Always quick in responding, friendly, professional.&quot;</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">Katrien Willems</h5>
                  <p className="ta-c txtPrimary400 fsize-500" />
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial2PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;Everything went incredibly well, it doesn&apos;t even seem real!&quot;</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">Luca Benussi</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved 18.400€</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2 max-w-fix-304">
                  <img src={Testimonial3PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600 fsize-600 fsize-sm-700"> <i>&quot;The sale was done even faster than expected.&quot;</i></h2>

                  <h5 className="ta-c txtPrimary400 fweight-600">Márcia Traça</h5>
                  <p className="ta-c txtPrimary400 fsize-500">Saved 13.000€</p>
                </div>
              </Slider>
            )
          }

        </div>

      </section>

      <section className="compairePlans bgLight100 py-9" id="comparePlan">
        <div className="container">
          <h3 className="ta-c mb-7 fweight-600 fsize-600 fsize-sm-700">Compare all plans</h3>
          <PackagesComparePlans
            packages={filteredPackages}
          />
        </div>

      </section>

      <section className="container testdrive-teaser dis-f jc-c bgWhite">

        {
          propID === 'company' ? (
            <div className="px-2 px-md-0 mt-5 mt-sm-3">
              <div className="p-2 px-sm-3 bgWhite min-h-fix-240 max-w-fix-800 ml-a mr-a pos-r mb-8 py-5 py-3">
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
            <BoxTrialTestDirve isLarge />
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
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  handleGetActiveCompanyPackages: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
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
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
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
