import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

const ProtectedRoute = Loadable({
  loader: () => import('../../components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: () => null,
});

const OffersList = Loadable({
  loader: () => import('./OffersList' /* webpackChunkName: "OffersList" */),
  loading: Loading,
});

const OfferDetail = Loadable({
  loader: () => import('./OfferDetail' /* webpackChunkName: "OfferDetail" */),
  loading: Loading,
});

const DashboardOffer = (props) => (
  <>
    <ProtectedRoute exact path="/:propId?/offers" component={OffersList} />
    <ProtectedRoute exact path="/:propId?/offers/:offerID" component={OfferDetail} />
  </>
);

export default DashboardOffer;
