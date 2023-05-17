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
import uniqBy from 'lodash/uniqBy';
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
      if (currentDoc && currentDoc.id !== formValue.id) {
        if (currentDoc.folder && currentDoc.folder.toLowerCase() !== 'nofolder') setFolderAction('addToFolder');
        if (currentDoc.folder && currentDoc.folder.toLowerCase() === 'nofolder') currentDoc.folder = '';
        console.log(currentDoc);
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
        // TODO check type  of folder array
        const array: any = [];
        folderArrayAux.forEach((value, key) => {
          array[key] = {
            label: translateTo(value, lang),
            value,
            id: value.toLowerCase(),
          };
        });
        let uniq = uniqBy(array, 'id');
        //@ts-ignore
        uniq = uniq.filter((el) => el.value !== '' && el.value.toLowerCase() !== 'nofolder')
        setDocumentFolders(uniq);
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
                  bgTransparent
                  className='pos-a-fix x-r-2'
                  theme="black"
                  onClick={() => {
                    history.push(`/${activeSingleProperty.id}/docubox`);
                  }}
                />
              </div>

              {/* middle panel */}
              <div className="mid dis-fl-col mb-10 px-3">

                <div>
                  <BrixelRadioButton
                    disableDelay
                    input={{
                      onChange: (val) => setFolderAction(val),
                      value: folderAction,
                      name: 'folderAction',
                    }}
                    options={[{
                      label: translateTo('Create new folder', lang),
                      value: 'newFolder',
                      index: 0,
                    }]}
                  />

                  {
                    folderAction === 'newFolder' && (
                      <ReduxField
                        form="SingleFolder"
                        design={{
                          className: 'mt-2 zIndex1 w-fix-248',
                        }}
                        input={{
                          name: 'folder',
                          placeholder: translateTo('New folder name', lang),
                        }}
                        component={BrixelInputText}
                      />
                    )
                  }
                </div>



                {
                  documentFolders.length > 0 && (
                    <div className="mt-2">
                      <BrixelRadioButton
                        disableDelay
                        input={{
                          onChange: (val) => setFolderAction(val),
                          value: folderAction,
                          name: 'folderAction',
                        }}
                        options={[{
                          label: translateTo('Add to existing folder', lang),
                          value: 'addToFolder',
                          index: 1,
                        }]}
                      />
                      {
                        folderAction === 'addToFolder' && (
                          <ReduxField
                            form="SingleFolder"
                            design={{
                              className: 'mt-2 zIndex1 w-fix-248',
                            }}
                            input={{
                              name: 'folder',
                              options: documentFolders,
                            }}
                            component={BrixelSelect}
                          />
                        )
                      }
                    </div>
                  )
                }

                {
                  (activeDocument.folder && activeDocument.folder?.toLowerCase() !== 'nofolder') && (
                    <BrixelRadioButton
                      className="mt-2"
                      disableDelay
                      input={{
                        onChange: (val) => setFolderAction(val),
                        value: folderAction,
                        name: 'folderAction',
                      }}
                      options={[{
                        label: translateTo('Remove from folder', lang),
                        value: '',
                        index: 2,
                      }]}
                    />
                  )
                }

              </div>
              {/* bottom panel */}
              <div className="bottom dis-fl-row jc-b brdSmallTop brdLight400 w-perc-100 a-c px-3 py-3 h-fix-80">
                <BrixelButtonText
                  className="edit mr-2"
                  theme="black"
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
  formValue: get(state, 'brixelForm.SingleFolder.values', {}),
  initialValues: get(state, 'brixelForm.SingleFolder.initialValues', {}),
  isRequestDone: get(state, 'common.requestDone', false),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('SingleFolder', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('SingleFolder', value));
  },
  handleUpdateDocument: bindActionCreators(updateDocument, dispatch),
  setRequestDone: bindActionCreators(requestDone, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SingleDocument);
