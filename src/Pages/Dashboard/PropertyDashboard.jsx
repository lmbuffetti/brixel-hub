import React, { useEffect, useState }  from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonBox,
  BrixelButtonIcon, BrixelIcon, BrixelProgressBar,
} from '@brixel/brixel-components';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import { compose } from 'redux';
import { connect } from 'react-redux';
import noCover from '../../images/no_cover.jpg';
import { roundFifty } from '../../utils/helpers';
import { GameGroupConfig } from '../../constants/global';
import Loadable from 'react-loadable';
import LoadingSimple from '../../components/LoadingSimple';
import Loading from '../../components/Loading';

const Facts = Loadable({
  loader: () => import('../EditProperty/Facts' /* webpackChunkName: "Facts" */),
  loading: LoadingSimple,
});

const Photos = Loadable({
  loader: () => import('../EditProperty/Media/Photos' /* webpackChunkName: "Photos" */),
  loading: LoadingSimple,
});

const Plans = Loadable({
  loader: () => import('../EditProperty/Media/Plans' /* webpackChunkName: "Plans" */),
  loading: LoadingSimple,
});

const Tour = Loadable({
  loader: () => import('../EditProperty/Media/Tour' /* webpackChunkName: "Tour" */),
  loading: LoadingSimple,
});

const Documents = Loadable({
  loader: () => import('../../components/Documents' /* webpackChunkName: "Documents" */),
  loading: Loading,
});

const HomeDashboard = (props) => {
  // PROPS
  const {
    formValue,
    history,
    langConfig,
    loggedInUser,
    match,
    property,
  } = props;
  // STATE
  const [userType, setUserType] = useState();
  // URL PARAMS
  const propID = get(match, 'params.propId', null);


  useEffect(() => {
    if (property.id && loggedInUser.user) {
      let userType = 'buyer';
      if (property.id && (property.owner.id === loggedInUser.user.id)) {
        userType = 'seller';
      }
      setUserType(userType);
    }
  }, [property, loggedInUser]);

  const goToPreview = (e) => {
    e.preventDefault();
    if (userType === 'seller') window.open(`${getConfigEnv.pageUrl}preview/${property.stub}`, '_blank');
    else window.open(`${getConfigEnv.pageUrl}${property.stub}`, '_blank');
  };

  const goToInputSheet = (e) => {
    e.preventDefault();
    history.push(`/${propID}/property/edit/facts`);
  };

  const openDocuments = (e) => {
    e.preventDefault();
    history.push(`/${propID}/property/documents`);
  };

  return (
    <>
      <div className="property-info-container brdRadius p-md-2">
        <div className="dis-f">
          <div className="bgLight100 p-2">
            <div className="bgWhite brdRadius shadow-3dp" onClick={() => history.push(`/${propID}/property/facts`)}>
              <div className="transparency-container">
                <div className="dis-fl-col ta-l">
                  {
                    get(property, 'inputSheet', null) && userType === 'seller' && (
                      <>
                        <BrixelButtonBox
                          icon="document"
                          label="Facts"
                          subtitle={`${property.inputSheet.totalComplete}%`}
                          subtitleClass={'ff-mono'}
                          background="white"
                          className="w-perc-100"
                          colorIcon={'white'}
                          backIcon="primary700 mr-1"
                          hoverEffect={false}
                        />
                        <div className="px-1">
                          <BrixelProgressBar
                            rounded
                            saturation={700}
                            small
                            barBackground="Red"
                            backgroundSaturation={100}
                            progressValue={property.inputSheet.totalComplete}
                          />
                        </div>
                      </>
                    )
                  }
                </div>
              </div>


              <div className="details dis-fl-col p-1">
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
            </div>

            <div className="dis-f mt-2">
              <BrixelButtonBox
                icon="gallery"
                label="Photos"
                subtitle={`${get(formValue, 'photos', []).length} Files`}
                background="white"
                className="w-perc-100 mr-1"
                colorIcon={'white'}
                backIcon="primary700 mr-1"
                onClick={() => history.push(`/${propID}/property/photos`)}
              />
              <BrixelButtonBox
                icon="plans"
                label="Plans"
                subtitle={`${get(formValue, 'floorPlans', []).length} Files`}
                background="white"
                className="w-perc-100 ml-1"
                colorIcon={'white'}
                backIcon="primary700 mr-1"
                onClick={() => history.push(`/${propID}/property/plans`)}
              />
            </div>

            <BrixelButtonBox
              icon="tour"
              label="3d Tour"
              subtitle={`0 Files`}
              background="white"
              className="w-perc-100 mt-5"
              colorIcon={'white'}
              backIcon="primary700 mr-1"
              onClick={() => history.push(`/${propID}/property/tour`)}
            />

            <BrixelButtonBox
              icon="folder"
              label="Docubox"
              subtitle={`0 Files`}
              background="white"
              className="w-perc-100 mt-2"
              colorIcon={'white'}
              backIcon="primary700 mr-1"
              onClick={() => history.push(`/${propID}/property/documents`)}
            />

          </div>

          <Route path="/:propId?/property/facts" exact component={Facts} />
          <Route path="/:propId?/property/photos" component={Photos} />
          <Route path="/:propId?/property/plans" exact component={Plans} />
          <Route path="/:propId?/property/tour" exact component={Tour} />
          <Route path="/:propId?/property/documents" exact component={Documents} />

        </div>

      </div>
    </>
  )
};

HomeDashboard.propTypes = {
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  langConfig: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  userAwards: PropTypes.arrayOf(PropTypes.object.isRequired),
};

HomeDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  langConfig: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
