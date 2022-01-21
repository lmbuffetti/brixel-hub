/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Suspense } from 'react';
import {
  Routes, Route, useLocation, useNavigate, useParams, Navigate,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox, BrixelProgressBar } from '@brixel/brixel-components';
import get from 'lodash/get';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';
import Sticker from 'react-stickyfill';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';

const Showings = lazyWithRetry(() => import('../../Marketing/Showings'));

const Page = lazyWithRetry(() => import('../../Marketing/Page'));

const Portals = lazyWithRetry(() => import('../../Marketing/Portals'));

const MarketingDashboard = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    formValue,
    windowDimensions,
  } = props;
  // URL PARAMS
  const propID = get(match, 'propID', null);
  const getFact = () => last(history.location.pathname.split('/'));

  // ON DESKTOP REDIREECT TO /LISTINGS/PAGE
  useEffect(() => {
    if (windowDimensions && windowDimensions.width > 1024 && getFact() === 'marketing') {
      history.push({ pathname: `/${propID}/marketing/page` });
    }
  }, [windowDimensions, getFact()]);

  // CHECK THE STATUS OF PROPERTY
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

  // CHECK IF PORTALS IS ONLINE
  const checkPortalsOnline = () => {
    let isOnline = false;
    const portals = get(formValue, 'portals', {});
    const customPortals = get(formValue, 'customPortals', {});
    Object.keys(portals).map((key) => {
      if (portals[key] && get(customPortals, `${key}`, true) && !isOnline && !key.includes('Url')) isOnline = true;
      return null;
    });
    Object.keys(customPortals).map((key) => {
      if (customPortals[key] && !isOnline && !key.includes('Url')) isOnline = true;
      return null;
    });
    return isOnline;
  };
  // CHECK STATUS PORTALS
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

  // CLASS FOR OPEN/CLOSE COLUMNS
  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('showings') && getFact() !== 'showings')
    ) {
      return 'closed';
    }
    return 'opened';
  };

  // COLORS OF STATUS PAGE AND PORTALS
  const statusPortalsColor = statusPortals().colorIcon.charAt(0).toUpperCase() + statusPortals().colorIcon.slice(1);
  const statusPageColor = statusPage().colorIcon.charAt(0).toUpperCase() + statusPage().colorIcon.slice(1);

  return (
    <div className="listings-container dis-f jc-fs h-perc-lg-100 a-t" id="listingsDashaboard">
      <Sticker>
        {
          windowDimensions.width <= 1024 && (
            <div className={`firstLevel mr-lg-2 expandableColumn ${openCloseColumn() === 'opened' ? 'mr-lg-2' : 'collapsed'}`}>

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
                  onClick={() => history.push(`/${propID}/marketing/page`)}
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
                  onClick={() => history.push(`/${propID}/marketing/portals`)}
                  status={statusPortals().colorIcon}
                  selected
                />
              </div>

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
          )
        }
      </Sticker>
      {
        getFact() !== 'marketing' && (
          <div className={`levelsWrapper zIndex2 w-perc-100 ${openCloseColumn() === 'opened' ? 'closed' : 'opened'}`}>
            {
              (
                getFact() === 'showings' ||
                getFact() === 'page' ||
                getFact() === 'portals' ||
                isNumber(+getFact())
              )
                ? (
                  <Suspense fallback={<Loading isLoading />}>
                    <Routes>
                      <Route path="/showings" element={<Showings />} />
                      <Route path="/page" element={<Page />} />
                      <Route path="/portals" element={<Portals />} />
                      <Route path="*" element={<Navigate to={`/buyer/${propID}/property/page`} />} />
                    </Routes>
                  </Suspense>
                ) : (
                  <></>
                )
            }

          </div>
        )
      }
    </div>
  );
};

MarketingDashboard.propTypes = {
  formValue: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketingDashboard.defaultProps = {

};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(MarketingDashboard);
