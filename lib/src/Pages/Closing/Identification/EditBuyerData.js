import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReduxField } from '@brixel-io/brixel-components/dist/form';
import translateTo from '../../../utils/translation';
import { deleteDocument } from '../../../actions/UploadActions';
import { IdentificationQuestions } from '../../../resources/Deals/Identification';
import multiPromiseAllCall from '@brixel-io/brixel-components/dist/helpers/uploads/MultiUpload';
import { saveClosingIdentification } from '../../../actions/DealActions';
const EditBuyerData = (props) => {
    const match = useParams();
    // PROPS
    const { dealID, forceStep = 0, formValue, handleDeleteDocument, handleSaveClosingIdentification, lang, loggedInUser, profileId, userType, } = props;
    // STATE
    const [formData, setFormData] = useState([]);
    const [filteredForm, setFilteredForm] = useState([]);
    const propID = get(match, 'propID', null);
    useEffect(() => {
        const getBuyerNameData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userName') || [];
        const getBuyerData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userData') || [];
        const fullFormBuyerData = getBuyerData ? [...get(getBuyerNameData, 'inputs', []), ...get(getBuyerData, 'inputs', [])] : [];
        const getUploadData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'document');
        const formDataUpload = get(getUploadData, 'inputs', []);
        if (forceStep === 1) {
            setFormData(formDataUpload);
        }
        else {
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
        if (propID) {
            const docsList = [];
            const formDataSave = cloneDeep(formValue);
            formValue.persons.forEach((person, index) => {
                const prs = get(person, 'document', []);
                if (prs.length > 0) {
                    Object.keys(prs).forEach((key) => {
                        const doc = prs[key];
                        if (doc.file) {
                            docsList.push({
                                idBuyer: `${index}:${key}`,
                                id: `${index}:${key}`,
                                ...doc,
                                isPrivate: true,
                                user: get(loggedInUser, 'id', null),
                            });
                        }
                        else {
                            formValue.persons[index].document[key] = doc;
                        }
                    });
                }
            });
            const dataDocuments = {
                allImgs: docsList,
                actions: 'documents',
                pageID: propID,
                smallLoader: 'sendData',
                user: get(loggedInUser, 'id', null),
            };
            const dataForm = {
                id: dealID,
                ...dataDocuments,
                smallLoader: 'sendData',
                personType: userType,
                ...formDataSave,
                saveAction: 'closingIdentification',
            };
            // eslint-disable-next-line no-console
            if (docsList.length > 0) {
                const docToSave = docsList.map((doc) => {
                    const idPerson = doc?.id.split(':')[0];
                    const idDoc = doc?.id.split(':')[1];
                    const docExt = doc?.name?.split('.')[1];
                    return ({
                        ...doc,
                        name: `${userType}-${idDoc}-${idPerson}-identification.${docExt}`,
                    });
                });
                multiPromiseAllCall(docToSave, 'genericDocument', { pageID: propID, companyID: '' })
                    .then((res) => {
                    res.forEach((doc) => {
                        const idPerson = doc.name.split('-')[2];
                        const idDoc = doc.name.split('-')[1];
                        if (!dataForm.persons[idPerson]?.document)
                            dataForm.persons[idPerson].document = [];
                        dataForm.persons[idPerson].document[idDoc] = doc;
                    });
                    handleSaveClosingIdentification(dataForm);
                });
            }
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
    };
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
    };
    useEffect(() => {
        const newQuest = [];
        formData.forEach((quest) => {
            let isValid = true;
            if (quest.condition) {
                isValid = checkCondition(quest);
            }
            if (quest.conditionsOr) {
                isValid = checkConditionOr(quest);
            }
            if (isValid)
                newQuest.push(quest);
        });
        setFilteredForm(newQuest);
    }, [formValue, forceStep, formData]);
    return (React.createElement("div", null,
        React.createElement(React.Fragment, null,
            React.createElement("h2", { className: "fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo(`Who is the ${userType} of the property?`, lang)),
            React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
                React.createElement("div", { className: "p-2 p-sm-5" },
                    forceStep === 0 && (React.createElement(React.Fragment, null,
                        React.createElement("h3", { className: "fweight-600 fsize-600" }, translateTo(get(formValue, `persons[${profileId}]`, null) ? 'Edit Person' : 'Add Person', lang)),
                        React.createElement("h6", { className: "mb-3 txtText700 fweight-400" }, translateTo('Fill the information below', lang)))),
                    React.createElement("div", { className: "dis-f a-c flex-wrap" }, filteredForm.map((field, i) => (React.createElement("div", { className: `${field.classWidthBox ? field.classWidthBox : 'w-perc-100'} ${field.classBoxWrapper || 'mt-3'}`, key: `frm_${i.toString()}` },
                        React.createElement(ReduxField, { form: "Identification", component: field.component, design: {
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
                            }, input: {
                                name: `persons[${profileId}].${get(field, 'name', '').replace('persons[0].', '')}`,
                                options: field.options,
                                placeholder: field.placeholder || '',
                                onRemove: (val) => onRemoveFile(val),
                                validate: field.validation,
                            }, labels: {
                                icons: field.icons,
                                label: translateTo(get(field, 'label', ''), lang),
                                labelLeft: translateTo(get(field, 'labelLeft', ''), lang),
                                labelType: field.labelType,
                            } }))))))))));
};
const mapStateToProps = (state) => ({
    formValue: get(state, 'brixelForm.Identification.values', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    initialValues: get(state, 'brixelForm.Identification.initialValues', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSaveClosingIdentification: bindActionCreators(saveClosingIdentification, dispatch),
    handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(EditBuyerData);
