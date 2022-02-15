/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { BrixelIcon } from '@brixel/brixel-components';

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

  // FUNCTIONS WHEN THE CHECKBOX IS CHECKED OR NOT
  const onChange = (e, val) => {
    const value = cloneDeep(arrVal) || [];
    const idValue = value.findIndex((item) => item === val);
    if (idValue >= 0) value.splice(idValue, 1);
    else value.push(val);
    value.sort();
    setArrVal(value);
    input.onChange(value);
  };

  // FUNCTIONS TO OPEN/CLOSE THE ACCORDION
  const onToggleAccordion = (id) => {
    const getOpenDetail = openDetail;
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
          // PRINT ALL OPTIONS (options=[{name: '', value: '', img: '', label: '', description: '', color: '', priceInfo: '', moreDetails: [{description: ''}]}])
          options && options.map((option, i) => (
            <div
              className={`p-3 pl-4 single-chackbox ${className} ${arrVal.includes(option.value) ? `brd${option.color} checked` : 'brdWhite'}`}
              key={i.toString()}
            >
              <span className={`bg${option.color} sideCheckbox`} />
              <label
                className={`dis-fl-col dis-fl-row-md a-t a-lg-c ${arrVal.includes(option.value) ? 'checked' : ''}`}
                htmlFor={`${input.name}_${i}`}
              >
                {
                  option.img && (
                    <img src={option.img} alt={option.label} className="max-w-fix-80 max-w-fix-lg-112 mr-lg-3" />
                  )
                }
                <div className="pr-5 mt-2 mt-lg-0">
                  <h5 className={`txt${option.color} mb-lg-2 mb-3`}>{option.label}</h5>
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
                <span
                  className="cur-poi txtDark700 fweight-500"
                  onClick={() => onToggleAccordion(i)}
                >
                  All Details
                  <BrixelIcon className="ml-1" icon={openDetail[i] ? 'arrow-simple-up' : 'arrow-simple-down'} />
                </span>
                <p className="txtDark700 fweight-700 ff-mono pl-2" dangerouslySetInnerHTML={{ __html: option.priceInfo }} />
              </div>
              <div className={`detailCheckbox ${openDetail[i] ? 'open' : 'close'}`}>
                <ul>
                  {
                    option.moreDetails && option.moreDetails.map((detail, f) => (
                      <li key={f.toString()}>
                        <BrixelIcon
                          icon="check"
                          color="green"
                          saturationTxt={400}
                        />
                        <span>{detail.description}</span>
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
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

BrixelCheckboxWithDetail.defaultProps = {
  className: '',
  disabled: false,
  label: null,
};

export default BrixelCheckboxWithDetail;
