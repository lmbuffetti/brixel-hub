/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
// import has from 'lodash/has';
import {
  BrixelButtonBox,
  // FormatValue,
} from '@brixel/brixel-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import Loading from '../../../components/Loading';

const Price = lazy(() => import('../../EditProperty/Price'));

const Facts = lazy(() => import('../../EditProperty/Facts'));

const Photos = lazy(() => import('../../EditProperty/Media/Photos'));

const Plans = lazy(() => import('../../EditProperty/Media/Plans'));

const Tour = lazy(() => import('../../EditProperty/Media/Tour'));

const HomeDashboard = (props) => {
  // PROPS
  const {
    formValue,
    history,
    // loggedInUser,
    match,
    // property,
    windowDimensions,
  } = props;
  // STATE
  // const [userType, setUserType] = useState();
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

  // ON DESKTOP REDIREECT TO /LISTINGS/PAGE
  useEffect(() => {
    if (windowDimensions && windowDimensions.width > 1024 && getFact() === 'property') {
      history.push({ pathname: `/${propID}/property/price` });
    }
  }, [windowDimensions, getFact()]);

  // CLASS FOR OPEN/CLOSE COLUMNS
  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('facts') && getFact() !== 'facts') ||
      ((history.location.pathname.includes('edit')) && !(history.location.pathname.includes('editDocument')))
    ) {
      return 'closed';
    }
    return 'opened';
  };

  // FUNCTION TO CALC NUMBER OF PHOTOS - FLOORPLANS - DOCUMENTS
  const calcLenght = (val) => {
    if (val) return val.length;
    return 0;
  };

  return (
    <>
      <div className="property-container dis-f jc-fs h-perc-lg-100 pos-r a-t" id="propertyDashboard">
        <div className="flex-1">
          {
            windowDimensions.width <= 1024 && (
              <div className={`firstLevel expandableColumn ${openCloseColumn() === 'opened' ? 'mr-lg-2' : 'collapsed'}`}>
                {/* <div
                  className={`cur-poi showHover brdRadius shadow-1dp brdMedium ${getFact() === 'facts' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                  onClick={() => history.push(`/${propID}/property/facts`)}
                >
                  <div className="transparency-container">
                    <div className="dis-fl-col ta-l cur-poi">
                      <>
                        <BrixelButtonBox
                          bgTransparent
                          icon="document"
                          label="Facts"
                          labelClass="fweight-400"
                          subtitle={`<span>${get(formValue, 'inputSheet.totalComplete', 0)}%</span>&nbsp;<span>complete</span>`}
                          subtitleClass="ff-mono fsize-200 txtPrimary700 mt-small-4"
                          className="w-perc-100 cur-poi p-2 labelAend"
                          colorIcon="primary700"
                          backIcon="primary100"
                          hoverEffect={false}
                        />
                      </>
                    </div>
                  </div>

                  <div className="details dis-fl-col p-2">
                    <div className="dis-fl-row jc-b a-c">
                      <div className="fourth dis-fl-col ta-l">
                        <span className="subtitle fsize-200 txtDark200">Rooms</span>
                        <span className="value ff-mono txtDark400">{has(property, 'properties.typology.bedrooms') ? FormatValue.formatRooms(property.properties.typology.bedrooms, get(formValue, 'location.countryCode', 'CH')) : 'N/A'}</span>
                      </div>
                      <div className="dis-fl-col ta-l">
                        <span className="subtitle fsize-200 txtDark200">Living space</span>
                        {
                          get(property, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0 ? (
                            <span className="value ff-mono txtDark400">{get(property, 'properties.typology.grossArea.value', 'N/A')} m2</span>
                          ) : (
                            <span className="value ff-mono txtDark400">{get(property, 'properties.typology.livingArea.value', 'N/A')} m2</span>
                          )
                        }
                      </div>
                      <div className="dis-fl-col ta-l">
                        <span className="subtitle fsize-200 txtDark200">Year built</span>
                        <span className="value ff-mono txtDark400">{(has(property.properties, 'building') && property.properties.building.built) ? property.properties.building.built : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="dis-f mt-2">
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="calculator"
                    label="Price"
                    labelClass="fweight-400"
                    subtitle="On request"
                    subtitleClass="fsize-200 pt-small-6 txtDark200"
                    className="w-perc-100 mr-1 shadow-1dp brdMedium brdTrans p-2"
                    colorIcon="primary700"
                    backIcon="primary100 "
                    onClick={() => history.push(`/${propID}/property/price`)}
                  />
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="document"
                    label="Facts"
                    labelClass="fweight-400"
                    subtitle={`<span>${get(formValue, 'inputSheet.totalComplete', 0)}%</span>&nbsp;<span>complete</span>`}
                    subtitleClass="fsize-200 pt-small-6 txtPrimary700"
                    className="w-perc-100 ml-1 shadow-1dp brdMedium brdTrans p-2"
                    colorIcon="primary700"
                    backIcon="primary100"
                    onClick={() => history.push(`/${propID}/property/facts`)}
                    selected
                  />
                </div>
                <div className="dis-f mt-2">
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="gallery"
                    label="Photos"
                    labelClass="fweight-400"
                    subtitle={`<span>${calcLenght(get(formValue, 'photos', []))}</span>&nbsp;<span>${calcLenght(get(formValue, 'photos', [])) !== 1 ? 'Files' : 'File'}</span>`}
                    subtitleClass={`fsize-200 pt-small-6 ${calcLenght(get(formValue, 'photos', [])) >= 1 ? 'txtPrimary700' : 'txtDark200'}`}
                    className={`w-perc-100 mr-1 shadow-1dp brdMedium ${getFact() === 'photos' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                    colorIcon="primary700"
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
                    subtitle={`<span>${calcLenght(get(formValue, 'floorPlans', []))}</span>&nbsp;<span>${calcLenght(get(formValue, 'floorPlans', [])) !== 1 ? 'Files' : 'File'}</span>`}
                    subtitleClass={`fsize-200 pt-small-6 ${calcLenght(get(formValue, 'floorPlans', [])) >= 1 ? 'txtPrimary700' : 'txtDark200'}`}
                    className={`w-perc-100 ml-1 shadow-1dp brdMedium ${getFact() === 'floorPlans' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                    colorIcon="primary700"
                    backIcon="primary100 "
                    onClick={() => history.push(`/${propID}/property/floorPlans`)}
                  />
                </div>
                <div className="dis-f mt-2">
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="tour"
                    label="3D tour"
                    labelClass="fweight-400 pb-small-6"
                    subtitle={get(formValue, 'virtual.matterport', null) ? 'Available' : 'Not set'}
                    subtitleClass={`fsize-200 txt${get(formValue, 'virtual.matterport', null) ? 'Green' : 'Red'}400`}
                    className={`w-perc-100 shadow-1dp mr-1 brdMedium ${getFact() === 'tour' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                    colorIcon="primary700"
                    backIcon="primary100"
                    onClick={() => history.push(`/${propID}/property/tour`)}
                    status={get(formValue, 'virtual.matterport', null) ? 'green' : 'red'}
                  />
                </div>

              </div>
            )
          }
        </div>
        {/* <div className={`backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}`}>
          <BrixelButtonIcon
            ghost
            icon="arrow-simple-left"
            onClick={() => history.push('../facts')}
          />
        </div> */}
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-lg-1 closed' : 'opened'}`}>
              <Suspense fallback={<Loading isLoading />}>
                <Route path="/:propId?/property/facts" component={Facts} />
                <Route path="/:propId?/property/price" component={Price} />
                <Route path="/:propId?/property/photos" component={Photos} />
                <Route path="/:propId?/property/floorPlans" component={Plans} />
                <Route path="/:propId?/property/tour" exact component={Tour} />
              </Suspense>
            </div>
          )
        }
      </div>
    </>
  );
};

HomeDashboard.propTypes = {
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  // loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  // property: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

HomeDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  langConfig: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  // property: get(state, 'property.activeSingleProperty', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(HomeDashboard);
