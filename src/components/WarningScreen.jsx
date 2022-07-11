/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonIcon, translateTo,
} from '@brixel/brixel-components';
import { reset } from '@brixel/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setModal } from '../actions/CommonActions';

const WarningScreen = (props) => {
  const {
    formName,
    handleReset,
    handleSetModal,
    initialValue,
    isSmallLoading,
    lang,
    onClose,
    saveFunc,
  } = props;

  const [savedData, setSavedData] = useState(false);

  useEffect(() => {
    if (isSmallLoading.saveData === false && savedData) {
      onClose();
      handleSetModal({ state: false });
    }
  }, [isSmallLoading]);

  const closeAndReset = () => {
    handleReset(formName, initialValue);
    onClose();
    handleSetModal({ state: false });
  };

  const saveData = () => {
    saveFunc();
    setSavedData(true);
  };

  return (
    <div className="brixel-modal " id="">
      <div className="w-perc-100 min-h-fix-sm-320 w-fix-sm-480 modal-container dis-fl-col jc-fs bgLight100">
        <div className="modal-header dis-f jc-fe a-c">
          <BrixelButtonIcon
            icon="close-small"
            ghost
            theme="dark"
            onClick={() => handleSetModal({ state: false })}
          />
        </div>
        <div className="modal-title">
          <div className="title-container dis-f a-c">
            <BrixelIcon
              icon="alert"
              color="red"
            />
            <span className="heading3 ml-3">{translateTo('Oops!', lang)}</span>
          </div>
        </div>
        <div className="modal-body ta-l bgLight100">
          <div>{translateTo('You have unsaved changes', lang)}</div>
        </div>
        <div className="modal-footer dis-f jc-b jc-fe-md bgWhite jc-b">
          <BrixelButtonSecondary
            label={translateTo('Discard and exit', lang)}
            rounded
            theme="red"
            onClick={() => closeAndReset()}
          />

          <BrixelButtonPrimary
            className="ml-2"
            rounded
            label={translateTo('Save and exit', lang)}
            onClick={() => saveData()}
            isLoading={isSmallLoading.saveData}
          />
        </div>
      </div>
    </div>
  );
};

WarningScreen.propTypes = {
  formName: PropTypes.string.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  saveFunc: PropTypes.func,
};

WarningScreen.defaultProps = {
  saveFunc: null,
};

const mapStateToProps = (state, ownProps) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, `brixelForm[${ownProps.formName}].values`, {}),
  initialValue: get(state, `brixelForm[${ownProps.formName}].initialValues`, {}),
  isSmallLoading: get(state, 'common.isSmallLoading', { }),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleReset(form, value) {
    dispatch(reset(form, value));
  },
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(WarningScreen);
