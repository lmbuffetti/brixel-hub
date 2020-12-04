/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, useRef,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  useOutsideAlerter, ReduxField, BrixelButtonPrimary, BrixelInputText,
  reset, change, initializeForm, BrixelSelect, destroy, BrixelButtonIcon,
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
import SplashScreen from '../../components/SplashScreen';
import ProgressBar from '../../components/ProgressBar';

const CreateDeal = (props) => {
  const {
    activeSingleProperty,
    handleCreateDeal,
    // handleGetLeads,
    formValue,
    userListings,
    changeFieldValue,
    destroyForm,
    history,
    loggedInUser,
  } = props;

  const {
    factsOptions,
  } = FactsOptions;

  const [selected, setSelected] = useState(false);
  const [createNewUser, setCreateNewUser] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const refAutoComplete = useRef(null);

  useEffect(() => () => destroyForm(), []);

  useEffect(() => {
    const searchUserValue = get(formValue, 'autocomplete-user', null);
    const listsUser = [];
    if (searchUserValue) {
      userListings.forEach((usr) => {
        listsUser.push({
          value: usr.id,
          label: `${usr.name} (${usr.email})`,
        });
      });
      listsUser.push({
        value: '',
        label: 'Create new user +',
      });
    }
    if (!selected) {
      setUserLists(listsUser);
    }
  }, [userListings]);

  useEffect(() => {
    const searchUserValue = get(formValue, 'autocomplete-user', null);
    if (searchUserValue && !selected) {
      const data = {
        leadType: 'user',
        resultsPerPage: 20,
        offset: 0,
        text: searchUserValue,
        order: 'name',
        direction: 'ASC',
        company: '',
        smallLoader: true,
      };
      // Get list of users
      // handleGetLeads(data);
    }
    if (selected) {
      setTimeout(() => {
        setSelected(false);
      }, 500);
    }
  }, [get(formValue, 'autocomplete-user', null)]);

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

  const onSelectUser = (data) => {
    const singUsr = userListings.find((usr) => usr.id === data);
    setUserLists([]);
    setSelected(true);
    if (singUsr) {
      changeFieldValue('user.id', singUsr.id);
      changeFieldValue('autocomplete-user', singUsr.name);
    } else {
      changeFieldValue('user', null);
      setCreateNewUser(true);
    }
  };

  const checkValidateField = () => {
    let isValid = false;
    if (createNewUser === false) {
      if (get(formValue, 'user.id', null) && get(formValue, 'autocomplete-user', null) && get(formValue, 'stage', null) && get(formValue, 'actionStub', null)) isValid = true;
      return isValid;
    }
    if (createNewUser === true) {
      if (get(formValue, 'email', null) && get(formValue, 'autocomplete-user', null) && get(formValue, 'stage', null) && get(formValue, 'actionStub', null)) isValid = true;
      return isValid;
    }
    return isValid;
  };

  const createNewDeal = () => {
    let payload = {};
    if (createNewUser === true) {
      payload = {
        link: `/${activeSingleProperty.id}/property/deals`,
        page: activeSingleProperty.id,
        leadName: formValue['autocomplete-user'],
        leadEmail: formValue.email,
        leadPhone: formValue.phone,
        company: loggedInUser.company.id,
        stage: formValue.stage,
        actionStub: formValue.actionStub,
      };
    }
    if (createNewUser === false) {
      payload = {
        link: `/${activeSingleProperty.id}/property/deals`,
        page: activeSingleProperty.id,
        user: formValue.user.id,
        stage: formValue.stage,
        actionStub: formValue.actionStub,
      };
    }
    handleCreateDeal(payload);
  };

  useOutsideAlerter(refAutoComplete, {
    action: 'function',
    func: () => {
      setUserLists([]);
    },
  });

  return (
    <SplashScreen
      closeLink={`/${activeSingleProperty.id}/deals`}
      className="create-deal"
      closeOutside={false}
    >
      <div className="add-deal-container w-perc-100 h-perc-100 dis-fl-col p-2">
        <div className="dis-f jc-fe">
          <BrixelButtonIcon
            className="shadow-1dp"
            noBorder
            bgTransparent
            color="dark"
            saturationTxt={400}
            icon="close-small"
            onClick={() => history.push(`/${activeSingleProperty.id}/deals`)}
          />
        </div>
        <div className="dis-fl-col max-w-fix-520 w-perc-100 h-perc-100 ml-a mr-a">
          <h5 className="mb-2">Create new deal</h5>
          <div className="w-perc-100 mb-2 pos-r" ref={refAutoComplete}>
            <ReduxField
              form="CreateDeal"
              input={{
                name: 'autocomplete-user',
              }}
              autocomplete={{
                user: {
                  data: userLists,
                  func: (data) => onSelectUser(data),
                },
              }}
              labels={{
                label: 'Name',
              }}
              component={BrixelInputText}
            />
          </div>
          {
            createNewUser && (
              <>
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
              </>
            )
          }
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
            background="primary"
            saturation={400}
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
  activeSingleProperty: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleCreateDeal: PropTypes.func.isRequired,
  // handleGetLeads: PropTypes.func.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  userListings: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CreateDeal.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: get(state, 'common.isLoading', 0) > 0,
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.CreateDeal.values', {}),
  userListings: get(state, 'user.userListings.users', []),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('CreateDeal', field, value));
  },
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
)(CreateDeal);
