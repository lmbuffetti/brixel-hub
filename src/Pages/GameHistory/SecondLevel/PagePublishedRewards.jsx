/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import pagePublishedCheckImg from '../../../images/secondLevel/pagePublishedCheck.svg';
import pagePublishedDoneImg from '../../../images/secondLevel/pagePublishedDone.svg';
import pagePublishedReviewImg from '../../../images/secondLevel/pagePublishedReview.svg';
import { addGameHistory } from '../../../actions/GamificationActions';

const PagePublishedRewards = (props) => {
  const history = useNavigate();
  const {
    gameHistory,
    match,
    pagePublished,
    pageReview,
  } = props;
  // STATE
  const [status, setStatus] = useState('offline');
  // PARAMS URL
  const propID = get(match, 'params.propId', '');
  const gameStub = history.location.pathname.split('/')[3];

  // GET THE PAGE STATUS
  useEffect(() => {
    const isCheckDone = gameHistory.find((item) => item.page === propID && item.achievement.stub === gameStub);
    if (typeof isCheckDone !== 'undefined' && pagePublished) setStatus('online');
    else if (pageReview) setStatus('review');
    else setStatus('offline');
  }, [gameHistory, pagePublished, pageReview]);

  // FUNCTION TO GO TO /LISTINGS/PAGE
  const openPreview = () => {
    history.push(`/${propID}/marketing/page`);
  };

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col a-c">
      {
        status === 'online' && (
          <>
            <div className="dis-fl-col jc-c a-c">
              <h5 className="ta-c mb-2">We are live!</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300">Your property website is visible to the public and officially part of the world wide web. Yeah!</p>
              <div className="ta-c my-5">
                <img className="h-fix-120" src={pagePublishedDoneImg} alt="Page Preview" onClick={() => openPreview()} />
              </div>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Manage Page"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => openPreview(false)}
              />
            </div>
          </>
        )
      }
      {
        status === 'offline' && (
          <>
            <div className="dis-fl-col jc-c a-c">
              <h5 className="ta-c mb-2">Put this website live!</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300">Unlock your Brixel Page and make it visible to the public.</p>
              <div className="ta-c my-5">
                <img className="h-fix-120" src={pagePublishedCheckImg} alt="Page Preview" onClick={() => openPreview()} />
              </div>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Manage Page"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => openPreview(false)}
              />
            </div>
          </>
        )
      }
      {
        status === 'review' && (
          <>
            <div className="dis-fl-col jc-c a-c">
              <h5 className="ta-c mb-2">Review in the making…</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300">To assure great quality your page is being reviewed for free.</p>
              <div className="ta-c my-5">
                <img className="h-fix-120" src={pagePublishedReviewImg} alt="Page Preview" onClick={() => openPreview()} />
              </div>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Manage Page"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => openPreview(false)}
              />
            </div>
          </>
        )
      }
    </main>
  );
};

PagePublishedRewards.propTypes = {
  match: Proptypes.object.isRequired,
  gameHistory: Proptypes.arrayOf(Proptypes.object).isRequired,
  pageReview: Proptypes.bool.isRequired,
  pagePublished: Proptypes.bool.isRequired,
};

PagePublishedRewards.defaultProps = {
};

const mapStateToProps = (state) => ({
  gameHistory: get(state, 'gamification.gameHistory.data', []),
  pageReview: get(state, 'brixelForm.Property.values.publishReview', null) !== null,
  pagePublished: get(state, 'brixelForm.Property.values.published', false),
});

const mapDispatchToProps = (dispatch) => ({
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(PagePublishedRewards);
