/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, lazy, Suspense } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';

const OfferDetail = lazy(() => import('../../Offers/OfferDetail'));

const DealsDashboardBuyer = (props) => {
  const history = useNavigate();
  // PROPS
  const {
    activeSingleDeal,
    match,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propID', null);
  const getFact = () => last(history.location.pathname.split('/'));
  const link = get(history, 'location.pathname', '').split('/');

  useEffect(() => {
    if ((link[link.length - 1] === 'closing' || !link[link.length - 1]) && activeSingleDeal.id) {
      history.push(`/buyer/${propID}/closing/${activeSingleDeal.id}`);
    }
  }, [activeSingleDeal.id]);

  return (
    <div className="secondLevel">
      <div className="pt-3">
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
                <Route path="/buyer/:propID/closing/:dealID" component={() => <OfferDetail isBuyer />} />
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
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(DealsDashboardBuyer);
