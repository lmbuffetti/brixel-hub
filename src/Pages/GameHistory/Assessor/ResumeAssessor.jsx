import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import isObject from 'lodash/isObject';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelSelect, FactsOptions } from '@brixel/brixel-components';
import { AssessorAvgLifespan, AssessorLabel } from '../../../resources/Assessor';
import ChartDonuts from '../../../components/Charts/ChartDonuts';
const { factsOptions } = FactsOptions;

function ResumeAssessor(props) {
  // PROPS
  const {
    condition,
    formValue,
  } = props;
  // STATE
  const [selBaseRenovation, setSelRenovation] = useState('construction');

  useEffect(() => {
    if (has(condition, 'renovation')) {
      setSelRenovation('renovation');
    }
  }, [condition]);

  const getValue = (type, act) => {
    if (act === 'key') return Object.keys(condition[selBaseRenovation][type])[0];
    return condition[selBaseRenovation][type][Object.keys(condition[selBaseRenovation][type])[0]];
  };

  const getLabel = (type) => {
    let getElement = {};
    const value = getValue(type, 'key');
    let name = type;
    if (type === 'construction') name = 'constructionMaterials';
    if (type === 'roof') name = 'roofType';
    if (factsOptions[name]) {
      getElement = factsOptions[name].find(val => val.value === value);
    }
    let year = AssessorAvgLifespan[type][value];
    if (typeof year === 'undefined') year = AssessorAvgLifespan[type];
    let label = '';
    if (getElement.label) {
      label = `<span>${getElement.label}</span><span>,</span>`;
    }
    return {
      label: getElement.label,
      year: year,
      string: `${label}<span> ø ${year}&nbsp;</span><span>years</span>`
    }
  };

  const startEndYear = (type) => {
    const avgYear = getLabel(type).year;
    let startYear = get(formValue, 'properties.building.built', 1500);
    if (selBaseRenovation === 'renovation') startYear = get(formValue, 'properties.building.renovated', 1500);
    const endYear = +startYear + avgYear;
    const currentYear = new Date().getFullYear();
    const percentage = Math.round(((currentYear - startYear) * 100) / (+endYear - +startYear));
    return ({
      start: startYear,
      end: +startYear + avgYear,
      lineValue: percentage > 100 ? 100 : percentage,
    })
  };

  const getEvaluationScale = (type) => {
    let value = condition[selBaseRenovation][type];
    if (isObject(value)) value = value[Object.keys(value)[0]];
    const color = [
      'bgRed500',
      'bgRed300',
      'bgGreen300',
      'bgGreen600',
    ];
    return {
      label: factsOptions.qualityAssessor[value - 1].label,
      color: color[value - 1],
    }
  };

  return (
    <main id="rewards" className="pb-4 h-perc-100">
      <h5 className='ta-c'>Voila!</h5>
      <h5 className='ta-c mb-5'>Here is your condition check.</h5>

      <div className="my-4 pos-r zIndex2 ta-c dis-fl-col a-c jc-c">
        <p className={`ta-c ${condition['renovation'] ? 'mr-2' : 'mr-1'} txtDark700 mb-1`}>based on {!has(condition, 'renovation.construction') && (<span className="txtDark700">construction year</span>)}</p>
        {
          has(condition, 'renovation.construction') && (
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
          )
        }
      </div>


      <div className="p-2 mb-3 ta-c max-w-fix-320 m-a">
        <ChartDonuts
          assessor={condition[selBaseRenovation]}
          smallPie
          noText
          showPercOnHover
        />
      </div>

      <hr />
      <h5 className="mt-3">Lifespan calculation</h5>
      {
        has(condition, selBaseRenovation) && (
          <>
            <div className="jc-b my-3 hide dis-f-md">
              <div className="max-w-fix-md-176 fsize-100 w-perc-100">Elements</div>
              <div className="dis-f jc-b w-perc-100">
                <div className="dis-f jc-b w-perc-100 ml-3">
                  <div className="fsize-100 w-perc-33 ta-l">
                    {selBaseRenovation === 'construction' ? 'Construction' : 'Renovation'} year
                  </div>
                  <div className="fsize-100 w-perc-34 ta-c">Condition</div>
                  <div className="fsize-100 w-perc-33 ta-r">Expiration year</div>
                </div>
              </div>
            </div>
            {
              Object.keys(AssessorAvgLifespan).map((key, i) => (
                <React.Fragment key={i.toString()}>
                  {
                    condition[selBaseRenovation][key] && (
                      <div className='dis-f-md jc-b mb-3 mb-md-4'>
                        <div className="max-w-fix-md-176 w-perc-100 mb-1 mb-md-0">
                          <p className="fweight-500 txtDark700">{AssessorLabel[key]}</p>
                          <p className="body2" dangerouslySetInnerHTML={{ __html: getLabel(key).string}} />
                        </div>
                        <div className="dis-f jc-b w-perc-100">
                          <div className="w-perc-100 ml-md-3">
                            <div className="barAssessor pos-r bgLight200 mt-1">
                              <div className={`w-perc-${startEndYear(key).lineValue} ${getEvaluationScale(key).color} h-perc-100 pos-a-fix x-l-0 x-t-0`} />
                            </div>
                            <div className="dis-f jc-b a-c fsize-100 mt-1 pr-small-4 pl-small-4">
                              <p className="body2 txtDark200 w-perc-33 ta-l">{startEndYear(key).start}</p>
                              <p className="fweight-500 txtDark700 body2 w-perc-34 ta-c">{getEvaluationScale(key).label}</p>
                              <p className="body2 txtDark200 w-perc-33 ta-r">{startEndYear(key).end}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </React.Fragment>
              ))
            }
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
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object.isRequired),
  history: PropTypes.object.isRequired,
};

ResumeAssessor.defaultProps = {
  finishStep: false,
};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  condition: get(state, 'property.activeSingleProperty.assessor', {}),
  formValue: get(state, 'form.Property.values', {}),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ResumeAssessor);
