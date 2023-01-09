import React from 'react';
import {Helpers} from '@brixel/brixel-components';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import {QuestionsList} from '../resources/Flows/onBoardingBuyer';
import translateTo from '../utils/translation';
import type {SearchProfileFieldType} from '../@types/components/SearchProfileField';
import {QuestionInputType, QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const SearchProfileField = (props: SearchProfileFieldType) => {
  const {
    changeFieldValue,
    field = '',
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
                  <span>{translateTo(item.name, lang)}</span>
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
      const inputs: QuestionInputType[] = [];
      QuestionsList(lang, 'searchProfile', changeFieldValue, 'SearchProfile').forEach((input: QuestionsListType) => {
        if (input.inputs) {
          input.inputs.forEach(inp => {
            inputs.push(inp);
          })
        }
      })
      const checkMaxValue = inputs.filter((inp) => inp.maxLengthNum);
      const maxValue = {};
      checkMaxValue.forEach((val) => {
        if (!get(searchProfile, `${val.name}.max`, null)) {
          if (val.name) maxValue[val.name] = val.maxLengthNum;
        }
      })
      const unit = field.includes('bedrooms') ? 'rooms' : 'm2';
      return (
        <>
          {get(searchProfile, `${field}.min`, '')} - {get(searchProfile, `${field}.max`, maxValue[field]) || maxValue[field]} {unit}
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
export default SearchProfileField;
