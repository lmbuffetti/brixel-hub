import React, { useEffect, useState } from 'react';
import { BrixelButtonIcon, BrixelIcon, } from '@brixel-io/brixel-components';
import { change } from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { getActiveSingleProperty, saveActiveSingleProperty } from '../../../actions/PropertyActions';
import { deleteDocument } from '../../../actions/UploadActions';
import buyerDocumentsEmpty from '../../../images/Media/buyer_docuboxEmpty.svg';
import translateTo from '../../../utils/translation';
import { setNotification, spinnerSmall } from '../../../actions/CommonActions';
import SectionMobileTitle from '../../../components/SectionMobileTitle';
const Documents = (props) => {
    // PROPS
    const { activeSingleProperty, lang, } = props;
    const [processedDocuments, setProcessedDocuments] = useState([]);
    const [showFullFolder, setShowFullFolder] = useState([]);
    const { documents } = activeSingleProperty;
    useEffect(() => {
        let docs = documents || [];
        docs = docs.filter((item) => !item.isPrivate);
        if (docs.length > 0) {
            const newDoc = new Map();
            docs.forEach((doc) => {
                const folderName = doc.folder || 'NoFolder';
                if (newDoc.get(folderName)) {
                    const activeDoc = newDoc.get(folderName);
                    activeDoc.push(doc);
                    newDoc.set(folderName, activeDoc);
                }
                else
                    newDoc.set(folderName, [doc]);
            });
            const defDocs = [];
            // eslint-disable-next-line no-unused-vars
            for (const [key, value] of newDoc) {
                if (key === 'NoFolder' || key === '')
                    defDocs.unshift(value);
                else
                    defDocs.push(value);
            }
            setProcessedDocuments(defDocs);
        }
        if (documents && documents.length === 0)
            setProcessedDocuments([]);
    }, [documents && documents.length, documents]);
    const openDocument = (e, id) => {
        if (e)
            e.preventDefault();
        if (activeSingleProperty.documents) {
            const currentDoc = activeSingleProperty.documents.find(doc => doc.id === id);
            if (currentDoc)
                window.open(currentDoc.loadUrl, '_blank');
        }
    };
    const index = (key) => findIndex(showFullFolder, (el) => el === key);
    const onExpandFolder = (e, i) => {
        if (e)
            e.preventDefault();
        const clone = cloneDeep(showFullFolder);
        if (index(i) === -1) {
            clone.push(i);
        }
        else if (index(i) !== -1) {
            clone.splice(index(i), 1);
        }
        setShowFullFolder(clone);
    };
    const filterDocsByFodler = (_docs, folderName) => {
        if (!folderName || folderName === 'NoFolder') {
            return processedDocuments.filter((dc) => dc[0] && (dc[0].folder === 'NoFolder' || !dc[0].folder));
        }
        return processedDocuments.filter((dc) => dc[0] && dc[0].folder !== 'NoFolder' && dc[0].folder !== '');
    };
    return (React.createElement("div", { className: "h-perc-lg-100 secondLevel" },
        React.createElement("h3", { className: "mb-3 hide dis-b-lg" }, translateTo('Docubox', lang)),
        React.createElement(SectionMobileTitle, { title: "Docubox" }),
        React.createElement("div", { className: `boxCard ${(!documents || (documents && documents.length === 0)) ? 'emptyMedia' : ''} docubox cardSecondLevel max-w-perc-100 max-w-fix-768` },
            React.createElement("div", { className: "dis-fl-col uploadPanel a-c" },
                processedDocuments && processedDocuments.length < 1 && (React.createElement("div", { className: "pt-5" },
                    React.createElement("img", { loading: "lazy", className: "h-fix-120", src: buyerDocumentsEmpty, alt: "Empty Documents" }),
                    React.createElement("h5", { className: "mt-3 mb-2 ta-c" }, translateTo('No documents available.', lang)),
                    React.createElement("p", { className: "max-w-fix-376 m-a ta-c txtDark200 fsize-300 mb-5" }, translateTo('Please contact the seller for further documents about this property.', lang)))),
                processedDocuments.length > 0 && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "documents-container w-perc-100 dis-fl-col mt-3" },
                        React.createElement("div", { className: "folder-list pos-r" },
                            React.createElement(React.Fragment, null,
                                filterDocsByFodler(processedDocuments, 'NoFolder').map((docList, i) => (React.createElement("div", { className: 'noFolderWrapper brdSmall brdText100 dis-fl-col pt-1 px-sm-2 px-1 mb-2 brdRadius', key: `noFolderDoc${i.toString()}` }, docList.map((doc, k) => (React.createElement("div", { id: `nofolderDocs${doc.id}`, key: `prcDocs_${k.toString()}`, className: "single-document dis-fl-row a-c jc-b p-1" },
                                    React.createElement("div", { className: "name dis-fl-row a-c pr-1 pr-sm-0" },
                                        React.createElement("div", { className: "dis-fl-col docDetails cur-poi", onClick: (e) => openDocument(e, doc.id) },
                                            React.createElement("span", { className: "document-title fweight-500 fsize-400 txtText900" }, doc.name),
                                            React.createElement("span", { className: "body2 txtGreen400 dont-break-out" }, translateTo(doc.type || '', lang)),
                                            doc?.createdAt ? (React.createElement("span", { className: "date fsize-200 txtText400 pt-small-4" }, !isNaN(+doc.createdAt) ? (React.createElement(React.Fragment, null, DateTime.fromMillis(doc.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm'))) : (React.createElement(React.Fragment, null, DateTime.fromISO(doc.createdAt.toString(), { locale: lang }).toFormat('dd LLL yyyy, H:mm'))))) : (React.createElement("span", { className: "date fsize-200 txtText200" }, "-")))))))))),
                                filterDocsByFodler(processedDocuments, 'folder').length > 0 && (React.createElement(React.Fragment, null, filterDocsByFodler(processedDocuments, 'folder').map((docList, i) => (React.createElement("div", { key: `folderDoc${i.toString()}` },
                                    React.createElement("div", { className: "document-folder brdSmall brdText100 dis-fl-col mb-2 brdRadius", key: `prcDcc_${i.toString()}` },
                                        React.createElement("div", { className: `dis-fl-row jc-b a-c p-1 ${(index(i) !== -1) ? 'brdSmallBottom brdText100' : ''}` },
                                            React.createElement("div", { className: "dis-fl-row a-c p-1 flex-1", onClick: (e) => onExpandFolder(e, i) },
                                                React.createElement(BrixelIcon, { icon: "folder", color: "green", saturationTxt: 400, saturation: 100, background: "green", className: "mr-1" }),
                                                React.createElement("h6", { className: 'fweight-600' }, docList[0].folder)),
                                            React.createElement(BrixelButtonIcon, { ghost: true, theme: "text", themeSat: 600, icon: `${(index(i) !== -1) ? 'arrow-simple-up' : 'arrow-simple-down'}`, onClick: (e) => {
                                                    e.preventDefault();
                                                    const clone = cloneDeep(showFullFolder);
                                                    if (index(i) === -1) {
                                                        clone.push(i);
                                                    }
                                                    else if (index(i) !== -1) {
                                                        clone.splice(index(i), 1);
                                                    }
                                                    setShowFullFolder(clone);
                                                } })),
                                        (index(i) !== -1) && docList.map((doc, k) => (React.createElement("div", { key: `prcDocs_${k.toString()}`, className: "single-document dis-fl-row a-c jc-b p-2" },
                                            React.createElement("div", { className: "name w-fix-184 w-fix-lg-352 dis-fl-row a-c pr-1 pr-sm-0" },
                                                React.createElement("div", { className: "dis-fl-col docDetails cur-poi", onClick: (e) => openDocument(e, doc.id) },
                                                    React.createElement("span", { className: "document-title max-w-fix-168 max-w-perc-lg-100 fweight-500 dont-break-out" }, doc.name),
                                                    React.createElement("span", { className: "body2 txtGreen400 dont-break-out" }, translateTo(doc.type || '', lang)),
                                                    doc?.createdAt ? (React.createElement("span", { className: "date fsize-200 txtText400 pt-small-4" }, !isNaN(+doc.createdAt) ? (React.createElement(React.Fragment, null, DateTime.fromMillis(doc.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm'))) : (React.createElement(React.Fragment, null, DateTime.fromISO(doc.createdAt.toString(), { locale: lang }).toFormat('dd LLL yyyy, H:mm'))))) : (React.createElement("span", { className: "date fsize-200 txtText400 pt-small-4" }, "-"))))))))))))))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'company.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    lang: get(state, 'common.language', 'en'),
    userType: get(state, 'user.userTypes', ''),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
    handleSpinnerSmall: bindActionCreators(spinnerSmall, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
    handleSetScreenNotification: bindActionCreators(setNotification, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Documents);
