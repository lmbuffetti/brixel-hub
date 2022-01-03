import React, { lazy, Suspense, useEffect } from 'react';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Loading from '../../components/Loading';
import { getOfferListings, setActiveSingleDeal } from '../../actions/DealActions';

const ProtectedRoute = lazy(() => import('../../components/ProtectedRoute'));

const OffersList = lazy(() => import('./OffersList'));

const OfferDetail = lazy(() => import('./OfferDetail'));

const DashboardOffer = (props) => {
  const {
    activeSingleProperty,
    handleGetOfferListings,
  } = props;

  useEffect(() => {
    const data = {
      id: activeSingleProperty.id,
    };
    if (activeSingleProperty.id) handleGetOfferListings(data);
  }, [activeSingleProperty]);

  return (
    <Suspense fallback={<Loading isLoading />}>
      <ProtectedRoute path="/" element={<OffersList />} />
      <ProtectedRoute path="/:dealID" element={<OfferDetail />} />
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
