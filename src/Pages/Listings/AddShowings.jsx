/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React  from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, Field, reduxForm, reset } from 'redux-form';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelInputText,
  Validation,
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
          status: 'accepted'
        }
      ],
      buyer: {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        language: lang,
      },
      message: formValue.userMessage,
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
            className="shadow-2dp"
            icon="close-small"
            color="primary"
            saturationTxt={400}
            bgTransparent
            noBorder
            onClick={() => history.push(`/${propID}/listings/showings`)}
          />
        </div>
        <div className="mb-3">
          <div>
            <Field
              name={'name'}
              label={'Name'}
              component={BrixelInputText}
              validate={[Validation.required]}
              type="text"
              placeholder={''}
              meta={{
                dirty: formValue['name'] && errorValue['name'] !== true,
                invalid: true,
              }}
              //modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
              message={{
                help: null,
                error: errorValue['name'],
              }}
            />
            <Field
              name={'email'}
              label={'Email'}
              component={BrixelInputText}
              validate={[Validation.isEmail, Validation.required]}
              type="text"
              placeholder={''}
              meta={{
                dirty: formValue['email'] && errorValue['email'] !== true,
                invalid: true,
              }}
              //modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
              message={{
                help: null,
                error: errorValue['email'],
              }}
            />
            <Field
              name={'phone'}
              label={'Phone'}
              component={BrixelInputText}
              validate={[Validation.required]}
              type="text"
              placeholder={''}
              meta={{
                dirty: formValue['phone'] && errorValue['phone'] !== true,
                invalid: true,
              }}
              //modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
              message={{
                help: null,
                error: errorValue['phone'],
              }}
            />
          </div>
        </div>
        <div className="dis-f p-2">
          <BrixelButtonPrimary
            label='Cancel'
            background="white"
            saturation={0}
            color="dark"
            saturationTxt={400}
            rounded
            className="shadow-3dp w-perc-100 mr-1"
            onClick={() => history.push(`/${propID}/listings/showings`)}
          />
          <BrixelButtonPrimary
            label='Save'
            background="primary"
            className="shadow-3dp w-perc-100 ml-1"
            saturation={400}
            rounded
            onClick={() => saveData()}
            isLoading={isSmallLoading === 'addBooking'}
            disabled={!checkValidField()}
          />
        </div>
      </div>
    </div>
  );
};

Showings.propTypes = {
  activeSinglePropertyBooking: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  handleCreatePropertyVisitBooking: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.string,
  formValue: PropTypes.object.isRequired,
  lang: PropTypes.string,
  match: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
};

Showings.defaultProps = {
};

const ShowingsForm = reduxForm({
  // a unique name for the form
  form: 'Showings',
})(Showings);

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  errorValue: get(state, 'form.Showings.syncErrors', {}),
  formValue: get(state, 'form.Showings.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  schedule: get(state, 'form.Property.values.schedule', {}),
  lang: get(state, 'coomon.currentLanguage', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ShowingsForm);
