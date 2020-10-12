/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import {
  diff,
} from 'deep-object-diff';
import {
  bindActionCreators, compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  BrixelInputText, BrixelButtonIcon, ReduxField, BrixelButtonPrimary,
  change, BrixelSelect, BrixelButtonTertiary, BrixelButtonSecondary,
  BrixelRadioButton,
} from '@brixel/brixel-components';
import {
  updateDocument,
} from '../../actions/UploadActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';

const SingleDocument = (props) => {
  const {
    history,
    activeSingleProperty,
    match,
    handleUpdateDocument,
    changeFieldValue,
    formValue,
    initialValues,
  } = props;

  const [activeDocument, setActiveDocument] = useState({});
  const [activeDocumentKey, setActiveDocumentKey] = useState();
  const [documentFolders, setDocumentFolders] = useState([]);
  const [newFolder, setNewFolder] = useState(false);

  useEffect(() => {
    const docID = get(match, 'params.docID', null);
    if (docID) {
      find(activeSingleProperty.documents, (el, key) => {
        if (el.id === docID) {
          if (el.isPrivate === true) set(el, 'isPrivate', 'Private');
          else if (el.isPrivate === false) set(el, 'isPrivate', 'Public');
          if (get(el, 'folder')) {
            const folder = {
              label: el.folder,
              value: el.folder,
              id: el.folder.toLowerCase(),
            };
            documentFolders.push(folder);
            setDocumentFolders(documentFolders);
          }
          setActiveDocument(el);
          setActiveDocumentKey(key);
        }
      });
    }
  }, [activeSingleProperty.updatedAt]);

  useEffect(() => {
    if (has(activeDocument, 'id')) {
      if (activeDocument.isPrivate === true) set(activeDocument, 'isPrivate', 'Private');
      else if (activeDocument.isPrivate === false) set(activeDocument, 'isPrivate', 'Public');
      changeFieldValue(`documents[${activeDocumentKey}].isPrivate`, get(activeDocument, 'isPrivate', null));
    }
  }, [activeDocument]);

  // UPDATE DOCUMENTS
  const updateDoc = (e) => {
    e.preventDefault();
    const data = {
      pageID: activeSingleProperty.id,
      id: activeDocument.id,
      body: {
        name: formValue.documents[`${activeDocumentKey}`].name,
        isPrivate: formValue.documents[`${activeDocumentKey}`].isPrivate === 'Private',
        folder: formValue.documents[`${activeDocumentKey}`].folder,
        path: activeDocument.path,
        mimeType: activeDocument.mimeType,
      },
    };
    handleUpdateDocument(data);
    setDocumentFolders([]);
  };

  const checkDisabled = () => {
    const isDocEdit = find(diff(initialValues, formValue).documents, (el) => {
      if (history.location.pathname.includes('documents') &&
          (has(el, 'isPrivate') || has(el, 'name') || has(el, 'folder')) &&
          !has(el, 'id') && newFolder === false) {
        return true;
      }
      return false;
    });

    if (has(isDocEdit, 'name') || has(isDocEdit, 'isPrivate') || has(isDocEdit, 'folder')) return false;
    return true;
  };

  const createNewFolder = (event) => {
    event.preventDefault();
    const folder = {
      label: formValue.documents[activeDocumentKey].folder,
      value: formValue.documents[activeDocumentKey].folder,
      id: formValue.documents[activeDocumentKey].folder.toLowerCase(),
    };
    documentFolders.push(folder);
    setDocumentFolders(documentFolders);
    setNewFolder(false);
  };

  return (
    <>
      {
        activeDocument.id && (
          <SplashScreen className="edit-document" closeLink={`/${activeSingleProperty.id}/property/documents`}>
            <div className="single-document dis-fl-col">
              {/* top panel */}
              <div className="top dis-fl-row a-c jc-b mb-5">
                <span className="name dis-b fsize-500 fweight-500 txtDark700">Edit document</span>
                <BrixelButtonIcon
                  icon="close-small"
                  noBorder
                  className="shadow-1dp"
                  background="white"
                  color="dark"
                  saturationTxt={700}
                  onClick={() => history.push(`/${activeSingleProperty.id}/property/documents`)}
                />
              </div>

              {/* middle panel */}
              <div className="mid dis-fl-col mb-6">
                <ReduxField
                  form="Property"
                  design={{
                    className: 'mb-3 zIndex1',
                  }}
                  input={{
                    name: `documents[${activeDocumentKey}].name`,
                    placeholder: 'Name this document',
                  }}
                  labels={{
                    label: 'Name',
                  }}
                  component={BrixelInputText}
                />
                <ReduxField
                  form="Property"
                  design={{
                    className: 'zIndex2 w-fix-248',
                    borderColor: 'light',
                    color: 'light',
                  }}
                  input={{
                    name: `documents[${activeDocumentKey}].isPrivate`,
                    options: [{
                      label: 'Private',
                      value: 'Private',
                    },
                    {
                      label: 'Public',
                      value: 'Public',
                    }],
                  }}
                  labels={{
                    label: 'Visibility',
                  }}
                  component={BrixelSelect}
                />
                {
                  newFolder ? (
                    <div className="dis-fl-row mt-3">
                      <ReduxField
                        form="Property"
                        design={{
                          className: 'mr-2 zIndex1 w-fix-248',
                        }}
                        input={{
                          name: `documents[${activeDocumentKey}].folder`,
                          placeholder: 'New folder name',
                        }}
                        labels={{
                          label: 'New folder',
                        }}
                        component={BrixelInputText}
                      />
                      <BrixelButtonIcon
                        icon="check-small"
                        bgTransparent
                        noBorder
                        color="green"
                        saturationTxt={400}
                        className="add-button as-fe"
                        label="Save"
                        onClick={(e) => createNewFolder(e)}
                      />
                      <BrixelButtonIcon
                        icon="close-circle"
                        bgTransparent
                        noBorder
                        className="add-button as-fe"
                        color="red"
                        saturationTxt={400}
                        label="Cancel"
                        onClick={() => {
                          setNewFolder(false);
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      {
                        documentFolders.length > 0 && (
                          <ReduxField
                            form="Property"
                            design={{
                              className: 'mt-3',
                            }}
                            input={{
                              name: `documents[${activeDocumentKey}].folder`,
                              options: documentFolders,
                            }}
                            labels={{
                              label: 'Folder',
                            }}
                            component={BrixelRadioButton}
                          />
                        )
                      }
                      <BrixelButtonTertiary
                        className={`edit p-0 as-fs ${documentFolders.length > 0 ? 'mt-1' : 'mt-3'}`}
                        color="primary"
                        label="New folder"
                        saturation={400}
                        onClick={() => {
                          changeFieldValue(`documents[${activeDocumentKey}].folder`, '');
                          setNewFolder(true);
                        }}
                      />
                    </>
                  )
                }
              </div>
              {/* bottom panel */}
              <div className="bottom dis-fl-row jc-fe w-perc-100 h-perc-100">
                <BrixelButtonSecondary
                  className="edit p-0 mr-2"
                  color="dark"
                  rounded
                  small
                  label="Cancel"
                  saturation={700}
                  onClick={() => {
                    history.push(`/${activeSingleProperty.id}/property/documents`);
                  }}
                />
                <BrixelButtonPrimary
                  className="edit p-0"
                  color="primary"
                  label="Save"
                  rounded
                  small
                  disabled={checkDisabled()}
                  saturation={400}
                  onClick={(e) => {
                    updateDoc(e);
                  }}
                />
              </div>
            </div>
          </SplashScreen>
        )
      }
    </>
  );
};

SingleDocument.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleUpdateDocument: PropTypes.func.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
};

SingleDocument.defaultProps = {};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  initialValues: get(state, 'property.activeSingleProperty', {}),
  isSuperAdmin: get(state, 'common.superAdmin', false),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleUpdateDocument: bindActionCreators(updateDocument, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SingleDocument);
