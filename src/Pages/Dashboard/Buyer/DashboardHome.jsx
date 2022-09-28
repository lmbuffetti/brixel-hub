/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddToCalendar,
  BrixelButtonPrimary,
  BrixelButtonSecondary, translateTo,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setModal, spinnerOff } from '../../../actions/CommonActions';
import { DateTime } from 'luxon';
import {
  getActiveSinglePropertyBookings,
} from '../../../actions/PropertyActions';
import { getUserSearchProfiles } from '../../../actions/SearchProfileActions';
import ArticlesBox from '../../../components/CraftCMS/ArticlesBox';
import BannerBox from '../../../components/CraftCMS/BannerBox';
import DashboardPropertyCard from '../../../components/Cards/DashboardPropertyCard';

import Loading from '../../../components/Loading';
// import marketNewHomeSvg from '../../../images/dashboard/marketNewHome.svg';
import scheduleSvg from '../../../images/dashboard/scehdule.svg';
import scheduleAcceptedSvg from '../../../images/dashboard/scheduleAccepted.svg';
import schedulePendingSvg from '../../../images/dashboard/schedulePending.svg';
import financingSvg from '../../../images/dashboard/financingDashboard.svg';

const DashboardHome = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleDeal,
    activeSingleProperty,
    activeSinglePropertyBookingSlots,
    handleGetActiveSinglePropertyBookings,
    // handleGetUserSearchProfiles,
    isSmallLoading,
    lang,
    loggedInUser,
    // searchProfile,
    userTypes,
  } = props;
  // STATE
  const [progressState, setProgressState] = useState({step: 1});
  const [visitAccepted, setVisitAccepted] = useState(false);
  const propID = get(match, 'propID', null);
  useEffect(() => {
    if (!isNaN(+get(activeSingleDeal, 'visit', 0))) {
      setVisitAccepted(get(activeSingleDeal, 'visit', 0));
    }
  }, [activeSingleDeal]);

  useEffect(() => {
    if (activeSingleProperty.sellerStatus === 'success') setProgressState({step: 5});
  }, [activeSingleProperty.sellerStatus, activeSingleProperty.progress]);

  useEffect(() => {
    if (propID && loggedInUser.id) {
      const data = {
        id: propID,
        data: {
          user: loggedInUser.id,
        },
        smallLoader: 'getBooking',
      };
      handleGetActiveSinglePropertyBookings(data);
      // if (loggedInUser.id) handleGetUserSearchProfiles(loggedInUser.id);
    }
  }, [propID, loggedInUser]);

  const formatCalendar = (type) => {
    switch (type) {
      case 'location': {
        if (activeSingleProperty.location) {
          const location = `${activeSingleProperty.location.name}, ${activeSingleProperty.location.streetNumber} ${activeSingleProperty.location.zip} ${activeSingleProperty.location.city}`;
          return location;
        }
        break;
      }
      case 'start': {
        const date = DateTime.fromFormat(visitAccepted.slot.split( ' ')[0], 'yyyy-LL-dd', { locale: lang}).toFormat('yyyy-LL-dd', { locale: lang});
        const start = `${visitAccepted.slot.split( ' ')[1]}`;
        return `${date}T${start}`;
      }
      case 'end': {
        const date = DateTime.fromFormat(visitAccepted.slot.split( ' ')[0], 'yyyy-LL-dd', { locale: lang}).toFormat('yyyy-LL-dd', { locale: lang});
        const end = `${visitAccepted.slot.split( ' ')[2] ? visitAccepted.slot.split( ' ')[2] : visitAccepted.slot.split( ' ')[1]}`;
        return `${date}T${end}`;
      }
    }
  }

  // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
  if ((!activeSingleProperty.id && !userTypes) || isSmallLoading.getProperty) {
    return <Loading />;
  }

  return (
    <div className="rewards-container" id="rewardsDashboard">

      <h4 className="mb-3 hide dis-b-lg fweight-600">
        <span>{translateTo('Welcome back', lang)}</span>
        <span className="ml-small-4"> {loggedInUser && (<>{loggedInUser.firstName}</>)} 👋 </span>
      </h4>
      <div className="dis-f a-c w-perc-100 mt-1">
        {
          get(visitAccepted, 'slot', '').split( ' ')[0] && (
            <h5 className="pr-2 txtGreen400 fweight-600">
              {DateTime.fromMillis(activeSingleDeal.visit).toFormat('dd LLL yyyy, hh:mm', { locale: lang})}
            </h5>
          )
        }
      </div>

      <div className="max-w-fix-1024 dis-fl-col pr-md-2">

        <>

          <DashboardPropertyCard type="buy" lang={lang} />

          <div className="dis-fl-col dis-fl-row-sm">

            <button
              className={`shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi ta-l ${activeSinglePropertyBookingSlots.length > 0 ? 'bgWhite' : 'bgRed100'}`}
            >
              {
                visitAccepted ? (
                  <div
                    className="cardWithBg"
                    style={{ backgroundImage: `url(${scheduleAcceptedSvg})` }}
                  >
                    <div className="dis-fl-col max-w-perc-100">
                      <h5 className="fweight-600">
                        {translateTo('Your visit is confirmed', lang)}
                      </h5>
                      <div className="dis-f a-c max-w-perc-80 mt-1">
                        <h5 className="pr-2 txtGreen400 fweight-600 mb-3">
                          {!isNaN(+visitAccepted) ? DateTime.fromMillis(visitAccepted).toFormat('dd LLL yyyy, hh:mm', lang) : visitAccepted}
                        </h5>
                      </div>

                      {
                        !isNaN(+visitAccepted) && (
                          <div className="mt-a">
                            <AddToCalendar
                              title={translateTo(`Visit ${activeSingleProperty.title}`, lang)}
                              timestamp={visitAccepted}
                              location={formatCalendar('location')}
                              lang={lang}
                            />
                          </div>
                        )
                      }
                    </div>
                  </div>
                ) : (
                  <>
                    {
                      activeSinglePropertyBookingSlots.length > 0 ? (
                        <div
                          className="cardWithBg"
                          style={{ backgroundImage: `url(${visitAccepted ? scheduleAcceptedSvg : schedulePendingSvg})` }}
                        >
                          <div className="dis-fl-col">
                            <h5 className="fweight-600">
                              {translateTo('Thanks for your request.', lang)}
                            </h5>
                            <div className="dis-f a-c max-w-perc-70 mt-1 mb-3">
                              <p className="pr-2 fsize-300">
                                {translateTo('We will contact you as soon as possible for confirmation.', lang)}
                              </p>
                            </div>

                            <BrixelButtonSecondary
                              onClick={() => {
                                history.push({ pathname: `/buyer/${propID}/scheduleVisit`, search: 'showBookings' })
                              }}
                              className="mt-a as-fs"
                              rounded
                              label={translateTo('show dates', lang)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="cardWithBg" style={{ backgroundImage: `url(${scheduleSvg})` }}>
                          <div className="dis-fl-col ">
                            <h5 className="fweight-600">
                              {translateTo('Visit your future home', lang)}
                            </h5>
                            <div className="dis-f a-c max-w-perc-70 mt-1 mb-3">
                              <p className="pr-2 fsize-300">
                                {translateTo('Book a visit with the current owner.', lang)}
                              </p>
                            </div>

                            <BrixelButtonPrimary
                              onClick={() => history.push(`/buyer/${propID}/scheduleVisit`)}
                              className="mt-a as-fs"
                              rounded
                              label={translateTo('add dates', lang)}
                            />
                          </div>
                        </div>
                      )
                    }
                  </>
                )
              }
            </button>

            <button
              onClick={() => history.push(`/buyer/${propID}/financing`)}
              className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-sm-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite ta-l"
            >
              <div
                className="cardWithBg"
                style={{ backgroundImage: `url(${financingSvg})` }}
              >
                <div className="dis-fl-col max-w-perc-70">
                  <h5 className="fweight-600">
                    {translateTo('Check financing', lang)}
                  </h5>
                  <div className="dis-f a-c w-perc-100 mt-1 mb-3">
                    <p className="pr-2 fsize-300">
                      {translateTo('Assess whether you can afford your desired property.', lang)}
                    </p>
                  </div>

                  <BrixelButtonSecondary
                    rounded
                    onClick={() => ''}
                    className="mt-a as-fs"
                    label={translateTo('Calculate now', lang)}
                  />
                </div>
              </div>
            </button>
          </div>
          {
            progressState.step < 5 && (
              <>
                <ArticlesBox
                  activeSingleProperty={activeSingleProperty}
                  title="Wissenswertes rund ums Eigenheim"
                  activeSingleCompany={activeSingleCompany}
                  lang={lang}
                  placementSlug="buyer-hub-home-onboarding-article"
                />

                <BannerBox
                  activeSingleProperty={activeSingleProperty}
                  activeSingleCompany={activeSingleCompany}
                  className="mt-6"
                  lang={lang}
                  placementSlug="buyer-hub-home-banner-bottom"
                />
              </>
            )
          }
          {
            progressState.step === 5 && (
              <>
                <BannerBox
                  activeSingleProperty={activeSingleProperty}
                  activeSingleCompany={activeSingleCompany}
                  title="Plane deine nächsten Schritte."
                  className="mt-6"
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-banner-top"
                />

                <ArticlesBox
                  activeSingleProperty={activeSingleProperty}
                  activeSingleCompany={activeSingleCompany}
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-partner"
                />

                <ArticlesBox
                  activeSingleProperty={activeSingleProperty}
                  title="About your home"
                  activeSingleCompany={activeSingleCompany}
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-articles"
                />

                <BannerBox
                  activeSingleProperty={activeSingleProperty}
                  activeSingleCompany={activeSingleCompany}
                  className="mt-6"
                  lang={lang}
                  placementSlug="buyer-hub-home-sold-banner-bottom"
                />
              </>
            )
          }
          {/*
          <div
            onClick={() => history.push(`/buy`)}
            className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 w-perc-100 cur-poi ov-h mt-3 bgBlue100"
            style={{backgroundImage: `url(${marketNewHomeSvg})`, backgroundSize: 'auto 100%'}}
          >
            {
              searchProfile.id ? (
                <div className="dis-fl-col max-w-perc-100">
                  <div className="w-perc-100 mt-1 max-w-fix-400">
                    <span className="pr-2 w-perc-100 fsize-600 fweight-600">
                      {translateTo('Looking for other homes?', lang)}
                    </span>
                    <p className="mt-1 mb-2">
                      {translateTo('Explore our properties.', lang)}
                    </p>
                  </div>

                  <BrixelButtonSecondary
                    bgTransparent
                    onClick={() => history.push(`/buy`)}
                    className="mt-2 as-fs"
                    rounded
                    label={translateTo('Go to our market', lang)}
                  />
                </div>
              ) : (
                <div className="dis-fl-col max-w-perc-100">
                  <div className="w-perc-100 mt-1 max-w-fix-400">
                    <span className="pr-2 w-perc-100 fsize-600 fweight-600">
                      {translateTo('Looking for other homes?', lang)}
                    </span>
                    <p className="mt-1">
                      {translateTo('Create your search profile and find properties which are not yet on the market.', lang)}
                    </p>
                  </div>

                  <BrixelButtonSecondary
                    bgTransparent
                    onClick={() => history.push(`/buy`)}
                    className="mt-2 as-fs"
                    rounded
                    label={translateTo('Create a search profile', lang)}
                  />
                </div>
              )
            }
          </div>*/}

        </>

      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyBookingSlots: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  // handleGetUserSearchProfiles: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  // searchProfile: PropTypes.object.isRequired,
  userTypes: PropTypes.string,
};

DashboardHome.defaultProps = {
  proEstimation: {},
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyBookingSlots: get(state, 'property.activeSinglePropertyBookingSlots', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  searchProfile: get(state, 'user.userSearchProfiles[0]', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyBookings: bindActionCreators(
    getActiveSinglePropertyBookings, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
