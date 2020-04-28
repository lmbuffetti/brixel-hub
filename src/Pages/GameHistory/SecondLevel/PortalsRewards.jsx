/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import portalsPublishedCheckImg from '../../../images/secondLevel/portalsPublishedCheck.png';
import portalsPublishedDoneImg from '../../../images/secondLevel/portalsPublishedDone.png';
import portalsPublishedReviewImg from '../../../images/secondLevel/portalsPublishedReview.png';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { addGameHistory } from '../../../actions/GamificationActions';

const PortalsRewards = (props) => {
  const {
    gameHistory,
    handleAddGameHistory,
    history,
    match,
    portalsPublished,
    portalsReview,
  } = props;
  // STATE
  const [status, setStatus] = useState('toDo');
  // PARAMS URL
  const propID = get(match, 'params.propId', '');
  const gameStub = history.location.pathname.split('/')[3];

  useEffect(() => {
    const isCheckDone = gameHistory.find(item => item.page === propID && item.achievement.stub === gameStub);
    const checkifExist = Object.keys(portalsPublished).filter(key => portalsPublished[key] === true);
    if (typeof isCheckDone !== 'undefined' && checkifExist.length > 0) setStatus('online');
    else if (typeof isCheckDone !== 'undefined' && portalsReview) setStatus('review');
    else setStatus('toDo');
  }, [gameHistory, portalsReview, portalsPublished]);

  const openPreview = (done = false) => {
    if (!done) handleAddGameHistory({stub: gameStub});
    window.open(`${baseByData.pageUrl}preview/${propID}`, '_blank');
  };

  return (
    <div>
      {
        status === 'online' && (
          <>
            <img src={portalsPublishedDoneImg} alt="Page Preview"/>
            <h5 className="ta-c mt-3 mb-2">We are live!</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">Your property website is visible to the public and officially part of the world wide web. Yeah!</p>
            <BrixelButtonPrimary
              label="Open preview"
              rounded
              rightIcon="arrow-right"
              className="min-w-fix-216 m-a"
              onClick={() => openPreview(false)}
            />
          </>
        )
      }
      {
        status === 'offline' && (
          <>
            <img src={portalsPublishedCheckImg} alt="Page Preview"/>
            <h5 className="ta-c mt-3 mb-2">Publish this website now!</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">Unlock your Brixel Page and make it visible to the public.</p>
            <BrixelButtonPrimary
              label="Open preview"
              rounded
              rightIcon="arrow-right"
              className="min-w-fix-216 m-a"
              onClick={() => openPreview(false)}
            />
          </>
        )
      }
      {
        status === 'review' && (
          <>
            <img src={portalsPublishedReviewImg} alt="Page Preview"/>
            <h5 className="ta-c mt-3 mb-2">Review in the making…</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">To assure great quality your page is being reviewed for free.</p>
            <BrixelButtonPrimary
              label="Open preview"
              rounded
              rightIcon="arrow-right"
              className="min-w-fix-216 m-a"
              onClick={() => openPreview(false)}
            />
          </>
        )
      }
    </div>
  )
};

PortalsRewards.propTypes = {
  handleAddGameHistory: Proptypes.func.isRequired,
  history: Proptypes.object.isRequired,
  match: Proptypes.object.isRequired,
  gameHistory: Proptypes.arrayOf(Proptypes.object),
  portalsReview: Proptypes.bool.isRequired,
  portalsPublished: Proptypes.object.isRequired,
}

PortalsRewards.defaultProps = {
}

const mapStateToProps = (state) => ({
  gameHistory: get(state, 'gamification.gameHistory.data', []),
  portalsReview: get(state, 'form.Property.values.portalsReview', null) !== null,
  portalsPublished: get(state, 'form.Property.values.portals', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose (
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PortalsRewards);
