/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import { change, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import set from 'lodash/set';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon, BrixelDropdown,
  BrixelButtonTertiary, useOutsideAlerter, BrixelInputText,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import Loading from '../components/Loading';
// import {
//   setScreenNotification, preventExitFromScreen,
//   setUnsavedChangesModal, setModal,
// } from '../actions/CommonActions';

// COMPONENTS
import DrawerLayout from '../components/DrawerLayout';

const Properties = (props) => {
  // PROPS
  const {
    history, user, match, activeProperty,
  } = props;

  // PAGE ID
  const pageId = get(match, 'params.propId', activeProperty.id);
  const sectionPage = get(match, 'params.act', 'home');


  // if (!formValue.id) {
  //   return (
  //     <Loading />
  //   );
  // }

  return (
    <DrawerLayout>
      <div className="properties">
        <div className="properties-header dis-fl-row a-c jc-b mb-3 p-2">
          <div className="dis-fl-row a-c">
            <BrixelIcon
              className="mr-2"
              icon="properties"
              color="light"
              saturationTxt={100}
              background="primary"
              saturation={300}
            />

            <span className="docubox-title fweight-500 txtDark700">Properties</span>
          </div>

          <BrixelButtonIcon
            className="shadow-3dp"
            noBorder
            background="white"
            color="dark"
            saturationTxt={700}
            icon="close-small"
            onClick={() => history.push(`/${pageId}/${sectionPage}`)}
          />
        </div>
      </div>
    </DrawerLayout>
  );
};

Properties.propTypes = {
  history: PropTypes.object.isRequired,
  activeProperty: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Properties.defaultProps = {
};

const mapStateToProps = (state) => ({
  user: get(state, 'user.loggedUser', {}),
  activeProperty: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Properties);
