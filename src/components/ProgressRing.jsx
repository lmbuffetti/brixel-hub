import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/SCSS/components/progress-ring.scss';
import factIcon from '../images/fact-percentage-icon.svg';

const ProgressRing = (props) => {
  const [offset, setOffset] = useState(0);
  const circleRef = useRef(null);
  const {
    circleOneStroke,
    circleTwoStroke,
    progress,
    showIcon,
    size,
    strokeWidth,
  } = props;

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);

    circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out';
  }, [setOffset, progress, circumference, offset]);

  return (
    <div className="pos-r">
      {
        showIcon && (
          <img loading="lazy" width={size / 2.5} height={size / 2.5} className="factIcon pos-a xy-c" alt="factIcon" src={factIcon} />
        )
      }
      <svg
        className="progressRing"
        width={size}
        height={size}
      >

        <circle
          className="svg-circle-bg"
          stroke={circleOneStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="svg-circle"
          ref={circleRef}
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
};

ProgressRing.propTypes = {
  circleOneStroke: PropTypes.string.isRequired,
  circleTwoStroke: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  showIcon: PropTypes.bool,
  size: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
};

ProgressRing.defaultProps = {
  showIcon: true,
};

export default ProgressRing;
