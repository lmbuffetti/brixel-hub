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
import cloneDeep from 'lodash/cloneDeep';
import { ReactSortable } from 'react-sortablejs';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon, BrixelDropdown, BrixelDropdownMini,
  BrixelButtonTertiary, useOutsideAlerter, BrixelInputText, change, reset, ReduxField,
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
    initialValues,
    handleMultiUploadDocument,
    loggedInUser,
    handleDeleteDocument,
    history,
    isSmallLoading,
    match,
    changeFieldValue,
    resetForm,
    userType,
  } = props;
  const [documentOptionsOpen, setDocumentOptionsOpen] = useState({ id: null, active: false });
  const [editDocument, setEditDocument] = useState({ id: null, active: false });
  const [isCopied, setIsCopied] = useState(false);
  const [documentLists, setDocumentLists] = useState([]);

  const { documents } = formValue;

  useEffect(() => {
    const docs = documents || [];
    if (userType === 'seller') setDocumentLists(docs);
    else setDocumentLists(docs.filter((item) => !item.isPrivate));
  }, [documents, userType]);

  // ORDER DOCUMENTS
  const changeOrder = (order) => {
    const docArray = [];
    // eslint-disable-next-line array-callback-return
    order.map((item) => {
      if (item.id) {
        delete item.chosen;
        delete item.selected;
        docArray.push(item);
      }
      return null;
    });
    if (userType === 'seller') changeFieldValue('documents', docArray);
  };

  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  // REF
  const documentRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!isSmallLoading) {
      setDocumentOptionsOpen({ id: null, active: false });
      setEditDocument({ id: null, active: false });
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

  // FUNCTION TO EDIT DOCUMENT
  const onEditMode = (doc) => {
    setEditDocument({ id: doc.id, active: !editDocument.active });
    set(formValue, '', doc.companyRole);
    setDocumentOptionsOpen({ id: null, active: false });
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
            (documentLists.length > 0) && (
              <>
                <div className="documents-container dis-fl-col w-perc-100">
                  <ReactSortable
                    scroll
                    bubbleScroll
                    list={cloneDeep(documentLists)}
                    setList={(order) => changeOrder(order)}
                    className="document-list"
                    handle=".handle"
                  >
                    {
                      documentLists.map((doc, i) => (
                        <li
                          key={i.toString()}
                          data-id={JSON.stringify(doc)}
                          className="single-document dis-fl-row a-c jc-b pb-1 pt-1"
                        >
                          <div className={`name dis-fl-row a-c w-perc-100 pr-1 ${editDocument.active || userType !== 'seller' ? 'hand' : 'handle'}`}>

                            <div className="icon-container brdRadius dis-f w-fix-40 h-fix-40 jc-c a-c mr-1">
                              <BrixelIcon
                                icon="document"
                                background="primary"
                                saturation={100}
                                color="dark"
                                saturationTxt={700}
                              />
                            </div>
                            {
                              (editDocument.id === doc.id && editDocument.active) ? (
                                <div className="dis-fl-row a-c w-perc-100">
                                  <ReduxField
                                    form="Property"
                                    input={{
                                      name: `documents[${i}].name`,
                                      placeholder: 'Name this document',
                                      type: 'text',
                                    }}
                                    component={BrixelInputText}
                                    design={{
                                      className: 'zIndex1 w-perc-100',
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="dis-fl-col cur-poi" onClick={() => window.open(`${getConfigEnv.shortPath}/document/${doc.id}`, '_blank')}>
                                  <span className="document-title max-w-fix-168 max-w-perc-md-100 txtDark700">{doc.name}</span>
                                  <span className="date body2 txtDark200">{moment(doc.createdAt).format('D MMM YYYY, H:mm')}</span>
                                </div>
                              )
                            }
                          </div>

                          {
                            userType === 'seller' ? (
                              <div className="visibility-info dis-fl-row a-c">
                                {
                                  (editDocument.id === doc.id && editDocument.active) ? (
                                    <BrixelDropdown
                                      className="zIndex2 compact"
                                      borderColor="light"
                                      color="light"
                                      options={[
                                        {
                                          label: 'Private',
                                          value: true,
                                        },
                                        {
                                          label: 'Public',
                                          value: true,
                                        }]}
                                      selected={`${doc.isPrivate ? 'Private' : 'Public'}`}
                                      onSelect={(e, value) => {
                                        e.preventDefault();
                                        changeFieldValue(`documents[${i}].isPrivate`, value.label !== 'Public');
                                      }}
                                    />
                                  ) : (
                                    <BrixelIcon
                                      color={`${doc.isPrivate ? 'red' : 'green'}`}
                                      icon={`${doc.isPrivate ? 'locked' : 'eye'}`}
                                    />
                                  )
                                }
                                <div className="pos-r">
                                  {
                                    (editDocument.id === doc.id && editDocument.active) ? (
                                      <div className="dis-fl-row">
                                        <BrixelButtonIcon
                                          icon="close-circle"
                                          bgTransparent
                                          noBorder
                                          className="add-button"
                                          color="red"
                                          saturationTxt={400}
                                          label="Cancel"
                                          onClick={() => {
                                            resetForm(initialValues);
                                            setEditDocument({ id: null, active: false });
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <BrixelButtonIcon
                                        className="p-md-0 mr-1-neg zIndex2"
                                        bgTransparent
                                        noBorder
                                        color="dark"
                                        saturationTxt={400}
                                        icon="options-vertical"
                                        onClick={() => {
                                          setDocumentOptionsOpen({ id: doc.id, active: !documentOptionsOpen.active });
                                        }}
                                      />
                                    )
                                  }
                                  {
                                    (documentOptionsOpen.id === doc.id && documentOptionsOpen.active) && (
                                      <div className="options-menu w-fix-160 zIndex3 shadow-1dp dis-fl-col p-1 pos-a a-bl" ref={documentRef}>
                                        <BrixelButtonTertiary
                                          className="copy p-0"
                                          color="red"
                                          label="Copy Link"
                                          onClick={(e) => copyLinkToClipboard(e)}
                                        />
                                        <textarea
                                          style={{
                                            opacity: 0,
                                            width: 0,
                                            height: 0,
                                          }}
                                          readOnly
                                          ref={textAreaRef}
                                          value={`${getConfigEnv.shortPath}/document/${doc.id}`}
                                        />
                                        <BrixelButtonTertiary
                                          className="edit p-0"
                                          color="dark"
                                          label="Edit"
                                          saturation={100}
                                          onClick={() => onEditMode(doc)}
                                        />
                                        <BrixelButtonTertiary
                                          className="remove p-0"
                                          color="red"
                                          label="Remove"
                                          onClick={(e) => deleteDocs(e, doc.id)}
                                        />
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                            ) : (
                              <div className="visibility-info dis-fl-row a-c">
                                <div className="pos-r" ref={documentRef}>
                                  {
                                    (editDocument.id === doc.id && editDocument.active) ? (
                                      <div className="dis-fl-row">
                                        <BrixelButtonIcon
                                          icon="close-circle"
                                          bgTransparent
                                          noBorder
                                          className="add-button"
                                          color="red"
                                          saturationTxt={400}
                                          label="Cancel"
                                          onClick={() => {
                                            resetForm(initialValues);
                                            setEditDocument({ id: null, active: false });
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <BrixelButtonIcon
                                        className="p-md-0 mr-1-neg zIndex2"
                                        bgTransparent
                                        noBorder
                                        color="dark"
                                        saturationTxt={400}
                                        icon="options-vertical"
                                        onClick={() => {
                                          setDocumentOptionsOpen({ id: doc.id, active: !documentOptionsOpen.active });
                                        }}
                                      />
                                    )
                                  }
                                  {
                                    (documentOptionsOpen.id === doc.id && documentOptionsOpen.active) && (
                                      <>
                                        <BrixelDropdownMini
                                          topOffset={32}
                                          rightAligned
                                          links={
                                            userType === 'seller' ? [
                                              {
                                                label: isCopied ? 'Copied' : 'Copy Link',
                                                clickFunc: (e) => copyLinkToClipboard(e),
                                              },
                                              {
                                                label: 'Edit',
                                                clickFunc: () => onEditMode(doc),
                                              },
                                              {
                                                label: 'Remove',
                                                clickFunc: (e) => deleteDocs(e, doc.id),
                                                className: 'txtRed400',
                                              },
                                            ] : [
                                              {
                                                label: isCopied ? 'Copied' : 'Copy Link',
                                                clickFunc: (e) => copyLinkToClipboard(e),
                                              },
                                            ]
                                          }
                                        />
                                        <textarea
                                          style={{
                                            opacity: 0,
                                            width: 0,
                                            height: 0,
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
                            )
                          }
                        </li>
                      ))
                    }
                  </ReactSortable>
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
  initialValues: PropTypes.object.isRequired,
  handleMultiUploadDocument: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  handleDeleteDocument: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
};

Documents.defaultProps = {
  isSmallLoading: null,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  initialValues: get(state, 'brixelForm.Property.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  userType: get(state, 'user.userTypes', ''),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  resetForm(data) {
    (dispatch(reset('Property', data)));
  },
  setNotification: bindActionCreators(setScreenNotification, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Documents);
