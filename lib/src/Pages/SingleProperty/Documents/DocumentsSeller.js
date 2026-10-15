import { BrixelButtonIcon, BrixelButtonSecondary, BrixelTooltip, BrixelDropdownMini, BrixelIcon, useOutsideAlerter, } from '@brixel-io/brixel-components';
import documentConfig from '@brixel-io/brixel-components/dist/configuration/DocumentsConfig';
import { change } from '@brixel-io/brixel-components/dist/form';
import { findIndex } from 'lodash';
import { useDropzone } from 'react-dropzone';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import isNaN from 'lodash/isNaN';
import values from 'lodash/values';
import { DateTime } from 'luxon';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setScreenNotification, spinnerSmall } from '../../../actions/CommonActions';
import { deleteDocument, reorderPageDocuments, updatePageDocument } from '../../../actions/UploadActions';
import translateTo from '../../../utils/translation';
import dragIcon from '../../../images/Upload/drag-icon.svg';
import uploadDocumentsEmpty from '../../../images/Upload/upload_documents_empty.svg';
import { getActiveSingleProperty, saveActiveSingleProperty } from '../../../actions/PropertyActions';
import multiUpload from '@brixel-io/brixel-components/dist/helpers/uploads/MultiUpload';
const Documents = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSingleProperty, formValue, handleDeleteDocument, handleSpinnerSmall, handleGetActiveSingleProperty, handleOrderDocuments, handleUpdateDocument, isBuyer = false, lang, isSmallLoading, loggedInUser, setNotification, } = props;
    const { documents, } = formValue;
    // STATE
    const [documentOptionsOpen, setDocumentOptionsOpen] = useState({
        id: '',
        active: false,
    });
    const [docIsChange, setDocIsChange] = useState(false);
    const [docsList, setDocsList] = useState({});
    const [documentId, setDocumentId] = useState(0);
    const [processedDocuments, setProcessedDocuments] = useState([]);
    const [folderDocsFile, setFolderDocsFile] = useState([]);
    const [showFullFolder, setShowFullFolder] = useState([]);
    const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [isMovingFolder, setIsMovingFolder] = useState(false);
    const [isNewFolder, setIsNewFolder] = useState(false);
    const [foldersList, setFoldersList] = useState([]);
    let mouseDown = 0;
    document.body.onmousedown = function () {
        if (!docIsChange)
            setDocIsChange(true);
        ++mouseDown;
    };
    document.body.onmouseup = function () {
        --mouseDown;
    };
    // REF
    const documentRef = useRef();
    documentRef.current = new Array(documents ? documents.length : 0);
    useEffect(() => {
        setTimeout(() => { setIsReady(true); }, 200);
    }, []);
    useEffect(() => {
        if (has(formValue, 'location.countryCode')) {
            const country = formValue?.location?.countryCode || '';
            if (documentConfig.mandatoryDocuments[country]) {
                setMandatoryDocuments(documentConfig.mandatoryDocuments[country][get(formValue, 'properties.propertyType')]);
            }
            else {
                setMandatoryDocuments(documentConfig.mandatoryDocuments.EN[get(formValue, 'properties.propertyType', '')]);
            }
        }
    }, [formValue]);
    useEffect(() => {
        const docs = activeSingleProperty.documents || [];
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
            const onlyFolderDocs = docs.filter((doc) => doc.folder && doc.folder !== 'NoFolder');
            const folderName = [...onlyFolderDocs.map((doc) => doc.folder || 'NoFolder')];
            setFoldersList([...new Set(folderName)].sort());
            // eslint-disable-next-line no-unused-vars
            for (const [key, value] of newDoc) {
                if (key === 'NoFolder')
                    defDocs.unshift(value);
                else
                    defDocs.push(value);
            }
            setProcessedDocuments(defDocs);
            setFolderDocsFile(defDocs);
        }
        if (docs && docs.length === 0) {
            setFolderDocsFile([]);
            setProcessedDocuments([]);
        }
    }, [JSON.stringify(activeSingleProperty.documents)]);
    useEffect(() => {
        setFolderDocsFile(processedDocuments);
    }, [processedDocuments]);
    useEffect(() => {
        const getURL = history.location.pathname.split('/');
        if (getURL[getURL.length - 1] === 'addToFolder') {
            setIsNewFolder(true);
        }
        else {
            setIsNewFolder(false);
        }
        if (isSmallLoading.saveData)
            handleSpinnerSmall({ saveData: false });
        if (isSmallLoading.editDocument)
            handleSpinnerSmall({ editDocument: false });
    }, [history.location.pathname, isSmallLoading, documentOptionsOpen.id]);
    const index = (key) => findIndex(showFullFolder, (el) => el === key);
    // URL PARAMS
    const propID = get(match, 'propID', null);
    useEffect(() => {
        if (!isSmallLoading.uploadMedia) {
            setDocumentOptionsOpen({ id: '', active: false });
        }
    }, [isSmallLoading]);
    const updatePage = () => {
        if (propID) {
            handleGetActiveSingleProperty({
                id: propID,
                smallLoader: 'uploadMedia',
            });
        }
    };
    // MULTIUPLOADING FUNCTION
    const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            fileRejections.forEach((file) => {
                file.errors.forEach((err) => {
                    if (err.code === 'file-too-large') {
                        setNotification({
                            state: true,
                            type: 'alert',
                            label: translateTo('One or more file(s) is(are) bigger than 40MB', lang),
                        });
                    }
                    if (err.code === 'file-invalid-type') {
                        setNotification({
                            state: true,
                            type: 'alert',
                            label: translateTo('One or more files has(have) an invalid format', lang),
                        });
                    }
                });
            });
        }
        else if (propID) {
            handleSpinnerSmall({ uploadMedia: true });
            multiUpload(acceptedFiles, 'pageDocument', { pageID: propID, companyID: activeSingleCompany.id }, { type: 'Generic' })
                .then(() => {
                updatePage();
            });
        }
    }, [formValue, loggedInUser]);
    const loadFile = async (e, type = '', key) => {
        if (e)
            e.preventDefault();
        if (propID) {
            const inputDocs = document.getElementById(`documentInput${key}`);
            const acceptedFiles = values(inputDocs ? inputDocs.files : '');
            handleSpinnerSmall({ uploadMedia: true });
            multiUpload(acceptedFiles, 'pageDocument', { pageID: propID, companyID: activeSingleCompany.id }, { type })
                .then(() => {
                updatePage();
            });
        }
    };
    // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
        },
        minSize: 0,
        maxSize: 4e+7,
    });
    // REMOVE DOCUMENTS
    const deleteDocs = (e, idDocs) => {
        if (e)
            e.preventDefault();
        setDocumentOptionsOpen({
            id: '',
            active: false,
        });
        const data = {
            docID: idDocs,
            id: activeSingleProperty.id,
            smallLoader: 'loadingMedia',
            type: 'pageDocument',
        };
        handleDeleteDocument(data);
    };
    const openDocument = (e, id) => {
        if (e)
            e.preventDefault();
        if (activeSingleProperty.documents) {
            const currentDoc = activeSingleProperty.documents.find(doc => doc.id === id);
            if (currentDoc)
                window.open(currentDoc.loadUrl.replace(/&amp;/g, '&'), '_blank');
        }
    };
    const manageDocument = (e, id, type = 'docs') => {
        if (e)
            e.preventDefault();
        setDocumentOptionsOpen({
            id: '',
            active: false,
        });
        const path = get(history, 'location.pathname', '').replace(/\/$/, '');
        if (type === 'folder') {
            history.push(`${path}/${id}/addToFolder`);
        }
        else {
            history.push(`${path}/${id}/editDocument`);
        }
    };
    const countMandatoryDocuments = () => {
        let count = 0;
        if (documents) {
            documents.forEach((doc) => {
                mandatoryDocuments.forEach((el) => {
                    if (el === doc.type)
                        count += 1;
                });
            });
        }
        return count;
    };
    const mandatoryDocumentExists = (el) => {
        let result = false;
        if (documents) {
            documents.forEach((doc) => {
                if (el === doc.type)
                    result = true;
            });
        }
        return result;
    };
    const getTxtColor = () => {
        if (countMandatoryDocuments() === mandatoryDocuments.length)
            return 'txtGreen700';
        if (countMandatoryDocuments() === 0)
            return 'txtRed400';
        return 'txtYellow400';
    };
    const saveDraggedDocuments = (doc) => {
        if (documents && !isNewFolder && !isMovingFolder && mouseDown <= 0 && docIsChange) {
            const docFullList = [];
            const idsOrderDocs = [];
            folderDocsFile.forEach((folderDC) => {
                idsOrderDocs.push(...folderDC.map((subDC) => subDC.id));
                const folderName = folderDC[0]?.folder || 'NoFolder';
                if (doc[folderName]) {
                    doc[folderName].forEach((newList) => {
                        const findIndexDoc = idsOrderDocs.findIndex((dc) => dc === newList.id);
                        if (findIndexDoc > -1)
                            idsOrderDocs.splice(findIndexDoc, 1);
                        idsOrderDocs.push(newList.id);
                    });
                }
            });
            Object.keys(doc).forEach((key) => {
                docFullList.push(...doc[key]);
            });
            // DOCUMENTS ORDER
            const startedIds = documents.map((dc) => dc.id);
            // DOCUMENTS FOLDER
            let isToSave = true;
            docFullList.forEach((newDoc) => {
                const getOldFolder = documents.find((dc) => dc.id === newDoc?.id);
                if (newDoc?.folder !== getOldFolder?.folder) {
                    const docSel = newDoc;
                    docSel.folder = newDoc.folder;
                    delete docSel.loadUrl;
                    delete docSel.url;
                    delete docSel.user;
                    const bodySingleDoc = {
                        pageID: propID,
                        body: docSel,
                        smallLoader: 'editDocument',
                        documentIds: idsOrderDocs,
                    };
                    handleUpdateDocument(bodySingleDoc);
                    if (isToSave)
                        isToSave = false;
                }
            });
            if (isToSave && startedIds.join() !== idsOrderDocs.join()) {
                const dataToSave = {
                    pageID: propID,
                    smallLoader: 'editDocument',
                    data: {
                        documentIds: idsOrderDocs,
                    },
                };
                handleOrderDocuments(dataToSave);
            }
        }
    };
    const dragDocuments = (doc, list) => {
        if (documents) {
            const newListDoc = doc.map((dc) => {
                delete dc.selected;
                delete dc.chosen;
                return ({ ...dc, folder: list });
            });
            const originalDocByList = documents.filter((dc) => dc.folder === list);
            let saveData = false;
            newListDoc.forEach((key, id) => {
                if (originalDocByList[id]?.id !== key?.id) {
                    saveData = true;
                }
            });
            if (!isNewFolder && saveData)
                setDocsList((prev) => ({ ...prev, [list]: newListDoc }));
        }
    };
    const moveFolder = (folder) => {
        if (folder.every(i => typeof i === 'string') && documents) {
            const newOrderDocs = {
                NoFolder: documents.filter((dc) => !dc.folder || dc.folder === 'NoFolder'),
            };
            folder.forEach((list) => {
                newOrderDocs[list] = documents.filter((dc) => dc.folder === list);
            });
            setDocsList(newOrderDocs);
        }
    };
    useEffect(() => {
        if (!isNewFolder && mouseDown <= 0 && docIsChange) {
            saveDraggedDocuments(docsList);
        }
    }, [docsList]);
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
    const filterDocsByFolder = (docs, folderName) => {
        if (!folderName || folderName === 'NoFolder') {
            return docs.filter((dc) => dc[0] && (dc[0].folder === 'NoFolder' || !dc[0].folder));
        }
        return docs.filter((dc) => dc[0] && dc[0].folder !== 'NoFolder' && dc[0].folder !== '');
    };
    const dropdownActionDoc = (doc) => {
        return [
            {
                label: translateTo('View', lang),
                clickFunc: (e) => openDocument(e, doc.id),
            },
            {
                label: translateTo('Edit', lang),
                clickFunc: (e) => {
                    manageDocument(e, doc.id);
                },
            },
            {
                label: translateTo('Add to folder', lang),
                clickFunc: (e) => {
                    manageDocument(e, doc.id, 'folder');
                },
            },
            {
                label: translateTo('Remove', lang),
                className: 'txtRed400',
                clickFunc: (e) => deleteDocs(e, doc.id),
            },
        ];
    };
    // Function to close the small menus when we click outside
    useOutsideAlerter(documentRef, {
        id: documentId,
        action: 'function',
        func: () => {
            setDocumentOptionsOpen({
                id: '',
                active: false,
            });
        },
    });
    return (React.createElement(React.Fragment, null, !isReady ? (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "max-w-fix-768" },
            React.createElement("p", { className: "h-fix-32 mb-3 skeletonBg w-fix-56" }, " "),
            React.createElement("p", { className: "h-fix-32 mb-3 skeletonBg w-perc-50" }, " "),
            React.createElement("div", { className: "w-perc-100 mt-3 brdRadius skeletonBg h-fix-72" }),
            React.createElement("div", { className: "w-perc-100 mt-1 brdRadius skeletonBg h-fix-72" }),
            React.createElement("div", { className: "w-perc-100 mt-1 brdRadius skeletonBg h-fix-72" }),
            React.createElement("div", { className: "w-perc-100 mt-1 brdRadius skeletonBg h-fix-72" }),
            React.createElement("div", { className: "w-perc-100 mt-5 brdRadius skeletonBg h-fix-400" })))) : (React.createElement("div", { className: "h-perc-lg-100 py-5" },
        React.createElement("h3", { className: "mb-3 hide dis-b-lg" }, translateTo('Docubox', lang)),
        !isBuyer && has(formValue, 'location') && (React.createElement(React.Fragment, null, mandatoryDocuments && (React.createElement("div", { className: "mandatory-documents mb-5" },
            React.createElement("p", { className: `fweight-500 fsize-500 ${getTxtColor()} mb-4` },
                React.createElement("span", null, translateTo('You have uploaded', lang)),
                React.createElement("span", null,
                    " ",
                    countMandatoryDocuments(),
                    " "),
                React.createElement("span", null, translateTo('of', lang)),
                React.createElement("span", null,
                    " ",
                    mandatoryDocuments.length,
                    " "),
                React.createElement("span", null, translateTo('documents.', lang))),
            mandatoryDocuments.map((element, j) => (React.createElement("div", { className: "dis-fl-col max-w-perc-100 max-w-fix-768", key: `mndDoc_${j.toString()}` },
                React.createElement("div", { className: "dis-fl-row a-c jc-b py-2 pl-2" },
                    React.createElement("div", { className: "dis-fl-row a-c" },
                        mandatoryDocumentExists(element) !== false && (React.createElement(BrixelIcon, { icon: "check-small-fill", color: "green", className: "mr-3" })),
                        mandatoryDocumentExists(element) === false && (React.createElement(BrixelIcon, { icon: "document", className: "mr-3" })),
                        mandatoryDocumentExists(element) !== false && (React.createElement("span", { className: "txtText700 dont-break-out" }, translateTo(element, lang))),
                        mandatoryDocumentExists(element) === false && (React.createElement("span", { className: "txtText700 dont-break-out" }, translateTo(element, lang)))),
                    mandatoryDocumentExists(element) === false && (React.createElement("div", { className: "upload-wrapper cur-poi pl-2 pos-r" },
                        React.createElement(BrixelButtonSecondary, { rounded: true, theme: "green", label: translateTo('Upload', lang) }),
                        React.createElement("input", { accept: "application/pdf, image/png, image/jpeg", multiple: true, className: "cur-poi upload", type: "file", name: "document", id: `documentInput${j}`, onChange: (e) => loadFile(e, element, j) })))),
                React.createElement("hr", { className: "brdText100" })))))))),
        React.createElement("div", { className: `boxCard docubox ${(!documents || (documents && documents.length === 0)) ? 'emptyMedia' : ''} cardSecondLevel max-w-perc-100 max-w-fix-768` },
            React.createElement("div", { className: "dis-fl-col uploadPanel a-c" },
                (documents && documents.length !== 0) && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "dis-f jc-b w-perc-100" },
                        React.createElement("div", { className: "docubox-info mb-3 dis-fl-col a-c as-fs" },
                            React.createElement("h5", { className: "as-fs fSizePx20 fweight-600" }, translateTo('Drag to move and reorder documents', lang)),
                            React.createElement("span", { className: "as-fs txtText600 fsize-300" }, translateTo('The order will be the same as seen on your Brixel Page.', lang)))))),
                React.createElement("div", { className: `${(!folderDocsFile || (folderDocsFile.length === 0)) ? 'emptyState my-3 my-sm-5' : 'hasImages py-2 py-lg-4'} upload-container dis-fl-col a-c ta-c w-perc-100 ${!folderDocsFile || (folderDocsFile.length === 0) ? '' : 'bgGreen50'}`, ...getRootProps() },
                    React.createElement("input", { ...getInputProps() }),
                    React.createElement("div", null,
                        isSmallLoading.uploadMedia ? (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: `${(!folderDocsFile || (folderDocsFile.length === 0)) ? 'h-fix-120' : 'h-fix-64'}  ml-a mr-a` },
                                React.createElement("div", { className: 'loaderX ml-a mr-a' },
                                    React.createElement("div", { className: 'loader-wheel' }))))) : (React.createElement(React.Fragment, null,
                            React.createElement("img", { loading: "lazy", className: `${(!folderDocsFile || (folderDocsFile.length === 0)) ? 'h-fix-120' : 'h-fix-64'}  ml-a mr-a`, src: uploadDocumentsEmpty, alt: "Empty Documents" }))),
                        React.createElement("p", { className: "mt-2 dis-b txtGreen400" }, (!folderDocsFile || (folderDocsFile.length === 0)) ? (React.createElement(React.Fragment, null,
                            React.createElement("span", { className: "td-u fweight-500 cur-poi" }, translateTo('Click to upload', lang)),
                            " ",
                            React.createElement("span", null, translateTo('your first document or drag and drop.', lang)))) : (React.createElement(React.Fragment, null,
                            React.createElement("span", { className: 'td-u fweight-600 cur-poi' }, translateTo('Click to upload files', lang)),
                            React.createElement("span", { className: "ml-small-4" }, translateTo('or drag and drop.', lang)))))),
                    (!folderDocsFile || (folderDocsFile.length === 0)) && (React.createElement("span", { className: "brdSmallTop brdText100 w-fix-104 my-2" })),
                    React.createElement("span", { className: "body2 txtText600" }, translateTo('Choose .pdf .jpg .png with max. 40 MB size', lang))),
                folderDocsFile.length > 0 && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "documents-container w-perc-100 dis-fl-col mt-3" },
                        React.createElement("div", { className: "folder-list pos-r" },
                            React.createElement("span", { className: "fsize-300 fweight-600 dis-b mb-2" }, "Files"),
                            React.createElement(ReactSortable, { handle: ".folderHandle", group: "groupName", removeCloneOnHide: false, list: [], setList: () => '' },
                                filterDocsByFolder(folderDocsFile, 'NoFolder').length === 0 ? (React.createElement(ReactSortable, { handle: ".docsHandle", delay: 2, group: "groupName", removeCloneOnHide: false, list: [], setList: (docs) => dragDocuments(docs, 'NoFolder'), onStart: () => setIsMovingFolder(true), onEnd: () => setIsMovingFolder(false) },
                                    React.createElement("div", { className: "brdSmall brdText100 dis-fl-col py-3 a-c mb-2 brdRadius fsize-300 txtText400" }, translateTo('Drag and drop single files here', lang)))) : (filterDocsByFolder(folderDocsFile, 'NoFolder').map((docList, i) => (React.createElement("div", { className: 'noFolderWrapper brdSmall brdText100 dis-fl-col py-1 px-sm-2 px-1 mb-2 brdRadius', key: `noFolder${docList.id}` },
                                    React.createElement(ReactSortable, { key: `prcDcc_${i.toString()}`, handle: ".docsHandle", removeCloneOnHide: false, delay: 2, group: "groupName", 
                                        // @ts-ignore
                                        list: cloneDeep(docList), className: "", setList: (docs) => dragDocuments(docs, 'NoFolder'), onStart: () => setIsMovingFolder(true), onEnd: () => setIsMovingFolder(false) }, docList.map((doc, f) => (React.createElement("div", { "data-id": doc.id, id: `nofolderDocs${doc.id}`, key: `folderDoc${doc.id}-${f.toString()}`, className: "single-document dis-fl-row a-c jc-b py-1 pr-0 pl-0 pl-sm-1" },
                                        React.createElement("div", { className: "name dis-fl-row a-c pr-1 pr-sm-0" },
                                            React.createElement("div", { className: "icon-container brdRadius dis-f w-fix-24 h-fix-40 jc-c a-c mr-1" },
                                                React.createElement("div", { className: "w-fix-16" },
                                                    React.createElement("img", { alt: "Drag Icon", width: 18, className: 'cur-grab docsHandle', src: dragIcon }))),
                                            React.createElement("div", { className: "dis-fl-col docDetails cur-poi", onClick: (e) => openDocument(e, doc.id) },
                                                React.createElement("span", { className: "document-title fweight-500 fsize-400 txtText900" }, doc.name),
                                                React.createElement("span", { className: "body2 txtGreen400 dont-break-out" }, translateTo(doc.type || '', lang)),
                                                doc.id,
                                                doc?.createdAt ? (React.createElement("span", { className: "date fsize-200 txtText400 pt-small-4" }, !isNaN(+doc.createdAt) ? (React.createElement(React.Fragment, null, DateTime.fromMillis(doc.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm'))) : (React.createElement(React.Fragment, null, DateTime.fromISO(doc.createdAt.toString(), { locale: lang }).toFormat('dd LLL yyyy, H:mm'))))) : (React.createElement("span", { className: "date fsize-200 txtText200" }, "-")))),
                                        React.createElement("div", { className: "pos-r dis-fl-row a-c" },
                                            React.createElement(BrixelTooltip, { description: `${translateTo('This document is set to', lang)} ${translateTo(`${doc.isPrivate === true ? 'private' : 'public'}`, lang)}. ${translateTo('Edit to change.', lang)}`, width: "200", theme: 'blue', iconColor: `${doc.isPrivate === true ? 'red' : 'green'}`, icon: `${doc.isPrivate === true ? 'locked' : 'eye'}`, className: "mr-0" }),
                                            React.createElement(BrixelButtonIcon, { ghost: true, theme: "text", themeSat: 600, icon: "options-vertical", onClick: () => {
                                                    setDocumentOptionsOpen({
                                                        id: doc.id,
                                                        active: !documentOptionsOpen.active,
                                                    });
                                                    setDocumentId(i);
                                                } }),
                                            (documentOptionsOpen.id === doc.id && documentOptionsOpen.active) && (React.createElement(React.Fragment, null,
                                                React.createElement(BrixelDropdownMini, { topOffset: 50, rightAligned: true, links: [
                                                        {
                                                            label: translateTo('View', lang),
                                                            clickFunc: (e) => openDocument(e, doc.id),
                                                        },
                                                        {
                                                            label: translateTo('Edit', lang),
                                                            clickFunc: (e) => {
                                                                manageDocument(e, doc.id);
                                                            },
                                                        },
                                                        {
                                                            label: translateTo('Add to folder', lang),
                                                            clickFunc: (e) => {
                                                                manageDocument(e, doc.id, 'folder');
                                                            },
                                                        },
                                                        {
                                                            label: translateTo('Remove', lang),
                                                            className: 'txtRed400',
                                                            clickFunc: (e) => deleteDocs(e, doc.id),
                                                        },
                                                    ] })))))))))))),
                                React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "fsize-300 fweight-600 dis-b pt-1 mb-2" }, "Folders"),
                                    filterDocsByFolder(folderDocsFile, 'folder').length > 0 ? (React.createElement(ReactSortable, { handle: ".folderHandle", group: "groupName", removeCloneOnHide: false, 
                                        // @ts-ignore
                                        list: foldersList, setList: (doc) => moveFolder(doc), onStart: () => setIsMovingFolder(true), onEnd: () => setIsMovingFolder(false) }, foldersList.map((docList, i) => (React.createElement("div", { key: `folder${i.toString()}` },
                                        React.createElement("div", { className: "document-folder brdSmall brdText100 dis-fl-col mb-2 brdRadius", key: `prcDcc_${i.toString()}` },
                                            React.createElement("div", { className: `dis-fl-row jc-b a-c p-1 ${(index(i) !== -1) ? 'brdSmallBottom brdText100' : ''}` },
                                                React.createElement("div", { className: "dis-fl-row a-c p-1 flex-1", onClick: (e) => onExpandFolder(e, i) },
                                                    React.createElement(BrixelIcon, { icon: "folder", color: "green", saturationTxt: 400, saturation: 100, background: "green", className: "mx-1", isLoading: isSmallLoading.deleteMedia }),
                                                    React.createElement("h6", { className: "fweight-600" }, docList)),
                                                React.createElement(BrixelButtonIcon, { ghost: true, theme: "text", icon: `${(index(i) !== -1) ? 'arrow-simple-up' : 'arrow-simple-down'}`, onClick: (e) => {
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
                                            React.createElement(ReactSortable, { className: (index(i) !== -1 || isMovingFolder) ? 'mt-1 pt-0 px-2' : '', handle: ".docsHandle", delay: 2, group: "groupName", removeCloneOnHide: false, list: cloneDeep(documents?.filter((dc) => dc.folder === 'docList')) || [], setList: (docs) => dragDocuments(docs, docList), onStart: () => setIsMovingFolder(true), onEnd: () => setIsMovingFolder(false) }, (index(i) !== -1 || isMovingFolder) && documents?.filter((dc) => dc.folder === docList).map((doc) => (React.createElement("div", { key: doc.id, className: "single-document dis-fl-row a-c jc-b py-1" },
                                                React.createElement("div", { className: "name w-fix-184 w-fix-lg-352 dis-fl-row a-c pr-1 pr-sm-0" },
                                                    React.createElement("div", { className: "icon-container brdRadius dis-f w-fix-24 h-fix-40 jc-c a-c mr-1" },
                                                        React.createElement("img", { width: 18, className: "cur-grab docsHandle", src: dragIcon })),
                                                    React.createElement("div", { className: "dis-fl-col docDetails cur-poi", onClick: (e) => openDocument(e, doc.id) },
                                                        React.createElement("span", { className: "document-title max-w-fix-168 max-w-perc-lg-100 fweight-500 dont-break-out" }, doc.name),
                                                        doc.id,
                                                        React.createElement("span", { className: "body2 txtGreen400 dont-break-out" }, doc.type),
                                                        doc?.createdAt ? (React.createElement("span", { className: "date fsize-200 txtText400 pt-small-4" }, !isNaN(+doc.createdAt) ? (React.createElement(React.Fragment, null, DateTime.fromMillis(doc.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm'))) : (React.createElement(React.Fragment, null, DateTime.fromISO(doc.createdAt.toString(), { locale: lang }).toFormat('dd LLL yyyy, H:mm'))))) : (React.createElement("span", { className: "date fsize-200 txtText400 pt-small-4" }, "-")))),
                                                React.createElement("div", { className: "pos-r dis-fl-row a-c" },
                                                    React.createElement(BrixelTooltip, { className: "mr-0", theme: "blue", description: `${translateTo('This document is set to', lang)} ${translateTo(`${doc.isPrivate === true ? 'private' : 'public'}`, lang)}. ${translateTo('Edit to change.', lang)}`, width: "200", iconColor: `${doc.isPrivate === true ? 'red' : 'green'}`, icon: `${doc.isPrivate === true ? 'locked' : 'eye'}` }),
                                                    React.createElement(BrixelButtonIcon, { ghost: true, theme: "text", themeSat: 600, icon: "options-vertical", onClick: () => {
                                                            setDocumentOptionsOpen({
                                                                id: doc.id,
                                                                active: !documentOptionsOpen.active,
                                                            });
                                                            setDocumentId(i);
                                                        } }),
                                                    (documentOptionsOpen.id === doc.id && documentOptionsOpen.active) && (React.createElement(React.Fragment, null,
                                                        React.createElement(BrixelDropdownMini, { topOffset: 50, rightAligned: true, links: dropdownActionDoc(doc) })))))))))))))) : (React.createElement("div", { className: "brdSmall brdText100 dis-fl-col p-1 mb-2 brdRadius" },
                                        React.createElement(ReactSortable, { handle: ".docsHandle", delay: 2, group: "groupName", list: [], className: (index(0) !== -1 || isMovingFolder) ? 'mt-1 pt-0 px-1 px-sm-2' : '', setList: (order) => {
                                                if (get(order, '[0].id', null)) {
                                                    history.push(`/${activeSingleProperty.id}/property/docubox/${get(order, '[0].id', null)}/addToFolder`);
                                                    setIsNewFolder(true);
                                                }
                                            }, onStart: () => setIsMovingFolder(true), onEnd: () => setIsMovingFolder(false) },
                                            React.createElement("div", { className: "dis-fl-col py-3 a-c brdRadius txtText400 fsize-300 max-w-fix-304 ta-c ml-a mr-a" }, "To keep things organized, drag and drop file to create a folder."))))))))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'property.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    formValue: get(state, 'property.activeSingleProperty', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    user: get(state, 'user.loggedInUser', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    handleOrderDocuments: bindActionCreators(reorderPageDocuments, dispatch),
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
    handleSpinnerSmall: bindActionCreators(spinnerSmall, dispatch),
    handleUpdateDocument: bindActionCreators(updatePageDocument, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
    setNotification: bindActionCreators(setScreenNotification, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Documents);
