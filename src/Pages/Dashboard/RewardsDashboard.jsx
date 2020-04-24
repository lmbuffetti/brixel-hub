/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, BrixelButtonIcon } from '@brixel/brixel-components';
import { getAchievement, getGamegroup, getGameHistory, addGameHistory } from '../../actions/GamificationActions';
import Loading from '../../components/Loading';
import { GameGroupConfig } from '../../constants/global';
import helloImg from '../../images/hello.svg';
import BrixelButtonAchievement from '../../components/BrixelButtonAchievement';
import { setCookie, getCookie, sortObject } from '../../utils/helpers';

import SuccessMarketCheck from '../GameHistory/MarketChecker/SuccessMarketCheck';
import SuccessBestimate from '../GameHistory/Bestimate/SuccessBestimate';
import SuccessAssessor from '../GameHistory/Assessor/SuccessAssessor';
import SuccessHomebase from '../GameHistory/Homebase/SuccessHomebase';

const RewardsDashboard = (props) => {
  // PROPS
  const {
    userTypes,
    formValue,
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
      history.push({pathname: `/${propID}/rewards/market-checker` });
      setActiveGameGroup('market-checker');
    }
  }, [windowDimensions, rewardType]);

  useEffect(() => {
    let filtUsrGroup = [];
    filtUsrGroup = gameGroup.filter((val) => val.stub.indexOf(userTypes) !== -1);
    filtUsrGroup = filtUsrGroup.sort(sortObject('stub', 'asc'));
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

  const isDisabledFlow = (game) => {
    let disabled = false;
    if (game === 'market-checker' && (get(formValue, 'location.countryCode', null) !== 'CH' && get(formValue, 'location.countryCode', null) !== 'PT')) {
      disabled = true;
    }
    if (game === 'bestimate' && get(formValue, 'location.countryCode', null) !== 'CH') {
      disabled = true;
    }
    return disabled;
  };

  if (!property.id && !userTypes) {
    return <Loading />
  }

  return (
    <div className={`rewards-container`} id="rewardsDashboard">
      {
        getCookie('brixelSayHello') && JSON.parse(getCookie('brixelSayHello')) !== true && (
          <div className="brdRadius bgWhite p-1 dis-f jc-b a-c p-1 p-md-2 mb-5">
            <img src={helloImg} alt="Hell User" />
            <div className="txtDark700 w-perc-100 pl-3">
              <span>Hello {loggedInUser.user.firstName}!</span><br />
              <span>Welcome to your Brixel Hub. I prepared a list of rewards to simplify your sale. Enjoy.</span>
            </div>
            <BrixelButtonIcon
              className="shadow-2dp"
              icon="close-small"
              color="primary"
              saturationTxt={400}
              bgTransparent
              noBorder
              onClick={() => setCookie('brixelSayHello', true)}
            />
          </div>
        )
      }
      <div className={`dis-f h-perc-md-100 ${rewardType === 'rewards' ? 'jc-c' : 'jc-b'} pos-r-md`}>
        {console.log(GameGroupConfig)}
        {
          usrGroups && (
            <div className="firstLevel mr-md-2">
              {
                usrGroups.map((group, i) => (
                  <div key={i.toString()}>
                    {
                      GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`] && (
                        <>
                          {
                            i === 0 ? (
                              <div className="dis-f jc-b a-c mb-3 mt-2">
                                <span className="dis-b txtDark700 fweight-500">
                                  {GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`].name}
                                </span>
                              </div>
                            ) : (
                              <span className="mb-3 dis-b txtDark700 fweight-500">
                                {GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`].name}
                              </span>
                            )
                          }

                          <div key={i.toString()} className="pos-r">
                            {
                              group.achievements && group.achievements.map((item, f) => (
                                <div key={f.toString()} className="pos-r">
                                  <BrixelButtonAchievement
                                    done={item.done}
                                    active={item.stub === activeGameGroup}
                                    icon={item.icon}
                                    title={item.description}
                                    subtitle={item.name}
                                    isFree={item.isFree}
                                    onClick={() => onClickAchievement(item.stub, item)}
                                    lineAfter={group.achievements.length - 1 > f}
                                    award={item.achievementType === 'award'}
                                    disabled={isDisabledFlow(item.stub)}
                                  />
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
            </div>
          )
        }
        {
          activeGameGroup && rewardType !== 'rewards' && (
            <div className="secondLevel w-perc-100 dis-fl-col ml-md">
              <>
                <div className="rewardsSplash h-perc-100 dis-fl-col p-2 pb-md-3 cardSecondLevel">
                  {
                    activeAchievement && (
                      <div className="dis-f a-c jc-b mb-4">
                        <div className="dis-f a-c">
                          <BrixelButtonIcon
                            className="shadow-2dp mr-2 hide-md"
                            icon="arrow-simple-left"
                            color="primary"
                            saturationTxt={400}
                            bgTransparent
                            noBorder
                            onClick={() => history.push(`/${propID}/rewards`)}
                          />
                          <p className="mr-1 body fweight-500">
                            {activeAchievement.title || activeAchievement.name}
                          </p>
                        </div>
                        <div className="cur-poi ml-2">
                          {
                            activeAchievement.points && (
                              <>
                                {
                                  activeAchievement.achievementType === 'award' && (
                                    <BrixelIcon
                                      icon="cup-awards"
                                      color="green"
                                      className="mr-1"
                                    />
                                  )
                                }
                                <span className="ff-mono txtDark700">{activeAchievement.points}</span>
                              </>
                            )
                          }
                        </div>
                      </div>
                    )
                  }
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
    </div>
  )
};

RewardsDashboard.propTypes = {
  userTypes: PropTypes.string,
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  gameHistory: PropTypes.object,
  formValue: PropTypes.object.isRequired,
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
  formValue: get(state, 'form.Property.values', {}),
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
