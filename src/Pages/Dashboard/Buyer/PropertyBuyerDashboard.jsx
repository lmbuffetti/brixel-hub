/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonBox,
  BrixelButtonIcon,
} from '@brixel/brixel-components';
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

const Photos = Loadable({
  loader: () => import('../../EditProperty/Media/Photos' /* webpackChunkName: "Photos" */),
  loading: LoadingSimple,
});

const Plans = Loadable({
  loader: () => import('../../EditProperty/Media/Plans' /* webpackChunkName: "Plans" */),
  loading: LoadingSimple,
});

const Tour = Loadable({
  loader: () => import('../../EditProperty/Media/Tour' /* webpackChunkName: "Tour" */),
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
      <div className="property-container dis-f jc-c h-perc-md-100 pos-r a-t" id="propertyDashboard">
        <Sticker>
          <div className={`firstLevel bgLight100 expandableColumn ${openCloseColumn() === 'opened' ? 'mr-md-2' : 'collapsed'}`}>

            <div className="dis-f mt-2">
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
                onClick={() => history.push(`/buyer/property/${propID}/page`)}
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
                onClick={() => history.push(`/buyer/property/${propID}/documents`)}
              />
            </div>

          </div>
        </Sticker>
        <div className={`backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}`}>
          <BrixelButtonIcon
            background="white"
            saturation={0}
            color="primary"
            saturationTxt={400}
            icon="arrow-simple-left"
            noBorder
            className="shadow-2dp"
            onClick={() => history.push('../page')}
          />
        </div>
        {
          getFact() !== 'property' && (
            <div className={`levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-md-1 closed' : 'opened'}`}>
              <Route path="/buyer/property/:propId/page" component={PageBuyer} />
              <Route path="/buyer/property/:propId/documents" exact component={Documents} />
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
