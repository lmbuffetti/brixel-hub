/* eslint-disable react-hooks/exhaustive-deps */
import {
  BrixelAvatar,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  BrixelProgressBar,
  FactsOptions,
  Helpers,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ICalendarLink from 'react-icalendar-link';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
// import cloneDeep from 'lodash/cloneDeep';
import { bindActionCreators, compose } from 'redux';
import { setModal, spinnerOff } from '../../../actions/CommonActions';
import { getContent } from '../../../actions/CraftCMS';
import { getActiveSinglePropertyDealsCount, getPageDeals, getEstimation } from '../../../actions/PropertyActions';
import BestimateCardOverlay from '../../../components/BestimateCardOverlay';
import DashboardPropertyCard from '../../../components/Cards/DashboardPropertyCard';
import DashboardPropertyCardSold from '../../../components/Cards/DashboardPropertyCardSold';
import CoverPropertyImage from '../../../components/CoverPropertyImage';

import Loading from '../../../components/Loading';
import ProgressSellerStage from '../../../components/ProgressSellerStage';
import completeDescriptionImg from '../../../images/dashboard/complete_description.svg';
import completeFactsImg from '../../../images/dashboard/complete_facts.svg';
import completedDescriptionImg from '../../../images/dashboard/completed_description.svg';
import completedFactsImg from '../../../images/dashboard/completed_facts.svg';
import marketNewHomeSvg from '../../../images/dashboard/marketMin.png';
import placeholderTextPropertyImg from '../../../images/dashboard/placeholderTextProperty.svg';
import reviewSaleSvg from '../../../images/dashboard/reviewSale.svg';
import surveySaleSvg from '../../../images/dashboard/surveySale.svg';
import bookTestDriveImg from '../../../images/TestDrive/bookTestDrive.png';
import contactTestDriveImg from '../../../images/TestDrive/contactTestDrive.svg';
import testDriveImg from '../../../images/dashboard/onboarding_testdrive.svg';
import { calcPercentageFacts } from '../../../utils/helpers';

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
    handleGetContentCraftCMS,
    handleGetPageDeals,
    handleGetEstimation,
    handleSetModal,
    isSmallLoading,
    loggedInUser,
    onProgressStep,
    splashScreenType,
    userLang,
    userTypes,
    windowDimensions,
  } = props;
  // STATE
  const [progressState, setProgressState] = useState({});
  const [visitLists, setVisitLists] = useState(null);
  // const [stepProgrss, setStepProgrss] = useState({});
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (progressState.step === 3) {
      handleGetActiveSinglePropertyDealsCount({ id: propID });
      handleGetPageDeals({ id: propID });
    }
    if (progressState.step === 1) {
      const payload = {
        type: 'market',
        id: activeSingleProperty.id,
      };
      handleGetEstimation(payload);
      handleGetPageDeals({ id: propID });
    }
  }, [progressState.step]);
  
  useEffect(() => {
    if (activeSingleCompany.id) {
      const data = {
        partner: activeSingleCompany.stub,
        language: userLang,
      };
      handleGetContentCraftCMS(data)
    }
  }, [activeSingleCompany.id]);
  

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

  useEffect(() => {
    onProgressStep(progressState)
  }, [progressState]);

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
        progressState.step < 5 && (
          <h4 className="mb-3 hide dis-b-lg fweight-600">
            <span>Welcome back</span>
            <span className="ml-small-4"> {loggedInUser && (<>{loggedInUser.firstName}</>)} 👋 </span>
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
                  stepIndexProgress={progressState.id}
                />
              )
            }
          </>
        )
      }

      <div className="max-w-fix-760 dis-fl-col pr-md-2">
        {
          progressState.step === 1 && (
            <>
              <DashboardPropertyCard />

              <div
                className="bgGreen100 shadow-2dp brdRadius p-2 p-sm-3 cardWithBg testDriveImg"
                style={{ backgroundImage: `url(${testDriveImg})` }}
              >
                <div className="dis-f a-t jc-b">
                  <div>
                    <h4 className="mb-2 fweight-600">Test drive our service. No strings attached.</h4>
                    <p className="fsize-300 txtDark700 max-w-perc-70">
                      <span>Get the full Brixel experience worth</span>
                      <span className="ml-small-4">
                        {get(activeSingleCompany, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(activeSingleCompany, 'meta.teaserPackage.price', ''), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))}.
                      </span>
                    </p>

                    <div className="dis-fl-col dis-fl-row-sm mt-3">
                      <BrixelButtonPrimary
                        onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`)}
                        className="as-fs min-w-fix-144"
                        rounded
                        label="Book now"
                      />

                      <BrixelButtonSecondary
                        onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/${activeSingleProperty.id}/home`)}
                        className="ml-sm-3 mt-1 mt-sm-0 min-w-fix-144 as-fs"
                        rounded
                        bgTransparent
                        themeSat={700}
                        label="Contact us"
                      />
                    </div>

                  </div>
                  {/* <img src={testDriveImg} alt="Test Drive" /> */}
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
              <DashboardPropertyCardSold />

              <div className="brdRadius brdSmall brdGreen400 p-2 mb-3 ">
                <h6 className="fweight-400 fsize-300">
                  You successfully sold this property and transfered it to the new owner. You can still access your photos, 3D tour, and all documents for your memory.
                </h6>
              </div>

              <div className="dis-fl-col dis-fl-row-sm">

                {
                  get(activeSingleCompany, 'links.review', null) && (
                    <button
                      onClick={() => window.open(get(activeSingleCompany, 'links.review', null), '_blank')}
                      className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite ta-l"
                    >
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-300 txtGreen400">
                          Review
                        </span>
                        <div className="dis-f w-perc-100 fsize-600 fweight-600 mt-1">
                          <span className="pr-1">
                            We appreciate your stars.
                          </span>
                          <img
                            src={reviewSaleSvg}
                            alt="review Sale"
                          />
                        </div>

                        <BrixelButtonPrimary
                          onClick={() => ''}
                          className="mt-2 as-fs"
                          rounded
                          label="Review us on Google"
                        />
                      </div>
                    </button>
                  )
                }
                {
                  get(activeSingleCompany, 'links.survey', null) && (
                    <button
                      onClick={() => window.open(get(activeSingleCompany, 'links.survey', null), '_blank')}
                      className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite ta-l"
                    >
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-300 txtGreen400">
                          Feedback
                        </span>
                        <div className="dis-f w-perc-100 fsize-600 fweight-600 mt-1">
                          <span className="pr-2">
                            Let us know how we did
                          </span>
                          <img
                            src={surveySaleSvg}
                            alt="Survey Sale"
                          />
                        </div>

                        <BrixelButtonSecondary
                          onClick={() => ''}
                          className="mt-2 as-fs"
                          rounded
                          label="Fill our survey"
                        />
                      </div>
                    </button>
                  )
                }
              </div>

              <div
                className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 w-perc-100 cur-poi ov-h mt-3 bgBlue100"
                style={{backgroundImage: `url(${marketNewHomeSvg})`, backgroundSize: 'auto 100%', backgroundPosition: 'right', backgroundRepeat: 'no-repeat'}}
              >
                <div className="dis-fl-col max-w-perc-100">
                  <div className="dis-f mt-1">
                    <span className="pr-2 max-w-fix-440 fsize-500 fweight-600 ">
                      Find and add your new home
                    </span>
                  </div>

                  <div className="dis-fl-col dis-fl-row-sm mt-3">
                    <BrixelButtonPrimary
                      onClick={() => history.push(`/buy`)}
                      className="as-fs"
                      rounded
                      label="Search market"
                    />

                    <BrixelButtonSecondary
                      bgTransparent
                      onClick={() => history.push(`/packageFlow/getStarted?company=${activeSingleCompany.stub}`)}
                      className="as-fs ml-sm-2 mt-1 mt-sm-0"
                      rounded
                      label="Add new property"
                    />
                  </div>
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
  handleGetContentCraftCMS: PropTypes.func.isRequired,
  handleGetPageDeals: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  onProgressStep: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  splashScreenType: PropTypes.string.isRequired,
  userLang: PropTypes.string.isRequired,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

DashboardHome.defaultProps = {
  activeSinglePropertyDeals: null,
  proEstimation: {},
  onProgressStep: () => '',
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
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userLang: get(state, 'user.loggedInUser.user.language', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyDealsCount: bindActionCreators(getActiveSinglePropertyDealsCount, dispatch),
  handleGetPageDeals: bindActionCreators(getPageDeals, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetContentCraftCMS: bindActionCreators(getContent, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
