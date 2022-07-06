/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  FactsOptions,
} from '@brixel/brixel-components';
import {
  BrixelInputText,
  BrixelSelect,
  ReduxField,
  destroy,
  initializeForm,
  reset,
} from '@brixel/brixel-components/dist/form';
import {
  bindActionCreators, compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  createDeal,
} from '../../actions/DealActions';

// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import ProgressBar from '../../components/ProgressBar';

const CreateDeal = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    activeSingleCompany,
    handleCreateDeal,
    formValue,
    destroyForm,
  } = props;
  
  const {
    factsOptions,
  } = FactsOptions;
  
  useEffect(() => () => destroyForm(), []);
  
  const actionOptions = [
    {
      label: 'Marked Page as favorite',
      value: 'add-favorite',
    },
    {
      label: 'Wrote message',
      value: 'message',
    },
    {
      label: 'Scheduled a visit',
      value: 'schedule',
    },
    {
      label: 'Accessed a document',
      value: 'get-document',
    },
    {
      label: 'Phone call',
      value: 'phone-call',
    },
  ];
  
  const checkValidateField = () => {
    let isValid = false;
    if (get(formValue, 'email', null) && get(formValue, 'name', null) && get(formValue, 'stage', null) && get(formValue, 'actionStub', null)) isValid = true;
    return isValid;
  };
  
  const createNewDeal = () => {
    const payload = {
      link: `/${activeSingleProperty.id}/prospects`,
      page: activeSingleProperty.id,
      leadName: formValue.name,
      leadEmail: formValue.email,
      leadPhone: formValue.phone,
      company: activeSingleCompany.stub,
      stage: formValue.stage,
      actionStub: formValue.actionStub,
    };
    handleCreateDeal(payload);
  };
  
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

CreateDeal.propTypes = {
  destroyForm: PropTypes.func.isRequired,
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  handleCreateDeal: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
};

CreateDeal.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: get(state, 'common.isLoading', 0) > 0,
  activeSingleCompany: get(state, 'companies.activeSingleCompany', null),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.CreateDeal.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleReset(data) {
    (dispatch(reset('CreateDeal', data)));
  },
  initForm(value) {
    dispatch(initializeForm('CreateDeal', value));
  },
  destroyForm() {
    dispatch(destroy('CreateDeal'));
  },
  handleCreateDeal: bindActionCreators(createDeal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(CreateDeal);
