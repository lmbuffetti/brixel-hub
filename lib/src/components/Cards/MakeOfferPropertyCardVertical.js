import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { BrixelButtonText, Helpers, } from '@brixel-io/brixel-components';
import CoverPropertyImage from '../CoverPropertyImage';
import translateTo from '../../utils/translation';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
const MakeOfferPropertyCardVertical = ({ activeSingleProperty, lang }) => {
    return (React.createElement("div", { className: "max-w-fix-800 w-perc-100" },
        React.createElement("div", { className: "dis-f-col a-c jc-b bgWhite brdRadius mb-1 ov-h brdSmall brdText100 pb-2 pb-sm-3" },
            React.createElement("div", { className: 'w-perc-100 dis-f' },
                React.createElement(CoverPropertyImage, { coverPhoto: activeSingleProperty?.coverPhoto?.url, size: "M", className: "max-h-fix-240 pos-r cover flex-1" })),
            React.createElement("div", { className: "w-perc-100 p-2 p-sm-3" },
                React.createElement("div", null,
                    React.createElement("h5", { className: "fsize-400 fweight-600" }, activeSingleProperty?.title),
                    React.createElement("p", { className: "fsize-300 txtText600" }, Helpers.formatAddress(activeSingleProperty.location))),
                React.createElement("div", { className: "dis-f a-c mt-1" },
                    React.createElement("p", { className: "ff-mono fsize-300 txtText600" },
                        React.createElement("span", null, activeSingleProperty.properties?.typology?.bedrooms),
                        React.createElement("span", { className: "ml-small-4" }, translateTo('rooms', lang))),
                    React.createElement("span", { className: "dis-b brdFullRadius bgText800 w-fix-small-4 h-fix-small-4 mx-1" }),
                    React.createElement("p", { className: "ff-mono fsize-300 txtText600" },
                        React.createElement("span", null, activeSingleProperty.properties?.typology?.livingArea?.value),
                        React.createElement("span", { className: "ml-small-4" }, translateTo('m2', lang))),
                    React.createElement("span", { className: "dis-b brdFullRadius bgText800 w-fix-small-4 h-fix-small-4 mx-1" }),
                    React.createElement("p", { className: "ff-mono fsize-300 txtText600" },
                        React.createElement("span", null, activeSingleProperty.properties?.building?.built)))),
            React.createElement(BrixelButtonText, { className: "mt-2 ml-3", label: translateTo('View property page', lang), rightIcon: "link-open", bgTransparent: true, small: true, onClick: () => window.open(`${baseByData.pageUrl}${lang}/${activeSingleProperty.stub}`, '_blank') })),
        React.createElement("div", { className: "dis-f a-c jc-b bgWhite brdRadius p-2 brdSmall brdText100" },
            React.createElement("p", { className: "fsize-300 txtText600" }, translateTo('Listing price', lang)),
            React.createElement("div", null,
                activeSingleProperty?.status === 'on-sale' && activeSingleProperty?.price?.total && (React.createElement("p", { className: 'txtGreen400 dis-f a-c txtGreen400' },
                    React.createElement("span", { className: 'ff-mono' }, "CHF"),
                    React.createElement("span", { className: "ff-mono fsize-500 pl-small-4" }, Helpers.formatNumberValue(activeSingleProperty.price.total, activeSingleProperty?.price?.currency || 'CHF')))),
                activeSingleProperty?.status === 'on-request' && (React.createElement("span", { className: "ff-mono fsize-500 txtText700" }, translateTo('On Request', lang))),
                activeSingleProperty?.status === 'sold' && (React.createElement("span", { className: "ff-mono fsize-500 txtRed400" }, translateTo('Sold', lang))),
                activeSingleProperty?.status === 'reserved' && (React.createElement("span", { className: "ff-mono fsize-500 txtYellow400" }, translateTo('Reserved', lang)))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(MakeOfferPropertyCardVertical);
