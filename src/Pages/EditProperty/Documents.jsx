/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import isNaN from 'lodash/isNaN';
import findIndex from 'lodash/findIndex';
import uniq from 'lodash/uniq';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon, BrixelDropdownMini,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import { useDropzone } from 'react-dropzone';
import { DateTime } from 'luxon';
import { uploadDocument, deleteDocument, multiUploadDocument } from '../../actions/UploadActions';
import { setScreenNotification } from '../../actions/CommonActions';
// IMAGES
import uploadDocumentsEmpty from '../../images/Upload/upload_documents_empty.svg';
import buyerDocumentsEmpty from '../../images/Media/buyer_docuboxEmpty.svg';
import { tobase64Handler } from '../../utils/helpers';

// COMPONENTS

const Documents = (props) => {
  // PROPS
  const {
    formValue,
    handleMultiUploadDocument,
    loggedInUser,
    handleDeleteDocument,
    history,
    isSmallLoading,
    match,
    userLang,
    userType,
  } = props;
  const [documentOptionsOpen, setDocumentOptionsOpen] = useState({ id: null, active: false });
  const [documentId, setDocumentId] = useState(0);
  const [processedDocuments, setProcessedDocuments] = useState({});
  const [showFullFolder, setShowFullFolder] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [documentLists, setDocumentLists] = useState([]);

  const { documents } = formValue;

  useEffect(() => {
    const docs = documents || [];
    if (userType === 'seller') setDocumentLists(docs);
    else setDocumentLists(docs.filter((item) => !item.isPrivate));
  }, [documents, userType]);

  useEffect(() => {
    let docs = documents || [];
    if (userType === 'buyer') docs = docs.filter((item) => !item.isPrivate);
    if (docs.length > 0) {
      const finalObj = {
        NoFolder: [],
      };
      const availableFolders = [];
      docs.forEach((value) => {
        if (get(value, 'folder')) availableFolders.push(value.folder);
        if (!value.folder) availableFolders.push('NoFolder');
      });
      const array = uniq(availableFolders);
      array.push(array.splice(array.indexOf('NoFolder'), 1)[0]);
      array.forEach((value) => {
        set(finalObj, `${value}`, []);
      });
      docs.forEach((doc) => {
        if (!doc.folder) {
          doc.folder = '';
          finalObj.NoFolder.push(doc);
        } else if (has(doc, 'folder') && doc.folder.length > 0 && finalObj[`${doc.folder}`]) finalObj[`${doc.folder}`].push(doc);
        else if (has(doc, 'folder') && doc.folder.length === 0 && finalObj[`${doc.folder}`]) finalObj.NoFolder.push(doc);
      });
      setProcessedDocuments(finalObj);
    }
    if (documents && documents.length === 0) setProcessedDocuments({});
  }, [documents && documents.length, documents]);

  const manageDocument = (e, id) => {
    if (e) e.preventDefault();
    setDocumentOptionsOpen({
      id: null,
      active: false,
    });
    history.push(`${match.url}/${id}/editDocument`);
  };

  const openDocument = (e, id) => {
    if (e) e.preventDefault();
    window.open(`${getConfigEnv.shortPath}/document/${id}`, '_blank');
  };

  const index = (key) => findIndex(showFullFolder, (el) => el === key);

  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  // REF
  const documentRef = useRef(null);

  useEffect(() => {
    if (!isSmallLoading.uploadMedia) {
      setDocumentOptionsOpen({ id: null, active: false });
    }
  }, [isSmallLoading]);

  // MULTIUPLOADING FUNCTION
  const onDrop = useCallback(async (acceptedFiles) => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    // eslint-disable-next-line no-console
    reader.onabort = () => console.log('file reading was aborted');
    // eslint-disable-next-line no-console
    reader.onerror = () => console.log('file reading has failed');
    const imgList = tobase64Handler(acceptedFiles, loggedInUser.user.id, 'documents', formValue.id);
    imgList.then((res) => {
      handleMultiUploadDocument({
        allImgs: res,
        actions: 'documents',
        pageID: formValue.id || propID,
        smallLoader: 'uploadMedia',
      });
    });
  }, [formValue]);

  // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png,image/jpg,image/jpeg,application/pdf',
    minSize: 0,
    maxSize: 1e+7,
  });

  // REMOVE DOCUMENTS
  const deleteDocs = (e, idDocs) => {
    if (e) e.preventDefault();
    setDocumentOptionsOpen({ id: null, active: false });
    const data = {
      id: idDocs,
      pageID: formValue.id,
      smallLoader: 'deleteMedia',
    };
    handleDeleteDocument(data);
  };

  // COPY DOCUMENT LINK
  const copyLinkToClipboard = (id) => {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.setAttribute('id', 'dummy_id');
    document.getElementById('dummy_id').value = `${getConfigEnv.shortPath}/document/${id}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    setIsCopied(true);
    setTimeout(() => { setIsCopied(false); }, 2000);
  };

  // Function to close the small menus when we click outside
  useOutsideAlerter(documentRef, {
    id: documentId,
    action: 'function',
    func: () => {
      setDocumentOptionsOpen({ id: null, active: false });
    },
  });

  return (
    <div className="h-perc-lg-100">
      <h3 className="mb-3 hide dis-b-lg">Docubox</h3>
      <div className={`boxCard ${(!documents || (documents && documents.length === 0)) ? 'emptyMedia' : ''} docubox cardSecondLevel`}>
        <div className="dis-fl-col uploadPanel a-c">
          {
            processedDocuments && Object.keys(processedDocuments).length < 1 && userType === 'buyer' && (
              <div>
                <img className="h-fix-120" src={buyerDocumentsEmpty} alt="Empty Documents" />
                <h5 className="mt-3 mb-2 ta-c">No documents available.</h5>
                <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 mb-5">Please contact the seller for further documents about this property.</p>
              </div>
            )
          }
          {
            (processedDocuments && Object.keys(processedDocuments).length > 0) && (
              <>
                <div className="documents-container w-perc-100 dis-fl-col">
                  <ul
                    className="folder-list"
                  >
                    {
                      Object.keys(processedDocuments).map((key, i) => (
                        key !== 'NoFolder' ? (
                          <div className="document-folder shadow-1dp dis-fl-col p-1 mb-2 brdRadius" key={i.toString()}>
                            <div className="dis-fl-row jc-b a-c">
                              <div className={`dis-fl-row a-c ${(index(i) !== -1) ? 'mb-3' : ''}`}>
                                <BrixelIcon
                                  icon="folder"
                                  color="green"
                                  saturationTxt={400}
                                  saturation={100}
                                  background="green"
                                  className="mr-2"
                                  isLoading={isSmallLoading.deleteMedia}
                                />
                                <h6>{key}</h6>
                              </div>
                              <BrixelButtonIcon
                                className={`${(index(i) !== -1) ? 'as-fs' : ''}`}
                                ghost
                                theme="dark"
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
                            {
                              (index(i) !== -1) && processedDocuments[key].map((doc, k) => (
                                <li
                                  key={k.toString()}
                                  className="single-document pl-5 dis-fl-row a-c jc-b pb-1 mb-1"
                                >
                                  <div className="name w-fix-184 w-fix-lg-352 dis-fl-row a-c pr-1 pr-sm-0">
                                    <div className="icon-container brdRadius dis-f w-fix-40 h-fix-40 jc-c a-c mr-1">
                                      <BrixelIcon
                                        icon="document"
                                        background="blue"
                                        saturation={100}
                                        color="blue"
                                        saturationTxt={400}
                                      />
                                    </div>
                                    <div className="dis-fl-col cur-poi" onClick={(e) => openDocument(e, doc.id)}>
                                      <span className="document-title max-w-fix-168 max-w-perc-lg-100 txtDark700">{doc.name}</span>
                                      {
                                        get(doc, 'createdAt', null) ? (
                                          <span className="date body2 txtDark200">
                                            {
                                              !isNaN(+doc.createdAt) ? (
                                                <>{DateTime.fromMillis(doc.createdAt, { locale: userLang }).toFormat('dd LLL yyyy, H:mm')}</>
                                              ) : (
                                                <>{DateTime.fromISO(doc.createdAt, { locale: userLang }).toFormat('dd LLL yyyy, H:mm')}</>
                                              )
                                            }
                                          </span>
                                        ) : (
                                          <span className="date body2 txtDark200">-</span>
                                        )
                                      }
                                    </div>
                                  </div>

                                  <div className="pos-r dis-fl-row a-c">
                                    <BrixelIcon
                                      className="mr-1"
                                      color={`${(doc.isPrivate === true || doc.isPrivate === 'Private') ? 'red' : 'green'}`}
                                      icon={`${(doc.isPrivate === true || doc.isPrivate === 'Private') ? 'locked' : 'eye'}`}
                                    />

                                    <BrixelButtonIcon
                                      ghost
                                      theme="dark"
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
                                                  label: isCopied ? 'Copied' : 'Copy Link',
                                                  clickFunc: () => copyLinkToClipboard(doc.id),
                                                },
                                                {
                                                  label: 'View',
                                                  clickFunc: (e) => openDocument(e, doc.id),
                                                },
                                                userType !== 'buyer' && {
                                                  label: 'Edit',
                                                  clickFunc: (e) => {
                                                    manageDocument(e, doc.id);
                                                  },
                                                },
                                                userType !== 'buyer' && {
                                                  label: 'Remove',
                                                  className: 'txtRed400',
                                                  clickFunc: (e) => deleteDocs(e, doc.id),
                                                },
                                              ] : [
                                                {
                                                  label: isCopied ? 'Copied' : 'Copy Link',
                                                  clickFunc: () => copyLinkToClipboard(doc.id),
                                                },
                                                {
                                                  label: 'View',
                                                  clickFunc: (e) => openDocument(e, doc.id),
                                                },
                                              ]}
                                          />
                                        </>
                                      )
                                    }
                                  </div>
                                </li>
                              ))
                            }
                          </div>
                        ) : (
                          processedDocuments[key].map((doc, k) => (
                            <div
                              key={k.toString()}
                              className="single-document-folder dis-fl-row a-c jc-b p-1 mb-2 brdRadius shadow-1dp"
                            >

                              <div className="name w-perc-100 dis-fl-row a-c pr-1 pr-sm-0">
                                <div className="icon-container brdRadius dis-f w-fix-40 h-fix-40 jc-c a-c mr-1">
                                  <BrixelIcon
                                    icon="document"
                                    background="blue"
                                    saturation={100}
                                    color="blue"
                                    saturationTxt={400}
                                  />
                                </div>
                                <div className="dis-fl-col cur-poi" onClick={(e) => openDocument(e, doc.id)}>
                                  <span className="document-title fsize-400 txtDark700">{doc.name}</span>
                                  {
                                    get(doc, 'createdAt', null) ? (
                                      <span className="date body2 txtDark200">
                                        {
                                          !isNaN(+doc.createdAt) ? (
                                            <>{DateTime.fromMillis(doc.createdAt, { locale: userLang }).toFormat('dd LLL yyyy, H:mm')}</>
                                          ) : (
                                            <>{DateTime.fromISO(doc.createdAt, { locale: userLang }).toFormat('dd LLL yyyy, H:mm')}</>
                                          )
                                        }
                                      </span>
                                    ) : (
                                      <span className="date body2 txtDark200">-</span>
                                    )
                                  }
                                </div>
                              </div>

                              <div className="pos-r dis-fl-row a-c">
                                {
                                  userType !== 'buyer' && (
                                    <BrixelIcon
                                      className="mr-1"
                                      color={`${(doc.isPrivate === true || doc.isPrivate === 'Private') ? 'red' : 'green'}`}
                                      icon={`${(doc.isPrivate === true || doc.isPrivate === 'Private') ? 'locked' : 'eye'}`}
                                    />
                                  )
                                }
                                <BrixelButtonIcon
                                  bgTransparent
                                  ghost
                                  theme="dark"
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
                                              label: isCopied ? 'Copied' : 'Copy Link',
                                              clickFunc: () => copyLinkToClipboard(),
                                            },
                                            {
                                              label: 'View',
                                              clickFunc: (e) => openDocument(e, doc.id),
                                            },
                                            {
                                              label: 'Edit',
                                              clickFunc: (e) => {
                                                manageDocument(e, doc.id);
                                              },
                                            },
                                            {
                                              label: 'Remove',
                                              className: 'txtRed400',
                                              clickFunc: (e) => deleteDocs(e, doc.id),
                                            },
                                          ] : [
                                            {
                                              label: isCopied ? 'Copied' : 'Copy Link',
                                              clickFunc: () => copyLinkToClipboard(),
                                            },
                                            {
                                              label: 'View',
                                              clickFunc: (e) => openDocument(e, doc.id),
                                            },
                                          ]}
                                      />
                                    </>
                                  )
                                }
                              </div>
                            </div>
                          ))
                        )
                      ))
                    }
                  </ul>
                </div>
              </>
            )
          }
          {
            userType === 'seller' && (
              <>
                <div
                  className={`${(!documentLists || (documentLists.length === 0)) ? 'emptyState mb-5' : 'hasImages py-2 py-lg-3'} upload-container dis-fl-col a-c ta-c w-perc-100`}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {
                    (!documentLists || (documentLists.length === 0)) && (
                      <div>
                        <img className="h-fix-120" src={uploadDocumentsEmpty} alt="Empty Documents" />
                        <h5 className="mt-3 mb-2">Upload your first document</h5>
                      </div>
                    )
                  }
                  <span className="body2 txtDark200 max-width-220">Choose .pdf .jpeg .png with max. 10 MB size</span>
                  <BrixelButtonPrimary
                    label="upload"
                    rightIcon="upload"
                    rounded
                    className="mt-3"
                    isLoading={isSmallLoading.uploadMedia}
                  />
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

Documents.propTypes = {
  history: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleMultiUploadDocument: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  handleDeleteDocument: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  userLang: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
  userType: get(state, 'user.userTypes', ''),
});

const mapDispatchToProps = (dispatch) => ({
  setNotification: bindActionCreators(setScreenNotification, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Documents);
