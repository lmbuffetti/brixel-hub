/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import * as Helpers from '@brixel/brixel-components/dist/utils/helper';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
const BrixelButtonPrimary = React.lazy(() => import('@brixel/brixel-components/dist/components/BrixelButtonPrimary'));
const BrixelIcon = React.lazy(() => import('@brixel/brixel-components/dist/components/BrixelIcon'));
const CoverPropertyImage = React.lazy(() => import('../CoverPropertyImage'));

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
    smallLayout,
  } = props;

  return (
    <>
      <div className={`shadow-2dp imgSection bgWhite brdRadius dis-fl-col dis-fl-row-sm ${smallLayout ? 'p-sm-3' : 'pl-sm-4 pt-sm-3 pb-sm-3 pt-0 pb-3 mb-3'} ov-h`}>
        <div>
          <div
            onClick={() => history.push(`/${activeSingleProperty.id}/property`)}
            className={`dis-b w-perc-100 ${smallLayout ? 'w-fix-sm-152' : 'w-fix-sm-232'} h-fix-152 pos-r`}
          >
            <CoverPropertyImage
              className="cover w-perc-100 h-perc-100 negTop"
              coverPhoto={get(formValue, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(formValue, 'properties.propertyType', undefined)}
            />
            <Link
              to={`/${activeSingleProperty.id}/property/photos`}
              className="pos-a-fix x-r-1 x-b-1 brdRadiusLrg px-2 bgWhite p-small-10 txtDark700 opacity-08"
            >
              Edit
            </Link>
          </div>
        </div>
        <div className="pl-3 pt-2 pt-sm-1 dis-fl-col jc-b w-perc-100">
          <div className="">
            <h4 className="txtDark700 fweight-600 fsize-sm-600 fsize-500"> {get(activeSingleProperty, 'title', '')} </h4>
            <span className="fsize-300 txtLight600"> {get(activeSingleProperty.location, 'city', '')}, {get(activeSingleProperty.location, 'state', '')}  </span>

          </div>
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
                      <span className="txtLight600 fsize-300">Your Price</span>
                      <Link to={`/${activeSingleProperty.id}/property/price`} className="txtBlue700 fweight-600">
                        <span>{get(activeSingleProperty, 'price.currency', 0)}</span>
                        <span className="ml-1">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 0))}</span>
                      </Link>
                    </div>
                  </div>
                  <BrixelButtonPrimary
                    className="mt-2 mt-sm-0 mr-a mr-sm-0 mb-3 mb-sm-0"
                    rounded
                    label="Open"
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
                            <span className="txtLight600 fsize-300"> Your Price</span>
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
                                <span className="txtLight600 fsize-300">Pro estimation</span>
                                <Link to={`/${activeSingleProperty.id}/property/price`} className="txtBlue700 no-state fweight-600">
                                  {get(activeSingleProperty, 'proEstimation.currency', 0)} {Helpers.formatNumberValue(get(activeSingleProperty, 'proEstimation.value', 0), get(activeSingleProperty, 'proEstimation.currency', 0))}
                                </Link>
                              </div>
                              <div className="tagBg dis-fl-row-sm hide a-c">
                                <span className="activeDot" />
                                <Link to={`/${activeSingleProperty.id}/property/price`} className="px-2 no-state txtBlue700"> Set your price </Link>
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
                                <span className="txtLight600 fsize-300">Your Bestimate</span>
                                {
                                  !get(estimation, 'status', null) && (
                                    <Link to={`/${activeSingleProperty.id}/singleFlow/achievement/bestimate/step1`} className="txtBlue700 fweight-600">
                                      Get Estimation
                                    </Link>
                                  )
                                }
                                {
                                  get(estimation, 'status', '') === 'pending' && (
                                    <span className="txtBlue700 fweight-600">
                                      Pending
                                    </span>
                                  )
                                }
                                {
                                  get(estimation, 'status', '') === 'processed' && (
                                    <Link to={`/${activeSingleProperty.id}/property/price`} className="txtBlue700 no-state fweight-600">
                                      {get(estimation, 'result.currency', '')} {Helpers.formatNumberValue(get(estimation, 'result.higherValue', ''), get(estimation, 'currency', ''))}
                                    </Link>
                                  )
                                }
                              </div>
                              <div className="tagBg dis-fl-row-sm hide a-c">
                                <span className="activeDot" />
                                <Link to={`/${activeSingleProperty.id}/property/price`} className="px-2 no-state txtBlue700"> Set your price </Link>
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

        </div>
      </div>
    </>
  );
};

DashboardPropertyCard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  smallLayout: PropTypes.bool,
};

DashboardPropertyCard.defaultProps = {
  smallLayout: false,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(DashboardPropertyCard);
