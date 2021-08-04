/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon, BrixelButtonBox,
} from '@brixel/brixel-components';
import Sticker from 'react-stickyfill';
import { addGameHistory } from '../../../actions/GamificationActions';
import Loading from '../../../components/Loading';
import { GameGroupConfig } from '../../../constants/global';
// import helloImg from '../../../images/hello.svg';
import BrixelButtonAchievement from '../../../components/BrixelButtonAchievement';
import { /* setCookie, getCookie,  */sortObject } from '../../../utils/helpers';
import SuccessMarketCheck from '../../GameHistory/MarketChecker/SuccessMarketCheck';
import SuccessHomebase from '../../GameHistory/Homebase/SuccessHomebase';
import SuccessBestimate from '../../GameHistory/Bestimate/SuccessBestimate';
import SuccessAssessor from '../../GameHistory/Assessor/SuccessAssessor';
import FactsRewards from '../../GameHistory/Facts/SuccessFacts';
import MediaExplanation from '../../GameHistory/SecondLevel/MediaRewards';
import PageReviewRewards from '../../GameHistory/SecondLevel/PageReviewRewards';
import PagePublishedRewards from '../../GameHistory/SecondLevel/PagePublishedRewards';
import PortalsRewards from '../../GameHistory/SecondLevel/PortalsRewards';

import { setModal, spinnerOff } from '../../../actions/CommonActions';
import Support from '../../../components/Support';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const DashboardHome = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    formValue,
    gameGroup,
    gameHistory,
    handleAddGameHistory,
    history,
    isLoading,
    isSmallLoading,
    match,
    userTypes,
    windowDimensions,
    handleSpinnerOff,
  } = props;
  // STATE
  const [usrGroups, setUsrGroups] = useState(gameGroup.sort(sortObject('stub', 'asc')));
  // const [idVideo, setIdVideo] = useState(null);
  const [activeGameGroup, setActiveGameGroup] = useState(null);
  const [activeAchievement, setActiveAchievement] = useState(null);
  // const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
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
    if (game === 'bestimate' && get(formValue, 'location.countryCode', null) !== 'CH' && get(formValue, 'location.countryCode', null) !== 'PT') {
      disabled = true;
    }
    return disabled;
  };

  // LOAD ID VIDEO BY LANGAUGE
  /* useEffect(() => {
    switch (language.toLowerCase()) {
      case 'de':
        setIdVideo('463015773');
        break;
      case 'pt':
        setIdVideo('463008537');
        break;
      default:
        setIdVideo(null);
    }
  }, [language]); */

  useEffect(() => {
    let getNameGroup = localStorage.getItem('gameGroup') || null;
    if (windowDimensions && windowDimensions.width > 1024 && rewardType === 'rewards' && usrGroups) {
      if (!getNameGroup && gameHistory && gameHistory.data) {
        usrGroups.forEach((groups) => {
          if (groups.stub.includes('seller')) {
            groups.achievements.forEach((group) => {
              const selElTodo = gameHistory.data.find((game) => game.achievement.stub === group.stub && game.page === propID);
              if (typeof selElTodo === 'undefined' && !getNameGroup && !isDisabledFlow(group.stub)) {
                localStorage.setItem('gameGroup', group.stub);
                getNameGroup = group.stub;
                setActiveGameGroup(group.stub);
                return false;
              }
              return null;
            });
          }
        });
      }
      getNameGroup = getNameGroup || 'homebase';
      history.push({ pathname: `/${propID}/rewards/${getNameGroup}` });
    }
  }, [windowDimensions, gameHistory, usrGroups]);

  // FUNCTION TO ADD MEDIA TO GAME HISTORY
  useEffect(() => {
    const getFloorPlans = get(formValue, 'floorPlans', []);
    const getPhotos = get(formValue, 'photos', []);
    const getDocuments = get(formValue, 'documents', []);
    if (getDocuments.length > 0 && getPhotos.length > 0 && getFloorPlans.length > 0) {
      handleAddGameHistory({ stub: 'media' });
    }
  }, [get(formValue, 'floorPlans', []), get(formValue, 'photos', []), get(formValue, 'documents', [])]);

  // FUNCTION TO ADD PAGE OR PORTALS TO GAME HISTORY
  useEffect(() => {
    let filtUsrGroup = cloneDeep(gameGroup);
    filtUsrGroup = filtUsrGroup.filter((val) => val.stub.indexOf(userTypes) !== -1);
    filtUsrGroup = filtUsrGroup.sort(sortObject('stub', 'asc'));
    if (gameHistory.data && activeSingleProperty.id === propID && formValue.id === propID) {
      // CHECK IF DONE HOMEBASE
      gameHistory.data.map((game) => {
        filtUsrGroup.map((group, f) => {
          const idGroup = group.achievements.findIndex((val) => val.stub === game.achievement.stub && activeSingleProperty.id === game.page);
          if (idGroup >= 0) filtUsrGroup[f].achievements[idGroup].done = true;
          else if (filtUsrGroup[f].achievements) {
            // CHECK PORTALS
            const idGroupPortals = group.achievements.findIndex((val) => val.stub === 'portals');
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
            const idGroupPage = group.achievements.findIndex((val) => val.stub === 'page-published');
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
      });
    }
    setUsrGroups([...filtUsrGroup]);
  }, [userTypes, activeSingleProperty, gameGroup, gameHistory, formValue.id]);

  useEffect(() => {
    if (gameHistory.data) {
      if (isLoading) handleSpinnerOff();
    }
  }, [gameHistory]);

  // FUNCTION TO SET THE ACTIVE REWARDS GROUP ON FIRST LOAD IF NOT COMPLETED
  useEffect(() => {
    if (gameHistory.data && rewardType && rewardType !== 'rewards' && gameGroup) {
      let selectEl;
      usrGroups.map((item) => {
        if (!selectEl) selectEl = item.achievements.find((el) => el.stub === rewardType);
        return null;
      });
      setActiveGameGroup(rewardType);
      setActiveAchievement(selectEl);
      if (rewardType === 'call-expert') {
        setActiveAchievement({ title: 'Call the expert' });
      }
    } else {
      setActiveGameGroup(null);
      setActiveAchievement(null);
    }
  }, [gameHistoryData, usrGroups, history, gameGroup, rewardType, formValue.id]);

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
      {activeGameGroup === 'market-checker' && (<SuccessMarketCheck gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'bestimate' && (<SuccessBestimate gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'assessor' && (<SuccessAssessor gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'facts' && (<FactsRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'media' && (<MediaExplanation gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'page-preview' && (<PageReviewRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'page-published' && (<PagePublishedRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'portals' && (<PortalsRewards gameStub={activeGameGroup} groupdAchievement={activeAchievement} />)}
      {activeGameGroup === 'call-expert' && (<Support layout="rewards" expanded isFixed={false} hideClose />)}
    </>
  );

  // TEXT FOR SCAN TRIAL BOX MESSAGE
  const brixelScanTrialMessage = (type) => {
    switch (type) {
      case 'media':
        return {
          title: 'Do you want to capture your property in its best possible light?',
          description: 'Request a free photo shooting by one of our experts.',
          btnLabel: 'Request photo shoot',
        };
      case 'bestimate':
        return {
          title: 'Do you want a more accurate estimation value?',
          description: 'Request a free on-site appointment by one of our experts.',
          btnLabel: 'Request estimation',
        };
      default:
        return null;
    }
  };

  // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
  if ((!activeSingleProperty.id && !userTypes) || isSmallLoading.getProperty) {
    return <Loading />;
  }
  const classToHide = get(history, 'location.state.hideBackPage', false);

  return (
    <div className="rewards-container" id="rewardsDashboard">
      <h3 className="mb-3 hide dis-b-lg">Welcome back Jim 👋</h3>
      <div className="max-w-fix-768 dis-fl-col">
        <div className="boxCard">
          <img src={get(activeSingleProperty, 'coverPhoto.galleryThumbnailPath', null)} alt="" />
        </div>
      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  gameHistory: PropTypes.object,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

DashboardHome.defaultProps = {
  gameGroup: [],
  gameHistory: {},
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  awards: get(state, 'user.awards', []),
  brixelPoints: get(state, 'user.brixelPoints', []),
  formValue: get(state, 'brixelForm.Property.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  language: get(state, 'user.loggedInUser.user.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  userTypes: get(state, 'user.userTypes', null),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
