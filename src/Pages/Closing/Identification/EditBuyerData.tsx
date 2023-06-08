import React, {useEffect, useState} from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {bindActionCreators, compose} from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {ReduxField} from '@brixel-io/brixel-components/dist/form';
import translateTo from '../../../utils/translation';
import {deleteDocument, uploadDocument} from '../../../actions/UploadActions';
import {IdentificationQuestions} from '../../../resources/Deals/Identification';
import {DocumentType, QuestionInputType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {EditBuyerDataType} from '../../../@types/Pages/Closing/Identification/EditBuyerData';

const EditBuyerData = (props: EditBuyerDataType) => {
  const match = useParams();
  // PROPS
  const {
    dealID,
    forceStep = 0,
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
  const [formData, setFormData] = useState<QuestionInputType[]>([]);
  const [filteredForm, setFilteredForm] = useState<QuestionInputType[]>([]);

  const propID = get(match, 'propID', null);

  useEffect(() => {
    const getBuyerNameData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userName') || [];
    const getBuyerData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userData') || [];

    const fullFormBuyerData = getBuyerData ? get(getBuyerNameData, 'inputs', []).concat(get(getBuyerData, 'inputs', []) || []) : [];
    const getUploadData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'document');
    const formDataUpload = get(getUploadData, 'inputs', []);
    if (forceStep === 1) {
      setFormData(formDataUpload);
    } else {
      setFormData(fullFormBuyerData);
    }
  }, [forceStep]);

  const onRemoveFile = (file) => {
    const dataForm = cloneDeep(formValue);
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
    const newDoc: DocumentType = get(formValue, `persons[${profileId}].document`, []).find((doc) => get(doc, 'file', null)) || {};
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
  const checkCondition = (quest) => {
    let isValid = true;
    quest.condition.forEach((item) => {
      if (item?.name && get(formValue, item.name, null) !== item.value) {
        isValid = false;
      }
    });
    return isValid;
  }
  const checkConditionOr = (quest) => {
    let isValid = false;
    quest.conditionsOr.forEach((item) => {
      if (has(item, 'value')) {
        if (item?.name && ((item.value === 'isPositive' && get(formValue, item.name, 0) > 0) || get(formValue, item.name, 'a') === item.value)) {
          isValid = true;
        }
      }
      if (item.name && item.noValue && get(formValue, item.name, null) !== item.noValue) {
        isValid = true;
      }
    });
    return isValid;
  }
  useEffect(() => {
    const newQuest: QuestionInputType[] = [];
    formData.forEach((quest) => {
      let isValid = true;
      if (quest.condition) {
        isValid = checkCondition(quest);
      }
      if (quest.conditionsOr) {
        isValid = checkConditionOr(quest);
      }
      if (isValid) newQuest.push(quest);
    });
    setFilteredForm(newQuest);
  }, [formValue, forceStep, formData]);

  return (
    <div>
      <>
        <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
          {translateTo(`Who is the ${userType} of the property?`, lang)}
        </h2>
        <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50">
          <div className="p-2 p-sm-5">
            {
              forceStep === 0 && (
                <>
                  <h3 className="fweight-600 fsize-600">
                    {translateTo(get(formValue, `persons[${profileId}]`, null) ? 'Edit Person' : 'Add Person', lang)}
                  </h3>
                  <h6 className="mb-3 txtText700 fweight-400">
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
                        fluid: field.fluid,
                        iconClass: field.iconClass,
                        inputClassName: field.className || '',
                        isHorizontal: field.isHorizontal,
                        pdClass: field.pdClass,
                        large: field.large,
                        svgSupport: field.svgSupport,
                        svgWidth: field.svgWidth,
                      }}
                      input={{
                        name: `persons[${profileId}].${get(field, 'name', '').replace('persons[0].', '')}`,
                        options: field.options,
                        placeholder: field.placeholder || '',
                        onRemove: (val) => onRemoveFile(val),
                        validate: field.validation,
                      }}
                      labels={{
                        icons: field.icons,
                        label: translateTo(get(field, 'label', ''), lang),
                        labelLeft: translateTo(get(field, 'labelLeft', ''), lang),
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
