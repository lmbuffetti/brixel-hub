/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  FormatValue,
  Helpers,
} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { setModal, setSplashType } from '../../actions/CommonActions';
import { completedBestimate } from '../../utils/helpers';
import CoverPropertyImage from '../CoverPropertyImage';

const DashboardPropertyCard = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleProperty,
    estimation,
    formValue,
    handleSetModal,
    lang,
    smallLayout,
    type,
  } = props;

  return (
    <>
      <div className={`shadow-2dp imgSection bgWhite brdRadius dis-fl-col dis-fl-row-sm ${smallLayout ? 'p-sm-3' : 'p-sm-3 pt-0 pb-2 mb-3'} ov-h`}>
        <div>
          <div
            onClick={() => history.push(`/${activeSingleProperty.id}/property/facts`)}
            className={`dis-b w-perc-100 ${smallLayout ? 'w-fix-sm-160' : 'w-fix-sm-232'} h-fix-160 pos-r`}
          >
            <CoverPropertyImage
              className="cover w-perc-100 h-perc-100 negTop"
              coverPhoto={get(formValue, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(formValue, 'properties.propertyType', undefined)}
            />
            {
              type !== 'sold' && type !== 'buy' && (
                <Link
                  to={`/${activeSingleProperty.id}/property/photos`}
                  className="pos-a-fix x-r-1 x-b-1 brdRadiusLrg px-2 bgWhite p-small-10 txtDark700 opacity-08"
                >
                  {translateTo('Edit', lang)}
                </Link>
              )
            }
          </div>
        </div>
        <div className="pl-sm-3 pl-2 pt-2 pt-sm-1 dis-fl-col jc-b w-perc-100">
          <div className="">
            <h4 className="txtDark700 fweight-600 fsize-sm-600 fsize-500"> {get(activeSingleProperty, 'title', '')} </h4>
            <span className="fsize-300 txtLight600"> {get(activeSingleProperty.location, 'city', '')}, {get(activeSingleProperty.location, 'state', '')}  </span>

          </div>
          {
            (type === 'sold' || type === 'buy') ? (
              <div className="w-perc-100">
                <div className="fweight-600 txtBlue700 fsize-500 mb-2">
                  <span>{get(activeSingleProperty, 'price.currency', 'CHF')}</span>
                  <span className="ml-1">
                    {Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 0))}
                  </span>
                </div>
                {
                  type === 'buy' ? (
                    <div className="dis-fl-col dis-fl-row-sm a-c">
                      <div className="dis-f w-perc-100 jc-b">
                        <div className="brdSmallRight brdAltGrey200 pr-2">
                          <h6 className="ff-mono txtAltGrey400 fsize-300">
                            {translateTo('Living area', lang)}
                          </h6>
                          <p className="fsize-500 fSizePx20">
                            {get(activeSingleProperty, 'properties.typology.livingArea.value', 0)}m2
                          </p>
                        </div>
                        <div className="ml-2 brdSmallRight brdAltGrey200 pr-2">
                          <h6 className="ff-mono txtAltGrey400 fsize-300">
                            {translateTo('Rooms', lang)}
                          </h6>
                          <p className="fsize-500 fSizePx20">
                            {FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))
                            }
                          </p>
                        </div>
                        <div className="ml-2 brdSmallRight-sm brdAltGrey200 pr-2 mr-1">
                          <h6 className="ff-mono txtAltGrey400 fsize-300">
                            {translateTo('Year built', lang)}
                          </h6>
                          <p className="fsize-500 fSizePx20">
                            {get(activeSingleProperty, 'properties.building.built', 0)}
                          </p>
                        </div>
                      </div>

                      <BrixelButtonSecondary
                        className="as-fs mt-2 mt-a-sm mb-a w-auto-sm w-perc-100"
                        rounded
                        label={translateTo('View', lang)}
                        onClick={() => window.open(`${baseByData.pageUrl}${activeSingleProperty.stub}`, '_blank')}
                      />

                    </div>
                  ) : (
                    <div className="dis-f a-c">
                      {
                        get(activeSingleProperty, 'virtual', null) && (
                          <div className="bgBlue300 tourLink">
                            <button
                              onClick={() => history.push(`/${get(activeSingleProperty, 'id', '')}/property/tour`)}
                              className="dis-f a-c" rel="noreferrer"
                            >
                              <BrixelIcon
                                color="Blue"
                                rounded
                                saturationTxt={700}
                                background="Blue"
                                saturation={100}
                                icon="tour"
                                padding="p-small-8"
                              />
                              <span className="pl-1 pr-2 txtBlue700 fsize-300">
                                {translateTo('3D-Tour', lang)}
                              </span>
                            </button>
                          </div>
                        )
                      }
                      {
                        activeSingleProperty.photos && activeSingleProperty.photos.length > 0 && (
                          <div className="ml-1">
                            <BrixelIcon
                              color="red"
                              rounded
                              saturationTxt={700}
                              background="red"
                              saturation={100}
                              icon="photos"
                              padding="p-small-10"
                              onClick={() => history.push(`/${get(activeSingleProperty, 'id', '')}/property/photos`)}
                            />
                          </div>
                        )
                      }
                      {
                        activeSingleProperty.floorPlans && activeSingleProperty.floorPlans.length > 0 && (
                          <div className="ml-1">
                            <BrixelIcon
                              color="green"
                              rounded
                              saturationTxt={700}
                              background="green"
                              saturation={100}
                              icon="plans"
                              padding="p-small-10"
                              onClick={() => history.push(`/${get(activeSingleProperty, 'id', '')}/property/floorPlans`)}
                            />
                          </div>
                        )
                      }
                    </div>
                  )
                }
              </div>
            ) : (
              <>
                {
                  smallLayout ? (
                    <div className="dis-fl-col dis-fl-row-sm jc-b a-c w-perc-100">
                      <div className="dis-f a-c mr-a mr-sm-0">
                        <BrixelIcon
                          background="blue"
                          saturation={100}
                          color="blue"
                          saturationTxt={700}
                          padding="p-small-12"
                          icon="price"
                          rounded
                          iconSize="large"
                        />
                        <div className="ml-2 dis-fl-col">
                          <span className="txtLight600 fsize-300">
                            {translateTo('Your Price', lang)}
                          </span>
                          <Link to={`/${activeSingleProperty.id}/property/price`} className="txtBlue700 fweight-600">
                            <span>{get(activeSingleProperty, 'price.currency', 0)}</span>
                            <span className="ml-1">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 0))}</span>
                          </Link>
                        </div>
                      </div>
                      <BrixelButtonPrimary
                        className="mt-2 mt-sm-0 mr-a mr-sm-0 mb-3 mb-sm-0"
                        rounded
                        label={translateTo('Open', lang)}
                        onClick={() => window.open(`${baseByData.pageUrl}${activeSingleProperty.stub}`, '_blank')}
                      />
                    </div>
                  ) : (
                    <>
                      {
                        get(activeSingleProperty, 'price.total', 0) > 0 ? (
                          <div className="dis-fl-col">
                            <div className="dis-f a-c mt-3 mt-sm-0">
                              <BrixelIcon
                                background="blue"
                                saturation={100}
                                color="blue"
                                saturationTxt={700}
                                padding="p-small-12"
                                icon="price"
                                rounded
                                iconSize="large"
                              />
                              <div className="ml-2 dis-fl-col">
                                <span className="txtLight600 fsize-300">
                                  {translateTo('Your Price', lang)}
                                </span>
                                <Link to={`/${activeSingleProperty.id}/property/price`} className="txtBlue700 fweight-600">
                                  <span>{get(activeSingleProperty, 'price.currency', 0)}</span>
                                  <span className="ml-1">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 0))}</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {
                              get(activeSingleProperty, 'proEstimation.value', 0) > 0 ? (
                                <div className="dis-f pt-3 pt-sm-2 a-t">
                                  <BrixelIcon
                                    background="blue"
                                    saturation={100}
                                    color="blue"
                                    saturationTxt={700}
                                    padding="p-small-12"
                                    icon="chart"
                                    rounded
                                    iconSize="large"
                                  />
                                  <div className="dis-fl-col pl-2 mr-1">
                                    <span className="txtLight600 fsize-300">
                                      {translateTo('Pro estimation', lang)}
                                    </span>
                                    <Link to={`/${activeSingleProperty.id}/property/price`} className="txtBlue700 no-state fweight-600">
                                      {get(activeSingleProperty, 'proEstimation.currency', 0)} {Helpers.formatNumberValue(get(activeSingleProperty, 'proEstimation.value', 0), get(activeSingleProperty, 'proEstimation.currency', 0))}
                                    </Link>
                                  </div>
                                  <div className="tagBg dis-fl-row-sm hide a-c">
                                    <span className="activeDot" />
                                    <Link to={`/${activeSingleProperty.id}/property/price`} className="px-2 no-state txtBlue700">
                                      {translateTo('Set your price', lang)}
                                    </Link>
                                  </div>
                                </div>
                              ) : (
                                <div className="dis-f pt-3 pt-sm-2 a-t">
                                  <BrixelIcon
                                    background="blue"
                                    saturation={100}
                                    color="blue"
                                    saturationTxt={700}
                                    padding="p-small-12"
                                    icon="chart"
                                    rounded
                                    iconSize="large"
                                  />
                                  <div className="dis-fl-col pl-2 mr-1">
                                    <span className="txtLight600 fsize-300">
                                      {translateTo('Your Bestimate', lang)}
                                    </span>
                                    {
                                      !get(estimation, 'status', null) || !completedBestimate(formValue) && !get(estimation, 'status', '') === 'processed' && (
                                        <Link to={`/${activeSingleProperty.id}/singleFlow/achievement/bestimate/step1`} className="txtBlue700 fweight-600">
                                          {translateTo('Get Estimation', lang)}
                                        </Link>
                                      )
                                    }
                                    {
                                      get(estimation, 'status', '') === 'pending' && completedBestimate(formValue) && (
                                        <span className="txtBlue700 fweight-600">
                                          {translateTo('Pending', lang)}
                                        </span>
                                      )
                                    }
                                    {
                                      get(estimation, 'status', '') === 'processed' && (
                                        <button
                                          onClick={() => handleSetModal({
                                            state: true,
                                            type: 'bestimate',
                                          })}
                                          className="txtBlue700 no-state fweight-600 fsize-400 ml-1-neg"
                                        >
                                          {get(estimation, 'result.currency', '')} {Helpers.formatNumberValue(get(estimation, 'result.higherValue', '').toFixed(0), get(estimation, 'result.currency', ''))}
                                        </button>
                                      )
                                    }
                                  </div>
                                  <div className="tagBg dis-fl-row-sm hide a-c">
                                    <span className="activeDot" />
                                    <Link to={`/${activeSingleProperty.id}/property/price`} className="px-2 no-state txtBlue700">
                                      {translateTo('Set your price', lang)}
                                    </Link>
                                  </div>
                                </div>
                              )
                            }
                          </>
                        )
                      }
                    </>
                  )
                }
              </>
            )
          }
        </div>
      </div>
    </>
  );
};

DashboardPropertyCard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  smallLayout: PropTypes.bool,
  type: PropTypes.string,
};

DashboardPropertyCard.defaultProps = {
  smallLayout: false,
  type: 'own',
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardPropertyCard);
