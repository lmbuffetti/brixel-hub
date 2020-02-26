import React, { useEffect } from 'react';
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
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import noCover from '../../images/no_cover.jpg';

const HomeDashboard = (props) => {
  // PROPS
  const {
    property, match, history, langConfig,
  } = props;

  const goToPreview = (e) => {
    e.preventDefault();
    window.open(`${getConfigEnv.pageUrl}preview/${property.stub}`, '_blank');
  };

  const goToInputSheet = (e) => {
    e.preventDefault();
    history.push(`/${match.params.propId}/property/inputSheet`);
  };

  const openDocuments = (e) => {
    e.preventDefault();
    history.push(`${match.url}/documents`);
  };

  return (
    <>
      <div className="property-info-container p-1">
        <div className="header-section dis-fl-row a-c jc-b mb-2">
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
          <div className="actions dis-fl-row">
            <BrixelButtonIcon
              bgTransparent
              color="primary"
              saturationTxt={400}
              className="mr-2"
              icon="eye"
              onClick={(e) => goToPreview(e)}
            />
            <BrixelButtonIcon
              icon="edit"
              onClick={(e) => goToInputSheet(e)}
            />
          </div>
        </div>

        <div className="transparency-container mb-2">
          <div className="dis-fl-col ta-l">
            {
              get(property, 'inputSheet') && (
                <>
                  <BrixelProgressBar
                    rounded
                    saturation={700}
                    large
                    barBackground="Red"
                    backgroundSaturation={100}
                    progressValue={property.inputSheet.totalComplete}
                  />
                  <div className="dis-f txtPrimary700 pt-1">
                    <span className="value pr-1">{property.inputSheet.totalComplete}%</span>
                    <span className="ff-mono">completed</span>
                  </div>

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
                    <span className="subtitle">Price</span>
                    <div className="dis-fl-row jc-b">
                      <span className="value txtDark500">{property.price.currency} {property.price.total.toLocaleString(langConfig.localString)}</span>
                      <div><span className="value txtDark500">{property.price.pricePerM2.toLocaleString(langConfig.localString)}</span><span> / m2</span></div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <div className="dis-fl-row jc-b a-c">
            <div className="fourth dis-fl-col ta-l">
              <span className="subtitle">Rooms</span>
              <span className="value txtDark500">{get(property, 'properties.typology.bedrooms') ? property.properties.typology.bedrooms : 'N/A'}</span>
            </div>
            <div className="dis-fl-col ta-l">
              <span className="subtitle">Living space</span>
              <span className="value txtDark500">{(has(property.properties, 'typology') && property.properties.typology.livingArea) ? property.properties.typology.livingArea.value : 'N/A'} m2</span>
            </div>
            <div className="dis-fl-col ta-l">
              <span className="subtitle">Year built</span>
              <span className="value txtDark500">{(has(property.properties, 'building') && property.properties.building.built) ? property.properties.building.built : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="areas dis-fl-row row-cols-2 mb-4">
          <div
            className="docubox dis-fl-row a-c p-1 brdRadius"
            onClick={(e) => openDocuments(e)}
          >
            <BrixelIcon
              className="mr-1"
              icon="folder"
              color="light"
              saturationTxt={100}
              background="primary"
              saturation={300}
            />
            <div className="dis-fl-col a-c">
              <span className="docubox-title">Docubox</span>
              <div className="length dis-fl-row"><span>{property.documents && property.documents.length > 0 ? property.documents.length : 0}&nbsp;</span> <span> files</span></div>
            </div>
          </div>
          <div
            className="docubox dis-fl-row a-c p-1 brdRadius"
          >
            <BrixelIcon
              className="mr-1"
              icon="calendar"
              color="light"
              saturationTxt={100}
              background="primary"
              saturation={300}
            />
            <div className="dis-fl-col">
              <span className="docubox-title">Showings</span>
              <div className="length dis-fl-row"><span>No upcoming</span></div>
            </div>
          </div>
        </div>

        <div className="buyer">
          <h5 className="mb-1">Buyer</h5>
          <div className="buyer-container dis-fl-row row-cols-3 jc-b a-c brdRadius p-2">
            <div className="dis-fl-col jc- a-c">
              <span className="number">0</span>
              <span className="text">Requests</span>
            </div>
            <div className="dis-fl-col jc- a-c">
              <span className="number">0</span>
              <span className="text">Visits</span>
            </div>
            <div className="dis-fl-col jc- a-c">
              <span className="number">0</span>
              <span className="text">Offers</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

HomeDashboard.propTypes = {
  property: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  langConfig: PropTypes.string.isRequired,
};

HomeDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  property: get(state, 'property.property', {}),
  langConfig: get(state, 'common.language', ''),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
