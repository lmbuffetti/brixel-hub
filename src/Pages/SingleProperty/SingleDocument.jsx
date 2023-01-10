/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import has from 'lodash/has';
import uniq from 'lodash/uniq';
import { diff } from 'deep-object-diff';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelButtonSecondary,
} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {
  ReduxField,
  change,
  BrixelSelect,
  BrixelInputText,
  BrixelRadioButton, initializeForm,
} from '@brixel/brixel-components/dist/form';
import documentConfig from '@brixel/brixel-components/dist/configuration/DocumentsConfig';
import {
  updateDocument,
} from '../../actions/UploadActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import { requestDone } from '../../actions/CommonActions';

const SingleDocument = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleUpdateDocument,
    initialValues,
    initForm,
    isRequestDone,
    isSmallLoading,
    lang,
    setRequestDone,
  } = props;

  const [activeDocument, setActiveDocument] = useState({});
  const [documentFolders, setDocumentFolders] = useState([]);
  const [newFolder, setNewFolder] = useState(false);
  const [docuementsType, setDocumentsType] = useState([]);
  
  const docID = get(match, 'docID', null);

  useEffect(() => () => setRequestDone(false), []);
  
  useEffect(() => {
    if (activeSingleProperty.id) {
      const currentDoc = activeSingleProperty.documents.find((doc) => doc.id === docID);
      initForm(currentDoc);
    }
  }, [activeSingleProperty.id]);
  

  useEffect(() => {
    if (has(activeSingleProperty, 'location.countryCode')) {
      const docsConfig = documentConfig.mandatoryDocuments[get(activeSingleProperty, 'location.countryCode')][get(activeSingleProperty, 'properties.propertyType')];
      const docsOptions = [{
        label: 'Generic',
        value: 'Generic',
      }];
      docsConfig.forEach((doc) => {
        docsOptions.push({
          label: doc,
          value: doc,
        });
      });
      setDocumentsType(docsOptions);
    }
  }, [formValue]);

  useEffect(() => {
    const folderArrayAux = [];
    if (docID) {
      find(activeSingleProperty.documents, (el) => {
        if (el.id === docID) {
          if (el.isPrivate === true) set(el, 'isPrivate', 'Private');
          else if (el.isPrivate === false) set(el, 'isPrivate', 'Public');
          setActiveDocument(el);
        }
      });
      if (has(formValue, 'id')) {
        activeSingleProperty.documents.forEach((value) => {
          if (get(value, 'folder')) folderArrayAux.push(value.folder);
        });
        const array = uniq(folderArrayAux);
        array.forEach((value, key) => {
          array[key] = {
            label: translateTo(value, lang),
            value,
            id: value.toLowerCase(),
          };
        });
        setDocumentFolders(array);
      }
    }
  }, [activeSingleProperty.updatedAt, formValue]);

  useEffect(() => {
    if (has(activeDocument, 'id')) {
      if (activeDocument.isPrivate === true) set(activeDocument, 'isPrivate', 'Private');
      else if (activeDocument.isPrivate === false) set(activeDocument, 'isPrivate', 'Public');
      changeFieldValue(`documents.isPrivate`, get(activeDocument, 'isPrivate', null));
    }
  }, [activeDocument]);

  useEffect(() => {
    if (isSmallLoading.saveData === false && isRequestDone) {
      history.push(`/${activeSingleProperty.id}/docubox`);
    }
  }, [isSmallLoading]);

  // UPDATE DOCUMENTS
  const updateDoc = (e) => {
    e.preventDefault();
    const data = {
      pageID: activeSingleProperty.id,
      id: activeDocument.id,
      body: {
        name: formValue.name,
        isPrivate: formValue.isPrivate === 'Private',
        folder: formValue.folder,
        path: activeDocument.path,
        mimeType: activeDocument.mimeType,
        type: formValue.type,
      },
      smallLoader: 'saveData',
    };
    handleUpdateDocument(data);
    setDocumentFolders([]);
  };

  const checkDisabled = () => {
    const isDocEdit = find(diff(initialValues, formValue), (el) => {
      if (history.location.pathname.includes('docubox') &&
          (has(el, 'isPrivate') || has(el, 'name') || has(el, 'type') || has(el, 'folder')) &&
          !has(el, 'id') && newFolder === false) {
        return true;
      }
      return false;
    });

    if (has(isDocEdit, 'name') || has(isDocEdit, 'isPrivate') || has(isDocEdit, 'type') || has(isDocEdit, 'folder')) return false;
    return true;
  };

  const createNewFolder = (event) => {
    event.preventDefault();
    const folder = {
      label: formValue.folder,
      value: formValue.folder,
      id: formValue.folder.toLowerCase(),
    };
    documentFolders.push(folder);
    setDocumentFolders(documentFolders);
    setNewFolder(false);
  };

  return (
    <>
      {
        activeDocument.id && (
          <SplashScreen closeOutside={false} className="edit-document">
            <div className="single-document dis-fl-col">
              {/* top panel */}
              <div className="top dis-fl-row a-c jc-b mb-5">
                <span className="name dis-b fsize-500 fweight-500 txtDark700">
                  {translateTo('Edit document', lang)}
                </span>
                <BrixelButtonIcon
                  icon="close-small"
                  ghost
                  theme="dark"
                  onClick={() => {
                    changeFieldValue('documents', initialValues.documents);
                    history.push(`/${activeSingleProperty.id}/docubox`);
                  }}
                />
              </div>

              {/* middle panel */}
              <div className="mid dis-fl-col mb-6">
                <ReduxField
                  form="SingleDoc"
                  design={{
                    className: 'mb-3 zIndex1',
                  }}
                  input={{
                    name: `name`,
                    placeholder: 'Name this document',
                  }}
                  labels={{
                    label: translateTo('Name', lang),
                  }}
                  component={BrixelInputText}
                />
                <ReduxField
                  form="SingleDoc"
                  design={{
                    className: 'zIndex3 mb-3',
                    borderColor: 'light',
                    color: 'light',
                  }}
                  input={{
                    name: `type`,
                    options: docuementsType,
                  }}
                  labels={{
                    label: translateTo('Type of document', lang),
                  }}
                  component={BrixelSelect}
                />
                <ReduxField
                  form="SingleDoc"
                  design={{
                    className: 'zIndex2 w-fix-248',
                    borderColor: 'light',
                    color: 'light',
                  }}
                  input={{
                    name: `isPrivate`,
                    options: [{
                      label: translateTo('Private', lang),
                      value: 'Private',
                    },
                    {
                      label: translateTo('Public', lang),
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
                        form="SingleDoc"
                        design={{
                          className: 'mr-2 zIndex1 w-fix-248',
                        }}
                        input={{
                          name: `folder`,
                          placeholder: 'New folder name',
                        }}
                        labels={{
                          label: translateTo('New folder', lang),
                        }}
                        component={BrixelInputText}
                      />
                      <BrixelButtonIcon
                        icon="check-small"
                        ghost
                        theme="green"
                        className="add-button as-fe"
                        label="Save"
                        onClick={(e) => createNewFolder(e)}
                      />
                      <BrixelButtonIcon
                        icon="close-circle"
                        ghost
                        className="add-button as-fe"
                        theme="red"
                        label="Cancel"
                        onClick={() => {
                          changeFieldValue(`folder`, get(initialValues, 'folder', ''));
                          setNewFolder(false);
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      {
                        documentFolders.length > 0 && (
                          <ReduxField
                            form="SingleDoc"
                            design={{
                              className: 'mt-3',
                            }}
                            input={{
                              name: 'folder',
                              options: documentFolders,
                            }}
                            labels={{
                              label: 'Folder',
                            }}
                            component={BrixelRadioButton}
                          />
                        )
                      }
                      <BrixelButtonText
                        className={`edit as-fs ${documentFolders.length > 0 ? 'mt-1' : 'mt-3'}`}
                        label={translateTo('New folder', lang)}
                        onClick={() => {
                          changeFieldValue('folder', '');
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
                  className="edit mr-2"
                  theme="dark"
                  rounded
                  small
                  label={translateTo('Cancel', lang)}
                  onClick={() => {
                    changeFieldValue('documents', initialValues);
                    history.push(`/${activeSingleProperty.id}/docubox`);
                  }}
                />
                <BrixelButtonPrimary
                  className="edit"
                  label={translateTo('Save', lang)}
                  rounded
                  small
                  disabled={checkDisabled()}
                  isLoading={isSmallLoading.saveData}
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
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleUpdateDocument: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isRequestDone: PropTypes.bool.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  setRequestDone: PropTypes.func.isRequired,
};

SingleDocument.defaultProps = {};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.SingleDoc.values', {}),
  initialValues: get(state, 'brixelForm.SingleDoc.initialValues', {}),
  isRequestDone: get(state, 'common.requestDone', false),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  isSuperAdmin: get(state, 'common.superAdmin', false),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('SingleDoc', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('SingleDoc', value));
  },
  handleUpdateDocument: bindActionCreators(updateDocument, dispatch),
  setRequestDone: bindActionCreators(requestDone, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SingleDocument);
