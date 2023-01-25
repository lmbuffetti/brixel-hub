import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import has from 'lodash/has';
import uniq from 'lodash/uniq';
import {diff} from 'deep-object-diff';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {
  BrixelInputText,
  BrixelRadioButton,
  BrixelSelect,
  change,
  ReduxField,
} from '@brixel/brixel-components/dist/form';
import documentConfig from '@brixel/brixel-components/dist/configuration/DocumentsConfig';
import {updateDocument,} from '../../actions/UploadActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import {requestDone} from '../../actions/CommonActions';
import {DocumentType} from '@brixel/brixel-components/dist/@types/Model';
import type {SingleDocumentType} from '../../@types/Pages/SingleProperty/SingleDocument';

const SingleDocument = (props: SingleDocumentType) => {
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
    isRequestDone,
    isSmallLoading,
    lang,
    setRequestDone,
  } = props;

  const [activeDocument, setActiveDocument] = useState<DocumentType>({});
  const [activeDocumentKey, setActiveDocumentKey] = useState<number>();
  const [documentFolders, setDocumentFolders] = useState<string[]>([]);
  const [newFolder, setNewFolder] = useState(false);
  const [docuementsType, setDocumentsType] = useState<{ label: string; value: string; }[]>([]);

  useEffect(() => () => setRequestDone(false), []);

  useEffect(() => {
    if (has(formValue, 'location.countryCode')) {
      const docsConfig = documentConfig.mandatoryDocuments[get(formValue, 'location.countryCode')][get(formValue, 'properties.propertyType')];
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
    const docID = get(match, 'docID', null);
    const folderArrayAux: string[] = [];
    if (docID) {
      find(activeSingleProperty.documents, (el, key) => {
        if (el.id === docID) {
          if (el.isPrivate === true) set(el, 'isPrivate', 'Private');
          else if (el.isPrivate === false) set(el, 'isPrivate', 'Public');
          setActiveDocument(el);
          setActiveDocumentKey(key);
        }
      });
      if (has(formValue, 'id') && activeSingleProperty?.documents) {
        activeSingleProperty.documents.forEach((value) => {
          if (value?.folder) folderArrayAux.push(value.folder);
        });
        const array = uniq(folderArrayAux);
        array.forEach((value, key) => {
          // @ts-ignore
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
      changeFieldValue(`documents[${activeDocumentKey}].isPrivate`, get(activeDocument, 'isPrivate', null));
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
    if (formValue.documents) {
      const data = {
        pageID: activeSingleProperty.id,
        id: activeDocument.id,
        body: {
          name: formValue.documents[`${activeDocumentKey}`].name,
          isPrivate: formValue.documents[`${activeDocumentKey}`].isPrivate === 'Private',
          folder: formValue.documents[`${activeDocumentKey}`].folder,
          path: activeDocument.path,
          mimeType: activeDocument.mimeType,
          type: formValue.documents[`${activeDocumentKey}`].type,
        },
        smallLoader: 'saveData',
      };
      handleUpdateDocument(data);
      setDocumentFolders([]);
    }
  };

  const checkDisabled = () => {
    const docsDiff = diff(initialValues, formValue);
    const isDocEdit = find(get(docsDiff, 'documents', {}), (el) => {
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
    if (formValue.documents && activeDocumentKey) {
      event.preventDefault();
      const folder = {
        label: formValue.documents[activeDocumentKey].folder,
        value: formValue.documents[activeDocumentKey].folder,
        id: (formValue.documents[activeDocumentKey].folder || '').toLowerCase(),
      };
      documentFolders.push(folder.value || '');
      setDocumentFolders(documentFolders);
      setNewFolder(false);
    }
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
                    changeFieldValue('documents', initialValues.documents || []);
                    history.push(`/${activeSingleProperty.id}/docubox`);
                  }}
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
                    label: translateTo('Name', lang),
                  }}
                  component={BrixelInputText}
                />
                <ReduxField
                  form="Property"
                  design={{
                    className: 'zIndex3 mb-3',
                    borderColor: 'light',
                    color: 'light',
                  }}
                  input={{
                    name: `documents[${activeDocumentKey}].type`,
                    options: docuementsType,
                  }}
                  labels={{
                    label: translateTo('Type of document', lang),
                  }}
                  component={BrixelSelect}
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
                        form="Property"
                        design={{
                          className: 'mr-2 zIndex1 w-fix-248',
                        }}
                        input={{
                          name: `documents[${activeDocumentKey}].folder`,
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
                          changeFieldValue(`documents[${activeDocumentKey}].folder`, get(`initialValues.documents[${activeDocumentKey}]`, 'folder', ''));
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
                      <BrixelButtonText
                        className={`edit as-fs ${documentFolders.length > 0 ? 'mt-1' : 'mt-3'}`}
                        label={translateTo('New folder', lang)}
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
                  className="edit mr-2"
                  theme="dark"
                  rounded
                  small
                  label={translateTo('Cancel', lang)}
                  onClick={() => {
                    changeFieldValue('documents', initialValues.documents || []);
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

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.SingleDoc.values', {}),
  initialValues: get(state, 'property.SingleDoc.initialValues', {}),
  isRequestDone: get(state, 'common.requestDone', false),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  isSuperAdmin: get(state, 'common.superAdmin', false),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('SingleDoc', field, value));
  },
  handleUpdateDocument: bindActionCreators(updateDocument, dispatch),
  setRequestDone: bindActionCreators(requestDone, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SingleDocument);
