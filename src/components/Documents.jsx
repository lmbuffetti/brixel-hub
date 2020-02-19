/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  withRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary, BrixelButtonIcon, BrixelButtonTertiary,
  BrixelTabs, BrixelButtonSecondary, BrixelStatus,
} from '@brixel/brixel-components';
import { reduxForm } from 'redux-form';
import { change, Field } from 'redux-form';
import get from 'lodash/get';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';
import LoadingSimple from '../components/LoadingSimple';
// import {
//   setScreenNotification, preventExitFromScreen,
//   setUnsavedChangesModal, setModal,
// } from '../actions/CommonActions';
import {
  updateProperty, formValue,
} from '../actions/PropertyActions';

// COMPONENTS
import SidebarLayout from '../components/SidebarLayout';

const Documents = (props) => {
  const {
    history, formValue,
  } = props;

  if (!formValue.id) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <SidebarLayout>
        <div className="p-2">
          <div className="dis-f a-c jc-b mb-5">
            <h3>Brixel Coming In Town</h3>
            <BrixelButtonIcon
              className="shadow-3dp"
              noBorder
              background="white"
              color="dark"
              saturationTxt={700}
              icon="close-small"
              onClick={() => history.push('/home')}
            />
          </div>
          <div>
            {formValue.id}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

Documents.propTypes = {
  history: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
};

Documents.defaultProps = {
};

const DocumentsForm = reduxForm({
  // a unique name for the form
  form: 'documentsForm',
  enableReinitialize: true,
})(Documents);

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.documentsForm.values', {}),
  initialValues: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('documentsForm', field, value));
  },
  // setNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSaveProperty: bindActionCreators(updateProperty, dispatch),
  // setPreventExit: bindActionCreators(preventExitFromScreen, dispatch),
  // setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
  // handleSetModal: bindActionCreators(setModal, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentsForm));

