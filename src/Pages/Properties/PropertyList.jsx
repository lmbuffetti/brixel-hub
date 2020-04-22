/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { compose } from 'redux';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import noCover from '../../images/no_cover.jpg';
import { sortObject } from '../../utils/helpers';
import { BrixelButtonPrimary, BrixelStatus } from '@brixel/brixel-components';

const PropertyList = (props) => {
  // PROPS
  const {
    activeSection,
    favoritesProperties,
    formValue,
    history,
    userProperties,
    user,
    className,
  } = props;

  // STATE
  const [activeProperties, setActiveProperties] = useState([]);

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
    }
  };

  return (
    <div className={`properties ov-a h-perc-100 ${className}`}>
      {
        (activeProperties && activeProperties.length > 0) && (
          <div className="px-0 pb-5">
            {
              activeProperties.map((property, i) => (
                <a key={i.toString()} className="link dis-b" href={`/${property.id}/home`}>
                  <li className="single-property a-c dis-fl-row cur-poi shadow-1dp brdRadius p-1 my-2">

                    <div className="avatar p1 w-fix-48 h-fix-48 flex-48 a-c jc-c pos-r brdRadius ov-h">
                      {
                        property.coverPhoto && property.coverPhoto.path ? (
                          <img
                            src={`${getConfigEnv.shortPath}${property.coverPhoto.thumbnailPath}`}
                            alt="Brixel Logo"
                            id={`avatar${i}`}
                            className="dis-b"
                          />
                        ) : (
                          <i
                            className="w-perc-100 h-perc-100"
                            style={{
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              display: 'block',
                              backgroundRepeat: 'no-repeat',
                              backgroundImage: `url(${noCover})`,
                            }}
                          />
                        )
                      }
                    </div>
                    <div className="title px-1 w-perc-100">
                      <span className="name body2 dis-fl-row fweight-500 txtDark700">
                        {get(formValue, 'title', '')}
                      </span>
                    </div>
                    <div className="flex-72 max-w-fix-72 ta-r pr-1 txtDark700">
                        {
                          property.owner.id === user.user.id ? (
                            <>
                              {
                                activeSection !== 'seller' && (
                                  <span className="fweight-500 body2">Owner</span>
                                )
                              }
                              <span className="dis-f a-c">
                                <BrixelStatus color={statusPage(property).colorIcon} />
                                <span className="ml-1 body2 txtDark200">{statusPage(property).label}</span>
                              </span>
                            </>
                          ) : (
                            <>
                              {
                                activeSection !== 'buyer' && (
                                  <span className="fweight-500">Buyer</span>
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
              onClick={() => history.push('/packageFlow/getStarted')}
            />
          </div>
        )
      }
    </div>
  );
};

PropertyList.propTypes = {
  activeSection: PropTypes.string,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  activeProperty: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userProperties: PropTypes.arrayOf(PropTypes.object.isRequired),
  favoritesProperties: PropTypes.arrayOf(PropTypes.object.isRequired),
  windowDimensions: PropTypes.object.isRequired,
};

PropertyList.defaultProps = {
  activeSection: null,
};

const mapStateToProps = (state) => ({
  activeProperty: get(state, 'property.activeSingleProperty', {}),
  favoritesProperties: get(state, 'user.favorites', []),
  formValue: get(state, 'form.Property.values', {}),
  user: get(state, 'user.loggedInUser', {}),
  userProperties: get(state, 'user.userProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PropertyList);
