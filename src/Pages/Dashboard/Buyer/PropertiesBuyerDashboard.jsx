/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Link, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonIcon, FormatValue,
  Helpers,
} from '@brixel/brixel-components';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import { saveActiveSingleDeal } from '../../../actions/DealsActions';
import { getUserSearchProfiles } from '../../../actions/SearchProfileActions';

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
        <div className="properties mb-5 listings-wrapper w-perc-100">
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

        <div className="profile-market-container dis-fl-row col-12 p-0">
          <div className="search-profile col-5 p-0 mr-7">
            <h6>Your search profile</h6>
            {
              has(userSearchProfiles[0], 'id') && (
                <span>{userSearchProfiles[0].id}</span>
              )
            }
          </div>
          <div className="brixel-market col-6 p-0">
            <div className="market-teaser dis-fl-row a-c">
              <h6 className="mr-2">Brixel Market</h6>
              <div className="teaser w-fix-96 h-fix-24 p-1 dis-fl-col jc-c a-c brdRadius">
                <span className="fsize-100 txtWhite">Coming soon</span>
              </div>
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
