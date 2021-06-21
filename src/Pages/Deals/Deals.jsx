import React, {
  useEffect, useState, Fragment,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import get from 'lodash/get';
import set from 'lodash/set';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import { DateTime } from 'luxon';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelTabs, Helpers,
} from '@brixel/brixel-components';
import {
  bindActionCreators, compose,
} from 'redux';
import {
  DragDropContext, Droppable, Draggable,
} from 'react-beautiful-dnd';
import {
  has,
} from 'lodash';
import {
  getPageDeals, setPageDeals,
} from '../../actions/PropertyActions';
import {
  setActiveSingleDeal, saveActiveSingleDeal, updateDealsOrder,
} from '../../actions/DealActions';
import {
  preventExitFromScreen,
} from '../../actions/CommonActions';
import DealsCard from '../../components/DealsCard';
import DealsTitle from '../../components/DealsTitle';
import FilterBar from '../../components/FilterBar';
import {
  setCookie, getCookie,
} from '../../utils/helpers';
import DealSkelton from '../../images/deals-skelton.svg';

const Deals = (props) => {
  const [processedDeals, setProcessedDeals] = useState(null);
  const [activeDestColumn, setActiveDestColumn] = useState(null);
  const [activeIndexDeal, setActiveIndexDeal] = useState(-1);
  const [activeOrgColumn, setActiveOrgColumn] = useState(null);
  const [filteredDeals, setFilteredDeals] = useState(null);
  const [emptyDeals, setEmptyDeals] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [filterStatus, setFilterStatus] = useState({
    status: getCookie('brixelFilterDeal') || 'all',
  });

  // PROPS
  const {
    activeSingleProperty,
    activeSinglePropertyDeals,
    handleGetPageDeals,
    handleSaveDeal,
    history,
    match,
    notification,
    resetSingleDeal,
    saveMultipleDeals,
    setActiveSinglePropertyDeals,
    setPreventExit,
    userLang,
    windowDimensions,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

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
    if (activeSingleProperty.id) {
      const data = {
        id: activeSingleProperty.id,
        smallLoader: 'loadDeal',
      };
      handleGetPageDeals(data);
    }
  }, [activeSingleProperty]);

  const processDeals = (list) => {
    if (activeSinglePropertyDeals) {
      const deals = {
        interested: get(list, 'right.interested', []),
        visits: get(list, 'right.visits', []),
        offers: get(list, 'right.offers', []),
      };
      if (!get(list, 'right', null)) {
        forEach(list, (deal) => {
          if (deal.stage === 'Interested') {
            deals.interested.push(deal);
          }
          if (deal.stage === 'Visit') {
            deals.visits.push(deal);
          }
          if (deal.stage === 'Offer') {
            deals.offers.push(deal);
          }
        });
      }
      deals.interested = orderBy(deals.interested, ['active', 'updatedAt'], ['desc', 'desc']);
      deals.visits = orderBy(deals.visits, ['active', 'updatedAt'], ['desc', 'desc']);
      deals.offers = orderBy(deals.offers, ['active', 'updatedAt'], ['desc', 'desc']);
      // TODO remove right object
      const listsDeal = {
        right: {
          interested: deals.interested,
          visits: deals.visits,
          offers: deals.offers,
        },
      };
      if (listsDeal.right.interested.length === 0 &&
        listsDeal.right.visits.length === 0 &&
        listsDeal.right.offers.length === 0) {
        setEmptyDeals(true);
      } else {
        setEmptyDeals(false);
      }
      setProcessedDeals(listsDeal);
      setFilteredDeals(listsDeal);
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
    history.push(`${match.url}/${id}/deal`);
  };

  const createNewDeal = () => {
    resetSingleDeal({});
    history.push(`${match.url}/newDeal`);
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

  function onDragEnd(result) {
    const activeDealsCopy = cloneDeep(processedDeals);
    setActiveDestColumn(null);
    setActiveIndexDeal(-1);
    // dropped outside the list
    if (!get(result, 'destination.droppableId', null)) {
      return false;
    }
    const source = get(result, 'source.droppableId', '');
    const sourceIndex = get(result, 'source.index', '');
    const destination = get(result, 'destination.droppableId', '');
    const destinationIndex = get(result, 'destination.index', '');
    const sourceElement = get(activeDealsCopy, source, null);
    const originalElement = get(sourceElement, sourceIndex, null);

    if (source === destination) return false;
    if (get(activeDealsCopy, `${source}[${sourceIndex}].active`, null) !== true) return false;
    activeDealsCopy[source.split('.')[0]][source.split('.')[1]].splice(sourceIndex, 1);
    activeDealsCopy[destination.split('.')[0]][destination.split('.')[1]].splice(destinationIndex, 0, originalElement);
    activeDealsCopy[destination.split('.')[0]][destination.split('.')[1]][destinationIndex].orderInGroup = destinationIndex;

    processDeals(activeDealsCopy);

    if (source !== destination) {
      let stage;
      if (destination.split('.')[1] === 'newSeller') {
        stage = 'New';
      }
      if (destination.split('.')[1] === 'interested') {
        stage = 'Interested';
      }
      if (destination.split('.')[1] === 'visits') {
        stage = 'Visit';
      }
      if (destination.split('.')[1] === 'offers') {
        stage = 'Offer';
      }
      if (activeDealsCopy[destination.split('.')[0]][destination.split('.')[1]][destinationIndex].newSeller === true) {
        activeDealsCopy[destination.split('.')[0]][destination.split('.')[1]][destinationIndex].newSeller = false;
      }
      activeDealsCopy[destination.split('.')[0]][destination.split('.')[1]][destinationIndex].stage = stage;
    }

    const resultArray = [];

    activeDealsCopy[destination.split('.')[0]][destination.split('.')[1]].forEach((el) => {
      const singleDeal = {
        id: el.id,
        stage: el.stage,
        newSeller: el.newSeller,
      };
      resultArray.push(singleDeal);
    });

    return saveMultipleDeals(resultArray);
  }

  const calcHeightCard = (id) => {
    const getOriginalElement = document.getElementById(id);
    const getDestElement = document.getElementById(`emptyCard_${id}`);
    if (getOriginalElement && getDestElement) {
      return getOriginalElement.clientHeight;
    }
    return 0;
  };

  function onDragStart(result) {
    const source = get(result, 'source.droppableId', '');
    const sourceIndex = get(result, 'source.index', '');
    const originCol = source.replace('right.', '');
    setActiveOrgColumn(originCol);
    setActiveIndexDeal(sourceIndex);
  }

  function onDragUpdate(result) {
    const source = get(result, 'source.droppableId', '');
    const destination = get(result, 'destination.droppableId', '');
    if (activeIndexDeal > -1) calcHeightCard(`${activeOrgColumn}-${activeIndexDeal}`);
    if (source !== destination) {
      const destinationCol = destination.replace('right.', '');
      const originCol = source.replace('right.', '');
      setActiveDestColumn(destinationCol);
      setActiveOrgColumn(originCol);
    }
  }

  useEffect(() => {
    if (activeIndexDeal > -1) calcHeightCard(`${activeOrgColumn}-${activeIndexDeal}`);
  }, [activeIndexDeal, activeOrgColumn]);

  const applyFilter = (text, type, direction, company, filterModal) => {
    if (processedDeals) {
      const filterDeals = get(processedDeals, 'right', {});
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
      setFilteredDeals({
        right: selected,
      });
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
    <div className="dealsListings">
      <div className="listings-header bg-white">
        <div className="dis-f jc-b backPanel">
          <h5 className="sectionTitle">Buyers</h5>
          <div className="fixedIcon dis-f jc-fe-md w-perc-100">
            <BrixelButtonIcon
              className="hide-md"
              icon="arrow-left-small"
              theme="dark"
              ghost
              onClick={() => history.push(`/${propID}/deals`)}
            />
            <div className="dis-fl-row a-c zIndex3">
              {
                !emptyDeals && (
                  <FilterBar
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
                label="Add Deal"
                tooltipWidth="88"
              />
            </div>
          </div>

        </div>
        {
          windowDimensions.width <= 1024 && (
            <BrixelTabs
              className="mt-2"
              labels={['Interested', 'Visits', 'Offers']}
              clicksList={['interested', 'visits', 'offers']}
              onClick={(val) => mobileTabsDeal(val)}
              fullWidth
            />
          )
        }
      </div>
      <div className={`dealsWrapper ${emptyDeals ? 'emptyDeals' : ''}`}>
        <div className="titleContainer">
          {
            filteredDeals && Object.keys(filteredDeals).map((key, i) => (

              <div
                key={i.toString()}
                className={key === 'right' ? 'rightCol' : 'leftCol'}
              >
                {
                  filteredDeals[key] && Object.keys(filteredDeals[key]).map((subkey, f) => (
                    <React.Fragment key={f.toString()}>
                      {
                        (!activeTab || activeTab === subkey) && (
                          <div className="pr-2">
                            <DealsTitle
                              title={subkey}
                              total={get(filteredDeals, `${key}.${subkey}`, []).length}
                            />
                          </div>
                        )
                      }
                    </React.Fragment>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div className="dealsContainer">
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
          >
            {
              filteredDeals && Object.keys(filteredDeals).map((key, o) => (
                <React.Fragment key={o.toString()}>
                  <div className={key === 'right' ? 'topParent bgWhite' : 'leftCol'}>
                    <div className={`${key === 'right' ? 'rightCol parentScroll' : ''} dis-fl-col w-perc-100 h-perc-100`}>
                      <div className="scrollContent">
                        {
                          activeSinglePropertyDeals && emptyDeals && (
                            <div className="emptyMessage dis-f w-perc-100 jc-c">
                              <div className="max-w-fix-544 ta-c p-3 dis-fl-col a-c">
                                <h5> No deals yet?</h5>
                                <p className="p-3 txtDark700">
                                  Your deals will appear as soon as any interested buyer interacts with your property. Make sure to publish your Brixel Page and your listings to receive deals.
                                </p>
                                <BrixelButtonPrimary
                                  label="Manage listings"
                                  rounded
                                  onClick={() => history.push(`/${activeSingleProperty.id}/listings/page`)}
                                />
                              </div>
                            </div>
                          )
                        }
                        {
                          filteredDeals[key] && Object.keys(filteredDeals[key]).map((subkey, m) => (
                            <React.Fragment key={m.toString()}>
                              {
                                (!activeTab || activeTab === subkey) && (
                                  <div
                                    className={`singleCol ${activeDestColumn === subkey ? 'active' : ''} ${activeOrgColumn !== subkey ? 'blockAnimation' : ''} ${subkey}`}
                                    style={{
                                      /* flex: `0 0 calc(${100 / Object.keys(processedDeals[key]).length}% + 32px)`, */
                                      /* left: `${20 * (-f - 1)}px`, */
                                    }}
                                  >
                                    <Droppable droppableId={`${key}.${subkey}`}>
                                      {
                                        (provided) => (
                                          <div
                                            className="listWrapper"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                          >
                                            {
                                              emptyDeals && (
                                                <>
                                                  <span className="fweight-500 fsize-500 txtLight400 mb-3 tt-c dis-b">{subkey}</span>
                                                  <img src={DealSkelton} alt="skelton deals" />
                                                  { subkey === 'interested' && (<img className="mt-3 mb-2" src={DealSkelton} alt="skelton deals" />)}
                                                </>
                                              )
                                            }
                                            {
                                              get(filteredDeals[key], subkey, []).filter((deal) => deal.active).map((item, k) => (
                                                <Fragment key={k.toString()}>
                                                  {
                                                    activeIndexDeal === k && activeOrgColumn === subkey && (
                                                      <div className={`list-item pos-r ${!item.active ? 'archived' : ''}`}>
                                                        <div
                                                          id={`emptyCard_${subkey}-${k}`}
                                                          className="emptyCard mb-2"
                                                          style={{
                                                            height: calcHeightCard(`${subkey}-${k}`),
                                                          }}
                                                        />
                                                      </div>
                                                    )
                                                  }
                                                  <Draggable
                                                    draggableId={`${subkey}-${k}`}
                                                    index={k}
                                                  >
                                                    {
                                                      (provided2) => (
                                                        <div
                                                          id={`${subkey}-${k}`}
                                                          ref={provided2.innerRef}
                                                          {...provided2.draggableProps}
                                                          {...provided2.dragHandleProps}
                                                          className={`list-item pos-r ${!item.active ? 'archived' : ''} ${activeIndexDeal === k && activeOrgColumn === subkey ? 'enabled' : ''}`}
                                                        >
                                                          <DealsCard
                                                            avatarImg={get(item, 'user.avatar[0]') ? get(item, 'user.avatar[0].thumbnailPath', '') : null}
                                                            className={`${!item.active ? 'bgLight100' : 'bgWhite'} dealCard`}
                                                            profileId={get(item, 'user.id', '')}
                                                            name={Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name) === 'No Name' ? get(item.user, 'email', '') : Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name)}
                                                            hasMessage={item.actionStub}
                                                            date={DateTime.fromMillis(item.updatedAt, { locale: userLang }).toFormat('dd LLL yy, H:mm')}
                                                            parentOnClick={() => openDeal(item.id)}
                                                            archOnClick={() => archiveDeal(item.id, item.stage, key)}
                                                            archived={!item.active}
                                                            isWinner={get(item, 'winner')}
                                                            isNew={get(item, 'newSeller')}
                                                            lastAction={has(item, 'lastAction') ? item.lastAction : {}}
                                                          />
                                                        </div>
                                                      )
                                                    }
                                                  </Draggable>
                                                </Fragment>
                                              ))
                                            }
                                            {provided.placeholder}
                                            {
                                              get(filteredDeals[key], subkey, []).filter((deal) => !deal.active).map((item, j) => (
                                                <React.Fragment key={j.toString()}>
                                                  {
                                                    j === 0 && (
                                                      <div
                                                        className="mb-3 dis-fl-row jc-c"
                                                      >
                                                        <span className="fsize-200 txtLight400">
                                                          Archived
                                                        </span>
                                                      </div>
                                                    )
                                                  }
                                                  <div
                                                    className={`list-item pos-r ${!item.active ? 'archived' : ''}`}
                                                  >
                                                    <DealsCard
                                                      avatarImg={get(item, 'user.avatar[0]') ? get(item, 'user.avatar[0].thumbnailPath', '') : null}
                                                      className={!item.active ? 'bgLight100' : 'bgWhite'}
                                                      profileId={get(item, 'user.id', '')}
                                                      name={Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name) === 'No Name' ? get(item.user, 'email', '') : Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name)}
                                                      hasMessage={item.actionStub}
                                                      date={DateTime.fromMillis(item.updatedAt, { locale: userLang }).toFormat('dd LLL yy, H:mm')}
                                                      parentOnClick={() => openDeal(item.id)}
                                                      archOnClick={() => archiveDeal(item.id, item.stage, key)}
                                                      archived={!item.active}
                                                      isWinner={get(item, 'winner')}
                                                      isNew={get(item, 'newSeller')}
                                                      lastAction={has(item, 'lastAction') ? item.lastAction : {}}
                                                    />
                                                  </div>
                                                </React.Fragment>
                                              ))
                                            }
                                          </div>
                                        )
                                      }
                                    </Droppable>
                                  </div>
                                )
                              }
                            </React.Fragment>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            }
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

Deals.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDeals: PropTypes.arrayOf(PropTypes.object),
  handleGetPageDeals: PropTypes.func.isRequired,
  handleSaveDeal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  notification: PropTypes.arrayOf(PropTypes.object).isRequired,
  resetSingleDeal: PropTypes.func.isRequired,
  saveMultipleDeals: PropTypes.func.isRequired,
  setActiveSinglePropertyDeals: PropTypes.func.isRequired,
  setPreventExit: PropTypes.func.isRequired,
  userLang: PropTypes.string.isRequired,
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
  notification: get(state, 'common.notification', []),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Deals);
