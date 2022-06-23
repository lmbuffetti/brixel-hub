/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense } from 'react';
import {
  Routes, Route, useLocation, useNavigate, useParams, Navigate,
} from 'react-router-dom';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import Sticker from 'react-stickyfill';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';

const Page = lazyWithRetry(() => import('../../Marketing/Page'));

const Portals = lazyWithRetry(() => import('../../Marketing/Portals'));

const MarketingDashboard = () => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // URL PARAMS
  const propID = get(match, 'propID', null);
  const getFact = () => last(history.location.pathname.split('/'));

  return (
    <div className="listings-container dis-f jc-fs h-perc-lg-100 a-t" id="listingsDashaboard">
      <Sticker>
        <div className="w-perc-100">
          <h3 className="mb-3 hide dis-b-lg">Marketing</h3>
          <div className="dis-f a-t flex-wrap max-w-fix-1280">
            <div className="pr-md-1 w-perc-100 w-perc-md-50">
              <Page />
            </div>
            <div className="mt-2 mt-md-0 pl-md-1 w-perc-100 w-perc-md-50">
              <Portals />
            </div>
          </div>
        </div>
      </Sticker>
      {
        getFact() !== 'marketing' && (
          <Suspense fallback={<Loading isLoading />}>
            <Routes>
              <Route path="*" element={<Navigate to={`/buyer/${propID}/marketing`} />} />
            </Routes>
          </Suspense>
        )
      }
    </div>
  );
};

MarketingDashboard.propTypes = {
};

MarketingDashboard.defaultProps = {

};

const mapStateToProps = () => ({
});

export default compose(
  connect(mapStateToProps, null),
)(MarketingDashboard);
