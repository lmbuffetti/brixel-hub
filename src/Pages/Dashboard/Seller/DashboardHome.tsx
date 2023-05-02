import React, {useEffect, useState} from 'react';
import {
  BrixelAvatar,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
  BrixelIcon,
  BrixelProgressBar,
  FactsOptions,
  Helpers,
  ProgressRing,
} from '@brixel/brixel-components';
import documentConfig from '@brixel/brixel-components/dist/configuration/DocumentsConfig';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import {DateTime} from 'luxon';
import ICalendarLink from 'react-icalendar-link';
import {connect} from 'react-redux';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setModal, spinnerOff} from '../../../actions/CommonActions';
import {getActiveSinglePropertyDealsCount, getEstimation, getPageDeals} from '../../../actions/PropertyActions';
import BestimateCardOverlay from '../../../components/BestimateCardOverlay';
import DashboardPropertyCard from '../../../components/Cards/DashboardPropertyCard';
import DashboardPropertyCardSold from '../../../components/Cards/DashboardPropertyCardSold';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import ArticlesBox from '../../../components/CraftCMS/ArticlesBox';
import BannerBox from '../../../components/CraftCMS/BannerBox';
import ProgressSellerStage from '../../../components/ProgressSellerStage';
import completeDescriptionImg from '../../../images/dashboard/complete_description.svg';
import completeFactsImg from '../../../images/dashboard/complete_facts.svg';
import completedDescriptionImg from '../../../images/dashboard/completed_description.svg';
import completedFactsImg from '../../../images/dashboard/completed_facts.svg';
import marketNewHomeSvg from '../../../images/dashboard/marketMin.png';
import onboardingDocsImg from '../../../images/dashboard/onboardingDocs.svg';
import placeholderTextPropertyImg from '../../../images/dashboard/placeholderTextProperty.svg';
import reviewSaleSvg from '../../../images/dashboard/reviewSale.svg';
import surveySaleSvg from '../../../images/dashboard/surveySale.svg';
import bookTestDriveImg from '../../../images/TestDrive/bookTestDrive.png';
import contactTestDriveImg from '../../../images/TestDrive/contactTestDrive.svg';
import bookedTestDriveImg from '../../../images/TestDrive/scanTrialRequested.svg';
import {calcPercentageFacts, calcPercentageProEstimation} from '../../../utils/helpers';
import translateTo from '../../../utils/translation';
import type {DashboardHomeType} from '../../../@types/Pages/Dashboard/Seller/DashboardHome';
import {DealType, HistoryType} from '@brixel/brixel-components/dist/@types/Model';

const { factsOptions } = FactsOptions;

const craftCMSStubs = [
  {
    article: 'seller-hub-home-onboarding-article',
    banner: 'seller-hub-home-onboarding-banner-bottom',
    step: 1,
  }, {
    banner: 'seller-hub-home-onboarding-banner-bottom',
    article: 'seller-hub-home-preparation-articles',
    step: 2,
  },{
    banner: 'seller-hub-home-onboarding-banner-bottom',
    article: 'seller-hub-home-marketing-articles',
    step: 3,
  },{
    banner: 'seller-hub-home-onboarding-banner-bottom',
    article: 'seller-hub-home-negotiation-articles',
    step: 4,
  },{
    banner: 'seller-hub-home-onboarding-banner-bottom',
    article: 'seller-hub-home-closing-articles',
    step: 5,
  },{
    banner: 'seller-hub-home-sold-banner-bottom',
    article: 'seller-hub-home-sold-article',
    step: 6,
  },
]

const DashboardHome = (props: DashboardHomeType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    activeSinglePropertyDeals = null,
    activeSinglePropertyDealsCount,
    activeSinglePropertyHistory,
    documents,
    estimation,
    formValue,
    handleGetActiveSinglePropertyDealsCount,
    handleGetEstimation,
    handleGetPageDeals,
    handleSetModal,
    lang,
    loggedInUser,
    splashScreenType,
    windowDimensions,
  } = props;
  // STATE
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
  const [progressState, setProgressState] = useState<{step?: number; id?: number}>({});
  const [visitLists, setVisitLists] = useState<DealType[]>();
  const [activeScantrial, setActiveScanTrial] = useState<HistoryType>();
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (progressState.step === 3 || progressState.step === 4 || progressState.step === 5) {
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
    if (activeSinglePropertyDeals?.visit) {
      const mergedFeed: DealType[] = get(activeSinglePropertyDeals, 'visit.data', []).filter((visit) => get(visit, 'visit', null));
      if (mergedFeed) {
        let mergedFeedNew = mergedFeed.filter((visit) => visit.visit > DateTime.now().toMillis()).map((arr) => ({
          ...arr,
          past: false,
        }));
        let mergedFeedPast = mergedFeed.filter((visit) => visit.visit <= DateTime.now().toMillis()).map((arr) => ({
          ...arr,
          past: true,
        }));
        mergedFeedNew = orderBy(mergedFeedNew, ['visit'], ['asc']);
        2
        mergedFeedPast = orderBy(mergedFeedPast, ['visit'], ['desc']);
        setVisitLists([...mergedFeedNew, ...mergedFeedPast]);
      }
    }
  }, [activeSinglePropertyDeals]);

  useEffect(() => {
    if (activeSingleProperty?.id) {
      const defState = factsOptions.progressBarOptions.find((item) => item.value === get(activeSingleProperty, 'progress.state', null));
      const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === get(activeSingleProperty, 'progress.state', null));
      if (defState?.label === 'Sales Lead') defState.label = 'Onboarding';
      setProgressState({
        ...defState,
        id: defIndexState,
        step: defIndexState + 1,
      });
      if (get(activeSingleProperty, 'sellerStatus', '') === 'success') {
        setProgressState({
          ...defState,
          id: 5,
          step: 6,
        });
      }
      if (documentConfig.mandatoryDocuments[get(activeSingleProperty, 'location.countryCode', '')]) {
        setMandatoryDocuments(documentConfig.mandatoryDocuments[get(activeSingleProperty, 'location.countryCode', '')][get(activeSingleProperty, 'properties.propertyType')]);
      } else {
        setMandatoryDocuments(documentConfig.mandatoryDocuments.EN[get(activeSingleProperty, 'properties.propertyType', '')]);
      }
    }
  }, [activeSingleProperty.id]);

  useEffect(() => {
    if (activeSinglePropertyHistory.length > 0) {
      const getActiveScanTrial = activeSinglePropertyHistory.find((hst) => hst.actionStub === 'page-scan-trial');
      if (getActiveScanTrial && DateTime.now().toMillis() < get(getActiveScanTrial, 'meta.meta.date', 0)) {
        setActiveScanTrial(activeSinglePropertyHistory.find((hst) => hst.actionStub === 'page-scan-trial'));
      } else {
        setActiveScanTrial(undefined);
      }
    }
  }, [activeSinglePropertyHistory, activeSingleProperty.id]);

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
    if (progressState?.id && progressState.id > 0) {
      if (activeSingleProperty.published) {
        window.open(`${baseByData?.pageUrl}${activeSingleProperty.stub}`, '_blank');
      } else {
        window.location.assign(`${baseByData?.pageUrl}preview/${activeSingleProperty.stub}?hubUrl=${get(window, 'location.href', '')}`);
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
    // if (id === 2) return 'w-perc-40 w-perc-md-20';
    if (id === 3) return 'w-perc-20 w-perc-md-7 mt-1 mt-md-0';
    return 'w-perc-40 w-perc-md-13 mt-1 mt-md-0';
  };

  const boxScanTrial = () => (
    <div className="dis-f flex-wrap">
      {
        activeScantrial ? (
          <div className="pr-md-1 w-perc-100 w-perc-md-50 min-h-perc-100">
            <div
              className="dis-f jc-b brdRadius bgGreen100 shadow-2dp py-3 pl-3 ov-h h-perc-100"
              onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`)}
            >
              <div className="w-perc-100 max-w-fix-232">
                <h5 className="mb-2 fSizePx18 fweight-600 txtGreen700">
                  {translateTo('Thanks for your request.', lang)}
                </h5>
                <p className="fsize-300 txtText900">
                  <span>{translateTo('We will contact you as soon as possible for confirmation.', lang)}</span>
                </p>
                <BrixelButtonSecondary
                  bgTransparent
                  onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`)}
                  className="mt-3"
                  rounded
                  label={translateTo('View Details', lang)}
                />
              </div>
              <div className="w-perc-100 max-w-fix-136 ta-r">
                <img loading="lazy" src={bookedTestDriveImg} alt="Book Test Drive" />
              </div>
            </div>
          </div>
        ) : (
          <div className="pr-md-1 w-perc-100 w-perc-md-50 min-h-perc-100">
            <div
              className="dis-f jc-b brdRadius bgWhite shadow-2dp py-3 pl-3 ov-h h-perc-100"
              onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`)}
            >
              <div className="w-perc-100 max-w-fix-208">
                <h5 className="mb-2 fSizePx18 fweight-600">
                  {translateTo('Test drive our service. No strings attached.', lang)}
                </h5>
                <p className="fsize-300 txtText900">
                  <span>{translateTo('Get the full Brixel experience worth', lang)}</span>
                  <span className="ml-small-4">
                    {get(activeSingleCompany, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(activeSingleCompany, 'meta.teaserPackage.price', 0), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))}.
                  </span>
                </p>
                <BrixelButtonPrimary
                  onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/${activeSingleProperty.id}/home`)}
                  className="mt-3"
                  rounded
                  label={translateTo('Book now', lang)}
                />
              </div>
              <div className="w-perc-100 max-w-fix-136">
                <img loading="lazy" src={bookTestDriveImg} alt="Book Test Drive" />
              </div>
            </div>
          </div>
        )
      }

      <div className="mt-3 mt-md-0 pl-md-1 w-perc-100 w-perc-md-50 min-h-perc-100">
        <div
          onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/${activeSingleProperty.id}/home`)}
          className="dis-f jc-b brdRadius bgWhite shadow-2dp py-3 pl-3 ov-h h-perc-100"
        >
          <div className="w-perc-100 max-w-fix-208">
            <h5 className="mb-2 fSizePx18 fweight-600">
              {translateTo('Get in touch and find out more', lang)}
            </h5>
            <p className="fsize-300 txtText900">
              {translateTo('Chat to one of our team members now.', lang)}
            </p>
            <BrixelButtonPrimary
              onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/${activeSingleProperty.id}/home`)}
              className="mt-3"
              rounded
              theme="blue"
              themeSat={700}
              label={translateTo('Contact us', lang)}
            />
          </div>
          <div className="w-perc-100 max-w-fix-204 ta-r">
            <img
              loading="lazy"
              className='ml-a'
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
            lang={lang}
            activeSinglePropertyId={get(activeSingleProperty, 'customID', '')}
            clearEstimation
          />
        )
      }

      {
        progressState.step === 1 && (
          <h4 className="mb-3 hide dis-b-lg fweight-600">
            <span>{translateTo('Welcome', lang)}</span>
            <span className={`ml-small-4 ${loggedInUser.firstName && loggedInUser ? '' : 'skeletonBg dis-ib h-fix-32 w-fix-104 ml-1'}`}> {loggedInUser && loggedInUser.firstName && (<>{loggedInUser.firstName} 👋</>)} </span>
          </h4>
        )
      }

      {
        get(progressState, 'step', 0) < 5 && get(progressState, 'step', 0) > 1 && (
          <h4 className="mb-3 hide dis-b-lg fweight-600">
            <span>{translateTo('Welcome back', lang)}</span>
            <span className={`ml-small-4 ${loggedInUser.firstName && loggedInUser ? '' : 'skeletonBg dis-ib h-fix-32 w-fix-104 ml-1'}`}> {loggedInUser && loggedInUser.firstName && (<>{loggedInUser.firstName} 👋</>)} </span>
          </h4>
        )
      }

      {
        windowDimensions.width <= 1024 && (
          <>
            {
              activeSingleProperty.id && propID && propID.length > 9 && (
                <ProgressSellerStage
                  lang={lang}
                  className="mb-3"
                  smallLayout
                  xSmallMobile={windowDimensions.width <= 520}
                  stepIndexProgress={progressState.id || 1}
                />
              )
            }
          </>
        )
      }

      <div className="max-w-fix-1024 dis-fl-col pr-md-2">

        {
          !get(progressState, 'step', null) && (
            <div>
              <div className="h-fix-184 mb-3 w-perc-100 skeletonBg brdRadius" />
              <div className="dis-fl-col dis-fl-row-md mb-3">
                <div className="h-fix-200 w-perc-100 w-perc-md-50 skeletonBg mb-3 mb-md-0 mr-md-1 brdRadius"/>
                <div className="h-fix-200 w-perc-100 w-perc-md-50 skeletonBg mb-3 mb-md-0 ml-md-1 brdRadius"/>
              </div>
            </div>
          )
        }

        {
          progressState.step === 1 && (
            <>

              <DashboardPropertyCard
                lang={lang}
              />

              {boxScanTrial()}

              <div className="dis-f flex-wrap mt-3">
                {/* PRO ESTIMATION BOX */}
                <div className="pr-md-1 mb-3 mb-sm-0 w-perc-100 w-perc-md-50 min-h-perc-100">
                  <div
                    className="dis-f jc-b brdRadius bgBlue100 shadow-2dp py-3 pl-3 ov-h h-perc-100"
                    onClick={() => history.push(`/${activeSingleProperty.id}/property/price/proEstimation`)}
                  >
                    <div className="w-perc-100 max-w-fix-232">
                      <h4 className="fweight-600 txtBlue400">
                        {calcPercentageProEstimation('', activeSingleProperty).realPerc}%
                      </h4>
                      <h5 className="fweight-600 fSizePx18 txtBlue700">
                        {translateTo('of Pro Estimation complete', lang)}
                      </h5>
                      <BrixelButtonText
                        className="mt-3"
                        bgTransparent
                        theme="blue"
                        themeSat={700}
                        rightIcon="arrow-simple-right"
                        label={translateTo('Review', lang)}
                      />
                    </div>
                    <div className="w-perc-100 max-w-fix-136 dis-f a-c">
                      <ProgressRing
                        progress={calcPercentageProEstimation('', activeSingleProperty).realPerc}
                        size={100}
                        strokeWidth={20}
                        circleOneStroke="#96DAEA"
                        circleTwoStroke="#004D71"
                        showIconComplete={calcPercentageProEstimation('', activeSingleProperty).realPerc >= 100}
                        showIcon={false}
                        showIconCompleteColor="blue"
                        showIconCompleteSize="large"
                      />
                    </div>
                  </div>
                </div>

                {/* DOCUBOX BOX */}
                <div className="pl-md-1 w-perc-100 w-perc-md-50 min-h-perc-100">
                  <div
                    className="dis-f jc-b brdRadius bgRed100 shadow-2dp py-3 pl-3 ov-h h-perc-100"
                    onClick={() => history.push(`/${activeSingleProperty.id}/docubox`)}
                  >
                    <div className="w-perc-100 max-w-fix-232">
                      <h4 className="fweight-600 txtRed400">
                        <span>{countMandatoryDocuments()}</span>
                        <span className="ml-small-4">
                          {translateTo('of', lang)}
                        </span>
                        <span className="ml-small-4">{mandatoryDocuments ? mandatoryDocuments.length : 0}</span>
                      </h4>
                      <h5 className="fweight-600 fSizePx18 txtRed700">
                        {translateTo('uploaded on your docubox', lang)}
                      </h5>

                      <BrixelButtonText
                        className="mt-3"
                        bgTransparent
                        theme="red"
                        rightIcon="arrow-simple-right"
                        label={translateTo('Upload', lang)}
                      />
                    </div>
                    <div className="w-perc-100 max-w-fix-136 ta-r">
                      <img src={onboardingDocsImg} alt="Docubox Image" />
                    </div>
                  </div>
                </div>

              </div>

              <span className="dis-b mt-2-neg"></span>

            </>
          )
        }

        {
          progressState.step === 2 && (
            <>
              <DashboardPropertyCard
                lang={lang}
              />

              {boxScanTrial()}

              <div className="mt-3 dis-fl-col dis-fl-row-sm">

                {/* FACTS */}
                <div
                  onClick={() => history.push(`/${activeSingleProperty.id}/property/facts`)}
                  className="shadow-2dp bgRed50 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtRed400">
                      {translateTo('Facts', lang)}
                    </span>

                    <span className="fsize-500 fsize-md-600 fweight-600 txtRed700 mb-2 mt-1">
                      {translateTo((calcPercentageFacts().realPerc * 100) / 40 > 100 ? 'Completed relevant facts' : 'Complete relevant facts', lang)}
                    </span>

                    <BrixelProgressBar
                      progressValue={(calcPercentageFacts().realPerc * 100) / 40 > 100 ? 100 : (calcPercentageFacts().realPerc * 100) / 40}
                      saturation={400}
                      color="Red"
                    />

                  </div>
                  <div className="ml-2 ml-lg-5 w-perc-100 w-fix-xl-112 dis-f a-c">
                    <img
                      loading="lazy"
                      src={(calcPercentageFacts().realPerc * 100) / 40 > 100 ? completedFactsImg : completeFactsImg}
                      alt="Complete Facts"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div
                  className="shadow-2dp bgPrimary50 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtPrimary400">
                      <span
                        onClick={() => history.push(`/${activeSingleProperty.id}/property/facts/description`)}
                      >
                        {translateTo('Description', lang)}
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
                              title: translateTo('How to add your description', lang),
                              body: `<ol>
                            <li>${translateTo('Add a title', lang)}</li>
                            <li>${translateTo('Add a description with min. 300 characters incl. spaces', lang)}</li>
                            <li>${translateTo('Describe location with min. 160 characters incl. spaces', lang)}</li>
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
                      {translateTo(completeDescritpion() ? 'Thanks for adding your description!' : 'Add your description', lang)}
                    </span>

                  </div>
                  <div className="ml-2 ml-lg-5 w-perc-100 w-fix-xl-112 dis-f a-c">
                    <img
                      loading="lazy"
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
                    className="w-perc-100 brdRadius bgWhite shadow-2dp shadowHover-4dp pt-2 cur-poi txtText900"
                  >
                    <div className="h-perc-100 min-h-fix-184 dis-fl-col jc-b">
                      <div className="dis-f px-3">
                        <BrixelIcon
                          icon="folder-open"
                          color="blue"
                          saturationTxt={700}
                        />
                        <span className="txtText900 fweight-600 pl-1">
                          {translateTo('Media', lang)}
                        </span>
                      </div>
                      <div className="px-3 py-2 h-perc-100">
                        <div>
                          <div
                            className="dis-f jc-b a-c"
                            onClick={() => history.push(`/${activeSingleProperty.id}/property/photos`)}
                          >
                            <span>{translateTo('Photos', lang)}</span>
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
                            <span>{translateTo('Plans', lang)}</span>
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
                            <span>{translateTo('3d tour', lang)}</span>
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
                          className="txtHoverText600 txtText500 px-3 py-1 wHover"
                          onClick={() => history.push(`/${activeSingleProperty.id}/property/photos`)}
                        >
                          <span className="text">{translateTo('View', lang)}</span>
                          <span className="arrow-symbol ml-1">&#62; </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="pos-r w-perc-100 ov-h w-perc-sm-65 mt-3 mt-sm-0 brdRadius shadow-2dp dis-fl-col jc-b pt-2 cur-poi shadowHover-4dp bgBlue50 px-2"
                  onClick={() => openBrixelPage()}
                >
                  <div className="dis-f-md a-b h-perc-100">
                    <div className="dis-fl-col mb-a">
                      <span className="fsize-400 txtBlue400">
                        {translateTo('Brixel Page', lang)}
                      </span>

                      <span className="fsize-500 fsize-md-600 fweight-600 txtBlue700 mb-2 mt-1">
                        {translateTo('Preview your property website', lang)}
                      </span>
                    </div>
                    <div
                      className=" w-perc-100 image-ratio zIndex1 pos-r min-w-fix-280 brdRadiusTop ov-h"
                    >
                      <div className="pos-a-fix x-l-0 x-t-0 w-perc-100 h-fix-16 bgText700 zIndex1" />
                      <CoverPropertyImage
                        className="cover w-perc-100"
                        coverPhoto={get(formValue, 'coverPhoto.url', '')}
                        propertyType={get(formValue, 'properties.propertyType', undefined)}
                        size="M"
                      />
                      <img
                        loading="lazy"
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
          get(progressState, 'step', 0) >= 3 && get(progressState, 'step', 0) <= 5 && (
            <>
              <div className="dis-fl-col dis-fl-row-md jc-b flex-wrap">
                <div className="w-perc-100 w-perc-md-67 pr-md-1 pr-lg-0 pr-xl-1">
                  <DashboardPropertyCard
                    lang={lang}
                    smallLayout
                  />
                </div>
                <div
                  className="w-perc-100 w-perc-md-33 pl-md-1 pl-lg-0 pl-xl-1 mt-xl-0"
                >
                  <Link
                    to={`/${activeSingleProperty.id}/marketing`}
                    className="brdRadius bgWhite shadow-2dp shadowHover-4dp pt-2 mt-2 mt-md-0 cur-poi txtText900 dis-b h-perc-100"
                  >
                    <div className="h-perc-100 dis-fl-col jc-b">
                      <div className="dis-f px-3">
                        <BrixelIcon
                          icon="mike"
                          color="blue"
                          saturationTxt={700}
                        />
                        <span className="txtText900 fweight-600 pl-1">
                          {translateTo('Marketing', lang)}
                        </span>
                      </div>
                      <div className="px-3 py-2">
                        {
                          Object.keys(get(activeSingleCompany, 'availablePortals', {})).map((portal, i) => (
                            <React.Fragment
                              key={`actCmp_${i.toString()}`}
                            >
                              {
                                get(activeSingleCompany, `availablePortals[${portal}]`, null) && (
                                  <span className="txtText900 fsize-300 fsize-sm-400 dis-f jc-b a-c w-perc-100 tt-c">
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
                        <div className="px-3 py-1 txtText500 wHover">
                          <span className="text">{translateTo('View', lang)}</span>
                          <span className="arrow-symbol ml-1">&#62; </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="dis-fl-col dis-fl-row-xs my-3 shadow-2dp-sm shadow-0dp-md brdRadius-sm brdRadiusNone-md ov-h-sm ov-v-md">
                <div
                  className="w-perc-100 w-perc-sm-33 bgWhite brdRadius-md ta-c p-3 mr-md-1 shadow-2dp shadow-2dp-md shadow-0dp-sm dis-fl-row dis-fl-col-xs a-c shadowHover-4dp shadowHover-4dp-md shadowHover-0dp-sm cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                >
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="interested"
                    color="red"
                  />
                  <h6 className="mt-xs-2 fweight-400">
                    {translateTo('Interested', lang)}
                  </h6>

                  <div className={`lh-50 mt-xs-3 fSizePx64 fweight-600 txtRed700 ${!visitLists ? 'h-fix-48 w-fix-40 skeletonBg' : ''}`}>
                    {get(activeSinglePropertyDealsCount, 'Interested.total', '')}
                  </div>
                </div>
                <div
                  className="w-perc-100 w-perc-sm-33 bgWhite brdRadius-md ta-c p-3 mx-md-1 mt-2 mt-xs-0 shadow-2dp shadow-2dp-md shadow-0dp-sm brdSmallRight brdSmallLeft brdSmallHideLeft-md brdSmallHideRight-md brdText50 dis-fl-row dis-fl-col-xs a-c shadowHover-4dp shadowHover-4dp-md shadowHover-0dp-sm cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                >
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="visited"
                    color="blue"
                  />
                  <h6 className="mt-xs-2 fweight-400">
                    {translateTo('Visits', lang)}
                  </h6>
                  <div className={`lh-50 mt-xs-3 fSizePx64 fweight-600 txtRed700 ${!visitLists ? 'h-fix-48 w-fix-40 skeletonBg' : ''}`}>
                    {get(activeSinglePropertyDealsCount, 'Visit.total', '')}
                  </div>
                </div>
                <div
                  className="w-perc-100 w-perc-sm-33 bgWhite brdRadius-md ta-c p-3 ml-md-1 mt-2 mt-xs-0 shadow-2dp shadow-2dp-md shadow-0dp-sm dis-fl-row dis-fl-col-xs a-c shadowHover-4dp shadowHover-4dp-md shadowHover-0dp-sm cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                >
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="offers"
                    color="primary"
                  />
                  <h6 className="mt-xs-2 fweight-400">
                    {translateTo('Offers', lang)}
                  </h6>
                  <div className={`lh-50 mt-xs-3 fSizePx64 fweight-600 txtRed700 ${!visitLists ? 'h-fix-48 w-fix-40 skeletonBg' : ''}`}>
                    {get(activeSinglePropertyDealsCount, 'Offer.total', '')}
                  </div>
                </div>
              </div>

              {
                visitLists ? (
                  <div className="brdRadius bgWhite shadow-2dp">
                    <div className="dis-f jc-b a-c px-2 pt-2">
                      <div className="dis-f a-c w-perc-100 mr-2 pb-2">
                        <BrixelIcon
                          iconWidth="w-fix-32"
                          icon="visited"
                          color="blue"
                          saturationTxt={400}
                        />
                        <h5 className="ml-2 ml-sm-3 fsize-500">
                          {translateTo('Confirmed visits', lang)}
                        </h5>
                      </div>
                      {
                        visitLists.length > 0 && (
                          <BrixelButtonPrimary
                            className="ml-a ml-sm-0"
                            rounded
                            label={translateTo('All', lang)}
                            onClick={() => history.push('')}
                          />
                        )
                      }
                    </div>
                    {
                      visitLists.length === 0 && (
                        <div
                          className="dis-f jc-b a-c w-perc-100 brdSmallTop py-4 brdText50 px-2 flex-wrap"
                        >
                          <h5 className="ta-c mx-a">
                            {translateTo('You don\'t have any visits', lang)}
                          </h5>
                        </div>
                      )
                    }
                    {
                      visitLists.map((visit, i) => (
                        <div
                          key={`vst_${i.toString()}`}
                          className="dis-f jc-b a-c w-perc-100 brdSmallTop my-2 pt-2 brdText50 px-2 flex-wrap"
                        >
                          <div
                            className={`dis-f a-c ${classWidthTable(0)} order-1 cur-poi`}
                            onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.id}`)}
                          >
                            <BrixelAvatar
                              avatarImg={get(loggedInUser, 'avatarUrl', undefined)}
                              name={get(visit, 'user.name', '') ? get(visit, 'user.name', '') : 'No Name'}
                              size="M"
                            />
                            <p className="ml-2">
                              {get(visit, 'user.name', '')}
                            </p>
                          </div>
                          <p
                            className={`${classWidthTable(1)} ${!get(visit, 'past', null) ? 'txtPrimary400' : 'txtText400'} order-3 order-md-2 cur-poi`}
                            onClick={() => history.push(`/${activeSingleProperty.id}/prospect/${visit.id}`)}
                          >
                            {DateTime.fromMillis(visit.visit, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                          </p>
                          <p className={`${classWidthTable(2)} ta-r ta-l-md order-2 order-md-3`}>
                            {
                              visit.visit > DateTime.now().toMillis() ? (
                                <span className="txtText900">{translateTo('Upcoming', lang)}</span>
                              ) : (
                                <span className="txtText400">{translateTo('Past', lang)}</span>
                              )
                            }
                          </p>
                          <p className={`${classWidthTable(3)} order-4`}>
                            {
                              !get(visit, 'past', null) && (
                                <ICalendarLink
                                  event={{
                                    title: 'My Title',
                                    description: 'My Description',
                                    startTime: DateTime.fromMillis(visit.visit).toISO() || '',
                                    // endTime: '2018-10-07T12:00:00+10:00',
                                    location: get(activeSingleProperty, 'location.address', ''),
                                    attendees: [
                                      `${loggedInUser.name} <${loggedInUser.email}>`,
                                    ],
                                  }}
                                />
                              )
                            }
                          </p>
                          <p className={`${classWidthTable(4)} ta-r ta-l-md order-5`}>
                            <button
                              type="button"
                              className="ml-a ml-md-0 txtText400 fsize-400"
                              onClick={() => history.push(`/${activeSingleProperty.id}/prospects/${visit.id}/deal`)}
                            >
                              {translateTo(visit.visit > DateTime.now().toMillis() ? 'View' : 'Review', lang)}
                            </button>
                          </p>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="h-fix-120 mb-2 w-perc-100 skeletonBg brdRadius" />
                )
              }

            </>
          )
        }

        {
          progressState.step === 6 && (
            <>
              <DashboardPropertyCardSold lang={lang} />

              <div className="brdRadius brdSmall brdGreen400 p-2 mb-3 ">
                <h6 className="fweight-400 fsize-300">
                  {translateTo('You successfully sold this property and transfered it to the new owner. You can still access your photos, 3D tour, and all documents for your memory.', lang)}
                </h6>
              </div>

              <div className="dis-fl-col dis-fl-row-sm">

                {
                  get(activeSingleCompany, 'links.review', null) ? (
                    <button
                      onClick={() => window.open(get(activeSingleCompany, 'links.review', ''), '_blank')}
                      className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite ta-l"
                    >
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-300 txtGreen400">
                          {translateTo('Review', lang)}
                        </span>
                        <div className="dis-f w-perc-100 fsize-600 fweight-600 mt-1">
                          <span className="pr-1">
                            {translateTo('We appreciate your stars.', lang)}
                          </span>

                          <img
                            loading="lazy"
                            src={reviewSaleSvg}
                            alt="review Sale"
                          />
                        </div>

                        <BrixelButtonPrimary
                          onClick={() => ''}
                          className="mt-2 as-fs"
                          rounded
                          label={translateTo('Review us on Google', lang)}
                        />
                      </div>
                    </button>
                  ) : (
                    <div className="h-fix-204 w-perc-50 skeletonBg" />
                  )
                }
                {
                  get(activeSingleCompany, 'links.survey', null) && (
                    <button
                      onClick={() => window.open(get(activeSingleCompany, 'links.survey', ''), '_blank')}
                      className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite ta-l"
                    >
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-300 txtGreen400">
                          {translateTo('Feedback', lang)}
                        </span>
                        <div className="dis-f w-perc-100 fsize-600 fweight-600 mt-1">
                          <span className="pr-2">
                            {translateTo('Let us know how we did', lang)}
                          </span>
                          <img
                            loading="lazy"
                            src={surveySaleSvg}
                            alt="Survey Sale"
                          />
                        </div>

                        <BrixelButtonSecondary
                          onClick={() => ''}
                          className="mt-2 as-fs"
                          rounded
                          label={translateTo('Fill our survey', lang)}
                        />
                      </div>
                    </button>
                  )
                }
              </div>

              <div
                className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 w-perc-100 cur-poi ov-h mt-3 bgBlue50 min-h-fix-200 a-c"
                style={{backgroundImage: `url(${marketNewHomeSvg})`, backgroundSize: 'auto 100%', backgroundPosition: 'right', backgroundRepeat: 'no-repeat'}}
              >
                <div className="dis-fl-col max-w-perc-100">
                  <div className="dis-f mt-1">
                    <span className="pr-2 max-w-fix-440 fsize-500 fweight-600 ">
                      {translateTo('Find and add your new home', lang)}
                    </span>
                  </div>

                  <div className="dis-fl-col dis-fl-row-sm mt-3">
                    <BrixelButtonPrimary
                      onClick={() => history.push('/buy')}
                      className="as-fs"
                      rounded
                      label={translateTo('Search market', lang)}
                    />

                    <BrixelButtonSecondary
                      bgTransparent
                      onClick={() => history.push(`/packageFlow/getStarted?company=${activeSingleCompany.stub}`)}
                      className="as-fs ml-sm-2 mt-1 mt-sm-0"
                      rounded
                      label={translateTo('Add new property', lang)}
                    />
                  </div>
                </div>
              </div>

            </>
          )
        }

        {
          progressState?.step && (
            <>
              {
                progressState?.step === 6 && (
                  <ArticlesBox
                    activeSingleProperty={activeSingleProperty}
                    activeSingleCompany={activeSingleCompany}
                    lang={lang}
                    placementSlug="seller-hub-home-sold-partner"
                  />
                )
              }
              <ArticlesBox
                activeSingleProperty={activeSingleProperty}
                activeSingleCompany={activeSingleCompany}
                lang={lang}
                placementSlug={craftCMSStubs[progressState.step - 1].article}
              />

              <BannerBox
                activeSingleCompany={activeSingleCompany}
                className="mt-6"
                lang={lang}
                placementSlug={craftCMSStubs[progressState.step - 1].banner}
              />

            </>
          )
        }

      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  activeSinglePropertyHistory: get(state, 'history.activeSinglePropertyHistory.data', []),
  documents: get(state, 'property.activeSingleProperty.documents', []),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyDealsCount: bindActionCreators(getActiveSinglePropertyDealsCount, dispatch),
  handleGetPageDeals: bindActionCreators(getPageDeals, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
