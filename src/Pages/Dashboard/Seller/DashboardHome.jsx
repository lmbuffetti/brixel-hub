/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Link, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import get from 'lodash/get';
// import cloneDeep from 'lodash/cloneDeep';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelAvatar,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  BrixelProgressBar,
  FactsOptions,
  Helpers,
  ProgressRing,
} from '@brixel/brixel-components';
import orderBy from 'lodash/orderBy';
import has from 'lodash/has';
import { DateTime } from 'luxon';
import ICalendarLink from 'react-icalendar-link';
import documentConfig from '@brixel/brixel-configuration-partner/src/DocumentsConfig';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import BestimateCardOverlay from '../../../components/BestimateCardOverlay';
import ProgressSellerStage from '../../../components/ProgressSellerStage';
import { calcPercentageFacts, calcPercentageProEstimation } from '../../../utils/helpers';
import docIcon from '../../../images/dashboard/icon-docs.svg';
import completeFactsImg from '../../../images/dashboard/complete_facts.svg';
import completedFactsImg from '../../../images/dashboard/completed_facts.svg';
import completeDescriptionImg from '../../../images/dashboard/complete_description.svg';
import completedDescriptionImg from '../../../images/dashboard/completed_description.svg';
import reviewSaleSvg from '../../../images/dashboard/reviewSale.svg';
import surveySaleSvg from '../../../images/dashboard/surveySale.svg';
import marketNewHomeSvg from '../../../images/dashboard/marketNewHome.svg';
import placeholderTextPropertyImg from '../../../images/dashboard/placeholderTextProperty.svg';
import contactTestDriveImg from '../../../images/TestDrive/contactTestDrive.svg';
import bookTestDriveImg from '../../../images/TestDrive/bookTestDrive.png';

import Loading from '../../../components/Loading';
import { setModal, spinnerOff } from '../../../actions/CommonActions';
import { getActiveSinglePropertyDealsCount, getPageDeals } from '../../../actions/PropertyActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import DashboardPropertyCard from '../../../components/Cards/DashboardPropertyCard';

const { factsOptions } = FactsOptions;

const DashboardHome = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    activeSinglePropertyDeals,
    activeSinglePropertyDealsCount,
    estimation,
    formValue,
    handleGetActiveSinglePropertyDealsCount,
    handleGetPageDeals,
    handleSetModal,
    isSmallLoading,
    loggedInUser,
    proEstimation,
    splashScreenType,
    userLang,
    userTypes,
    windowDimensions,
  } = props;
  // STATE
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
  const [progressState, setProgressState] = useState({});
  const [visitLists, setVisitLists] = useState(null);
  // const [stepProgrss, setStepProgrss] = useState({});
  const propID = get(match, 'propID', null);

  const { documents } = formValue;

  useEffect(() => {
    if (has(formValue, 'location.countryCode')) {
      if (documentConfig.mandatoryDocuments[get(formValue, 'location.countryCode')]) {
        setMandatoryDocuments(documentConfig.mandatoryDocuments[get(formValue, 'location.countryCode')][get(formValue, 'properties.propertyType')]);
      } else {
        setMandatoryDocuments(documentConfig.mandatoryDocuments.EN[get(formValue, 'properties.propertyType')]);
      }
    }
  }, [formValue]);

  useEffect(() => {
    if (progressState.step === 3) {
      handleGetActiveSinglePropertyDealsCount({ id: activeSingleProperty.id });
      handleGetPageDeals({ id: activeSingleProperty.id });
    }
  }, [progressState.step]);

  useEffect(() => {
    if (get(activeSinglePropertyDeals, 'visit')) {
      const mergedFeed = activeSinglePropertyDeals.visit.data.filter((visit) => get(visit, 'visit', null));
      let mergedFeedNew = mergedFeed.filter((visit) => visit.visit > DateTime.now().toMillis()).map((arr) => ({ ...arr, past: false }));
      let mergedFeedPast = mergedFeed.filter((visit) => visit.visit <= DateTime.now().toMillis()).map((arr) => ({ ...arr, past: true }));
      mergedFeedNew = orderBy(mergedFeedNew, ['visit'], ['asc']);
      mergedFeedPast = orderBy(mergedFeedPast, ['visit'], ['desc']);
      setVisitLists([...mergedFeedNew, ...mergedFeedPast]);
    }
  }, [activeSinglePropertyDeals]);

  useEffect(() => {
    if (activeSingleProperty.id) {
      const defState = factsOptions.progressBarOptions.find((item) => item.value === activeSingleProperty.progress.state);
      const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === activeSingleProperty.progress.state);
      if (defState.label === 'Sales Lead') defState.label = 'Onboarding';
      setProgressState({
        ...defState,
        id: defIndexState,
        step: defIndexState + 1,
      });
      if (get(activeSingleProperty, 'sellerStatus', '') === 'success') {
        setProgressState({
          ...defState,
          id: 4,
          step: 5,
        });
      }
    }
  }, [activeSingleProperty.id]);

  const countMandatoryDocuments = () => {
    let count = 0;
    if (documents && mandatoryDocuments) {
      documents.forEach((doc) => {
        mandatoryDocuments.forEach((el) => {
          if (el === doc.type) count += 1;
        });
      });
    }
    return count;
  };

  const openBrixelPage = () => {
    if (progressState.id > 0) {
      if (activeSingleProperty.published) {
        window.open(`${baseByData.pageUrl}${activeSingleProperty.stub}`, '_blank');
      } else {
        window.location.assign(`${baseByData.pageUrl}preview/${activeSingleProperty.stub}?hubUrl=${get(window, 'location.href', '')}`);
      }
    } else if (get(activeSingleProperty, 'location.countryCode', '') === 'PT') {
      window.location.assign(`https://page.brixel.io/preview/Apartamento-T2-Renovado-Bairro-dos-Actores-Lisboa?hubUrl=${get(window, 'location.href', '')}`);
    } else {
      window.location.assign(`https://page.brixel.io/preview/maisonette-staefa?hubUrl=${get(window, 'location.href', '')}`);
    }
  };

  const completeDescritpion = () => {
    if (get(activeSingleProperty, 'id', null)) {
      if (get(activeSingleProperty, 'title', null) && get(activeSingleProperty, 'description.highlight', '').length >= 300 && get(activeSingleProperty, 'description.location', '').length >= 160) {
        return true;
      }
    }
    return false;
  };

  const classWidthTable = (id) => {
    if (id === 0) return 'w-perc-60 w-perc-md-35';
    if (id === 1) return 'w-perc-40 w-perc-md-25 mt-1 mt-md-0';
    if (id === 2) return 'w-perc-40 w-perc-md-20';
    if (id === 3) return 'w-perc-20 w-perc-md-7 mt-1 mt-md-0';
    return 'w-perc-40 w-perc-md-13 mt-1 mt-md-0';
  };

  // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
  if ((!activeSingleProperty.id && !userTypes) || isSmallLoading.getProperty) {
    return <Loading />;
  }

  const boxScanTrial = () => (
    <div className="dis-f flex-wrap">
      <div className="pr-md-1 w-perc-100 w-perc-md-50 min-h-perc-100">
        <div
          className="dis-f jc-b brdRadius bgWhite shadow-2dp py-3 pl-3 ov-h h-perc-100"
          onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`)}
        >
          <div className="w-perc-100 max-w-fix-208">
            <h5 className="mb-2 fSizePx18 fweight-600">Test drive our service. No strings attached.</h5>
            <p className="fsize-300 txtDark700">
              <span>Get the full Brixel experience worth</span>
              <span className="ml-small-4">
                {get(activeSingleCompany, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(activeSingleCompany, 'meta.teaserPackage.price', ''), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))}.
              </span>
            </p>
            <BrixelButtonPrimary
              onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`)}
              className="mt-3"
              rounded
              label="Book now"
            />
          </div>
          <div className="w-perc-100 max-w-fix-136">
            <img src={bookTestDriveImg} alt="Book Test Drive" />
          </div>
        </div>
      </div>
      <div className="mt-3 mt-md-0 pl-md-1 w-perc-100 w-perc-md-50 min-h-perc-100">
        <div
          onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/${activeSingleProperty.id}/home`)}
          className="dis-f jc-b brdRadius bgWhite shadow-2dp py-3 pl-3 ov-h h-perc-100"
        >
          <div className="w-perc-100 max-w-fix-208">
            <h5 className="mb-2 fSizePx18 fweight-600">Get in touch and find out more</h5>
            <p className="fsize-300 txtDark700">Chat to one of our team members now.</p>
            <BrixelButtonPrimary
              onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/${activeSingleProperty.id}/home`)}
              className="mt-3"
              rounded
              theme="blue"
              themeSat={700}
              label="Contact us"
            />
          </div>
          <div className="w-perc-100 max-w-fix-136">
            <img
              src={contactTestDriveImg}
              alt="Book Test Drive"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rewards-container" id="rewardsDashboard">
  
      {
        splashScreenType === 'bestimateResult' && get(estimation, 'status', 'active') !== 'pending' && (
          <BestimateCardOverlay
            activeSinglePropertyId={activeSingleProperty.customID}
            clearEstimation
          />
        )
      }
  
      {
        progressState.step < 5 ? (
          <h4 className="mb-3 hide dis-b-lg fweight-600">
            <span>Welcome back</span>
            <span className="ml-small-4"> {loggedInUser && (<>{loggedInUser.firstName}</>)} 👋 </span>
          </h4>
        ) : (
          <h4 className="mb-3 hide dis-b-lg fweight-600">
            <span>Congratulations on your sale</span>
            <span>, {loggedInUser && (<>{loggedInUser.firstName}</>)} 🎉 </span>
          </h4>
        )
      }

      {
        windowDimensions.width <= 1024 && (
          <>
            {
              activeSingleProperty.id && propID && propID.length > 9 && (
                <ProgressSellerStage
                  className="mb-3"
                  smallLayout
                  xSmallMobile={windowDimensions.width <= 520}
                  stepIndexProgress={progressState.step}
                />
              )
            }
          </>
        )
      }

      <div className="max-w-fix-760 dis-fl-col">
        {
          progressState.step === 1 && (
            <>
              <DashboardPropertyCard />

              {boxScanTrial()}

              <div className="mt-3 dis-fl-col dis-fl-row-sm">
                <div
                  onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
                  className="shadow-2dp bgBlue100 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  {
                    get(proEstimation, 'value', null) ? (
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-400 txtBlue400">
                          Pro estimation
                        </span>
                        {
                          get(proEstimation, 'value', 0) > 0 && (
                            <>
                              <div className="dis-f a-c w-perc-100 mt-1 fsize-600 fweight-600 txtBlue700">
                                <span>
                                  {get(estimation, 'result.currency', '')}
                                </span>
                                <span className="ml-1 notranslate">
                                  {Helpers.formatNumberValue(get(proEstimation, 'value', 0).toFixed(0), get(estimation, 'result.currency', ''))}
                                </span>
                              </div>

                              <BrixelButtonSecondary
                                bgTransparent
                                onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
                                className="mt-2 as-fs"
                                theme="blue"
                                themeSat={700}
                                rounded
                                ghost
                                label="View"
                              />
                            </>
                          )
                        }
                      </div>
                    ) : (
                      <>
                        <div className="dis-fl-col">
                          <span className="fsize-400 txtBlue400">
                            Pro estimation
                          </span>

                          {
                            (get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment' || get(activeSingleProperty, 'properties.propertyType', '') === 'House') ? (
                              <>
                                <span className="fsize-600 fweight-600 txtBlue700">
                                  <span>{calcPercentageProEstimation().realPerc}%</span>
                                  <span className="ml-small-4"> Complete</span>
                                </span>
                                {
                                  calcPercentageProEstimation().realPerc < 100 ? (
                                    <BrixelButtonPrimary
                                      onClick={() => window.location.assign(`/${activeSingleProperty.id}/property/price/formFlow`)}
                                      label="Next step"
                                      theme="Blue"
                                      themeSat={700}
                                      className="mt-2 as-fs"
                                      rounded
                                    />
                                  ) : (
                                    <BrixelButtonSecondary
                                      bgTransparent
                                      onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
                                      className="mt-2"
                                      theme="Blue"
                                      themeSat={700}
                                      rounded
                                      ghost
                                      label="Pending"
                                    />
                                  )
                                }
                              </>
                            ) : (
                              <p className="fsize-600 fweight-600 txtBlue700">
                                For this type currently not available
                              </p>
                            )
                          }
                        </div>
                        {
                          (get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment' || get(activeSingleProperty, 'properties.propertyType', '') === 'House') && (
                            <div className={`div ${windowDimensions.width <= 590 ? 'min-w-fix-80' : 'min-w-fix-104'}`}>
                              <ProgressRing
                                customIcon={get(proEstimation, 'value', 0) <= 0 && calcPercentageProEstimation().realPerc === 100 ? 'hourglass' : null}
                                iconColor={{
                                  color: 'primary',
                                  sat: 400,
                                }}
                                progress={calcPercentageProEstimation().realPerc}
                                size={windowDimensions.width <= 590 ? 80 : 100}
                                strokeWidth={windowDimensions.width <= 590 ? 10 : 14}
                                circleOneStroke="#fff"
                                circleTwoStroke={calcPercentageProEstimation().realPerc === 100 ? '#218B80' : '#004D71'}
                                showIcon={false}
                                showIconComplete={calcPercentageProEstimation().realPerc === 100}
                              />
                            </div>
                          )
                        }
                      </>
                    )
                  }
                </div>
                <div
                  className="shadow-2dp bgPrimary100 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 w-perc-100 w-perc-sm-50 ml-sm-1 cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/docubox`)}
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtPrimary400">Docubox</span>
                    <span className="fsize-600 fweight-600 txtPrimary700">
                      <span>{countMandatoryDocuments()}</span>
                      <span className="mx-small-4">of</span>
                      <span>{mandatoryDocuments ? mandatoryDocuments.length : 0} </span>
                      <span className="ml-small-1"> uploaded</span>
                    </span>
                    <BrixelButtonPrimary
                      onClick={() => history.push(`/${activeSingleProperty.id}/docubox`)}
                      label="Upload"
                      theme="green"
                      themeSat={700}
                      className="mt-2 as-fs"
                      rounded
                    />
                  </div>
                  <div className="div">
                    <img width={windowDimensions.width <= 590 ? '80' : '92'} src={docIcon} alt="" />
                  </div>
                </div>
              </div>

              <div className="dis-fl-col dis-fl-row-sm my-3">
                <div className="w-perc-100 w-perc-sm-75 dis-f pr-sm-4">

                  <Link
                    to={`/${activeSingleProperty.id}/property/facts`}
                    className="w-perc-50 brdRadius bgWhite shadow-2dp shadowHover-4dp mr-1 pt-2 cur-poi txtDark700"
                  >
                    <div className="h-fix-184 dis-fl-col jc-b">
                      <div className="dis-f px-3">
                        <BrixelIcon
                          icon="property-new"
                          color="blue"
                          saturationTxt={700}
                        />
                        <span className="txtDark700 fweight-600 pl-1">Facts</span>
                      </div>
                      <div className="px-3 pb-2">
                        <BrixelProgressBar
                          progressValue={calcPercentageFacts().realPerc}
                          saturation={400}
                          color="Primary"
                        />
                        <span className="txtDark700 fsize-300 fsize-sm-400 pt-small-4 dis-b">
                          <span>{calcPercentageFacts().realPerc}%</span>
                          <span className="ml-small-4">complete</span>
                        </span>
                      </div>
                      <div className="linkWrap">
                        <span className="hr lighter" />
                        <div className="txtHoverDark200 txtLight700 px-3 py-1 wHover">
                          <span className="text"> View</span> <span className="arrow-symbol">&#62; </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to={`/${activeSingleProperty.id}/marketing`}
                    className="w-perc-50 brdRadius bgWhite shadow-2dp shadowHover-4dp ml-1 pt-2 cur-poi txtDark700"
                  >
                    <div className="h-fix-184 dis-fl-col jc-b">
                      <div className="dis-f px-3">
                        <BrixelIcon
                          icon="mike"
                          color="blue"
                          saturationTxt={700}
                        />
                        <span className="txtDark700 fweight-600 pl-1">Marketing</span>
                      </div>
                      <div className="px-3">
                        {
                          Object.keys(get(activeSingleCompany, 'availablePortals', {})).map((portal, i) => (
                            <React.Fragment
                              key={`actCmp_${i.toString()}`}
                            >
                              {
                                get(activeSingleCompany, `availablePortals[${portal}]`, null) && (
                                  <span className="txtDark700 fsize-300 fsize-sm-400 dis-f jc-b a-c w-perc-100 tt-c">
                                    <span>{portal}</span>
                                    <span className={`activeDot ${get(activeSingleProperty, `portals[${portal}]`, null) ? 'green' : 'grey'}`} />
                                  </span>
                                )
                              }
                            </React.Fragment>
                          ))
                        }
                        <span className="txtDark700 fsize-300 fsize-sm-400 dis-f jc-b a-c w-perc-100">
                          <span>Brixel Page</span> <span className={`activeDot ${get(activeSingleProperty, 'published', false) ? 'green' : 'grey'}`} />
                        </span>
                      </div>
                      <div className="linkWrap">
                        <span className="hr lighter" />
                        <div className="px-3 py-1 txtLight700 wHover">
                          <span className="text">View</span>
                          <span className="arrow-symbol ml-1">&#62; </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div
                  className="demoBg pos-r w-perc-100 ov-h w-perc-sm-35 mt-3 mt-sm-0 brdRadius shadow-2dp dis-fl-col jc-b pt-2 cur-poi shadowHover-4dp"
                  onClick={() => openBrixelPage()}
                >
                  <div className=" w-perc-100 h-perc-100 image-ratio pos-a zIndex1">
                    {
                      progressState.id > 0 ? (
                        <CoverPropertyImage
                          className="cover w-perc-100 h-perc-100"
                          coverPhoto={get(formValue, 'coverPhoto.galleryThumbnailPath', get(formValue, 'photos[0].galleryThumbnailPath', undefined))}
                          propertyType={get(formValue, 'properties.propertyType', undefined)}
                        />
                      ) : (
                        <>
                          {
                            get(activeSingleProperty, 'location.countryCode', '') === 'PT' ? (
                              <img
                                className="cover w-perc-100 h-perc-100 pos-a zIndex1 imgCover"
                                src="https://api.brixel.io/image/thumbnail/611a3b1f038a7621c297a488"
                                alt="Preview PT"
                              />
                            ) : (
                              <img
                                className="cover w-perc-100 h-perc-100 pos-a zIndex1"
                                src="https://api.brixel.io/image/thumbnail/5fce51745006e9175720b1c8"
                                alt="Preview CH"
                              />
                            )
                          }
                        </>
                      )
                    }
                  </div>
                  <div className="px-3 pb-5 pos-r zIndex3">
                    <span className="txtWhite dis-b max-w-fix-184 fweight-600 fsize-500 fsize-sm-500">
                      {
                        progressState.id > 0 ? (
                          <>
                            {activeSingleProperty.published ? 'View your Brixel Page' : 'Preview your Brixel Page'}
                          </>
                        ) : (
                          <>
                            See how your property could look...
                          </>
                        )
                      }
                    </span>
                  </div>
                  <div className="linkWrap pos-r zIndex3">
                    <span className="hr white" />
                    {
                      get(activeSingleProperty, 'location.countryCode', '') === 'PT' ? (
                        <div
                          className="cur-poi wHover no-state txtHoverLight200 txtWhite px-3 py-1"
                        >
                          <span className="text"> View</span> <span className="arrow-symbol">&#62; </span>
                        </div>
                      ) : (
                        <a
                          href={`https://page.brixel.io/preview/maisonette-staefa?hubUrl=${get(window, 'location.href', '')}`}
                          className="cur-poi wHover no-state txtHoverLight200 txtWhite px-3 py-1"
                        >
                          <span className="text"> View</span> <span className="arrow-symbol">&#62; </span>
                        </a>
                      )
                    }
                  </div>
                </div>
              </div>
            </>
          )
        }

        {
          progressState.step === 2 && (
            <>
              <DashboardPropertyCard />

              {boxScanTrial()}

              <div className="mt-3 dis-fl-col dis-fl-row-sm">

                {/* FACTS */}
                <div
                  onClick={() => history.push(`/${activeSingleProperty.id}/property/facts`)}
                  className="shadow-2dp bgRed100 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtRed400">Facts</span>

                    <span className="fsize-500 fsize-md-600 fweight-600 txtRed700 mb-2 mt-1">
                      {(calcPercentageFacts().realPerc * 100) / 40 > 100 ? 'Completed relevant facts' : 'Complete relevant facts'}
                    </span>

                    <BrixelProgressBar
                      progressValue={(calcPercentageFacts().realPerc * 100) / 40 > 100 ? 100 : (calcPercentageFacts().realPerc * 100) / 40}
                      saturation={400}
                      color="Red"
                    />

                  </div>
                  <div className="ml-2 ml-lg-5 w-perc-100 w-fix-xl-112 dis-f a-c">
                    <img
                      src={(calcPercentageFacts().realPerc * 100) / 40 > 100 ? completedFactsImg : completeFactsImg}
                      alt="Complete Facts"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div
                  className="shadow-2dp bgPrimary100 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtPrimary400">
                      <span
                        onClick={() => history.push(`/${activeSingleProperty.id}/property/facts/description`)}
                      >
                        Description
                      </span>
                      {
                        !completeDescritpion() && (
                          <BrixelIcon
                            className="ml-1"
                            icon="info"
                            color="primary"
                            onClick={() => handleSetModal({
                              state: true,
                              small: true,
                              classTitle: 'txtPrimary400',
                              title: 'How to add your description',
                              body: `<ol>
                            <li>Add a title</li>
                            <li>Add a description with min. 300 characters incl. spaces</li>
                            <li>Describe location with min. 160 characters incl. spaces</li>
                          </ol>`,
                            })}
                          />
                        )
                      }
                    </span>

                    <span
                      onClick={() => history.push(`/${activeSingleProperty.id}/property/facts/description`)}
                      className="fsize-500 fsize-md-600 fweight-600 txtPrimary700 mb-2 mt-1"
                    >
                      {completeDescritpion() ? 'Thanks for adding your description!\n' : 'Add your description'}
                    </span>

                  </div>
                  <div className="ml-2 ml-lg-5 w-perc-100 w-fix-xl-112 dis-f a-c">
                    <img
                      onClick={() => history.push(`/${activeSingleProperty.id}/property/facts/description`)}
                      src={completeDescritpion() ? completedDescriptionImg : completeDescriptionImg}
                      alt="Complete Facts"
                    />
                  </div>
                </div>

              </div>

              <div className="dis-fl-col dis-fl-row-sm my-3">
                <div className="w-perc-100 w-perc-sm-35 dis-f pr-sm-2">

                  <div
                    className="w-perc-100 brdRadius bgWhite shadow-2dp shadowHover-4dp pt-2 cur-poi txtDark700"
                  >
                    <div className="h-perc-100 min-h-fix-184 dis-fl-col jc-b">
                      <div className="dis-f px-3">
                        <BrixelIcon
                          icon="folder-open"
                          color="blue"
                          saturationTxt={700}
                        />
                        <span className="txtDark700 fweight-600 pl-1">Media</span>
                      </div>
                      <div className="px-3 py-2 h-perc-100">
                        <div>
                          <div
                            className="dis-f jc-b a-c"
                            onClick={() => history.push(`/${activeSingleProperty.id}/property/photos`)}
                          >
                            <span>Photos</span>
                            <BrixelIcon
                              icon="check-small-fill"
                              color={get(activeSingleProperty, 'photos', []).length > 5 ? 'blue' : 'light'}
                              saturationTxt={get(activeSingleProperty, 'virtual.matterport', []).length > 1 ? 400 : 300}
                            />
                          </div>
                          <div
                            className="dis-f jc-b a-c"
                            onClick={() => history.push(`/${activeSingleProperty.id}/property/floorplans`)}
                          >
                            <span>Plans</span>
                            <BrixelIcon
                              icon="check-small-fill"
                              color={get(activeSingleProperty, 'floorPlans', []).length >= 1 ? 'blue' : 'light'}
                              saturationTxt={get(activeSingleProperty, 'virtual.matterport', []).length >= 1 ? 400 : 300}
                            />
                          </div>
                          <div
                            className="dis-f jc-b a-c"
                            onClick={() => history.push(`/${activeSingleProperty.id}/property/tour`)}
                          >
                            <span>3d tour</span>
                            <BrixelIcon
                              icon="check-small-fill"
                              color={get(activeSingleProperty, 'virtual.matterport', []).length > 1 ? 'blue' : 'light'}
                              saturationTxt={get(activeSingleProperty, 'virtual.matterport', []).length > 1 ? 400 : 300}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="linkWrap">
                        <span className="hr lighter" />
                        <div
                          className="txtHoverDark200 txtLight700 px-3 py-1 wHover"
                          onClick={() => history.push(`/${activeSingleProperty.id}/property/photos`)}
                        >
                          <span className="text"> View</span> <span className="arrow-symbol">&#62; </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="pos-r w-perc-100 ov-h w-perc-sm-65 mt-3 mt-sm-0 brdRadius shadow-2dp dis-fl-col jc-b pt-2 cur-poi shadowHover-4dp bgBlue100 px-2"
                  onClick={() => openBrixelPage()}
                >
                  <div className="dis-f-md a-b h-perc-100">
                    <div className="dis-fl-col mb-a">
                      <span className="fsize-400 txtBlue400">Brixel Page</span>

                      <span className="fsize-500 fsize-md-600 fweight-600 txtBlue700 mb-2 mt-1">
                        Preview your property website
                      </span>
                    </div>
                    <div
                      className=" w-perc-100 image-ratio zIndex1 pos-r min-w-fix-280 brdRadiusTop ov-h"
                    >
                      <div className="pos-a-fix x-l-0 x-t-0 w-perc-100 h-fix-16 bgDark400 zIndex1" />
                      <CoverPropertyImage
                        className="cover w-perc-100"
                        coverPhoto={get(formValue, 'coverPhoto.galleryThumbnailPath', undefined)}
                        propertyType={get(formValue, 'properties.propertyType', undefined)}
                      />
                      <img
                        className="pos-a-fix x-l-2 x-b-2 noRatio"
                        src={placeholderTextPropertyImg}
                        alt="placeholder property information"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }

        {
          progressState.step >= 3 && progressState.step < 5 && (
            <>
              <div className="dis-f jc-b flex-wrap">
                <div className="w-perc-100 w-perc-md-70 w-perc-lg-100 w-perc-xl-70 pr-md-1 pr-lg-0 pr-xl-1">
                  <DashboardPropertyCard smallLayout />
                </div>
                <div
                  className="w-perc-100 w-perc-md-30 w-perc-lg-100 w-perc-xl-30 pl-md-1 pl-lg-0 pl-xl-1 mt-md-0 mt-lg-3 mt-xl-0"
                >
                  <Link
                    to={`/${activeSingleProperty.id}/marketing`}
                    className="brdRadius bgWhite shadow-2dp shadowHover-4dp pt-2 mt-2 mt-md-0 cur-poi txtDark700 dis-b h-perc-100"
                  >
                    <div className="h-perc-100 dis-fl-col jc-b">
                      <div className="dis-f px-3">
                        <BrixelIcon
                          icon="mike"
                          color="blue"
                          saturationTxt={700}
                        />
                        <span className="txtDark700 fweight-600 pl-1">Marketing</span>
                      </div>
                      <div className="px-3">
                        {
                          Object.keys(get(activeSingleCompany, 'availablePortals', {})).map((portal, i) => (
                            <React.Fragment
                              key={`actCmp_${i.toString()}`}
                            >
                              {
                                get(activeSingleCompany, `availablePortals[${portal}]`, null) && (
                                  <span className="txtDark700 fsize-300 fsize-sm-400 dis-f jc-b a-c w-perc-100 tt-c">
                                    <span>{portal}</span>
                                    <span className={`activeDot ${get(activeSingleProperty, `portals[${portal}]`, null) ? 'green' : 'grey'}`} />
                                  </span>
                                )
                              }
                            </React.Fragment>
                          ))
                        }
                      </div>
                      <div className="linkWrap">
                        <span className="hr lighter" />
                        <div className="px-3 py-1 txtLight700 wHover">
                          <span className="text">View</span>
                          <span className="arrow-symbol ml-1">&#62; </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="dis-fl-col dis-fl-row-xs my-3 shadow-2dp-sm shadow-0dp-md brdRadius-sm brdRadiusNone-md ov-h-sm ov-v-md">
                <div
                  className="w-perc-100 w-perc-sm-33 bgWhite brdRadius-md ta-c p-3 pb-6 mr-md-1 shadow-2dp shadow-2dp-md shadow-0dp-sm dis-fl-row dis-fl-col-xs jc-b a-c shadowHover-4dp shadowHover-4dp-md shadowHover-0dp-sm cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                >
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="interested"
                    color="red"
                  />
                  <h6 className="mt-xs-2 fweight-400">Interested</h6>
                  <p className="fSizePx64 fweight-600 txtRed700 mt-xs-3">
                    {get(activeSinglePropertyDealsCount, 'Interested.total', '')}
                  </p>
                </div>
                <div
                  className="w-perc-100 w-perc-sm-33 bgWhite brdRadius-md ta-c p-3 pb-6 mx-md-1 mt-2 mt-xs-0 shadow-2dp shadow-2dp-md shadow-0dp-sm brdSmallRight brdSmallLeft brdSmallHideLeft-md brdSmallHideRight-md brdLight200 dis-fl-row dis-fl-col-xs jc-b a-c shadowHover-4dp shadowHover-4dp-md shadowHover-0dp-sm cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                >
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="visited"
                    color="blue"
                  />
                  <h6 className="mt-xs-2 fweight-400">Visits</h6>
                  <p className="fSizePx64 fweight-600 txtBlue700 mt-xs-3">
                    {get(activeSinglePropertyDealsCount, 'Visit.total', '')}
                  </p>
                </div>
                <div
                  className="w-perc-100 w-perc-sm-33 bgWhite brdRadius-md ta-c p-3 pb-6 ml-md-1 mt-2 mt-xs-0 shadow-2dp shadow-2dp-md shadow-0dp-sm dis-fl-row dis-fl-col-xs jc-b a-c shadowHover-4dp shadowHover-4dp-md shadowHover-0dp-sm cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                >
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="offers"
                    color="primary"
                  />
                  <h6 className="mt-xs-2 fweight-400">Offers</h6>
                  <p className="fSizePx64 fweight-600 txtPrimary400 mt-xs-3">
                    {get(activeSinglePropertyDealsCount, 'Offer.total', '')}
                  </p>
                </div>
              </div>

              {
                visitLists && (
                  <div className="brdRadius bgWhite shadow-2dp">
                    <div className="dis-f jc-b a-c px-2 pt-2">
                      <div className="dis-f a-c w-perc-100 mr-2">
                        <BrixelIcon
                          iconWidth="w-fix-32"
                          icon="visited"
                          color="blue"
                          saturationTxt={400}
                        />
                        <h5 className="ml-2 ml-sm-3 fsize-500">Confirmed visits</h5>
                      </div>
                      {
                        visitLists.length > 0 && (
                          <BrixelButtonPrimary
                            className="ml-a ml-sm-0"
                            rounded
                            label="All"
                            onClick={() => history.push('')}
                          />
                        )
                      }
                    </div>
                    {
                      visitLists.length === 0 && (
                        <div
                          className="dis-f jc-b a-c w-perc-100 brdSmallTop my-2 pt-2 brdLight200 px-2 flex-wrap"
                        >
                          <h5 className="ta-c mx-a">You don&apos;t have any visits</h5>
                        </div>
                      )
                    }
                    {
                      visitLists.map((visit, i) => (
                        <div
                          key={`vst_${i.toString()}`}
                          className="dis-f jc-b a-c w-perc-100 brdSmallTop my-2 pt-2 brdLight200 px-2 flex-wrap"
                        >
                          <div
                            className={`dis-f a-c ${classWidthTable(0)} order-1 cur-poi`}
                            onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.id}`)}
                          >
                            <BrixelAvatar
                              baseURL={get(baseByData, 'shortPath', '')}
                              profileId={get(visit, 'user.id', null)}
                              name={get(visit, 'user.name', '') ? get(visit, 'user.name', '') : 'No Name'}
                              size="large"
                            />
                            <p className="ml-2">
                              {get(visit, 'user.name', '')}
                            </p>
                          </div>
                          <p
                            className={`${classWidthTable(1)} ${!visit.past ? 'txtPrimary400' : 'txtLight600'} order-3 order-md-2 cur-poi`}
                            onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.id}`)}
                          >
                            {DateTime.fromMillis(visit.visit, { locale: userLang }).toFormat('d LLL yyyy, H:mm')}
                          </p>
                          <p className={`${classWidthTable(2)} ta-r ta-l-md order-2 order-md-3`}>
                            {
                              visit.visit > DateTime.now().toMillis() ? (
                                <span className="txtDark700">Upcoming</span>
                              ) : (
                                <span className="txtLight600">Past</span>
                              )
                            }
                          </p>
                          <p className={`${classWidthTable(3)} order-4`}>
                            {
                              !visit.past && (
                                <ICalendarLink event={{
                                  title: 'My Title',
                                  description: 'My Description',
                                  startTime: DateTime.fromMillis(visit.visit).toISO(),
                                  // endTime: '2018-10-07T12:00:00+10:00',
                                  location: get(activeSingleProperty, 'location.address', ''),
                                  attendees: [
                                    `${loggedInUser.name} <${loggedInUser.email}>`,
                                  ],
                                }}
                                >
                                  <BrixelIcon
                                    icon="calendar-add"
                                    color="primary"
                                    saturationTxt={300}
                                    label="Add to calendar"
                                  />
                                </ICalendarLink>
                              )
                            }
                          </p>
                          <p className={`${classWidthTable(4)} ta-r ta-l-md order-5`}>
                            <button
                              type="button"
                              className="ml-a ml-md-0 txtLight600 fsize-400"
                              onClick={() => history.push(`/${activeSingleProperty.id}/prospects/${visit.id}/deal`)}
                            >
                              {visit.visit > DateTime.now().toMillis() ? 'View' : 'Review'}
                            </button>
                          </p>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </>
          )
        }
  
        {
          progressState.step === 5 && (
            <>
              
              <div className="brdRadius brdSmall brdGreen400 p-2 mb-3 fweight-400">
                <h6>
                  You successfully sold this property and transfered it to the new owner. You can still access your photos, 3D tour, and all documents for your memory.
                </h6>
              </div>
              
              <DashboardPropertyCard type="sold" />
        
              <div className="dis-fl-col dis-fl-row-sm">
  
                {
                  get(activeSingleCompany, 'links.review', null) && (
                    <div
                      onClick={() => window.open(get(activeSingleCompany, 'links.review', null), '_blank')}
                      className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite"
                    >
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-400 txtGreen400">
                          Review
                        </span>
                        <div className="dis-f a-c w-perc-100 mt-1 fsize-600 fweight-600">
                          <span className="pr-2">
                            We appreciate your stars.
                          </span>
                          <img
                            src={reviewSaleSvg}
                            alt="review Sale"
                          />
                        </div>
        
                        <BrixelButtonPrimary
                          onClick={() => window.open(get(activeSingleCompany, 'links.review', null), '_blank')}
                          className="mt-2 as-fs"
                          rounded
                          label="Review us on Google"
                        />
                      </div>
                    </div>
                  )
                }
                {
                  get(activeSingleCompany, 'links.survey', null) && (
                    <div
                      onClick={() => window.open(get(activeSingleCompany, 'links.survey', null), '_blank')}
                      className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite"
                    >
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-400 txtGreen400">
                          Feedback
                        </span>
                        <div className="dis-f a-c w-perc-100 mt-1 fsize-600 fweight-600">
                          <span className="pr-2">
                            Let us know how we did
                          </span>
                          <img
                            src={surveySaleSvg}
                            alt="Survey Sale"
                          />
                        </div>
          
                        <BrixelButtonSecondary
                          onClick={() => window.open(get(activeSingleCompany, 'links.survey', null), '_blank')}
                          className="mt-2 as-fs"
                          rounded
                          label="Fill our survey"
                        />
                      </div>
                    </div>
                  )
                }
              </div>
  
              <div
                onClick={() => history.push(`/buy`)}
                className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 w-perc-100 cur-poi ov-h mt-3 bgBlue100"
                style={{backgroundImage: `url(${marketNewHomeSvg})`}}
              >
                <div className="dis-fl-col max-w-perc-100">
                  <div className="dis-f a-c w-perc-100 mt-1 fsize-600 fweight-600">
                    <span className="pr-2 w-perc-100 max-w-fix-240">
                      Looking for a new home?
                    </span>
                  </div>
      
                  <BrixelButtonSecondary
                    bgTransparent
                    onClick={() => history.push(`/buy`)}
                    className="mt-2 as-fs"
                    rounded
                    label="Go to our market"
                  />
                </div>
              </div>
              
            </>
          )
        }

      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDeals: PropTypes.object,
  activeSinglePropertyDealsCount: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSinglePropertyDealsCount: PropTypes.func.isRequired,
  handleGetPageDeals: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  proEstimation: PropTypes.object,
  splashScreenType: PropTypes.string.isRequired,
  userLang: PropTypes.string.isRequired,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

DashboardHome.defaultProps = {
  activeSinglePropertyDeals: null,
  proEstimation: {},
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  proEstimation: get(state, 'brixelForm.Property.values.proEstimation', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userLang: get(state, 'user.loggedInUser.user.language', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyDealsCount: bindActionCreators(getActiveSinglePropertyDealsCount, dispatch),
  handleGetPageDeals: bindActionCreators(getPageDeals, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
