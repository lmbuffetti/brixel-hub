import React from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon } from '@brixel/brixel-components';

const BrixelButtonAchievement = (props) => {
  const {
    active,
    award,
    isFree,
    done,
    icon,
    lineAfter,
    subtitle,
    title,
    onClick,
  } = props;

  const activeClass = active ? 'active' : '';
  const defaultClass = 'brixel-button-achievement dis-f a-c jc-b w-perc-100 p-1 brdRadius';

  return (
    <div className='pos-r'>
      <button
        onClick={(e) => onClick ? onClick(e) : ''}
        className={`${defaultClass} ${activeClass}`}
      >
        {
          done ? (
            <>
              <BrixelIcon
                rounded
                bgTransparent
                color="green"
                saturationTxt={400}
                icon="check"
                className="p-small-9"
              />
              <div className="ta-l w-perc-100 pl-2">
                <p className="body txtGreen400 td-lt">{title}</p>
              </div>
              {
                award && (
                  <BrixelIcon
                    rounded
                    bgTransparent
                    color="green"
                    saturationTxt={400}
                    icon="cup-awards"
                  />
                )
              }
            </>
          ) : (
            <>
              <BrixelIcon
                rounded
                background="green"
                saturation={100}
                color="green"
                saturationTxt={400}
                icon={icon}
                className="shadow-3dp"
              />
              <div className="ta-l w-perc-100 pl-2">
                <span>
                  {
                    isFree ? (
                      <span className="txtGreen400">Free</span>
                    ) : (
                      <span className="txtRed400">Unlock</span>
                    )
                  }
                  &nbsp;
                  <span className="txtDark200">{subtitle}</span>
                </span>
                <p className="body txtDark700">{title}</p>
              </div>
              <BrixelIcon
                rounded
                bgTransparent
                color="dark"
                saturationTxt={700}
                iconSize="fsize-400"
                className="p-small-9"
                icon="arrow-simple-right"
              />
            </>
          )
        }
      </button>
      {
        lineAfter && (
          <div className="lineAfter" />
        )
      }
    </div>
  )
};

BrixelButtonAchievement.propTypes = {
  active: PropTypes.bool,
  award: PropTypes.bool,
  isFree: PropTypes.bool,
  done: PropTypes.bool,
  icon: PropTypes.string,
  lineAfter: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

BrixelButtonAchievement.defaultProps = {
  award: false,
};

export default BrixelButtonAchievement;
