/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox, BrixelButtonIcon, BrixelProgressBar } from '@brixel/brixel-components';
import get from 'lodash/get';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';
import Loadable from 'react-loadable';
import Sticker from 'react-stickyfill';
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

  useEffect(() => {
    if (windowDimensions && windowDimensions.width > 1024 && getFact() === 'listings') {
      history.push({ pathname: `/${propID}/listings/page` });
    }
  }, [windowDimensions, getFact()]);

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
    };
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
    };
  };

  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('showings') && getFact() !== 'showings')
    ) {
      return 'closed';
    }
    return 'opened';
  };

  const statusPortalsColor = statusPortals().colorIcon.charAt(0).toUpperCase() + statusPortals().colorIcon.slice(1);
  const statusPageColor = statusPage().colorIcon.charAt(0).toUpperCase() + statusPage().colorIcon.slice(1);

  return (
    <div className="listings-container dis-f jc-c h-perc-md-100 a-t" id="listingsDashaboard">
      <Sticker>
        <div className={`firstLevel mr-md-2 expandableColumn ${openCloseColumn() === 'opened' ? 'mr-md-2' : 'collapsed'}`}>

          <div className="dis-f">
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="gallery"
              label="Brixel Page"
              labelClass="fweight-400 pb-small-6"
              subtitle={statusPage().label}
              subtitleClass={`fsize-200 txt${statusPageColor}400`}
              className={`w-perc-100 max-w-perc-50 mr-1 shadow-1dp brdMedium p-2 ${getFact() === 'page' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
              colorIcon="primary700"
              backIcon="primary100"
              onClick={() => history.push(`/${propID}/listings/page`)}
              status={statusPage().colorIcon}
            />
            <BrixelButtonBox
              verticalView
              bgTransparent
              icon="photo-list"
              label="Portals"
              labelClass="fweight-400 pb-small-6"
              subtitle={statusPortals().label}
              subtitleClass={`fsize-200 txt${statusPortalsColor}400`}
              className={`w-perc-100 max-w-perc-50 ml-1 shadow-1dp brdMedium p-2 ${getFact() === 'portals' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
              colorIcon="primary700"
              backIcon="primary100"
              onClick={() => history.push(`/${propID}/listings/portals`)}
              status={statusPortals().colorIcon}
              selected
            />
          </div>
          {/* <div className="mt-2">
          <BrixelButtonBox
            bgTransparent
            icon="gallery"
            label="Showings"
            labelClass="fweight-400 pb-small-6"
            subtitle={`No showings`}
            subtitleClass={'fsize-200 txtDark200'}
            className={`w-perc-100 shadow-1dp brdMedium p-2 ${getFact() === 'showings' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
            colorIcon="primary700"
            backIcon="primary100"
            onClick={() => history.push(`/${propID}/listings/showings`)}
            selected
          />
        </div> */}
          <div className="brdRadius shadow-1dp brdPrimary400 mt-1 hide">
            <div className="transparency-container">
              <div className="dis-fl-col ta-l">
                <BrixelButtonBox
                  bgTransparent
                  icon="users"
                  label="Buyers"
                  className="w-perc-100"
                  colorIcon="primary700"
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
          onClick={() => history.push(`${propID}/listings/showings`)}
        />
      </div>
      {
        getFact() !== 'listings' && (
          <div className={`levelsWrapper zIndex2 w-perc-100 ${openCloseColumn() === 'opened' ? 'ml-md-1 closed' : 'opened'}`}>
            {
              (
                getFact() === 'showings' ||
                getFact() === 'page' ||
                getFact() === 'portals' ||
                isNumber(+getFact())
              )
                ? (
                  <>
                    <Route path="/:propId/listings/showings" component={Showings} />
                    <Route path="/:propId/listings/page" exact component={Page} />
                    <Route path="/:propId/listings/portals" exact component={Portals} />
                  </>
                ) : (
                  <Redirect from="/:propId/listings/*" to={`/${propID}/listings/page`} />
                )
            }

          </div>
        )
      }
    </div>
  );
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
