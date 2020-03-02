/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon, BrixelDropdown,
  BrixelButtonTertiary, useOutsideAlerter, BrixelInputText,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import Loading from '../components/Loading';
import {
  getUserProperties,
} from '../actions/UserActions';
import noCover from '../images/no_cover.jpg';

// COMPONENTS
import DrawerLayout from '../components/DrawerLayout';

const Properties = (props) => {
  // PROPS
  const {
    history, user, match, activeProperty,
    getPropertiesOfUser, userProperties,
  } = props;

  // PAGE ID
  const pageId = get(match, 'params.propId', activeProperty.id);
  const sectionPage = get(match, 'params.act', 'home');

  useEffect(() => {
    if (get(user, 'user.id')) {
      getPropertiesOfUser(user.user.id);
    }
  }, [user]);

  if (!userProperties) {
    return (
      <Loading />
    );
  }

  return (
    <DrawerLayout
      classNameDrawer="ov-a"
    >
      <div className="properties">
        <div className="properties-header dis-fl-row a-c jc-b mb-3 p-2">
          <div className="dis-fl-row a-c">
            <BrixelIcon
              className="mr-2"
              icon="properties"
              color="light"
              saturationTxt={100}
              background="primary"
              saturation={300}
            />

            <span className="docubox-title fweight-500 txtDark700">Properties</span>
          </div>

          <BrixelButtonIcon
            className="shadow-3dp"
            noBorder
            background="white"
            color="dark"
            saturationTxt={700}
            icon="close-small"
            onClick={() => history.push(`/${pageId}/${sectionPage}`)}
          />
        </div>
        {
          (userProperties && userProperties.length > 0) && (
            <div className="px-2">
              {
                userProperties.map((property, i) => (
                  <a key={i.toString()} className="link" href={`/${property.id}/home`}>
                    <li className="single-property dis-fl-row a-c jc-b pb-1 pt-1 cur-poi">
                      <div className="dis-fl-row">
                        <div className="avatar w-fix-48 brdCircle h-fix-48 a-c jc-c">
                          {
                            property.coverPhoto && property.coverPhoto.path ? (
                              <img className="avatar w-fix-48 h-fix-48 brdRadius pos-r" src={`${getConfigEnv.shortPath}${property.coverPhoto.path}`} alt="Brixel Logo" id="avatar" />
                            ) :
                              (
                                <i
                                  className="avatar w-fix-48 h-fix-48 brdRadius pos-r"
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
                        <div className="title ml-1">
                          <span className="name dis-fl-row body fweight-500 txtDark700 pt-1">
                            {(has(property.properties, 'typology') && has(property.properties.typology, 'bedrooms')) ? property.properties.typology.bedrooms : ''} {has(property.properties, 'propertyType') ? property.properties.propertyType : 'Property'}
                          </span>
                          <span className="address caption txtLight400">{has(property.location, 'zip') ? property.location.zip : ''} {has(property.location, 'state') ? property.location.state : ''}</span>
                        </div>
                      </div>
                    </li>
                  </a>
                ))
              }
            </div>
          )
        }
      </div>
    </DrawerLayout>
  );
};

Properties.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  activeProperty: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userProperties: PropTypes.arrayOf(PropTypes.object.isRequired),
  getPropertiesOfUser: PropTypes.func.isRequired,
};

Properties.defaultProps = {
};

const mapStateToProps = (state) => ({
  user: get(state, 'user.loggedUser', {}),
  userProperties: get(state, 'user.userProperties', []),
  activeProperty: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
  getPropertiesOfUser: bindActionCreators(getUserProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Properties);
