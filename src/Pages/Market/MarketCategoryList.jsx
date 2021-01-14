/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonSecondary,
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
    windowDimensions, match, history, favoritesMarketProperties,
    sellerMarketPropertiesExample,
  } = props;

  return (
    <>
      <div className="mb-6 mt-7">
        {
          sellerMarketPropertiesExample.length > 0 && (
            <CarouselWrapper
              title="Your properties"
              className="market-category-carousel"
              type="own"
              items={sellerMarketPropertiesExample}
            />
          )
        }
      </div>

      <div className="dis-fl-col mb-6">
        <div className="dis-fl-row a-c jc-b mb-4">
          <div className="dis-fl-col">
            <h3>Discover our market</h3>
            <span>There are 251 properties that match your criteria</span>
          </div>
          <div className="brdRadius shadow-1dp">
            <span>search profile</span>
          </div>
        </div>
        <div className="dis-fl-row a-c jc-b property-category">
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/all`)}
            label="All"
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
      </div>

      <div className="mb-4">
        <h3>Last viewed</h3>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        {
          favoritesMarketProperties.length > 0 && (
            <CarouselWrapper
              title="Your favorites"
              className="market-category-carousel"
              type="favorite"
              items={favoritesMarketProperties}
            />
          )
        }
      </div>

      <div className="mb-4">
        <h3>New in your radar</h3>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        <h3>Premium properties</h3>
        <div className="bgPrimary400 h-fix-400" />
      </div>

      <div className="mb-4">
        <h3>Pre-Market properties</h3>
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
  favoritesMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MarketList.defaultProps = {
};

const mapStateToProps = (state) => ({
  // As an example for now. Later we should get a sample for every category
  sellerMarketPropertiesExample: get(state, 'market.sellerProperties', []),
  favoritesMarketProperties: get(state, 'market.favoritesProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
