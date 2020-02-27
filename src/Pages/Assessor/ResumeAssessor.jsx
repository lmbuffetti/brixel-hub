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

function ResumeAssessor(props) {
  // PROPS
  const {
    condition,
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
      <h4>Voila!</h4>
      <h4>Here is your condition check.</h4>
      {
        condition && (
          <p>{condition.construction}</p>
        )
      }
    </main>
  );
}

ResumeAssessor.propTypes = {
  condition: PropTypes.object,
  finishStep: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  history: PropTypes.object.isRequired,
};

ResumeAssessor.defaultProps = {
  finishStep: false,
};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  condition: get(state, 'property.property.assessor', {}),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeAssessor);
