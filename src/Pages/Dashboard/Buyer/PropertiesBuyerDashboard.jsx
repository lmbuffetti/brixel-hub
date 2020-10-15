/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Link, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelIcon,
  FactsOptions,
  Helpers,
} from '@brixel/brixel-components';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import { saveActiveSingleDeal } from '../../../actions/DealsActions';

const PropertiesBuyerDashboard = (props) => {
  const { factsOptions } = FactsOptions;
  // PROPS
  const {
    handleSaveActiveSingleDeal,
    history,
    loggedInUser,
    userBuyerProperties,
  } = props;
  // STATE
  // const [userType, setUserType] = useState();
  // URL PARAMS
  const getFact = () => last(history.location.pathname.split('/'));

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
    console.log(dealsID, isArchived);
  };

  return (
    <>
      <div className="property-container h-perc-md-100 pos-r" id="propertyDashboard">
        <h5 className="mb-2">
          Properties you are interested in ({get(userBuyerProperties, 'length', 0)})
        </h5>
        <div className="properties listings-wrapper w-perc-100">
          <div className="listings-section p-0 w-perc-100 dis-fl-col jc-b row-a-b col-12">
            {
              userBuyerProperties.filter((item) => item.archivedByBuyer !== true).map((property, i) => (
                <Fragment key={i.toString()}>
                  <div className="results dis-f shadow-1dp mb-2 a-c">
                    <div className="row-section avatar-container p-1 dis-f a-c ov-h flex-112">
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

                    <div className="row-section name p-1 notranslate w-perc-100">
                      <div className="wrapper dis-fl-col a-bl">
                        <Link
                          className="link txtDark700 body2"
                          to={{
                            pathname: `/buyer/property/${property.id}`,
                          }}
                        >
                          {property.title}
                        </Link>
                        <span className="address body2">
                          {get(property, 'location.name', '')} {get(property, 'location.streetNumber', '')}, {get(property, 'location.zip', '')} {get(property, 'location.city', '')}
                        </span>
                        {/* <span className="id">{property.id}</span> */}
                      </div>
                    </div>

                    <div className="row-section status p-1 px-2 ws-nw">
                      <h6 className="fsize-100">Price</h6>
                      <div className="txtGreen400">{showPrice(property)}</div>
                    </div>

                    <div className="row-section owner p-1">
                      <div className="dis-f jc-b a-c">
                        <div className="px-1">
                          <h6 className="fsize-100 ws-nw">Rooms</h6>
                          <span className="ff-mono body2">{get(property, 'properties.typology.bedrooms', '0')}</span>
                        </div>
                        <div className="px-1">
                          <h6 className="fsize-100 ws-nw">Living space</h6>
                          {
                            get(property, 'location.countryCode', '') === 'PT' && get(property, 'properties.typology.grossArea.value', 0) > 0 ? (
                              <span className="ff-mono body2">{get(property, 'properties.typology.grossArea.value', '0')} m</span>
                            ) : (
                              <span className="ff-mono body2">{get(property, 'properties.typology.livingArea.value', '0')} m</span>
                            )
                          }
                        </div>
                        <div className="px-1">
                          <h6 className="fsize-100 ws-nw">Year</h6>
                          <span className="ff-mono body2">
                            {get(property, 'properties.building.built', '0000')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="row-section status p-1 dis-f jc-fe">
                      <BrixelButtonIcon
                        bgTransparent
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
                </Fragment>
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
