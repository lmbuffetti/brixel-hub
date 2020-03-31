/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import doneHomebase from '../../../images/Homebase/doneHomebase.svg';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';

function SuccessHomebase(props) {
  // PROPS
  const {
    gameGroup,
    gameStub,
  } = props;
  const getParams = gameStub;
  const [achievement, setAchievement] = useState({});

  useEffect(() => {
    if (gameGroup) {
      let selectedGame;
      gameGroup.map((game) => {
        let curGame = game.achievements.find(item => item.stub === getParams);
        if (curGame) selectedGame = curGame;
        return null;
      });
      setAchievement(selectedGame || {});
    }
  }, [gameGroup, getParams]);

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col jc-b">
      <h5 className="ta-c mb-5">And the first award goes to… You!</h5>
      <img className="ta-c" src={doneHomebase} alt="Done Assessor" />
      <p className="ta-c mt-5">You earned the <span className="txtGreen400">„{achievement.name}“</span> Award and +{achievement.points} Brixels.</p>
    </main>
  );
}

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
});

const mapDispatchToProps = (dispatch) => ({
});


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessHomebase);
