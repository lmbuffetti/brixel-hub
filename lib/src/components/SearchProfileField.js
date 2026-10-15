import React from 'react';
import { Helpers } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { QuestionsList } from '../resources/Flows/onBoardingBuyer';
import translateTo from '../utils/translation';
const SearchProfileField = (props) => {
    const { activeSingleCompany, field = '', lang, onClick, searchProfile, } = props;
    const renderFieldsSearchProfile = () => {
        if (field === 'profile.livingSituation')
            return null;
        if (field === 'location') {
            if (get(searchProfile, 'location', null) && get(searchProfile, 'location', []).length > 0) {
                return (React.createElement(React.Fragment, null, get(searchProfile, 'location', []).map((item, i) => (React.createElement(React.Fragment, { key: `usrLoc_${i.toString()}` },
                    i > 0 && (React.createElement("span", null, ", ")),
                    item.city && (React.createElement(React.Fragment, null,
                        React.createElement("span", null, translateTo(item.city, lang)),
                        item.country && React.createElement("span", { className: "mr-small-4" }, ","))),
                    item.country && React.createElement("span", null, translateTo(item.country, lang)))))));
            }
        }
        else if (Array.isArray(get(searchProfile, field, ''))) {
            return (React.createElement(React.Fragment, null, get(searchProfile, field, []).map((data, i) => (React.createElement(React.Fragment, { key: `arraySearch${i.toString()}` },
                React.createElement("span", { key: `field${i.toString()}` }, translateTo(data, lang)),
                get(searchProfile, field, []).length - 1 !== i && (React.createElement("span", { className: "mr-1" }, ",")))))));
        }
        else if (get(searchProfile, `${field}.min`, -1) > -1) {
            const inputs = [];
            QuestionsList(lang, 'searchProfile', () => '', 'SearchProfile').forEach((input) => {
                if (input.inputs) {
                    input.inputs.forEach(inp => {
                        inputs.push(inp);
                    });
                }
            });
            const checkMaxValue = inputs.filter((inp) => inp.maxLengthNum);
            const maxValue = {};
            checkMaxValue.forEach((val) => {
                if (!get(searchProfile, `${val.name}.max`, null)) {
                    if (val.name)
                        maxValue[val.name] = val.maxLengthNum;
                }
            });
            const unit = field.includes('bedrooms') ? 'rooms' : 'm2';
            if (get(searchProfile, `${field}.min`, 0) !== get(searchProfile, `${field}.max`, 0)) {
                return (React.createElement(React.Fragment, null,
                    React.createElement("span", null,
                        get(searchProfile, `${field}.min`, ''),
                        " - ",
                        get(searchProfile, `${field}.max`, maxValue[field]) || maxValue[field]),
                    React.createElement("span", { className: "ml-small-4" }, translateTo(unit, lang))));
            }
            return (React.createElement(React.Fragment, null,
                React.createElement("span", null, get(searchProfile, `${field}.min`, '')),
                React.createElement("span", { className: "ml-small-4" }, translateTo(unit, lang))));
        }
        else if (field.includes('extraFeatures')) {
            const numExtraFeatures = Object.keys(get(searchProfile, field, {})).length;
            if (numExtraFeatures > 0) {
                return (React.createElement(React.Fragment, null, Boolean(numExtraFeatures) && React.createElement(React.Fragment, null,
                    React.createElement("span", null, numExtraFeatures),
                    React.createElement("span", { className: "ml-1" }, translateTo('Amenities', lang)))));
            }
        }
        else if (!isObject(get(searchProfile, field, ''))) {
            if (field.includes('price')) {
                let currency = get(searchProfile, 'finance.currency', null);
                if (!currency)
                    currency = get(activeSingleCompany, 'country.currency', 'CHF');
                const price = get(searchProfile, field, 0);
                if (price > 0) {
                    return (React.createElement(React.Fragment, null,
                        Helpers.formatNumberValue(price, currency),
                        " ",
                        currency));
                }
            }
            else if (get(searchProfile, field, null)) {
                return (React.createElement(React.Fragment, null, get(searchProfile, field, '')));
            }
        }
        return null;
    };
    return (React.createElement(React.Fragment, null, renderFieldsSearchProfile() && (React.createElement("div", { className: `brdFullRadius filterBorder brdSmall fsize-300 py-small-7 px-2 mr-small-12 mb-1 bgWhite ${field} ${onClick ? 'cur-poi' : ''}`, onClick: () => onClick ? onClick() : '' }, renderFieldsSearchProfile()))));
};
export default SearchProfileField;
