import {
  BrixelButtonIcon,
  BrixelButtonSecondary,
  BrixelTooltip,
  BrixelDropdownMini,
  BrixelIcon,
  useOutsideAlerter,
} from '@brixel-io/brixel-components';
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
import {setScreenNotification, spinnerSmall} from '../../../actions/CommonActions';
import {deleteDocument, reorderPageDocuments, updatePageDocument} from '../../../actions/UploadActions';
import translateTo from '../../../utils/translation';
import dragIcon from '../../../images/Upload/drag-icon.svg';
import uploadDocumentsEmpty from '../../../images/Upload/upload_documents_empty.svg';
import type { DocumentsPageType, DocumentTypePage } from '../../../@types/Pages/SingleProperty/Documents';
import { DocumentType } from '@brixel-io/brixel-components/dist/@types/Model';
import type { HelperType } from '../../../@types/App';
import {getActiveSingleProperty, saveActiveSingleProperty} from '../../../actions/PropertyActions';
import multiUpload from '@brixel-io/brixel-components/dist/helpers/uploads/MultiUpload';

const Documents = (props: DocumentsPageType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();

  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    formValue,
    handleDeleteDocument,
    handleSpinnerSmall,
    handleGetActiveSingleProperty,
    handleOrderDocuments,
    handleUpdateDocument,
    isBuyer = false,
    lang,
    isSmallLoading,
    loggedInUser,
    setNotification,
  } = props;
  const {
    documents,
  } = formValue;

  // STATE
  const [documentOptionsOpen, setDocumentOptionsOpen] = useState<HelperType>({
    id: '',
    active: false,
  });
  const [docIsChange, setDocIsChange] = useState<boolean>(false);
  const [docsList, setDocsList] = useState<object>({});
  const [documentId, setDocumentId] = useState(0);
  const [processedDocuments, setProcessedDocuments] = useState<DocumentTypePage[][]>([]);
  const [folderDocsFile, setFolderDocsFile] = useState<DocumentTypePage[][]>([])
  const [showFullFolder, setShowFullFolder] = useState<number[]>([]);
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isMovingFolder, setIsMovingFolder] = useState<boolean>(false);
  const [isNewFolder, setIsNewFolder] = useState(false);

  const [foldersList, setFoldersList] = useState<string[]>([]);

  let mouseDown = 0;
  document.body.onmousedown = function() {
    if (!docIsChange) setDocIsChange(true);
    ++mouseDown;
  }
  document.body.onmouseup = function() {
    --mouseDown;
  }

  // REF
  const documentRef = useRef() as React.MutableRefObject<object[]>;
  documentRef.current = new Array(documents ? documents.length : 0);

  useEffect(() => {
    setTimeout(() => {setIsReady(true);}, 200);
  }, []);

  useEffect(() => {
    if (has(formValue, 'location.countryCode')) {
      const country = formValue?.location?.countryCode || '';
      if (documentConfig.mandatoryDocuments[country]) {
        setMandatoryDocuments(documentConfig.mandatoryDocuments[country][get(formValue, 'properties.propertyType')]);
      } else {
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
        else newDoc.set(folderName, [doc]);
      });
      const defDocs: DocumentTypePage[][] = [];
      const onlyFolderDocs = docs.filter((doc) => doc.folder && doc.folder !== 'NoFolder');
      const folderName = [...onlyFolderDocs.map((doc) => doc.folder || 'NoFolder')];
      setFoldersList([...new Set(folderName)].sort());
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of newDoc) {
        if (key ==='NoFolder') defDocs.unshift(value);
        else defDocs.push(value);
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
    } else {
      setIsNewFolder(false);
    }
    if (isSmallLoading.saveData) handleSpinnerSmall({saveData: false})
    if (isSmallLoading.editDocument) handleSpinnerSmall({editDocument: false})
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
  }

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
    } else if (propID) {
      handleSpinnerSmall({uploadMedia: true});
      multiUpload(acceptedFiles, 'pageDocument', {pageID: propID, companyID: activeSingleCompany.id}, {type: 'Generic'})
        .then(() => {
          updatePage();
        })
    }
  }, [formValue, loggedInUser]);

  const loadFile = async (e, type = '', key: number) => {
    if (e) e.preventDefault();
    if (propID) {
      const inputDocs = document.getElementById(`documentInput${key}`) as HTMLInputElement;
      const acceptedFiles = values(inputDocs ? inputDocs.files : '');
      handleSpinnerSmall({uploadMedia: true});
      multiUpload(acceptedFiles, 'pageDocument', {pageID: propID, companyID: activeSingleCompany.id}, {type})
        .then(() => {
          updatePage();
        })
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
    if (e) e.preventDefault();
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
    if (e) e.preventDefault();
    if (activeSingleProperty.documents) {
      const currentDoc = activeSingleProperty.documents.find(doc => doc.id === id);
      if (currentDoc) window.open(currentDoc.loadUrl.replace(/&amp;/g, '&'), '_blank');
    }
  };

  const manageDocument = (e, id, type = 'docs') => {
    if (e) e.preventDefault();
    setDocumentOptionsOpen({
      id: '',
      active: false,
    });
    const path = get(history, 'location.pathname', '').replace(/\/$/, '');
    if (type === 'folder') {
      history.push(`${path}/${id}/addToFolder`);
    } else {
      history.push(`${path}/${id}/editDocument`);
    }
  };

  const countMandatoryDocuments = () => {
    let count = 0;
    if (documents) {
      documents.forEach((doc) => {
        mandatoryDocuments.forEach((el) => {
          if (el === doc.type) count += 1;
        });
      });
    }
    return count;
  };

  const mandatoryDocumentExists = (el) => {
    let result = false;
    if (documents) {
      documents.forEach((doc) => {
        if (el === doc.type) result = true;
      });
    }
    return result;
  };

  const getTxtColor = () => {
    if (countMandatoryDocuments() === mandatoryDocuments.length) return 'txtGreen700';
    if (countMandatoryDocuments() === 0) return 'txtRed400';
    return 'txtYellow400';
  };

  const saveDraggedDocuments = (doc) => {
    if (documents && !isNewFolder && !isMovingFolder && mouseDown <=0 && docIsChange) {
      const docFullList: DocumentType[] = [];
      const idsOrderDocs: string[] = [];
      folderDocsFile.forEach((folderDC) => {
        idsOrderDocs.push(...folderDC.map((subDC) => subDC.id));
        const folderName = folderDC[0]?.folder || 'NoFolder';
        if (doc[folderName]) {
          doc[folderName].forEach((newList) => {
            const findIndexDoc = idsOrderDocs.findIndex((dc) => dc === newList.id);
            if (findIndexDoc > -1) idsOrderDocs.splice(findIndexDoc, 1);
            idsOrderDocs.push(newList.id);
          })
        }
      })
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
          const docSel: DocumentTypePage = newDoc;
          docSel.folder = newDoc.folder;
          delete docSel.loadUrl;
          delete docSel.url;
          delete docSel.user;
          const bodySingleDoc = {
            pageID: propID,
            body: docSel,
            smallLoader: 'editDocument',
            documentIds: idsOrderDocs,
          }
          handleUpdateDocument(bodySingleDoc);
          if (isToSave) isToSave = false;
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
        return ({...dc, folder: list})
      });
      const originalDocByList = documents.filter((dc) => dc.folder === list);
      let saveData = false;
      newListDoc.forEach((key, id) => {
        if (originalDocByList[id]?.id !== key?.id) {
          saveData = true;
        }
      })
      if (!isNewFolder && saveData) setDocsList((prev) => ({...prev, [list]: newListDoc}));
    }
  }

  const moveFolder = (folder) => {
    if (folder.every(i => typeof i === 'string') && documents) {
      const newOrderDocs = {
        NoFolder: documents.filter((dc) => !dc.folder || dc.folder === 'NoFolder'),
      };
      folder.forEach((list) => {
        newOrderDocs[list] = documents.filter((dc) => dc.folder === list);
      })
      setDocsList(newOrderDocs);
    }
  };

  useEffect(() => {
    if (!isNewFolder && mouseDown <=0 && docIsChange) {
      saveDraggedDocuments(docsList);
    }
  }, [docsList]);

  const onExpandFolder = (e, i: number) => {
    if (e) e.preventDefault();
    const clone: number[] = cloneDeep(showFullFolder);
    if (index(i) === -1) {
      clone.push(i);
    } else if (index(i) !== -1) {
      clone.splice(index(i), 1);
    }
    setShowFullFolder(clone);
  };

  const filterDocsByFolder = (docs, folderName) => {
    if (!folderName || folderName === 'NoFolder') {
      return docs.filter((dc) => dc[0] && (dc[0].folder === 'NoFolder' || !dc[0].folder));
    }
    return docs.filter((dc) => dc[0] && dc[0].folder !== 'NoFolder'&& dc[0].folder !== '');
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

  return (
    <>
      {
        !isReady ? (
          <>
            <div className="max-w-fix-768">
              <p className="h-fix-32 mb-3 skeletonBg w-fix-56"> </p>
              <p className="h-fix-32 mb-3 skeletonBg w-perc-50"> </p>
              <div className="w-perc-100 mt-3 brdRadius skeletonBg h-fix-72"/>
              <div className="w-perc-100 mt-1 brdRadius skeletonBg h-fix-72"/>
              <div className="w-perc-100 mt-1 brdRadius skeletonBg h-fix-72"/>
              <div className="w-perc-100 mt-1 brdRadius skeletonBg h-fix-72"/>
              <div className="w-perc-100 mt-5 brdRadius skeletonBg h-fix-400"/>
            </div>
          </>
        ) : (
          <div className="h-perc-lg-100 py-5">
            <h3 className="mb-3 hide dis-b-lg">{translateTo('Docubox', lang)}</h3>
            {
              !isBuyer && has(formValue, 'location') && (
                <>
                  {
                    mandatoryDocuments && (
                      <div className="mandatory-documents mb-5">
                        <p className={`fweight-500 fsize-500 ${getTxtColor()} mb-4`}>
                          <span>{translateTo('You have uploaded', lang)}</span>
                          <span> {countMandatoryDocuments()} </span>
                          <span>{translateTo('of', lang)}</span>
                          <span> {mandatoryDocuments.length} </span>
                          <span>{translateTo('documents.', lang)}</span>
                        </p>
                        {
                          mandatoryDocuments.map((element, j) => (
                            <div className="dis-fl-col max-w-perc-100 max-w-fix-768" key={`mndDoc_${j.toString()}`}>
                              <div className="dis-fl-row a-c jc-b py-2 pl-2">
                                <div className="dis-fl-row a-c">
                                  {
                                    mandatoryDocumentExists(element) !== false && (
                                      <BrixelIcon
                                        icon="check-small-fill"
                                        color="green"
                                        className="mr-3"
                                      />
                                    )
                                  }
                                  {
                                    mandatoryDocumentExists(element) === false && (
                                      <BrixelIcon
                                        icon="document"
                                        className="mr-3"
                                      />
                                    )
                                  }
                                  {
                                    mandatoryDocumentExists(element) !== false && (
                                      <span className="txtText700 dont-break-out">
                                        {translateTo(element, lang)}
                                      </span>
                                    )
                                  }
                                  {
                                    mandatoryDocumentExists(element) === false && (
                                      <span className="txtText700 dont-break-out">
                                        {translateTo(element, lang)}
                                      </span>
                                    )
                                  }
                                </div>
                                {
                                  mandatoryDocumentExists(element) === false && (
                                    <div className="upload-wrapper cur-poi pl-2 pos-r">
                                      <BrixelButtonSecondary
                                        rounded
                                        theme="green"
                                        label={translateTo('Upload', lang)}
                                      />
                                      <input
                                        accept="application/pdf, image/png, image/jpeg"
                                        multiple
                                        className="cur-poi upload"
                                        type="file"
                                        name="document"
                                        id={`documentInput${j}`}
                                        onChange={(e) => loadFile(e, element, j)}
                                      />
                                    </div>
                                  )
                                }
                              </div>
                              <hr className="brdText100" />
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                </>
              )
            }
            <div className={`boxCard docubox ${(!documents || (documents && documents.length === 0)) ? 'emptyMedia' : ''} cardSecondLevel max-w-perc-100 max-w-fix-768`}>
              <div className="dis-fl-col uploadPanel a-c">
                {
                  (documents && documents.length !== 0) && (
                    <>
                      <div className="dis-f jc-b w-perc-100">
                        <div className="docubox-info mb-3 dis-fl-col a-c as-fs">
                          <h5 className="as-fs fSizePx20 fweight-600">{translateTo('Drag to move and reorder documents', lang)}</h5>
                          <span className="as-fs txtText600 fsize-300">{translateTo('The order will be the same as seen on your Brixel Page.', lang)}</span>
                        </div>
                      </div>
                    </>
                  )
                }
                <div
                  className={`${(!folderDocsFile || (folderDocsFile.length === 0)) ? 'emptyState my-3 my-sm-5' : 'hasImages py-2 py-lg-4'} upload-container dis-fl-col a-c ta-c w-perc-100 ${!folderDocsFile || (folderDocsFile.length === 0) ? '' : 'bgGreen50'}`}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />

                  <div>

                    {
                      isSmallLoading.uploadMedia ? (
                        <>
                          <div  className={`${(!folderDocsFile || (folderDocsFile.length === 0)) ? 'h-fix-120' : 'h-fix-64'}  ml-a mr-a`}>
                            <div className='loaderX ml-a mr-a'>
                              <div className='loader-wheel'></div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            loading="lazy"
                            className={`${(!folderDocsFile || (folderDocsFile.length === 0)) ? 'h-fix-120' : 'h-fix-64'}  ml-a mr-a`}
                            src={uploadDocumentsEmpty} alt="Empty Documents" />
                        </>
                      )
                    }
                    <p className="mt-2 dis-b txtGreen400">
                      {
                        (!folderDocsFile || (folderDocsFile.length === 0)) ? (
                          <>
                            <span className="td-u fweight-500 cur-poi">{translateTo('Click to upload', lang)}</span> <span>{translateTo('your first document or drag and drop.', lang)}</span>
                          </>
                        ) : (
                          <>
                            <span className='td-u fweight-600 cur-poi'>
                              {translateTo('Click to upload files', lang)}
                            </span>
                            <span className="ml-small-4">
                              {translateTo('or drag and drop.', lang)}
                            </span>
                          </>
                        )
                      }
                    </p>
                  </div>
                  {
                    (!folderDocsFile || (folderDocsFile.length === 0)) && (
                      <span className="brdSmallTop brdText100 w-fix-104 my-2"></span>
                    )
                  }

                  <span className="body2 txtText600">{translateTo('Choose .pdf .jpg .png with max. 40 MB size', lang)}</span>
                </div>
                {
                  folderDocsFile.length > 0 && (
                    <>
                      <div className="documents-container w-perc-100 dis-fl-col mt-3">
                        <div
                          className="folder-list pos-r"
                        >
                          <span className="fsize-300 fweight-600 dis-b mb-2">Files</span>
                          <ReactSortable
                            handle=".folderHandle"
                            group="groupName"
                            removeCloneOnHide={false}
                            list={[]}
                            setList={() => ''}
                          >
                            {
                              filterDocsByFolder(folderDocsFile, 'NoFolder').length === 0 ? (
                                <ReactSortable
                                  handle=".docsHandle"
                                  delay={2}
                                  group="groupName"
                                  removeCloneOnHide={false}
                                  list={[]}
                                  setList={(docs) => dragDocuments(docs, 'NoFolder')}
                                  onStart={() => setIsMovingFolder(true)}
                                  onEnd={() => setIsMovingFolder(false)}
                                >
                                  <div className="brdSmall brdText100 dis-fl-col py-3 a-c mb-2 brdRadius fsize-300 txtText400">
                                    {translateTo('Drag and drop single files here', lang)}
                                  </div>
                                </ReactSortable>
                              ) : (
                                filterDocsByFolder(folderDocsFile, 'NoFolder').map((docList, i) => (
                                  <div
                                    className='noFolderWrapper brdSmall brdText100 dis-fl-col py-1 px-sm-2 px-1 mb-2 brdRadius'
                                    key={`noFolder${docList.id}`}
                                  >
                                    <ReactSortable
                                      key={`prcDcc_${i.toString()}`}
                                      handle=".docsHandle"
                                      removeCloneOnHide={false}
                                      delay={2}
                                      group="groupName"
                                      // @ts-ignore
                                      list={cloneDeep(docList)}
                                      className=""
                                      setList={(docs) => dragDocuments(docs, 'NoFolder')}
                                      onStart={() => setIsMovingFolder(true)}
                                      onEnd={() => setIsMovingFolder(false)}
                                    >
                                      {
                                        docList.map((doc, f) => (
                                          <div
                                            data-id={doc.id}
                                            id={`nofolderDocs${doc.id}`}
                                            key={`folderDoc${doc.id}-${f.toString()}`}
                                            className="single-document dis-fl-row a-c jc-b py-1 pr-0 pl-0 pl-sm-1"
                                          >
                                            <div className="name dis-fl-row a-c pr-1 pr-sm-0">
                                              <div className="icon-container brdRadius dis-f w-fix-24 h-fix-40 jc-c a-c mr-1">
                                                <div className="w-fix-16">
                                                  <img
                                                    alt="Drag Icon"
                                                    width={18}
                                                    className='cur-grab docsHandle'
                                                    src={dragIcon}
                                                  />
                                                </div>
                                              </div>
                                              <div className="dis-fl-col docDetails cur-poi" onClick={(e) => openDocument(e, doc.id)}>
                                                <span className="document-title fweight-500 fsize-400 txtText900">{doc.name}</span>
                                                <span className="body2 txtGreen400 dont-break-out">
                                                  {translateTo(doc.type || '', lang)}
                                                </span>
                                                {doc.id}
                                                {
                                                  doc?.createdAt ? (
                                                    <span className="date fsize-200 txtText400 pt-small-4">
                                                      {
                                                        !isNaN(+doc.createdAt) ? (
                                                          <>{DateTime.fromMillis(doc.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm')}</>
                                                        ) : (
                                                          <>{DateTime.fromISO(doc.createdAt.toString(), { locale: lang }).toFormat('dd LLL yyyy, H:mm')}</>
                                                        )
                                                      }
                                                    </span>
                                                  ) : (
                                                    <span className="date fsize-200 txtText200">-</span>
                                                  )
                                                }
                                              </div>
                                            </div>

                                            <div className="pos-r dis-fl-row a-c">
                                              <BrixelTooltip
                                                description={`${translateTo('This document is set to', lang)} ${translateTo(`${doc.isPrivate === true ? 'private' : 'public'}`, lang)}. ${translateTo('Edit to change.', lang)}`}
                                                width="200"
                                                theme='blue'
                                                iconColor={`${doc.isPrivate === true ? 'red' : 'green'}`}
                                                icon={`${doc.isPrivate === true ? 'locked' : 'eye'}`}
                                                className="mr-0"
                                              />
                                              <BrixelButtonIcon
                                                ghost
                                                theme="text"
                                                themeSat={600}
                                                icon="options-vertical"
                                                onClick={() => {
                                                  setDocumentOptionsOpen({
                                                    id: doc.id,
                                                    active: !documentOptionsOpen.active,
                                                  });
                                                  setDocumentId(i);
                                                }}
                                              />
                                              {
                                                (documentOptionsOpen.id === doc.id && documentOptionsOpen.active) && (
                                                  <>
                                                    <BrixelDropdownMini
                                                      topOffset={50}
                                                      rightAligned
                                                      links={[
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
                                                      ]}
                                                    />
                                                  </>
                                                )
                                              }
                                            </div>
                                          </div>
                                        ))
                                      }
                                    </ReactSortable>
                                  </div>
                                ))
                              )
                            }
                            <>
                              <span className="fsize-300 fweight-600 dis-b pt-1 mb-2">Folders</span>
                              {
                                filterDocsByFolder(folderDocsFile, 'folder').length > 0 ? (
                                  <ReactSortable
                                    handle=".folderHandle"
                                    group="groupName"
                                    removeCloneOnHide={false}
                                    // @ts-ignore
                                    list={foldersList}
                                    setList={(doc) => moveFolder(doc)}
                                    onStart={() => setIsMovingFolder(true)}
                                    onEnd={() => setIsMovingFolder(false)}
                                  >
                                    {
                                      foldersList.map((docList, i) => (
                                        <div key={`folder${i.toString()}`}>
                                          <div
                                            className="document-folder brdSmall brdText100 dis-fl-col mb-2 brdRadius"
                                            key={`prcDcc_${i.toString()}`}
                                          >
                                            <div className={`dis-fl-row jc-b a-c p-1 ${(index(i) !== -1) ? 'brdSmallBottom brdText100' : ''}`}>
                                              <div
                                                className="dis-fl-row a-c p-1 flex-1"
                                                onClick={(e) => onExpandFolder(e, i)}
                                              >
                                                {/* TODO renable after fix the function on line 357 */}
                                                {/*<img width={18} className="cur-grab folderHandle" src={dragIcon} />*/}
                                                <BrixelIcon
                                                  icon="folder"
                                                  color="green"
                                                  saturationTxt={400}
                                                  saturation={100}
                                                  background="green"
                                                  className="mx-1"
                                                  isLoading={isSmallLoading.deleteMedia}
                                                />
                                                <h6 className="fweight-600">{docList}</h6>
                                              </div>
                                              <BrixelButtonIcon
                                                ghost
                                                theme="text"
                                                icon={`${(index(i) !== -1) ? 'arrow-simple-up' : 'arrow-simple-down'}`}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  const clone = cloneDeep(showFullFolder);
                                                  if (index(i) === -1) {
                                                    clone.push(i);
                                                  } else if (index(i) !== -1) {
                                                    clone.splice(index(i), 1);
                                                  }
                                                  setShowFullFolder(clone);
                                                }}
                                              />
                                            </div>

                                            <ReactSortable
                                              className={(index(i) !== -1 || isMovingFolder) ? 'mt-1 pt-0 px-2' : ''}
                                              handle=".docsHandle"
                                              delay={2}
                                              group="groupName"
                                              removeCloneOnHide={false}
                                              list={cloneDeep(documents?.filter((dc) => dc.folder === 'docList')) || []}
                                              setList={(docs) => dragDocuments(docs, docList)}
                                              onStart={() => setIsMovingFolder(true)}
                                              onEnd={() => setIsMovingFolder(false)}
                                            >
                                              {
                                                (index(i) !== -1 || isMovingFolder) && documents?.filter((dc) => dc.folder === docList).map((doc) => (
                                                  <div
                                                    key={doc.id}
                                                    className="single-document dis-fl-row a-c jc-b py-1"
                                                  >
                                                    <div
                                                      className="name w-fix-184 w-fix-lg-352 dis-fl-row a-c pr-1 pr-sm-0">
                                                      <div
                                                        className="icon-container brdRadius dis-f w-fix-24 h-fix-40 jc-c a-c mr-1">
                                                        <img width={18} className="cur-grab docsHandle"
                                                          src={dragIcon} />
                                                      </div>
                                                      <div className="dis-fl-col docDetails cur-poi"
                                                        onClick={(e) => openDocument(e, doc.id)}>
                                                        <span
                                                          className="document-title max-w-fix-168 max-w-perc-lg-100 fweight-500 dont-break-out">{doc.name}</span>
                                                        {doc.id}
                                                        <span
                                                          className="body2 txtGreen400 dont-break-out">{doc.type}</span>
                                                        {
                                                          doc?.createdAt ? (
                                                            <span className="date fsize-200 txtText400 pt-small-4">
                                                              {
                                                                !isNaN(+doc.createdAt) ? (
                                                                  <>{DateTime.fromMillis(doc.createdAt, {locale: lang}).toFormat('dd LLL yyyy, H:mm')}</>
                                                                ) : (
                                                                  <>{DateTime.fromISO(doc.createdAt.toString(), {locale: lang}).toFormat('dd LLL yyyy, H:mm')}</>
                                                                )
                                                              }
                                                            </span>
                                                          ) : (
                                                            <span
                                                              className="date fsize-200 txtText400 pt-small-4">-</span>
                                                          )
                                                        }
                                                      </div>
                                                    </div>

                                                    <div className="pos-r dis-fl-row a-c">

                                                      <BrixelTooltip
                                                        className="mr-0"
                                                        theme="blue"
                                                        description={`${translateTo('This document is set to', lang)} ${translateTo(`${doc.isPrivate === true ? 'private' : 'public'}`, lang)}. ${translateTo('Edit to change.', lang)}`}
                                                        width="200"
                                                        iconColor={`${doc.isPrivate === true ? 'red' : 'green'}`}
                                                        icon={`${doc.isPrivate === true ? 'locked' : 'eye'}`}
                                                      />

                                                      <BrixelButtonIcon
                                                        ghost
                                                        theme="text"
                                                        themeSat={600}
                                                        icon="options-vertical"
                                                        onClick={() => {
                                                          setDocumentOptionsOpen({
                                                            id: doc.id,
                                                            active: !documentOptionsOpen.active,
                                                          });
                                                          setDocumentId(i);
                                                        }}
                                                      />
                                                      {
                                                        (documentOptionsOpen.id === doc.id && documentOptionsOpen.active) && (
                                                          <>
                                                            <BrixelDropdownMini
                                                              topOffset={50}
                                                              rightAligned
                                                              links={dropdownActionDoc(doc)}
                                                            />
                                                          </>
                                                        )
                                                      }
                                                    </div>
                                                  </div>
                                                ))
                                              }
                                            </ReactSortable>
                                          </div>
                                        </div>
                                      ))
                                    }
                                  </ReactSortable>
                                ) : (
                                  <div className="brdSmall brdText100 dis-fl-col p-1 mb-2 brdRadius">
                                    <ReactSortable
                                      handle=".docsHandle"
                                      delay={2}
                                      group="groupName"
                                      list={[]}
                                      className={(index(0) !== -1 || isMovingFolder) ? 'mt-1 pt-0 px-1 px-sm-2' : ''}
                                      setList={(order) => {
                                        if(get(order, '[0].id', null)) {
                                          history.push(`/${activeSingleProperty.id}/property/docubox/${get(order, '[0].id', null)}/addToFolder`);
                                          setIsNewFolder(true);
                                        }
                                      }}
                                      onStart={() => setIsMovingFolder(true)}
                                      onEnd={() => setIsMovingFolder(false)}
                                    >
                                      <div className="dis-fl-col py-3 a-c brdRadius txtText400 fsize-300 max-w-fix-304 ta-c ml-a mr-a">
                                        To keep things organized, drag and drop file to create a folder.
                                      </div>
                                    </ReactSortable>
                                  </div>
                                )
                              }
                            </>
                          </ReactSortable>
                        </div>
                      </div>
                    </>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'property.activeSingleCompany', { }),
  activeSingleProperty: get(state, 'property.activeSingleProperty', { }),
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
