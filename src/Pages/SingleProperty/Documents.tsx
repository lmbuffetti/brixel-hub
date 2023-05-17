import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  BrixelButtonIcon,
  BrixelButtonSecondary,
  BrixelDropdownMini,
  BrixelIcon,
  BrixelTooltip,
  useOutsideAlerter,
  Helpers,
} from '@brixel/brixel-components';
import documentConfig from '@brixel/brixel-components/dist/configuration/DocumentsConfig';
import {change} from '@brixel/brixel-components/dist/form';
import {diff} from 'deep-object-diff';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import has from 'lodash/has';
import isNaN from 'lodash/isNaN';
import values from 'lodash/values';
import {DateTime} from 'luxon';
import {useDropzone} from 'react-dropzone';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {ReactSortable} from 'react-sortablejs';
import {bindActionCreators, compose} from 'redux';
import {saveActiveSingleProperty} from '../../actions/PropertyActions';
import {deleteDocument, multiUploadDocument, uploadDocument} from '../../actions/UploadActions';
import buyerDocumentsEmpty from '../../images/Media/buyer_docuboxEmpty.svg';
import uploadDocumentsEmpty from '../../images/Upload/upload_documents_empty.svg';
import dragIcon from '../../images/Upload/drag-icon.svg';
import {tobase64Handler} from '../../utils/helpers';
import translateTo from '../../utils/translation';
import {DocumentType} from '@brixel/brixel-components/dist/@types/Model';
import type {DocumentsPageType, DocumentTypePage} from '../../@types/Pages/SingleProperty/Documents';
import { setNotification } from '../../actions/CommonActions';

const Documents = (props: DocumentsPageType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleDeleteDocument,
    handleMultiUploadDocument,
    handleSaveActiveSingleProperty,
    isBuyer = false,
    isSmallLoading,
    lang,
    loggedInUser,
    userType,
    handleSetScreenNotification,
  } = props;
  const [documentOptionsOpen, setDocumentOptionsOpen] = useState<{id?: string | null, active: boolean}>({ id: null, active: false });
  const [folderOptionsOpen, setFolderOptionsOpen] = useState<{id?: string | null, active: boolean}>({ id: null, active: false });
  const [documentId, setDocumentId] = useState(0);
  const [processedDocuments, setProcessedDocuments] = useState<DocumentTypePage[][]>([]);
  const [showFullFolder, setShowFullFolder] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
  const [isMovingFolder, setIsMovingFolder] = useState(false);

  const { documents } = formValue;

  useEffect(() => {
    setTimeout(() => {setIsReady(true)}, 200);
  }, []);


  useEffect(() => {
    if (has(formValue, 'location.countryCode')) {
      if (documentConfig.mandatoryDocuments[get(formValue, 'location.countryCode', '')]) {
        setMandatoryDocuments(documentConfig.mandatoryDocuments[get(formValue, 'location.countryCode', '')][get(formValue, 'properties.propertyType')]);
      } else {
        setMandatoryDocuments(documentConfig.mandatoryDocuments.EN[get(formValue, 'properties.propertyType', '')]);
      }
    }
  }, [formValue]);

  useEffect(() => {
    let docs = documents || [];
    if (userType === 'buyer') docs = docs.filter((item) => !item.isPrivate);
    if (docs.length > 0) {
      const newDoc = new Map();
      docs.forEach((doc) => {
        const folderName = doc.folder || '';
        if (newDoc.get(folderName)) {
          const activeDoc = newDoc.get(folderName);
          activeDoc.push(doc);
          newDoc.set(folderName, activeDoc);
        }
        else newDoc.set(folderName, [doc]);
      })
      const defDocs: DocumentTypePage[][] = [];
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of newDoc) {
        if (key ==='NoFolder' || key === '') defDocs.unshift(value);
        else defDocs.push(value);
      }
      setProcessedDocuments(defDocs);
    }
    if (documents && documents.length === 0) setProcessedDocuments([]);
  }, [documents && documents.length, documents]);

  const manageDocument = (e, id, type = 'docs') => {
    if (e) e.preventDefault();
    setDocumentOptionsOpen({
      id: null,
      active: false,
    });
    setFolderOptionsOpen({
      id: null,
      active: false,
    });
    const path = get(history, 'location.pathname', '').replace(/\/$/, '');
    if (type === 'folder') {
      history.push(`${path}/${id}/addToFolder`);
    } else {
      history.push(`${path}/${id}/editDocument`);
    }
  };

  const openDocument = (e, id) => {
    if (e) e.preventDefault();
    Helpers.openDocument(id);
    // window.open(`${getConfigEnv.shortPath}/document/${id}`, '_blank');
  };

  const index = (key) => findIndex(showFullFolder, (el) => el === key);

  // URL PARAMS
  const propID = get(match, 'propID', null);

  // REF
  const documentRef = useRef(null);
  const folderRef = useRef(null);

  useEffect(() => {
    if (!isSmallLoading.uploadMedia) {
      setDocumentOptionsOpen({ id: null, active: false });
      setFolderOptionsOpen({ id: null, active: false });
    }
  }, [isSmallLoading]);

  // MULTIUPLOADING FUNCTION
  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            handleSetScreenNotification({
              state: true,
              type: 'alert',
              label: translateTo('One or more file(s) is(are) bigger than 10MB', lang),
            });
          }
          if (err.code === 'file-invalid-type') {
            handleSetScreenNotification({
              state: true,
              type: 'alert',
              label: translateTo('One or more files has(have) an invalid format', lang),
            });
          }
        });
      });
    } else {
      const reader = new FileReader();
      // const imgType = imageType.find((val) => val.name === 'Gallery');
      // eslint-disable-next-line no-console
      reader.onabort = () => console.log('file reading was aborted');
      // eslint-disable-next-line no-console
      reader.onerror = () => console.log('file reading has failed');
      const imgList = tobase64Handler(acceptedFiles, get(loggedInUser, 'id'), 'documents', formValue.id);
      imgList.then((res) => {
        handleMultiUploadDocument({
          docs: activeSingleProperty.documents,
          allImgs: res,
          actions: 'documents',
          pageID: formValue.id || propID,
          smallLoader: 'uploadMedia',
        });
      });
    }
  }, [formValue, loggedInUser]);

  const loadFile = async (e, type = '', key: number) => {
    if (e) e.preventDefault();
    const inputDocs = document.getElementById(`documentInput${key}`) as HTMLInputElement;
    const acceptedFiles = values(inputDocs ? inputDocs.files : '');
    const reader = new FileReader();
    // eslint-disable-next-line no-console
    reader.onabort = () => console.log('file reading was aborted');
    // eslint-disable-next-line no-console
    reader.onerror = () => console.log('file reading has failed');
    const imgList = tobase64Handler(acceptedFiles, get(loggedInUser, 'id'), 'documents', formValue.id, '', type);
    imgList.then((res) => {
      handleMultiUploadDocument({
        docs: activeSingleProperty.documents,
        allImgs: res,
        actions: 'documents',
        pageID: formValue.id,
        smallLoader: 'uploadMedia',
      });
    });
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
    maxSize: 1e+7,
  });

  // REMOVE DOCUMENTS
  const deleteDocs = (e, idDocs) => {
    if (e) e.preventDefault();
    setDocumentOptionsOpen({ id: null, active: false });
    setFolderOptionsOpen({ id: null, active: false });
    const data = {
      id: idDocs,
      pageID: formValue.id,
      smallLoader: 'deleteMedia',
    };
    handleDeleteDocument(data);
  };

  const countMandatoryDocuments = () => {
    let count = 0;
    if (documents) {
      documents.forEach((doc) => {
        mandatoryDocuments.forEach((el) => {
          if (el === doc.type) count += 1;
        });
      });
      return count;
    }
  };

  const mandatoryDocumentExists = (el) => {
    let result = false;
    if (documents) {
      documents.forEach((doc) => {
        if (el === doc.type) result = true;
      });
      return result;
    }
  };

  const getTxtColor = () => {
    if (countMandatoryDocuments() === mandatoryDocuments.length) return 'txtGreen700';
    if (countMandatoryDocuments() === 0) return 'txtRed400';
    return 'txtYellow400';
  }

  const dragDocuments = (doc, _id, list) => {
    if (list && list !== 'NoFolder') {
      if (list === 'folderList') {
        if (doc.length === processedDocuments.length) setProcessedDocuments(doc);
      } else if (list) {
        setProcessedDocuments((prevState) => {
          const newDoc: DocumentType[][] = [...prevState];
          const folderID = prevState.findIndex((dc) => get(dc[0], 'folder') === list);
          const updateDoc = doc.map((dc) => ({ ...dc, folder: list }));
          delete updateDoc.chosen;
          delete updateDoc.selected;
          if (folderID >= 0) {
            newDoc[folderID] = [
              ...updateDoc,
            ];
          }
          return [
            ...newDoc,
          ];
        });
      }
    } else if (list && list === 'NoFolder') {
      setProcessedDocuments((prevState) => {
        const newDoc: DocumentType[][] = [...prevState];
        const folderID = prevState.findIndex((dc) => get(dc[0], 'folder') === list);
        const updateDoc = doc.map((dc) => ({ ...dc, folder: list }));
        delete updateDoc.chosen;
        delete updateDoc.selected;
        if (folderID >= 0) {
          newDoc[folderID] = [
            ...updateDoc,
          ];
        }
        if (list === 'NoFolder' && folderID === -1 && doc.length > 0) {
          newDoc[0] = [
            ...updateDoc,
          ];
        }
        return [
          ...newDoc,
        ];
      });
    }
  };

  useEffect(() => {
    if (Object.keys(processedDocuments).length > 0) {
      const docsToSave: DocumentType[] = [];
      processedDocuments.forEach((docs) => {
        docs.forEach((doc) => {
          const singleDoc = { ...doc };
          delete singleDoc.chosen;
          delete singleDoc.selected;
          docsToSave.push({
            ...singleDoc,
          });
        });
      });
      if (documents) {
        const diffData = diff(documents, docsToSave);
        if (Object.keys(diffData).length > 0) {
          changeFieldValue('documents', docsToSave);
          const dataToSave = {
            id: propID,
            smallLoader: 'saveData',
            documents: docsToSave,
          }
          handleSaveActiveSingleProperty(dataToSave);
        }
      }
    }
  }, [processedDocuments]);

  const onExpandFolder = (e, i: number) => {
    if (e) e.preventDefault();
    const clone: number[] = cloneDeep(showFullFolder);
    if (index(i) === -1) {
      clone.push(i);
    } else if (index(i) !== -1) {
      clone.splice(index(i), 1);
    }
    setShowFullFolder(clone);
  }

  const filterDocsByFodler = (_docs, folderName) => {
    if (!folderName || folderName === 'NoFolder') {
      return processedDocuments.filter((dc) => dc[0] && (dc[0].folder === 'NoFolder' || !dc[0].folder))
    }
    return processedDocuments.filter((dc) => dc[0] && dc[0].folder !== 'NoFolder'&& dc[0].folder !== '');
  }

  const dropdownActionDoc = (doc) => {
    if (userType !== 'buyer') {
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
      ]}
    return [
      {
        label: translateTo('View', lang),
        clickFunc: (e) => openDocument(e, doc.id),
      },
    ]
  }

  // Function to close the small menus when we click outside
  useOutsideAlerter(documentRef, {
    id: documentId,
    action: 'function',
    func: () => {
      setDocumentOptionsOpen({ id: null, active: false });
    },
  });
  useOutsideAlerter(folderRef, {
    id: documentId,
    action: 'function',
    func: () => {
      setFolderOptionsOpen({ id: null, active: false });
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
              <div className='w-perc-100 mt-3 brdRadius skeletonBg h-fix-72'/>
              <div className='w-perc-100 mt-1 brdRadius skeletonBg h-fix-72'/>
              <div className='w-perc-100 mt-1 brdRadius skeletonBg h-fix-72'/>
              <div className='w-perc-100 mt-1 brdRadius skeletonBg h-fix-72'/>
              <div className='w-perc-100 mt-5 brdRadius skeletonBg h-fix-400'/>
            </div>
          </>
        ) : (
          <div className={`h-perc-lg-100 ${isBuyer ? 'secondLevel' : ''}`}>
            <h3 className="mb-3 hide dis-b-lg">
              {translateTo('Docubox', lang)}
            </h3>
            {
              isBuyer && (
                <div className="pos-r hide-lg">
                  <div className="dis-f backPanel">
                    <h5 className="sectionTitle">
                      {translateTo('Docubox', lang)}
                    </h5>
                  </div>
                </div>
              )
            }
            {
              has(formValue, 'location') && userType === 'seller' && (
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
                                      <span className="txtDark700 dont-break-out">
                                        {translateTo(element, lang)}
                                      </span>
                                    )
                                  }
                                  {
                                    mandatoryDocumentExists(element) === false && (
                                      <span className="txtDark700 dont-break-out">
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
                              <hr className="lighter" />
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                </>
              )
            }
            <div className={`boxCard ${(!documents || (documents && documents.length === 0)) ? 'emptyMedia' : ''} docubox cardSecondLevel max-w-perc-100 max-w-fix-768`}>
              <div className="dis-fl-col uploadPanel a-c">
                {
                  processedDocuments && processedDocuments.length < 1 && userType === 'buyer' && (
                    <div className="pt-5">
                      <img
                        loading="lazy"
                        className="h-fix-120"
                        src={buyerDocumentsEmpty}
                        alt="Empty Documents"
                      />
                      <h5 className="mt-3 mb-2 ta-c">
                        {translateTo('No documents available.', lang)}
                      </h5>
                      <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 mb-5">
                        {translateTo('Please contact the seller for further documents about this property.', lang)}
                      </p>
                    </div>
                  )
                }
                {
                  userType === 'seller' && (
                    <>
                      {
                        (documents && documents.length !== 0) && (
                          <div className="docubox-info mb-3 dis-fl-col a-c as-fs">
                            <h5 className="as-fs fSizePx20 fweight-600">
                              {translateTo('Drag to move and reorder documents', lang)}
                            </h5>
                            <span className="as-fs txtDark200 fsize-300">
                              {translateTo('The order will be the same as seen on your Brixel Page.', lang)}
                            </span>
                          </div>
                        )
                      }
                      <div
                        className={`${(!processedDocuments || (processedDocuments.length === 0)) ? 'emptyState my-3 my-sm-5' : 'hasImages py-2 py-lg-3'} upload-container dis-fl-col a-c ta-c w-perc-100`}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />

                        <div>
                          <img
                            loading="lazy"
                            className={`${(!processedDocuments || (processedDocuments.length === 0)) ? 'h-fix-120' : 'h-fix-64' }  ml-a mr-a`}
                            src={uploadDocumentsEmpty}
                            alt="Empty Documents"
                          />
                          <p className="mt-2 dis-b w-fix-304 txtGreen400">
                            {
                              (!processedDocuments || (processedDocuments.length === 0)) ? (
                                <>
                                  <span className='td-u fweight-500 cur-poi'>
                                    {translateTo('Click to upload', lang)}
                                  </span>
                                  <span className="ml-small-4">
                                    {translateTo('your first document or drag and drop.', lang)}
                                  </span>
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
                          (!processedDocuments || (processedDocuments.length === 0)) && (
                            <span className='brdSmallTop brdAltGrey200 w-fix-104 my-2' />
                          )
                        }

                        <span className="body2 txtAltGrey400 max-w-fix-288">
                          {translateTo('Choose .pdf .jpg .png with max. 10 MB size', lang)}
                        </span>
                      </div>
                    </>
                  )
                }
                {
                  processedDocuments.length > 0 && (
                    <>
                      <div className="documents-container w-perc-100 dis-fl-col mt-3">
                        <div
                          className="folder-list pos-r"
                        >
                          <>
                            {
                              filterDocsByFodler(processedDocuments, 'NoFolder').length > 0 || !isBuyer && (
                                <span className='fsize-300 fweight-600 dis-b mb-2'>
                                  {translateTo('Files', lang)}
                                </span>
                              )
                            }
                            <ReactSortable
                              disabled={isBuyer}
                              handle=".folderHandle"
                              group="folder"
                              tag="div"
                              // @ts-ignore
                              list={cloneDeep(processedDocuments)}
                              setList={(newState) => dragDocuments(newState, 0, 'folderList')}
                            >
                              {
                                !isBuyer && filterDocsByFodler(processedDocuments, 'NoFolder').length === 0 ? (
                                  <ReactSortable
                                    disabled={isBuyer}
                                    handle=".docsHandle"
                                    delay={2}
                                    group="groupName"
                                    list={[]}
                                    className=""
                                    setList={(order) => dragDocuments(order, 0, 'NoFolder')}
                                    onStart={() => setIsMovingFolder(true)}
                                    onEnd={() => setIsMovingFolder(false)}
                                  >
                                    <div className="shadow-1dp dis-fl-col py-3 a-c mb-2 brdRadius txtAltGrey400">
                                      {translateTo('Drag and drop single files here', lang)}
                                    </div>
                                  </ReactSortable>
                                ) : (
                                  filterDocsByFodler(processedDocuments, 'NoFolder').map((docList, i) => (
                                    <div
                                      className='noFolderWrapper shadow-1dp dis-fl-col p-1 mb-2 brdRadius'
                                      key={`noFolderDoc${i.toString()}`}
                                      ref={documentRef}
                                    >
                                      <ReactSortable
                                        disabled={isBuyer}
                                        key={`prcDcc_${i.toString()}`}
                                        handle=".docsHandle"
                                        delayOnTouchStart={true}
                                        delay={2}
                                        group="groupName"
                                        // @ts-ignore
                                        list={cloneDeep(docList)}
                                        className=""
                                        setList={(order) => dragDocuments(order, i, 'NoFolder')}
                                        onStart={() => setIsMovingFolder(true)}
                                        onEnd={() => setIsMovingFolder(false)}
                                      >
                                        {
                                          docList.map((doc, k) => (
                                            <div
                                              id={`nofolderDocs${doc.id}`}
                                              key={`prcDocs_${k.toString()}`}
                                              className="single-document-folder dis-fl-row a-c jc-b p-1"
                                            >

                                              <div className="name dis-fl-row a-c pr-1 pr-sm-0">
                                                {
                                                  !isBuyer && (
                                                    <div className="icon-container brdRadius dis-f w-fix-24 h-fix-40 jc-c a-c ml-1 mr-1">
                                                      <img
                                                        alt="Drag Icon"
                                                        width={18}
                                                        className='cur-grab docsHandle'
                                                        src={dragIcon}
                                                      />
                                                    </div>
                                                  )
                                                }
                                                <div className="dis-fl-col docDetails cur-poi" onClick={(e) => openDocument(e, doc.id)}>
                                                  <span className="document-title fweight-500 fsize-400 txtDark700">{doc.name}</span>
                                                  <span className="body2 txtGreen400 dont-break-out">
                                                    {translateTo(doc.type || '', lang)}
                                                  </span>
                                                  {
                                                    doc?.createdAt ? (
                                                      <span className="date fsize-200 txtLight400 pt-small-4">
                                                        {
                                                          !isNaN(+doc.createdAt) ? (
                                                            <>{DateTime.fromMillis(doc.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm')}</>
                                                          ) : (
                                                            <>{DateTime.fromISO(doc.createdAt.toString(), { locale: lang }).toFormat('dd LLL yyyy, H:mm')}</>
                                                          )
                                                        }
                                                      </span>
                                                    ) : (
                                                      <span className="date fsize-200 txtDark200">-</span>
                                                    )
                                                  }
                                                </div>
                                              </div>

                                              <div className="pos-r dis-fl-row a-c">
                                                {
                                                  userType !== 'buyer' && (
                                                    <>
                                                      <BrixelTooltip
                                                        description={`${translateTo('This document is set to', lang)} ${translateTo(`${doc.isPrivate === true ? 'private' : 'public'}`, lang)}. ${translateTo('Edit to change.', lang)}`}
                                                        width="200"
                                                        iconColor={`${doc.isPrivate === true ? 'red' : 'green'}`}
                                                        icon={`${doc.isPrivate === true ? 'locked' : 'eye'}`}
                                                        className="mr-1"
                                                      />
                                                    </>
                                                  )
                                                }
                                                {
                                                  !isBuyer && (
                                                    <div>
                                                      <BrixelButtonIcon
                                                        bgTransparent
                                                        theme="black"
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
                                                              topOffset={40}
                                                              rightAligned
                                                              links={userType !== 'buyer' ?
                                                                [
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
                                                                ] : [
                                                                  {
                                                                    label: translateTo('View', lang),
                                                                    clickFunc: (e) => openDocument(e, doc.id),
                                                                  },
                                                                ]}
                                                            />
                                                          </>
                                                        )
                                                      }
                                                    </div>
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
                                {
                                  (!isBuyer || filterDocsByFodler(processedDocuments, 'folder').length > 0) && (
                                    <span className='fsize-300 fweight-600 dis-b pt-1 mb-2'>
                                      {translateTo('Folders', lang)}
                                    </span>
                                  )
                                }
                              </>
                              <>
                                {
                                  filterDocsByFodler(processedDocuments, 'folder').length > 0 ? (
                                    <>
                                      {
                                        filterDocsByFodler(processedDocuments, 'folder').map((docList, i) => (
                                          <div key={`folderDoc${i.toString()}`} ref={folderRef}>
                                            <div
                                              className="document-folder shadow-1dp dis-fl-col p-1 mb-2 brdRadius"
                                              key={`prcDcc_${i.toString()}`}
                                            >
                                              <div className="dis-fl-row jc-b a-c">
                                                <div
                                                  className={`dis-fl-row a-c p-1 ${(index(i) !== -1 || isMovingFolder) ? '' : ''}`}
                                                  onClick={(e) => onExpandFolder(e, i)}
                                                >
                                                  <img width={18} className='cur-grab docsHandle' src={dragIcon} />
                                                  <BrixelIcon
                                                    icon="folder"
                                                    color="green"
                                                    saturationTxt={400}
                                                    saturation={100}
                                                    background="green"
                                                    className="mx-1"
                                                    isLoading={isSmallLoading.deleteMedia}
                                                  />
                                                  <h6 className='fweight-600'>{docList[0].folder}</h6>
                                                </div>
                                                <BrixelButtonIcon
                                                  bgTransparent
                                                  className={`${(index(i) !== -1) ? '' : ''}`}
                                                  theme="black"
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
                                                disabled={isBuyer}
                                                handle=".docsHandle"
                                                delayOnTouchStart={true}
                                                delay={2}
                                                group="groupName"
                                                // @ts-ignore
                                                list={cloneDeep(docList)}
                                                className={(index(i) !== -1 || isMovingFolder) ? 'mt-1 pt-0' : ''}
                                                setList={(order) => dragDocuments(order, i, get(docList[0], 'folder', null))}
                                                onStart={() => setIsMovingFolder(true)}
                                                onEnd={() => setIsMovingFolder(false)}
                                              >
                                                {
                                                  (index(i) !== -1 || isMovingFolder) && docList.map((doc, k) => (
                                                    <li
                                                      key={`prcDocs_${k.toString()}`}
                                                      className="single-document pl-2 dis-fl-row a-c jc-b py-1"
                                                    >
                                                      <div className="name w-fix-184 w-fix-lg-352 dis-fl-row a-c pr-1 pr-sm-0">
                                                        {
                                                          !isBuyer && (
                                                            <div className="icon-container brdRadius dis-f w-fix-24 h-fix-40 jc-c a-c mr-1">
                                                              <img width={18} className='cur-grab docsHandle' src={dragIcon} />
                                                            </div>
                                                          )
                                                        }
                                                        <div className="dis-fl-col docDetails cur-poi" onClick={(e) => openDocument(e, doc.id)}>
                                                          <span className="document-title max-w-fix-168 max-w-perc-lg-100 fweight-500 dont-break-out">{doc.name}</span>
                                                          <span className="body2 txtGreen400 dont-break-out">{doc.type}</span>
                                                          {
                                                            doc?.createdAt ? (
                                                              <span className="date fsize-200 txtLight400 pt-small-4">
                                                                {
                                                                  !isNaN(+doc.createdAt) ? (
                                                                    <>{DateTime.fromMillis(doc.createdAt, { locale: lang }).toFormat('dd LLL yyyy, H:mm')}</>
                                                                  ) : (
                                                                    <>{DateTime.fromISO(doc.createdAt.toString(), { locale: lang }).toFormat('dd LLL yyyy, H:mm')}</>
                                                                  )
                                                                }
                                                              </span>
                                                            ) : (
                                                              <span className="date fsize-200 txtLight400 pt-small-4">-</span>
                                                            )
                                                          }
                                                        </div>
                                                      </div>

                                                      <div className="pos-r dis-fl-row a-c">

                                                        <BrixelTooltip
                                                          className="mr-1"
                                                          description={`${translateTo('This document is set to', lang)} ${translateTo(`${doc.isPrivate === true ? 'private' : 'public'}`, lang)}. ${translateTo('Edit to change.', lang)}`}
                                                          width="200"
                                                          iconColor={`${doc.isPrivate === true ? 'red' : 'green'}`}
                                                          icon={`${doc.isPrivate === true ? 'locked' : 'eye'}`}
                                                        />
                                                        {
                                                          !isBuyer && (
                                                            <div>
                                                              <BrixelButtonIcon
                                                                bgTransparent
                                                                theme="black"
                                                                icon="options-vertical"
                                                                onClick={() => {
                                                                  setFolderOptionsOpen({
                                                                    id: doc.id,
                                                                    active: !folderOptionsOpen.active,
                                                                  });
                                                                  setDocumentId(i);
                                                                }}
                                                              />
                                                              {
                                                                (folderOptionsOpen.id === doc.id && folderOptionsOpen.active) && (
                                                                  <>
                                                                    <BrixelDropdownMini
                                                                      topOffset={40}
                                                                      rightAligned
                                                                      links={dropdownActionDoc(doc)}
                                                                    />
                                                                  </>
                                                                )
                                                              }
                                                            </div>
                                                          )
                                                        }
                                                      </div>
                                                    </li>
                                                  ))
                                                }
                                              </ReactSortable>
                                            </div>
                                          </div>
                                        ))
                                      }
                                    </>
                                  ) : (
                                    <>
                                      {
                                        !isBuyer && (
                                          <div className="shadow-1dp dis-fl-col p-1 mb-2 brdRadius">
                                            <ReactSortable
                                              disabled={isBuyer}
                                              handle=".docsHandle"
                                              delay={2}
                                              group="groupName"
                                              list={[]}
                                              className={(index(0) !== -1 || isMovingFolder) ? 'mt-1 pt-0' : ''}
                                              setList={(order) => get(order, '[0].id', null) ? history.push(`/${activeSingleProperty.id}/docubox/${get(order, '[0].id', null)}/addToFolder`) : ''}
                                              onStart={() => setIsMovingFolder(true)}
                                              onEnd={() => setIsMovingFolder(false)}
                                            >
                                              <div className='dis-fl-col py-3 a-c brdRadius txtAltGrey400'>
                                                {translateTo('To keep things organized, drag and drop file to create a folder.', lang)}
                                              </div>
                                            </ReactSortable>
                                          </div>
                                        )
                                      }

                                    </>
                                  )
                                }
                              </>
                            </ReactSortable>
                          </>
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
  activeSingleProperty: get(state, 'property.activeSingleProperty', { }),
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
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSetScreenNotification: bindActionCreators(setNotification, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Documents);
