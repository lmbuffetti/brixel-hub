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

function ResumeAssessor(props) {
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

  const selOneElement = (el) => {
    console.log(el);
    let lessNumber = 4;
    Object.keys(el).map((key) => {
      if (el[key] < lessNumber) lessNumber = el[key];
      return null;
    });
    return lessNumber;
  };

  console.log(condition);

  return (
    <main id="rewards" className="pb-4">
      <h4>Voila!</h4>
      <h4>Here is your condition check.</h4>
      {
        condition && condition[selBaseRenovation] && (
          <>
            <div className='dis-f jc-b'>
              <p>Construction Material</p>
              <BrixelShowQuality
                value={condition[selBaseRenovation].constructor[Object.keys(condition[selBaseRenovation].constructor)[0]]}
              />
            </div>
            <div className='dis-f jc-b'>
              <p>Roof Type</p>
              <BrixelShowQuality
                value={condition[selBaseRenovation].roof[Object.keys(condition[selBaseRenovation].roof)[0]]}
              />
            </div>
            <div className='dis-f jc-b'>
              <p>Heating</p>
              <BrixelShowQuality
                value={selOneElement(condition[selBaseRenovation].heating)}
              />
            </div>
            <div className='dis-f jc-b'>
              <p>Kitchen</p>
              <BrixelShowQuality
                value={condition[selBaseRenovation].kitchen}
              />
            </div>
            <div className='dis-f jc-b'>
              <p>Wet Cells</p>
              <BrixelShowQuality
                value={condition[selBaseRenovation].wetCells}
              />
            </div>
            <div className='dis-f jc-b'>
              <p>Electrical Systems</p>
              <BrixelShowQuality
                value={condition[selBaseRenovation].electricalSystems}
              />
            </div>
          </>
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
