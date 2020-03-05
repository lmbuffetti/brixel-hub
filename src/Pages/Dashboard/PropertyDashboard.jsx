import React, { useEffect, useState }  from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonIcon, BrixelIcon, BrixelProgressBar,
} from '@brixel/brixel-components';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import { compose } from 'redux';
import { connect } from 'react-redux';
import noCover from '../../images/no_cover.jpg';
import { roundFifty } from '../../utils/helpers';

const HomeDashboard = (props) => {
  // PROPS
  const {
    property,
    match,
    history,
    langConfig,
    loggedUser,
  } = props;
  // STATE
  const [userType, setUserType] = useState();

  useEffect(() => {
    if (property.id && loggedUser.user) {
      let userType = 'buyer';
      if (property.id && (property.owner.id === loggedUser.user.id)) {
        userType = 'seller';
      }
      setUserType(userType);
    }
  }, [property, loggedUser]);

  const goToPreview = (e) => {
    e.preventDefault();
    if (userType === 'seller') window.open(`${getConfigEnv.pageUrl}preview/${property.stub}`, '_blank');
    else window.open(`${getConfigEnv.pageUrl}${property.stub}`, '_blank');
  };

  const goToInputSheet = (e) => {
    e.preventDefault();
    history.push(`/${match.params.propId}/property/facts`);
  };

  const openDocuments = (e) => {
    e.preventDefault();
    history.push(`/${match.params.propId}/property/documents`);
  };

  return (
    <>
      <div className="property-info-container brdRadius p-md-2">
        <div className="header-section dis-fl-row a-c jc-b mb-2">
          <div className="dis-fl-row">
            <div className="avatar w-fix-48 brdCircle h-fix-48 a-c jc-c">
              {
                property.coverPhoto && property.coverPhoto.path ? (
                  <img className="avatar w-fix-48 h-fix-48 brdRadius pos-r" src={`${getConfigEnv.shortPath}${property.coverPhoto.thumbnailPath}`} alt="Brixel Logo" id="avatar" />
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
          <div className="actions dis-fl-row">
            <BrixelButtonIcon
              bgTransparent
              color="primary"
              saturationTxt={400}
              className="mr-2"
              icon="eye"
              onClick={(e) => goToPreview(e)}
            />
            {
              userType === 'seller' && (
                <BrixelButtonIcon
                  icon="edit"
                  onClick={(e) => goToInputSheet(e)}
                />
              )
            }
          </div>
        </div>

        <div className="transparency-container mb-2">
          <div className="dis-fl-col ta-l">
            {
              get(property, 'inputSheet') && userType === 'seller' && (
                <>
                  <span className="subtitle fsize-300 txtDark200">Transparency</span>
                  <div className="dis-f txtPrimary700">
                    <span className="ff-mono pr-1">{property.inputSheet.totalComplete}%</span>
                  </div>
                  <BrixelProgressBar
                    rounded
                    saturation={700}
                    small
                    barBackground="Red"
                    backgroundSaturation={100}
                    progressValue={property.inputSheet.totalComplete}
                  />
                </>
              )
            }
          </div>
        </div>


        <div className="details dis-fl-col mb-4">
          <div className="dis-fl-row jc-b">
            <div className="first mb-2 dis-fl-col jc-b w-perc-100">
              {
                property.status === 'on-sale' && (
                  <div className="dis-fl-col">
                    <span className="subtitle fsize-300 txtDark200">Price</span>
                    <div className="dis-fl-row jc-b">
                      <span className="value txtDark500">{property.price.currency} {property.price.total.toLocaleString(langConfig.localString)}</span>
                      {
                        has(property, 'price.pricePerM2') && (
                          <div className="dis-f a-c">
                            <span className="value txtDark500">{roundFifty(property.price.pricePerM2).toLocaleString(langConfig.localString)}</span>
                            <span className="fsize-300 txtDark500"> / m2</span>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <div className="dis-fl-row jc-b a-c">
            <div className="fourth dis-fl-col ta-l">
              <span className="subtitle fsize-300 txtDark200">Rooms</span>
              <span className="value txtDark500">{get(property, 'properties.typology.bedrooms') ? property.properties.typology.bedrooms : 'N/A'}</span>
            </div>
            <div className="dis-fl-col ta-l">
              <span className="subtitle fsize-300 txtDark200">Living space</span>
              <span className="value txtDark500">{(has(property.properties, 'typology') && property.properties.typology.livingArea) ? property.properties.typology.livingArea.value : 'N/A'} m2</span>
            </div>
            <div className="dis-fl-col ta-l">
              <span className="subtitle fsize-300 txtDark200">Year built</span>
              <span className="value txtDark500">{(has(property.properties, 'building') && property.properties.building.built) ? property.properties.building.built : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="boxPanel dis-fl-row jc-b mb-4">
          {
            userType === 'seller' && (
              <div
                className="dis-fl-row a-c p-1 brdRadius"
                onClick={(e) => openDocuments(e)}
              >
                <BrixelIcon
                  className="mr-1"
                  icon="folder"
                  color="light"
                  padding="p-small-9"
                  saturationTxt={100}
                  background="primary"
                  saturation={300}
                />
                <div className="dis-fl-col a-l">
                  <span className="tabTitle txtDark700">Docubox</span>
                  <div className="length dis-fl-row txtDark200 fsize-300">
                    <span>{property.documents && property.documents.length > 0 ? property.documents.length : 0}&nbsp;</span>
                    <span> files</span></div>
                </div>
              </div>
            )
          }
          <div
            className="dis-fl-row a-c p-1 brdRadius"
          >
            <BrixelIcon
              className="mr-1"
              icon="calendar"
              color="light"
              padding="p-small-9"
              saturationTxt={100}
              background="primary"
              saturation={300}
            />
            <div className="dis-fl-col">
              <span className="tabTitle txtDark700">Showings</span>
              <div className="length dis-fl-row txtDark200 fsize-300"><span>No upcoming</span></div>
            </div>
          </div>
        </div>

        {
          userType === 'seller' && (
            <div className="buyer">
              <h5 className="mb-1 txtDark700">Buyer</h5>
              <div className="buyer-container dis-fl-row row-cols-3 jc-b a-c brdRadius p-2">
                <div className="dis-fl-col jc- a-c">
                  <span className="number txtDark500">0</span>
                  <span className="text">Requests</span>
                </div>
                <div className="dis-fl-col jc- a-c">
                  <span className="number txtDark500">0</span>
                  <span className="text">Visits</span>
                </div>
                <div className="dis-fl-col jc- a-c">
                  <span className="number txtDark500">0</span>
                  <span className="text">Offers</span>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
};

HomeDashboard.propTypes = {
  property: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  langConfig: PropTypes.string.isRequired,
  loggedUser: PropTypes.object.isRequired,
  userAwards: PropTypes.arrayOf(PropTypes.object.isRequired),
};

HomeDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  langConfig: get(state, 'common.language', ''),
  loggedUser: get(state, 'user.loggedUser', {}),
  property: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
