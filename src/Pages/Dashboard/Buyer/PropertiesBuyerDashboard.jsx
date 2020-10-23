/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Link, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  Helpers,
} from '@brixel/brixel-components';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import { saveActiveSingleDeal } from '../../../actions/DealsActions';

const PropertiesBuyerDashboard = (props) => {
  // PROPS
  const {
    handleSaveActiveSingleDeal,
    history,
    loggedInUser,
    userBuyerProperties,
  } = props;
  // STATE
  const [activeBuyerProperties, setSctiveBuyerProperties] = useState([]);
  // URL PARAMS
  const getFact = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    const properties = userBuyerProperties.filter((item) => item.archivedByBuyer !== true);
    setSctiveBuyerProperties(properties);
  }, [userBuyerProperties]);

  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('facts') && getFact() !== 'facts') ||
      (history.location.pathname.includes('edit'))
    ) {
      return 'closed';
    }
    return 'opened';
  };

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
            <div className="dis-f a-b">
              <span>{currency}&nbsp;</span>
              <span>{Helpers.formatNumberValue(get(property, 'price.rent', 0), currency)}</span>
            </div>
          )
        }
        {
          (!property.status || property.status === 'on-sale') && (
            <div className="dis-f a-b">
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
          <span>Properties you are interested in </span>
          <span className="notranslate">({activeBuyerProperties.length})</span>
        </h5>
        <div className="properties listings-wrapper w-perc-100">
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
                        coverPhoto={get(property, 'coverPhoto.thumbnailPath', null)}
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
                      <span className="ff-mono txtDark700">{get(property, 'properties.typology.bedrooms', '0')}</span>
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
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-md-1 closed' : 'opened'}`} />
          )
        }
      </div>
    </>
  );
};

PropertiesBuyerDashboard.propTypes = {
  handleSaveActiveSingleDeal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  userBuyerProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
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
});

const mapDispatchToProps = (dispatch) => ({
  handleSaveActiveSingleDeal: bindActionCreators(saveActiveSingleDeal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PropertiesBuyerDashboard);
