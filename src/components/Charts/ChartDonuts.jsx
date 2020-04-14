/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import SliceDonuts from './SliceDonuts';
import { colorCharts, colorChartsQuality } from '../../utils/constants';
import { FactsOptions } from '@brixel/brixel-components';
const { factsOptions } = FactsOptions;
// const data = [1, 2, 3, 20];

function ChartDonuts(props) {
  // PROPS
  const {
    assessor,
    properties,
  } = props;
  // STATE
  const [data, setData] = useState([]);
  const [isHover, setIsHover] = useState(null);
  // CONFIGURATION
  const height = props.smallPie ? 134 : 220;
  const width = props.smallPie ? 134 : 220;

  useEffect(() => {
    const newData = [];
    if (properties) {
      properties.map(item => (
        newData.push(item.numberOfProperties)
      ));
    }
    setData(newData);
  }, [properties]);

  useEffect(() => {
    if (assessor) {
      const newData = [0, 0, 0, 0];
      Object.keys(assessor).map((key) => {
        if (isObject(assessor[key])) {
          Object.keys(assessor[key]).map((subkey) => {
            const newID = assessor[key][subkey] - 1;
            newData[newID] = newData[newID] + 1;
            return null;
          })
        } else {
          const newID = assessor[key] - 1;
          newData[newID] = +newData[newID] + 1;
        }
        return null;
      });
      setData(newData);
    }
  }, [assessor]);

  const pie = d3.pie()(data);

  const textOnPieChart = () => {
    const total = data.reduce((a, b) => a + b, 0);
    if (isHover !== null) {
      const percentage = (properties[isHover].numberOfProperties * 100) / total;
      return (
        <div className="donut-tip">
          <span className="partial-number">{properties[isHover].numberOfProperties}</span>
          <div className="properties"><span>{properties[isHover].subType}</span></div>
          <span className="percentage">{`${Math.ceil(percentage)}%`}</span>
        </div>
      );
    }
    return (
      <div className="donut-tip">
        <span className="total-number">{total}</span>
        <div className="properties"><span>properties</span></div>
      </div>
    );
  };

  return (
    <div className="donut-graph mt-medium">
      <div className="donut-content donutsPieChart">
        <div
          className="svg-range-container"
          style={{width: width, height: height, flex: `0 0 ${width}px`}}
        >
          <svg height={height} width={width}>
            <g style={{ transform: `translate(${width / 2}px,${height / 2}px)`}}>
              <SliceDonuts
                pie={pie}
                hovered={val => setIsHover(val)}
                isHover={isHover}
                radius={(width / 2) - 10}
                colors={assessor ? colorChartsQuality : colorCharts}
              />
            </g>
          </svg>
          {!props.noText ? textOnPieChart() : ''}
        </div>
        {
          properties.length > 0 && (
            <div className="donut-labels">
              {
                properties.map((item, i) => (
                  <div key={i.toString()} className={`label-container ${isHover === i ? 'hover' : ''}`}>
                    <div className="number-container">
                      <i className="color" style={{ backgroundColor: colorCharts[i] }} />
                      <span className="number">{item.numberOfProperties}</span>
                    </div>
                    <div className="type"><span>{item.subType}</span></div>
                  </div>
                ))
              }
            </div>
          )
        }
        {
          assessor && (
            <div className="donut-labels-vert dis-f-col">
              {
                data.map((item, i) => (
                  <div key={i.toString()} className={`label-container ${isHover === i ? 'hover' : ''}`}>
                    <div className="number-container">
                      <i className="color" style={{ backgroundColor: colorChartsQuality[i] }} />
                      <span className="number">{factsOptions.quality[i].label}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

ChartDonuts.propTypes = {
  assessor: PropTypes.object,
  properties: PropTypes.arrayOf(PropTypes.object),
};

ChartDonuts.defaultProps = {
  assessor: null,
  properties: [],
};

export default ChartDonuts;
