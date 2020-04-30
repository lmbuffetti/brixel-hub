/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import pagePublishedCheckImg from '../../../images/secondLevel/pagePublishedCheck.png';
import pagePublishedDoneImg from '../../../images/secondLevel/pagePublishedDone.png';
import pagePublishedReviewImg from '../../../images/secondLevel/pagePublishedReview.png';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { addGameHistory } from '../../../actions/GamificationActions';

const PagePublishedRewards = (props) => {
  const {
    gameHistory,
    handleAddGameHistory,
    history,
    match,
    pagePublished,
    pageReview,
  } = props;
  // STATE
  const [status, setStatus] = useState('offline');
  // PARAMS URL
  const propID = get(match, 'params.propId', '');
  const gameStub = history.location.pathname.split('/')[3];

  useEffect(() => {
    const isCheckDone = gameHistory.find(item => item.page === propID && item.achievement.stub === gameStub);
    if (typeof isCheckDone !== 'undefined' && pagePublished) setStatus('online');
    else if (typeof isCheckDone !== 'undefined' && pageReview) setStatus('review');
    else setStatus('offline');
  }, [gameHistory, pagePublished, pageReview]);

  const openPreview = (done = false) => {
    history.push(`/${propID}/listings/page`);
  };

  return (
    <div className="ta-c">
      {
        status === 'online' && (
          <>
            <img src={pagePublishedDoneImg} alt="Page Preview"/>
            <h5 className="ta-c mt-3 mb-2">We are live!</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">Your property website is visible to the public and officially part of the world wide web. Yeah!</p>
            <BrixelButtonPrimary
              label="Manage Page"
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
            <img src={pagePublishedCheckImg} alt="Page Preview"/>
            <h5 className="ta-c mt-3 mb-2">Put this website live!</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">Unlock your Brixel Page and make it visible to the public.</p>
            <BrixelButtonPrimary
              label="Manage Page"
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
            <img src={pagePublishedReviewImg} alt="Page Preview"/>
            <h5 className="ta-c mt-3 mb-2">Review in the making…</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 mb-3">To assure great quality your page is being reviewed for free.</p>
            <BrixelButtonPrimary
              label="Manage Page"
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

PagePublishedRewards.propTypes = {
  handleAddGameHistory: Proptypes.func.isRequired,
  history: Proptypes.object.isRequired,
  match: Proptypes.object.isRequired,
  gameHistory: Proptypes.arrayOf(Proptypes.object),
  pageReview: Proptypes.bool.isRequired,
  pagePublished: Proptypes.bool.isRequired,
}

PagePublishedRewards.defaultProps = {
}

const mapStateToProps = (state) => ({
  gameHistory: get(state, 'gamification.gameHistory.data', []),
  pageReview: get(state, 'form.Property.values.publishReview', null) !== null,
  pagePublished: get(state, 'form.Property.values.published', false),
});

const mapDispatchToProps = (dispatch) => ({
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose (
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PagePublishedRewards);
