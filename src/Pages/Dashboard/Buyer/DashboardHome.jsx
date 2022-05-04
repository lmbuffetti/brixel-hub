/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddToCalendar,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
} from '@brixel/brixel-components';
import get from 'lodash/get';
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
import DashboardPropertyCard from '../../../components/Cards/DashboardPropertyCard';

import Loading from '../../../components/Loading';
import marketNewHomeSvg from '../../../images/dashboard/marketNewHome.svg';
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
    activeSingleDeal,
    activeSingleProperty,
    activeSinglePropertyBookingSlots,
    handleGetActiveSinglePropertyBookings,
    handleGetUserSearchProfiles,
    isSmallLoading,
    loggedInUser,
    userLang,
    userTypes,
    searchProfile,
  } = props;
  // STATE
  const [progressState] = useState({step: 1});
  const [visitAccepted, setVisitAccepted] = useState(false);
  const propID = get(match, 'propID', null);
  
  useEffect(() => {
    if (activeSinglePropertyBookingSlots.length > 0) {
      const acceptedVisit = activeSinglePropertyBookingSlots.find((visit) => visit.status === 'accepted');
      setVisitAccepted(acceptedVisit !== null ? acceptedVisit : null);
    }
  }, [activeSinglePropertyBookingSlots]);
  
  useEffect(() => {
    if (propID) {
      const data = {
        id: propID,
        data: {
          user: loggedInUser.id,
        },
        smallLoader: 'getBooking',
      };
      handleGetActiveSinglePropertyBookings(data);
      if (loggedInUser.id) handleGetUserSearchProfiles(loggedInUser.id);
    }
  }, [propID, loggedInUser]);
  
  const openSchedule = () => {
    if (!visitAccepted) {
      history.push(`/buyer/${propID}/scheduleVisit`);
    }
  }
  
  const formatCalendar = (type) => {
    switch (type) {
      case 'location': {
        const location = `${activeSingleProperty.location.name}, ${activeSingleProperty.location.streetNumber} ${activeSingleProperty.location.zip} ${activeSingleProperty.location.city}`;
        return location;
      }
      case 'start': {
        const date = DateTime.fromFormat(visitAccepted.slot.split( ' ')[0], 'yyyy-LL-dd', userLang).toFormat('yyyy-LL-dd', userLang);
        const start = `${visitAccepted.slot.split( ' ')[1]}`;
        return `${date}T${start}`;
      }
      case 'end': {
        const date = DateTime.fromFormat(visitAccepted.slot.split( ' ')[0], 'yyyy-LL-dd', userLang).toFormat('yyyy-LL-dd', userLang);
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
        <span>Welcome back</span>
        <span className="ml-small-4"> {loggedInUser && (<>{loggedInUser.firstName}</>)} 👋 </span>
      </h4>

      <div className="max-w-fix-760 dis-fl-col">
        {
          progressState.step === 1 && (
            <>
              
              <DashboardPropertyCard type="buy" />
        
              <div className="dis-fl-col dis-fl-row-sm">
  
                <button
                  onClick={() => !visitAccepted ? openSchedule() : ''}
                  className={`shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi ta-l ${activeSinglePropertyBookingSlots.length > 0 ? 'bgWhite' : 'bgRed100'}`}
                >
                  {
                    activeSinglePropertyBookingSlots.length > 0 ? (
                      <div
                        className="cardWithBg"
                        style={{ backgroundImage: `url(${visitAccepted ? scheduleAcceptedSvg : schedulePendingSvg})` }}
                      >
                        {
                          visitAccepted ? (
                            <div className="dis-fl-col max-w-perc-70">
                              <h5>
                                Your visit id confirmed
                              </h5>
                              <div className="dis-f a-c w-perc-100 mt-1">
                                {
                                  get(visitAccepted, 'slot', '').split( ' ')[0] && (
                                    <h5 className="pr-2 txtGreen400 fweight-600">
                                      {DateTime.fromMillis(activeSingleDeal.visit).toFormat('dd LLL yyyy, hh:mm', userLang)}
                                    </h5>
                                  )
                                }
                              </div>
  
                              {
                                activeSingleDeal.visit && (
                                  <AddToCalendar
                                    title={`Visit ${activeSingleProperty.title}`}
                                    timestamp={activeSingleDeal.visit}
                                    location={formatCalendar('location')}
                                    userLang={userLang}
                                  />
                                )
                              }
                            </div>
                          ) : (
                            <div className="dis-fl-col max-w-perc-70">
                              <h5>
                                Thanks fo your request.
                              </h5>
                              <div className="dis-f a-c w-perc-100 mt-1">
                                <p className="pr-2">
                                  We will contact you as soon as possible for confirmation.
                                </p>
                              </div>
    
                              <BrixelButtonPrimary
                                onClick={() => ''}
                                className="mt-2 as-fs"
                                rounded
                                label="show dates"
                              />
                            </div>
                          )
                        }
                      </div>
                    ) : (
                      <div className="cardWithBg" style={{ backgroundImage: `url(${scheduleSvg})` }}>
                        <div className="dis-fl-col max-w-perc-70">
                          <h5>
                            Visit your future home
                          </h5>
                          <div className="dis-f a-c w-perc-100 mt-1">
                            <p className="pr-2">
                              Book a visit with the current owner.
                            </p>
                          </div>
      
                          <BrixelButtonPrimary
                            onClick={() => ''}
                            className="mt-2 as-fs"
                            rounded
                            label="add dates"
                          />
                        </div>
                      </div>
                    )
                  }
                </button>
  
                <button
                  onClick={() => history.push(`/buyer/${propID}/financing`)}
                  className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 ml-1 pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi bgWhite ta-l"
                >
                  <div
                    className="cardWithBg"
                    style={{ backgroundImage: `url(${financingSvg})` }}
                  >
                    <div className="dis-fl-col max-w-perc-70">
                      <h5>
                        Check financing
                      </h5>
                      <div className="dis-f a-c w-perc-100 mt-1">
                        <p className="pr-2">
                          Assess whether you can afford your desired property.
                        </p>
                      </div>
        
                      <BrixelButtonSecondary
                        rounded
                        onClick={() => ''}
                        className="mt-5 as-fs"
                        label="Calculate now"
                      />
                    </div>
                  </div>
                </button>
              </div>
  
              <div
                onClick={() => history.push(`/buy`)}
                className="shadow-2dp brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 w-perc-100 cur-poi ov-h mt-3 bgBlue100"
                style={{backgroundImage: `url(${marketNewHomeSvg})`, backgroundSize: 'auto 100%'}}
              >
                {
                  searchProfile.id ? (
                    <div className="dis-fl-col max-w-perc-100">
                      <div className="w-perc-100 mt-1 max-w-fix-280">
                        <span className="pr-2 w-perc-100 fsize-600 fweight-600">
                          Looking for other homes?
                        </span>
                        <p className="mt-1">
                          Explore our properties.
                        </p>
                      </div>
    
                      <BrixelButtonSecondary
                        bgTransparent
                        onClick={() => history.push(`/buy`)}
                        className="mt-2 as-fs"
                        rounded
                        label="Go to our market"
                      />
                    </div>
                  ) : (
                    <div className="dis-fl-col max-w-perc-100">
                      <div className="w-perc-100 mt-1 max-w-fix-280">
                        <span className="pr-2 w-perc-100 fsize-600 fweight-600">
                          Looking for other homes?
                        </span>
                        <p className="mt-1">
                          Create your search profile and find properties which are not yet on the market.
                        </p>
                      </div>
    
                      <BrixelButtonSecondary
                        bgTransparent
                        onClick={() => history.push(`/buy`)}
                        className="mt-2 as-fs"
                        rounded
                        label="Create a search profile"
                      />
                    </div>
                  )
                }
              </div>
              
            </>
          )
        }

      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyBookingSlots: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  searchProfile: PropTypes.object.isRequired,
  userLang: PropTypes.string.isRequired,
  userTypes: PropTypes.string,
};

DashboardHome.defaultProps = {
  activeSinglePropertyDeals: null,
  proEstimation: {},
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyBookingSlots: get(state, 'property.activeSinglePropertyBookingSlots', []),
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  userLang: get(state, 'user.loggedInUser.user.language', 'en'),
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
