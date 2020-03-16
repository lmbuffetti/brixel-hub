/* eslint-disable react-hooks/exhaustive-deps */
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
import doneBestimate from '../../images/Bestimate/doneBestimate.svg';
import newBestimate from '../../images/Bestimate/newBestimate.svg';
import startBestimate from '../../images/Bestimate/startBestimate.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

function SuccessBestimate(props) {
  // PROPS
  const {
    gameGroup,
    handleGetGameGroup,
    history,
    gameStub,
    groupdAchievement,
    match,
  } = props;
  // STATE
  const [achievement, setAchievement] = useState(null);
  // URL PARAMS
  const getParams = gameStub;
  const propID = get(match, 'params.propId', null);
  const getDoneFirstTime = () => last(history.location.pathname.split('/'))[last(history.location.pathname.split('/')).length - 1];

  useEffect(() => {
    handleGetGameGroup();
  }, []);

  useEffect(() => {
    if (gameGroup) {
      let selectedGame;
      gameGroup.map((game) => {
        let curGame = game.achievements.find(item => item.stub === getParams);
        if (curGame) selectedGame = curGame;
        return null;
      });
      setAchievement(selectedGame);
    }
  }, [gameGroup]);

  return (
    <main id="rewards" className="pb-4">
      {
        groupdAchievement.done || getDoneFirstTime() === 'done' ? (
          <>
            {
              achievement && (
                <>
                  {
                    getDoneFirstTime() === 'done' ? (
                      <>
                        <h5 className="ta-c mb-5">Well done. You are now an Assessor.</h5>
                        <div className="ta-c"><img src={newBestimate} alt="Nes Assessor" /></div>
                        <p className="ta-c mt-5">Congrats! <br/> You earned the <span className="txtGreen400">Assessor</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (

                      <>
                        <h5 className="ta-c mb-5">You are already a Bestimate&reg;</h5>
                        <div className="ta-c"><img src={doneBestimate} alt="Done Assessor" /></div>
                        <p className="ta-c mt-5">Would you like to do the condition check again?</p>
                        <BrixelButtonPrimary
                          rounded
                          label="Yes, update"
                          background={"primary"}
                          className="max-w-fix-280 w-perc-100 ml-1"
                          onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                          rightIcon="arrow-right-small"
                        />
                      </>
                    )
                  }
                </>
              )
            }
          </>
        ) : (
          <>
            <h5 className="ta-c mb-5">Get a free price indication</h5>
            <div className="ta-c"><img className="w-fix-100" src={startBestimate} alt="Done Assessor" /></div>
            <p className="ta-c mt-5 txtDark700">Compare your property to real transaction data to better define the pricing.</p>
            <BrixelButtonPrimary
              rounded
              label="Ok, show me"
              background={"primary"}
              className="max-w-fix-280 w-perc-100 ml-1"
              onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
              rightIcon="arrow-right-small"
            />
          </>
        )
      }
    </main>
  );
}

SuccessBestimate.propTypes = {
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

SuccessBestimate.defaultProps = {
  finishedFlow: false,
  groupdAchievement: {},
  gameStub: null,
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
)(SuccessBestimate);
