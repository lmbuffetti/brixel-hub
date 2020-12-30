/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Link, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelIcon,
  FactsOptions,
  FormatValue,
  Helpers,
} from '@brixel/brixel-components';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import { saveActiveSingleDeal } from '../../../actions/DealsActions';
import { getUserSearchProfiles } from '../../../actions/SearchProfileActions';
import searchImg from '../../../images/searchProfile/search.svg';
import mapImg from '../../../images/searchProfile/map.svg';

const { factsOptions } = FactsOptions;

const PropertiesBuyerDashboard = (props) => {
  // PROPS
  const {
    handleSaveActiveSingleDeal,
    loggedInUser,
    userBuyerProperties,
    handleGetUserSearchProfiles,
    userSearchProfiles,
  } = props;
  // STATE
  const [activeBuyerProperties, setSctiveBuyerProperties] = useState([]);

  useEffect(() => {
    const properties = userBuyerProperties.filter((item) => item.archivedByBuyer !== true);
    setSctiveBuyerProperties(properties);
  }, [userBuyerProperties]);

  useEffect(() => {
    handleGetUserSearchProfiles(loggedInUser.user.id);
  }, [loggedInUser.user.id]);

  const showPrice = (property) => {
    const currency = get(property, 'price.currency', '');
    return (
      <>
        {
          property.status === 'on-request' && (
            <span>On Request</span>
          )
        }
        {
          property.status === 'sold' && (
            <span>Sold</span>
          )
        }
        {
          property.status === 'reserved' && (
            <span>Reserved</span>
          )
        }
        {
          property.status === 'to-rent' && (
            <div className="dis-f a-b notranslate">
              <span>{currency}&nbsp;</span>
              <span>{Helpers.formatNumberValue(get(property, 'price.rent', 0), currency)}</span>
            </div>
          )
        }
        {
          (!property.status || property.status === 'on-sale') && (
            <div className="dis-f a-b notranslate">
              <span className="fsize-100 pb-small-2">{currency}&nbsp;</span>
              <span>{Helpers.formatNumberValue(get(property, 'price.total', 0), currency)}</span>
            </div>
          )
        }
      </>
    );
  };

  const archOnClick = (e, dealsID, isArchived) => {
    if (e) e.preventDefault();
    const data = {
      id: dealsID,
      userID: loggedInUser.user.id,
      data: {
        archivedByBuyer: !isArchived,
      },
    };
    handleSaveActiveSingleDeal(data);
  };

  const extraFeaturesList = () => {
    const extraFeatures = [];
    const defaultExtraFeatures = get(userSearchProfiles[0], 'characteristics.extraFeatures', {});
    Object.keys(defaultExtraFeatures).forEach((key) => {
      if (key !== 'none' && defaultExtraFeatures[key]) {
        const objExtra = factsOptions.extraFeature.find((val) => val.value === key);
        if (get(objExtra, 'icon', null) && objExtra.value !== 'loggia') {
          extraFeatures.push({
            icon: get(objExtra, 'icon', ''),
            label: get(objExtra, 'label', ''),
            subtitle: null,
          });
        }
      }
    });

    return (
      <div className="dis-f flex-wrap">
        {
          extraFeatures.map((item, i) => (
            <p key={i.toString()} className="mr-1">
              <BrixelIcon
                color="green"
                icon="check"
              />
              <span className="txtDark500">{item.label}</span>
            </p>
          ))
        }
      </div>
    );
  };

  return (
    <>
      <div className="property-container buyer-properties h-perc-md-100 pos-r mt-2" id="propertyDashboard">
        <h5 className="mb-2">
          {
            activeBuyerProperties.length > 0 ? (
              <>
                <span>Properties you are interested in </span>
                <span className="notranslate">({activeBuyerProperties.length})</span>
              </>
            ) : (
              <span>No favorite property found</span>
            )
          }
        </h5>
        <div className="properties listings-wrapper mb-5 w-perc-100">
          <div className="listings-section p-0 w-perc-100 dis-fl-col jc-b row-a-b col-12">
            {
              activeBuyerProperties.map((property, i) => (
                <div
                  key={i.toString()}
                  className="results dis-f shadow-3dp mb-3 a-c bgWhite brdRadius"
                >
                  <div className="row-section p-1 avatar-container dis-f a-c ov-h flex-112">
                    <Link
                      className="cur-po"
                      to={{
                        pathname: `/buyer/property/${property.id}`,
                      }}
                    >
                      <CoverPropertyImage
                        coverPhoto={get(property, 'coverPhoto.galleryThumbnailPath', null)}
                        className="avatar w-fix-96 h-fix-96 pos-r brdRadius"
                      />
                    </Link>
                  </div>

                  <div className="row-section name p-1 notranslate w-perc-100 max-w-fix-304">
                    <div className="wrapper dis-fl-col a-bl">
                      <Link
                        className="link fsize-300 fweight-500 txtDark700 body2"
                        to={{
                          pathname: `/buyer/property/${property.id}`,
                        }}
                      >
                        {property.title}
                      </Link>
                    </div>
                  </div>

                  <div className="dis-f w-perc-100 min-w-fix-360 max-w-fix-600 mt-1 mt-sm-0 px-2 jc-b ml-a">
                    <div className="px-1">
                      <h6 className="fsize-100 txtDark200">Price</h6>
                      <div className="txtGreen400 ff-mono">{showPrice(property)}</div>
                    </div>

                    <div className="px-1">
                      <h6 className="fsize-100 txtDark200 ws-nw">Rooms</h6>
                      <span className="ff-mono txtDark700">
                        {FormatValue.formatRooms(get(property, 'properties.typology.bedrooms', 0), get(property, 'location.countryCode', 'CH'))}
                      </span>
                    </div>
                    <div className="px-1">
                      <h6 className="fsize-100 txtDark200 ws-nw">Living space</h6>
                      {
                        get(property, 'location.countryCode', '') === 'PT' && get(property, 'properties.typology.grossArea.value', 0) > 0 ? (
                          <span className="ff-mono txtDark700">{get(property, 'properties.typology.grossArea.value', '0')} m</span>
                        ) : (
                          <span className="ff-mono txtDark700">{get(property, 'properties.typology.livingArea.value', '0')} m</span>
                        )
                      }
                    </div>
                    <div className="px-1">
                      <h6 className="fsize-100 txtDark200 ws-nw">Year</h6>
                      <span className="ff-mono txtDark700">
                        {get(property, 'properties.building.built', '0000')}
                      </span>
                    </div>

                    <div className="row-section status p-1 dis-f jc-fe">
                      <BrixelButtonIcon
                        brdOnHover
                        color="dark"
                        background="dark"
                        saturation={100}
                        fontSize={16}
                        saturationTxt={500}
                        icon="archive"
                        className="archiveBtn zIndex1"
                        onClick={(e) => archOnClick(e, property.dealID, property.archivedByBuyer)}
                        label={property.archivedByBuyer ? 'Unarchive' : 'Archive'}
                      />
                    </div>
                  </div>

                </div>
              ))
            }
          </div>
        </div>

        <div className="profile-market-container dis-fl-col dis-fl-row-sm">
          <div className="search-profile w-perc-100 mb-4 mb-sm-0 max-w-fix-sm-368 mr-5">
            <h6>Your search profile</h6>
            {
              has(userSearchProfiles[0], 'id') ? (
                <div className="bgWhite brdRadius shadow-3dp p-2 mt-3">
                  <h6 className="txtDark500 body2">Type</h6>
                  {
                    get(userSearchProfiles[0], 'characteristics.propertyType', []).map((item, i) => (
                      <p className="txtDark700" key={i.toString()}>{item}</p>
                    ))
                  }
                  <h6 className="txtDark500 body2 mt-3">Location</h6>
                  {
                    get(userSearchProfiles[0], 'location', []).map((item, i) => (
                      <p className="txtDark700" key={i.toString()}>{item.address}</p>
                    ))
                  }
                  <h6 className="txtDark500 body2 mt-3">Price</h6>
                  <p className="txtGreen400"><span className="body2 txtGreen400">{get(userSearchProfiles[0], 'finance.currency', 'CHF')}</span> <span className="fSizePx20">{Helpers.formatNumberValue(get(userSearchProfiles[0], 'finance.price.totalMax', 'CHF'), get(userSearchProfiles[0], 'finance.currency', 'CHF'))}</span></p>

                  <hr className="my-3" />

                  <div className="dis-f jc-b">
                    <div>
                      <h6 className="txtDark500 body2">Rooms</h6>
                      <p className="txtDark700">{get(userSearchProfiles[0], 'characteristics.bedrooms.min', 0)} - {get(userSearchProfiles[0], 'characteristics.bedrooms.max', 0)}</p>
                    </div>
                    <div>
                      <h6 className="txtDark500 body2">Living Space in m2</h6>
                      <p className="txtDark700">{get(userSearchProfiles[0], 'characteristics.livingArea.min', 0)} - {get(userSearchProfiles[0], 'characteristics.livingArea.max', 0)}</p>
                    </div>
                  </div>

                  <hr className="my-3" />

                  {extraFeaturesList()}
                </div>
              ) : (
                <section className="searchProfile brdRadius bgWhite shadow-2dp ta-c p-3 mt-3">
                  <h5 className="mb-2 txtDark700"> Create your search profile now. </h5>
                  <p className="pb-4 txtDark700">Get exclusive access to our Brixel properties and get in touch with private sellers.</p>

                  <img width="190" src={searchImg} alt="" />
                  <BrixelButtonPrimary
                    className="mt-5 ml-a mr-a"
                    label="Get access for free"
                    rightIcon="arrow-right"
                    rounded
                    background="green"
                  />
                </section>
              )
            }
          </div>
          <div className="brixel-market">
            <div className="market-teaser dis-fl-col h-perc-100">
              <div className="dis-f">
                <h6 className="mr-2">Brixel Market</h6>
                <div className="teaser w-fix-96 h-fix-24 p-1 dis-fl-col jc-c a-c brdRadius">
                  <span className="fsize-100 txtWhite">Coming soon</span>
                </div>
              </div>
              <section className="brdRadius bgWhite brdSmall brdLight400 ta-c p-3 mt-3 h-perc-100 dis-fl-col a-c jc-c">
                <img width="254" src={mapImg} alt="" />
                <p className="txtDark700 pt-5">Soon we will release the Brixel Market and match your search profile with our properties and sellers.  </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PropertiesBuyerDashboard.propTypes = {
  handleSaveActiveSingleDeal: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  userBuyerProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

PropertiesBuyerDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  userBuyerProperties: get(state, 'user.userBuyerProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  langConfig: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleSaveActiveSingleDeal: bindActionCreators(saveActiveSingleDeal, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PropertiesBuyerDashboard);
