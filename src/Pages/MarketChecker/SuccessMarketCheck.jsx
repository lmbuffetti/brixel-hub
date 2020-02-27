import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelIcon } from '@brixel/brixel-components';
import last from 'lodash/last';
import get from 'lodash/get';

function LocalMarketCheck(props) {
  // PROPS
  const {
    finishStep,
    gameGroup,
    history,
  } = props;
  // STATE
  const [achievement, setAchievement] = useState(null);
  // URL PARAMS
  const getParams = last(history.location.pathname.split('/'));

  useEffect(() => {
    console.log(gameGroup);
    if (gameGroup) {
      let selectedGame;
      gameGroup.map((game) => {
        let curGame = game.achievements.find(item => item.stub === getParams);
        if (curGame) selectedGame = curGame;
      });
      setAchievement(selectedGame);
    }
  }, [gameGroup]);

  return (
    <main id="rewards" className="pb-4">
      {
        achievement && (
          <>
            {
              finishStep ? (
                <>
                  <h6>You already got the Market Checker Award</h6>
                  <BrixelIcon icon="cup-awards" />
                  <p>We update these data every day for you. Do you want to update your local market check now?</p>
                </>
              ) : (
                <>
                  <h6>Congrats. You earned teh Market Checker Award and another {achievement.points} Brixels.</h6>
                  <BrixelIcon icon="cup-awards" />
                </>
              )
            }
          </>
        )
      }
    </main>
  );
}

LocalMarketCheck.propTypes = {
  finishStep: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  history: PropTypes.object.isRequired,
};

LocalMarketCheck.defaultProps = {
  finishStep: false,
};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LocalMarketCheck);
