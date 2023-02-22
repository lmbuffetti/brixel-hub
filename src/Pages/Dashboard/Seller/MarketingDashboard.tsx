import React, {Suspense, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import translateTo from '../../../utils/translation';
import get from 'lodash/get';
import {compose} from 'redux';
import {connect} from 'react-redux';
import last from 'lodash/last';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';
import type {MarketingDashboardType} from '../../../@types/Pages/Dashboard/Seller/MarketingDashboard';

const Page = lazyWithRetry(() => import('../../Marketing/Page'));

const Portals = lazyWithRetry(() => import('../../Marketing/Portals'));

const MarketingDashboard = (props: MarketingDashboardType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    lang,
  } = props;
  // useState
  const [isReady, setIsReady] = useState(false);
  // URL PARAMS
  const propID = get(match, 'propID', null);
  const getFact = () => last(history.location.pathname.split('/'));

  setTimeout(() => {setIsReady(true)}, 300);

  return (
    <>
      {
        isReady ? (
          <div className="listings-container dis-f jc-fs h-perc-lg-100 a-t" id="listingsDashaboard">
            <div className="w-perc-100">
              <h3 className="mb-3 hide dis-b-lg">{translateTo('Marketing', lang)}</h3>
              <div className="dis-f a-t flex-wrap max-w-fix-1280">
                <div className="pr-md-1 w-perc-100 w-perc-md-50">
                  <Page />
                </div>
                <div className="mt-2 mt-md-0 pl-md-1 w-perc-100 w-perc-md-50">
                  <Portals />
                </div>
              </div>
            </div>
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
        ) : (
          <div className="listings-container h-perc-lg-100">
            <div className="max-w-fix-1280 h-perc-100">
              <p className="h-fix-24 hide dis-fl-row-lg h-fix-lg-40 mb-3 skeletonBg w-perc-15"> </p>
              <div className="dis-fl-col dis-fl-row-lg">
                <div className='w-perc-100 w-perc-lg-50 brdRadius skeletonBg mr-0 mr-lg-1 h-fix-304' />
                <div className='w-perc-100 w-perc-lg-50 mt-2 mt-lg-0 brdRadius skeletonBg ml-0 ml-lg-1 h-fix-304' />
              </div>
              <div className="dis-fl-col dis-fl-row-lg mt-2">
                <div className='w-perc-100 w-perc-lg-50 brdRadius mr-0 mr-lg-1 h-fix-304' />
                <div className='w-perc-100 w-perc-lg-50 mt-2 mt-lg-0 brdRadius skeletonBg ml-0 ml-lg-1 h-fix-304' />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(MarketingDashboard);
