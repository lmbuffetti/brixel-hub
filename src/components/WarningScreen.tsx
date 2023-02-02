import React, {useEffect, useState} from 'react';
import get from 'lodash/get';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon} from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import {reset} from '@brixel/brixel-components/dist/form';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {setModal} from '../actions/CommonActions';
import type {WarningScreenType} from '../@types/components/WarningScreen';

const WarningScreen = (props: WarningScreenType) => {
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
    if (saveFunc) saveFunc();
    setSavedData(true);
  };

  return (
    <div className="brixel-modal " id="">
      <div className="w-perc-100 min-h-fix-sm-320 w-fix-sm-480 modal-container dis-fl-col jc-fs bgText25">
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
        <div className="modal-body ta-l bgText25">
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
