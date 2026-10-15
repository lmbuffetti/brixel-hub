import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { has } from 'lodash';
import { Helpers, FormatValue, BrixelImage } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
const MakeOfferPropertyCard = ({ activeSingleProperty, lang }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "brdRadius dis-fl-row-sm dis-fl-col brdSmall brdText100 ov-h bgWhite" },
            React.createElement(BrixelImage, { className: "avatar w-fix-sm-200 max-h-fix-200 pos-r cover", url: get(activeSingleProperty, 'coverPhoto.url', ''), alt: "Property", size: "L", isSquare: true, loading: "lazy" }),
            React.createElement("div", { className: "dis-fl-col w-perc-100 py-2 px-2" },
                React.createElement("span", { className: "dis-b pb-small-4 fsize-300 txtText600" }, Helpers.formatAddress(activeSingleProperty.location)),
                React.createElement("p", { className: 'itemTitle fweight-600 dis-b txtText900' }, activeSingleProperty.title),
                React.createElement("div", { className: "dis-fl-row mb-2 ff-mono fsize-300" },
                    React.createElement("span", { className: "rooms" },
                        FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH')),
                        " ",
                        get(activeSingleProperty, 'location.countryCode', 'CH') === 'CH' && translateTo('Rooms', lang)),
                    React.createElement("span", { className: "px-1" }, " \u2022 "),
                    React.createElement("div", { className: "dis-f" },
                        React.createElement("span", { className: "" }, (activeSingleProperty && activeSingleProperty.properties && activeSingleProperty.properties.typology && has(activeSingleProperty.properties, 'typology') && activeSingleProperty.properties.typology.livingArea) ? activeSingleProperty.properties.typology.livingArea.value : '-'),
                        React.createElement("span", { className: "pl-small-4" }, "m2")),
                    React.createElement("span", { className: "px-1" }, " \u2022 "),
                    React.createElement("span", null, (activeSingleProperty && activeSingleProperty.properties && activeSingleProperty.properties.building && has(activeSingleProperty.properties, 'building') && activeSingleProperty.properties.building.built) ? activeSingleProperty.properties.building.built : '-')),
                React.createElement("div", { className: "dis-fl-col mt-a" },
                    React.createElement("h6", { className: "fsize-300 hide dis-b-sm fweight-300 txtText600" }, translateTo('Listing price:', lang)),
                    activeSingleProperty?.status === 'on-sale' && activeSingleProperty?.price?.total && (React.createElement("p", { className: "txtGreen400 dis-f a-c ff-mono" },
                        React.createElement("span", { className: "ff-mono fsize-500" }, Helpers.formatNumberValue(activeSingleProperty.price.total, activeSingleProperty?.price?.currency || 'CHF')))),
                    activeSingleProperty?.status === 'on-request' && (React.createElement("span", { className: "txtText700 ff-mono" }, translateTo('On Request', lang))),
                    activeSingleProperty?.status === 'sold' && (React.createElement("span", { className: "txtText700 ff-mono" }, translateTo('Sold', lang))),
                    activeSingleProperty?.status === 'reserved' && (React.createElement("span", { className: "txtText700 ff-mono" }, translateTo('Reserved', lang))))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(MakeOfferPropertyCard);
