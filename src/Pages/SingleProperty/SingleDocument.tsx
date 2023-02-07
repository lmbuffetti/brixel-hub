import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import has from 'lodash/has';
import {diff} from 'deep-object-diff';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText,} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {BrixelInputText, BrixelSelect, change, initializeForm, ReduxField,} from '@brixel/brixel-components/dist/form';
import documentConfig from '@brixel/brixel-components/dist/configuration/DocumentsConfig';
import {updateDocument,} from '../../actions/UploadActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import {requestDone} from '../../actions/CommonActions';
import type {SingleDocumentType} from '../../@types/Pages/SingleProperty/SingleDocument';
import {DocumentType} from '@brixel/brixel-components/dist/@types/Model';

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
    initForm,
    isRequestDone,
    isSmallLoading,
    lang,
    setRequestDone,
  } = props;

  const [activeDocument, setActiveDocument] = useState<DocumentType>({});
  const [docuementsType, setDocumentsType] = useState<{label: string, value: string}[]>([]);

  const docID = get(match, 'docID', null);

  useEffect(() => () => setRequestDone(false), []);

  useEffect(() => {
    if (activeSingleProperty.documents) {
      const currentDoc = activeSingleProperty.documents.find((doc) => doc.id === docID);
      if (currentDoc) initForm(currentDoc);
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
    if (docID) {
      find(activeSingleProperty.documents, (el) => {
        if (el.id === docID) {
          if (el.isPrivate === true) set(el, 'isPrivate', 'Private');
          else if (el.isPrivate === false) set(el, 'isPrivate', 'Public');
          setActiveDocument(el);
        }
      });
    }
  }, [activeSingleProperty.updatedAt, formValue]);

  useEffect(() => {
    if (has(activeDocument, 'id')) {
      changeFieldValue('documents.isPrivate', get(activeDocument, 'isPrivate', false));
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
        isPrivate: formValue.isPrivate,
        folder: formValue.folder,
        path: activeDocument.path,
        mimeType: activeDocument.mimeType,
        type: formValue.type,
      },
      smallLoader: 'saveData',
    };
    handleUpdateDocument(data);
  };

  const checkDisabled = () => {
    const isDocEdit = find(diff(initialValues, formValue), (el) => {
      if (history.location.pathname.includes('docubox') &&
        (has(el, 'isPrivate') || has(el, 'name') || has(el, 'type') || has(el, 'folder')) &&
        !has(el, 'id')) {
        return true;
      }
      return false;
    });

    if (has(isDocEdit, 'name') || has(isDocEdit, 'isPrivate') || has(isDocEdit, 'type') || has(isDocEdit, 'folder')) return false;
    return true;
  };

  return (
    <>
      {
        activeDocument.id && (
          <SplashScreen closeOutside={false} className="edit-document">
            <div className="single-document dis-fl-col h-perc-100">
              {/* top panel */}
              <div className="top dis-fl-row a-c jc-b py-3 max-h-fix-80 px-3 brdSmallBottom brdLight400 mb-3 pos-r">
                <h4 className="name dis-b fweight-600 ml-a mr-a">
                  {translateTo('Edit document', lang)}
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
                    name: 'isPrivate',
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
              </div>
              {/* bottom panel */}
              <div className="bottom dis-fl-row jc-b brdSmallTop brdLight400 w-perc-100 a-c px-3 py-3 h-fix-80 mt-a">
                <BrixelButtonText
                  className="edit mr-2"
                  theme="dark"
                  rounded
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
