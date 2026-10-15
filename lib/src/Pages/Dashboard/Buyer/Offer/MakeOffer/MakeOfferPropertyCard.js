import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Helpers } from '@brixel-io/brixel-components';
import CoverPropertyImage from '../../../../../components/CoverPropertyImage';
import translateTo from '../../../../../utils/translation';
const MakeOfferPropertyCard = ({ activeSingleProperty, lang }) => {
    return (React.createElement("div", { className: "dis-f a-c jc-b bgWhite brdRadius mb-5" },
        React.createElement("div", null,
            React.createElement(CoverPropertyImage, { coverPhoto: activeSingleProperty?.coverPhoto?.url, size: "XS" })),
        React.createElement("div", { className: "w-perc-100 p-3" },
            React.createElement("div", null,
                React.createElement("p", { className: "fsize-300 txtText600" }, Helpers.formatAddress(activeSingleProperty.location)),
                React.createElement("h5", { className: "fsize-400 fweight-600" }, activeSingleProperty?.title)),
            React.createElement("div", { className: "dis-f a-c" },
                React.createElement("p", { className: "ff-mono fsize-300 txtText600" },
                    React.createElement("span", null, activeSingleProperty.properties?.typology?.bedrooms),
                    React.createElement("span", { className: "ml-small-4" }, translateTo('rooms', lang))),
                React.createElement("span", { className: "dis-b brdFullRadius bgText800 w-fix-small-4 h-fix-small-4 mx-1" }),
                React.createElement("p", { className: "ff-mono fsize-300 txtText600" },
                    React.createElement("span", null, activeSingleProperty.properties?.typology?.livingArea?.value),
                    React.createElement("span", { className: "ml-small-4" }, translateTo('m2', lang))),
                React.createElement("span", { className: "dis-b brdFullRadius bgText800 w-fix-small-4 h-fix-small-4 mx-1" }),
                React.createElement("p", { className: "ff-mono fsize-300 txtText600" },
                    React.createElement("span", null, activeSingleProperty.properties?.building?.built))),
            React.createElement("div", { className: "mt-3" },
                React.createElement("h6", { className: "fsize-300 txtText600" }, "Listing price:"),
                activeSingleProperty?.status === 'on-sale' && activeSingleProperty?.price?.total && (React.createElement("p", { className: "txtGreen400" },
                    React.createElement("span", null, "CHF"),
                    React.createElement("span", { className: "ff-mono fsize-500" }, Helpers.formatNumberValue(activeSingleProperty.price.total, activeSingleProperty?.price?.currency || 'CHF')))),
                activeSingleProperty?.status === 'on-request' && (React.createElement("span", { className: "txtText700" }, translateTo('On Request', lang))),
                activeSingleProperty?.status === 'sold' && (React.createElement("span", { className: "txtText700" }, translateTo('Sold', lang))),
                activeSingleProperty?.status === 'reserved' && (React.createElement("span", { className: "txtText700" }, translateTo('Reserved', lang)))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(MakeOfferPropertyCard);
