import React, {useState} from 'react';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
  FactsOptions,
} from '@brixel/brixel-components';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import translateTo from '../utils/translation';
import { saveActiveSingleUser } from '../actions/UserActions';
import type {CustomerSatisfactionType} from '../@types/components/CustomerSatisfaction';
import {BrixelInputScale, BrixelTextArea} from '@brixel/brixel-components/dist/form';
import BrixelButtonIcon from '@brixel/brixel-components/dist/components/BrixelButtonIcon';

const {factsOptions} = FactsOptions;

const CustomerSatisfaction = (props: CustomerSatisfactionType) => {
  const {
    handleUpdateUser,
    lang,
    loggedInUser,
    onClose,
  } = props;
  // STATE
  const [formValue, setFormValue] = useState({
    rate: -1,
    message: '',
  });
  const [currentStep, setCurrentStep] = useState('rate');

  const onCloseModal = () => {
    const userData = {
      id: get(loggedInUser, 'id', null),
      sentFeedback: (loggedInUser.sentFeedback || 0) + 1,
      smallLoader: 'saveData',
    };
    handleUpdateUser(userData);
    onClose();
  }

  const onSendData = () => {
    // SAVE THE DATA
    const data = {
      user: loggedInUser.id,
      message: formValue.message,
      rate: formValue.rate,
    }
    setCurrentStep('success');
    // const userData = {
    //   id: get(loggedInUser, 'id', null),
    //   sentFeedback: -1,
    //   smallLoader: 'saveData',
    // };
    // handleUpdateUser(userData);
    console.log(data);
  }

  const onChangeStep = () => {
    switch (currentStep) {
      case 'message': {
        // SAVE THE DATA
        onSendData();
        break;
      }
      case 'rate':
        // SAVE THE DATA IF RATE > 4 or 5
        if (formValue.rate >= 0) {
          if (formValue.rate >= 4) onSendData();
          else setCurrentStep('message');
        }
        break;
      default:
        onClose();
    }
  }

  return (
    <>
      <div className="dis-f jc-fe a-c p-2">
        <BrixelButtonIcon
          ghost
          className="zIndex11"
          theme="text"
          icon="close-small"
          onClick={() => onCloseModal()}
        />
      </div>
      <div className="dis-fl-col jc-c pb-2">
        {
          currentStep === 'rate' && (
            <div className="px-2">
              <h3 className="ta-c">{translateTo('How would you rate your experience on our platform?', lang)}</h3>

              <div className="w-perc-100 mt-5">
                <BrixelInputScale
                  input={{
                    name: 'rate',
                    onChange: (val) => setFormValue((prevVal) => ({...prevVal, rate: val})),
                    value: formValue.rate,
                  }}
                  hideMessage={true}
                  iconSize="large"
                  showMinMaxLabelValue={true}
                  options={factsOptions.custormerSatisfaction}
                />
              </div>
            </div>
          )
        }
        {
          currentStep === 'message' && (
            <div className="px-2">
              <h3 className="ta-c">{translateTo('We are sorry! 😕 What can we do to make it better?', lang)}</h3>

              <div className="w-perc-100 mt-5">
                <BrixelTextArea
                  input={{
                    name: 'message',
                    onChange: (val) => setFormValue((prevVal) => ({...prevVal, message: val})),
                    value: formValue.message,
                  }}
                />
              </div>
            </div>
          )
        }
        {
          currentStep === 'success' && (
            <div className="px-2">
              <h3 className="ta-c">{translateTo('Thank you for your answer! 🙂', lang)}</h3>

              <div className="w-perc-100 mt-5">
                <p>
                  {translateTo('Your feedback is very important to us and will help us make a better product.', lang)}
                </p>
              </div>
            </div>
          )
        }
        <hr className="mt-5 mb-2" />
        {
          currentStep === 'success' ? (
            <div className="dis-f jc-fe a-c px-2">
              <BrixelButtonPrimary
                rounded
                label="Close"
                onClick={() => onClose()}
              />
            </div>
          ) : (
            <div className="dis-f jc-b a-c px-2">
              <BrixelButtonText
                rounded
                label="Skip"
                onClick={() => onCloseModal()}
              />
              <BrixelButtonPrimary
                rounded
                label="Send"
                onClick={() => onChangeStep()}
                rightIcon="send"
              />
            </div>
          )
        }
      </div>
    </>
  )
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateUser: bindActionCreators(saveActiveSingleUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(CustomerSatisfaction);
