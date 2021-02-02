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
// eslint-disable-next-line import/no-duplicates
import { Helpers } from '@brixel/brixel-components';
import BrixelIcon from '@brixel/brixel-components/dist/components/BrixelIcon';
import BrixelButtonPrimary from '@brixel/brixel-components/dist/components/BrixelButtonPrimary';
import { setCookie, getCookie } from '../../utils/helpers';
import SplashScreen from '../../components/SplashScreen';
import startBestimate from '../../images/Bestimate/startBestimate.svg';
import { setSplashType } from '../../actions/CommonActions';
import { setEstimation } from '../../actions/PropertyActions';

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
    splashScreenType, activeSingleProperty, bestimate, activeSingleCompany,
    setSplashScreen, setPropertyEstimation,
  } = props;

  const [welcomeMessage, setWelcomeMessage] = useState(getCookie('brixelMarketWelcome') === 'true');
  const [bestimateMessage, setBestimateMessage] = useState(getCookie('brixelMarketBestimate') === 'true');

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
                  setCookie('brixelMarketWelcome', true);
                  setWelcomeMessage(true);
                  setSplashScreen('');
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
                  setCookie('brixelMarketWelcome', true);
                  setWelcomeMessage(true);
                  setSplashScreen('');
                }}
              />
            </div>
          </SplashScreen>
        )
      }

      {/* bestimate result */}
      {
        !bestimateMessage && splashScreenType === 'bestimateResult' && (
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
                  setCookie('brixelMarketBestimate', true);
                  setBestimateMessage(true);
                  setSplashScreen('');
                  setPropertyEstimation({});
                }}
              />
            </div>
            <div className="dis-fl-col jc-c a-c pb-2">
              <h3>This is your Bestimate&reg; </h3>
              {
                bestimate.higherValue && (
                  <>
                    <p className="ta-c mt-2 txtDark700"> Your property is worth up to </p>
                    <p className="fsize-600 ff-mono txtPrimary700 fweight-600 mb-3 mt-2">{get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(bestimate.higherValue, get(activeSingleCompany, 'country.currency', 'CHF'))}</p>
                  </>
                )
              }
              <span className="txtDark700"> Similar transactions were sold within this price range. </span>
              <div className="pt-2 pb-3 max-w-fix-480 w-perc-100">
                {
                  bestimate.higherValue && (
                    <div className="ff-mono txtPrimary700 fsize-300 ta-c besitmate-range dis-f jc-c">
                      <span> {get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(bestimate.lowerValue, get(activeSingleCompany, 'country.currency', 'CHF'))} </span>
                      <span className="w-fix-120" />
                      <span> {get(activeSingleCompany, 'country.currency', '')} {Helpers.formatNumberValue(bestimate.higherValue, get(activeSingleCompany, 'country.currency', 'CHF'))}</span>
                    </div>
                  )
                }
                <span className="besitmate-bar"> </span>
              </div>
              <span className="txtDark200 max-w-fix-480 mb-5">
                Bestimate&reg; is calculated based on similar transactions. This is a first price indication calculated with few inputs. To have a more accurate estimation we suggest to book our free on-site estimation.
              </span>
              <BrixelButtonPrimary
                label="ok, got it!"
                rounded
                className="w-perc-100 max-w-fix-192"
                onClick={() => {
                  setCookie('brixelMarketBestimate', true);
                  setBestimateMessage(true);
                  setSplashScreen('');
                  setPropertyEstimation({});
                }}
              />
            </div>
          </SplashScreen>
        )
      }

      {/* bestimate teaser */}
      {
        !bestimateMessage && splashScreenType === 'bestimateTeaser' && (
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
                  setCookie('brixelMarketBestimate', true);
                  setBestimateMessage(true);
                  setSplashScreen('');
                }}
              />
            </div>
            <div className="dis-fl-col jc-c a-c pb-2">
              <h3>Get a free price indication. </h3>
              <span className="max-w-fix-448 ta-c txtDark700 py-2"> Compare your property to real transaction data to better define the pricing. </span>

              <img src={startBestimate} alt="Generating Bestimate" className="w-fix-96 my-5" />

              <div className="dis-f jc-c a-c pos-r w-perc-100">
                <span
                  className="pos-a-fix x-l-0 txtPrimary400 fweight-500 cur-poi"
                  onClick={() => {
                    setCookie('brixelMarketBestimate', true);
                    setBestimateMessage(true);
                  }}
                >
                  Thanks, not now
                </span>
                <BrixelButtonPrimary
                  rounded
                  label="Get free Bestimate®"
                  className="m-a"
                  onClick={() => {
                    setSplashScreen('');
                    history.push(`/${get(activeSingleProperty, 'id', '')}/rewards/achievement/bestimate`);
                  }}
                  rightIcon="arrow-right"
                />
              </div>
            </div>
          </SplashScreen>
        )
      }

      <div className="mb-4">
        {
          ownerProperties.total > 0 && (
            <CarouselWrapper
              title="Your properties"
              className="market-category-carousel"
              type="own"
              items={ownerProperties.data}
            />
          )
        }
      </div>

      <div className="dis-fl-col mb-6">
        <div className="dis-fl-row a-c jc-b mb-4 flex-wrap">
          <div className="dis-fl-col mb-2">
            <h4 className="fweight-700">Discover our market</h4>
            <p className="fsize-300 pt-1">These are properties that match your criteria.</p>
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
                    {
                      i !== userSearchProfiles[0].location.length - 1 && (
                        <span>,&nbsp;</span>
                      )
                    }
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
          {/* <BrixelButtonSecondary
            onClick={() => history.push(`${match.url}/lastViewed`)}
            label="Last viewed"
            rounded
            theme="light"
            themeSat={500}
            className="fsize-300 mb-1 mr-1"
          /> */}
          {
            favoritesProperties.length > 0 && (
              <BrixelButtonSecondary
                onClick={() => history.push(`${match.url}/favorites`)}
                label="Your favorites"
                rounded
                theme="light"
                themeSat={500}
                className="fsize-300 mb-1 mr-1"
              />
            )
          }
          {
            newProperties.length > 0 && (
              <BrixelButtonSecondary
                onClick={() => history.push(`${match.url}/radar`)}
                label="New in your radar"
                rounded
                theme="light"
                themeSat={500}
                className="fsize-300 mb-1 mr-1"
              />
            )
          }
          {
            premiumProperties.length > 0 && (
              <BrixelButtonSecondary
                onClick={() => history.push(`${match.url}/premium`)}
                label="Premium properties"
                rounded
                theme="light"
                themeSat={500}
                className="fsize-300 mb-1 mr-1"
              />
            )
          }
          {
            preMarketProperties.length > 0 && (
              <BrixelButtonSecondary
                onClick={() => history.push(`${match.url}/preMarket`)}
                label="Pre-Market properties"
                rounded
                theme="light"
                themeSat={500}
                className="fsize-300 mb-1"
              />
            )
          }
        </div>
      </div>

      {/* <div className="mb-4">
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
      </div> */}

      <div className="mb-4">
        {
          favoritesProperties.total > 0 && (
            <CarouselWrapper
              title="Your favorites"
              className="market-category-carousel"
              type="favorite"
              items={favoritesProperties.data}
            />
          )
        }
      </div>

      <div className="mb-4">
        {
          newProperties.total > 0 && (
            <CarouselWrapper
              title="New in your radar"
              className="market-category-carousel"
              type="new"
              items={newProperties.data}
            />
          )
        }
      </div>

      <div className="mb-4">
        {
          premiumProperties.total > 0 && (
            <CarouselWrapper
              title="Premium properties"
              className="market-category-carousel"
              type="premium"
              items={premiumProperties.data}
            />
          )
        }
      </div>

      <div className="mb-4">
        {
          preMarketProperties.total > 0 && (
            <CarouselWrapper
              title="Pre-Market properties"
              className="market-category-carousel"
              type="preMarket"
              items={preMarketProperties.data}
            />
          )
        }
      </div>

    </>
  );
};

MarketList.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
  splashScreenType: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  ownerProperties: PropTypes.object.isRequired,
  ownerEstimations: PropTypes.object.isRequired,
  newProperties: PropTypes.object.isRequired,
  lastViewedProperties: PropTypes.object.isRequired,
  preMarketProperties: PropTypes.object.isRequired,
  premiumProperties: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.object.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  bestimate: PropTypes.object.isRequired,
  activeSingleCompany: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
};

MarketList.defaultProps = {
};

const mapStateToProps = (state) => ({
  bestimate: get(state, 'property.estimation.result', {}),
  ownerProperties: get(state, 'market.ownerProperties', {}),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  newProperties: get(state, 'market.newProperties', {}),
  lastViewedProperties: get(state, 'market.lastViewedProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  preMarketProperties: get(state, 'market.preMarketProperties', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
});

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
