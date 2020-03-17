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
  BrixelProgressBar,
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { roundFifty } from '../../utils/helpers';
import Loadable from 'react-loadable';
import LoadingSimple from '../../components/LoadingSimple';
import Loading from '../../components/Loading';
import last from 'lodash/last';

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
    windowDimensions,
  } = props;
  // STATE
  const [userType, setUserType] = useState();
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    if (property.id && loggedInUser.user) {
      let userType = 'buyer';
      if (property.id && (property.owner.id === loggedInUser.user.id)) {
        userType = 'seller';
      }
      setUserType(userType);
    }
  }, [property, loggedInUser]);

  const openCloseColumn = () => {
    if (history.location.pathname.includes('facts') && getFact() !== 'facts') {
      return 'close';
    }
    return 'open';
  };

  const calcLenght = (val) => {
    if (val) return val.length;
    return 0
  };

  return (
    <>
      <div className="property-info-container brdRadius">
        <div className="dis-f">
          <div className={`bgLight100 p-2 expendableColumn ${openCloseColumn()}`}>
            <div className={`jc-c mb-2 ${openCloseColumn() === 'close' ? 'dis-f' : 'hide'}`}>
              <BrixelButtonIcon
                background="white"
                saturation={0}
                color="primary"
                saturationTxt={400}
                icon="arrow-simple-right"
                noBorder
                className="shadow-2dp"
                onClick={() => history.push('../facts')}
              />
            </div>
            <div className="hideOnExpanded">
              <h5 className="mb-3">Property</h5>
              <div className="bgWhite brdRadius shadow-3dp" onClick={() => history.push(`/${propID}/property/facts`)}>
                <div className="transparency-container">
                  <div className="dis-fl-col ta-l">
                    {
                      userType === 'seller' && (
                        <>
                          <BrixelButtonBox
                            icon="document"
                            label="Facts"
                            subtitle={`${get(formValue, 'inputSheet.totalComplete', 0)}%`}
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
                              progressValue={get(formValue, 'inputSheet.totalComplete', 0)}
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
                  subtitle={`${calcLenght(get(formValue, 'photos', []))} Files`}
                  background="white"
                  className="w-perc-100 mr-1"
                  colorIcon={'white'}
                  backIcon="primary700 mr-1"
                  onClick={() => history.push(`/${propID}/property/photos`)}
                />
                <BrixelButtonBox
                  icon="plans"
                  label="Plans"
                  subtitle={`${calcLenght(get(formValue, 'floorPlans', []))} Files`}
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
          </div>
          <div className="w-perc-100" style={{ height: windowDimensions.height - 121 }}>
            <Route path="/:propId?/property/facts" component={Facts} />
            <Route path="/:propId?/property/photos" component={Photos} />
            <Route path="/:propId?/property/plans" exact component={Plans} />
            <Route path="/:propId?/property/tour" exact component={Tour} />
            <Route path="/:propId?/property/documents" exact component={Documents} />
          </div>
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
  windowDimensions: PropTypes.object.isRequired,
};

HomeDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
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
