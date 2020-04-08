/* eslint-disable react-hooks/exhaustive-deps */
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
    if (windowDimensions && windowDimensions.width > 768 && getFact() === 'property') {
      history.push({pathname: `/${propID}/property/facts` });
    }
  }, [windowDimensions, getFact()]);

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

  return (
    <>
      <div className="property-container dis-f h-perc-md-100" id="propertyDashboard">
        <div className={`firstLevel bgLight100 expandableColumn ${openCloseColumn() === 'opened' ? 'mr-md-2' : 'collapsed'}`}>

          <div
            className={`cur-poi showHover brdRadius shadow-1dp brdMedium ${getFact() === 'facts' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
            onClick={() => history.push(`/${propID}/property/facts`)}
          >
            <div className="transparency-container">
              <div className="dis-fl-col ta-l cur-poi">
                {
                  userType === 'seller' && (
                    <>
                      <BrixelButtonBox
                        bgTransparent
                        icon="document"
                        label="Facts"
                        labelClass="fweight-400"
                        subtitle={`<span>${get(formValue, 'inputSheet.totalComplete', 0)}%</span>&nbsp;<span>complete</span>`}
                        subtitleClass={'ff-mono fsize-200 txtPrimary700 mt-small-4'}
                        className="w-perc-100 cur-poi p-2 labelAend"
                        colorIcon={'primary700'}
                        backIcon="primary100"
                        hoverEffect={false}
                      />
                    </>
                  )
                }
              </div>
            </div>

            <div className="details dis-fl-col p-2">
              <div className="dis-fl-row jc-b a-c">
                <div className="fourth dis-fl-col ta-l">
                  <span className="subtitle fsize-200 txtDark200">Rooms</span>
                  <span className="value ff-mono txtDark400">{has(property, 'properties.typology.bedrooms') ? property.properties.typology.bedrooms : 'N/A'}</span>
                </div>
                <div className="dis-fl-col ta-l">
                  <span className="subtitle fsize-200 txtDark200">Living space</span>
                  <span className="value ff-mono txtDark400">{(has(property.properties, 'typology') && property.properties.typology.livingArea) ? property.properties.typology.livingArea.value : 'N/A'} m2</span>
                </div>
                <div className="dis-fl-col ta-l">
                  <span className="subtitle fsize-200 txtDark200">Year built</span>
                  <span className="value ff-mono txtDark400">{(has(property.properties, 'building') && property.properties.building.built) ? property.properties.building.built : 'N/A'}</span>
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
              labelClass="fweight-400"
              subtitle={`<span>${calcLenght(get(formValue, 'photos', []))}</span>&nbsp;<span>${calcLenght(get(formValue, 'photos', [])) > 1 ? 'Files' : 'File'}</span>`}
              subtitleClass={'fsize-200 txtDark200 pt-small-6'}
              className={`w-perc-100 mr-1 shadow-1dp brdMedium ${getFact() === 'photos' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
              colorIcon={'primary700'}
              backIcon="primary100"
              onClick={() => history.push(`/${propID}/property/photos`)}
              selected
            />
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="plans"
              label="Plans"
              labelClass="fweight-400"
              subtitle={`<span>${calcLenght(get(formValue, 'floorPlans', []))}</span>&nbsp;<span>${calcLenght(get(formValue, 'floorPlans', [])) > 1 ? 'Files' : 'File'}</span>`}
              subtitleClass={'fsize-200 txtDark200 pt-small-6'}
              className={`w-perc-100 ml-1 shadow-1dp brdMedium ${getFact() === 'floorPlans' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
              colorIcon={'primary700'}
              backIcon="primary100 "
              onClick={() => history.push(`/${propID}/property/floorPlans`)}
            />
          </div>
          <div className="dis-f mt-2">
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="tour"
              label="3D Tour"
              labelClass="fweight-400 pb-small-6"
              subtitle={get(formValue, 'virtual.matterport', null) ? 'Available' : 'Not set'}
              subtitleClass={'fsize-200 txtDark200'}
              className={`w-perc-100 shadow-1dp mr-1 brdMedium ${getFact() === 'tour' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
              colorIcon={'primary700'}
              backIcon="primary100"
              onClick={() => history.push(`/${propID}/property/tour`)}
              status={get(formValue, 'virtual.matterport', null) ? 'green' : 'red'}
            />

            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="folder"
              label="Docubox"
              labelClass="fweight-400"
              subtitle={`<span>${calcLenght(get(formValue, 'documents', []))}</span>&nbsp;<span>${calcLenght(get(formValue, 'documents', [])) > 1 ? 'Files' : 'File'}</span>`}
              subtitleClass={'fsize-200 txtDark200 pt-small-6'}
              className={`w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'documents' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
              colorIcon={'primary400'}
              backIcon="primary100"
              onClick={() => history.push(`/${propID}/property/documents`)}
            />
          </div>

        </div>
        <div className={`backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}`}>
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
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-md-1 closed': 'opened'}`}>
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
