/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelInputText,
  Validation,
  ReduxField,
  change,
  reset,
} from '@brixel/brixel-components';
import {
  createPropertyVisitBooking,
} from '../../actions/PropertyActions';

const Showings = (props) => {
  // PROPS
  const {
    errorValue,
    formValue,
    history,
    handleCreatePropertyVisitBooking,
    isSmallLoading,
    lang,
    match,
    schedule,
  } = props;
  // PARAMS URL
  const propID = get(match, 'params.propId', null);
  const idShowing = get(match, 'params.idShowing', null);

  const saveData = () => {
    const data = {
      page: propID,
      smallLoader: 'addBooking',
      slots: [
        {
          start: moment(schedule.slots[idShowing]).format('HH:mm'),
          end: moment(schedule.slots[idShowing]).add(1, 'hour').format('HH:mm'),
          date: moment(schedule.slots[idShowing]).format('YYYY-MM-DD'),
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
      redirectTo: `/${propID}/listings/showings`,
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
    <div className="thirdLevel dis-fl-col w-perc-100 ml-md-2">
      <div className="">
        <div className="dis-f jc-b a-t pb-3">
          <div>
            <h5>Add Booking</h5>
            {
              schedule.slots && (
                <p className="txtDark200 fsize-300">
                  {moment(schedule.slots[idShowing]).format('DD MMMM YYYY HH:mm')}
                </p>
              )
            }
          </div>
          <BrixelButtonIcon
            icon="close-small"
            ghost
            onClick={() => history.push(`/${propID}/listings/showings`)}
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
            background="white"
            saturation={0}
            color="dark"
            saturationTxt={400}
            rounded
            className="shadow-3dp mr-1"
            onClick={() => history.push(`/${propID}/listings/showings`)}
          />
          <BrixelButtonPrimary
            label="Save"
            background="primary"
            className="shadow-3dp ml-1"
            saturation={400}
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
  history: PropTypes.object.isRequired,
  handleCreatePropertyVisitBooking: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.string,
  formValue: PropTypes.object.isRequired,
  lang: PropTypes.string,
  match: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
};

Showings.defaultProps = {
  lang: 'en',
  isSmallLoading: null,
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  errorValue: get(state, 'brixelForm.Showings.syncErrors', {}),
  formValue: get(state, 'brixelForm.Showings.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  schedule: get(state, 'brixelForm.Property.values.schedule', {}),
  lang: get(state, 'coomon.currentLanguage', 'en'),
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Showings);
