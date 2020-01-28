import React, { useState } from 'react';
import PropTypes from 'prop-types';
import isNaN from 'lodash/isNaN';
import isBoolean from 'lodash/isBoolean';
import {
  BrixelIcon,
} from '@brixel/brixel-components';
import Emoji from './Emoji';
import empowerSellOwn from '../images/BrxielComingTown/empowerSellOwn.png';
import empowerBestMarketing from '../images/BrxielComingTown/empowerBestMarketing.png';
import empowerBestPersonalSupport from '../images/BrxielComingTown/empowerBestPersonalSupport.png';

const BrixelRadioCard = (props) => {
  const {
    disabled,
    className,
    deactivable,
    icons,
    input,
    inputClassName,
    label,
    modal,
    // options,
  } = props;

  const clickOption = (e, val) => {
    if (deactivable) {
      if (e.target.value === val) input.onChange(null);
      if (e.target.value === val.toString()) input.onChange(null);
      if (+e.target.value === val) input.onChange(null);
    }
  };

  const onChange = (e, val) => {
    let value;
    switch (val) {
      case (isBoolean(val)):
        value = Boolean(val);
        break;
      case (!isNaN(val)):
        value = +val;
        break;
      default:
        value = val;
    }
    input.onChange(value);
  };

  const options = [
    {
      label: 'With the right online tools to sell on your own.',
      value: "sell-your-own",
      img: empowerSellOwn
    },
    {
      className: "mx-2",
      label: 'With great marketing to stick out of the crowd.',
      value: "marketing",
      img: empowerBestMarketing,
    },
    {
      label: 'With Personal support all the way to closing of the sale.',
      value: "personal-support",
      img: empowerBestPersonalSupport,
    },
  ];

  return (
    <div className={className}>
      {
        label && (
          <label className="brixel-label">{label}</label>
        )
      }
      <div className="dis-f brixel-wrap-card-btn">
        <div className="dis-f pr-2">
          {
            options.map((opt, i) => (
              <div className={`brixel-radio-card shadow-2dp brdRadius ${opt.className || ''} ${opt.value === input.value ? 'checked' : ''}`} key={i.toString()}>
                <input
                  type="radio"
                  id={`${input.name}_${i}`}
                  value={opt.value}
                  name={input.name}
                  checked={opt.value === input.value}
                  onChange={(e) => onChange(e, opt.value)}
                  onClick={(e) => clickOption(e, opt.value)}
                  disabled={disabled}
                />
                <label
                  className={`${disabled ? 'disabled' : ''}`}
                  htmlFor={`${input.name}_${i}`}
                >
                  <img src={opt.img} alt={opt.label} />
                  <span className="otp-label">{opt.label}</span>
                  <span className="btmLabel">
                  My favorite
                  <BrixelIcon
                    className="shadow-2dp ml-2"
                    background="white"
                    saturation={0}
                    icon={opt.value === input.value ? "favorite-fill" : "favorite"}
                    color="red"
                  />
                </span>
                </label>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

BrixelRadioCard.propTypes = {
  className: PropTypes.string,
  deactivable: PropTypes.bool,
  disabled: PropTypes.bool,
  icons: PropTypes.bool,
  input: PropTypes.object.isRequired,
  inputClassName: PropTypes.string,
  label: PropTypes.string,
  modal: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.object),
};

BrixelRadioCard.defaultProps = {
  className: '',
  deactivable: true,
  disabled: false,
  icons: false,
  inputClassName: '',
  label: null,
  modal: null,
};

export default BrixelRadioCard;
