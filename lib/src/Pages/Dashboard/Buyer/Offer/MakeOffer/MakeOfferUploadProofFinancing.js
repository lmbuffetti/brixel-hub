import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrixelTooltip, BrixelIcon, } from '@brixel-io/brixel-components';
import translateTo from '../../../../../utils/translation';
import Dropzone from 'react-dropzone';
import isArray from 'lodash/isArray';
import { change } from '@brixel-io/brixel-components/dist/form';
import { toBase64 } from '../../../../../utils/helpers';
const MakeOfferUploadProofFinancing = ({ formValues, changeFieldValue, lang, }) => {
    const [documentsUploaded, setDocumentsUploaded] = useState(null);
    const [showError, setShowError] = useState('');
    useEffect(() => {
        setDocumentsUploaded(formValues?.documents || []);
    }, []);
    // DROPZONE SETTINGS
    useEffect(() => {
        if (documentsUploaded !== null)
            changeFieldValue('documents', documentsUploaded);
    }, [documentsUploaded]);
    const onDrop = async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            acceptedFiles.forEach(async (file) => {
                const base64 = await toBase64(file);
                setDocumentsUploaded((prev) => ([...prev || [], base64]));
            });
            setShowError('');
        }
        else {
            setShowError('Upload failed. The file exceeds the allowed limit.');
        }
    };
    const removeFile = (index) => {
        if (documentsUploaded) {
            setDocumentsUploaded(documentsUploaded.filter((_, i) => i !== index));
        }
    };
    return (React.createElement("div", { className: "max-w-fix-600 mx-a" },
        React.createElement("p", { className: "dis-f jc-fe a-c mb-2" },
            React.createElement("span", { className: "fsize-200 txtText600 mr-1" }, translateTo('What is this?', lang)),
            React.createElement(BrixelTooltip, { description: translateTo('A proof of financing (also called financing certificate) is a non-binding assessment of your financial situation. You can use it to prove to us that you can afford the house or apartment.', lang), lang: lang })),
        React.createElement("div", null,
            React.createElement(Dropzone, { accept: { '': ['.jpeg', '.pdf', '.jpg', '.png'] }, maxSize: 10000000, onDrop: (acceptedFiles) => onDrop(acceptedFiles) }, ({ getRootProps, getInputProps }) => (React.createElement("div", { ...getRootProps(), className: "bgGreen25 mb-2 brdRadius ta-c py-3 px-2 py-sm-10 px-sm-5 upload-container" },
                React.createElement("input", { ...getInputProps() }),
                React.createElement(React.Fragment, null,
                    React.createElement("p", { className: "mt-2 txtGreen400" },
                        React.createElement("span", { className: 'td-u fweight-500 cur-poi' }, translateTo('Click to upload', lang)),
                        React.createElement("span", null,
                            " ",
                            translateTo('or drag and drop files here', lang))),
                    (!documentsUploaded || (isArray(documentsUploaded) && documentsUploaded.length === 0)) && (React.createElement("span", { className: 'brdSmallTop brdText100 w-fix-104 my-2 ml-a mr-a' })),
                    React.createElement("span", { className: "fsize-300 max-w-fix-304 ml-a mr-a mt-1 txtText400 dis-b" }, translateTo('All standard formats are supported, with a maximum file size of 10 MB', lang)))))),
            showError && (React.createElement("p", { className: "fsize-200 txtRed400 mt-2" }, translateTo(showError, lang))),
            documentsUploaded && documentsUploaded.map((file, index) => (React.createElement("div", { key: index, className: "dis-f a-c jc-sb bgWhite brdRadius p-2 brdSmall brdText100 mt-2 dis-f jc-b a-c" },
                React.createElement("div", { className: "dis-f a-c" },
                    React.createElement(BrixelIcon, { background: "green", saturation: 100, color: "green", saturationTxt: 400, icon: "document" }),
                    React.createElement("p", { className: "fsize-300 ml-2" }, file.name)),
                React.createElement(BrixelIcon, { color: "red", saturationTxt: 400, icon: "bin", onClick: () => removeFile(index) })))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || null,
    documentsUploaded: state?.brixelForm?.makeOffer?.values?.proofOfFinancing || [],
    formValues: state?.brixelForm?.makeOffer?.values || {},
    lang: state?.common?.language || 'en',
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('makeOffer', field, value));
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(MakeOfferUploadProofFinancing);
