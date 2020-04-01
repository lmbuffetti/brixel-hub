import React, { useEffect } from 'react';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox, BrixelButtonIcon, BrixelProgressBar } from '@brixel/brixel-components';
import get from 'lodash/get';
import last from 'lodash/last';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

const Showings = Loadable({
  loader: () => import('../Listings/Showings' /* webpackChunkName: "Showings" */),
  loading: Loading,
});

const Page = Loadable({
  loader: () => import('../Listings/Page' /* webpackChunkName: "Page" */),
  loading: Loading,
});

const Portals = Loadable({
  loader: () => import('../Listings/Portals' /* webpackChunkName: "Portals" */),
  loading: Loading,
});

const ListingsDashboard = (props) => {
  // PROPS
  const {
    formValue,
    history,
    match,
    windowDimensions,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('hubDasHeader');
    const wrapper = document.getElementById('dashboard');
    let paddingTop = 0;
    let paddingBottom = 0;
    if (wrapper) {
      paddingTop = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-top').replace('px', '');
      paddingBottom = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-bottom').replace('px', '');
    }
    const heightContent = head[0] ? head[0].offsetHeight : 0;
    return heightContent + +paddingTop + +paddingBottom;
  };

  const statusPage = () => {
    let label;
    let colorIcon;
    if (formValue.publishReview) {
      label = 'Review';
      colorIcon = 'yellow';
    } else if (formValue.published) {
      label = 'Published';
      colorIcon = 'green';
    } else {
      label = 'Offline';
      colorIcon = 'red';
    }
    return {
      label,
      colorIcon,
    }
  };

  const checkPortalsOnline = () => {
    let isOnline = false;
    const portals = get(formValue, 'portals', {});
    Object.keys(portals).map((key) => {
      if (portals[key]) isOnline = true;
      return null;
    });
    return isOnline;
  };

  const statusPortals = () => {
    let label;
    let colorIcon;
    if (formValue.portalsReview) {
      label = 'Review';
      colorIcon = 'yellow';
    } else if (checkPortalsOnline()) {
      label = 'Live';
      colorIcon = 'green';
    } else {
      label = 'Unpublished';
      colorIcon = 'red';
    }
    return {
      label,
      colorIcon,
    }
  };

  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('showings') && getFact() !== 'showings')
    ) {
      return 'closed';
    }
    return 'open';
  };

  return (
    <div className="listings-container" id="listingsDashaboard">
      <div className="dis-f h-perc-100">
        <div className={`firstLevel mr-md-2 expandableColumn ${openCloseColumn()}`}>
          <div className={`jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-f' : 'hide'}`}>
            <BrixelButtonIcon
              background="white"
              saturation={0}
              color="primary"
              saturationTxt={400}
              icon="arrow-simple-right"
              noBorder
              className="shadow-2dp"
              onClick={() => history.push(`${propID}/listings/showings`)}
            />
          </div>
          <div className="hideOnExpanded">
            <div className="dis-f">
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="gallery"
                label="Brixel Page"
                subtitle={statusPage().label}
                className={`w-perc-100 mr-1 shadow-1dp brdMedium${getFact() === 'page' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                colorIcon="primary700"
                backIcon="primary100 mr-1"
                onClick={() => history.push(`/${propID}/listings/page`)}
                status={statusPage().colorIcon}
              />
              <BrixelButtonBox
                verticalView
                bgTransparent
                icon="photo-list"
                label="Portals"
                subtitle={statusPortals().label}
                className={`w-perc-100 ml-1 shadow-1dp brdMedium ${getFact() === 'portals' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                colorIcon={'primary700'}
                backIcon="primary100 mr-1"
                onClick={() => history.push(`/${propID}/listings/portals`)}
                status={statusPortals().colorIcon}
                selected
              />
            </div>
            <div>
              <BrixelButtonBox
                bgTransparent
                icon="gallery"
                label="Showings"
                subtitle={`No showings`}
                className={`w-perc-100 mt-1 shadow-1dp brdMedium ${getFact() === 'showings' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                colorIcon={'primary700'}
                backIcon="primary100 mr-1"
                onClick={() => history.push(`/${propID}/listings/showings`)}
                selected
              />
            </div>

            <div className="brdRadius shadow-1dp brdPrimary400 mt-1">
              <div className="transparency-container">
                <div className="dis-fl-col ta-l">
                  <BrixelButtonBox
                    bgTransparent
                    icon="users"
                    label="Buyers"
                    className="w-perc-100"
                    colorIcon={'primary700'}
                    backIcon="primary100 mr-1"
                    hoverEffect={false}
                  />
                </div>
              </div>


              <div className="details dis-fl-col p-1">
                <div className="dis-fl-row jc-b a-c mb-2">
                  <span className="mr-1 body2 w-fix-80">Request</span>
                  <div className="w-fix-304">
                    <BrixelProgressBar
                      progressValue={35}
                      saturation={700}
                    />
                  </div>
                  <span className="ml-1 body2 ff-mono txtPrimary700">12</span>
                </div>

                <div className="dis-fl-row jc-b a-c mb-2">
                  <span className="mr-1 body2 w-fix-80">Showings</span>
                  <div className="w-fix-304">
                    <BrixelProgressBar
                      progressValue={12}
                      saturation={700}
                    />
                  </div>
                  <span className="ml-1 body2 ff-mono txtPrimary700">5</span>
                </div>

                <div className="dis-fl-row jc-b a-c mb-2">
                  <span className="mr-1 body2 w-fix-80">Offers</span>
                  <div className="w-fix-304">
                    <BrixelProgressBar
                      progressValue={60}
                      saturation={700}
                    />
                  </div>
                  <span className="ml-1 body2 ff-mono txtPrimary700">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          getFact() !== 'listings' && (
            <div className="w-perc-100" style={{ height: windowDimensions.height - calcHeaderHeight() }}>
              <Route path="/:propId?/listings/showings" component={Showings} />
              <Route path="/:propId?/listings/page" component={Page} />
              <Route path="/:propId?/listings/portals" component={Portals} />
            </div>
          )
        }
      </div>
    </div>
  )
};

ListingsDashboard.propTypes = {
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

ListingsDashboard.defaultProps = {

};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ListingsDashboard);
