/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelAvatar,
  BrixelButtonBox,
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import last from 'lodash/last';
import Sticker from 'react-stickyfill';
import LoadingSimple from '../../../components/LoadingSimple';
import Loading from '../../../components/Loading';

const PageBuyer = Loadable({
  loader: () => import('./PageBuyer' /* webpackChunkName: "PageBuyer" */),
  loading: LoadingSimple,
});

const ShowingsBuyer = Loadable({
  loader: () => import('./ShowingsBuyer' /* webpackChunkName: "ShowingsBuyer" */),
  loading: LoadingSimple,
});

const ContactBuyer = Loadable({
  loader: () => import('./ContactBuyer' /* webpackChunkName: "ContactBuyer" */),
  loading: LoadingSimple,
});

const Documents = Loadable({
  loader: () => import('../../EditProperty/Documents' /* webpackChunkName: "Documents" */),
  loading: Loading,
});

const PropertyBuyerDashboard = (props) => {
  // PROPS
  const {
    formValue,
    history,
    // loggedInUser,
    match,
    windowDimensions,
  } = props;
  // STATE
  // const [userType, setUserType] = useState();
  // URL PARAMS
  const propID = get(match, 'params.propID', null);
  const getFact = () => last(history.location.pathname.split('/'));

  // ON DESKTOP REDIREECT TO /LISTINGS/PAGE
  useEffect(() => {
    if (windowDimensions && windowDimensions.width > 1024 && getFact() === propID) {
      history.push({ pathname: `/buyer/property/${propID}/page` });
    }
  }, [windowDimensions, getFact()]);

  // CLASS FOR OPEN/CLOSE COLUMNS
  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('facts') && getFact() !== 'facts') ||
      (history.location.pathname.includes('edit'))
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
        <Sticker>
          <div className={`firstLevel expandableColumn ${openCloseColumn() === 'opened' ? 'mr-lg-2' : 'collapsed'}`}>

            <div className="pl-1 mb-2">
              <div
                className="dis-f p-2 buttonBox"
                onClick={() => history.push(`/buyer/${propID}/property/contact`)}
              >
                <BrixelAvatar
                  baseURL={get(baseByData, 'shortPath', '')}
                  name={get(formValue, 'contacts[0].name', '')}
                  profileId={get(formValue, 'contacts[0].id', '')}
                />
                <div className="ml-2">
                  <h6>{get(formValue, 'contacts[0].name', '')}</h6>
                  {
                    get(formValue, 'contacts[0].company', null) && (
                      <p className="body2 txtDark700">{get(formValue, 'contacts[0].company', '')}</p>
                    )
                  }
                </div>
              </div>
            </div>

            <div className="dis-f min-h-fix-136">
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="copy-link"
                label="Page"
                labelClass="fweight-400"
                subtitle=""
                subtitleClass="fsize-200 pt-small-6"
                className={`w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'page' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                colorIcon="primary700"
                backIcon="primary100"
                onClick={() => history.push(`/buyer/${propID}/property/page`)}
              />

              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="folder"
                label="Docubox"
                labelClass="fweight-400"
                subtitle={`<span>${calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate))}</span>&nbsp;<span>${calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate)) !== 1 ? 'Files' : 'File'}</span>`}
                subtitleClass={`fsize-200 pt-small-6 ${calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate)) >= 1 ? 'txtPrimary700' : 'txtDark200'}`}
                className={`w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'documents' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                colorIcon="primary700"
                backIcon="primary100"
                onClick={() => history.push(`/buyer/${propID}/property/documents`)}
              />
            </div>

            <div className="dis-f mt-1 pr-lg-2 min-h-fix-136">
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="calendar"
                label="Showings"
                labelClass={`fweight-400 ${windowDimensions.width <= 1024 ? 'w-perc-50' : 'w-perc-25'}`}
                subtitle=""
                subtitleClass="fsize-200 pt-small-6"
                className={`w-perc-100 w-perc-lg-50 shadow-1dp ml-1 brdMedium ${getFact() === 'showings' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`}
                colorIcon="primary700"
                backIcon="primary100"
                onClick={() => history.push(`/buyer/${propID}/property/showings`)}
              />

              {
                windowDimensions.width <= 1024 && (
                  <BrixelButtonBox
                    verticalView
                    bgTransparent
                    icon="money"
                    label="Deal"
                    labelClass="fweight-400 w-perc-50"
                    subtitle=""
                    subtitleClass="fsize-200 pt-small-6"
                    className={`w-perc-100 min-h-fix-136 shadow-1dp brdMedium ${getFact() === 'deals' ? 'brdPrimary400 bgWhite' : 'brdTrans'} ml-1 p-2`}
                    colorIcon="primary700"
                    backIcon="primary100"
                    onClick={() => history.push(`/buyer/${propID}/deal`)}
                  />
                )
              }

            </div>

          </div>
        </Sticker>
        <div className={`backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}`}>
          <BrixelButtonIcon
            ghost
            icon="arrow-simple-left"
            onClick={() => history.push('../page')}
          />
        </div>
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-lg-1 closed' : 'opened'}`}>
              <Route path="/buyer/:propId/property/page" component={PageBuyer} />
              <Route path="/buyer/:propId/property/documents" exact component={Documents} />
              <Route path="/buyer/:propId/property/contact" component={ContactBuyer} />
              <Route path="/buyer/:propId/property/showings" component={ShowingsBuyer} />
            </div>
          )
        }
      </div>
    </>
  );
};

PropertyBuyerDashboard.propTypes = {
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

PropertyBuyerDashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
  formValue: get(state, 'property.activeSingleProperty', {}),
  langConfig: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(PropertyBuyerDashboard);
