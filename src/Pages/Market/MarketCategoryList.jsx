/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonSecondary, BrixelButtonPrimary, MultiFileldsReduxForm, reset, initializeForm,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

const MarketList = (props) => {
  // PROPS
  const {
    windowDimensions,
  } = props;

  return (
    <>
      <div className="dis-fl-row s-c jc-b property-category mb-4">
        <BrixelButtonSecondary
          onClick={() => ''}
          label="All (Open Map Test)"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => ''}
          label="Your properties"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => ''}
          label="Last viewed"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => ''}
          label="Your favorites"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => ''}
          label="New in your radar"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => ''}
          label="Premium properties"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => ''}
          label="Pre-Market properties"
          rounded
          ghost
          theme="dark"
          className="as-fs"
        />
      </div>

      <div className="mb-4">
        <h2>All</h2>
      </div>

      <div className="mb-4">
        <h2>Your properties</h2>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        <h2>Last viewed</h2>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        <h2>Your favorites</h2>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        <h2>New in your radar</h2>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        <h2>Premium properties</h2>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        <h2>Pre-Market properties</h2>
        <div className="bgPrimary400 h-fix-400" />
      </div>

    </>
  );
};

MarketList.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
};

MarketList.defaultProps = {
  activeProperty: null,
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
