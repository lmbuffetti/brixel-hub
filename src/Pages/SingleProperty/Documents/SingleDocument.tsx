import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import get from 'lodash/get';
import find from 'lodash/find';
import has from 'lodash/has';
import uniq from 'lodash/uniq';
import { diff } from 'deep-object-diff';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {
  BrixelInputText,
  BrixelRadioButton,
  BrixelSelect,
  BrixelSwitchButton,
  ReduxField,
  change,
  initializeForm,
} from '@brixel-io/brixel-components/dist/form';
import documentConfig from '@brixel-io/brixel-components/dist/configuration/DocumentsConfig';
import {updatePageDocument} from '../../../actions/UploadActions';

// COMPONENTS
import SplashScreen from '../../../components/SplashScreen';
import type { SingleDocumentType } from '../../../@types/Pages/SingleProperty/SingleDocument';
import { DocumentType } from '@brixel-io/brixel-components/dist/@types/Model';
import type { HelperType } from '../../../@types/App';
import { requestDone } from '../../../actions/CommonActions';

const SingleDocument = (props: SingleDocumentType) => {
  const match = useParams();

  const history = {
    push: useNavigate(),
    location: useLocation(),
  };

  const {
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleUpdateDocument,
    initForm,
    initialValues,
    lang,
    isSmallLoading,
    setRequestDone,
  } = props;

  const [activeDocument, setActiveDocument] = useState<DocumentType>();
  const [documentFolders, setDocumentFolders] = useState<object[]>([]);
  const [newFolder, setNewFolder] = useState<boolean>(false);
  const [documentsType, setDocumentsType] = useState<HelperType[]>();

  const docID = get(match, 'docID', null);

  useEffect(() => () => setRequestDone(false), []);

  useEffect(() => {
    if (activeSingleProperty.documents) {
      const currentDoc = activeSingleProperty.documents.find((doc) => doc.id === docID);
      if (currentDoc) initForm(currentDoc);
    }
  }, [activeSingleProperty.id]);

  useEffect(() => {
    if (isSmallLoading.saveData) {
      history.push(`/${activeSingleProperty.id}/docubox`);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    if (has(activeSingleProperty, 'location.countryCode')) {
      const docsConfig = documentConfig.mandatoryDocuments[get(activeSingleProperty, 'location.countryCode', '')][get(activeSingleProperty, 'properties.propertyType')];
      const docsOptions = [{
        label: translateTo('Generic', lang),
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
    const folderArrayAux: string[] = [];
    if (docID) {
      find(activeSingleProperty.documents, (el) => {
        if (el.id === docID) {
          setActiveDocument(el);
        }
      });
      if (has(activeSingleProperty, 'id')) {
        activeSingleProperty.documents?.forEach((value) => {
          if (value?.folder && value.folder.toLowerCase() !== 'nofolder') folderArrayAux.push(value.folder);
        });
        const array: any = uniq(folderArrayAux);
        array.forEach((value, key) => {
          if (value.toLowerCase() !== 'nofolder') {
            array[key] = {
              label: value,
              value,
              id: value.toLowerCase(),
            };
          }
        });
        if (array.length > 0) {
          array.push({
            label: 'Remove from folder',
            value: 'NoFolder',
            id: 'noFolder',
          })
        }
        setDocumentFolders(array);
      }
    }
  }, [activeSingleProperty.updatedAt]);

  // UPDATE DOCUMENTS
  const updateDoc = (e) => {
    e.preventDefault();
    if (activeDocument) {
      const data = {
        pageID: activeSingleProperty.id,
        body: {
          id: activeDocument.id,
          name: formValue.name,
          isPrivate: formValue.isPrivate,
          folder: formValue.folder,
          isBrochure: formValue.isBrochure,
          isProEstimation: formValue.isProEstimation,
          type: formValue.type,
        },
        smallLoader: 'updateDoc',
      };
      handleUpdateDocument(data);
      setDocumentFolders([]);
    }
  };

  const checkDisabled = () => {
    const objDiff = diff(initialValues, formValue);
    const isDocEdit = find(objDiff, (_key, el) => {
      return (history.location.pathname.includes('docubox') &&
          (el ==='isPrivate' || el === 'isBrochure' || el === 'isProEstimation' || el === 'name' || el === 'type' || el === 'folder') &&
          newFolder === false);
    });

    if (isDocEdit !== undefined) return false;
    else return true;
  };

  const createNewFolder = (event) => {
    event.preventDefault();
    const folder = {
      label: formValue.folder,
      value: formValue.folder,
      id: formValue.folder?.toLowerCase(),
    };
    documentFolders.push(folder);
    const finalFolders = documentFolders;
    setDocumentFolders(finalFolders);
    setNewFolder(false);
  };

  return (
    <>
      {
        activeDocument?.id && (
          <SplashScreen closeOutside={false} className="edit-document">
            <div className="single-document p-2 dis-fl-col">
              {/* top panel */}
              <div className="top dis-fl-row a-c jc-b mb-5">
                <span className="name dis-b fsize-500 fweight-500 txtText900">{translateTo('Edit document', lang)}</span>
                <BrixelButtonIcon
                  icon="close-small"
                  ghost
                  theme="text"
                  onClick={() => {
                    changeFieldValue('documents', initialValues);
                    history.push(`/${activeSingleProperty.id}/property/docubox`);
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
                    name: 'name',
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
                    name: 'type',
                    options: documentsType,
                  }}
                  labels={{
                    label: translateTo('Type of document', lang),
                  }}
                  component={BrixelSelect}
                />
                <ReduxField
                  form="SingleDoc"
                  design={{
                    className: 'zIndex2 w-fix-248 mb-3',
                    borderColor: 'light',
                    color: 'light',
                  }}
                  input={{
                    name: 'isPrivate',
                    options: [{
                      label: translateTo('Private', lang),
                      value: true,
                    },
                    {
                      label: translateTo('Public', lang),
                      value: false,
                    }],
                  }}
                  labels={{
                    label: translateTo('Visibility', lang),
                  }}
                  component={BrixelRadioButton}
                />
                <ReduxField
                  design={{
                    className: 'zIndex2 w-fix-248 mt-2',
                    borderColor: 'light',
                    color: 'light',
                  }}
                  form="SingleDoc"
                  input={{
                    name: 'isBrochure',
                  }}
                  labels={{
                    label: translateTo('Brochure', lang),
                  }}
                  component={BrixelSwitchButton}
                />
                <ReduxField
                  design={{
                    className: 'zIndex2 w-fix-248 mt-2',
                    borderColor: 'light',
                    color: 'light',
                  }}
                  form="SingleDoc"
                  input={{
                    name: 'isProEstimation',
                  }}
                  labels={{
                    label: translateTo('Pro Estimation', lang),
                  }}
                  component={BrixelSwitchButton}
                />
                {
                  documentFolders.length > 0 && (
                    <>
                      <ReduxField
                        form="SingleDoc"
                        design={{
                          className: 'mt-3',
                        }}
                        input={{
                          name: 'folder',
                          options: documentFolders,
                          disabled: newFolder,
                          deactivable: false,
                        }}
                        labels={{
                          label: translateTo('Folder', lang),
                        }}
                        component={BrixelRadioButton}
                      />
                    </>
                  )
                }
                {
                  newFolder ? (
                    <div className="dis-fl-row mt-3">
                      <ReduxField
                        form="SingleDoc"
                        design={{
                          className: 'mr-2 zIndex1 w-fix-248',
                        }}
                        input={{
                          name: 'folder',
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
                        label={translateTo('Save', lang)}
                        onClick={(e) => createNewFolder(e)}
                      />
                      <BrixelButtonIcon
                        icon="close-circle"
                        ghost
                        className="add-button as-fe"
                        theme="red"
                        label={translateTo('Cancel', lang)}
                        onClick={() => {
                          changeFieldValue('folder', get('initialValues', 'folder', ''));
                          setNewFolder(false);
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <BrixelButtonText
                        className={`edit as-fs ${documentFolders.length > 0 ? 'mt-1' : 'mt-3'}`}
                        theme="primary"
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
                  theme="text"
                  rounded
                  small
                  label={translateTo('Cancel', lang)}
                  onClick={() => {
                    changeFieldValue('documents', initialValues);
                    history.push(`/${activeSingleProperty.id}/property/docubox`);
                  }}
                />
                <BrixelButtonPrimary
                  className="edit"
                  label={translateTo('Save', lang)}
                  rounded
                  small
                  disabled={checkDisabled()}
                  onClick={(e) => {
                    updateDoc(e);
                  }}
                  isLoading={isSmallLoading.updateDoc}
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
  initialValues: get(state, 'brixelForm.SingleDoc.initialValues', {}),
  lang: get(state, 'common.language', 'en'),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  isSuperAdmin: get(state, 'common.superAdmin', false),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('SingleDoc', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('SingleDoc', value));
  },
  handleUpdateDocument: bindActionCreators(updatePageDocument, dispatch),
  setRequestDone: bindActionCreators(requestDone, dispatch),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(SingleDocument);
