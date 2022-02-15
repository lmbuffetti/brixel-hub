import React from 'react';
import PropTypes from 'prop-types';
import isNaN from 'lodash/isNaN';
import isBoolean from 'lodash/isBoolean';
import {
  BrixelIcon,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import empowerBestPersonalSupport from '../../images/BrxielComingTown/empowerBestPersonalSupport.svg';
import empowerBestMarketing from '../../images/BrxielComingTown/empowerBestMarketing.svg';
import empowerSellOwn from '../../images/BrxielComingTown/empowerSellOwn.svg';
import { translateTo } from '../../utils/translation';

const BrixelRadioCard = (props) => {
  const {
    disabled,
    className,
    deactivable,
    input,
    label,
    lang,
  } = props;

  // FUNCTION TO UNCHECK THE RADIO BUTTON - not possible as default
  const clickOption = (e, val) => {
    if (deactivable) {
      if (e.target.value === val) input.onChange(null);
      if (e.target.value === val.toString()) input.onChange(null);
      if (+e.target.value === val) input.onChange(null);
    }
  };

  // FUNCTION TO PASS THE VALUE TO REDUX FORM CHANGE THE CHECKED ELEMENT
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

  // FIXED OPTIONS
  const options = [
    {
      label: translateTo(lang, 'With the right tools to sell on your own.'),
      value: 'sell-your-own',
      img: empowerSellOwn,
    },
    {
      className: 'mx-2',
      label: translateTo(lang, 'With great marketing to stick out of the crowd.'),
      value: 'marketing',
      img: empowerBestMarketing,
    },
    {
      label: translateTo(lang, 'With personal support all the way to closing of the deal.'),
      value: 'personal-support',
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
                  className={disabled ? 'disabled' : ''}
                  htmlFor={`${input.name}_${i}`}
                >
                  <img src={opt.img} alt={opt.label} />
                  <span className="otp-label">{opt.label}</span>
                  <span className="btmLabel">
                    {translateTo(lang, 'My favorite')}
                    <BrixelIcon
                      className="shadow-2dp ml-2"
                      background="white"
                      saturation={0}
                      icon={opt.value === input.value ? 'favorite-fill' : 'favorite'}
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
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  lang: PropTypes.string,
};

BrixelRadioCard.defaultProps = {
  className: '',
  deactivable: true,
  disabled: false,
  lang: '',
  label: null,
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BrixelRadioCard);
