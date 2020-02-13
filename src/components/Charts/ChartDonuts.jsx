import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import SliceDonuts from './SliceDonuts';
import { colorCharts } from '../../utils/constants';

// const data = [1, 2, 3, 20];

function ChartDonuts(props) {
  const height = 220;
  const width = 220;
  const [data, setData] = useState([]);
  const { properties } = props;
  const [isHover, setIsHover] = useState(null);
  useEffect(() => {
    const newData = [];
    properties.map(item => (
      newData.push(item.numberOfProperties)
    ));
    setData(newData);
  }, []);

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
        <div className="svg-range-container">
          <svg height={height} width={width}>
            <g transform={`translate(${width / 2},${height / 2})`}>
              <SliceDonuts pie={pie} hovered={val => setIsHover(val)} isHover={isHover} />
            </g>
          </svg>
          {textOnPieChart()}
        </div>
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
      </div>
    </div>
  );
}

ChartDonuts.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ChartDonuts;
