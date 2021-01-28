/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  BrixelButtonSecondary, BrixelButtonIcon, useOutsideAlerter,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import Loadable from 'react-loadable';
import BrixelIcon from '@brixel/brixel-components/dist/components/BrixelIcon';
import BrixelButtonPrimary from '@brixel/brixel-components/dist/components/BrixelButtonPrimary';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import startBestimate from '../../images/Bestimate/startBestimate.svg';

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

  const [welcomeMessage, setWelcomeMessage] = useState(getCookie('brixelMarektWelcome') === 'true');

  return (
    <>
      {/* buyer welcome message  */}
      {
        !welcomeMessage && loggedInUser.buyer && (
          <SplashScreen
            className="result-popup"
            closeOutside={false}
          >
            <div className="dis-f jc-fe">
              <BrixelButtonIcon
                ghost
                theme="dark"
                icon="close-small"
                onClick={() => {
                  setCookie('brixelMarektWelcome', true);
                  setWelcomeMessage(true);
                }}
              />
            </div>
            <div className="dis-fl-col jc-c a-c pb-2">
              <h3>Welcome 🖐 </h3>
              <span className="txtDark200 pt-2 pb-5"> This is our Brixel market. A place where you can do great things. </span>
              <div className="mb-5">
                <div className="dis-f mb-2">
                  <div className="dis-f a-c w-fix-64 jc-fe">
                    <BrixelIcon
                      icon="favorite-fill"
                      color="red"
                    />
                  </div>
                  <span className="max-w-fix-424 txtDark700 pl-2"> Manage your favorites and buy your new home directly on Brixel.</span>
                </div>
                <div className="dis-f mb-2">
                  <div className="dis-f a-c w-fix-64 jc-fe">
                    <span className="category-tag bgPrimary300">
                      Pre
                    </span>
                  </div>
                  <span className="max-w-fix-424 txtDark700 pl-2"> Discover exclusive properties which are not on the market yet, but waiting for your first move.</span>
                </div>
                <div className="dis-f">
                  <div className="dis-f a-c w-fix-64 jc-fe">
                    <span className="category-tag bgRed400">
                      Premium
                    </span>
                  </div>
                  <span className="max-w-fix-424 txtDark700 pl-2"> Explore our Premium properties with 3D tour, detailed documentation and verified informations.</span>
                </div>
              </div>
              <BrixelButtonPrimary
                label="ok, got it!"
                rounded
                onClick={() => {
                  setCookie('brixelMarektWelcome', true);
                  setWelcomeMessage(true);
                }}
              />
            </div>
          </SplashScreen>
        )
      }

      {/* bestimate result */}
      {
        false && welcomeMessage && loggedInUser.buyer && (
          <SplashScreen
            className="result-popup"
            closeOutside={false}
          >
            <div className="dis-f jc-fe">
              <BrixelButtonIcon
                ghost
                theme="dark"
                icon="close-small"
                onClick={() => {
                  setCookie('brixelMarektWelcome', true);
                  setWelcomeMessage(true);
                }}
              />
            </div>
            <div className="dis-fl-col jc-c a-c pb-2">
              <h3>This is your Bestimate&reg; </h3>
              <span className="txtDark700 py-2"> This property is worth up to. </span>
              <span className="txtPrimary700 ff-mono fweight-700 fsize-600"> CHF 1,200,000 </span>
              <span className="txtDark700 pt-3"> Similar transactions were sold within this price range. </span>
              <div className="py-2">
                number range
              </div>
              <span className="txtDark200 max-w-fix-448 mb-5"> Bestimate&reg; is calculated based on similar transactions. This is a first price indication calculated with few inputs.</span>
              <BrixelButtonPrimary
                label="ok, got it!"
                rounded
                className="w-perc-100 max-w-fix-192"
                onClick={() => {
                  setCookie('brixelMarektWelcome', true);
                  setWelcomeMessage(true);
                }}
              />
            </div>
          </SplashScreen>
        )
      }

      {/* free price indication */}
      {
        false && welcomeMessage && loggedInUser.buyer && (
          <SplashScreen
            className="result-popup"
            closeOutside={false}
          >
            <div className="dis-f jc-fe">
              <BrixelButtonIcon
                ghost
                theme="dark"
                icon="close-small"
                onClick={() => {
                  setCookie('brixelMarektWelcome', true);
                  setWelcomeMessage(true);
                }}
              />
            </div>
            <div className="dis-fl-col jc-c a-c pb-2">
              <h3>Get a free price indication. </h3>
              <span className="max-w-fix-448 ta-c txtDark700 py-2"> Compare your property to real transaction data to better define the pricing. </span>

              <img src={startBestimate} alt="Generating Bestimate" className="w-fix-96 my-5" />

              <div className="dis-f jc-c a-c pos-r w-perc-100">
                <span className="pos-a-fix x-l-0 txtPrimary400 fweight-500 cur-poi">Thanks, not now </span>
                <BrixelButtonPrimary
                  label="ok, got it!"
                  rounded
                  className="w-perc-100 max-w-fix-192"
                  onClick={() => {
                    setCookie('brixelMarektWelcome', true);
                    setWelcomeMessage(true);
                  }}
                />
              </div>
            </div>
          </SplashScreen>
        )
      }

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
              type="lastViewed"
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
              type="new"
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
              type="premium"
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
              type="preMarket"
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
