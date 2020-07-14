import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelSelect, FactsOptions } from '@brixel/brixel-components';
// eslint-disable-next-line import/no-cycle
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
  const getCountryCode = get(formValue, 'location.countryCode', 'CH');
  const getAssessorAvgLifespan = AssessorAvgLifespan[getCountryCode.toLowerCase()] ? AssessorAvgLifespan[getCountryCode.toLowerCase()] : AssessorAvgLifespan.ch;
  const [AvgLifeSpan] = useState(cloneDeep(getAssessorAvgLifespan));

  useEffect(() => {
    if (has(condition, 'renovation')) {
      setSelRenovation('renovation');
    }
  }, [condition]);

  // GET THE VALUES OBJECT IF SELECTED CONTRUCTION/RENOVATION YEAR
  const getValue = (type, act) => {
    if (get(condition, `[${selBaseRenovation}][${type}]`, null) !== null) {
      if (act === 'key') return Object.keys(condition[selBaseRenovation][type])[0];
      return condition[selBaseRenovation][type][Object.keys(condition[selBaseRenovation][type])[0]];
    }
    return null;
  };

  // GET THE LABEL FOR EACH VALUE
  const getLabel = (type) => {
    let getElement = {};
    const value = getValue(type, 'key');
    let name = type;
    if (type === 'construction') name = 'constructionMaterials';
    if (type === 'roof') name = 'roofType';
    if (factsOptions[name]) {
      getElement = factsOptions[name].find((val) => val.value === value);
    }
    let year = AvgLifeSpan[type][value];
    if (typeof year === 'undefined') year = AvgLifeSpan[type];
    let label = '';
    if (has(getElement, 'label')) {
      label = `<span>${getElement.label}</span><span>,</span>`;
    }
    return {
      label: getElement ? getElement.label : null,
      year,
      string: `${label}<span> ø ${year}&nbsp;</span><span>years</span>`,
    };
  };

  // CALC VALUE BY YEAR AND STATIC VALUE
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
    });
  };

  // CALC SCALE VALUE BY 4 STEPS
  const getEvaluationScale = (type) => {
    let value = get(condition, `[${selBaseRenovation}][${type}]`, '');
    if (isObject(value)) value = value[Object.keys(value)[0]];
    const color = [
      'bgRed500',
      'bgRed300',
      'bgGreen300',
      'bgGreen600',
    ];
    return {
      label: factsOptions.qualityAssessor[value - 1] ? factsOptions.qualityAssessor[value - 1].label : null,
      color: color[value - 1],
    };
  };

  return (
    <main id="rewards" className="pb-4 h-perc-100">
      <h5 className="ta-c">Voila!</h5>
      <h5 className="ta-c mb-5">Here is your condition check.</h5>

      <div className="my-4 pos-r zIndex2 ta-c dis-fl-col a-c jc-c">
        <p
          className={`ta-c ${has(condition, 'renovation.construction') ? 'mr-2' : 'mr-1'} txtDark700 mb-1`}
        >
          {
            !has(condition, 'renovation.construction') ? (
              <>
                <span>based on</span>
                <span>&nbsp;</span>
                <span className="txtDark700">construction year</span>
              </>
            ) : (
              <span>based on</span>
            )
          }
        </p>
        {
          has(condition, 'renovation.construction') && (
            <BrixelSelect
              options={[
                {
                  value: 'construction',
                  label: 'Construction year',
                },
                {
                  value: 'renovation',
                  label: 'Renovation year',
                },
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

      <div className="p-md-2 py-2 mb-3 ta-c max-w-fix-360 m-a">
        <ChartDonuts
          assessor={get(condition, `[${selBaseRenovation}]`, '')}
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
              Object.keys(AvgLifeSpan).map((key, i) => (
                <React.Fragment key={i.toString()}>
                  {
                    has(condition, `[${selBaseRenovation}][${key}]`) && getEvaluationScale(key).label && (
                      <div className="dis-f-md jc-b mb-3 mb-md-4">
                        <div className="max-w-fix-md-176 w-perc-100 mb-1 mb-md-0">
                          <p className="fweight-500 txtDark700">{AssessorLabel[key]}</p>
                          <p
                            className="body2"
                            dangerouslySetInnerHTML={{ __html: getLabel(key).string }}
                          />
                        </div>
                        <div className="dis-f jc-b w-perc-100">
                          <div className="w-perc-100 ml-md-3">
                            <div className="barAssessor pos-r bgLight200 mt-1">
                              <div
                                className={`w-perc-${startEndYear(key).lineValue} ${getEvaluationScale(key).color} h-perc-100 pos-a-fix x-l-0 x-t-0`}
                              />
                            </div>
                            <div className="dis-f jc-b a-c fsize-100 mt-1 pr-small-4 pl-small-4">
                              <p
                                className="body2 txtDark200 w-perc-33 ta-l"
                              >
                                {startEndYear(key).start}
                              </p>
                              <p
                                className="fweight-500 txtDark700 body2 w-perc-34 ta-c"
                              >
                                {getEvaluationScale(key).label}
                              </p>
                              <p className="body2 txtDark200 w-perc-33 ta-r">
                                {startEndYear(key).end}
                              </p>
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

      <div />
    </main>
  );
}

ResumeAssessor.propTypes = {
  condition: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
};

ResumeAssessor.defaultProps = {
};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
  condition: get(state, 'property.activeSingleProperty.assessor', {}) || {},
  formValue: get(state, 'form.Property.values', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ResumeAssessor);
