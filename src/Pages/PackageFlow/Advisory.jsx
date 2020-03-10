import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { getProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { sendGenericMail } from '../../actions/CommonActions';
import { BrixelRadioButton, BrixelCheckbox, BrixelInputText, BrixelButtonPrimary, Validation } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

function Advisory(props) {
  // PROPS
  const {
    errorValue,
    formValue,
    handleGetPage,
    handleSendGenericMail,
    handleUpdatePage,
    loggedUser,
    match,
    property,
  } = props;

  useEffect(() => {
    const data = {
      id: match.params.propId,
    };
    handleGetPage(data);
  }, []);

  const sendForm = async (e) => {
    e.preventDefault();
    Object.keys(errorValue).map((key) =>{
      if (errorValue[key] !== true) return false;
    });
    let reason = '';
    const answer = {
      'active': true,
      'alreadyHasEstimation': formValue.alreadyHasEstimation,
      'sellingReason': {
        homeChange: false,
        investmentProperty: false,
        inheritedProperty: false,
        someoneElse: false,
        other: false,
      },
      'onYourOwn': formValue.onYourOwn
    };
    formValue.sellingReason.map((key) => {
      if (key === 'homeChange') {
        reason += 'Change of homes / ';
        answer.sellingReason.homeChange = true;
      } else if (key === 'sellingInvestment') {
        reason += 'Selling an investment property / ';
        answer.sellingReason.investmentProperty = true;
      } else if (key === 'sellingInherited') {
        reason += 'Selling an inherited property / ';
        answer.sellingReason.inheritedProperty = true;
      } else if (key === 'someoneElse') {
        reason += 'I am selling for someone else / ';
        answer.sellingReason.someoneElse = true;
      } else {
        reason += 'Other / ';
        answer.sellingReason.other = true;
      }
    });

    const message = `
            <h1>User requested a personal offer through the package flow channel</h1>
            <p><b>User ID</b> ${loggedUser.user.id}</p>
            <p><b>User Name</b> ${loggedUser.user.name}</p>
            <p><b>Page ID</b> ${match.params.propId}</p>
            <p><b>Page Title</b> <a href="${baseByData.pageUrl}/${property.stub}">${property.title}</a></p>
            <p><b>Page Stub</b> ${property.stub}</p>
            <h4>Here are the contents</h4>
            <p><b>First Name</b> ${loggedUser.user.firstName}</p>
            <p><b>Last Name</b> ${loggedUser.user.lastName}</p>
            <p><b>User already has estimation?</b> ${formValue.alreadyHasEstimation ? formValue.alreadyHasEstimation : 'No response'}</p>
            <p><b>Reason for selling</b> ${reason ? reason : 'No response'}</p>
            <p><b>How much the user wants to do on his own</b> ${formValue.onYourOwn ? formValue.onYourOwn : 'No response'}</p>
            <p><b>Phone number</b> ${formValue.phone ? formValue.phone : 'No response'}</p>
            <p><b>Email</b> ${loggedUser.user.email}</p>
      `;

    const mail = {
      destinationEmail : 'support@brixel.io', // email
      recipientEmail : 'support@brixel.io', // email
      subject        : `A personal offer was requested`,
      message        : message,
    };
    await handleSendGenericMail(mail);
    const data = {
      id: match.params.propId,
      redirectTo: `/packageFlow/${match.params.propId}/thankyou`,
      packageFlowProcess: property.packageFlowProcess,
    };
    data.packageFlowProcess.orderPDF = answer;
    await handleUpdatePage(data);
  };

  return (
    <main id="advisory">
      <div className="container">
        <h6 className="my-4">Great. Your market check is being created and will be in your inbox within the next 48 hours.</h6>
        <h6 className="mb-1">Did you already know?</h6>
        <h4 className="mb-2">Our clients save over 52 hours of work or CHF 19'300 in average by selling with Brixel Premium.</h4>
        <h5 className="mb-2">Get your personal offer:</h5>
        <form onSubmit={(e) => sendForm(e)}>
          <div className="mb-2 max-w-fix-416">
            <Field
              label="Do you already have an estimation?"
              component={BrixelRadioButton}
              name="alreadyHasEstimation"
              icons={true}
              validate={[Validation.required]}
              options={[
                {
                  value: 'yes',
                  label: 'Yes',
                },
                {
                  value: 'no',
                  label: 'No',
                }
              ]}
            />
          </div>
          <div className="mb-2 max-w-fix-416">
            <Field
              label="What is the reason for selling?"
              component={BrixelCheckbox}
              name="sellingReason"
              icons={true}
              validate={[Validation.required]}
              options={[
                {
                  value: 'homeChange',
                  label: 'Change of homes',
                },
                {
                  value: 'investmentProperty',
                  label: 'Selling an investment property',
                },
                {
                  value: 'inheritedProperty',
                  label: 'Selling an inherited property',
                },
                {
                  value: 'someoneElse',
                  label: 'I am selling for someone else',
                },
                {
                  value: 'other',
                  label: 'Other reason',
                }
              ]}
            />
          </div>
          <div className="mb-2 max-w-fix-416">
            <Field
              label="How much do you want to do on your own?"
              component={BrixelRadioButton}
              name="onYourOwn"
              icons={true}
              validate={[Validation.required]}
              options={[
                {
                  value: 'everything',
                  label: 'Everything',
                },
                {
                  value: 'some',
                  label: 'Some parts',
                },
                {
                  value: 'nothing',
                  label: 'Nothing',
                }
              ]}
            />
          </div>
          <div className="mb-2 max-w-fix-416">
            <Field
              label="How much do you want to do on your own?"
              component={BrixelInputText}
              validate={[Validation.isPhone, Validation.required]}
              name="phone"
              icons={true}
            />
          </div>
          <BrixelButtonPrimary
            label="Get personal offer now"
            type="submit"
            onClick={(e) => sendForm(e)}
          />
        </form>
      </div>
    </main>
  );
}

Advisory.propTypes = {
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetPage: PropTypes.func.isRequired,
  handleSendGenericMail: PropTypes.func.isRequired,
  handleUpdatePage: PropTypes.func.isRequired,
  loggedUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  property: PropTypes.object
};

Advisory.defaultProps = {
  errorValue: null,
  loggedUser: {},
  property: null,
};

const mapStateToProps = (state, props) => ({
  errorValue: get(state, 'form.Advisory.syncErrors', {}),
  formValue: get(state, 'form.Advisory.values', {}),
  property: get(state, 'property.property', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  initialValues: {
    phone: get(state, 'user.loggedUser.user.phone', '')
  }
});
const mapDispatchToProps = (dispatch) => ({
  handleGetPage: bindActionCreators(getProperty, dispatch),
  handleSendGenericMail: bindActionCreators(sendGenericMail, dispatch),
  handleUpdatePage: bindActionCreators(saveActiveSingleProperty, dispatch),
});

const AdvisoryForm = reduxForm({
  form: 'Advisory', // a unique identifier for this form
})(Advisory);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AdvisoryForm);
