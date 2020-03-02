import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelIcon } from '@brixel/brixel-components';

function SuccessAssessor(props) {
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
                  <h6>You already got the Assessors Award</h6>
                  <BrixelIcon icon="cup-awards" />
                  <p>We update these data every day for you. Do you want to update your local market check now?</p>
                </>
              ) : (
                <>
                  <h6>Congrats. You earned the Assessor Award and another {achievement.points} Brixels.</h6>
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

SuccessAssessor.propTypes = {
  finishStep: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  history: PropTypes.object.isRequired,
};

SuccessAssessor.defaultProps = {
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
)(SuccessAssessor);
