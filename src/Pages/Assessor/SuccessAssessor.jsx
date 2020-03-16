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
import doneAssessor from '../../images/Assessor/doneAssessor.svg';
import newAssessor from '../../images/Assessor/newAssessor.svg';
import becomeAssessor from '../../images/Assessor/becomeAssessor.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

function SuccessAssessor(props) {
  // PROPS
  const {
    gameGroup,
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
    if (gameGroup) {
      let selectedGame;
      gameGroup.map((game) => {
        let curGame = game.achievements.find(item => item.stub === getParams);
        if (curGame) selectedGame = curGame;
        return null;
      });
      setAchievement(selectedGame);
    }
  }, [gameGroup, getParams]);

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
                        <h5 className="ta-c mb-5">You are already an Assessor</h5>
                        <div className="ta-c"><img src={doneAssessor} alt="Done Assessor" /></div>
                        <p className="ta-c mt-5">Would you like to do the condition check again?</p>
                      </>
                    ) : (

                      <>
                        <h5 className="ta-c mb-5">You are already an Assessor</h5>
                        <div className="ta-c"><img src={newAssessor} alt="Done Assessor" /></div>
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
            <h5 className="ta-c mb-5">Assess your property with a condition check</h5>
            <div className="ta-c"><img className="w-fix-100" src={becomeAssessor} alt="Done Assessor" /></div>
            <p className="ta-c mt-5 txtDark700">As an assessor, you know about the condition of the most important parts of your property.</p>
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

SuccessAssessor.propTypes = {
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
};

SuccessAssessor.defaultProps = {
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
)(SuccessAssessor);
