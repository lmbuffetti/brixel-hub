import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelShowQuality } from '@brixel/brixel-components';
import { arrayToObject } from 'redux-actions/lib/utils/arrayToObject';

function ResumeBestimate(props) {
  // PROPS
  const {
    condition,
    gameGroup,
    history,
  } = props;
  // STATE
  const [achievement, setAchievement] = useState(null);
  const [selBaseRenovation, setSelRenovation] = useState('renovation');
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

  const selOneElement = (el) => {
    let lessNumber = 4;
    Object.keys(el).map((key) => {
      if (el[key] < lessNumber) lessNumber = el[key];
      return null;
    });
    return lessNumber;
  };

  return (
    <main id="rewards" className="pb-4">
      <h4>Voila!</h4>
      <h4>Here is your condition check.</h4>
      {
        condition && condition[selBaseRenovation] && (
          <>
            <span>Bestimate</span>
          </>
        )
      }
    </main>
  );
}

ResumeBestimate.propTypes = {
  condition: PropTypes.object,
  finishStep: PropTypes.bool,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  history: PropTypes.object.isRequired,
};

ResumeBestimate.defaultProps = {
  finishStep: false,
};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  condition: get(state, 'property.property.bestimate', {}),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeBestimate);
