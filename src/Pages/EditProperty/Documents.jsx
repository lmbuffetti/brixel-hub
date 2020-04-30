/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { change, Field, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { ReactSortable } from 'react-sortablejs';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon, BrixelDropdown,
  BrixelButtonTertiary, useOutsideAlerter, BrixelInputText,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { uploadDocument, deleteDocument, updateDocument } from '../../actions/UploadActions';
import { setScreenNotification } from '../../actions/CommonActions';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import { diff } from 'deep-object-diff';

// IMAGES
import upload_documents_empty from '../../images/Upload/upload_documents_empty.svg';
import { useDropzone } from 'react-dropzone';
import moment from 'moment';


// COMPONENTS

const Documents = (props) => {
  const [documentOptionsOpen, setDocumentOptionsOpen] = useState({ id: null, active: false });
  const [editDocument, setEditDocument] = useState({ id: null, active: false });

  // PROPS
  const {
    formValue,
    handleUploadDocument,
    user,
    handleDeleteDocument,
    handleUpdateDocument,
    history,
    isSmallLoading,
    match,
    changeFieldValue,
    setNotification,
    reset,
  } = props;
  const { documents } = formValue;

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
    changeFieldValue('documents', docArray);
  };

  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  // REF
  const documentRef = useRef(null);
  const textAreaRef = useRef(null);

  // PAGE ID
  const pageId = get(match, 'params.propId', formValue.id);

  // UPLOAD DOCUMENTS
  const saveDocuments = (doc) => {
    handleUploadDocument(doc);
  };

  useEffect(() => {
    if (!isSmallLoading) {
      setDocumentOptionsOpen({ id: null, active: false });
      setEditDocument({ id: null, active: false });
    }
  }, [isSmallLoading]);


  // DROPZONE SETTINGS
  // const dropzoneRef = useRef(null);
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    acceptedFiles.forEach((file) => {
      const read = new FileReader();
      read.readAsDataURL(file);
      const name = file.name || Date.now() / 1000;
      read.onload = () => {
        const data = {
          name: name,
          user: user.user.id,
          isBrochure: false,
          file: read.result,
          pageID: pageId,
          smallLoader: true,
        };
        saveDocuments(data);
      };
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png,image/jpg,image/jpeg,.pdf',
    minSize: 0,
    maxSize: 1e+7,
  });

  // REMOVE DOCUMENTS
  const deleteDocs = (e, idDocs) => {
    e.preventDefault();
    setDocumentOptionsOpen({ id: null, active: false });
    const data = {
      id: idDocs,
      pageID: formValue.id,
      smallLoader: true,
    };
    handleDeleteDocument(data);
  };

  // UPDATE DOCUMENTS
  const updateDoc = (e, doc) => {
    e.preventDefault();
    const selDoc = documents.find(item => item.id === editDocument.id);
    const data = {
      pageID: formValue.id,
      id: doc.id,
      smallLoader: true,
      body: {
        name: doc.name,
        isPrivate: selDoc.isPrivate,
        path: doc.path,
        mimeType: doc.mimeType,
      },
    };
    handleUpdateDocument(data);
    setEditDocument({ id: null, active: false });
  };

  // COPY DOCUMENT LINK
  const copyLinkToClipboard = (e) => {
    e.preventDefault();
    textAreaRef.current.select();
    document.execCommand('copy');
    setNotification({
      state: true,
      type: 'success',
      label: 'Link copied!',
    });
    setTimeout(() => setNotification({ state: false }), 2000);
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
      <div className="docubox dis-fl-col cardSecondLevel">
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
            (documents && documents.length > 0) && (
              <>
                <div className="documents-container dis-fl-col w-perc-100">
                  <ReactSortable
                    list={cloneDeep(documents)}
                    setList={(order, evt) => {
                      changeOrder(order);
                    }}
                    className="document-list"
                  >
                    {
                      documents.map((doc, i) => (
                        <li
                          key={i.toString()}
                          data-id={JSON.stringify(doc)}
                          className="single-document dis-fl-row a-c jc-b pb-1 pt-1"
                        >

                          <div className="name dis-fl-row a-c w-perc-100 pr-1">

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
                                  <Field
                                    className="zIndex1 w-perc-100"
                                    name={`documents[${i}].name`}
                                    placeholder="Name this document"
                                    component={BrixelInputText}
                                  />
                                </div>
                              ) : (
                                <div className="dis-fl-col cur-poi" onClick={() => window.open(`${getConfigEnv.shortPath}/document/${doc.id}`, "_blank")}>
                                  <span className="document-title txtDark700">{doc.name}</span>
                                  <span className="date body2 txtDark200">{moment(doc.createdAt).format('ddd MMM DD YYYY')}</span>
                                </div>
                              )
                            }
                          </div>

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
                                  className="mr-1"
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
                                        reset('Property');
                                        setEditDocument({ id: null, active: false });
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <BrixelButtonIcon
                                    className="p-md-0 mr-1-neg"
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
                                      onClick={() => {
                                        setEditDocument({ id: doc.id, active: !editDocument.active });
                                        set(formValue, '', doc.companyRole);
                                        setDocumentOptionsOpen({ id: null, active: false });
                                      }}
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
                        </li>
                      ))
                    }
                  </ReactSortable>
                </div>

              </>
            )
          }
          <>
            <div
              className={`${(!documents || (documents && documents.length === 0)) ? 'emptyState mb-5' : 'hasImages py-2 py-md-3'} upload-container dis-fl-col a-c mt-3 ta-c w-perc-100`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {
                (!documents || (documents && documents.length === 0)) && (
                  <div>
                    <img src={upload_documents_empty} alt="Empty Documents" />
                    <h5 className="mt-2 mb-1">Upload your fist document</h5>
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
        </div>
      </div>
    </div>
  );
};

Documents.propTypes = {
  history: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

Documents.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  user: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  setNotification: bindActionCreators(setScreenNotification, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleUpdateDocument: bindActionCreators(updateDocument, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Documents);
