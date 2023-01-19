import { Helpers } from '@brixel/brixel-components';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React from 'react';
import { QuestionsList } from '../resources/Flows/onBoardingBuyer';
import translateTo from '../utils/translation';

const SearchProfileField = (props) => {
  const {
    changeFieldValue,
    field,
    lang,
    onClick,
    searchProfile,
  } = props;

  const renderFieldsSearchProfile = () => {
    if (field === 'location') {
      if (get(searchProfile, 'location', null) && get(searchProfile, 'location', []).length > 0) {
        return (
          <>
            {
              get(searchProfile, 'location', []).map((item, i) => (
                <React.Fragment key={`usrLoc_${i.toString()}`}>
                  {i > 0 && (<span>, </span>)}
                  <span>{translateTo(item.city, lang)}</span>
                  <span className="mr-small-4">,</span>
                  <span>{translateTo(item.country, lang)}</span>
                </React.Fragment>
              ))
            }
          </>
        )
      }
    } else if (Array.isArray(get(searchProfile, field, ''))) {
      return (
        <>
          {get(searchProfile, field, []).map((data, i) => (
            <React.Fragment key={`arraySearch${i.toString()}`}>
              <span key={`field${i.toString()}`}>{data}</span>
              {get(searchProfile, field, []).length - 1 !== i && (<span className="mr-1">,</span>)}
            </React.Fragment>
          ))}
        </>
      )
    } else if (get(searchProfile, `${field}.min`, -1) > -1) {
      const inputs = [];
      QuestionsList(lang, 'searchProfile', changeFieldValue, 'SearchProfile').forEach((input) => {
        if (input.inputs) {
          input.inputs.forEach(inp => {
            inputs.push(inp);
          })
        }
      })
      const checkMaxValue = inputs.filter((inp) => inp.maxLengthNum);
      let maxValue = {};
      checkMaxValue.forEach((val) => {
        if (!get(searchProfile, `${val.name}.max`, null)) {
          maxValue[val.name] = val.maxLengthNum;
        }
      })
      const unit = field.includes('bedrooms') ? 'rooms' : 'm2';
      return (
        <>
          <span>{get(searchProfile, `${field}.min`, '')} - {get(searchProfile, `${field}.max`, maxValue[field]) || maxValue[field]}</span><span className="ml-small-4">{unit}</span>
        </>
      )
    } else if (field.includes('extraFeatures')) {
      const numExtraFeatures = Object.keys(get(searchProfile, field, {})).length;
      if (numExtraFeatures > 0) {
        return (
          <>
            {numExtraFeatures && <><span>{numExtraFeatures}</span><span className="ml-1">Amenities</span></>}
          </>
        )
      }
    } else if (!isObject(get(searchProfile, field, ''))) {
      if (field.includes('price')) {
        const currency = get(searchProfile, 'finance.currency', 'EUR');
        const price = get(searchProfile, field, 0);
        if (price > 0) {
          return (
            <>
              {Helpers.formatNumberValue(price, currency)} {currency}
            </>
          )
        }
      } else if (get(searchProfile, field, null)) {
        return (
          <>
            {get(searchProfile, field, '')}
          </>
        )
      }
    }
    return null;
  }

  return (
    <>
      {renderFieldsSearchProfile() && (
        <div
          className={`brdFullRadius filterBorder brdSmall fsize-300 py-small-7 px-2 mr-small-12 mb-1 bgWhite ${field} ${onClick ? 'cur-poi' : ''}`}
          onClick={() => onClick ? onClick() : ''}
        >
          {renderFieldsSearchProfile()}
        </div>
      )
      }
    </>
  )
}

SearchProfileField.propTypes = {
  changeFieldValue: PropTypes.func,
  field: PropTypes.string,
  lang: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  searchProfile: PropTypes.object.isRequired,
}

SearchProfileField.defaultProps = {
  onClick: null,
}

export default SearchProfileField;
