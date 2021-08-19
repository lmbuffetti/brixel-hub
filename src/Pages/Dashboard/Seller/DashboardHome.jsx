/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import get from 'lodash/get';
// import cloneDeep from 'lodash/cloneDeep';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
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
import testDrive from '../../../images/dashboard/testDrive.png';

import Loading from '../../../components/Loading';
import { setModal, spinnerOff } from '../../../actions/CommonActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';

const { factsOptions } = FactsOptions;

const DashboardHome = (props) => {
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    estimation,
    formValue,
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

  const { documents } = formValue;

  useEffect(() => {
    if (has(formValue, 'location.countryCode')) {
      setMandatoryDocuments(documentConfig.mandatoryDocuments[get(formValue, 'location.countryCode')][get(formValue, 'properties.propertyType')]);
    }
  }, [formValue]);

  useEffect(() => {
    if (activeSingleProperty.id) {
      const defState = factsOptions.progressBarOptions.find((item) => item.value === activeSingleProperty.progress.state);
      const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === activeSingleProperty.progress.state);
      if (defState.label === 'Sales Lead') defState.label = 'Onboarding';
      setProgressState({
        ...defState,
        id: defIndexState,
      });
    }
  }, [activeSingleProperty.id]);

  const countMandatoryDocuments = () => {
    let count = 0;
    if (documents) {
      documents.forEach((doc) => {
        mandatoryDocuments.forEach((el) => {
          if (el === doc.type) count += 1;
        });
      });
    }
    return count;
  };

  const bookNow = () => {
    if (activeSingleProperty.id) {
      localStorage.setItem('backUrl', `/${activeSingleProperty.id}/home`);
      history.push(`/${activeSingleProperty.id}/trialRequest`);
    }
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
        <div className="shadow-2dp imgSection bgWhite brdRadius dis-fl-col dis-fl-row-sm pt-sm-3 pb-sm-3 pl-sm-4 pt-0 ov-h pb-3 mb-3">
          <div className="w-perc-100 w-fix-sm-232 h-fix-152 pos-r">
            <CoverPropertyImage
              className="cover w-perc-100 h-perc-100"
              coverPhoto={get(activeSingleProperty, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(activeSingleProperty, 'properties.propertyType', undefined)}
            />
            <Link
              to={`/${activeSingleProperty.id}/property/photos`}
              className="pos-a-fix x-r-1 x-b-1 brdRadiusLrg px-2 bgWhite p-small-10 txtDark700 opacity-08"
            >
              Edit
            </Link>
          </div>
          <div className="px-3 pl-sm-4 pt-2 pt-sm-1 dis-fl-col jc-b">
            <div className="d">
              <h4 className="txtAltColor100 fweight-600"> {get(activeSingleProperty, 'title', '')} </h4>
              <span className="fsize-300 txtLight600"> {get(activeSingleProperty.location, 'city', '')}, {get(activeSingleProperty.location, 'state', '')}  </span>

            </div>
            {
              get(activeSingleProperty, 'price.total', 0) > 0 ? (
                <div className="dis-fl-col">
                  <div className="dis-f a-c">
                    <BrixelIcon
                      background="AltColor"
                      saturation={1000}
                      color="AltColor"
                      saturationTxt={700}
                      padding="p-small-12"
                      icon="price"
                      rounded
                      iconSize="large"
                    />
                    <div className="ml-2 dis-fl-col">
                      <span className="txtLight600 fsize-300"> Your Price</span>
                      <Link to={`/${activeSingleProperty.id}/property/price`} className="txtAltColor700 fweight-600">
                        <span>{get(activeSingleProperty, 'price.currency', 0)}</span>
                        <span className="ml-1">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 0))}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="dis-f pt-2 a-t">
                  <BrixelIcon
                    background="AltColor"
                    saturation={1000}
                    color="AltColor"
                    saturationTxt={700}
                    padding="p-small-12"
                    icon="chart"
                    rounded
                    iconSize="large"
                  />
                  <div className="dis-fl-col pl-2 mr-1">
                    <span className="txtLight600 fsize-300">Your Bestimate</span>
                    {
                      !get(estimation, 'status', null) && (
                        <Link to={`/${activeSingleProperty.id}/singleFlow/achievement/bestimate/step1`} className="txtAltColor700 fweight-600">
                          Get Estimation
                        </Link>
                      )
                    }
                    {
                      get(estimation, 'status', '') === 'pending' && (
                        <span className="txtAltColor700 fweight-600">
                          Pending
                        </span>
                      )
                    }
                    {
                      get(estimation, 'status', '') === 'processed' && (
                        <Link to={`/${activeSingleProperty.id}/property/price`} className="txtAltColor700 no-state fweight-600">
                          {get(estimation, 'result.currency', '')} {Helpers.formatNumberValue(get(estimation, 'result.higherValue', ''), get(estimation, 'currency', ''))}
                        </Link>
                      )
                    }
                  </div>
                  <div className="tagBg dis-fl-row-sm hide a-c">
                    <span className="activeDot" />
                    <Link to={`/${activeSingleProperty.id}/property/price`} className="px-2 no-state txtAltColor700"> Set your price </Link>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="dis-fl-col dis-fl-row-sm">
          <div
            onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
            className="shadow-2dp bgAltColor1000 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi"
          >
            {
              get(proEstimation, 'value', null) ? (
                <div className="dis-fl-col max-w-perc-100">
                  <span className="fsize-400 txtAltColor900">Pro estimation</span>
                  {
                    get(proEstimation, 'value', 0) > 0 && (
                      <>
                        <div className="dis-f a-c w-perc-100 mt-1 fsize-600 fweight-600 txtAltColor700">
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
                          className="mt-2"
                          theme="AltColor"
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
                    <span className="fsize-400 txtAltColor900">Pro estimation</span>

                    <span className="fsize-600 fweight-600 txtAltColor700">
                      <span>{calcPercentageProEstimation().realPerc}%</span>
                      <span className="ml-small-4"> Complete</span>
                    </span>
                    {
                      calcPercentageProEstimation().realPerc < 100 ? (
                        <BrixelButtonPrimary
                          onClick={() => window.location.assign(`/${activeSingleProperty.id}/property/price/formFlow`)}
                          label="Next step"
                          theme="AltColor"
                          themeSat={700}
                          className="mt-2 as-fs"
                          rounded
                        />
                      ) : (
                        <BrixelButtonSecondary
                          bgTransparent
                          onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
                          className="mt-2"
                          theme="AltColor"
                          themeSat={700}
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
                        color: 'altColor',
                        sat: 2000,
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
            className="shadow-2dp bgAltColor300 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 ml-sm-1 w-perc-100  w-perc-sm-50 cur-poi"
            onClick={() => history.push(`/${activeSingleProperty.id}/docubox`)}
          >
            <div className="dis-fl-col">
              <span className="fsize-400 txtAltColor200">Docubox</span>
              <span className="fsize-600 fweight-600 txtAltColor2000">
                <span>{countMandatoryDocuments()}</span>
                <span className="mx-small-4">of</span>
                <span>{mandatoryDocuments.length}</span>
                <span className="ml-small-1">uploaded</span>
              </span>
              <BrixelButtonPrimary
                onClick={() => history.push(`/${activeSingleProperty.id}/docubox`)}
                label="Upload"
                theme="AltColor"
                themeSat={2000}
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
              to={`/${activeSingleProperty.id}/facts`}
              className="w-perc-50 brdRadius bgWhite shadow-2dp shadowHover-4dp mr-1 pt-2 cur-poi"
            >
              <div className="h-fix-184 dis-fl-col jc-b">
                <div className="dis-f px-3">
                  <BrixelIcon
                    icon="property-new"
                    color="AltColor"
                    saturationTxt={700}
                  />
                  <span className="txtDark700 fweight-600 pl-1"> Facts </span>
                </div>
                <div className="px-3 pb-2">
                  <BrixelProgressBar
                    progressValue={calcPercentageFacts().realPerc}
                    saturation={200}
                    color="AltColor"
                  />
                  <span className="txtDark700 pt-small-4 fsize-300 fsize-sm-400 pt-small-4">
                    <span>{calcPercentageFacts().realPerc}%</span>
                    <span className="ml-small-4">complete</span>
                  </span>
                </div>
                <div className="linkWrap">
                  <hr className="lighter" />
                  <Link to={`/${activeSingleProperty.id}/property/facts`} className="cur-poi wHover no-state txtHoverDark200 txtLight700 px-3 py-1">
                    <span className="text"> View</span> <span className="arrow-symbol">&#62; </span>
                  </Link>
                </div>
              </div>
            </Link>
            <Link
              to={`/${activeSingleProperty.id}/marketing`}
              className="w-perc-50 brdRadius bgWhite shadow-2dp shadowHover-4dp ml-1 pt-2 cur-poi"
            >
              <div className="h-fix-184 dis-fl-col jc-b">
                <div className="dis-f px-3">
                  <BrixelIcon
                    icon="mike"
                    color="AltColor"
                    saturationTxt={700}
                  />
                  <span className="txtDark700 fweight-600 pl-1"> Marketing </span>
                </div>
                <div className="px-3">
                  {
                    Object.keys(get(activeSingleProperty, 'portals', {})).map((portal, i) => (
                      <React.Fragment key={i.toString()}>
                        {
                          !portal.includes('Url') && i < 2 && (
                            <span className="txtDark700 fsize-300 fsize-sm-400 dis-f jc-b a-c w-perc-100 tt-c">
                              <span>{portal}</span> <span className={`activeDot ${activeSingleProperty.portals[portal] ? 'green' : 'grey'}`} />
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
                  <hr className="lighter" />
                  <div className="px-3 py-1 txtLight700">
                    <span className="text"> View</span>
                    <span className="arrow-symbol ml-1">&#62; </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div
            className="demoBg pos-r w-perc-100 ov-h w-perc-sm-35 mt-3 mt-sm-0 brdRadius shadow-2dp dis-fl-col jc-b pt-2 cur-poi shadowHover-4dp"
            style={{
              backgroundImage: `url("${baseByData.shortPath}${get(activeSingleProperty, 'coverPhoto.thumbnailPath', '')}")`,
            }}
            onClick={() => openBrixelPage()}
          >
            <div className="px-3 pb-5">
              <span className="txtWhite dis-b max-w-fix-184 fweight-600 fsize-500 fsize-sm-500">
                {
                  progressState > 0 ? (
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
            <div className="linkWrap">
              <hr className="white" />
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
        <div className="testDrive dis-f-md a-c brdRadius bgWhite shadow-2dp p-2">
          <img
            className={windowDimensions.width <= 590 ? 'dis-b mx-a' : ''}
            width={windowDimensions.width <= 590 ? 300 : 300}
            src={testDrive}
            alt=""
          />
          <div className="div ta-c ta-l-md">
            <h3 className="txtDark700 fweight-600 fsize-500">Test drive our service. <br /> No strings attached.</h3>
            <p className="txtDark700">
              <span>Get the full Brixel experience worth</span>
              <span className="ml-small-4">{get(activeSingleCompany, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(activeSingleCompany, 'meta.teaserPackage.price', ''), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))}</span>
            </p>
            <div className="dis-f jc-c jc-fs-md">
              <BrixelButtonPrimary
                onClick={() => bookNow()}
                rounded
                theme="AltColor"
                themeSat={400}
                label="Book Now"
                className="mt-3"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  proEstimation: PropTypes.object.isRequired,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

DashboardHome.defaultProps = {
/*   gameGroup: [],
  gameHistory: {}, */
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', null),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  proEstimation: get(state, 'brixelForm.Property.values.proEstimation', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
