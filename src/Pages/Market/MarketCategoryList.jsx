/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonSecondary, BrixelButtonIcon,
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
    windowDimensions, match, history, favoritesProperties,
    ownerProperties, userSearchProfiles, loggedInUser, ownerEstimations,
    newProperties, premiumProperties, lastViewedProperties, preMarketProperties,
  } = props;

  return (
    <>
      <div className="mb-4">
        {
          ownerProperties.length > 0 && (
            <CarouselWrapper
              title="Your properties"
              className="market-category-carousel"
              type="own"
              items={ownerProperties}
            />
          )
        }
      </div>

      <div className="dis-fl-col mb-6">
        <div className="dis-fl-row a-c jc-b mb-4 flex-wrap">
          <div className="dis-fl-col mb-2">
            <h4 className="fweight-700">Discover our market</h4>
            <p className="fsize-300 pt-1">There are <span className="fweight-500 innerLineHeight">251 properties</span> that match your criteria.</p>
          </div>
          <div className="brdRadius py-1 px-2 shadow-1dp dis-fl-row a-c fweight-500 txtDark500 fsize-300 flex-wrap pos-r">
            <div className="dis-f">
              {
                get(userSearchProfiles[0], 'characteristics.propertyType', []).map((item, i) => (
                  <React.Fragment key={i.toString()}>
                    <span className="" key={i.toString()}>{item}</span>
                    <span className="px-1"> &middot; </span>
                  </React.Fragment>
                ))
              }
              {
                get(userSearchProfiles[0], 'location', []).map((item, i) => (
                  <React.Fragment key={i.toString()}>
                    <span className="">{item.name}</span>
                  </React.Fragment>
                ))
              }
              <span className="px-1"> &middot; </span>
            </div>
            <div className="dis-f">
              <div className="dis-fl-row a-c ">
                <span>
                  {get(userSearchProfiles[0], 'characteristics.bedrooms.min', 0)} - {get(userSearchProfiles[0], 'characteristics.bedrooms.max', 0)}
                </span>
                <span>&nbsp;Rooms</span>
              </div>
              <span className="px-1"> &middot; </span>
              <div className="dis-fl-row a-c mr-2 ">
                <span>
                  {get(userSearchProfiles[0], 'characteristics.livingArea.min', 0)} - {get(userSearchProfiles[0], 'characteristics.livingArea.max', 0)}
                </span>
                <span>&nbsp;m2</span>
              </div>
            </div>
            <BrixelButtonIcon
              icon="edit"
              rounded
              theme="light"
              small
              className="pos-a pos-r-sm x-r mt-2 mt-sm-0 mr-2 mr-sm-0"
              onClick={() => history.push(`/packageFlow/getStartedBuyer?company=${get(loggedInUser, 'company.stub', '')}`)}
            />
          </div>
        </div>
        <div className="dis-fl-row a-c flex-wrap property-category">
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/all`)}
            label="All"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1 mr-1"
          />
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/own`)}
            label="Your properties"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1 mr-1"
          />
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/lastViewed`)}
            label="Last viewed"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1 mr-1"
          />
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/favorites`)}
            label="Your favorites"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1 mr-1"
          />
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/radar`)}
            label="New in your radar"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1 mr-1"
          />
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/premium`)}
            label="Premium properties"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1 mr-1"
          />
          <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/preMarket`)}
            label="Pre-Market properties"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1"
          />
        </div>
      </div>

      <div className="mb-4">
        {
          lastViewedProperties.length > 0 && (
            <CarouselWrapper
              title="Last viewed"
              className="market-category-carousel"
              type="favorite"
              items={lastViewedProperties}
            />
          )
        }
      </div>

      <div className="mb-4">
        {
          favoritesProperties.length > 0 && (
            <CarouselWrapper
              title="Your favorites"
              className="market-category-carousel"
              type="favorite"
              items={favoritesProperties}
            />
          )
        }
      </div>

      <div className="mb-4">
        {
          newProperties.length > 0 && (
            <CarouselWrapper
              title="New in your radar"
              className="market-category-carousel"
              type="favorite"
              items={newProperties}
            />
          )
        }
      </div>

      <div className="mb-4">
        {
          premiumProperties.length > 0 && (
            <CarouselWrapper
              title="Premium properties"
              className="market-category-carousel"
              type="favorite"
              items={premiumProperties}
            />
          )
        }
      </div>

      <div className="mb-4">
        {
          preMarketProperties.length > 0 && (
            <CarouselWrapper
              title="Pre-Market properties"
              className="market-category-carousel"
              type="favorite"
              items={preMarketProperties}
            />
          )
        }
      </div>

    </>
  );
};

MarketList.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  ownerProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  ownerEstimations: PropTypes.arrayOf(PropTypes.object).isRequired,
  newProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastViewedProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  preMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  premiumProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MarketList.defaultProps = {
};

const mapStateToProps = (state) => ({
  // As an example for now. Later we should get a sample for every category
  ownerProperties: get(state, 'market.ownerProperties', []),
  ownerEstimations: get(state, 'market.ownerEstimations', []),
  newProperties: get(state, 'market.newProperties', []),
  lastViewedProperties: get(state, 'market.lastViewedProperties', []),
  premiumProperties: get(state, 'market.premiumProperties', []),
  preMarketProperties: get(state, 'market.preMarketProperties', []),
  favoritesProperties: get(state, 'market.favoritesProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
