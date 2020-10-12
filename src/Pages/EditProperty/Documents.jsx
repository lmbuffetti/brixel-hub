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
import moment from 'moment';
import { uploadDocument, deleteDocument, multiUploadDocument } from '../../actions/UploadActions';
import { setScreenNotification } from '../../actions/CommonActions';
// IMAGES
import uploadDocumentsEmpty from '../../images/Upload/upload_documents_empty.svg';
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
    if (documents.length > 0) {
      const finalObj = {};
      const availableFolders = [];
      documents.forEach((value) => {
        if (get(value, 'folder')) availableFolders.push(value.folder);
        if (!value.folder) availableFolders.push('NoFolder');
      });
      const array = uniq(availableFolders);
      array.push(array.splice(array.indexOf('NoFolder'), 1)[0]);
      array.forEach((value) => {
        set(finalObj, `${value}`, []);
      });
      documents.forEach((doc) => {
        if (get(doc, 'folder')) finalObj[`${doc.folder}`].push(doc);
        if (!doc.folder) finalObj.NoFolder.push(doc);
      });
      setProcessedDocuments(finalObj);
    }
  }, [documents.length]);

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
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!isSmallLoading) {
      setDocumentOptionsOpen({ id: null, active: false });
    }
  }, [isSmallLoading]);

  // MULTIUPLOADING FUNCTION
  const onDrop = useCallback(async (acceptedFiles) => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    const imgList = tobase64Handler(acceptedFiles, loggedInUser.user.id, 'documents', formValue.id);
    imgList.then((res) => {
      handleMultiUploadDocument({
        allImgs: res, actions: 'documents', pageID: formValue.id, smallLoader: 'upload',
      });
    });
  }, []);

  // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png,image/jpg,image/jpeg,.pdf',
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
      smallLoader: true,
    };
    handleDeleteDocument(data);
  };

  // COPY DOCUMENT LINK
  const copyLinkToClipboard = (e) => {
    if (e) e.preventDefault();
    textAreaRef.current.select();
    document.execCommand('copy');
    setIsCopied(true);
    setTimeout(() => { setIsCopied(false); }, 2000);
  };

  // Function to close the small menus when we click outside
  useOutsideAlerter(documentRef, {
    action: 'function',
    func: () => {
      setDocumentOptionsOpen({ id: null, active: false });
    },
  });

  return (
    <div className="secondLevel h-perc-md-100">
      <div className={`${(!documents || (documents && documents.length === 0)) ? 'emptyMedia' : ''} docubox cardSecondLevel`}>
        <div className="dis-f jc-b a-c mb-3">
          <BrixelButtonIcon
            className="shadow-3dp hide-md"
            icon="arrow-simple-left"
            background="White"
            color="primary"
            saturationTxt={400}
            noBorder
            onClick={() => history.push(`/${propID}/property`)}
          />
          <h5 className="m-a m-md-0 sectionTitle">
            Docubox
          </h5>
        </div>
        <div className="dis-fl-col uploadPanel a-c">
          {
            (processedDocuments && Object.keys(processedDocuments).length > 0) && (
              <>
                <div className="documents-container dis-fl-col">
                  <ul
                    className="folder-list"
                  >
                    {
                      Object.keys(processedDocuments).map((key, i) => (
                        key !== 'NoFolder' ? (
                          <div className="document-folder shadow-1dp dis-fl-col p-1 p-md-2 mb-2 brdRadius" key={i.toString()}>
                            <div className="dis-fl-row jc-b a-c">
                              <div className={`dis-fl-row a-c ${(index(i) !== -1) ? 'mb-3' : ''}`}>
                                <BrixelIcon
                                  icon="folder"
                                  color="green"
                                  saturationTxt={400}
                                  saturation={100}
                                  background="green"
                                  className="mr-2"
                                />
                                <h6>{key}</h6>
                              </div>
                              <BrixelButtonIcon
                                className={`${(index(i) !== -1) ? 'as-fs' : ''}`}
                                bgTransparent
                                noBorder
                                color="dark"
                                saturationTxt={400}
                                fontSize={16}
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
                                  <div className="name w-fix-184 w-fix-md-352 dis-fl-row a-c pr-1 pr-sm-0">
                                    <div className="icon-container brdRadius dis-f w-fix-40 h-fix-40 jc-c a-c mr-1">
                                      <BrixelIcon
                                        icon="document"
                                        background="blue"
                                        saturation={100}
                                        color="blue"
                                        saturationTxt={400}
                                      />
                                    </div>
                                    <span
                                      className="document-title cur-poi max-w-fix-296"
                                      title={doc.name}
                                      onClick={(e) => openDocument(e, doc.id)}
                                    >
                                      {doc.name}
                                    </span>
                                  </div>

                                  <div className="upload-info dis-fl-col">
                                    <span className="date">{moment(doc.createdAt).format('D MMM YYYY, H:mm')}</span>
                                    <span className="user">{doc.user.name}</span>
                                  </div>

                                  <div className="visibility-info dis-fl-row a-c">
                                    <>
                                      <BrixelIcon
                                        className="mr-1"
                                        color={`${doc.isPrivate ? 'red' : 'green'}`}
                                        icon={`${doc.isPrivate ? 'locked' : 'eye'}`}
                                      />
                                      <span className="visibility">{doc.isPrivate ? 'Private' : 'Public'}</span>
                                    </>
                                  </div>
                                  <div className="pos-r">
                                    <BrixelButtonIcon
                                      bgTransparent
                                      noBorder
                                      color="dark"
                                      saturationTxt={100}
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
                                            links={
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
                                              ]
                                            }
                                          />
                                          <textarea
                                            style={{
                                              opacity: 0,
                                              width: 0,
                                              height: 0,
                                              position: 'absolute',
                                              border: 0,
                                            }}
                                            readOnly
                                            ref={textAreaRef}
                                            value={`${getConfigEnv.shortPath}/document/${doc.id}`}
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
                              className="single-document-folder dis-fl-row a-c jc-b p-1 p-md-2 mb-2 brdRadius shadow-1dp"
                            >

                              <div className="name w-fix-184 w-fix-md-352 dis-fl-row a-c pr-1 pr-sm-0">
                                <div className="icon-container brdRadius dis-f w-fix-40 h-fix-40 jc-c a-c mr-1">
                                  <BrixelIcon
                                    icon="document"
                                    background="blue"
                                    saturation={100}
                                    color="blue"
                                    saturationTxt={400}
                                  />
                                </div>
                                <span
                                  className="document-title cur-poi max-w-fix-296"
                                  title={doc.name}
                                  onClick={(e) => openDocument(e, doc.id)}
                                >
                                  {doc.name}
                                </span>
                              </div>

                              <div className="upload-info dis-fl-col">
                                <span className="date">{moment(doc.createdAt).format('D MMM YYYY, H:mm')}</span>
                                <span className="user">{doc.user.name}</span>
                              </div>

                              <div className="visibility-info dis-fl-row a-c">
                                <>
                                  <BrixelIcon
                                    className="mr-1"
                                    color={`${doc.isPrivate ? 'red' : 'green'}`}
                                    icon={`${doc.isPrivate ? 'locked' : 'eye'}`}
                                  />
                                  <span className="visibility">{doc.isPrivate ? 'Private' : 'Public'}</span>
                                </>
                              </div>
                              <div className="pos-r">
                                <BrixelButtonIcon
                                  bgTransparent
                                  noBorder
                                  color="dark"
                                  saturationTxt={100}
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
                                        links={
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
                                          ]
                                        }
                                      />
                                      <textarea
                                        style={{
                                          opacity: 0,
                                          width: 0,
                                          height: 0,
                                          position: 'absolute',
                                          border: 0,
                                        }}
                                        readOnly
                                        ref={textAreaRef}
                                        value={`${getConfigEnv.shortPath}/document/${doc.id}`}
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
                  className={`${(!documentLists || (documentLists.length === 0)) ? 'emptyState mb-5' : 'hasImages py-2 py-md-3'} upload-container dis-fl-col a-c mt-2 ta-c w-perc-100`}
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
                    isLoading={isSmallLoading}
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
  isSmallLoading: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  handleDeleteDocument: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  userType: PropTypes.string.isRequired,
};

Documents.defaultProps = {
  isSmallLoading: null,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser', {}),
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
