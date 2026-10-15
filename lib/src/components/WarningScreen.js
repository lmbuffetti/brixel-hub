import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import { reset } from '@brixel-io/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setModal } from '../actions/CommonActions';
const WarningScreen = (props) => {
    const { formName, handleReset, handleSetModal, initialValue, isSmallLoading, lang, onClose, saveFunc, } = props;
    const [savedData, setSavedData] = useState(false);
    useEffect(() => {
        if (isSmallLoading.saveData === false && savedData) {
            onClose();
            handleSetModal({ state: false });
        }
    }, [isSmallLoading]);
    const closeAndReset = () => {
        handleReset(formName, initialValue);
        onClose();
        handleSetModal({ state: false });
    };
    const saveData = () => {
        if (saveFunc)
            saveFunc();
        setSavedData(true);
    };
    return (React.createElement("div", { className: "brixel-modal ", id: "" },
        React.createElement("div", { className: "w-perc-100 min-h-fix-sm-320 w-fix-sm-480 modal-container dis-fl-col jc-fs bgText25" },
            React.createElement("div", { className: "modal-header dis-f jc-fe a-c" },
                React.createElement(BrixelButtonIcon, { icon: "close-small", bgTransparent: true, theme: "text", onClick: () => handleSetModal({ state: false }) })),
            React.createElement("div", { className: "modal-title" },
                React.createElement("div", { className: "title-container dis-f a-c" },
                    React.createElement(BrixelIcon, { icon: "alert", color: "red" }),
                    React.createElement("span", { className: "heading3 ml-3" }, translateTo('Oops!', lang)))),
            React.createElement("div", { className: "modal-body ta-l bgText25" },
                React.createElement("div", null, translateTo('You have unsaved changes', lang))),
            React.createElement("div", { className: "modal-footer dis-f jc-b jc-fe-md bgWhite jc-b" },
                React.createElement(BrixelButtonSecondary, { label: translateTo('Discard and exit', lang), rounded: true, theme: "red", onClick: () => closeAndReset() }),
                React.createElement(BrixelButtonPrimary, { className: "ml-2", rounded: true, label: translateTo('Save and exit', lang), onClick: () => saveData(), isLoading: isSmallLoading.saveData })))));
};
const mapStateToProps = (state, ownProps) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    formValue: get(state, `brixelForm[${ownProps.formName}].values`, {}),
    initialValue: get(state, `brixelForm[${ownProps.formName}].initialValues`, {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleReset(form, value) {
        dispatch(reset(form, value));
    },
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(WarningScreen);
