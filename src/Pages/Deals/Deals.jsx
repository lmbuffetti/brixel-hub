/* eslint-disable react/jsx-no-bind */
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelTabs, Helpers } from '@brixel/brixel-components';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
// import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import { bindActionCreators, compose } from 'redux';
import { preventExitFromScreen } from '../../actions/CommonActions';
import { saveActiveSingleDeal, setActiveSingleDeal, updateDealsOrder } from '../../actions/DealActions';
import { getPageDeals, setPageDeals } from '../../actions/PropertyActions';
import DealsCard from '../../components/Cards/DealsCard';
import DealsTitle from '../../components/DealsTitle';
import FilterBar from '../../components/FilterBar';
import { getCookie, setCookie } from '../../utils/helpers';
import translateTo from '../../utils/translation';

const Deals = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    activeSinglePropertyDeals,
    handleGetPageDeals,
    handleSaveDeal,
    notification,
    resetSingleDeal,
    saveMultipleDeals,
    setActiveSinglePropertyDeals,
    setPreventExit,
    smallLoader,
    lang,
    windowDimensions,
  } = props;
  const [movedList, setMovedList] = useState();
  const [processedDeals, setProcessedDeals] = useState(null);
  const [filteredDeals, setFilteredDeals] = useState(null);
  const [emptyDeals, setEmptyDeals] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [filterStatus, setFilterStatus] = useState({
    status: getCookie('brixelFilterDeal') || 'all',
  });

  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (windowDimensions.width <= 1024 && !activeTab) {
      setActiveTab('interested');
    } else {
      setActiveTab(null);
    }
  }, [windowDimensions]);

  useEffect(() => () => {
    setActiveSinglePropertyDeals([]);
  }, []);

  // GET THE BUYERS REQUEST FOR CURRENT PROPERTY
  useEffect(() => {
    if (propID) {
      const data = {
        id: propID,
        smallLoader: 'loadDeal',
      };
      handleGetPageDeals(data);
    }
  }, [propID]);

  const processDeals = (list) => {
    if (activeSinglePropertyDeals) {
      const deals = {
        interested: get(list, 'interested.data', []),
        visit: get(list, 'visit.data', []),
        offer: get(list, 'offer.data', []),
      };
      if (list) {
        forEach(list, (deal) => {
          if (deal.stage === 'Interested') {
            deals.interested.push(deal);
          }
          if (deal.stage === 'Visit') {
            deals.visit.push(deal);
          }
          if (deal.stage === 'Offer') {
            deals.offer.push(deal);
          }
        });
      }
      const listsDeal = {
        interested: deals.interested,
        visit: deals.visit,
        offer: deals.offer,
      };
      if (listsDeal.interested.length === 0 &&
        listsDeal.visit.length === 0 &&
        listsDeal.offer.length === 0) {
        setEmptyDeals(true);
      } else {
        setEmptyDeals(false);
      }
      setProcessedDeals(listsDeal);
      if (!filteredDeals) setFilteredDeals(listsDeal);
    }
  };

  useEffect(() => {
    processDeals(activeSinglePropertyDeals);
  }, [activeSinglePropertyDeals]);

  useEffect(() => {
    // Special notification close for alert status
    const checkDoneStatus = notification.filter((item) => item.type === 'done');
    if (checkDoneStatus.length > 0) {
      setPreventExit(false);
    }
  }, [notification]);

  const openDeal = (id) => {
    resetSingleDeal({});
    history.push(`/${activeSingleProperty.id}/prospect/${id}`);
  };

  const createNewDeal = () => {
    resetSingleDeal({});
    history.push(`/${activeSingleProperty.id}/prospects/newDeal`);
  };

  const saveDeal = (deal, type = '') => {
    const data = {
      id: deal.id,
      data: deal,
      type,
    };
    handleSaveDeal(data);
  };

  const archiveDeal = (id, stage, parent) => {
    let section;

    if (stage === 'New') {
      section = 'newSeller';
    }
    if (stage === 'Interested') {
      section = 'interested';
    }
    if (stage === 'Visit') {
      section = 'visits';
    }
    if (stage === 'Offer') {
      section = 'offers';
    }

    const deals = cloneDeep(processedDeals[parent][section]);

    find(deals, (element, key) => {
      if (element.id === id) {
        set(deals[key], 'active', !processedDeals[parent][section][key].active);
        set(deals[key], 'newSeller', false);
        saveDeal(deals[key], 'archive');
      }
    });
  };

  function dragDocuments(order, key) {
    const activeDealsCopy = cloneDeep(processedDeals);
    if (activeDealsCopy[key].length > order.length) setMovedList(key);
    activeDealsCopy[key] = order;
    activeDealsCopy[key].map((deal) => ({...deal, stage: key}));
    setFilteredDeals((prevState) => ({
      ...prevState,
      [key]: activeDealsCopy[key],
    }));
  }
  
  useEffect(() => {
    if (filteredDeals) {
      const convertKey = {
        interested: 'Interested',
        offer: 'Offer',
        visit: 'Visit',
      }
      const activeDealsCopy = cloneDeep(filteredDeals);
      Object.keys(activeDealsCopy).map((key) => {
        let dealToSave = [...activeDealsCopy[key]];
        dealToSave = dealToSave.map((deal) => ({ id: deal.id, stage: convertKey[key] }));
        if (dealToSave.length > activeSinglePropertyDeals[key].total) {
          saveMultipleDeals({ data: dealToSave, smallLoader: 'loadDeal' });
        }
      });
    }
  }, [movedList]);

  const applyFilter = (text, type, direction, company, filterModal) => {
    if (processedDeals) {
      const filterDeals = processedDeals || {};
      const selected = {};
      Object.keys(filterDeals).forEach((key) => {
        const isNew = has(filterModal, 'status') && filterModal.status === 'newSeller';
        const isAll = has(filterModal, 'status') && filterModal.status === 'all';
        const isArchived = has(filterModal, 'status') && filterModal.status === 'archived';
        let filteredDealsByStatus = filterDeals[key].filter((deal) => deal.newSeller === isNew || deal.active === isArchived);
        if (isAll) {
          filteredDealsByStatus = filterDeals[key].filter((deal) => deal.active === true || deal.active === false);
        } else if (isArchived) {
          filteredDealsByStatus = filterDeals[key].filter((deal) => deal.active === false);
        }
        if (isNew) filteredDealsByStatus = filteredDealsByStatus.filter((deal) => deal.newSeller === true);
        selected[key] = filteredDealsByStatus;
      });
      setFilteredDeals(selected);
      setFilterStatus(filterModal);
      setCookie('brixelFilterDeal', get(filterModal, 'status', 'all'));
    }
  };

  useEffect(() => {
    applyFilter(null, null, null, null, filterStatus);
  }, [processedDeals, filterStatus]);

  const mobileTabsDeal = (val) => {
    setActiveTab(val);
  };

  return (
    <div className="deals-container dis-f jc-fs h-perc-lg-100 a-t" id="dealsDashaboard">
      <div className="w-perc-100 dis-fl-col">
        <div className="dealsListings">
          <div className="listings-header bg-white">
            <div className="dis-f jc-b">
              <div className="dis-f jc-fe-md w-perc-100 pt-3 pt-lg-0">
                <div className="dis-fl-row a-c zIndex3 jc-b w-perc-100">
                  <h4 className="ml-md-1 fweight-700 hide-lg">{translateTo('Prospects', lang)}</h4>
                  <h3 className="mb-3 hide dis-b-lg">{translateTo('Prospects', lang)}</h3>
                  <div className="dis-fl-row a-c zIndex3">
                    {
                      !emptyDeals && (
                        <FilterBar
                          lang={lang}
                          sortBarType="deals"
                          activeSortDirection=""
                          activeSortOrderType=""
                          activeSearchText=""
                          filterDeals={filterStatus}
                          applyFilter={(text, type, direction, company, filterModal) => applyFilter(text, type, direction, company, filterModal)}
                          dealsFilter
                        />
                      )
                    }
                    <BrixelButtonIcon
                      icon="plus"
                      className="ml-1"
                      onClick={() => createNewDeal()}
                      label={translateTo('Add Deal', lang)}
                      tooltipWidth="88"
                    />
                  </div>
                </div>
              </div>

            </div>
            {
              windowDimensions.width <= 1024 && (
                <BrixelTabs
                  className="mt-3"
                  labels={[translateTo('Interested', lang), translateTo('Visits', lang), translateTo('Offers', lang)]}
                  clicksList={['interested', 'visits', 'offers']}
                  onClick={(val) => mobileTabsDeal(val)}
                  fullWidth
                />
              )
            }
          </div>
          <div className={`dealsWrapper shadow-1dp p-1 bgWhite brdRadius mt-3 ${emptyDeals ? 'emptyDeals' : ''}`}>
            <div className="titleContainer">
              {
                filteredDeals && Object.keys(filteredDeals).map((key, i) => (

                  <div
                    key={`fltDls_${i.toString()}`}
                    className="rightCol"
                  >
                    <div className="pr-2">
                      <DealsTitle
                        lang={lang}
                        title={translateTo(key, lang)}
                        total={get(filteredDeals, `${key}`, []).length}
                      />
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="dealsContainer">
              <div className="topParent bgWhite">
                <div className="rightCol parentScroll">
                  <div className="scrollContent">
                    {
                      activeSinglePropertyDeals && emptyDeals && smallLoader.loadDeal === false && (
                        <>
                          <div className="emptyMessage min-h-fix-224 dis-f w-perc-100 jc-c">
                            <div className="max-w-fix-544 ta-c p-3 dis-fl-col a-c">
                              <h5>{translateTo('No deals yet?', lang)}</h5>
                              <p className="p-3 txtDark700">
                                {translateTo('Your deals will appear as soon as any interested buyer interacts with your property. Make sure to publish your Brixel Page and your listings to receive deals.', lang)}
                              </p>
                              <BrixelButtonPrimary
                                label={translateTo('Manage listings', lang)}
                                rounded
                                onClick={() => history.push(`/${activeSingleProperty.id}/marketing/page`)}
                              />
                            </div>
                          </div>
      
                        </>
                      )
                    }
                    {
                      filteredDeals && Object.keys(filteredDeals).map((key, o) => (
                        <React.Fragment key={`fltDls_${o.toString()}`}>
                          <div
                            className={`singleCol ${key}`}
                          >
                            <ReactSortable
                              group="groupName"
                              list={filteredDeals[key]}
                              setList={(order) => dragDocuments(order, key)}
                            >
                              {
                                filteredDeals[key].filter((dl) => dl.active).map((singleDeal, k) => (
                                  <div
                                    key={`SingleDeal${k.toString()}`}
                                  >
                                 
                                    <div
                                      id={singleDeal.id}
                                      className="list-item pos-r"
                                    >
                                      <DealsCard
                                        archOnClick={() => archiveDeal(singleDeal.id, singleDeal.stage, key)}
                                        archived={!singleDeal.active}
                                        avatarImg={get(singleDeal, 'user.avatar[0]') ? get(singleDeal, 'user.avatar[0].thumbnailPath', '') : null}
                                        className={`${!singleDeal.active ? 'bgLight100' : 'bgWhite'} dealCard`}
                                        date={DateTime.fromMillis(singleDeal.updatedAt, { locale: lang }).toFormat('dd LLL yy, H:mm')}
                                        feedback={get(singleDeal, 'visitFeedback')}
                                        hasMessage={singleDeal.actionStub}
                                        isNew={get(singleDeal, 'newSeller')}
                                        isWinner={get(singleDeal, 'winner')}
                                        lang={lang}
                                        lastAction={has(singleDeal, 'lastAction') ? singleDeal.lastAction : {}}
                                        name={Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name) === 'No Name' ? get(singleDeal.user, 'email', '') : Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name)}
                                        offer={has(singleDeal, 'closing.stageOffer') ? singleDeal.closing.stageOffer : {}}
                                        parentOnClick={() => openDeal(singleDeal.id)}
                                        profileId={get(singleDeal, 'user.id', '')}
                                        stage={singleDeal.stage}
                                        visit={singleDeal.visit}
                                      />
                                    </div>
                                  </div>
                                ))
                              }
                            </ReactSortable>
                            {
                              filteredDeals[key].filter((dl) => !dl.active).map((singleDeal, k) => (
                                <React.Fragment
                                  key={`SingleDeal${k.toString()}`}
                                >
                                  {
                                    k === 0 && (
                                      <div
                                        className="mb-3 dis-fl-row jc-c"
                                      >
                                        <span className="fsize-200 txtLight400">
                                          {translateTo('Archived', lang)}
                                        </span>
                                      </div>
                                    )
                                  }
  
                                  <div
                                    className="list-item pos-r archived"
                                  >
                                    <DealsCard
                                      archOnClick={() => archiveDeal(singleDeal.id, singleDeal.stage, key)}
                                      archived={!singleDeal.active}
                                      avatarImg={get(singleDeal, 'user.avatar[0]') ? get(singleDeal, 'user.avatar[0].thumbnailPath', '') : null}
                                      className={`${!singleDeal.active ? 'bgLight100' : 'bgWhite'} dealCard`}
                                      date={DateTime.fromMillis(singleDeal.updatedAt, { locale: lang }).toFormat('dd LLL yy, H:mm')}
                                      feedback={get(singleDeal, 'visitFeedback')}
                                      hasMessage={singleDeal.actionStub}
                                      isNew={get(singleDeal, 'newSeller')}
                                      isWinner={get(singleDeal, 'winner')}
                                      lang={lang}
                                      lastAction={has(singleDeal, 'lastAction') ? singleDeal.lastAction : {}}
                                      name={Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name) === 'No Name' ? get(singleDeal.user, 'email', '') : Helpers.userNameVal(singleDeal.user.firstName, singleDeal.user.lastName, singleDeal.user.name)}
                                      offer={has(singleDeal, 'closing.stageOffer') ? singleDeal.closing.stageOffer : {}}
                                      parentOnClick={() => openDeal(singleDeal.id)}
                                      profileId={get(singleDeal, 'user.id', '')}
                                      stage={singleDeal.stage}
                                      visit={singleDeal.visit}
                                    />
                                  </div>
                                </React.Fragment>
                              ))
                            }
                          </div>
                        </React.Fragment>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Deals.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDeals: PropTypes.object,
  handleGetPageDeals: PropTypes.func.isRequired,
  handleSaveDeal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  notification: PropTypes.arrayOf(PropTypes.object).isRequired,
  resetSingleDeal: PropTypes.func.isRequired,
  saveMultipleDeals: PropTypes.func.isRequired,
  setActiveSinglePropertyDeals: PropTypes.func.isRequired,
  setPreventExit: PropTypes.func.isRequired,
  smallLoader: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

Deals.defaultProps = {
  activeSinglePropertyDeals: null,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDeals: get(state, 'property.activeSinglePropertyDeals', null),
  formValue: get(state, 'brixelForm.Property.values', {}),
  initialValues: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
  notification: get(state, 'common.notification', []),
  smallLoader: get(state, 'common.isSmallLoading', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetPageDeals: bindActionCreators(getPageDeals, dispatch),
  handleSaveDeal: bindActionCreators(saveActiveSingleDeal, dispatch),
  resetSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  saveMultipleDeals: bindActionCreators(updateDealsOrder, dispatch),
  setActiveSinglePropertyDeals: bindActionCreators(setPageDeals, dispatch),
  setPreventExit: bindActionCreators(preventExitFromScreen, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Deals);
