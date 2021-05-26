/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';
import Loadable from 'react-loadable';

const OfferDetail = Loadable({
  loader: () => import('../../Offers/OfferDetail' /* webpackChunkName: "OfferDetail" */),
  loading: () => null,
});

const DealsDashboardBuyer = (props) => {
  // PROPS
  const {
    activeSingleDeal,
    history,
    match,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propID', null);
  const getFact = () => last(history.location.pathname.split('/'));
  const link = get(history, 'location.pathname', '').split('/');

  useEffect(() => {
    if ((link[link.length - 1] === 'deal' || !link[link.length - 1]) && activeSingleDeal.id) {
      history.push(`/buyer/${propID}/deal/${activeSingleDeal.id}`);
    }
  }, [activeSingleDeal.id]);

  return (
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
            <Route path="/buyer/:propID/deal/:dealID" component={() => <OfferDetail isBuyer />} />
          ) : (
            <div />
          )
      }

    </div>
  );
};

DealsDashboardBuyer.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(DealsDashboardBuyer);
