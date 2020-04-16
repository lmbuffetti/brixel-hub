import React  from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import PathDonuts from './PathDonuts';

function SliceDonuts(props) {
  const { pie, hovered, isHover, radius, colors } = props;

  // const interpolate = d3.interpolateRgb('#eaaf79', '#bc3358');
  const interpolateInner = d3.interpolateRgb('#eaaf79', '#bc3358');

  return pie.map((slice, index) => {
    const sliceColor = colors[index];
    console.log(isHover, index)
    return (
      <PathDonuts
        key={index.toString()}
        id={index}
        radius={radius}
        interpolate={interpolateInner}
        slice={slice}
        sliceColor={sliceColor}
        hovered={val => hovered(val)}
        isHover={isHover === index}
      />
    );
  });
}

SliceDonuts.propTypes = {
  radius: PropTypes.number,
};

SliceDonuts.defaultProps = {
  radius: 100
};

export default SliceDonuts;
