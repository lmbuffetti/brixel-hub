import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { getGamegroup } from '../../actions/GamificationActions';
import doneMarketCheck from '../../images/MarketCheck/doneMarketCheck.svg';
import newMarketCheck from '../../images/MarketCheck/newMarketCheck.svg';

function SuccessMarketCheck(props) {
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
        console.log(gameGroup);
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
                  <h5 className="ta-c mb-5">Looks like you can’t get enough data.</h5>
                  <div className="ta-c"><img src={doneMarketCheck} alt="Done Assessor" /></div>
                  <p className="ta-c mt-5">We update these data daily. Would you like to update it now?</p>
                </>
              ) : (
                <>
                  <h5 className="ta-c mb-5">Great, now you know what is out there.</h5>
                  <div className="ta-c"><img src={newMarketCheck} alt="Nes Assessor" /></div>
                  <p className="ta-c mt-5">Congrats. You earned the <span className="txtGreen400">Market Checker</span> Award and +{achievement.points} Brixels.</p>
                </>
              )
            }
          </>
        )
      }
    </main>
  );
}

SuccessMarketCheck.propTypes = {
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  history: PropTypes.object.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
};

SuccessMarketCheck.defaultProps = {
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
)(SuccessMarketCheck);
