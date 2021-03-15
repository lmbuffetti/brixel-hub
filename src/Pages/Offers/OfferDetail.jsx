import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import AddNewOffer from './AddNewOffer';
import ReviewOffer from './ReviewOffer';
import { setSplashType } from '../../actions/CommonActions';
import BrixelClosingTree from '../../components/BrixelClosingTree';

const OfferDetail = (props) => {
  const {
    isBuyer,
  } = props;

  return (
    <>
      <div className="single-offer-container dis-fl-col py-4 px-2">
        <BrixelButtonIcon
          icon="arrow-left-small"
          theme="dark"
          ghost
          bgTransparent
          className="mb-3"
          onClick={() => history.push(`/${activeSingleProperty.id}/property/offers/list`)}
        />
        <h3 className="mb-1">Michael Wiedemann</h3>
        <div className="offer-info dis-fl-row a-c mb-5">
          <span className="mr-3">michael@brixel.io</span>
          <span>00 123456789</span>
        </div>
        <BrixelClosingTree
          isBuyer={isBuyer}
          offer={{}}
        />
      </div>
    </>
  );
};

OfferDetail.propTypes = {
  isBuyer: PropTypes.bool,
  setSplashScreen: PropTypes.func.isRequired,
};

OfferDetail.defaultProps = {
  isBuyer: false,
};

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(OfferDetail);
