import React, {
  useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import { BrixelIcon } from '@brixel/brixel-components';

const ProgressBar = (props) => {
  const {
    className,
    id,
    input,
    isArrayValue,
    options,
    progressState,
    progressStateArray,
    readOnly,
    updateProgressBarFunc,
  } = props;

  const [progressBarState, setProgressBarState] = useState(null);
  const [progressBarStateArray, setProgressBarStateArray] = useState([]);
  const [progressBarStateKey, setProgressBarStateKey] = useState(null);
  const [progressBarStateLabel, setProgressBarStateLabel] = useState(null);
  const [hoverLabel, setHoverLabel] = useState('');

  const removeEmptyStrings = (array) => {
    const newArray = array.filter((e) => e.replace(/(\r\n|\n|\r)/gm, ''));
    return newArray;
  };

  const updateProgressBar = (e, value) => {
    e.preventDefault();
    removeEmptyStrings(progressBarStateArray);
    if (isArrayValue) {
      const progressValArray = cloneDeep(progressBarStateArray);
      if (progressValArray.includes(value)) {
        const index = progressValArray.indexOf(value);
        progressValArray.splice(index, 1);
      } else {
        progressValArray.push(value);
      }
      setProgressBarStateArray(progressValArray);
      updateProgressBarFunc(progressValArray);
    } else {
      setProgressBarState(value);
      updateProgressBarFunc(value);
    }
  };

  const updateProgressBarClose = (e, value) => {
    e.preventDefault();
    removeEmptyStrings(progressBarStateArray);
    if (isArrayValue) {
      const progressValArray = cloneDeep(progressBarStateArray);
      if (progressValArray.includes(value)) {
        const index = progressValArray.indexOf(value);
        progressValArray.splice(index, 1);
      } else {
        progressValArray.push(value);
      }
      setProgressBarStateArray(progressValArray);
      updateProgressBarFunc(progressValArray);
    }
  };

  const getStateKey = () => {
    find(options, (value, key) => {
      if (value.value === progressBarState) {
        setProgressBarStateKey(key);
      }
    });
  };

  const getStateLabel = () => {
    find(options, (value, key) => {
      if (value.value === progressBarState) {
        setProgressBarStateLabel(options[key].label);
      }
    });
  };

  useEffect(() => {
    getStateKey();
    getStateLabel();
    if (input.onChange) input.onChange(progressBarState);
  }, [progressBarState]);

  const activeStateProgress = (index, actVal) => {
    if (progressBarStateKey === null) return '';
    if (isArrayValue) {
      return progressBarStateArray.includes(actVal) ? 'active' : '';
    }
    return progressBarStateKey >= index ? 'active' : '';
  };

  // The id is used to refresh the component state for each property, to avoid memory and caching errors
  // This is due to the fact that the component is based on strings, and the state can have some issues
  // because these label strings are not unique. We need to have a unique attribute like the id that forces the refresh
  useEffect(() => {
    if (isArrayValue) setProgressBarStateArray(removeEmptyStrings(progressStateArray));
    else setProgressBarState(progressState);
  }, [id]);

  return (
    <div className={`progress-bar ${isArrayValue ? 'filterByProgress' : ''} ${className} dis-fl-col`}>
      {
        !readOnly && (
          <div className="dis-fl-row a-c jc-b mb-2">
            <div className="progress a-c dis-fl-row">
              <span className="title overline tt-up">Progress{`${progressBarState || isArrayValue ? ':' : ''}`}</span>&nbsp;
              <span className="state overline tt-up">{hoverLabel || progressBarState}</span>
            </div>
          </div>
        )
      }
      {
        readOnly && (
          <span className="read-only-state fsize-300 txtDark700 mb-1">{progressBarStateLabel || 'No progress'}</span>
        )
      }
      <div className={`bars dis-fl-row ${readOnly ? 'h-fix-8' : 'h-fix-16'}`}>
        {
          options.map((option, i) => (
            <div
              key={`opt_${i.toString()}`}
              className={`single-bar
                        ${i === 0 ? 'first' : ''}
                        ${i === (options.length - 1) ? 'last' : ''}
                        ${readOnly ? `w-fix-32 margin-2 ${i === (options.length - 1) ? '' : 'margin-2'}` : `${isArrayValue ? 'w-fix-48' : 'w-fix-72'} ${i === (options.length - 1) ? '' : 'margin-4'}`}
                        ${activeStateProgress(i, option.value)}
                        ${readOnly === false ? 'cur-poi hover-active' : ''}`}
              onClick={(e) => {
                if (readOnly === false) {
                  if (option.value !== progressBarState) {
                    e.preventDefault();
                    updateProgressBar(e, option.value);
                  }
                }
              }}
              onMouseEnter={() => {
                if (readOnly === false) {
                  setHoverLabel(option.value);
                }
              }}
              onMouseLeave={() => {
                if (readOnly === false) {
                  setHoverLabel('');
                }
              }}
            />
          ))
        }
      </div>
      {
        isArrayValue && (
          <ul className="selectedProgress mt-2">
            {
              progressBarStateArray.map((item, i) => (
                <li
                  key={`prgBr_${i.toString()}`}
                  className="selectedProgressItem"
                >
                  <span className="fweight-600 txtLight100 fsize-200 mr-1">{item}</span>
                  <BrixelIcon
                    icon="close"
                    color="light"
                    saturationTxt={100}
                    className="cur-poi p-small-6 fsize-200"
                    onClick={(e) => updateProgressBarClose(e, item)}
                  />
                </li>
              ))
            }
          </ul>
        )
      }
    </div>
  );
};

ProgressBar.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  input: PropTypes.object,
  isArrayValue: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  progressState: PropTypes.string,
  progressStateArray: PropTypes.arrayOf(PropTypes.string),
  readOnly: PropTypes.bool.isRequired,
  updateProgressBarFunc: PropTypes.func,
};

ProgressBar.defaultProps = {
  className: '',
  id: '',
  input: {},
  isArrayValue: false,
  progressState: '',
  progressStateArray: [],
  updateProgressBarFunc: () => '',
};

export default ProgressBar;
