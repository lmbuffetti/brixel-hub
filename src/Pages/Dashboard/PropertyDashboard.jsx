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
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
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
  loader: () => import('../EditProperty/Documents' /* webpackChunkName: "Documents" */),
  loading: Loading,
});

const HomeDashboard = (props) => {
  // PROPS
  const {
    formValue,
    history,
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
      if (property.id && (property.owner === loggedInUser.user.id || property.owner.id === loggedInUser.user.id)) {
        userType = 'seller';
      }
      setUserType(userType);
    }
  }, [property, loggedInUser]);

  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('facts') && getFact() !== 'facts') ||
      (history.location.pathname.includes('edit'))
    ) {
      return 'closed';
    }
    return 'opened';
  };

  const calcLenght = (val) => {
    if (val) return val.length;
    return 0
  };

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('hubDasHeader');
    const wrapper = document.getElementById('dashboard');
    let paddingTop = 0;
    // let paddingBottom = 0;
    if (wrapper) {
      paddingTop = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-top').replace('px', '');
      // paddingBottom = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-bottom').replace('px', '');
    }
    const heightContent = head[0] ? head[0].offsetHeight : 0;
    return heightContent + +paddingTop;
  };

  return (
    <>
      <div className="property-container dis-f" id="propertyDashboard">
        <div className={`firstLevel bgLight100 expandableColumn ${openCloseColumn() === 'opened' ? 'mr-md-2 opened' : 'closed'}`}>
          <div className={`jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-f' : 'hide'}`}>
            <BrixelButtonIcon
              background="white"
              saturation={0}
              color="primary"
              saturationTxt={400}
              icon="arrow-simple-left"
              noBorder
              className="shadow-2dp"
              onClick={() => history.push('../facts')}
            />
          </div>
          <div className="hideOnExpanded">
            <div
              className={`cur-poi brdRadius shadow-1dp brdMedium ${getFact() === 'facts' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
              onClick={() => history.push(`/${propID}/property/facts`)}>
              <div className="transparency-container">
                <div className="dis-fl-col ta-l">
                  {
                    userType === 'seller' && (
                      <>
                        <BrixelButtonBox
                          bgTransparent
                          icon="document"
                          label="Facts"
                          subtitle={`${get(formValue, 'inputSheet.totalComplete', 0)}%`}
                          subtitleClass={'ff-mono txtPrimary700 mt-small-4'}
                          className="w-perc-100"
                          colorIcon={'primary'}
                          backIcon="primary100 mr-1"
                          hoverEffect={false}
                        />
                      </>
                    )
                  }
                </div>
              </div>


              <div className="details dis-fl-col p-1">
                <div className="dis-fl-row jc-b a-c">
                  <div className="fourth dis-fl-col ta-l">
                    <span className="subtitle fsize-300 txtDark200">Rooms</span>
                    <span className="value txtDark500">{has(property, 'properties.typology.bedrooms') ? property.properties.typology.bedrooms : 'N/A'}</span>
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
                verticalView
                bgTransparent
                icon="gallery"
                label="Photos"
                subtitle={`${calcLenght(get(formValue, 'photos', []))} Files`}
                className={`w-perc-100 mr-1 shadow-1dp brdMedium ${getFact() === 'photos' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                colorIcon={'primary400'}
                backIcon="primary100 mr-1"
                onClick={() => history.push(`/${propID}/property/photos`)}
                selected
              />
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="plans"
                label="Plans"
                subtitle={`${calcLenght(get(formValue, 'floorPlans', []))} Files`}
                className={`w-perc-100 ml-1 shadow-1dp brdMedium ${getFact() === 'floorPlans' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                colorIcon={'primary400'}
                backIcon="primary100 mr-1"
                onClick={() => history.push(`/${propID}/property/floorPlans`)}
              />
            </div>
            <div className="dis-f mt-2">
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="tour"
                label="3d Tour"
                subtitle={`0 Files`}
                className={`w-perc-100 shadow-1dp mr-1 brdMedium ${getFact() === 'tour' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                colorIcon={'primary400'}
                backIcon="primary100 mr-1"
                onClick={() => history.push(`/${propID}/property/tour`)}
              />

              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="folder"
                label="Docubox"
                subtitle={`${get(formValue, 'documents.length', [])} Files`}
                className={`w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'documents' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                colorIcon={'primary400'}
                backIcon="primary100 mr-1"
                onClick={() => history.push(`/${propID}/property/documents`)}
              />
            </div>
          </div>
        </div>
        {
          getFact() !== 'property' && (
            <div className={`levesWrapper w-perc-100 ${openCloseColumn() === 'opened' ? 'ml-md-1 closed': 'opened'}`} style={{ height: windowDimensions.height - calcHeaderHeight() }}>
              <Route path="/:propId?/property/facts" component={Facts} />
              <Route path="/:propId?/property/photos" component={Photos} />
              <Route path="/:propId?/property/floorPlans" component={Plans} />
              <Route path="/:propId?/property/tour" exact component={Tour} />
              <Route path="/:propId?/property/documents" exact component={Documents} />
            </div>
          )
        }
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
