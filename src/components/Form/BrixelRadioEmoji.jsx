import React from 'react';
import PropTypes from 'prop-types';
import isNaN from 'lodash/isNaN';
import isBoolean from 'lodash/isBoolean';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { translateTo } from '../../utils/translation';
import Emoji from '../Emoji';

const BrixelRadioEmoji = (props) => {
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
      label: 'I don\'t care',
      value: 4,
      symbol: '🙁',
    },
    {
      label: 'Why not',
      value: 3,
      symbol: '😐',
    },
    {
      label: 'Nice to have',
      value: 2,
      symbol: '🙂',
    },
    {
      label: 'Must have',
      value: 1,
      symbol: '🥳',
    },
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
                <Emoji label={opt.label} symbol={opt.symbol} />
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
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  lang: PropTypes.string,
};

BrixelRadioEmoji.defaultProps = {
  className: '',
  deactivable: true,
  disabled: false,
  lang: 'en',
  label: null,
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BrixelRadioEmoji);
