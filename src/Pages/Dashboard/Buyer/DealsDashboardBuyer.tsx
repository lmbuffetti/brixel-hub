import React, {Suspense, useEffect} from 'react';
import {Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';
import lazyWithRetry from '../../../components/LazyWithRetry';
import type {DealsDashboardBuyerType} from '../../../@types/Pages/Dashboard/Buyer/DealsDashboardBuyer';

const OfferDetail = lazyWithRetry(() => import('../../Closing/Offers/OfferDetail'));

const DealsDashboardBuyer = (props: DealsDashboardBuyerType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleDeal,
  } = props;
  // URL PARAMS
  const propID = get(match, 'propID', null);
  const getFact = () => last(history.location.pathname.split('/')) || '';
  const link = get(history, 'location.pathname', '').split('/');

  useEffect(() => {
    if ((link[link.length - 1] === 'closing' || !link[link.length - 1] || link[link.length - 1] === 'undefined') && activeSingleDeal.id) {
      history.push(`/buyer/${propID}/closing/${activeSingleDeal.id}`);
    }
  }, [activeSingleDeal.id]);
  console.log('eh', getFact());
  return (
    <div className={`${get(history, 'location.pathname', '').includes('closing/') ? '' : 'secondLevel'}`}>
      <div>
        {
          (link[link.length - 1] === 'deal' || !link[link.length - 1]) && (
            <OfferDetail isBuyer />
          )
        }
        {
          (
            getFact() && getFact().length > 20
          )
            ? (
              <Suspense fallback="">
                <Routes>
                  <Route path="/:dealID" element={<OfferDetail isBuyer />} />
                </Routes>
              </Suspense>
            ) : (
              <div />
            )
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(DealsDashboardBuyer);
