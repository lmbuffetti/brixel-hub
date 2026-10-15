import React, { useEffect, useState } from 'react';
import { BrixelUploadFile, change } from '@brixel-io/brixel-components/dist/form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelIcon } from '@brixel-io/brixel-components';
import translateTo from '../../../../utils/translation';
const BaloiseRegistration = (props) => {
    const { changeFieldValue, lang, } = props;
    const [documentUploading, setDocumentUploading] = useState({});
    const documentLists = [
        {
            icon: 'page',
            iconColor: 'blue',
            iconDone: 'check-thin',
            label: 'Latest tax declaration',
            name: 'latestDeclaration',
        },
        {
            icon: 'page',
            iconColor: 'blue',
            iconDone: 'check-thin',
            label: 'Latest proof of income, incl. proof of bonus if applicable',
            name: 'latestIncomeProof',
        },
        {
            icon: 'page',
            iconColor: 'blue',
            iconDone: 'check-thin',
            label: 'Pension fund statement',
            name: 'pensionFund',
        },
        {
            icon: 'page',
            iconColor: 'blue',
            iconDone: 'check-thin',
            label: 'ID copy and settlement permit if applicable',
            name: 'idCopy',
        },
    ];
    useEffect(() => {
        const uploadingFile = [];
        Object.keys(documentUploading).forEach((key) => {
            uploadingFile.push(documentUploading[key]);
        });
        changeFieldValue('documents', uploadingFile);
    }, [documentUploading]);
    const uploadingFiles = (file, name) => {
        const newFiles = { ...documentUploading };
        newFiles[name] = file;
        setDocumentUploading(newFiles);
    };
    const removeFiles = (_file, name) => {
        const newFiles = { ...documentUploading };
        delete newFiles[name];
        setDocumentUploading(newFiles);
    };
    return (React.createElement("div", null,
        React.createElement("h2", { className: "fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo('Learn within 48 hours if you can afford your desired home.', lang)),
        React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
            React.createElement("div", { className: "" },
                React.createElement("h6", { className: "fweight-600 fsize-500 txtText900 ta-c px-5 pt-5" }, translateTo('Baloise needs the following documents from you:', lang)),
                React.createElement("div", { className: "mt-3" }, documentLists.map((docs, i) => (React.createElement(React.Fragment, { key: `docs${i.toString()}` },
                    React.createElement("div", { className: "dis-f jc-b a-c w-perc-100 px-5 py-3" },
                        documentUploading[docs.name] ? (React.createElement("div", null,
                            React.createElement(BrixelIcon, { color: docs.iconColor, className: "w-fix-24", icon: docs.iconDone }),
                            React.createElement("span", { className: "ml-2" }, translateTo(documentUploading[docs.name].name, lang)))) : (React.createElement("div", null,
                            React.createElement(BrixelIcon, { color: docs.iconColor, className: "w-fix-24", icon: docs.icon }),
                            React.createElement("span", { className: "ml-2" }, translateTo(docs.label, lang)))),
                        React.createElement(BrixelUploadFile, { input: {
                                name: docs.name,
                                onChange: (val) => uploadingFiles(val, docs.name),
                                onRemove: (val) => removeFiles(val, docs.name),
                            }, hideFileDescription: true, acceptedFile: ['jpg', 'png', 'application/pdf'] })),
                    React.createElement("hr", { className: "brdText50" }))))),
                React.createElement("p", { className: "p-5" }, translateTo('Note: If you do not have all the documents at hand, you can submit them later.', lang))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyDocs: get(state, 'property.activeSingleProperty.documents', []),
    formValue: get(state, 'brixelForm.offerFlow.values', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('offerFlow', field, value));
    },
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(BaloiseRegistration);
