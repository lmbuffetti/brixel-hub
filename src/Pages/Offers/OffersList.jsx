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

// COMPONENTS
const OfferList = (props) => {
  const {
    activeSingleProperty,
    history,
  } = props;

  const data = [{
    id: '1',
    name: 'Anton Faguzi',
    amount: 1000000,
    date: new Date(),
    status: 'declined',
  },
  {
    id: '2',
    name: 'Michael Wiedemann',
    amount: 1000001,
    date: new Date(),
    status: 'pending',
  }];

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
  history: PropTypes.object.isRequired,
};

OfferList.defaultProps = {};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OfferList);
