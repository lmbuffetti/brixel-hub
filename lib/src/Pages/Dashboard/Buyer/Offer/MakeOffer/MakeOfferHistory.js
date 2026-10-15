import React from 'react';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import translateTo from '../../../../../utils/translation';
const MakeOfferHistory = ({ activeSingleOffer, hanldeViewOffer, lang, }) => {
    return (React.createElement("div", { className: "bgWhite brdRadius p-3" },
        activeSingleOffer.amount,
        React.createElement(BrixelButtonSecondary, { label: translateTo('View', lang), onClick: () => hanldeViewOffer() })));
};
export default MakeOfferHistory;
