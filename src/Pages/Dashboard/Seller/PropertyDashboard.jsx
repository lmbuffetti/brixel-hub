/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Routes, Route, useLocation, useNavigate, useParams, Navigate,
} from 'react-router-dom';
import get from 'lodash/get';
// import has from 'lodash/has';
import {
  BrixelButtonBox, translateTo,
  // FormatValue,
} from '@brixel/brixel-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';

const Price = lazyWithRetry(() => import('../../SingleProperty/Price'));

const Facts = lazyWithRetry(() => import('../../SingleProperty/Facts'));

const Photos = lazyWithRetry(() => import('../../SingleProperty/Media/Photos'));

const Plans = lazyWithRetry(() => import('../../SingleProperty/Media/Plans'));

const Tour = lazyWithRetry(() => import('../../SingleProperty/Media/Tour'));

const HomeDashboard = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    formValue,
    lang,
    windowDimensions,
  } = props;
  // STATE
  // const [userType, setUserType] = useState();
  // URL PARAMS
  const propID = get(match, 'propID', null);
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

                <div className="dis-f mt-2">
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="calculator"
                    label={translateTo('Price', lang)}
                    labelClass="fweight-400"
                    subtitle={translateTo('On request', lang)}
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
                    label={translateTo('Facts', lang)}
                    labelClass="fweight-400"
                    subtitle={`<span>${get(formValue, 'inputSheet.totalComplete', 0)}%</span>&nbsp;<span>${translateTo('complete', lang)}</span>`}
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
                    label={translateTo('Photos', lang)}
                    labelClass="fweight-400"
                    subtitle={`<span>${calcLenght(get(formValue, 'photos', []))}</span>&nbsp;<span>${translateTo(calcLenght(get(formValue, 'photos', [])) !== 1 ? 'Files' : 'File', lang)}</span>`}
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
                    label={translateTo('Plans', lang)}
                    labelClass="fweight-400"
                    subtitle={`<span>${calcLenght(get(formValue, 'floorPlans', []))}</span>&nbsp;<span>${translateTo(calcLenght(get(formValue, 'floorPlans', [])) !== 1 ? 'Files' : 'File', lang)}</span>`}
                    subtitleClass={`fsize-200 pt-small-6 ${calcLenght(get(formValue, 'floorPlans', [])) >= 1 ? 'txtPrimary700' : 'txtDark200'}`}
                    className={`w-perc-100 ml-1 shadow-1dp brdMedium ${getFact() === 'floorPlans' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                    colorIcon="primary700"
                    backIcon="primary100 "
                    onClick={() => history.push(`/${propID}/property/floorPlans`)}
                  />
                </div>
                <div className="dis-f mt-2 max-w-perc-50">
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="tour"
                    label={translateTo('3D tour', lang)}
                    labelClass="fweight-400 pb-small-6"
                    subtitle={translateTo(get(formValue, 'virtual.matterport', null) ? 'Available' : 'Not set', lang)}
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
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-lg-1 closed' : 'opened'}`}>
              <Suspense fallback={<Loading isLoading />}>
                <Routes>
                  <Route path="/facts/*" element={<Facts />} />
                  <Route path="/price/*" element={<Price />} />
                  <Route path="/photos/*" element={<Photos />} />
                  <Route path="/floorPlans/*" element={<Plans />} />
                  <Route path="/tour" element={<Tour />} />
                  <Route path="*" element={<Navigate to={`/${propID}/property/facts`} />} />
                </Routes>
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
  lang: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

HomeDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  lang: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(HomeDashboard);
