import React, {useEffect, useState} from 'react';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import {BrixelIcon} from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import type {ProgressBarType} from '../@types/components/ProgressBar';

const ProgressBar = (props: ProgressBarType) => {
  const {
    className = '',
    id = '',
    input,
    isArrayValue = false,
    lang,
    options,
    progressState,
    progressStateArray = [],
    readOnly,
    updateProgressBarFunc = () => '',
  } = props;

  const [progressBarState, setProgressBarState] = useState<string | null>(null);
  const [progressBarStateArray, setProgressBarStateArray] = useState<string[]>([]);
  const [progressBarStateKey, setProgressBarStateKey] = useState<number | null>(null);
  const [progressBarStateLabel, setProgressBarStateLabel] = useState<string | null>(null);
  const [hoverLabel, setHoverLabel] = useState('');

  const removeEmptyStrings = (array) => array.filter((e) => e.replace(/(\r\n|\n|\r)/gm, ''));

  const updateProgressBar = (e, value) => {
    e.preventDefault();
    removeEmptyStrings(progressBarStateArray);
    if (isArrayValue) {
      const progressValArray: string[] = cloneDeep(progressBarStateArray);
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
    if (input && input.onChange) input.onChange(progressBarState);
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
    else setProgressBarState(progressState || null);
  }, [id]);

  return (
    <div className={`progress-bar ${isArrayValue ? 'filterByProgress' : ''} ${className} dis-fl-col`}>
      {
        !readOnly && (
          <div className="dis-fl-row a-c jc-b mb-2">
            <div className="progress a-c dis-fl-row">
              <span className="title overline tt-up">{translateTo(`Progress${progressBarState || isArrayValue ? ':' : ''}`, lang)}</span>&nbsp;
              <span className="state overline tt-up">{translateTo(hoverLabel || progressBarState || '', lang)}</span>
            </div>
          </div>
        )
      }
      {
        readOnly && (
          <span className="read-only-state fsize-300 txtDark700 mb-1">{translateTo(progressBarStateLabel || 'No progress', lang)}</span>
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
                  <span className="fweight-600 txtLight100 fsize-200 mr-1">{translateTo(item, lang)}</span>
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

export default ProgressBar;
