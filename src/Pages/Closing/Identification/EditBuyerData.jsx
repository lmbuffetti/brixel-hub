/* eslint-disable no-nested-ternary */
import cloneDeep from 'lodash/cloneDeep';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { connect } from 'react-redux';
import {
  BrixelIcon,
  ReduxField,
} from '@brixel/brixel-components';
import { deleteDocument } from '../../../actions/UploadActions';
import { IdentificationQuestions } from '../../../resources/Identification';

const EditBuyerData = (props) => {
  /* const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams(); */
  // PROPS
  const {
    dealID,
    forceStep,
    formValue,
    handleDeleteDocument,
    onCloseEdit,
    profileId,
  } = props;
  // STATE
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const getBuyerNameData = IdentificationQuestions(true).find((quest) => quest.history === 'buyerName');
    const getBuyerData = IdentificationQuestions(true).find((quest) => quest.history === 'buyerData');
    const fullFormBuyerData = getBuyerNameData.inputs.concat(getBuyerData.inputs);
    const getUploadData = IdentificationQuestions(true).find((quest) => quest.history === 'document');
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
    dataForm.persons[profileId].document = {};
    const data = {
      ...dataForm,
      dealID,
      id: file.id,
      saveAction: 'closingIdentification',
      smallLoader: 'removeData',
    };
    handleDeleteDocument(data);
  };

  return (
    <div>
      <>
        <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
          Who is the buyer of the property?
        </h2>
        <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite">
          <div className="p-5">
            <BrixelIcon
              className="mb-2"
              onClick={() => onCloseEdit()}
              icon="arrow-left-small"
            />
            {
              forceStep === 0 && (
                <>
                  <h3>{get(formValue, `persons[${profileId}]`, null) ? 'Edit Person' : 'Add Person'}</h3>
                  <h6 className="mb-3">
                    Fill the information below
                  </h6>
                </>
              )
            }
            <div className="dis-f a-c flex-wrap">
              {
                formData.map((field, i) => (
                  <div
                    className={`${field.classWidthBox ? field.classWidthBox : 'w-perc-100'} ${field.classBoxWrapper || 'mt-3'}`}
                    key={i.toString()}
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
                      }}
                      labels={{
                        icons: field.icons,
                        label: field.label,
                        labelLeft: field.labelLeft,
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
  onCloseEdit: PropTypes.func.isRequired,
  profileId: PropTypes.number.isRequired,
};

EditBuyerData.defaultProps = {
  forceStep: 0,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Identification.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(EditBuyerData);
