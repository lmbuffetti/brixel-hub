/* eslint-disable react/jsx-no-bind */
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelTabs, Helpers, translateTo } from '@brixel/brixel-components';
import { has } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
// import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import set from 'lodash/set';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { preventExitFromScreen } from '../../actions/CommonActions';
import { saveActiveSingleDeal, setActiveSingleDeal, updateDealsOrder } from '../../actions/DealActions';
import { getPageDeals, setPageDeals } from '../../actions/PropertyActions';
import DealsCard from '../../components/Cards/DealsCard';
import DealsTitle from '../../components/DealsTitle';
import FilterBar from '../../components/FilterBar';
import DealSkelton from '../../images/deals-skelton.svg';
import { getCookie, setCookie } from '../../utils/helpers';

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
        visits: get(list, 'visit.data', []),
        offers: get(list, 'offer.data', []),
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
      // deals.interested = orderBy(deals.interested, ['active', 'updatedAt'], ['desc', 'desc']);
      // deals.visits = orderBy(deals.visits, ['active', 'updatedAt'], ['desc', 'desc']);
      // deals.offers = orderBy(deals.offers, ['active', 'updatedAt'], ['desc', 'desc']);
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
    setEmptyDeals(true);
    // Adding again parent scroll due to library constaints
    const body = document.getElementById('bodyScroll');
    body.classList.remove('ov-h');

    return saveMultipleDeals({ data: resultArray, smallLoader: 'loadDeal' });
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
    // Remove parent scroll due to library constaints
    const body = document.getElementById('bodyScroll');
    body.classList.add('ov-h');

    const source = get(result, 'source.droppableId', '');
    const sourceIndex = get(result, 'source.index', '');
    const originCol = source.replace('right.', '');
    setActiveOrgColumn(originCol);
    setActiveIndexDeal(sourceIndex);

    // Adding again parent scroll due to library constaints
    const body2 = document.getElementById('bodyScroll');
    body2.classList.remove('ov-h');
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
                    className={key === 'right' ? 'rightCol' : 'leftCol'}
                  >
                    {
                      filteredDeals[key] && Object.keys(filteredDeals[key]).map((subkey, f) => (
                        <React.Fragment key={`fltDls_${f.toString()}`}>
                          {
                            (!activeTab || activeTab === subkey) && (
                              <div className="pr-2">
                                <DealsTitle
                                  lang={lang}
                                  title={translateTo(subkey, lang)}
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
                    <React.Fragment key={`fltDls_${o.toString()}`}>
                      <div className={key === 'right' ? 'topParent bgWhite' : 'leftCol'}>
                        <div className={`${key === 'right' ? 'rightCol parentScroll' : ''} dis-fl-col w-perc-100 h-perc-100`}>
                          <div className="scrollContent">
                            {
                              activeSinglePropertyDeals && emptyDeals && smallLoader.loadDeal === false && (
                                <div className="emptyMessage dis-f w-perc-100 jc-c">
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
                              )
                            }
                            {
                              filteredDeals[key] && Object.keys(filteredDeals[key]).map((subkey, m) => (
                                <React.Fragment key={`subFltDls_${m.toString()}`}>
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
                                                  (emptyDeals && smallLoader.loadDeal) && (
                                                    <>
                                                      <span className="fweight-500 fsize-500 txtLight400 mb-3 tt-c dis-b">{translateTo(subkey, lang)}</span>
                                                      <img loading="lazy" src={DealSkelton} alt="skelton deals" />
                                                      { subkey === 'interested' && (<img loading="lazy" className="mt-3 mb-2" src={DealSkelton} alt="skelton deals" />)}
                                                    </>
                                                  )
                                                }
                                                {
                                                  get(filteredDeals[key], subkey, []).filter((deal) => deal.active).map((item, k) => (
                                                    <Fragment key={`cldFltDls_${k.toString()}`}>
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
                                                                archOnClick={() => archiveDeal(item.id, item.stage, key)}
                                                                archived={!item.active}
                                                                avatarImg={get(item, 'user.avatar[0]') ? get(item, 'user.avatar[0].thumbnailPath', '') : null}
                                                                className={`${!item.active ? 'bgLight100' : 'bgWhite'} dealCard`}
                                                                date={DateTime.fromMillis(item.updatedAt, { locale: lang }).toFormat('dd LLL yy, H:mm')}
                                                                feedback={get(item, 'visitFeedback')}
                                                                hasMessage={item.actionStub}
                                                                isNew={get(item, 'newSeller')}
                                                                isWinner={get(item, 'winner')}
                                                                lang={lang}
                                                                lastAction={has(item, 'lastAction') ? item.lastAction : {}}
                                                                name={Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name) === 'No Name' ? get(item.user, 'email', '') : Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name)}
                                                                offer={has(item, 'closing.stageOffer') ? item.closing.stageOffer : {}}
                                                                parentOnClick={() => openDeal(item.id)}
                                                                profileId={get(item, 'user.id', '')}
                                                                stage={item.stage}
                                                                visit={item.visit}
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
                                                    <React.Fragment key={`cldsFltDls_${j.toString()}`}>
                                                      {
                                                        j === 0 && (
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
                                                        className={`list-item pos-r ${!item.active ? 'archived' : ''}`}
                                                      >
                                                        <DealsCard
                                                          archOnClick={() => archiveDeal(item.id, item.stage, key)}
                                                          archived={!item.active}
                                                          avatarImg={get(item, 'user.avatar[0]') ? get(item, 'user.avatar[0].thumbnailPath', '') : null}
                                                          className={!item.active ? 'bgLight100' : 'bgWhite'}
                                                          date={DateTime.fromMillis(item.updatedAt, { locale: lang }).toFormat('dd LLL yy, H:mm')}
                                                          hasMessage={item.actionStub}
                                                          isNew={get(item, 'newSeller')}
                                                          isWinner={get(item, 'winner')}
                                                          lang={lang}
                                                          lastAction={has(item, 'lastAction') ? item.lastAction : {}}
                                                          name={Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name) === 'No Name' ? get(item.user, 'email', '') : Helpers.userNameVal(item.user.firstName, item.user.lastName, item.user.name)}
                                                          parentOnClick={() => openDeal(item.id)}
                                                          profileId={get(item, 'user.id', '')}
                                                          stage={item.stage}
                                                          visit={item.visit}
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
