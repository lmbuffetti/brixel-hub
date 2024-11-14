import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import translateTo from '../utils/translation';
import get from 'lodash/get';

interface ProgressBarPercentageType {
  className?: string;
  fullList?: boolean;
  id?: string;
  input?: {
    onChange: (value: string | number) => void;
  };
  lang: string;
  isArrayValue?: boolean;
  progressState?: number;
  readOnly: boolean;
  small?: boolean;
  dealCard?: boolean;
  hideValue?: boolean;
  updateProgressBarFunc?: (data: string | number | (string | number)[] | null) => void;
}

const ProgressBarPercentage = (props: ProgressBarPercentageType) => {
  const {
    className = '',
    fullList,
    id = '',
    input = { onChange: () => '' },
    isArrayValue,
    progressState = 0, // default to a number instead of an empty string
    readOnly,
    updateProgressBarFunc = () => '',
    small,
    lang,
    hideValue,
    dealCard,
  } = props;

  const progressStep = [...Array(5)];
  const [progressBarState, setProgressBarState] = useState<number | null>(0); // use number or null
  const [hoverLabel, setHoverLabel] = useState<number>(0);

  useEffect(() => {
    if (input.onChange && progressBarState !== null) {
      input.onChange(progressBarState);
    }
  }, [progressBarState]);

  const activeStateProgress = (index: number) => {
    if (progressState === null) return '';
    const thresholdValue = 200 + index * 100;
    return +progressState > index * 20 ? `bg${dealCard ? 'Text' : 'Red'}${thresholdValue}` : '';
  };

  useEffect(() => {
    if (!isArrayValue) setProgressBarState(progressState);
  }, [id]);

  const colorPercentage = () => {
    let colorNumer = ((+progressState / 20) + 1) * 100;
    if (hoverLabel) colorNumer = (hoverLabel + 1) * 100;
    if (colorNumer < 200) colorNumer = 200;
    return fullList ? 'txtText900' : `txtRed${colorNumer}`;
  };

  const getWidth = () => {
    return isArrayValue ? 'w-fix-48' : 'w-perc-16';
  };

  const getState = () => {
    if (progressState === 0) return '0';
    if (progressState === undefined) return '0';
    return +progressState > 0 ? progressState.toString() : translateTo('All', lang);
  };

  const getHoverLabel = () => {
    if (hoverLabel > 0) {
      return hoverLabel * 20;
    }
    return fullList ? progressState : getState();
  };

  return (
    <div className={`progress-bar ${isArrayValue ? 'filterByProgress' : ''} ${className} ${dealCard ? 'dealCard dis-f a-c' : 'dis-fl-col'}`}>
      {
        dealCard && (
          <span className={'state mr-1 txtText600 fsize-200 dis-b overline tt-up notranslate'}>{getHoverLabel()}%</span>
        )
      }
      {
        !readOnly && (
          <div className={`dis-fl-row a-c jc-b ${fullList ? 'mb-1' : 'mb-2'}`}>
            <div className={`progress a-c dis-fl-row ${fullList ? 'pt-small-4' : ''}`}>
              {
                !fullList && (
                  <>
                    <span className="title overline tt-up">{translateTo('Probability', lang)}:</span>&nbsp;
                  </>
                )
              }
              <span className={`state overline tt-up notranslate ${colorPercentage()}`}>{getHoverLabel()}%</span>
            </div>
          </div>
        )
      }
      {
        readOnly && hideValue && !dealCard && (
          <span className="read-only-state fsize-300 txtText900 mb-1">{(fullList ? progressState : (progressState || '0'))}%</span>
        )
      }
      <div className={`bars dis-fl-row ${small ? 'h-fix-8' : 'h-fix-16'}`}>
        {
          progressStep.map((_option, i) => (
            <div
              key={`prgStp_${i}`}
              className={`single-bar ${dealCard ? 'card' : ''}
                        ${i === 0 ? 'first' : ''}
                        ${i === (progressStep.length - 1) ? 'last' : ''}
                        ${activeStateProgress(i) ? activeStateProgress(i) : 'bgText50'}
                        ${readOnly ? `w-fix-32 margin-2 ${i === (progressStep.length - 1) ? '' : 'margin-2'}` : `${getWidth()} ${i === (progressStep.length - 1) ? '' : 'margin-4'}`}
                        ${!readOnly ? `cur-poi hover-active bgText300 bgHoverRed${((hoverLabel || 0) + 1) * 100}` : ''}`}
              onClick={() => {
                if (!readOnly) {
                  if (i && (i + 1) * 20 !== progressState) {
                    updateProgressBarFunc(i + 1);
                  } else if (i && (i + 1) * 20 === progressState) {
                    updateProgressBarFunc(null); // use null for no progress state
                  } else if (i === 0) {
                    updateProgressBarFunc(progressState === 0 ? i + 1 : 0);
                  } else {
                    updateProgressBarFunc(0);
                  }
                  setHoverLabel(0);
                }
              }}
              onMouseEnter={() => !readOnly && setHoverLabel(i + 1)}
              onMouseLeave={() => !readOnly && setHoverLabel(0)}
            />
          ))
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(connect(mapStateToProps, null))(ProgressBarPercentage);