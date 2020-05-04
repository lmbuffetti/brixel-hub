/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import pagePreviewCheckImg from '../../../images/secondLevel/pagePreviewCheck.png';
import pagePreviewDoneImg from '../../../images/secondLevel/pagePreviewDone.png';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { addGameHistory } from '../../../actions/GamificationActions';

const PageReviewRewards = (props) => {
  const {
    gameHistory,
    handleAddGameHistory,
    history,
    match,
  } = props;
  // STATE
  const [isDone, setIsDone] = useState(false);
  // PARAMS URL
  const propID = get(match, 'params.propId', '');
  const gameStub = history.location.pathname.split('/')[3];

  useEffect(() => {
    const isCheckDone = gameHistory.find(item => item.page === propID && item.achievement.stub === gameStub);
    setIsDone(typeof isCheckDone !== 'undefined');
  }, [gameHistory]);

  const openPreview = (done = false) => {
    if (!done) handleAddGameHistory({stub: gameStub});
    window.open(`${baseByData.pageUrl}preview/${propID}?hubUrl=${window.location.href}`, '');
  };

  return (
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-c a-c pt-md-2`}>
      {
        isDone ? (
          <>
            <div className="dis-fl-col jc-c a-c">
              <img width="440" className="cur-poi" src={pagePreviewDoneImg} alt="Page Preview" onClick={() => openPreview(false)} />
              <h5 className="ta-c mt-3 mb-2">Want a second look?</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 mb-3">You can edit and preview as often as you want. We are ready when you are.</p>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Open preview"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-216 m-a"
                onClick={() => openPreview(false)}
              />
            </div>
          </>
        ) : (
          <>
          <div className="dis-fl-col jc-c a-c">
            <img width="440" className="cur-poi" src={pagePreviewCheckImg} alt="Page Preview" onClick={() => openPreview(true)} />
            <h5 className="ta-c mt-3 mb-2">Have a look!</h5>
            <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 mb-3">This is your personal property page. Don’t worry this is not public. This is for you eyes only.</p>
          </div>
          <div>
            <BrixelButtonPrimary
              label="Open preview"
              rounded
              rightIcon="arrow-right"
              className="min-w-fix-216 m-a"
              onClick={() => openPreview(true)}
            />
          </div>
          </>
        )
      }
    </main>
  )
};

PageReviewRewards.propTypes = {
  handleAddGameHistory: Proptypes.func.isRequired,
  history: Proptypes.object.isRequired,
  match: Proptypes.object.isRequired,
  gameHistory: Proptypes.arrayOf(Proptypes.object),
}

PageReviewRewards.defaultProps = {
  totalComplete: 9,
}

const mapStateToProps = (state) => ({
  gameHistory: get(state, 'gamification.gameHistory.data', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose (
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PageReviewRewards);
