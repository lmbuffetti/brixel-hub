/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback } from 'react';
import { change, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import set from 'lodash/set';
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


// COMPONENTS

const Documents = (props) => {
  const [documentOptionsOpen, setDocumentOptionsOpen] = useState({ id: null, active: false });
  const [editDocument, setEditDocument] = useState({ id: null, active: false });
  const [selectedVisibility, setSelectedVisibility] = useState(null);

  // PROPS
  const {
    formValue,
    handleUploadDocument,
    user,
    handleDeleteDocument,
    handleUpdateDocument,
    history,
    match,
    initialValues,
    changeFieldValue,
    setNotification,
  } = props;
  const { documents } = formValue;
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
    const data = {
      id: idDocs,
      pageID: formValue.id,
    };
    handleDeleteDocument(data);
  };

  // UPDATE DOCUMENTS
  const updateDoc = (e, doc) => {
    e.preventDefault();
    const data = {
      pageID: formValue.id,
      id: doc.id,
      body: {
        name: doc.name,
        isPrivate: selectedVisibility !== 'Public',
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
    <div className="secondLevel">
      <div className="docubox">
        <div className="dis-f jc-b a-c mb-3">
          <BrixelButtonIcon
            className="shadow-3dp hide-md"
            icon="arrow-simple-left"
            background="White"
            color="primary"
            saturationTxt={400}
            noBorder
            onClick={() => history.push(`${propID}/property`)}
          />
          <h5 className="m-a m-md-0 mb-3">
            Docubox
          </h5>
        </div>
        {
          (documents && documents.length > 0) && (
            <>
              <div className="documents-container dis-fl-col">
                {
                  documents.map((doc, i) => (
                    <li key={i.toString()} className="single-document dis-fl-row a-c jc-b pb-1 pt-1">

                      <div className="name dis-fl-row a-c">

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
                            <div className="dis-fl-row a-c">
                              <Field
                                className="zIndex1"
                                name={`documents[${i}].name`}
                                placeholder="Name this document"
                                component={BrixelInputText}
                              />
                            </div>
                          ) : (
                            <div className="dis-fl-col">
                              <span className="document-title txtDark700">{doc.name}</span>
                              <span className="date body2 txtDark200">{new Date(doc.createdAt).toDateString()}</span>
                            </div>
                          )
                        }
                      </div>

                      <div className="visibility-info dis-fl-row a-c">
                        {
                          (editDocument.id === doc.id && editDocument.active) ? (
                            <BrixelDropdown
                              className="zIndex2 w-fix-120"
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
                                setSelectedVisibility(doc.isPrivate ? 'Private' : 'Public');
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
                                  icon="check-small"
                                  bgTransparent
                                  noBorder
                                  color="green"
                                  saturationTxt={400}
                                  className="add-button"
                                  label="Save"
                                  onClick={(e) => updateDoc(e, doc)}
                                />
                                <BrixelButtonIcon
                                  icon="close-circle"
                                  bgTransparent
                                  noBorder
                                  className="add-button"
                                  color="red"
                                  saturationTxt={400}
                                  label="Cancel"
                                  onClick={() => {
                                    if (Object.keys(diff(initialValues.documents[i], doc)).length > 0) {
                                      changeFieldValue(`documents[${i}]`, initialValues.documents[i]);
                                      setEditDocument({ id: null, active: false });
                                    } else {
                                      setEditDocument({ id: null, active: false });
                                    }
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
              </div>

            </>
          )
        }

        <>
          <div
            className={`${(!documents || (documents && documents.length === 0)) ? 'emptyState' : 'hasImages py-3'} upload-container dis-fl-col a-c mb-5 mt-3 ta-c m-a`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {
              (!documents || (documents && documents.length === 0)) && (
                <div>
                  <img src={upload_documents_empty} alt="Empty Documents" />
                  <h5 className="mt-2 mb-1">Uplaod your fist document</h5>
                </div>
              )
            }
            <span className="body2 txtDark200 fileDetailsTxt">Choose .pdf .jpeg .png with max. 10 MB size</span>
            <BrixelButtonPrimary
              label="upload"
              rightIcon="upload"
              rounded
              className="mt-3"
            />
          </div>
        </>
      </div>
    </div>
  );
};

Documents.propTypes = {
  history: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

Documents.defaultProps = {
};

const DocumentsForm = reduxForm({
  // a unique name for the form
  form: 'documentsForm',
  enableReinitialize: true,
})(Documents);

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.documentsForm.values', {}),
  initialValues: get(state, 'property.activeSingleProperty', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
  user: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('documentsForm', field, value));
  },
  setNotification: bindActionCreators(setScreenNotification, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleUpdateDocument: bindActionCreators(updateDocument, dispatch),  // setPreventExit: bindActionCreators(preventExitFromScreen, dispatch),
  // setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
  // handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DocumentsForm);
