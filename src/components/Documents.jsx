/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
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
import { uploadDocument, deleteDocument, updateDocument } from '../actions/UploadActions';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import Loading from '../components/Loading';
// import {
//   setScreenNotification, preventExitFromScreen,
//   setUnsavedChangesModal, setModal,
// } from '../actions/CommonActions';


// COMPONENTS
import SidebarLayout from '../components/SidebarLayout';

const Documents = (props) => {
  const [documentOptionsOpen, setDocumentOptionsOpen] = useState({ id: null, active: false });
  const [editDocument, setEditDocument] = useState({ id: null, active: false });
  const [selectedVisibility, setSelectedVisibility] = useState(null);

  const {
    history, formValue, initialValues, handleUploadDocument, user,
    handleDeleteDocument, handleUpdateDocument,
  } = props;
  const { documents } = formValue;

  // REF
  const documentRef = useRef(null);
  const textAreaRef = useRef(null);

  // UPLOAD DOCUMENTS
  const saveDocuments = (doc) => {
    handleUploadDocument(doc);
  };

  // SAVE DOCUMENTS ON LOCAL STATE
  const loadFile = (e) => {
    e.preventDefault();
    const name = e.target.files[0].name || Date.now() / 1000;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      const data = {
        name,
        user: user.id,
        isBrochure: false,
        file: reader.result,
        pageID: formValue.id,
      };
      saveDocuments(data);
    };
  };

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
        name: formValue.editedName,
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
  };

  // Function to close the small menus when we click outside
  useOutsideAlerter(documentRef, {
    action: 'function',
    func: () => {
      setDocumentOptionsOpen({ id: null, active: false });
    },
  });

  if (!formValue.id) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <SidebarLayout>
        <div className="p-2 docubox">
          <div className="docubox-header dis-fl-row a-c jc-b mb-5">
            <div className="dis-fl-row a-c">
              <BrixelIcon
                className="mr-2"
                icon="folder"
                color="light"
                saturationTxt={100}
                background="primary"
                saturation={300}
              />
              <div className="dis-fl-col a-c">
                <span className="docubox-title">Docubox</span>
                <div className="length dis-fl-row"><span>{documents && documents.length > 0 ? documents.length : 0}&nbsp;</span> <span> files</span></div>
              </div>
            </div>
            <BrixelButtonIcon
              className="shadow-3dp"
              noBorder
              background="white"
              color="dark"
              saturationTxt={700}
              icon="close-small"
              onClick={() => history.push('/home')}
            />
          </div>

          <div className="upload-wrapper dis-f jc-c pos-r ov-h">
            <BrixelButtonPrimary
              className="shadow-3dp"
              rightIcon="plus"
              noBorder
              rounded
              label="Upload"
            />
            <input accept="application/pdf, image/png, image/jpeg" className="upload" type="file" name="document" onChange={(e) => loadFile(e)} />
          </div>

          {
            (documents && documents.length > 0) ? (
              <>
                <div className="documents-container dis-fl-col p-md-1 mt-3 brdRadius">
                  {
                    documents.map((doc, i) => (
                      <li key={i.toString()} className="single-document dis-fl-row a-c jc-b pb-1 mb-2">

                        <div className="name w-fix-216 dis-fl-row a-c">
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
                                  className="mr-2 zIndex1"
                                  name="editedName"
                                  placeholder="Name this document"
                                  component={BrixelInputText}
                                />
                              </div>
                            ) :
                              (
                                <div className="dis-fl-col">
                                  <span className="document-title">{doc.name}</span>
                                  <span className="date">{new Date(doc.createdAt).toDateString()}</span>
                                </div>
                              )
                          }
                        </div>

                        <div className="visibility-info dis-fl-row a-c">
                          {
                            (editDocument.id === doc.id && editDocument.active) ? (
                              <BrixelDropdown
                                borderColor="light"
                                color="light"
                                options={[{
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
                                  set(doc, 'isPrivate', value.label !== 'Public');
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
                        </div>

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
                                  onClick={() => setEditDocument({ id: null, active: false })}
                                />
                              </div>
                            ) : (
                              <BrixelButtonIcon
                                className="p-md-0 mr-1-neg"
                                bgTransparent
                                noBorder
                                color="dark"
                                saturationTxt={100}
                                icon="options-vertical"
                                onClick={() => {
                                  setDocumentOptionsOpen({ id: doc.id, active: !documentOptionsOpen.active });
                                }}
                              />
                            )
                          }
                          {
                            (documentOptionsOpen.id === doc.id && documentOptionsOpen.active) && (
                              <div className="options-menu w-fix-160 zIndex1 shadow-2dp dis-fl-col p-1 pos-a a-bl" ref={documentRef}>
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
                      </li>
                    ))
                  }
                </div>

              </>
            ) : ( // Empty state
              <div className="upload-container dis-fl-col a-c mb-5 max-h-fix-400 py-md-12">
                <span className="title mb-1">Upload your first document</span>
                <span className="description">Choose .pdf, .jpeg, .png with max. 10MB size</span>
              </div>
            )
          }
        </div>
      </SidebarLayout>
    </>
  );
};

Documents.propTypes = {
  history: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
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
  initialValues: get(state, 'property.property', {}),
  user: get(state, 'user.loggedUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('documentsForm', field, value));
  },
  // setNotification: bindActionCreators(setScreenNotification, dispatch),
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
