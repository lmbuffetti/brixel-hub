/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Link, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelIcon,
  FactsOptions,
  Helpers,
} from '@brixel/brixel-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import CoverPropertyImage from '../../../components/CoverPropertyImage';

const PropertiesBuyerDashboard = (props) => {
  const { factsOptions } = FactsOptions;
  // PROPS
  const {
    history,
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
            <span c>Reserved</span>
          )
        }
        {
          property.status === 'to-rent' && (
            <>
              <span>{currency}&nbsp;</span>
              <span>{Helpers.formatNumberValue(get(property, 'price.rent', 0), currency)}</span>
            </>
          )
        }
        {
          (!property.status || property.status === 'on-sale') && (
            <>
              <span>{currency}&nbsp;</span>
              <span>{Helpers.formatNumberValue(get(property, 'price.total', 0), currency)}</span>
            </>
          )
        }
      </>
    );
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
              userBuyerProperties.map((property, i) => (
                <Fragment key={i.toString()}>
                  <div className="results dis-f shadow-1dp mb-2">
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
                          className="link"
                          to={{
                            pathname: `/buyer/property/${property.id}`,
                          }}
                        >
                          {property.title}
                        </Link>
                        <span className="address">
                          {get(property, 'location.name', '')} {get(property, 'location.streetNumber', '')}, {get(property, 'location.zip', '')} {get(property, 'location.city', '')}
                        </span>
                        {/* <span className="id">{property.id}</span> */}
                      </div>
                    </div>

                    <div className="row-section owner w-perc-100 p-1">
                      <div className="dis-f jc-b a-c">
                        <p className="dis-f a-c">
                          <BrixelIcon icon="bed" className="mr-1" label="Rooms" />
                          <span className="ff-mono body2">{get(property, 'properties.typology.bedrooms', '0')}</span>
                        </p>
                        <p className="dis-f a-c">
                          <BrixelIcon icon="plans" className="mr-1" label="Living Area" />
                          {
                            get(property, 'location.countryCode', '') === 'PT' && get(property, 'properties.typology.grossArea.value', 0) > 0 ? (
                              <span className="ff-mono body2">{get(property, 'properties.typology.grossArea.value', '0')} m</span>
                            ) : (
                              <span className="ff-mono body2">{get(property, 'properties.typology.livingArea.value', '0')} m</span>
                            )
                          }
                        </p>
                        <p className="dis-f a-c">
                          <BrixelIcon icon="house-built" className="mr-1" label="Year" />
                          <span className="ff-mono body2">
                            {get(property, 'properties.building.built', '0000')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="row-section status p-1 w-perc-100 dis-f jc-fe">
                      {showPrice(property)}
                    </div>

                    <div className="row-section status p-1 w-perc-100 dis-f jc-fe">
                      <a href="" target="_blank">
                        <BrixelIcon
                          icon="link-open"
                          label="Open Page"
                        />
                      </a>
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
  history: PropTypes.object.isRequired,
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

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(PropertiesBuyerDashboard);
