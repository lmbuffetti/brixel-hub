/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, Fragment,
} from 'react';
import {
  withRouter, Link, Route,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  bindActionCreators, compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  change, OfferListings,
} from '@brixel/brixel-components';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import { getOfferListings } from '../../actions/DealActions';

// COMPONENTS
const OfferList = (props) => {
  const {
    activeSingleProperty,
    handleGetOfferListings,
    history,
  } = props;

  useEffect(() => {
    console.log(activeSingleProperty);
    const data = {
      id: activeSingleProperty.id,
    };
    if (activeSingleProperty.id) handleGetOfferListings(data);
  }, [activeSingleProperty]);

  const data = [];

  return (
    <>
      <OfferListings
        data={data}
        activeSingleProperty={activeSingleProperty}
        getConfigEnv={getConfigEnv}
        onChangeLocation={(url) => history.push(url)}
      />
    </>
  );
};

OfferList.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleGetOfferListings: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

OfferList.defaultProps = {};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetOfferListings: bindActionCreators(getOfferListings, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OfferList);
