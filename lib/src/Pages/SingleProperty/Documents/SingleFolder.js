import React, { useEffect, useState } from 'react';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText } from '@brixel-io/brixel-components';
import { BrixelInputText, BrixelRadioButton, BrixelSelect, change, destroy, initializeForm, ReduxField, } from '@brixel-io/brixel-components/dist/form';
import { diff } from 'deep-object-diff';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import uniqBy from 'lodash/uniqBy';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { requestDone, spinnerSmall } from '../../../actions/CommonActions';
import { updatePageDocument } from '../../../actions/UploadActions';
// COMPONENTS
import SplashScreen from '../../../components/SplashScreen';
import translateTo from '../../../utils/translation';
const SingleFolder = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const { activeSingleProperty, destroyForm, changeFieldValue, changeFieldValueDocs, formValue, handleUpdateDocument, handleSmallLoader, initialValues, isSmallLoading, lang, } = props;
    const [activeDocument, setActiveDocument] = useState();
    const [documentFolders, setDocumentFolders] = useState([]);
    const [folderAction, setFolderAction] = useState('newFolder');
    const docID = get(match, 'docID', null);
    useEffect(() => {
        return () => {
            destroyForm();
        };
    }, []);
    useEffect(() => {
        const folderArrayAux = [];
        if (docID) {
            find(activeSingleProperty.documents, (el) => {
                if (el.id === docID) {
                    setActiveDocument(el);
                }
            });
            if (has(formValue, 'id') && activeSingleProperty.documents) {
                activeSingleProperty.documents.forEach((value) => {
                    if (value.folder)
                        folderArrayAux.push(value.folder);
                });
                // TODO check type  of folder array
                const array = [];
                folderArrayAux.forEach((value, key) => {
                    array[key] = {
                        label: translateTo(value, lang),
                        value,
                        id: value.toLowerCase(),
                    };
                });
                let uniq = uniqBy(array, 'id');
                //@ts-ignore
                uniq = uniq.filter((el) => el.value !== '' && el.value.toLowerCase() !== 'nofolder');
                setDocumentFolders(uniq);
            }
        }
    }, [activeSingleProperty.updatedAt, formValue]);
    useEffect(() => {
        if (isSmallLoading.saveData === true) {
            handleSmallLoader({ saveData: false });
            history.push(`/${activeSingleProperty.id}/property/docubox`);
        }
    }, [isSmallLoading]);
    // UPDATE DOCUMENTS
    const updateDoc = (e) => {
        e.preventDefault();
        if (activeSingleProperty?.documents && activeDocument) {
            const indexDoc = activeSingleProperty?.documents.findIndex((el) => el.id === activeDocument.id);
            const docUp = [...activeSingleProperty.documents];
            docUp[indexDoc].folder = formValue.folder;
            changeFieldValueDocs('documents', docUp);
            if (activeDocument) {
                const upDoc = activeDocument;
                delete upDoc.createdAt;
                upDoc.user = upDoc?.user?.id;
                delete upDoc.loadUrl;
                delete upDoc.url;
                const data = {
                    pageID: activeSingleProperty.id,
                    body: {
                        id: activeDocument.id,
                        folder: formValue.folder,
                    },
                    smallLoader: 'editDocument',
                };
                handleUpdateDocument(data);
            }
        }
    };
    const checkDisabled = () => {
        const diffDoc = diff(initialValues, formValue);
        if (Object.keys(diffDoc).length > 0)
            return false;
        return true;
    };
    return (React.createElement(React.Fragment, null, activeDocument?.id && (React.createElement(SplashScreen, { closeOutside: false, className: "edit-document" },
        React.createElement("div", { className: "single-document dis-fl-col flex-1" },
            React.createElement("div", { className: "top dis-fl-row a-c jc-b py-3 max-h-fix-80 px-3 brdSmallBottom brdText100 mb-3 pos-r" },
                React.createElement("h4", { className: "name dis-b fweight-600 ml-a mr-a" }, translateTo('Add to folder', lang)),
                React.createElement(BrixelButtonIcon, { icon: "close", bgTransparent: true, className: 'pos-a-fix x-r-2', theme: "black", onClick: () => {
                        history.push(`/${activeSingleProperty.id}/property/docubox`);
                    } })),
            React.createElement("div", { className: "mid dis-fl-col mb-10 px-3" },
                React.createElement("div", null,
                    React.createElement(BrixelRadioButton, { disableDelay: true, input: {
                            onChange: (val) => setFolderAction(val),
                            value: folderAction,
                            name: 'folderAction',
                        }, options: [{
                                label: translateTo('Create new folder', lang),
                                value: 'newFolder',
                                index: 0,
                            }] }),
                    folderAction === 'newFolder' && (React.createElement(ReduxField, { form: "SingleFolder", design: {
                            className: 'mt-2 zIndex1 w-fix-248',
                        }, input: {
                            name: 'folder',
                            placeholder: translateTo('New folder name', lang),
                        }, component: BrixelInputText }))),
                documentFolders.length > 0 && (React.createElement("div", { className: "mt-2" },
                    React.createElement(BrixelRadioButton, { disableDelay: true, input: {
                            onChange: (val) => setFolderAction(val),
                            value: folderAction,
                            name: 'folderAction',
                        }, options: [{
                                label: translateTo('Add to existing folder', lang),
                                value: 'addToFolder',
                                index: 1,
                            }] }),
                    folderAction === 'addToFolder' && (React.createElement(ReduxField, { form: "SingleFolder", design: {
                            className: 'mt-2 zIndex1 w-fix-248',
                        }, input: {
                            name: 'folder',
                            options: documentFolders,
                        }, component: BrixelSelect })))),
                (activeDocument.folder && activeDocument.folder?.toLowerCase() !== 'nofolder') && (React.createElement(BrixelRadioButton, { className: "mt-2", disableDelay: true, input: {
                        onChange: (val) => {
                            changeFieldValue('folder', 'NoFolder');
                            setFolderAction(val);
                        },
                        value: folderAction,
                        name: 'folderAction',
                    }, options: [{
                            label: translateTo('Remove from folder', lang),
                            value: '',
                            index: 2,
                        }] }))),
            React.createElement("div", { className: "bottom dis-fl-row jc-b brdSmallTop brdText100 w-perc-100 a-c px-3 py-3 h-fix-80 mt-a" },
                React.createElement(BrixelButtonText, { className: "edit mr-2", theme: "text", themeSat: 800, rounded: true, label: translateTo('Cancel', lang), onClick: () => {
                        history.push(`/${activeSingleProperty.id}/property/docubox`);
                    } }),
                React.createElement(BrixelButtonPrimary, { className: "edit", label: translateTo('Save', lang), rounded: true, disabled: checkDisabled(), isLoading: isSmallLoading.saveData, onClick: (e) => {
                        updateDoc(e);
                    } })))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    formValue: get(state, 'brixelForm.SingleFolder.values', {}),
    initialValues: get(state, 'brixelForm.SingleFolder.initialValues', {}),
    isRequestDone: get(state, 'common.requestDone', false),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('SingleFolder', field, value));
    },
    changeFieldValueDocs(field, value) {
        dispatch(change('Property', field, value));
    },
    initForm(value) {
        dispatch(initializeForm('SingleFolder', value));
    },
    destroyForm() {
        dispatch(destroy('SingleFolder'));
    },
    handleSmallLoader: bindActionCreators(spinnerSmall, dispatch),
    handleUpdateDocument: bindActionCreators(updatePageDocument, dispatch),
    setRequestDone: bindActionCreators(requestDone, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(SingleFolder);
