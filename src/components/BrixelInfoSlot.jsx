import React from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon } from '@brixel/brixel-components';
import translateTo from '../utils/translation';

const BrixelInfoSlot = (props) => {
  const {
    bg,
    bgIcon,
    colorIcon,
    icon,
    lang,
    subtitle,
    title,
  } = props;

  return (
    <div className={`pos-r bg${bg} brdRadius dis-f a-c mb-2 w-perc-100 p-2`}>
      <BrixelIcon
        icon={icon}
        color={colorIcon}
        saturationTxt={0}
        saturation={0}
        background={bgIcon}
      />
      <div className="ml-2">
        <h6 className="fweight-400">{translateTo(title, lang)}</h6>
        {
          subtitle && (
            <p className="fsize-100">{translateTo(subtitle, lang)}</p>
          )
        }
      </div>
    </div>
  );
};

BrixelInfoSlot.propTypes = {
  bg: PropTypes.string,
  bgIcon: PropTypes.string,
  colorIcon: PropTypes.string,
  icon: PropTypes.string,
  lang: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

BrixelInfoSlot.defaultProps = {
  bg: 'Light100',
  bgIcon: 'Green200',
  colorIcon: 'Green700',
  icon: 'calendar',
  subtitle: null,
};

export default BrixelInfoSlot;
