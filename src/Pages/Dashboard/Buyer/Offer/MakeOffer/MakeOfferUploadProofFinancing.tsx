import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  BrixelTooltip,
  BrixelIcon,
} from '@brixel-io/brixel-components';
import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import translateTo from '../../../../../utils/translation';
import Dropzone from 'react-dropzone';
import isArray from 'lodash/isArray';
import {change} from '@brixel-io/brixel-components/dist/form';
import {toBase64} from '../../../../../utils/helpers';

type MakeOfferUploadProofFinancingType = {
  changeFieldValue: (name: string, value: File[]) => void
  activeSingleProperty: PropertyType
  lang: string
}

const MakeOfferUploadProofFinancing = ({
  changeFieldValue,
  lang,
}: MakeOfferUploadProofFinancingType) => {
  const [documentsUploaded, setDocumentsUploaded] = useState<any[]>([]);
  const [showError, setShowError] = useState('');
  // DROPZONE SETTINGS
  useEffect(() => {
    changeFieldValue('documents', documentsUploaded);
  }, [documentsUploaded]);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFiles = [...acceptedFiles];
      acceptedFiles.forEach(async (file) => {
        const base64 = await toBase64(file);
        setDocumentsUploaded((prev) => ([...prev, base64]));
      })
      console.log(newFiles, acceptedFiles)
      setShowError('')
    } else {
      setShowError('Please make sure file is in correct format and size');
    }
  };

  const removeFile = (index) => {
    setDocumentsUploaded(documentsUploaded.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-fix-768 mx-a">
      <p className="dis-f jc-fe a-c mb-2">
        <span className="fsize-200 mr-1">{translateTo('What is this?', lang)}</span>
        <BrixelTooltip
          description={translateTo('A proof of financing (also called financing certificate) is a non-binding assessment of your financial situation. You can use it to prove to us that you can afford the house or apartment.', lang)}
          lang={lang}
        />
      </p>
      <div>
        <Dropzone
          accept={{'': ['.jpeg', '.pdf']}}
          maxSize={10000000}
          onDrop={(acceptedFiles)=> onDrop(acceptedFiles)}
        >
          {({getRootProps, getInputProps}) => (
            <div
              {...getRootProps()}
              className="bgGreen50 brdRadius ta-c py-10 px-5 upload-container brdSmallDashed brdGreen200"
            >
              <input {...getInputProps()}/>
              <>
                <p className="mt-2 txtGreen400">
                  <span className='td-u fweight-500 cur-poi'>{translateTo('Click to upload', lang)}</span>
                  <span> {translateTo('or drag and drop files here', lang)}</span>
                </p>
                {(!documentsUploaded || (isArray(documentsUploaded) && documentsUploaded.length === 0)) && (<span className='brdSmallTop brdText100 w-fix-104 my-2 ml-a mr-a'></span>)}

                <span className="fsize-300 txtText400">{translateTo('All standard formats are supported, with a maximum file size of 10 MB', lang)}</span>
              </>
              {
                showError && (
                  <p className="txtRed400 mt-2">{translateTo(showError, lang)}</p>
                )
              }
            </div>
          )}
        </Dropzone>

        {
          documentsUploaded.map((file, index) => (
            <div key={index} className="dis-f a-c jc-sb bgWhite brdRadius p-3 mt-3 dis-f jc-b a-c">
              <div className="dis-f a-c">
                <BrixelIcon
                  background="green"
                  saturation={100}
                  color="green"
                  saturationTxt={400}
                  icon="document"
                />
                <p className="fsize-300 txtText600 ml-2">{file.file}</p>
              </div>
              <BrixelIcon
                color="red"
                saturationTxt={400}
                icon="bin"
                onClick={() => removeFile(index)}
              />
            </div>
          ))
        }

      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || null,
  documentsUploaded: state?.brixelForm?.makeOffer?.values?.proofOfFinancing || [],
  lang: state?.common?.language || 'en',
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('makeOffer', field, value));
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(MakeOfferUploadProofFinancing);
