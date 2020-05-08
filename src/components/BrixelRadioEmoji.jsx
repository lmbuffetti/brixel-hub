import React from 'react';
import PropTypes from 'prop-types';
import isNaN from 'lodash/isNaN';
import isBoolean from 'lodash/isBoolean';
import Emoji from './Emoji';
import { translateTo } from '../utils/translation';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';

const BrixelRadioEmoji = (props) => {
  const {
    disabled,
    className,
    deactivable,
    input,
    label,
    lang,
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
      label: 'I don\'t care',
      value: 4,
      symbol: "🙁"
    },
    {
      label: 'Why not',
      value: 3,
      symbol: "😐"
    },
    {
      label: 'Nice to have',
      value: 2,
      symbol: "🙂"
    },
    {
      label: 'Must have',
      value: 1,
      symbol: "🥳"
    }
  ];

  return (
    <div className={className}>
      {
        label && (
          <label className="brixel-label">{label}</label>
        )
      }
      <div className="dis-f a-t jc-b">
        {
          options.map((opt, i) => (
            <div className="brixel-radio-emoji" key={i.toString()}>
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
                className={`${disabled ? 'disabled' : ''} ${opt.value === input.value ? 'checked' : ''}`}
                htmlFor={`${input.name}_${i}`}
              >
                <Emoji label={opt.label} symbol={opt.symbol}/>
                <span className="otp-label">{translateTo(lang, opt.label)}</span>
              </label>
            </div>
          ))
        }
      </div>
    </div>
  );
};

BrixelRadioEmoji.propTypes = {
  className: PropTypes.string,
  deactivable: PropTypes.bool,
  disabled: PropTypes.bool,
  icons: PropTypes.bool,
  input: PropTypes.object.isRequired,
  inputClassName: PropTypes.string,
  label: PropTypes.string,
  lang: PropTypes.string,
  modal: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.object),
};

BrixelRadioEmoji.defaultProps = {
  className: '',
  deactivable: true,
  disabled: false,
  icons: false,
  inputClassName: '',
  label: null,
  modal: null,
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(BrixelRadioEmoji);
