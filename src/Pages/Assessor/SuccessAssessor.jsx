import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelIcon } from '@brixel/brixel-components';
import { getGamegroup } from '../../actions/GamificationActions';
import doneAssessor from '../../images/Assessor/doneAssessor.svg';
import newAssessor from '../../images/Assessor/newAssessor.svg';

function SuccessAssessor(props) {
  // PROPS
  const {
    finishedFlow,
    gameGroup,
    handleGetGameGroup,
    history,
  } = props;
  // STATE
  const [achievement, setAchievement] = useState(null);
  // URL PARAMS
  const getParams = last(history.location.pathname.split('/'));

  useEffect(() => {
    handleGetGameGroup();
  }, []);

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
              finishedFlow ? (
                <>
                  <h5 className="ta-c mb-5">You are already an Assessor</h5>
                  <div className="ta-c"><img src={doneAssessor} alt="Done Assessor" /></div>
                  <p className="ta-c mt-5">Would you like to do the condition check again?</p>
                </>
              ) : (
                <>
                  <h5 className="ta-c mb-5">Well done. You are now an Assessor.</h5>
                  <div className="ta-c"><img src={newAssessor} alt="Nes Assessor" /></div>
                  <p className="ta-c mt-5">Congrats. You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
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
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  history: PropTypes.object.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
};

SuccessAssessor.defaultProps = {
  finishedFlow: false,
};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGameGroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessAssessor);
