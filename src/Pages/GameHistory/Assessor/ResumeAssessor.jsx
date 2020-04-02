import React, { useState }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelShowQuality, BrixelSelect } from '@brixel/brixel-components';

function ResumeAssessor(props) {
  // PROPS
  const {
    condition,
  } = props;
  // STATE
  const [selBaseRenovation, setSelRenovation] = useState('construction');

  const selOneElement = (el) => {
    let lessNumber = 4;
    Object.keys(el).map((key) => {
      if (el[key] < lessNumber) lessNumber = el[key];
      return null;
    });
    return lessNumber || 0;
  };

  return (
    <main id="rewards" className="pb-4 h-perc-100">
      <h5 className='ta-c'>Voila!</h5>
      <h5 className='ta-c mb-5'>Here is your condition check.</h5>
      {
        condition && condition[selBaseRenovation] && (
          <>
            {
              condition[selBaseRenovation].constructor && (
                <div className='dis-f jc-b mb-2'>
                  <p className="fweight-500 txtDark700">Construction Material</p>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].constructor[Object.keys(condition[selBaseRenovation].constructor)[0]]}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].roof && (
                <div className='dis-f jc-b mb-2'>
                  <p className="fweight-500 txtDark700">Roof Type</p>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].roof[Object.keys(condition[selBaseRenovation].roof)[0]]}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].facade && (
                <div className='dis-f jc-b mb-2'>
                  <p className="fweight-500 txtDark700">Facade</p>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].facade[Object.keys(condition[selBaseRenovation].facade)[0]]}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].heating && (
                <div className='dis-f jc-b mb-2'>
                  <p className="fweight-500 txtDark700">Heating</p>
                  <BrixelShowQuality
                    value={selOneElement(condition[selBaseRenovation].heating) || 0}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].kitchen && (
                <div className='dis-f jc-b mb-2'>
                  <p className="fweight-500 txtDark700">Kitchen</p>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].kitchen}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].wetCells && (
                <div className='dis-f jc-b mb-2'>
                  <p className="fweight-500 txtDark700">Wet Cells</p>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].wetCells}
                  />
                </div>
              )
            }
            {
              condition[selBaseRenovation].electricalSystems && (
                <div className='dis-f jc-b'>
                  <p className="fweight-500 txtDark700">Electrical Systems</p>
                  <BrixelShowQuality
                    value={condition[selBaseRenovation].electricalSystems}
                  />
                </div>
              )
            }
            <div className="dis-f jc-fe a-c mt-4">
              <p className={`${condition['renovation'] ? 'mr-2' : 'mr-1'} txtDark700`}>based on</p>
              {
                condition['renovation'] && condition['renovation'].constructor ? (
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
                ) : (
                  <span className="txtDark700">Construction year</span>
                )
              }
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
  condition: get(state, 'property.activeSingleProperty.assessor', {}),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeAssessor);
