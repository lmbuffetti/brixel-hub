import React from 'react';
import {BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon, FormatValue, Helpers} from '@brixel-io/brixel-components';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setModal, setSplashType} from '../../actions/CommonActions';
import {completedBestimate, convertLabel} from '../../utils/helpers';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import type {DashboardPropertyCardProps} from '../../@types/components/Cards/DashboardPropertyCard';
import BestimateCardOverlay from '../BestimateCardOverlay';

const DashboardPropertyCard: (props: DashboardPropertyCardProps) => JSX.Element = (props: DashboardPropertyCardProps) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    estimation,
    handleSetModal,
    lang,
    smallLayout = false,
    type = 'own',
  } = props;

  const isEstimation = !get(estimation, 'status', null) || !completedBestimate(activeSingleProperty) && get(estimation, 'status', null) === 'processed';

  const energyCertificate = activeSingleProperty?.properties?.energy?.totalEnergyEfficiency;


  return (
    <div className={smallLayout ? '' : 'mb-3'}>
      <div
        className={'shadow-2dp imgSection bgWhite brdRadius ov-h'}>
        <div className={`dis-fl-col dis-fl-row-sm ${smallLayout ? 'p-sm-3' : 'p-sm-3 pt-0 pb-2'}`}>
          <div className="pr-sm-3 pr-0 pr-sm-2 max-w-perc-sm-50">
            <div
              onClick={() => history.push(`/${get(activeSingleProperty, 'id', '')}/property/facts`)}
              className={`dis-b w-perc-100 ${smallLayout ? 'min-w-fix-sm-208' : 'w-fix-sm-232'} h-fix-160 pos-r`}
            >
              <CoverPropertyImage
                className="cover w-perc-100 h-perc-100 negTop brdRadius"
                coverPhoto={get(activeSingleProperty, 'coverPhoto.url', undefined)}
                propertyType={get(activeSingleProperty, 'properties.propertyType', undefined)}
                size="M"
              />
              {
                type !== 'sold' && type !== 'buy' && (
                  <Link
                    to={`/${get(activeSingleProperty, 'id', '')}/property/photos`}
                    className="pos-a-fix x-r-1 x-b-1 brdRadiusLrg px-2 bgWhite p-small-10 txtText900 opacity-08"
                  >
                    {translateTo('Edit', lang)}
                  </Link>
                )
              }
            </div>
          </div>
          <div className="px-sm-0 px-2 pt-2 pt-sm-0 dis-fl-col jc-b flex-1">
            <div className="">
              <h4
                className={`txtText900 fweight-600 fsize-sm-600 fsize-500 ${!activeSingleProperty?.title && 'skeletonh4'}`}>
                {get(activeSingleProperty, 'title', '')}
              </h4>
              <span
                className={`fsize-300 txtText400 ${!activeSingleProperty?.location?.state && 'skeletonSmall dis-b mt-1'}`}>
                {get(activeSingleProperty, 'location.city', '')}, {get(activeSingleProperty, 'location.state', '')}
              </span>

            </div>
            {
              !get(activeSingleProperty, 'status', null) ? (
                <div>
                  <div className="skeletonh4" />
                  <div className="skeletonh4 mt-1" />
                </div>
              ) : (
                <>
                  {
                    (type === 'sold' || type === 'buy') ? (
                      <div className="w-perc-100">
                        <div className="fweight-600 txtBlue700 fsize-500 mb-2">
                          {
                            type !== 'sold' && get(activeSingleProperty, 'status', null) === 'on-sale' ? (
                              <>
                                <span>{get(activeSingleProperty, 'price.currency', 'CHF')}</span>
                                <span className="ml-1">
                                  {Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 'EUR'))}
                                </span>
                              </>
                            ) : (
                              <span>
                                {translateTo(convertLabel(get(activeSingleProperty, 'status', 'on-request'), 'propertyStatus'), lang)}
                              </span>
                            )
                          }
                        </div>
                        {
                          type === 'buy' ? (
                            <div className="dis-fl-col dis-fl-row-sm">
                              <div className="dis-f flex-1 jc-b jc-fs-sm">
                                <div className="brdSmallRight brdText100 pr-2">
                                  <h6 className="ff-mono txtText400 fsize-300">
                                    {translateTo('Living area', lang)}
                                  </h6>
                                  <p className="fsize-500 fSizePx20">
                                    {get(activeSingleProperty, 'properties.typology.livingArea.value', 0)}m2
                                  </p>
                                </div>
                                <div className="ml-2 brdSmallRight brdText100 pr-2">
                                  <h6 className="ff-mono txtText400 fsize-300">
                                    {translateTo('Rooms', lang)}
                                  </h6>
                                  <p className="fsize-500 fSizePx20">
                                    {FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))
                                    }
                                  </p>
                                </div>
                                <div className="ml-2 brdSmallRight-sm brdText100 pr-2 mr-1">
                                  <h6 className="ff-mono txtText400 fsize-300">
                                    {translateTo('Year built', lang)}
                                  </h6>
                                  <p className="fsize-500 fSizePx20">
                                    {get(activeSingleProperty, 'properties.building.built', 0)}
                                  </p>
                                </div>
                              </div>

                              <BrixelButtonSecondary
                                className="as-fs mt-2 ml-sm-2 mt-a-sm mb-a w-auto-sm w-perc-100"
                                rounded
                                label={translateTo('View', lang)}
                                onClick={() => window.open(`${baseByData?.pageUrl}${get(activeSingleProperty, 'stub', '')}`, '_blank')}
                              />

                            </div>
                          ) : (
                            <div className="dis-f a-c">
                              {
                                get(activeSingleProperty, 'virtual', null) && (
                                  <div className="bgBlue200 tourLink">
                                    <button
                                      onClick={() => history.push(`/${get(activeSingleProperty, 'id', '')}/property/tour`)}
                                      className="dis-f a-c"
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
                                get(activeSingleProperty, 'photos', null) && get(activeSingleProperty, 'photos', []).length > 0 && (
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
                                get(activeSingleProperty, 'floorPlans', null) && get(activeSingleProperty, 'floorPlans', []).length > 0 && (
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
                            <div className="dis-fl-col dis-fl-row-sm flex-wrap jc-b a-sm-c w-perc-100">
                              <div className="dis-f a-c mr-a mr-sm-0 my-1">
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
                                  <span className="txtText400 fsize-300">
                                    {translateTo('Your Price', lang)}
                                  </span>
                                  <Link to={`/${get(activeSingleProperty, 'id', '')}/property/price`}
                                    className="txtBlue700 fweight-600">
                                    <span>{get(activeSingleProperty, 'price.currency', 0)}</span>
                                    <span
                                      className="ml-1">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 'EUR'))}</span>
                                  </Link>
                                </div>
                              </div>
                              <BrixelButtonPrimary
                                className="mt-2 mt-sm-0 mr-a mr-sm-0 mb-3 mb-sm-0 as-c"
                                rounded
                                label={translateTo('Open', lang)}
                                onClick={() => window.open(`${baseByData?.pageUrl}${get(activeSingleProperty, 'stub', '')}`, '_blank')}
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
                                        <span className="txtText400 fsize-300">
                                          {translateTo('Your Price', lang)}
                                        </span>
                                        <Link to={`/${get(activeSingleProperty, 'id', '')}/property/price`}
                                          className="txtBlue700 fweight-600">
                                          <span>{get(activeSingleProperty, 'price.currency', 0)}</span>
                                          <span
                                            className="ml-1">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 'EUR'))}</span>
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
                                            <span className="txtText400 fsize-300">
                                              {translateTo('Pro estimation', lang)}
                                            </span>
                                            <Link to={`/${get(activeSingleProperty, 'id', '')}/property/price`}
                                              className="txtBlue700 no-state fweight-600">
                                              {get(activeSingleProperty, 'proEstimation.currency', 0)} {Helpers.formatNumberValue(get(activeSingleProperty, 'proEstimation.value', 0), get(activeSingleProperty, 'proEstimation.currency', 'EUR'))}
                                            </Link>
                                          </div>
                                          <div className="tagBg dis-fl-row-sm hide a-c">
                                            <span className="activeDot" />
                                            <Link to={`/${get(activeSingleProperty, 'id', '')}/property/price`}
                                              className="px-2 no-state txtBlue700">
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
                                            <span className="txtText400 fsize-300">
                                              {translateTo('Your Bestimate', lang)}
                                            </span>
                                            {
                                              isEstimation && (
                                                <Link
                                                  to={`/${get(activeSingleProperty, 'id', '')}/singleFlow/achievement/bestimate/step1`}
                                                  className="txtBlue700 fweight-600">
                                                  {translateTo('Get Estimation', lang)}
                                                </Link>
                                              )
                                            }
                                            {
                                              get(estimation, 'status', null) === 'pending' && completedBestimate(activeSingleProperty) && (
                                                <span className="txtBlue700 fweight-600">
                                                  {translateTo('Pending', lang)}
                                                </span>
                                              )
                                            }
                                            {
                                              !isEstimation && get(estimation, 'status', null) === 'processed' && (
                                                <button
                                                  onClick={() => handleSetModal({
                                                    state: true,
                                                    small: true,
                                                    component: <BestimateCardOverlay lang={lang} />,
                                                    layout: 'xlarge',
                                                  })}
                                                  className="txtBlue700 no-state fweight-600 fsize-400 ml-1-neg"
                                                >
                                                  {get(estimation, 'result.currency', '')} {Helpers.formatNumberValue(get(estimation, 'result.higherValue', 0), get(estimation, 'result.currency', ''))}
                                                </button>
                                              )
                                            }
                                          </div>
                                          <div className="tagBg dis-fl-row-sm hide a-c">
                                            <span className="activeDot" />
                                            <Link to={`/${get(activeSingleProperty, 'id', '')}/property/price`}
                                              className="px-2 no-state txtBlue700">
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
                </>
              )
            }
          </div>
        </div>
      </div>
      {
        activeSingleCompany?.stub === 'ubs' && (
          <div className="bgWhite brdRadius mt-sm-1-neg mt-2">
            <hr className="hide dis-b-md" />
            <div className={`dis-f-md a-c jc-b ${smallLayout ? 'p-sm-3' : 'p-sm-3 pt-0 pb-2'}`}>
              <div
                className={`m-2 m-md-0 singleEnergyValue active ${energyCertificate} w-fix-72`}
              >
                <span className="labelValue">{energyCertificate || '?'}</span>
              </div>
              <div className="ml-2">
                {
                  energyCertificate && (
                    <h6 className="fweight-600">
                      <span>{translateTo('This property has an indicative energy class', lang)}</span>
                      <span className="ml-small-4">{energyCertificate.toUpperCase()}.</span>
                    </h6>
                  )
                }
                <p>
                  {translateTo('Order the energy performance certificate with renovation schedule from Norm and benefit from attractive conditions.', lang)}
                </p>
              </div>
              <div className="p-2 p-sm-0 ml-0 ml-sm-2">
                <BrixelButtonPrimary
                  className="ws-nw flex-none w-perc-100"
                  rounded
                  rightIcon="arrow-right"
                  label={translateTo('Get informed', lang)}
                  onClick={() => history.push(`/buyer/${activeSingleProperty.id}/energy`)}
                />
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  estimation: get(state, 'property.estimation', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardPropertyCard);
