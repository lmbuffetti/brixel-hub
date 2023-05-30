import React, {useEffect, useState} from 'react';
import {BrixelUploadFile, change} from '@brixel/brixel-components/dist/form';
import {compose} from 'redux';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {BrixelIcon} from '@brixel/brixel-components';
import translateTo from '../../../../utils/translation';
import type {BaloiseRegistrationType} from '../../../../@types/Pages/Closing/Offers/Flow/BaloiseRegistration';

const BaloiseRegistration = (props: BaloiseRegistrationType) => {
  const {
    changeFieldValue,
    lang,
  } = props;
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
    const uploadingFile: object[] = [];
    Object.keys(documentUploading).forEach((key) => {
      uploadingFile.push(documentUploading[key]);
    })
    changeFieldValue('documents', uploadingFile);
  }, [documentUploading]);


  const uploadingFiles = (file, name) => {
    const newFiles = {...documentUploading};
    newFiles[name] = file;
    setDocumentUploading(newFiles);
  }

  const removeFiles = (_file, name) => {
    const newFiles = {...documentUploading};
    delete newFiles[name];
    setDocumentUploading(newFiles);
  }

  return (
    <div>
      <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
        {translateTo('Learn within 48 hours if you can afford your desired home.', lang)}
      </h2>
      <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50">
        <div className="">
          <h6 className="fweight-600 fsize-500 txtText900 ta-c px-5 pt-5">
            {translateTo('Baloise needs the following documents from you:', lang)}
          </h6>

          <div className="mt-3">

            {
              documentLists.map((docs, i) => (
                <React.Fragment key={`docs${i.toString()}`}>
                  <div
                    className="dis-f jc-b a-c w-perc-100 px-5 py-3"
                  >
                    {
                      documentUploading[docs.name] ? (
                        <div>
                          <BrixelIcon
                            color={docs.iconColor}
                            className="w-fix-24"
                            icon={docs.iconDone}
                          />
                          <span className="ml-2">
                            {translateTo(documentUploading[docs.name].name, lang)}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <BrixelIcon
                            color={docs.iconColor}
                            className="w-fix-24"
                            icon={docs.icon}
                          />
                          <span className="ml-2">
                            {translateTo(docs.label, lang)}
                          </span>
                        </div>
                      )
                    }

                    <BrixelUploadFile
                      input={{
                        name: docs.name,
                        onChange: (val) => uploadingFiles(val, docs.name),
                        onRemove: (val) => removeFiles(val, docs.name),
                      }}
                      hideFileDescription
                      acceptedFile={['jpg', 'png', 'application/pdf']}
                    />
                  </div>
                  <hr className="brdText50" />
                </React.Fragment>
              ))
            }
          </div>
          <p className="p-5">
            {translateTo('Note: If you do not have all the documents at hand, you can submit them later.', lang)}
          </p>
        </div>
      </div>
    </div>
  );
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BaloiseRegistration);
