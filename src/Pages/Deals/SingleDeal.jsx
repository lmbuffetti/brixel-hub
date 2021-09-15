/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, useRef,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import { DateTime } from 'luxon';
import {
  bindActionCreators, compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import {
  BrixelAvatar, BrixelButtonIcon, BrixelButtonSecondary, Helpers,
  FactsOptions, useOutsideAlerter, change, BrixelDropdownMini,
} from '@brixel/brixel-components';
import {
  getActiveSingleDeal, saveActiveSingleDeal, updateMultipleDeals,
  setActiveSingleDeal,
} from '../../actions/DealActions';
import {
  getNoteListings, setDealNoteListings,
} from '../../actions/NoteActions';
import {
  getHistoryListings, setDealHistoryListings, setDealOwnerHistoryListings,
} from '../../actions/HistoryActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import ProgressBar from '../../components/ProgressBar';
import Timeline from '../../components/Timeline';

const SingleDeal = (props) => {
  const {
    activeSingleDeal,
    activeSingleProperty,
    activeSinglePropertyDeals,
    getActiveDeal,
    getDealNotes,
    getHistoryList,
    handleSaveDeal,
    handleSaveMultipleDeal,
    history,
    match,
    setActiveSingleDealHistory,
    setActiveSingleDealOwnerHistory,
    setDeal,
    setDealNotes,
    userLang,
    windowDimensions,
  } = props;

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [winnerId, setWinnerId] = useState('');
  const {
    factsOptions,
  } = FactsOptions;

  const optionsRef = useRef(null);

  useEffect(() => () => {
    setDeal({});
    setDealNotes([]);
    setActiveSingleDealHistory({});
    setActiveSingleDealOwnerHistory({});
  }, []);

  useEffect(() => {
    const dealID = get(match, 'params.dealID', null);
    if (activeSingleDeal) {
      const payloadNote = {
        object: dealID,
        type: 'deal',
        resultsPerPage: 50,
        offset: 0,
        text: '',
        order: '',
        direction: 'DESC',
        company: '',
        smallLoader: 'dealNote',
      };
      const payloadDealHistory = {
        parent: dealID,
        type: 'deal',
        resultsPerPage: 50,
        offset: 0,
        order: '',
        direction: 'DESC',
        smallLoader: 'getDealHistory',
      };
      getActiveDeal({ id: dealID, smallLoader: 'getDeal' });
      getDealNotes(payloadNote);
      getHistoryList(payloadDealHistory);
    }
  }, [activeSingleDeal.id]);

  useEffect(() => {
    forEach(activeSinglePropertyDeals, (el) => {
      if (has(el, 'winner') && el.winner === true) setWinnerId(el.id);
    });
  }, [activeSinglePropertyDeals]);

  const saveData = () => {
    const deal = cloneDeep(activeSingleDeal);
    const data = {
      id: deal.id,
      data: deal,
      smallLoader: 'saveData',
    };
    // For now we still dont use the diff object (TODO: API ticket)
    // diff(initialValues, formValue)
    handleSaveDeal(data);
  };

  const archiveDeal = () => {
    if (activeSingleDeal.newSeller === true) set(activeSingleDeal, 'newSeller', false);
    set(activeSingleDeal, 'active', !activeSingleDeal.active);
    saveData();
  };

  const newDeal = () => {
    set(activeSingleDeal, 'newSeller', !activeSingleDeal.newSeller);
    saveData();
  };

  const winDeal = () => {
    set(activeSingleDeal, 'winner', !get(activeSingleDeal, 'winner', false));
    const data = [{
      id: activeSingleDeal.id,
      data: activeSingleDeal,
    }];

    if (winnerId && (winnerId !== activeSingleDeal.id)) {
      const deals = cloneDeep(activeSinglePropertyDeals);
      const idExistWinner = deals.findIndex((deal) => deal.id === winnerId);
      if (activeSinglePropertyDeals[idExistWinner]) {
        set(activeSinglePropertyDeals[idExistWinner], 'winner', false);
        data.push({
          id: activeSinglePropertyDeals[idExistWinner].id,
          data: activeSinglePropertyDeals[idExistWinner],
          smallLoader: 'saveData',
        });
        // For now we still dont use the diff object (TODO: API ticket)
        // diff(initialValues, formValue)
      }
    }
    handleSaveMultipleDeal({
      deals: data,
      smallLoader: 'saveData',
    });
  };

  const progressChange = (value) => {
    find(factsOptions.progressBarDealsOptions, (element) => {
      if (element.value === value) {
        const response = element.value;
        set(activeSingleDeal, 'stage', response);
        saveData();
      }
    });
  };

  const OptionsDropdown = (data) => {
    if ((get(data, 'showMobile', null) && get(windowDimensions, 'width', 0) <= 1024) || (get(data, 'showDesktop', null) && get(windowDimensions, 'width', 0) > 1024)) {
      const className = get(data, 'className', '');
      const btnClass = get(data, 'btnClass', '');
      return (
        <div className={`pos-r mr-2 ${className}`} ref={optionsRef}>
          <BrixelButtonIcon
            icon="options-vertical"
            className={`ml-a ${btnClass}`}
            theme="dark"
            ghost
            onClick={() => {
              setOptionsOpen(!optionsOpen);
            }}
          />
          {
            optionsOpen && (
              <BrixelDropdownMini
                rightAligned
                topOffset={48}
                links={
                  [
                    {
                      label: get(activeSingleDeal, 'winner', null) ? 'Remove winner' : 'Winner',
                      clickFunc: () => { winDeal(); setOptionsOpen(false); },
                      className: 'txtPrimary400',
                    },
                    {
                      label: get(activeSingleDeal, 'newSeller', null) ? 'Mark as read' : 'Mark as new',
                      clickFunc: () => { newDeal(); setOptionsOpen(false); },
                      className: 'txtPrimary400',
                    },
                    {
                      label: get(activeSingleDeal, 'active', null) ? 'Archive' : 'Unarchive',
                      clickFunc: () => { archiveDeal(); setOptionsOpen(false); },
                      className: 'txtPrimary400',
                    },
                  ]
                }
              />
            )
          }
        </div>
      );
    }
    return null;
  };

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
  useOutsideAlerter(optionsRef, {
    action: 'function',
    func: () => {
      setOptionsOpen(false);
    },
  });

  return (
    <>
      {
        activeSingleDeal.id && (
          <SplashScreen
            className={activeSingleDeal.active ? '' : 'archivedDeal'}
            closeLink={`/${activeSingleProperty.id}/prospects`}
          >
            <div className="single-deal dis-fl-col">
              {/* top panel */}
              <div className="top dis-fl-row jc-b mb-0 mb-lg-4">
                <div className="user dis-fl-row col-7 p-2 p-lg-0">
                  <BrixelAvatar
                    baseURL={get(getConfigEnv, 'shortPath', '')}
                    name={Helpers.userNameVal(activeSingleDeal.user.firstName, activeSingleDeal.user.lastName, activeSingleDeal.user.name) === 'No Name' ? get(activeSingleDeal.user, 'email', '') : Helpers.userNameVal(activeSingleDeal.user.firstName, activeSingleDeal.user.lastName, activeSingleDeal.user.name)}
                    profileId={get(activeSingleDeal.user, 'id', '')}
                  />
                  <div className="title dis-fl-col ml-2">
                    <span
                      className={`name dis-b fsize-500 fweight-500 ${get(activeSingleDeal, 'user.name') ? 'txtDark700' : 'txtDark100'}`}
                    >
                      {Helpers.userNameVal(activeSingleDeal.user.firstName, activeSingleDeal.user.lastName, activeSingleDeal.user.name)}
                    </span>
                    <div className="dis-f">
                      {
                        has(activeSingleDeal, 'user.email') && (
                          <a
                            className="txtDark700 link mr-2"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`mailto:${activeSingleDeal.user.email}?subject=From Brixel`}
                          >
                            {activeSingleDeal.user.email}
                          </a>
                        )
                      }
                      {
                        has(activeSingleDeal, 'winner') && activeSingleDeal.winner && (
                          <span className="cardTag green mr-2"> Winner </span>
                        )
                      }
                      {
                        !activeSingleDeal.active && (
                          <span className="cardTag"> Archived </span>
                        )
                      }
                    </div>
                  </div>
                </div>
                <div className="actions dis-fl-row jc-fe col-5 p-0">
                  <OptionsDropdown showDesktop />
                  <div className="pt-2 pr-1 pr-lg-0 pt-lg-0">
                    <BrixelButtonIcon
                      icon="close-small"
                      ghost
                      theme="dark"
                      onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
                    />
                  </div>
                </div>
              </div>

              {/* middle panel */}
              <div className="mid p-2 dis-fl-row flex-wrap mb-lg-2 pos-r">
                <div className="left dis-fl-col col-7 p-0 min-w-perc-100 min-w-perc-lg-0">
                  <span className="fsize-200 overline tt-up mb-2">Information</span>

                  <div className="detail-part dis-fl-row">

                    <div className="dis-fl-col col-6 p-0">
                      <div className="dis-fl-col ta-l mb-2">
                        <span className="subtitle fsize-200 txtDark200">Phone</span>
                        {
                          (has(activeSingleDeal, 'user.phone.number') && activeSingleDeal.user.phone.number.length > 0) ? (
                            <span className="value txtDark700">{Helpers.telephoneFormat(activeSingleDeal.user.phone)}</span>
                          ) : (
                            <span className="value txtDark700">-</span>
                          )
                        }
                      </div>
                    </div>

                    <div className="dis-fl-col col-6 p-0">
                      <div className="dis-fl-col ta-l mb-2">
                        <span className="subtitle fsize-200 txtDark200">Signed Up</span>
                        {
                          get(activeSingleDeal, 'user.createdAt', null) ? (
                            <span className="value txtDark700">{DateTime.fromMillis(activeSingleDeal.user.createdAt, { locale: userLang }).toFormat('dd LLL yy, H:mm')}</span>
                          ) : (
                            <span className="value txtDark700">-</span>
                          )
                        }

                      </div>
                    </div>

                  </div>

                </div>
                <div className="right dis-fl-col col-5 p-0 min-w-perc-100 min-w-perc-lg-0">
                  {
                    activeSingleDeal.id && (
                      <ProgressBar
                        className="mb-3"
                        options={factsOptions.progressBarDealsOptions}
                        progressState={has(activeSingleDeal, 'stage') ? activeSingleDeal.stage : ''}
                        readOnly={false}
                        updateProgressBarFunc={(value) => progressChange(value)}
                      />
                    )
                  }

                  <div className="mb-3 hide">
                    <span className="overline mb-2">Showings</span>
                    <BrixelButtonSecondary
                      className="p-0 as-fs"
                      label="Add date"
                      rounded
                      color="light"
                      saturation={700}
                      bgTransparent
                      leftIcon="calendar"
                      onClick={() => ''}
                    />
                  </div>
                  <div className="hide">
                    <span className="overline mb-2">Offers</span>
                    <BrixelButtonSecondary
                      className="p-0 as-fs"
                      label="Add offer"
                      rounded
                      color="light"
                      saturation={700}
                      bgTransparent
                      leftIcon="money"
                      onClick={() => ''}
                    />
                  </div>
                </div>
              </div>

              {/* bottom panel */}
              <div className="bottom dis-fl-row col-12 bgLight100 px-2 w-perc-100 h-perc-100 py-3 pos-r">
                <OptionsDropdown
                  btnClass="shadow-3dp"
                  className="pos-a-fix x-t-0 x-r-1 mt-2-neg"
                  showMobile
                />
                <Timeline
                  countryLang={userLang}
                  isDeal
                  className="w-perc-100 col-7 p-0 min-w-perc-100 min-w-perc-lg-0"
                />
                <div className="dis-fl-col-md col-5 pl-4 pr-0 right-container hide">
                  {/* <div className="showings">
                    <span className="title overline tt-up mb-3">Showings</span>
                  </div>
                  <div className="offers">
                    <span className="title overline tt-up mb-3">Offers</span>
                  </div> */}
                </div>
              </div>
            </div>
          </SplashScreen>
        )
      }
    </>
  );
};

SingleDeal.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDeals: PropTypes.arrayOf(PropTypes.object).isRequired,
  getActiveDeal: PropTypes.func.isRequired,
  getDealNotes: PropTypes.func.isRequired,
  getHistoryList: PropTypes.func.isRequired,
  handleSaveDeal: PropTypes.func.isRequired,
  handleSaveMultipleDeal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  setActiveSingleDealHistory: PropTypes.func.isRequired,
  setActiveSingleDealOwnerHistory: PropTypes.func.isRequired,
  setDeal: PropTypes.func.isRequired,
  setDealNotes: PropTypes.func.isRequired,
  userLang: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

SingleDeal.defaultProps = {};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', []),
  isSuperAdmin: get(state, 'common.superAdmin', false),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  getActiveDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  getDealNotes: bindActionCreators(getNoteListings, dispatch),
  getHistoryList: bindActionCreators(getHistoryListings, dispatch),
  handleSaveDeal: bindActionCreators(saveActiveSingleDeal, dispatch),
  handleSaveMultipleDeal: bindActionCreators(updateMultipleDeals, dispatch),
  setActiveSingleDealHistory: bindActionCreators(setDealHistoryListings, dispatch),
  setActiveSingleDealOwnerHistory: bindActionCreators(setDealOwnerHistoryListings, dispatch),
  setDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  setDealNotes: bindActionCreators(setDealNoteListings, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SingleDeal);
