import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import { change, isValid, Field, reduxForm } from 'redux-form';
import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, FactsOptions, BrixelCheckbox, BrixelCheckboxSingle } from '@brixel/brixel-components';
import Swiper from 'react-id-swiper';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';
import { getToken, createUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage } from '../../actions/CommonActions';
import Maps from '../../components/Map/Maps';
import { Questions } from '../../resources/packageFlowGetstartedQuestions.js';
import swissZipCode from '../../resources/swissZipCodes.json';

function Rewards(props) {

  return (
    <main id="getStarted">
      <h1>Property Rewards</h1>
    </main>
  );
}

Rewards.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  errorMsg: PropTypes.object.isRequired,
  errorValue: PropTypes.object,
  formValue: PropTypes.object,
  handleCreatePage: PropTypes.func.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
  handleGetToken: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  valid: PropTypes.bool,
};

Rewards.defaultProps = {
  errorMsg: {},
  errorValue: null,
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  errorMsg: get(state, 'common.errorMsg', null),
  formValue: get(state, 'form.GetStarted.values', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  valid: isValid('GetStarted')(state),
});
const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  checkValid() {
    dispatch(isValid('GetStarted'))
  },
  handleCreateUser: bindActionCreators(createUser, dispatch),
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Rewards);
