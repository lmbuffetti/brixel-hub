/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Suspense } from 'react';
import {
  Routes, Route, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';
import lazyWithRetry from '../../../components/LazyWithRetry';

const OfferDetail = lazyWithRetry(() => import('../../Offers/OfferDetail'));

const DealsDashboardBuyer = (props) => {
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
  const getFact = () => last(history.location.pathname.split('/'));
  const link = get(history, 'location.pathname', '').split('/');

  useEffect(() => {
    if ((link[link.length - 1] === 'closing' || !link[link.length - 1] || link[link.length - 1] === 'undefined') && activeSingleDeal.id) {
      history.push(`/buyer/${propID}/closing/${activeSingleDeal.id}`);
    }
  }, [activeSingleDeal.id]);

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
            isNumber(+getFact())
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

DealsDashboardBuyer.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(DealsDashboardBuyer);
