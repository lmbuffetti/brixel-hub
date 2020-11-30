import React from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon, BrixelStatus } from '@brixel/brixel-components';

const BrixelButtonAchievement = (props) => {
  const {
    active,
    config,
    disabled,
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

  // FUNCTIONS TO MANAGE THE SUBTITLE OVER THE TITLE
  const subTitleHover = () => {
    if (isFree) return 'Free';
    if (isFree === null) return 'Coming soon';
    return `Unlock ${subtitle}`;
  };

  return (
    <div className="pos-r">
      <button
        type="button"
        onClick={(e) => (onClick ? onClick(e) : '')}
        className={`${defaultClass} ${activeClass}`}
        disabled={disabled}
      >
        {
          // CONDITION IF THE SECTION IS DONE OR NOT
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
                <p className="body txtDark200 td-lt">{title}</p>
              </div>
            </>
          ) : (
            <>
              <div className="pos-r">
                <BrixelIcon
                  rounded
                  background={config.bgIconColor}
                  saturation={200}
                  color={config.iconColor}
                  saturationTxt={700}
                  icon={icon}
                  className="shadow-3dp"
                />
                <BrixelStatus
                  className="pos-a-fix x-r-0 x-b-0"
                  color="red"
                  saturation={400}
                />
              </div>
              <div className="ta-l w-perc-100 pl-2">
                <span className={isFree ? 'txtGreen400' : 'txtRed400'}>{subTitleHover()}</span>
                <p className="body txtDark700">{title}</p>
              </div>
              <BrixelIcon
                rounded
                bgTransparent
                color="light"
                saturationTxt={400}
                className="fsize-400 mr-1 onHover"
                icon={disabled ? '' : 'arrow-simple-right'}
              />
            </>
          )
        }
      </button>
      {
        // VERTICAL LINE AFTER BUTTON
        lineAfter && (
          <div className={`lineAfter ${config.lineAfter}`} />
        )
      }
    </div>
  );
};

BrixelButtonAchievement.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  config: PropTypes.object,
  disabled: PropTypes.bool,
  isFree: PropTypes.bool,
  done: PropTypes.bool,
  icon: PropTypes.string,
  lineAfter: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

BrixelButtonAchievement.defaultProps = {
  active: true,
  config: {},
  disabled: false,
  done: false,
  icon: '',
  isFree: false,
  lineAfter: false,
  subtitle: '',
  title: '',
};

export default BrixelButtonAchievement;
