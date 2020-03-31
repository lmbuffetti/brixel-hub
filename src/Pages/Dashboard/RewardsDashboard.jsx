/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox, BrixelIcon, BrixelButtonIcon } from '@brixel/brixel-components';
import { getAchievement, getGamegroup, getGameHistory, addGameHistory } from '../../actions/GamificationActions';
import Loading from '../../components/Loading';
import { GameGroupConfig } from '../../constants/global';
import brixels from '../../images/BrxielComingTown/brixels.svg';

import SuccessMarketCheck from '../GameHistory/MarketChecker/SuccessMarketCheck';
import SuccessBestimate from '../GameHistory/Bestimate/SuccessBestimate';
import SuccessAssessor from '../GameHistory/Assessor/SuccessAssessor';
import SuccessHomebase from '../GameHistory/Homebase/SuccessHomebase';

const RewardsDashboard = (props) => {
  // PROPS
  const {
    awards,
    brixelPoints,
    userTypes,
    gameGroup,
    gameHistory,
    handleGetAchievement,
    handleGetGamegroup,
    handleAddGameHistory,
    history,
    loggedInUser,
    match,
    property,
    windowDimensions,
  } = props;
  // STATE
  const [usrGroups, setUsrGroups] = useState(gameGroup);
  const [activeGameGroup, setActiveGameGroup] = useState(null);
  const [activeAchievement, setActiveAchievement] = useState(null);
  // PARAMS URL
  const rewardType = last(get(history, 'location.pathname', '').split('/')).replace('-done', '');
  const propID = get(match, 'params.propId', '');
  const gameHistoryData = get(gameHistory, 'data', null);

  useEffect(() => {
    handleGetAchievement();
    handleGetGamegroup();
    // handleGetGameHistory();
  }, []);

  useEffect(() => {
    if (windowDimensions && windowDimensions.width > 768 && rewardType === 'rewards') {
      history.push({pathname: `/${propID}/rewards/homebase` });
      setActiveGameGroup('homebase');
    }
  }, [windowDimensions, rewardType]);

  useEffect(() => {
    let filtUsrGroup = [];
    filtUsrGroup = gameGroup.filter((val) => val.stub.indexOf(userTypes) !== -1);
    if (gameHistory.data) {
      // CHECK IF DONE HOMEBASE
      gameHistory.data.map((game) => {
        filtUsrGroup.map((group, f) => {
          const idGroup = group.achievements.findIndex(val => val.stub === game.achievement.stub && property.id === game.page);
          if (idGroup >= 0) filtUsrGroup[f].achievements[idGroup].done = true;
          return null;
        });
        return null;
      })
    }
    setUsrGroups([...filtUsrGroup]);
  }, [userTypes, property, gameGroup, gameHistory]);

  useEffect(() => {
    if (gameHistory.data && property.id) {
      // CHECK IF DONE HOMEBASE
      const getHomeBase = gameHistory.data.findIndex(val => val.achievement.stub === 'homebase' && property.id === val.page);
      if (getHomeBase === -1 && userTypes === 'seller') {
        const data = {
          id: loggedInUser.user.id,
          page: property.stub,
          achievement: 'homebase',
        };
        handleAddGameHistory(data);
      }
    }
  }, [property, gameHistory, userTypes]);

  useEffect(() => {
    if (gameHistory.data && rewardType && rewardType !== 'rewards') {
      let selectEl;
      selectEl = gameHistory.data.find(el => el.achievement.stub === rewardType && el.page === property.id);
      if (typeof selectEl !== 'undefined') {
        selectEl.done = true;
      } else {
        usrGroups.map((item) => {
          if (!selectEl) selectEl = item.achievements.find(el => el.stub === rewardType);
          return null;
        })
      }
      setActiveGameGroup(rewardType);
      setActiveAchievement(selectEl);
    } else {
      setActiveGameGroup(null);
      setActiveAchievement(null);
    }
  }, [gameHistoryData, usrGroups, history]);

  const onClickAchievement = (game, achievement) => {
    setActiveGameGroup(game);
    history.push({pathname: `/${propID}/rewards/${game}` });
    setActiveAchievement(achievement);
  };

  const closeAchievement = () => {
    history.push(`/${propID}/rewards`);
    setActiveAchievement(null);
    setActiveGameGroup(null);
  };

  if (!property.id && !userTypes) {
    return <Loading />
  }

  const calcHeaderHeight = () => {
    const head = document.getElementsByClassName('hubDasHeader');
    const wrapper = document.getElementById('dashboard');
    let paddingTop = 0;
    let paddingBottom = 0;
    if (wrapper) {
      paddingTop = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-top').replace('px', '');
      paddingBottom = document.defaultView.getComputedStyle(wrapper, "").getPropertyValue('padding-bottom').replace('px', '');
    }
    const heightContent = head[0] ? head[0].offsetHeight : 0;
    return heightContent + +paddingTop + +paddingBottom;
  };

  return (
    <div className={`rewards-container dis-f ${rewardType === 'rewards' ? 'jc-c' : 'jc-b'}`} id="rewardsDashboard">
      {
        usrGroups && (
          <>
            {
              usrGroups.map((group, i) => (
                <div className="firstLevel mr-md-2" key={i.toString()}>
                  {
                    GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`] && (
                      <>
                        {
                          i === 0 ? (
                            <div className="dis-f jc-b a-c mb-3">
                              <span className="fsize-400 dis-b txtDark700 fweight-500">
                                {GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`].name}
                              </span>
                              <div className="dis-f a-c">
                                {
                                  awards >= 0 && (
                                    <div className="cur-poi">
                                      <BrixelIcon icon="cup-awards" color="green" />
                                      <span className="ff-mono txtDark700">{awards}</span>
                                    </div>
                                  )
                                }
                                {
                                  brixelPoints >= 0 && (
                                    <div className="cur-poi ml-2">
                                      <img src={brixels} alt="icon awards" className="mr-1" />
                                      <span className="ff-mono txtDark700">{brixelPoints}</span>
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                          ) : (
                            <span className="mb-3 fsize-400 dis-b txtDark700 fweight-500">
                              {GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`].name}
                            </span>
                          )
                        }

                        <div key={i.toString()} className="pl-5 pos-r">
                          <div className="timelineBar" />
                          {
                            group.achievements && group.achievements.map((item, f) => (
                              <div key={f.toString()} className="pos-r">
                                <span className={item.done ? "dotTimelineDone" : "dotTimeline"} />
                                {
                                  ((property.location && ((property.location.countryCode !== 'CH' && item.stub === 'bestimate') || (property.location.countryCode !== 'CH' && property.location.countryCode !== 'PT' && item.stub === 'market-checker')))) ? (
                                    <BrixelButtonBox
                                      icon={item.icon}
                                      label={item.name}
                                      subtitle={item.description}
                                      subtitleClass="fsize-200 txtLight400 mt-1"
                                      background="light100"
                                      className="mb-2 w-perc-100 opacity5 p-2"
                                      colorIcon={GameGroupConfig[`${userTypes}Level${group.stub.replace( /^\D+/g, '')}`].iconColor}
                                      backIcon="light200 mr-1"
                                      roundIcon
                                      multilineInfo={[
                                        {label: 'Coming', color: 'Light400 fsize-200 pt-1 dis-b'},
                                        {label: 'soon', color: 'Light400 fsize-200 pt-1 dis-b'},
                                      ]}
                                    />
                                  ) : (
                                    <>
                                      {
                                        item.stub === activeGameGroup ? (
                                          <BrixelButtonBox
                                            icon={item.done ? 'check' : item.icon}
                                            label={item.name}
                                            subtitle={item.description}
                                            subtitleClass="fsize-200 txtLight400 mt-1"
                                            background={'white'}
                                            className={`shadow-1dp mb-2 w-perc-100 py-2 px-1 brdPrimary400 brdMedium ${item.done ? '' : 'shadow-2dp'}`}
                                            colorIcon={item.done ? 'green400'  : GameGroupConfig[`${userTypes}Level${group.stub.replace( /^\D+/g, '')}`].iconColor}
                                            backIcon={`${item.done ? 'light200' : GameGroupConfig[`${userTypes}Level${group.stub.replace( /^\D+/g, '')}`].backColor} mr-1`}
                                            paddingIconClass="fSizePx24 p-small-12 mr-2"
                                            multilineInfo={[
                                              item.done ? {icon: 'cup-awards', color: 'green400'} : {label: 'free', color: 'green400'},
                                              {label: item.points, color: 'Light400 fsize-200 pt-1 dis-b'},
                                            ]}
                                            roundIcon
                                            selected={item.stub === activeGameGroup}
                                            onClick={() => onClickAchievement(item.stub, item)}
                                            //onClick={() => history.push(`/${property.id}/rewards/achievement/${item.stub}`)}
                                          />
                                        ) : (
                                          <BrixelButtonBox
                                            icon={item.done ? 'check' : item.icon}
                                            label={item.name}
                                            subtitle={item.description}
                                            subtitleClass="fsize-200 txtLight400 mt-1"
                                            background={item.done ? 'light100' : GameGroupConfig[`${userTypes}Level${group.stub.replace( /^\D+/g, '')}`].color}
                                            className={`shadow-1dp mb-2 w-perc-100 py-2 px-1 brdTrans brdMedium ${item.done ? '' : 'shadow-2dp'}`}
                                            colorIcon={item.done ? 'green400'  : GameGroupConfig[`${userTypes}Level${group.stub.replace( /^\D+/g, '')}`].iconColor}
                                            backIcon={`${item.done ? 'light200' : GameGroupConfig[`${userTypes}Level${group.stub.replace( /^\D+/g, '')}`].backColor} mr-1`}
                                            paddingIconClass="fSizePx24 p-small-12 mr-2"
                                            multilineInfo={[
                                              item.done ? {icon: 'cup-awards', color: 'green400'} : {label: 'free', color: 'green400'},
                                              {label: item.points, color: 'Light400 fsize-200 pt-1 dis-b'},
                                            ]}
                                            roundIcon
                                            selected={item.stub === activeGameGroup}
                                            onClick={() => onClickAchievement(item.stub, item)}
                                            //onClick={() => history.push(`/${property.id}/rewards/achievement/${item.stub}`)}
                                          />
                                        )
                                      }
                                    </>
                                  )
                                }
                              </div>
                            ))
                          }
                        </div>
                      </>
                    )
                  }
                </div>
              ))
            }
          </>
        )
      }
      {
        activeGameGroup && rewardType !== 'rewards' && (
          <div className="secondLevel h-perc-100 w-perc-100 dis-fl-col ml-md-1" style={{ height: windowDimensions.height - calcHeaderHeight() }}>
            <>
              <div className="headerSection hide-md p-1">
                <div className="pos-r">
                  <BrixelButtonIcon
                    className="shadow-2dp"
                    icon="close-small"
                    color="primary"
                    saturationTxt={400}
                    bgTransparent
                    noBorder
                    onClick={() => closeAchievement()}
                  />
                  <h5>{activeGameGroup.replace('-', ' ')}</h5>
                </div>
              </div>
              <div className="pt-4 p-md-4">
                {activeGameGroup === 'homebase' && (<SuccessHomebase gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
                {activeGameGroup === 'market-checker' && (<SuccessMarketCheck gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
                {activeGameGroup === 'bestimate' && (<SuccessBestimate gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
                {activeGameGroup === 'assessor' && (<SuccessAssessor gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
              </div>
            </>
          </div>
        )
      }
    </div>
  )
};

RewardsDashboard.propTypes = {
  userTypes: PropTypes.string,
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  gameHistory: PropTypes.object,
  handleGetAchievement: PropTypes.func.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  handleGetGameHistory: PropTypes.func.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  awards: PropTypes.number,
  brixelPoints: PropTypes.number,
  windowDimensions: PropTypes.object.isRequired,
};

RewardsDashboard.defaultProps = {
  gameGroup: [],
  gameHistory: {},
};

const mapStateToProps = (state) => ({
  userTypes: get(state, 'user.userTypes', null),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  awards: get(state, 'user.awards', []),
  property: get(state, 'property.activeSingleProperty', {}),
  brixelPoints: get(state, 'user.brixelPoints', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetAchievement: bindActionCreators(getAchievement, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleGetGameHistory: bindActionCreators(getGameHistory, dispatch),
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(RewardsDashboard);
