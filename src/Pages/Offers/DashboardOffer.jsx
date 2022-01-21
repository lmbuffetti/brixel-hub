import React, { Suspense, useEffect } from 'react';
import { bindActionCreators, compose } from 'redux'; import {
  Routes, Route, Navigate, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import lazyWithRetry from '../../components/LazyWithRetry';
import Loading from '../../components/Loading';
import { getOfferListings, setActiveSingleDeal } from '../../actions/DealActions';

const OffersList = lazyWithRetry(() => import('./OffersList'));

const OfferDetail = lazyWithRetry(() => import('./OfferDetail'));

const DashboardOffer = (props) => {
  const {
    activeSingleProperty,
    handleGetOfferListings,
  } = props;
  const match = useParams();
  // URL PARAMS
  const propID = get(match, 'propID', null);

  useEffect(() => {
    const data = {
      id: activeSingleProperty.id,
    };
    if (activeSingleProperty.id) handleGetOfferListings(data);
  }, [activeSingleProperty]);

  return (
    <Suspense fallback={<Loading isLoading />}>
      <Routes>
        <Route path="/" element={<OffersList />} />
        <Route path="/:dealID" element={<OfferDetail />} />
        <Route path="*" element={<Navigate to={`/${propID}/closing`} />} />
      </Routes>
    </Suspense>
  );
};

DashboardOffer.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleGetOfferListings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetOfferListings: bindActionCreators(getOfferListings, dispatch),
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardOffer);
