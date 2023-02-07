import React, {useEffect, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText} from '@brixel/brixel-components';
import {
  BrixelInputText,
  BrixelRadioButton,
  BrixelSelect,
  change,
  initializeForm,
  ReduxField,
} from '@brixel/brixel-components/dist/form';
import {diff} from 'deep-object-diff';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {requestDone} from '../../actions/CommonActions';
import {updateDocument} from '../../actions/UploadActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import translateTo from '../../utils/translation';
import type {SingleFolderType} from '../../@types/Pages/SingleProperty/SingleFolder';
import {DocumentType} from '@brixel/brixel-components/dist/@types/Model';

const SingleDocument = (props: SingleFolderType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeSingleProperty,
    formValue,
    handleUpdateDocument,
    initialValues,
    initForm,
    isRequestDone,
    isSmallLoading,
    lang,
    setRequestDone,
  } = props;

  const [activeDocument, setActiveDocument] = useState<DocumentType>({});
  const [documentFolders, setDocumentFolders] = useState<object[]>([]);
  const [folderAction, setFolderAction] = useState('newFolder');

  const docID = get(match, 'docID', null);

  useEffect(() => () => setRequestDone(false), []);

  useEffect(() => {
    if (activeSingleProperty.documents) {
      const currentDoc = activeSingleProperty.documents.find((doc) => doc.id === docID);
      if (currentDoc) {
        if (folderAction === 'newFolder') currentDoc.folder = '';
        initForm(currentDoc);
      }
    }
  }, [activeSingleProperty.id, folderAction]);

  useEffect(() => {
    const folderArrayAux: string[] = [];
    if (docID) {
      find(activeSingleProperty.documents, (el) => {
        if (el.id === docID) {
          setActiveDocument(el);
        }
      });
      if (has(formValue, 'id') && activeSingleProperty.documents) {
        activeSingleProperty.documents.forEach((value) => {
          if (value.folder) folderArrayAux.push(value.folder);
        });
        const array: object[] = [];
        folderArrayAux.forEach((value, key) => {
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
        isPrivate: formValue.isPrivate,
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
    const diffDoc = diff(initialValues, formValue);
    if (Object.keys(diffDoc).length > 0) return false;
    return true;
  };

  return (
    <>
      {
        activeDocument.id && (
          <SplashScreen closeOutside={false} className="edit-document">
            <div className="single-document dis-fl-col">
              {/* top panel */}
              <div className="top dis-fl-row a-c jc-b py-3 max-h-fix-80 px-3 brdSmallBottom brdLight400 mb-3 pos-r">
                <h4 className="name dis-b fweight-600 ml-a mr-a">
                  {translateTo('Add to folder', lang)}
                </h4>
                <BrixelButtonIcon
                  icon="close"
                  ghost
                  className='pos-a-fix x-r-2'
                  theme="dark"
                  onClick={() => {
                    history.push(`/${activeSingleProperty.id}/docubox`);
                  }}
                />
              </div>

              {/* middle panel */}
              <div className="mid dis-fl-col mb-10 px-3">
                <BrixelRadioButton
                  input={{
                    onChange: (val) => setFolderAction(val),
                    value: folderAction,
                    name: 'folderAction',
                  }}
                  options={
                    documentFolders.length > 0 ? [{
                      label: 'Create new folder',
                      value: 'newFolder',
                    }, {
                      label: 'Add to existing folder',
                      value: 'addToFolder',
                    }] : [{
                      label: 'Create new folder',
                      value: 'newFolder',
                    }]}
                />
                <div className="dis-fl-row mt-3">
                  {
                    folderAction === 'newFolder' ? (
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
                    ) : (
                      documentFolders.length > 0 && (
                        <ReduxField
                          form="SingleDoc"
                          design={{
                            className: 'mr-2 zIndex1 w-fix-248',
                          }}
                          input={{
                            name: 'folder',
                            options: documentFolders,
                          }}
                          labels={{
                            label: 'Choose a folder',
                          }}
                          component={BrixelSelect}
                        />
                      )
                    )
                  }
                </div>
              </div>
              {/* bottom panel */}
              <div className="bottom dis-fl-row jc-b brdSmallTop brdLight400 w-perc-100 a-c px-3 py-3 h-fix-80">
                <BrixelButtonText
                  className="edit mr-2"
                  theme="dark"
                  rounded
                  label={translateTo('Cancel', lang)}
                  onClick={() => {
                    history.push(`/${activeSingleProperty.id}/docubox`);
                  }}
                />
                <BrixelButtonPrimary
                  className="edit"
                  label={translateTo('Save', lang)}
                  rounded
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
  initialValues: get(state, 'brixelForm.SingleDoc.initialValues', {}),
  isRequestDone: get(state, 'common.requestDone', false),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
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
