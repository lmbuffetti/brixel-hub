import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

function PathDonuts(props) {
  const {
    radius, slice, sliceColor, hovered, id, isHover,
  } = props;
  const [isHovered, setIsHovered] = useState(isHover);

  useEffect(() => {
    setIsHovered(isHover);
  }, [isHover]);

  const onMouseOver = () => {
    hovered(id);
    setIsHovered(true);
  };

  const onMouseOut = () => {
    hovered(null);
    setIsHovered(false);
  };

  const outerRadius = isHovered ? radius * 1.1 : radius;
  const innerRadius = radius * 0.65;

  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padAngle(0.01)
    .cornerRadius(2);

  return (
    <g
      onMouseOver={() => onMouseOver()}
      onMouseOut={() => onMouseOut()}
      onFocus={() => onMouseOver()}
      onBlur={() => onMouseOut()}
    >
      <path
        d={arc(slice)}
        fill={sliceColor}
      />
    </g>
  );
}

PathDonuts.propTypes = {
  hovered: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  slice: PropTypes.object.isRequired,
  sliceColor: PropTypes.string.isRequired,
};

export default PathDonuts;
