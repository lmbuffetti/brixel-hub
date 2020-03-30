/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { BrixelButtonTertiary, BrixelIcon } from '@brixel/brixel-components';

const BrixelCheckboxWithDetail = React.memo((props) => {
  const {
    className,
    disabled,
    input,
    label,
    options,
  } = props;
  const [arrVal, setArrVal] = useState(input.value || []);
  const [openDetail, setOpenDetail] = useState([]);

  useEffect(() => {
    setArrVal(input.value || []);
  }, []);

  const onChange = (e, val) => {
    let value = cloneDeep(arrVal) || [];
    const idValue = value.findIndex((item) => item === val);
    if (idValue >= 0) value.splice(idValue, 1);
    else value.push(val);
    value.sort();
    setArrVal(value);
    input.onChange(value);
  };

  const onToggleAccordion = (id) => {
    let getOpenDetail = openDetail;
    getOpenDetail[id] = !getOpenDetail[id];
    setOpenDetail([...getOpenDetail]);
  };

  return (
    <div className="brixel-checkbox-with-detail">
      {
        label && (
          <label className="brixel-label">{label}</label>
        )
      }
      <div>
        {
          options.map((option, i) => (
            <div
              className={`p-3 single-chackbox ${className} ${arrVal.includes(option.value) ? `brd${option.color} checked` : 'brdWhite'}`}
              key={i.toString()}>
              <label
                className={`dis-fl-col dis-fl-row-md ${arrVal.includes(option.value) ? 'checked' : ''}`}
                htmlFor={`${input.name}_${i}`}
              >
                <img src={option.img} alt={option.label} />
                <div className="pl-3 pr-5">
                  <h5 className={`txt${option.color} mb-3`}>{option.label}</h5>
                  <p className="txtDark700">{option.description}</p>
                </div>
                <input
                  disabled={disabled}
                  type="checkbox"
                  id={`${input.name}_${i}`}
                  value={option.value}
                  name={input.name}
                  checked={arrVal.includes(option.value)}
                  onChange={(e) => onChange(e, option.value)}
                />
                <span className="checkmark" />
              </label>
              <hr className="mt-3 mb-1" />
              <div className="dis-f a-c jc-b">
                <BrixelButtonTertiary
                  rightIcon={openDetail[i] ? "arrow-simple-up" : "arrow-simple-down"}
                  label="All Detail"
                  color="dark"
                  saturationTxt={700}
                  onClick={() => onToggleAccordion(i)}
                  className={'td-n'}
                />
                <p className={`txt${option.color} fweight-700 ff-mono`}>{option.priceInfo}</p>
              </div>
              <div className={`detailCheckbox ${openDetail[i] ? 'open' : 'close'}`}>
                <ul>
                  {
                    option.moreDetails.map((detail, i) => (
                      <li key={i.toString()}>
                        <BrixelIcon
                          icon="check"
                          color="green"
                          saturationTxt={400}
                        />
                        <span>{detail}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
});

BrixelCheckboxWithDetail.propTypes = {
  backIcon: PropTypes.string,
  className: PropTypes.string,
  pdClass: PropTypes.string,
  disabled: PropTypes.bool,
  isHorizontal: PropTypes.bool,
  icons: PropTypes.bool,
  input: PropTypes.object.isRequired,
  inputClassName: PropTypes.string,
  label: PropTypes.string,
  limit: PropTypes.number,
  message: PropTypes.object,
  meta: PropTypes.object,
  modal: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

BrixelCheckboxWithDetail.defaultProps = {
  className: '',
  pdClass: '',
  disabled: false,
  icons: false,
  inputClassName: '',
  isHorizontal: false,
  label: null,
  limit: -1,
  meta: {dirty: false, invalid: false},
  message: {help: null, error: null},
  modal: null,
};

export default BrixelCheckboxWithDetail;
