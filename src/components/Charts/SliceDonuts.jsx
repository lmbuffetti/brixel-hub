import React  from 'react';
import * as d3 from 'd3';
import PathDonuts from './PathDonuts';
import { colorCharts } from '../../utils/constants';

function SliceDonuts(props) {
  const { pie, hovered, isHover } = props;

  // const interpolate = d3.interpolateRgb('#eaaf79', '#bc3358');
  const interpolateInner = d3.interpolateRgb('#eaaf79', '#bc3358');

  return pie.map((slice, index) => {
    const sliceColor = colorCharts[index];
    return (
      <PathDonuts
        key={index.toString()}
        id={index}
        radius={100}
        interpolate={interpolateInner}
        slice={slice}
        sliceColor={sliceColor}
        hovered={val => hovered(val)}
        isHover={isHover}
      />
    );
  });
}

export default SliceDonuts;
