/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelInputText,
  Validation,
  ReduxField,
  change,
  reset,
} from '@brixel/brixel-components';
import { DateTime } from 'luxon';
import {
  createPropertyVisitBooking,
} from '../../actions/PropertyActions';

const Showings = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    errorValue,
    formValue,
    handleCreatePropertyVisitBooking,
    isSmallLoading,
    lang,
    schedule,
    userLang,
  } = props;
  // PARAMS URL
  const propID = get(match, 'propID', null);
  const idShowing = get(match, 'idShowing', null);

  const saveData = () => {
    const data = {
      page: propID,
      smallLoader: 'addBooking',
      slots: [
        {
          start: DateTime.fromSQL(schedule.slots[idShowing], { locale: userLang }).toFormat('HH:mm'),
          end: DateTime.fromSQL(schedule.slots[idShowing], { locale: userLang }).plus({ hours: 1 }).toFormat('HH:mm'),
          date: DateTime.fromSQL(schedule.slots[idShowing], { locale: userLang }).toFormat('yyyy-LL-dd'),
          status: 'accepted',
        },
      ],
      buyer: {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        language: lang,
      },
      message: formValue.userMessage,
      redirectTo: `/${propID}/marketing/showings`,
    };
    handleCreatePropertyVisitBooking(data);
  };

  const checkValidField = () => {
    let isValid = true;
    Object.keys(errorValue).map((key) => {
      if (errorValue[key] !== true) isValid = false;
    });
    return isValid;
  };

  // URL PARAMS
  return (
    <div className="thirdLevel dis-fl-col w-perc-100 ml-lg-2">
      <div className="">
        <div className="dis-f jc-b a-t pb-3">
          <div>
            <h5>Add Booking</h5>
            {
              schedule.slots && (
                <p className="txtDark200 fsize-300">
                  {
                    DateTime.fromSQL(schedule.slots[idShowing], { locale: userLang }).toFormat('dd LLLL yyyy HH:mm')
                  }
                </p>
              )
            }
          </div>
          <BrixelButtonIcon
            icon="close-small"
            ghost
            onClick={() => history.push(`/${propID}/marketing/showings`)}
          />
        </div>
        <div className="mb-3">
          <div>
            <ReduxField
              form="Showings"
              input={{
                name: 'name',
                type: 'text',
                placeholder: '',
                validate: [Validation.required],
              }}
              labels={{
                label: 'Name',
              }}
              design={{
                className: 'mt-0',
              }}
              component={BrixelInputText}
              meta={{
                dirty: formValue['name'] && errorValue['name'] !== true,
                invalid: true,
              }}
              // modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
              message={{
                help: null,
                error: errorValue['name'],
              }}
            />
            <ReduxField
              form="Showings"
              input={{
                name: 'email',
                type: 'email',
                placeholder: '',
                validate: [Validation.isEmail, Validation.required],
              }}
              design={{
                className: 'mt-2',
              }}
              labels={{
                label: 'Email',
              }}
              component={BrixelInputText}
              meta={{
                dirty: formValue['email'] && errorValue['email'] !== true,
                invalid: true,
              }}
              // modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
              message={{
                help: null,
                error: errorValue['email'],
              }}
            />
            <ReduxField
              form="Showings"
              design={{
                className: 'mt-2',
              }}
              input={{
                name: 'phone',
                type: 'text',
                placeholder: '',
                validate: [Validation.required],
              }}
              inputFormat={{
                formatType: 'tel',
              }}
              labels={{
                label: 'Phone',
              }}
              component={BrixelInputText}
              type="text"
              meta={{
                dirty: formValue['phone'] && errorValue['phone'] !== true,
                invalid: true,
              }}
              // modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
              message={{
                help: null,
                error: errorValue['phone'],
              }}
            />
          </div>
        </div>
        <div className="dis-f p-2">
          <BrixelButtonPrimary
            label="Cancel"
            theme="white"
            rounded
            className="mr-1"
            onClick={() => history.push(`/${propID}/marketing/showings`)}
          />
          <BrixelButtonPrimary
            label="Save"
            className="ml-1"
            rounded
            onClick={() => saveData()}
            isLoading={isSmallLoading === 'addBooking' || isSmallLoading === 'booking'}
            disabled={!checkValidField()}
          />
        </div>
      </div>
    </div>
  );
};

Showings.propTypes = {
  errorValue: PropTypes.object.isRequired,
  handleCreatePropertyVisitBooking: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  lang: PropTypes.string,
  schedule: PropTypes.object.isRequired,
  userLang: PropTypes.string.isRequired,
};

Showings.defaultProps = {
  lang: 'en',
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  errorValue: get(state, 'brixelForm.Showings.syncErrors', {}),
  formValue: get(state, 'brixelForm.Showings.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'coomon.currentLanguage', 'en'),
  schedule: get(state, 'brixelForm.Property.values.schedule', {}),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Showings', field, value));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Showings);
