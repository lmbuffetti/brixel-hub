import React, { useEffect, useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import isNaN from 'lodash/isNaN';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelShowQuality, BrixelSelect } from '@brixel/brixel-components';

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
    });
    return lessNumber || 0;
  };

  return (
    <main id="rewards" className="pb-4">
      <h5 className='ta-c'>Voila!</h5>
      <h5 className='ta-c mb-5'>Here is your condition check.</h5>
      {
        condition && condition[selBaseRenovation] && (
          <>
            {
              condition[selBaseRenovation].constructor && (
                <div className='dis-f jc-b mb-2'>
                  <h6>Construction Material</h6>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].constructor[Object.keys(condition[selBaseRenovation].constructor)[0]]}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].roof && (
                <div className='dis-f jc-b mb-2'>
                  <h6>Roof Type</h6>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].roof[Object.keys(condition[selBaseRenovation].roof)[0]]}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].facade && (
                <div className='dis-f jc-b mb-2'>
                  <h6>Facade</h6>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].facade[Object.keys(condition[selBaseRenovation].facade)[0]]}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].heating && (
                <div className='dis-f jc-b mb-2'>
                  <h6>Heating</h6>
                  <BrixelShowQuality
                    value={selOneElement(condition[selBaseRenovation].heating) || 0}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].kitchen && (
                <div className='dis-f jc-b mb-2'>
                  <h6>Kitchen</h6>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].kitchen}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].wetCells && (
                <div className='dis-f jc-b mb-2'>
                  <h6>Wet Cells</h6>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].wetCells}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].electricalSystems && (
                <div className='dis-f jc-b'>
                  <h6>Electrical Systems</h6>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].electricalSystems}
                  />
                </div>
              )
            }
            <div className="dis-f jc-fe a-c mt-4">
              <p className="mr-2">based on</p>
              <BrixelSelect
                options={[
                  {
                    value: 'construction',
                    label: 'Construction year'
                  },
                  {
                    value: 'renovation',
                    label: 'Renovation year'
                  }
                ]}
                input={{
                  onChange: (val) => setSelRenovation(val),
                  name: 'selBaseRenovation',
                  value: selBaseRenovation,
                }}
              />
            </div>
          </>
        )
      }
      <div>

      </div>
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
