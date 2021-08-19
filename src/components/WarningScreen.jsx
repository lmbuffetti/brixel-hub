/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  ReduxField, BrixelButtonPrimary, BrixelInputText,
  reset, initializeForm, BrixelSelect, destroy, BrixelButtonIcon,
  FactsOptions,
} from '@brixel/brixel-components';
import {
  bindActionCreators, compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  createDeal,
} from '../../actions/DealActions';
// import {
//   getLeadListings,
// } from '../../actions/LeadActions';

// COMPONENTS
import SplashScreen from './SplashScreen';

const WarningScreen = (props) => {
  const {
    activeSingleProperty,
    handleCreateDeal,
    // handleGetLeads,
    formValue,
    destroyForm,
    history,
    loggedInUser,
  } = props;

  const {
    factsOptions,
  } = FactsOptions;

  return (
    <SplashScreen
      closeLink={`/${activeSingleProperty.id}/prospects`}
      className="create-deal"
      closeOutside={false}
    >
      <div className="add-deal-container w-perc-100 h-perc-100 dis-fl-col p-2 p-lg-0">
        <div className="dis-f jc-b a-c mb-4">
          <h5>Create new deal</h5>
          <div>
            <BrixelButtonIcon
              ghost
              theme="dark"
              icon="close-small"
              onClick={() => history.push(`/${activeSingleProperty.id}/prospects`)}
            />
          </div>
        </div>
        <div className="dis-fl-col max-w-fix-520 w-perc-100 h-perc-100 ml-a mr-a">
          <ReduxField
            form="CreateDeal"
            design={{
              className: 'w-perc-100 mb-2',
            }}
            input={{
              name: 'name',
              placeholder: 'Name',
            }}
            labels={{
              label: 'Name',
            }}
            component={BrixelInputText}
          />
          <ReduxField
            form="CreateDeal"
            design={{
              className: 'w-perc-100 mb-2',
            }}
            input={{
              name: 'email',
              placeholder: 'email@brixel.io',
              type: 'email',
            }}
            labels={{
              label: 'Email',
            }}
            component={BrixelInputText}
          />
          <ReduxField
            form="CreateDeal"
            design={{
              className: 'w-perc-100 mb-2',
            }}
            input={{
              name: 'phone',
              type: 'text',
              placeholder: '123456789',
            }}
            labels={{
              label: 'Phone',
            }}
            inputFormat={{
              formatType: 'tel',
            }}
            component={BrixelInputText}
          />
          <ReduxField
            form="CreateDeal"
            design={{
              className: 'w-perc-100 mb-2',
            }}
            input={{
              name: 'stage',
              placeholder: 'Select deal stage',
              options: factsOptions.progressBarDealsOptions,
              progressState: '',
              readOnly: false,
            }}
            labels={{
              label: 'Stage',
            }}
            component={ProgressBar}
          />
          <ReduxField
            form="CreateDeal"
            design={{
              className: 'w-perc-100 mb-2',
            }}
            input={{
              name: 'actionStub',
              placeholder: 'Select deal action',
              options: actionOptions,
            }}
            labels={{
              label: 'Action',
            }}
            component={BrixelSelect}
          />
        </div>
        <div>
          <BrixelButtonPrimary
            disabled={!checkValidateField()}
            rounded
            onClick={() => createNewDeal()}
            label="Create deal"
            className="as-fe"
            rightIcon="arrow-right-small"
          />
        </div>
      </div>
    </SplashScreen>
  );
};

WarningScreen.propTypes = {
  destroyForm: PropTypes.func.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleCreateDeal: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
};

WarningScreen.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: get(state, 'common.isLoading', 0) > 0,
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.CreateDeal.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  resetForm(data) {
    (dispatch(reset('CreateDeal', data)));
  },
  initForm(value) {
    dispatch(initializeForm('CreateDeal', value));
  },
  destroyForm() {
    dispatch(destroy('CreateDeal'));
  },
  handleCreateDeal: bindActionCreators(createDeal, dispatch),
  // handleGetLeads: bindActionCreators(getLeadListings, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(WarningScreen);
