/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
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
import has from 'lodash/has';
import documentConfig from '@brixel/brixel-configuration-partner/src/DocumentsConfig';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { calcPercentageFacts, calcPercentageProEstimation } from '../../../utils/helpers';
import docIcon from '../../../images/dashboard/icon-docs.svg';
import completeFactsImg from '../../../images/dashboard/complete_facts.svg';
import completeDescriptionImg from '../../../images/dashboard/complete_description.svg';
import completedDescriptionImg from '../../../images/dashboard/completed_description.svg';
import placeholderTextPropertyImg from '../../../images/dashboard/placeholderTextProperty.svg';

import Loading from '../../../components/Loading';
import { setModal, spinnerOff } from '../../../actions/CommonActions';
import { getActiveSinglePropertyDealsCount, getPageDeals } from '../../../actions/PropertyActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import DashboardPropertyCard from '../../../components/DashboardPropertyCard';

const BoxTrialTestDirve = lazy(() => import('../../../components/BoxTrialTestDirve'));

const { factsOptions } = FactsOptions;

const DashboardHome = (props) => {
  // PROPS
  const {
    activeSinglePropertyDeals,
    activeSingleCompany,
    activeSingleProperty,
    activeSinglePropertyDealsCount,
    estimation,
    formValue,
    handleSetModal,
    handleGetActiveSinglePropertyDealsCount,
    handleGetPageDeals,
    history,
    isSmallLoading,
    loggedInUser,
    proEstimation,
    userTypes,
    windowDimensions,
  } = props;
  // STATE
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
  const [progressState, setProgressState] = useState({});
  const [visitLists, setVisitLists] = useState([]);
  // const [stepProgrss, setStepProgrss] = useState({});

  const { documents } = formValue;

  useEffect(() => {
    if (has(formValue, 'location.countryCode')) {
      setMandatoryDocuments(documentConfig.mandatoryDocuments[get(formValue, 'location.countryCode')][get(formValue, 'properties.propertyType')]);
    }
  }, [formValue]);

  useEffect(() => {
    if (progressState.step === 3) {
      handleGetActiveSinglePropertyDealsCount({ id: activeSingleProperty.id });
      handleGetPageDeals({ id: activeSingleProperty.id });
    }
  }, [progressState.step]);

  useEffect(() => {
    if (activeSinglePropertyDeals && activeSinglePropertyDeals.length > 0) {
      activeSinglePropertyDeals.forEach((deal) => {
        if (has(deal, 'Visit')) {
          setVisitLists(deal.Visit.data.filter((visit) => get(visit, 'visit', null)));
        }
      });
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
        window.location.assign(`${baseByData.pageUrl}${activeSingleProperty.stub}`);
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

  // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
  if ((!activeSingleProperty.id && !userTypes) || isSmallLoading.getProperty) {
    return <Loading />;
  }

  // const classToHide = get(history, 'location.state.hideBackPage', false);

  return (
    <div className="rewards-container" id="rewardsDashboard">
      <h4 className="mb-3 hide dis-b-lg fweight-600">
        <span>Welcome back</span>
        <span className="ml-small-4">{loggedInUser.firstName} 👋</span>
      </h4>

      <div className="max-w-fix-760 dis-fl-col">
        {
          progressState.step === 1 && (
            <>
              <DashboardPropertyCard />
              <div className="dis-fl-col dis-fl-row-sm">
                <div
                  onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
                  className="shadow-2dp bgAltMist200 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  {
                    get(proEstimation, 'value', null) ? (
                      <div className="dis-fl-col max-w-perc-100">
                        <span className="fsize-400 txtAltMist400">Pro estimation</span>
                        {
                          get(proEstimation, 'value', 0) > 0 && (
                            <>
                              <div className="dis-f a-c w-perc-100 mt-1 fsize-600 fweight-600 txtAltBlue400">
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
                                theme="AltBlue"
                                themeSat={400}
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
                          <span className="fsize-400 txtAltMist400">Pro estimation</span>

                          <span className="fsize-600 fweight-600 txtAltBlue400">
                            <span>{calcPercentageProEstimation().realPerc}%</span>
                            <span className="ml-small-4"> Complete</span>
                          </span>
                          {
                            calcPercentageProEstimation().realPerc < 100 ? (
                              <BrixelButtonPrimary
                                onClick={() => window.location.assign(`/${activeSingleProperty.id}/property/price/formFlow`)}
                                label="Next step"
                                theme="AltBlue"
                                themeSat={400}
                                className="mt-2 as-fs"
                                rounded
                              />
                            ) : (
                              <BrixelButtonSecondary
                                bgTransparent
                                onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
                                className="mt-2"
                                theme="AltBlue"
                                themeSat={400}
                                rounded
                                ghost
                                label="Pending"
                              />
                            )
                          }
                        </div>
                        <div className={`div ${windowDimensions.width <= 590 ? 'min-w-fix-80' : 'min-w-fix-104'}`}>
                          <ProgressRing
                            customIcon={get(proEstimation, 'value', 0) <= 0 && calcPercentageProEstimation().realPerc === 100 ? 'hourglass' : null}
                            iconColor={{
                              color: 'altGreen',
                              sat: 400,
                            }}
                            progress={calcPercentageProEstimation().realPerc}
                            size={windowDimensions.width <= 590 ? 80 : 100}
                            strokeWidth={windowDimensions.width <= 590 ? 10 : 14}
                            circleOneStroke="#fff"
                            circleTwoStroke={calcPercentageProEstimation().realPerc === 100 ? '#218B80' : '#1E1491'}
                            showIcon={false}
                            showIconComplete={calcPercentageProEstimation().realPerc === 100}
                          />
                        </div>
                      </>
                    )
                  }
                </div>
                <div
                  className="shadow-2dp bgAltGreen200 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 ml-sm-1 w-perc-100  w-perc-sm-50 cur-poi"
                  onClick={() => history.push(`/${activeSingleProperty.id}/docubox`)}
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtAltGreen300">Docubox</span>
                    <span className="fsize-600 fweight-600 txtAltGreen400">
                      <span>{countMandatoryDocuments()}</span>
                      <span className="mx-small-4">of</span>
                      <span>{mandatoryDocuments ? mandatoryDocuments.length : 0} </span>
                      <span className="ml-small-1"> uploaded</span>
                    </span>
                    <BrixelButtonPrimary
                      onClick={() => history.push(`/${activeSingleProperty.id}/docubox`)}
                      label="Upload"
                      theme="AltGreen"
                      themeSat={400}
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
                          color="AltBlue"
                          saturationTxt={400}
                        />
                        <span className="txtDark700 fweight-600 pl-1">Facts</span>
                      </div>
                      <div className="px-3 pb-2">
                        <BrixelProgressBar
                          progressValue={calcPercentageFacts().realPerc}
                          saturation={300}
                          color="AltGreen"
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
                          color="AltBlue"
                          saturationTxt={400}
                        />
                        <span className="txtDark700 fweight-600 pl-1">Marketing</span>
                      </div>
                      <div className="px-3">
                        {
                          Object.keys(get(activeSingleCompany, 'availablePortals', {})).map((portal, i) => (
                            <React.Fragment key={i.toString()}>
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
              <div className="dis-fl-col dis-fl-row-sm">

                {/* FACTS */}
                <div
                  onClick={() => history.push(`/${activeSingleProperty.id}/property/facts`)}
                  className="shadow-2dp bgAltRed300 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtAltRed400">Facts</span>

                    <span className="fsize-600 fweight-600 txtAltRed700 mb-2 mt-1">
                      Complete relevant facts
                    </span>

                    <BrixelProgressBar
                      progressValue={(calcPercentageFacts().realPerc * 100) / 40 > 100 ? 100 : (calcPercentageFacts().realPerc * 100) / 40}
                      saturation={400}
                      color="AltRed"
                    />

                  </div>
                  <img
                    className="ml-5"
                    src={completeFactsImg}
                    alt="Complete Facts"
                  />
                </div>

                {/* DESCRIPTION */}
                <div
                  className="shadow-2dp bgAltGreen200 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
                >
                  <div className="dis-fl-col">
                    <span className="fsize-400 txtAltGreen300">
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
                            color="altGreen"
                            saturationTxt={300}
                            onClick={() => handleSetModal({
                              state: true,
                              small: true,
                              classTitle: 'txtAltGreen400',
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
                      className="fsize-600 fweight-600 txtAltGreen400 mb-2 mt-1"
                    >
                      {completeDescritpion() ? 'Thanks for adding your description!\n' : 'Add your description'}
                    </span>

                  </div>
                  <img
                    onClick={() => history.push(`/${activeSingleProperty.id}/property/facts/description`)}
                    className="ml-5"
                    src={completeDescritpion() ? completedDescriptionImg : completeDescriptionImg}
                    alt="Complete Facts"
                  />
                </div>

              </div>

              <div className="dis-fl-col dis-fl-row-sm my-3">
                <div className="w-perc-100 w-perc-sm-35 dis-f pr-sm-2">

                  <Link
                    to={`/${activeSingleProperty.id}/property/media`}
                    className="w-perc-100 brdRadius bgWhite shadow-2dp shadowHover-4dp pt-2 cur-poi txtDark700"
                  >
                    <div className="h-fix-184 dis-fl-col jc-b">
                      <div className="dis-f px-3">
                        <BrixelIcon
                          icon="folder-open"
                          color="AltBlue"
                          saturationTxt={400}
                        />
                        <span className="txtDark700 fweight-600 pl-1">Media</span>
                      </div>
                      <div className="px-3 pb-2">
                        <div>
                          <div className="dis-f jc-b a-c">
                            <span>Photos</span>
                            <BrixelIcon
                              icon="check-small-fill"
                              color={get(activeSingleProperty, 'photos', []).length > 5 ? 'altMist' : 'light'}
                              saturationTxt={get(activeSingleProperty, 'virtual.matterport', []).length > 1 ? 400 : 300}
                            />
                          </div>
                          <div className="dis-f jc-b a-c">
                            <span>Plans</span>
                            <BrixelIcon
                              icon="check-small-fill"
                              color={get(activeSingleProperty, 'floorPlans', []).length > 1 ? 'altMist' : 'light'}
                              saturationTxt={get(activeSingleProperty, 'virtual.matterport', []).length > 1 ? 400 : 300}
                            />
                          </div>
                          <div className="dis-f jc-b a-c">
                            <span>3d tour</span>
                            <BrixelIcon
                              icon="check-small-fill"
                              color={get(activeSingleProperty, 'virtual.matterport', []).length > 1 ? 'altMist' : 'light'}
                              saturationTxt={get(activeSingleProperty, 'virtual.matterport', []).length > 1 ? 400 : 300}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="linkWrap">
                        <span className="hr lighter" />
                        <div className="txtHoverDark200 txtLight700 px-3 py-1 wHover">
                          <span className="text"> View</span> <span className="arrow-symbol">&#62; </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div
                  className="pos-r w-perc-100 ov-h w-perc-sm-65 mt-3 mt-sm-0 brdRadius shadow-2dp dis-fl-col jc-b pt-2 cur-poi shadowHover-4dp bgAltMist200 px-2"
                  onClick={() => openBrixelPage()}
                >
                  <div className="dis-f h-perc-100">
                    <div className="dis-fl-col">
                      <span className="fsize-400 txtAltMist400">Brixel Page</span>

                      <span className="fsize-600 fweight-600 txtAltBlue400 mb-2 mt-1">
                        Preview your property website
                      </span>
                    </div>
                    <div
                      className=" w-perc-100 h-perc-100 image-ratio zIndex1 pos-r min-w-fix-280 brdRadiusTop ov-h"
                    >
                      <div className="pos-a-fix x-l-0 x-t-0 w-perc-100 h-fix-16 bgDark400 zIndex1" />
                      <CoverPropertyImage
                        className="cover w-perc-100 h-perc-100"
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
          progressState.step === 3 && (
            <>
              <div className="dis-f jc-b">
                <div className="w-perc-70 mr-sm-1">
                  <DashboardPropertyCard smallLayout />
                </div>
                <Link
                  to={`/${activeSingleProperty.id}/marketing`}
                  className="w-perc-30 brdRadius bgWhite shadow-2dp shadowHover-4dp ml-sm-1 pt-2 cur-poi txtDark700"
                >
                  <div className="h-fix-184 dis-fl-col jc-b">
                    <div className="dis-f px-3">
                      <BrixelIcon
                        icon="mike"
                        color="AltBlue"
                        saturationTxt={400}
                      />
                      <span className="txtDark700 fweight-600 pl-1">Marketing</span>
                    </div>
                    <div className="px-3">
                      {
                        Object.keys(get(activeSingleCompany, 'availablePortals', {})).map((portal, i) => (
                          <React.Fragment key={i.toString()}>
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

              <div className="dis-fl-col dis-fl-row-sm my-3">
                <div className="w-perc-100 w-perc-sm-33 mr-sm-1 bgWhite brdRadius ta-c p-3 pb-6 shadow-2dp mr-sm-1">
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="interested"
                    color="altRed"
                    saturationTxt={400}
                  />
                  <h6 className="mt-2 fweight-400">Interested</h6>
                  <p className="fSizePx64 fweight-600 txtAltRed700 mt-3">
                    {get(activeSinglePropertyDealsCount, 'Interested.total', '')}
                  </p>
                </div>
                <div className="w-perc-100 w-perc-sm-33 mr-sm-1 bgWhite brdRadius ta-c p-3 pb-6 shadow-2dp mx-sm-1">
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="visited"
                    color="altMist"
                    saturationTxt={400}
                  />
                  <h6 className="mt-2 fweight-400">Visited</h6>
                  <p className="fSizePx64 fweight-600 txtAltBlue400 mt-3">
                    {get(activeSinglePropertyDealsCount, 'Visit.total', '')}
                  </p>
                </div>
                <div className="w-perc-100 w-perc-sm-33 mr-sm-1 bgWhite brdRadius ta-c p-3 pb-6 shadow-2dp ml-sm-1">
                  <BrixelIcon
                    iconWidth="w-fix-48"
                    icon="offers"
                    color="altGreen"
                    saturationTxt={300}
                  />
                  <h6 className="mt-2 fweight-400">Offers</h6>
                  <p className="fSizePx64 fweight-600 txtAltGreen400 mt-3">
                    {get(activeSinglePropertyDealsCount, 'Offer.total', '')}
                  </p>
                </div>
              </div>

              <div>
                <ul>
                  {
                    visitLists.map((visit, i) => (
                      <li key={i.toString()}>
                        <BrixelAvatar
                          baseURL={get(baseByData, 'shortPath', '')}
                          profileId={get(visit, 'user.id', null)}
                          name={get(visit, 'user.name', '') ? get(visit, 'user.name', '') : 'No Name'}
                          size="large"
                        />
                        <p>{get(visit, 'user.name', '')}</p>
                        {JSON.stringify(visit)}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </>
          )
        }

        {
          progressState.step <= 2 && (
            <BoxTrialTestDirve
              className="shadow-2dp"
            />
          )
        }

      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  activeSinglePropertyDeals: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDealsCount: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSinglePropertyDealsCount: PropTypes.func.isRequired,
  handleGetPageDeals: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  proEstimation: PropTypes.object,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

DashboardHome.defaultProps = {
  proEstimation: {},
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', null),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  proEstimation: get(state, 'brixelForm.Property.values.proEstimation', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyDealsCount: bindActionCreators(getActiveSinglePropertyDealsCount, dispatch),
  handleGetPageDeals: bindActionCreators(getPageDeals, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
