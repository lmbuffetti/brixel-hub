import React, { useState } from 'react';
import { BrixelButtonText, BrixelIcon, FormatValue } from '@brixel-io/brixel-components';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { BrixelMap } from '@brixel-io/brixel-components/dist/map';
import get from 'lodash/get';
import translateTo from '../../../utils/translation';
const ModalPropertyCard = (props) => {
    const { isFavorite, lang, onClose, onRemoveProperty, property, saveFavorite, } = props;
    // STATE
    const [isShowMoreInfo, setIsShowMoreInfo] = useState(false);
    return (React.createElement("div", { className: "dis-fl-col po-r" },
        React.createElement(BrixelIcon, { rounded: true, background: "white", saturation: 0, className: "pos-a-fix x-r-3 x-t-3 zIndex10", onClick: () => onClose(), icon: "close-small" }),
        React.createElement(BrixelMap, { baseByData: baseByData, gestureHandling: "auto", lang: lang, externalControls: true, hideLocation: true, className: "w-perc-100 h-fix-400", center: {
                lat: property.location.latitude,
                lng: property.location.longitude,
            }, type: 'satellite', marker: property, zoom: 15 }),
        React.createElement("div", { className: "px-sm-3 px-2 pt-3 pb-1" },
            React.createElement("div", { className: "mt-2 mb-1" },
                React.createElement("h4", { className: 'fweight-600' }, get(property, 'title', ''))),
            React.createElement("h6", { className: "fsize-300 dis-f" },
                React.createElement("span", null, translateTo('This is a Pre-Market property.', lang)),
                React.createElement("button", { className: "ml-1 txtGreen400 td-u fweight-600 no-wrap", onClick: () => setIsShowMoreInfo(!isShowMoreInfo) },
                    React.createElement("span", null, translateTo('What can I do?', lang)),
                    React.createElement(BrixelIcon, { color: "green", icon: isShowMoreInfo ? 'arrow-simple-up' : 'arrow-simple-down' })))),
        isShowMoreInfo && (React.createElement("p", { className: "fsize-300 px-2 px-sm-3 txtText700" }, translateTo('This property is not for sale yet and all personal data are hidden until it gets on the market. You can like the property and be informed about any important updates.', lang))),
        React.createElement("div", { className: "px-2 px-sm-3 mt-5" },
            React.createElement("hr", { className: "lighter" })),
        React.createElement("div", { className: "dis-f a-t jc-b flex-wrap p-2 p-sm-3" },
            React.createElement("div", { className: 'min-w-fix-64 mb-1' },
                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Property Type', lang)),
                React.createElement("span", { className: "ff-mono fszie-400 txtBlack" }, translateTo(get(property, 'properties.propertyType', ''), lang))),
            React.createElement("div", { className: 'min-w-fix-64 mb-1' },
                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Rooms', lang)),
                React.createElement("span", { className: "ff-mono fszie-400 txtBlack" }, FormatValue.formatRooms(get(property, 'properties.typology.bedrooms', 0), get(property, 'location.countryCode', 'CH')))),
            React.createElement("div", { className: 'min-w-fix-64 mb-1' },
                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Size', lang)),
                React.createElement("span", { className: "ff-mono fszie-400 txtBlack" },
                    get(property, 'properties.typology.livingArea.value', 0),
                    " m2")),
            React.createElement("div", { className: 'min-w-fix-64 mb-1' },
                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Year built', lang)),
                React.createElement("span", { className: "ff-mono fszie-400 txtBlack" }, get(property, 'properties.building.built', 0))),
            React.createElement("div", { className: 'min-w-fix-64 mb-1' },
                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Location', lang)),
                React.createElement("span", { className: "fsize-300 txtText900 mt-1" },
                    get(property, 'location.zip', ''),
                    " ",
                    get(property, 'location.city', ''),
                    get(property, 'location.countryCode', 'CH') === 'CH' && (React.createElement(React.Fragment, null, ` (${get(property, 'location.stateCode', '')})`))))),
        React.createElement("hr", { className: "lighter mt-a" }),
        React.createElement("div", { className: "row-cols-3-gut-1 p-2 p-sm-3" },
            React.createElement("div", null,
                React.createElement(BrixelButtonText, { className: "td-u", bgTransparent: true, theme: "text", label: translateTo('Close', lang), onClick: () => onClose() })),
            React.createElement("div", { className: "dis-f jc-c a-c" },
                onRemoveProperty && (React.createElement(BrixelIcon, { className: "mx-1 brdSmall brdBlue700", color: "blue", saturationTxt: 700, rounded: true, background: "white", saturation: 0, icon: "eye-hidden", onClick: () => onRemoveProperty() })),
                saveFavorite && (React.createElement(BrixelIcon, { className: "brdSmall brdRed400", rounded: true, background: "white", saturation: 0, icon: isFavorite ? 'favorite-fill' : 'favorite', color: "red", onClick: () => saveFavorite(isFavorite ? 'remove' : 'add') }))))));
};
export default ModalPropertyCard;
