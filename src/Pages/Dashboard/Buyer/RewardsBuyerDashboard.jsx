/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, BrixelButtonIcon } from '@brixel/brixel-components';
import Sticker from 'react-stickyfill';
import { addGameHistory } from '../../../actions/GamificationActions';
import Loading from '../../../components/Loading';
import { GameGroupConfig } from '../../../constants/global';
import BrixelButtonAchievement from '../../../components/BrixelButtonAchievement';

import SuccessHomebase from '../../GameHistory/Homebase/SuccessHomebase';
import { setModal } from '../../../actions/CommonActions';
// import Support from '../../../components/Support';

const RewardsBuyerDashboard = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    handleSetModal,
    history,
    match,
    userTypes,
    windowDimensions,
  } = props;
  // STATE
  const [activeGameGroup, setActiveGameGroup] = useState(null);
  const [activeAchievement, setActiveAchievement] = useState(null);
  // PARAMS URL
  const splitRewards = get(history, 'location.pathname', '').split('/');
  const rewardType = splitRewards[3] ? splitRewards[3].replace('-done', '') : splitRewards[2];
  const propID = get(match, 'params.propId', '');

  // FUNCTION CLICK ON GAME GROUP
  const onClickAchievement = (game, achievement) => {
    setActiveGameGroup(game);
    localStorage.setItem('gameGroup', game);
    history.push({ pathname: `/${propID}/rewards/${game}` });
    setActiveAchievement(achievement);
  };

  // LOAD COMPONENTET IN BASE OF ACTIVE GROUP ACTIVE
  const getSuccessActiveGroup = () => (
    <>
      {activeGameGroup === 'homebase' && (<SuccessHomebase gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
    </>
  );

  // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
  if (!activeSingleProperty.id && !userTypes) {
    return <Loading />;
  }

  return (
    <div className="rewards-container" id="rewardsDashboard">
      <div className="dis-f a-t jc-c pos-r-md">
        <div className="firstLevel mr-md-2">
          <div className="level-1 pr-md-8">
            <div className="pos-r">
              <BrixelButtonAchievement
                level="level-1"
                done={false}
                active
                icon="location-pin-simple"
                title="First Buyer action"
                subtitle=""
                isFree={false}
                onClick={() => onClickAchievement('', '')}
                lineAfter={false}
                award={false}
                disabled={false}
                config={GameGroupConfig.buyerLevel1}
              />
            </div>
          </div>
        </div>
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
                        {/* {
                          activeAchievement.points && (
                            <div
                              className="cur-poi ml-2"
                              onClick={() => handleSetModal({
                                showAwardsInfo: true,
                              })}
                            >
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
                        } */}
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
  );
};

RewardsBuyerDashboard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  userTypes: PropTypes.string,
  handleSetModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

RewardsBuyerDashboard.defaultProps = {
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  userTypes: get(state, 'user.userTypes', null),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  awards: get(state, 'user.awards', []),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
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
)(RewardsBuyerDashboard);
