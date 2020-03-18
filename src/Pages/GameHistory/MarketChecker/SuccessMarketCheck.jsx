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
import { getGamegroup } from '../../../actions/GamificationActions';
import doneMarketCheck from '../../../images/MarketCheck/doneMarketCheck.svg';
import newMarketCheck from '../../../images/MarketCheck/newMarketCheck.svg';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import startMarketCheck from '../../../images/MarketCheck/startMarketCheck.svg';

function SuccessMarketCheck(props) {
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
                        <h5 className="ta-c mb-5">Great, now you know what is out there.</h5>
                        <div className="ta-c"><img src={newMarketCheck} alt="Nes Assessor" /></div>
                        <p className="ta-c mt-5">Congrats! <br/> You earned the <span className="txtGreen400">Market Checker</span> Award and +{achievement.points} Brixels.</p>
                      </>
                    ) : (

                      <>
                        <h5 className="ta-c mb-5">Looks like you can’t get enough data.</h5>
                        <div className="ta-c"><img src={doneMarketCheck} alt="Done Assessor" /></div>
                        <p className="ta-c mt-5">We update these data daily. Would you like to update it now?</p>
                        <div className="dis-f jc-b mt-3 a-c">
                          <BrixelButtonPrimary
                            rounded
                            label="Cancel"
                            background={"white"}
                            saturation={0}
                            color="dark"
                            saturationTxt={700}
                            className="max-w-fix-280 w-perc-100 mr-2 shadow-3dp"
                            onClick={() => history.push(`/${propID}/rewards`) }
                          />
                          <BrixelButtonPrimary
                            rounded
                            label="Yes, update"
                            background={"primary"}
                            className="max-w-fix-280 w-perc-100 ml-2"
                            onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                            rightIcon="arrow-right-small"
                          />
                        </div>
                      </>
                    )
                  }
                </>
              )
            }
          </>
        ) : (
          <>
            <h5 className="ta-c mb-5">Check your local market</h5>
            <div className="ta-c"><img className="w-perc-100" src={startMarketCheck} alt="Done Assessor" /></div>
            <p className="ta-c mt-5 txtDark700">Stop browsing all the portals. I show you all similar properties on sale. Instantly.</p>
            <div className="dis-f jc-b mt-3 a-c">
              <BrixelButtonPrimary
                rounded
                label="Cancel"
                background={"white"}
                saturation={0}
                color="dark"
                saturationTxt={700}
                className="max-w-fix-280 w-perc-100 mr-2 shadow-3dp"
                onClick={() => history.push(`/${propID}/rewards`) }
              />
              <BrixelButtonPrimary
                rounded
                label="Ok, show me"
                background={"primary"}
                className="max-w-fix-280 w-perc-100 m-a"
                onClick={() => history.push(`/${propID}/rewards/achievement/${getParams}`) }
                rightIcon="arrow-right-small"
              />
            </div>
          </>
        )
      }
    </main>
  );
}

SuccessMarketCheck.propTypes = {
  finishedFlow: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  groupdAchievement: PropTypes.object,
  gameStub: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
};

SuccessMarketCheck.defaultProps = {
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
)(SuccessMarketCheck);
