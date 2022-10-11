/* eslint-disable no-nested-ternary */
import translateTo from '../../../utils/translation';
import cloneDeep from 'lodash/cloneDeep';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReduxField } from '@brixel/brixel-components/dist/form';
import { deleteDocument, uploadDocument } from '../../../actions/UploadActions';
import { IdentificationQuestions } from '../../../resources/Deals/Identification';

const EditBuyerData = (props) => {
  /* const history = {
    push: useNavigate(),
    location: useLocation(),
  }; */
  const match = useParams();
  // PROPS
  const {
    dealID,
    forceStep,
    formValue,
    initialValues,
    handleDeleteDocument,
    handleUploadDocument,
    lang,
    loggedInUser,
    profileId,
    userType,
  } = props;
  // STATE
  const [formData, setFormData] = useState([]);
  const [filteredForm, setFilteredForm] = useState([]);
  
  const propID = get(match, 'propID', null);

  useEffect(() => {
    const getBuyerNameData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userName');
    const getBuyerData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userData');
    const fullFormBuyerData = getBuyerNameData.inputs.concat(getBuyerData.inputs);
    const getUploadData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'document');
    const formDataUpload = get(getUploadData, 'inputs', []);
    switch (forceStep) {
      case 1:
        setFormData(formDataUpload);
        break;
      default:
        setFormData(fullFormBuyerData);
    }
  }, [forceStep]);

  const onRemoveFile = (file) => {
    const dataForm = cloneDeep(formValue);
    // dataForm.persons[profileId].document = {};
    const data = {
      ...dataForm,
      dealID,
      id: file.id,
      indexPerson: profileId,
      saveAction: 'closingIdentification',
      smallLoader: 'removeData',
      personType: userType,
    };
    handleDeleteDocument(data);
  };
  
  useEffect(() => {
    const newDoc = get(formValue, `persons[${profileId}].document`, []).find((doc) => get(doc, 'file', null));
    if (newDoc && get(initialValues, `persons[${profileId}].fullName`, null)) {
      const indexDoc = get(formValue, `persons[${profileId}].document`, []).findIndex((doc) => get(doc, 'file', null));
      const data = {
        id: propID,
        dealID,
        indexDoc,
        indexPerson: profileId,
        saveAction: 'closingIdentification',
        smallLoader: 'savingData',
        formValue,
        docs: {
          ...newDoc,
          user: get(loggedInUser, 'id', null),
          isPrivate: true,
          pageID: propID,
        },
      }
      handleUploadDocument(data);
    }
  }, [get(formValue, `persons[${profileId}].document`)]);
  

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    const newQuest = [];
    formData.map((quest) => {
      let isValid = true;
      if (quest.condition) {
        quest.condition.map((item) => {
          if (get(formValue, item.name, null) !== item.value) {
            isValid = false;
          }
          return null;
        });
        if (isValid) newQuest.push(quest);
      } else if (quest.conditionsOr) {
        isValid = false;
        quest.conditionsOr.map((item) => {
          if (has(item, 'value')) {
            if ((item.value === 'isPositive' && get(formValue, item.name, 0) > 0) || get(formValue, item.name, 'a') === item.value) {
              isValid = true;
            }
          }
          if (item.noValue && get(formValue, item.name, null) !== item.noValue) {
            isValid = true;
          }
          return null;
        });
        if (isValid) newQuest.push(quest);
      } else {
        newQuest.push(quest);
      }
      return null;
    });
    setFilteredForm(newQuest);
  }, [formValue, forceStep, formData]);

  return (
    <div>
      <>
        <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
          {translateTo(`Who is the ${userType} of the property?`, lang)}
        </h2>
        <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100">
          <div className="p-2 p-sm-5">
            {
              forceStep === 0 && (
                <>
                  <h3 className="fweight-600 fsize-600">
                    {translateTo(get(formValue, `persons[${profileId}]`, null) ? 'Edit Person' : 'Add Person', lang)}
                  </h3>
                  <h6 className="mb-3 txtAltGrey700 fweight-400">
                    {translateTo('Fill the information below', lang)}
                  </h6>
                </>
              )
            }
            <div className="dis-f a-c flex-wrap">
              {
                filteredForm.map((field, i) => (
                  <div
                    className={`${field.classWidthBox ? field.classWidthBox : 'w-perc-100'} ${field.classBoxWrapper || 'mt-3'}`}
                    key={`frm_${i.toString()}`}
                  >
                    <ReduxField
                      form="Identification"
                      component={field.component}
                      design={{
                        cardLayout: field.cardLayout,
                        cardSmall: field.cardSmall,
                        className: field.className || '',
                        classNameParent: field.classNameParent || '',
                        compact: field.compact,
                        fluid: field.fluid,
                        formatText: field.formatText,
                        iconClass: field.iconClass,
                        inputClassName: field.className || '',
                        isHorizontal: field.isHorizontal,
                        pdClass: field.pdClass,
                        large: field.large,
                        section: field.section,
                        showCountCharacters: field.showCountCharacters,
                        stretched: field.stretched,
                        svgSupport: field.svgSupport,
                        svgWidth: field.svgWidth,
                        wrapClass: field.wrapClass || '',
                      }}
                      input={{
                        name: `persons[${profileId}].${field.name.replace('persons[0].', '')}`,
                        options: field.options,
                        placeholder: field.placeholder || '',
                        onRemove: (val) => onRemoveFile(val),
                        validate: field.validation,
                      }}
                      labels={{
                        icons: field.icons,
                        label: translateTo(field.label, lang),
                        labelLeft: translateTo(field.labelLeft, lang),
                        labelType: field.labelType,
                      }}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

EditBuyerData.propTypes = {
  dealID: PropTypes.string.isRequired,
  forceStep: PropTypes.number,
  formValue: PropTypes.object.isRequired,
  handleDeleteDocument: PropTypes.func.isRequired,
  handleUploadDocument: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  profileId: PropTypes.number.isRequired,
  userType: PropTypes.string.isRequired,
};

EditBuyerData.defaultProps = {
  forceStep: 0,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Identification.values', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  initialValues: get(state, 'brixelForm.Identification.initialValues', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(EditBuyerData);
