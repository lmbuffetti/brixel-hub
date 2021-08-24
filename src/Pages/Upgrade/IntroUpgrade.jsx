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
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
  Helpers,
} from '@brixel/brixel-components';
import Slider from 'react-slick';
import { getPackageProperty } from '../../actions/PropertyActions';

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
import { checkBrowser } from '../../utils/helpers';

const PackagesComparePlans = lazy(() => import('../../components/PackagesComparePlans'));
const BoxTrialTestDirve = lazy(() => import('../../components/BoxTrialTestDirve'));

const IntroUpgrade = (props) => {
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    activeSinglePropertyPackage,
    handleGetPackageProperty,
    history,
    packages,
    scrollHash,
  } = props;
  // STATE
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [packageName, setPackageName] = useState({ type: '', name: '' });

  // SLIDER
  const sliderInstance = useRef(null);
  const settingSlider = {
    dots: false,
    infinite: true,
    autoplay: true,
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

  useEffect(() => {
    if (activeSingleProperty.id) {
      const payloadPackage = {
        id: activeSingleProperty.id,
        limit: 20,
        offset: 0,
        direction: 'ASC',
        order: 'name',
        smallLoader: 'getPackage',
      };
      handleGetPackageProperty(payloadPackage);
    }
  }, [activeSingleProperty]);

  const scrollTo = (id) => {
    // http://localhost:5000/610a6cdf2de8b153b31b03f9/upgrade/packages#comparePlan
    setTimeout(() => {
      const scrollPage = document.getElementsByClassName('flowScrollWrap')[0];
      const scrollEl = document.getElementById(id);
      console.log(scrollEl.getBoundingClientRect().top);
      if (checkBrowser() > 0) {
        scrollPage.scrollTop = 0;
      } else {
        scrollPage.scrollTo({ top: scrollEl.getBoundingClientRect().top, behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    if (activeSinglePropertyPackage && packages.length > 0) {
      const sortedPackage = {};
      const activePackage = activeSinglePropertyPackage.find((item) => item.started);
      if (activePackage) {
        const filtPackages = packages.find((item) => activePackage.servicePackage === item.id);
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
        const filtPackage = packages.find((item) => sortedPackage[0].servicePackage === item.id);
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
    localStorage.setItem('backUrl', `/${activeSingleProperty.id}/upgrade`);
    history.push(url);
  };

  return (
    <main id="rewards" className="introScanFlow pb-2 pb-sm-4 h-perc-100 txtDark700">

      <h2 className="mb-0 mb-lg-5 ta-c fweight-600">
        Boost your private sale with an upgrade.
      </h2>

      <div className="dis-f mb-8">
        <h4 className="mr-5 w-perc-100 max-w-fix-384">
          <span>Your current plan</span>
          <span className={`dis-b ${packageName.type} fweight-600`}>{packageName.name}</span>
        </h4>

        {
          packageName.type === 'basic' && (
            <ul className="fullGreenList">
              <li>
                <div>
                  <b>Brixel Hub</b>
                  <p>Your client portal to digitalize your property</p>
                </div>
              </li>

              <li>
                <div>
                  <b>Pre-market</b>
                  <p>Test your demand anonymously</p>
                </div>
              </li>

              <li>
                <div>
                  <b>Brixel Page</b>
                  <p>Your property website to share in your network</p>
                </div>
              </li>

            </ul>
          )
        }
      </div>

      <div className="dis-f">
        {
          filteredPackages.map((pkg, i) => (
            <div
              className={`packageBox w-perc-100 ${pkg.type} dis-fl-col jc-b`}
              key={i.toString()}
            >
              <div className="p-4">
                <h5 className="fweight-600">{pkg.name}</h5>
                <p className="mt-2">
                  {pkg.description}
                </p>

                <ul className="checked">
                  {
                    pkg.details && get(pkg, 'details', []).map((detail, f) => (
                      <li
                        key={f.toString()}
                        className={i > 0 && f === 0 ? 'fweight-700' : ''}
                      >
                        {detail.description}
                      </li>
                    ))
                  }
                </ul>
              </div>
              <h6
                className="px-4 py-2"
              >
                <span>{pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}</span>
                <small>inc VAT</small>
              </h6>
            </div>
          ))
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

      <div className="mt-10">
        <h3 className="ta-c">Do you want to upgrade or change plans?</h3>

        <div className="dis-f a-fs jc-sa mt-8">
          <div className="ta-c">
            <img src={BookOnlineImg} alt="Book Online" />
            <h6>Book online</h6>
            <BrixelButtonText
              className="ml-a mr-a"
              label="Request now"
            />
          </div>
          <div className="ta-c">
            <img src={CallUsImg} alt="Call Us" />
            <h6>Call Us</h6>
            <BrixelButtonText
              onClick={() => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true))}
              className="ml-a mr-a"
              label={Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))}
            />
          </div>
          <div className="ta-c">
            <img src={WrireUsImg} alt="Call Us" />
            <h6>Call Us</h6>
            <BrixelButtonText
              onClick={() => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`)}
              className="ml-a mr-a"
              label={get(activeSingleCompany, 'contact.email', '')}
            />
          </div>
          <div className="ta-c">
            <img src={NotNowImg} alt="Call Us" />
            <h6>Not Sure</h6>
            <BrixelButtonText
              onClick={() => openNewFlow(`/${activeSingleProperty.id}/trialRequest`)}
              className="ml-a mr-a"
              label="Test drive our service"
            />
          </div>
        </div>
      </div>

      <hr className="mt-10 mb-6" />

      <div>
        <h3 className="ta-c mb-8">You’re in good company</h3>

        <div className="w-perc-100 ml-a mr-a testimonialsSlide">

          {
            get(activeSingleProperty, 'location.countryCode', '') === 'CH' ? (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial1CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Absolutely perfect and uncomplicated&quot;</h2>

                  <h5 className="ta-c txtAltColor200">M. Hardegger</h5>
                  <p className="ta-c txtAltColor200 fsize-500">House sold</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial2CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;We would sell with Brixel again anytime.&quot;</h2>

                  <h5 className="ta-c txtAltColor200">F. Pfiffner</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved CHF 30&apos;700</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial3CH} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Excellent service with flexible fees.&quot;</h2>

                  <h5 className="ta-c txtAltColor200">M. Callaghan</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved CHF 44&apos;050</p>
                </div>
              </Slider>
            ) : (
              <Slider ref={sliderInstance} {...settingSlider}>
                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial1PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Always quick in responding, friendly, professional.&quot;</h2>

                  <h5 className="ta-c txtAltColor200">Katrien Willems</h5>
                  <p className="ta-c txtAltColor200 fsize-500" />
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial2PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;Everything went incredibly well, it doesn&apos;t even seem real!&quot;</h2>

                  <h5 className="ta-c txtAltColor200">Luca Benussi</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved 18.400€</p>
                </div>

                <div className="ta-c ml-a mr-a mb-2">
                  <img src={Testimonial3PT} alt="Fabian Testimonial" className="max-w-fix-96 ml-a mr-a mb-3" />
                  <h2 className="ta-c mb-2 fweight-600">&quot;The sale was done even faster than expected.&quot;</h2>

                  <h5 className="ta-c txtAltColor200">Márcia Traça</h5>
                  <p className="ta-c txtAltColor200 fsize-500">Saved 13.000€</p>
                </div>
              </Slider>
            )
          }

        </div>

      </div>

      <div className="bgLight100 py-8 mt-10" id="comparePlan">
        <h3 className="ta-c mb-8">Compare all plans</h3>

        <PackagesComparePlans />

      </div>

      <div className="dis-f jc-c mt-10 bgWhite">

        <BoxTrialTestDirve />

      </div>

    </main>
  );
};

IntroUpgrade.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyPackage: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
  scrollHash: PropTypes.string,
};

IntroUpgrade.defaultProps = {
  scrollHash: null,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyPackage: get(state, 'property.activeSinglePropertyPackage', []),
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
