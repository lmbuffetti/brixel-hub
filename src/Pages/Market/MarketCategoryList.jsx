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
import Loadable from 'react-loadable';

const CarouselWrapper = Loadable({
  loader: () => import('../../components/CarouselWrapper' /* webpackChunkName: "CarouselWrapper" */),
  loading: () => null,
});

const MarketList = (props) => {
  // PROPS
  const {
    windowDimensions, match, history,
    sellerMarketPropertiesExample,
  } = props;

  return (
    <>
      <div className="dis-fl-row s-c jc-b property-category mb-4">
        <BrixelButtonSecondary
          onClick={() => history.push(`${match.url}/all`)}
          label="All (Open Map Test)"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => history.push(`${match.url}/own`)}
          label="Your properties"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => history.push(`${match.url}/lastViewed`)}
          label="Last viewed"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => history.push(`${match.url}/favorites`)}
          label="Your favorites"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => history.push(`${match.url}/radar`)}
          label="New in your radar"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => history.push(`${match.url}/premium`)}
          label="Premium properties"
          rounded
          ghost
          theme="dark"
          className="as-fs mr-2"
        />
        <BrixelButtonSecondary
          onClick={() => history.push(`${match.url}/preMarket`)}
          label="Pre-Market properties"
          rounded
          ghost
          theme="dark"
          className="as-fs"
        />
      </div>

      <div className="mb-4">
        <h2>All</h2>
        {
          sellerMarketPropertiesExample.length > 0 && (
            <CarouselWrapper
              items={sellerMarketPropertiesExample}
            />
          )
        }
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
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sellerMarketPropertiesExample: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MarketList.defaultProps = {
};

const mapStateToProps = (state) => ({
  // As an example for now. Later we should get a sample for every category
  sellerMarketPropertiesExample: get(state, 'market.sellerProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
