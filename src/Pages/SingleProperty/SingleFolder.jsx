/* eslint-disable array-callback-return */
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary } from '@brixel/brixel-components';
import {
  BrixelInputText,
  BrixelRadioButton,
  BrixelSelect,
  change,
  initializeForm,
  ReduxField,
} from '@brixel/brixel-components/dist/form';
import { diff } from 'deep-object-diff';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { requestDone } from '../../actions/CommonActions';
import { updateDocument } from '../../actions/UploadActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import translateTo from '../../utils/translation';

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
  const [folderAction, setFolderAction] = useState('newFolder');
  
  const docID = get(match, 'docID', null);

  useEffect(() => () => setRequestDone(false), []);
  
  useEffect(() => {
    if (activeSingleProperty.id) {
      const currentDoc = activeSingleProperty.documents.find((doc) => doc.id === docID);
      if (folderAction === 'newFolder') currentDoc.folder = '';
      initForm(currentDoc);
    }
  }, [activeSingleProperty.id, folderAction]);

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
              <div className="top dis-fl-row a-c jc-b mb-5">
                <span className="name dis-b fsize-500 fweight-500 txtDark700">
                  {translateTo('Add to folder', lang)}
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
                          name: `folder`,
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
