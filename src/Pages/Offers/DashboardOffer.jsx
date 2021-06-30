import React, { lazy, Suspense } from 'react';
import Loading from '../../components/Loading';

const ProtectedRoute = lazy(() => import('../../components/ProtectedRoute'));

const OffersList = lazy(() => import('./OffersList'));

const OfferDetail = lazy(() => import('./OfferDetail'));

const DashboardOffer = () => (
  <Suspense fallback={<Loading isLoading />}>
    <ProtectedRoute exact path="/:propId?/deals/offers" component={OffersList} />
    <ProtectedRoute exact path="/:propId?/deals/offers/:dealID" component={OfferDetail} />
  </Suspense>
);

export default DashboardOffer;
