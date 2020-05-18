/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, BrixelButtonIcon, BrixelButtonBox } from '@brixel/brixel-components';
import { addGameHistory } from '../../actions/GamificationActions';
import Loading from '../../components/Loading';
import { GameGroupConfig } from '../../constants/global';
import helloImg from '../../images/hello.svg';
import BrixelButtonAchievement from '../../components/BrixelButtonAchievement';
import { setCookie, getCookie, sortObject } from '../../utils/helpers';
import Sticker from 'react-stickyfill';

import SuccessMarketCheck from '../GameHistory/MarketChecker/SuccessMarketCheck';
import SuccessBestimate from '../GameHistory/Bestimate/SuccessBestimate';
import SuccessAssessor from '../GameHistory/Assessor/SuccessAssessor';
import SuccessHomebase from '../GameHistory/Homebase/SuccessHomebase';
import FactsRewards from '../GameHistory/SecondLevel/FactsRewards';
import MediaExplanation from '../GameHistory/SecondLevel/MediaRewards';
import PageReviewRewards from '../GameHistory/SecondLevel/PageReviewRewards';
import PagePublishedRewards from '../GameHistory/SecondLevel/PagePublishedRewards';
import PortalsRewards from '../GameHistory/SecondLevel/PortalsRewards';
import { setModal } from '../../actions/CommonActions';
import Support from '../../components/Support';

const RewardsDashboard = (props) => {
  // PROPS
  const {
    userTypes,
    formValue,
    gameGroup,
    gameHistory,
    handleAddGameHistory,
    handleSetModal,
    history,
    loggedInUser,
    match,
    property,
    windowDimensions,
  } = props;
  // STATE
  const [usrGroups, setUsrGroups] = useState(gameGroup.sort(sortObject('stub', 'asc')));
  const [activeGameGroup, setActiveGameGroup] = useState(null);
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  // PARAMS URL
  const splitRewards = get(history, 'location.pathname', '').split('/');
  const rewardType = splitRewards[3] ? splitRewards[3].replace('-done', '') : splitRewards[2];
  const propID = get(match, 'params.propId', '');
  const gameHistoryData = get(gameHistory, 'data', null);

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

  useEffect(() => {
    let getNameGroup = localStorage.getItem('gameGroup') || null;
    if (windowDimensions && windowDimensions.width > 1024 && rewardType === 'rewards' && usrGroups) {
      if (!getNameGroup) {
        usrGroups.forEach((groups) => {
          if (groups.stub.includes(userTypes)) {
            groups.achievements.forEach((group) => {
              const selElTodo = gameHistory.data.find(game => game.achievement.stub === group.stub && game.page === propID);
              if (typeof selElTodo === 'undefined' && !getNameGroup && !isDisabledFlow(group.stub)) {
                localStorage.setItem('gameGroup', group.stub);
                getNameGroup = group.stub;
                setActiveGameGroup(group.stub);
                return false;
              }
            });
          }
        });
      }
      getNameGroup = getNameGroup || 'homebase';
      history.push({ pathname: `/${propID}/rewards/${getNameGroup}` });
    }
  }, [windowDimensions, gameHistory, usrGroups, history.location.pathname]);

  useEffect(() => {
    const getFloorPlans = get(formValue, 'floorPlans', []);
    const getPhotos = get(formValue, 'photos', []);
    const getDocuments = get(formValue, 'documents', []);
    if (getDocuments.length > 0 && getPhotos.length > 0 && getFloorPlans.length > 0) {
      handleAddGameHistory({stub: 'media'});
    }
  }, [formValue])

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
          else if (filtUsrGroup[f].achievements) {
            // CHECK PORTALS
            const idGroupPortals = group.achievements.findIndex(val => val.stub === 'portals');
            if (idGroupPortals > 0) {
              if (!filtUsrGroup[f].achievements[idGroupPortals].done) {
                let isOnline = false;
                const portals = get(formValue, 'portals', {});
                Object.keys(portals).map((key) => {
                  if (portals[key]) isOnline = true;
                  return null;
                });
                if (isOnline) {
                  handleAddGameHistory({ stub: 'portals' });
                  filtUsrGroup[f].achievements[idGroupPortals].done = true;
                }
              }
            }
            // CHECK PAGE
            const idGroupPage = group.achievements.findIndex(val => val.stub === 'page-published');
            if (idGroupPage > 0) {
              if (!filtUsrGroup[f].achievements[idGroupPage].done) {
                const pageIsOnline = get(formValue, 'published', false);
                if (pageIsOnline) {
                  handleAddGameHistory({ stub: 'page-published' });
                  filtUsrGroup[f].achievements[idGroupPage].done = true;
                }
              }
            }
          }
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
    if (gameHistory.data && rewardType && rewardType !== 'rewards' && gameGroup) {
      let selectEl;
      usrGroups.map((item) => {
        if (!selectEl) selectEl = item.achievements.find(el => el.stub === rewardType);
        return null;
      })
      setActiveGameGroup(rewardType);
      setActiveAchievement(selectEl);
      if (rewardType === 'call-expert') {
        setActiveAchievement({ title: 'Call the expert' });
      }
    } else {
      setActiveGameGroup(null);
      setActiveAchievement(null);
    }
  }, [gameHistoryData, usrGroups, history, gameGroup, rewardType]);

  const onClickAchievement = (game, achievement) => {
    setActiveGameGroup(game);
    localStorage.setItem('gameGroup', game);
    history.push({pathname: `/${propID}/rewards/${game}` });
    setActiveAchievement(achievement);
  };

  const getSuccessActiveGroup = () => {
    return (
      <>
        {activeGameGroup === 'homebase' && (<SuccessHomebase gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'market-checker' && (<SuccessMarketCheck gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'bestimate' && (<SuccessBestimate gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'assessor' && (<SuccessAssessor gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'facts' && (<FactsRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'media' && (<MediaExplanation gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'page-preview' && (<PageReviewRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'page-published' && (<PagePublishedRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'portals' && (<PortalsRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
        {activeGameGroup === 'call-expert' && (<Support layout="rewards" expanded={true} isFixed={false} hideClose={true} />)}
      </>
    )
  }

  const checkMessageHello = () => {
    if (typeof getCookie('brixelSayHello') !== 'undefined') {
      if (JSON.parse(getCookie('brixelSayHello')) !== true) {
        return true
      }
      return false;
    }
    return true;
  }

  if (!property.id && !userTypes) {
    return <Loading />
  }

  return (
    <div className={`rewards-container`} id="rewardsDashboard">
      {
        checkMessageHello() && showWelcomeMessage && (
          <div className="brdRadius bgWhite p-1 dis-f jc-b a-c p-1 p-md-2 mb-5">
            <img src={helloImg} alt="Hell User" />
            <div className="txtDark700 w-perc-100 pl-3">
              <span>
                <span>Hello</span>
                <span>&nbsp;</span>
                <span>{loggedInUser.user.firstName}!</span>
              </span><br />
              <span>Welcome to your Brixel Hub. I prepared a list of rewards to simplify your sale. Enjoy.</span>
            </div>
            <BrixelButtonIcon
              className="shadow-2dp"
              icon="close-small"
              color="primary"
              saturationTxt={400}
              bgTransparent
              noBorder
              onClick={() => {
                setCookie('brixelSayHello', true)
                setShowWelcomeMessage(false)
              }}
            />
          </div>
        )
      }
      <div className={`dis-f a-t jc-c pos-r-md`}>
        {
          usrGroups && (
            <div className="firstLevel mr-md-2">
              {
                usrGroups.map((group, i) => (
                  <div className={`level-${group.stub.replace(/^\D+/g, '')} pr-md-8`} key={i.toString()}>
                    {
                      GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`] && (
                        <>
                          {
                            i === 0 ? (
                              <div className="dis-f jc-b a-c mb-3 mt-0 mt-md-2">
                                <span className="dis-b txtGreen700 fweight-500">
                                  {GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`].name}
                                </span>
                              </div>
                            ) : (
                              <span className="mb-3 dis-b txtRed700 fweight-500">
                                {GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`].name}
                              </span>
                            )
                          }

                          <div key={i.toString()} className="pos-r">
                            {
                              group.achievements && group.achievements.map((item, f) => (
                                <React.Fragment key={f.toString()}>
                                  <div className="pos-r">
                                    <BrixelButtonAchievement
                                      level={group.stub.replace(/^\D+/g, '')}
                                      done={item.done}
                                      active={item.stub === activeGameGroup}
                                      icon={item.icon}
                                      title={item.description}
                                      subtitle={item.name}
                                      isFree={ isDisabledFlow(item.stub) ? null : item.isFree }
                                      onClick={() => onClickAchievement(item.stub, item)}
                                      lineAfter={group.achievements.length - 1 > f}
                                      award={item.achievementType === 'award'}
                                      disabled={isDisabledFlow(item.stub)}
                                      config={GameGroupConfig[`${userTypes}Level${group.stub.replace(/^\D+/g, '')}`]}
                                    />
                                  </div>
                                  {
                                    f === group.achievements.length - 1 && group.stub.replace(/^\D+/g, '') === '1' && (
                                      <div className="pos-r" key={`${f.toString()}group`}>
                                        <hr className="lighter" />
                                        <BrixelButtonBox
                                          bgTransparent
                                          className={`mt-2 mb-4 w-perc-100 shadow-1dp brdMedium p-2 ${rewardType === 'call-expert' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                                          backIcon="Primary100"
                                          done={false}
                                          icon="call"
                                          paddingIconClass="p-small-9 mr-1"
                                          label="Call the expert"
                                          labelClass="fweight-400"
                                          subtitleClass="pt-1 txtDark200"
                                          subtitle="15 min personal support for free"
                                          isFree="15 min personal support for free"
                                          onClick={() => onClickAchievement('call-expert', { title: 'Call the expert' })}
                                        />
                                      </div>
                                    )
                                  }
                                </React.Fragment>
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
            <Sticker>
              <div className="secondLevel w-perc-100 dis-fl-col ml-md">
                <div className="rewardsSplash h-perc-100 dis-fl-col p-2 p-md-3 pb-md-8 cardSecondLevel">
                  {
                    activeAchievement && (
                      <div className="dis-f a-c jc-b mb-5 mb-md-2">
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
                          {
                            windowDimensions.width <= 1024 && (
                              <p className="mr-1 body fweight-500">
                                Home
                              </p>
                            )
                          }
                        </div>
                        {
                          activeAchievement.points && (
                            <div className="cur-poi ml-2"  onClick={() => handleSetModal({
                              showAwardsInfo: true,
                            })}>
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
                            </div>
                          )
                        }
                      </div>
                    )
                  }
                  {getSuccessActiveGroup()}
                </div>
              </div>
            </Sticker>
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
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(RewardsDashboard);
