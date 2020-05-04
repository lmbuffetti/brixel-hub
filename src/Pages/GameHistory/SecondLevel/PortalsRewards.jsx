/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import portalsPublishedCheckImg from '../../../images/secondLevel/portalsPublishedCheck.svg';
import portalReview from '../../../images/Listings/portals_review.svg';
import portalPublished from '../../../images/Listings/portals_published.svg';

//import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { addGameHistory } from '../../../actions/GamificationActions';

const PortalsRewards = (props) => {
  const {
    gameHistory,
    history,
    match,
    portalsPublished,
    portalsReview,
  } = props;
  // STATE
  const [status, setStatus] = useState('offline');
  // PARAMS URL
  const propID = get(match, 'params.propId', '');
  const gameStub = history.location.pathname.split('/')[3];

  useEffect(() => {
    const isCheckDone = gameHistory.find(item => item.page === propID && item.achievement.stub === gameStub);
    const checkifExist = Object.keys(portalsPublished).filter(key => portalsPublished[key] === true);
    if (typeof isCheckDone !== 'undefined' && checkifExist.length > 0) setStatus('online');
    else if (typeof isCheckDone !== 'undefined' && portalsReview) setStatus('review');
    else setStatus('offline');
  }, [gameHistory, portalsReview, portalsPublished]);

  const openPreview = (done = false) => {
    //if (!done) handleAddGameHistory({stub: gameStub});
    history.push(`/${propID}/listings/portals`);
    //window.open(`${baseByData.pageUrl}preview/${propID}`, '_blank');
  };

  return (
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col jc-c a-c pt-md-2`}>
      {
        status === 'online' && (
          <>
            <div className="dis-fl-col jc-c a-c">
              <img className="h-fix-120" src={portalPublished} alt="Page Preview"/>
              <h5 className="ta-c mt-3 mb-2">First big step done.</h5>
              <p className="max-w-fix-368 m-a ta-c txtDark200 fsize-300 mb-3">Your property is on the market and ready to be discovered by it’s future buyer.</p>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Manage Portals"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-216 m-a"
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
              <img className="h-fix-120" src={portalsPublishedCheckImg} alt="Page Preview"/>
              <h5 className="ta-c mt-3 mb-2">Put your property on the market.</h5>
              <p className="max-w-fix-368 m-a ta-c txtDark200 fsize-300 mb-3">Your are just 3 clicks away. Let your property fly.</p>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Manage Portals"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-216 m-a"
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
              <img className="h-fix-120" onClick={() => openPreview(false)} src={portalReview} alt="Page Preview"/>
              <h5 className="ta-c mt-3 mb-2">On it’s way.</h5>
              <p className="max-w-fix-368 m-a ta-c txtDark200 fsize-300 mb-3">Your property was sent to the portals and will be published soon. </p>
            </div>
            <div>
              <BrixelButtonPrimary
                label="Manage Portals"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-216 m-a"
                onClick={() => openPreview(false)}
              />
            </div>
          </>
        )
      }
    </main>
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
