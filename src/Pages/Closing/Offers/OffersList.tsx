import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import getConfigEnv from '@brixel-io/brixel-components/dist/configuration/Settings';
import OfferListings from '../../../components/OfferListings';
import {getOfferListings, setActiveSingleDeal} from '../../../actions/DealActions';
import type {OfferListType} from '../../../@types/Pages/Closing/Offers/OffersList';

// COMPONENTS
const OfferList = (props: OfferListType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    handleSetActiveSingleDeal,
    offerListings,
  } = props;

  const onClickOffer = (url) => {
    if (url.includes('sample')) {
      handleSetActiveSingleDeal(offerListings[0]);
    }
    history.push(url);
  };

  return (
    <>
      <OfferListings
        data={offerListings}
        activeSingleProperty={activeSingleProperty}
        getConfigEnv={getConfigEnv}
        onChangeLocation={(url) => onClickOffer(url)}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  offerListings: get(state, 'deal.offerListings', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetOfferListings: bindActionCreators(getOfferListings, dispatch),
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(OfferList);
