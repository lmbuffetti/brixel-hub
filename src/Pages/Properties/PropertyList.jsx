/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { compose } from 'redux';
import { BrixelButtonPrimary, BrixelStatus } from '@brixel/brixel-components';
import { sortObject } from '../../utils/helpers';
import CoverPropertyImage from '../../components/CoverPropertyImage';

const PropertyList = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSection,
    activeSingleCompany,
    favoritesProperties,
    userProperties,
    user,
    className,
  } = props;

  // STATE
  const [activeProperties, setActiveProperties] = useState([]);

  // GET LIST OF ALL PROPERTIES AS BUYER OR SELLER
  useEffect(() => {
    let propertiesList;
    switch (activeSection) {
      case 'buyer':
        propertiesList = favoritesProperties;
        break;
      case 'seller':
        propertiesList = userProperties;
        break;
      default:
        propertiesList = favoritesProperties.concat(userProperties);
    }
    propertiesList.sort(sortObject('updatedAt', 'desc'));
    setActiveProperties(propertiesList);
  }, [activeSection, favoritesProperties, userProperties]);

  const statusPage = (property) => {
    let label;
    let colorIcon;
    if (property.publishReview) {
      label = 'Review';
      colorIcon = 'yellow';
    } else if (property.published) {
      label = 'Published';
      colorIcon = 'green';
    } else {
      label = 'Offline';
      colorIcon = 'red';
    }
    return {
      label,
      colorIcon,
    };
  };

  return (
    <div className={`properties ov-a h-perc-100 ${className}`}>
      {
        (activeProperties && activeProperties.length > 0) && (
          <div className="px-0 pb-5">
            {
              activeProperties.map((property, i) => (
                <a key={i.toString()} className="link" href={`/${property.id}/home`}>
                  <li className="single-property a-c dis-fl-row cur-poi shadow-1dp brdRadius p-1 my-2">
                    <div className="image-ratio w-fix-48 h-fix-48 flex-48 a-c jc-c pos-r brdRadius ov-h">
                      <CoverPropertyImage
                        size="48"
                        className="cover"
                        coverPhoto={get(property, 'coverPhoto.path', undefined)}
                        propertyType={get(property, 'properties.propertyType', undefined)}
                      />
                    </div>
                    <div className="title px-2 w-perc-100">
                      <span className="name body2 dis-fl-row fweight-500 txtDark700">
                        {get(property, 'title', '')}
                      </span>
                    </div>

                    <div className="flex-88 max-w-fix-88 ta-r txtDark700">
                      {
                        get(property, 'owner.id', '') === get(user, 'user.id', null) ? (
                          <>
                            {
                              activeSection !== 'seller' && (
                                <span className="fweight-500 body2 ta-r">Owner</span>
                              )
                            }
                            <span className="dis-f a-c jc-fe">
                              <BrixelStatus color={statusPage(property).colorIcon} />
                              <span className="ml-1 body2 txtDark200">{statusPage(property).label}</span>
                            </span>
                          </>
                        ) : (
                          <>
                            {
                              activeSection !== 'buyer' && (
                                <span className="fweight-500 body2">Buyer</span>
                              )
                            }
                          </>
                        )
                      }
                    </div>
                  </li>
                </a>
              ))
            }
          </div>
        )
      }
      {
        activeSection !== 'buyer' && (
          <div className={`dis-f jc-c mb-3 ${activeProperties.length === 0 ? 'mt-3' : ''}`}>
            <BrixelButtonPrimary
              label="Create new"
              rightIcon="plus"
              rounded
              onClick={() => history.push(`/packageFlow/getStarted?company=${get(activeSingleCompany, 'stub', '')}`)}
            />
          </div>
        )
      }
    </div>
  );
};

PropertyList.propTypes = {
  activeSection: PropTypes.string,
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
  activeSingleCompany: PropTypes.object.isRequired,
  userProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

PropertyList.defaultProps = {
  activeSection: null,
  className: '',
};

const mapStateToProps = (state) => ({
  activeProperty: get(state, 'property.activeSingleProperty', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  favoritesProperties: get(state, 'user.favorites', []),
  formValue: get(state, 'brixelForm.Property.values', {}),
  user: get(state, 'user.loggedInUser', {}),
  userProperties: get(state, 'user.userProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(PropertyList);
