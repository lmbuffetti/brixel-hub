import React from 'react';
import { BrixelButtonIcon, } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import { BrixelTextArea } from '@brixel-io/brixel-components/dist/form';
const AddCommentReview = ({ onChangeValue, changeStep, isLoadingSave, lang, onClick, status, }) => {
    return (React.createElement(React.Fragment, null,
        status === 'accepted' ? (React.createElement(React.Fragment, null,
            React.createElement("h2", { className: "ta-c fweight-600 pt-3 mb-1" }, translateTo('Confirm acceptance', lang)),
            React.createElement("h6", { className: "fweight-400 ta-c txtText600" }, translateTo('You are about to accept the offer.', lang)))) : (React.createElement(React.Fragment, null,
            React.createElement("h2", { className: "ta-c fweight-600 pt-3 mb-1" }, translateTo('Confirm rejection', lang)),
            React.createElement("h6", { className: "fweight-400 ta-c txtText600" }, translateTo('You are about to reject the offer.', lang)))),
        React.createElement("h6", { className: "fweight-400 ta-c txtText600" }, translateTo('Would you like to add a comment?', lang)),
        React.createElement("div", { className: "mt-4" },
            React.createElement(BrixelTextArea, { input: {
                    name: 'note',
                    onChange: (value) => onChangeValue('note', value),
                }, label: translateTo('Add a comment (optional)', lang) })),
        React.createElement("div", { className: "dis-f jc-c a-c my-4" },
            React.createElement(BrixelButtonIcon, { className: "backBtn brdSmall brdGreen400 mr-small-4", icon: "arrow-left-small", onClick: () => changeStep(true), theme: "green", themeSat: 400, bgTransparent: true }),
            React.createElement(BrixelButtonPrimary, { rounded: true, className: "ml-small-4", label: translateTo('Submit', lang), rightIcon: "arrow-right-small", onClick: () => onClick(), isLoading: isLoadingSave }))));
};
export default AddCommentReview;
