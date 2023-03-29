import React, {useState, useEffect} from 'react';
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
import {sendRate} from '../actions/CommonActions';

const {factsOptions} = FactsOptions;

const CustomerSatisfaction = (props: CustomerSatisfactionType) => {
  const {
    activeSingleCompany,
    handleSaveRate,
    handleUpdateUser,
    isSmallLoading,
    lang,
    loggedInUser,
    onClose,
  } = props;
  // STATE
  const [formValue, setFormValue] = useState({
    rating: -1,
    message: '',
  });
  const [currentStep, setCurrentStep] = useState('rating');

  useEffect(() => {
    if (isSmallLoading.saveData === false) {
      setCurrentStep('success');
    }
  }, [isSmallLoading]);


  const onCloseModal = () => {
    localStorage.brixelSatisfactionDay = Math.floor(Date.now() / 1000);
    const userData = {
      id: get(loggedInUser, 'id', null),
      sentFeedback: (loggedInUser.sentFeedback || 0) + 1,
      smallLoader: 'saveUserData',
    };
    handleUpdateUser(userData);
    onClose();
  }



  const onSendData = () => {
    // SAVE THE DATA
    const data = {
      company: activeSingleCompany.id,
      user: loggedInUser.id,
      message: formValue.message,
      rating: formValue.rating,
      smallLoader: 'saveData',
    }
    handleSaveRate(data);
    const userData = {
      id: get(loggedInUser, 'id', null),
      sentFeedback: -1,
      smallLoader: 'saveData',
    };
    handleUpdateUser(userData);
  }

  const onChangeStep = () => {
    switch (currentStep) {
      case 'message': {
        // SAVE THE DATA
        onSendData();
        break;
      }
      case 'rating':
        // SAVE THE DATA IF rating > 4 or 5
        if (formValue.rating >= 0) {
          if (formValue.rating >= 4) onSendData();
          else setCurrentStep('message');
        }
        break;
      default:
        onClose();
    }
  }

  return (
    <div className='dis-fl-col flex-1 h-perc-100 jc-b'>
      <div className="dis-f jc-fe a-c p-2">
        <BrixelButtonIcon
          ghost
          className="zIndex11"
          theme="text"
          themeSat={400}
          icon="close"
          onClick={() => onCloseModal()}
        />
      </div>
      <div className='px-3'>
        {
          currentStep === 'rating' && (
            <>
              <h3 className="ta-c fsize-600 fweight-600 max-w-fix-360 ml-a mr-a">{translateTo('How would you rate your experience on our platform?', lang)}</h3>

              <div className="w-perc-100 my-5 mb-3">
                <BrixelInputScale
                  input={{
                    name: 'rating',
                    onChange: (val) => setFormValue((prevVal) => ({...prevVal, rating: val})),
                    value: formValue.rating,
                  }}
                  lang={lang}
                  hideMessage={true}
                  iconSize="large"
                  centered
                  showMinMaxLabelValue={true}
                  options={factsOptions.custormerSatisfaction}
                />
              </div>
            </>
          )
        }
        {
          currentStep === 'message' && (
            <>
              <h3 className="ta-c fsize-600 fweight-600 max-w-fix-360 ml-a mr-a">{translateTo('We are sorry! 😕 What can we do to make it better?', lang)}</h3>

              <div className="w-perc-100 mt-4 mb-2">
                <BrixelTextArea
                  input={{
                    name: 'message',
                    onChange: (val) => setFormValue((prevVal) => ({...prevVal, message: val})),
                    value: formValue.message,
                  }}
                />
              </div>
            </>
          )
        }
        {
          currentStep === 'success' && (
            <div className='fadeIn'>
              <h3 className="ta-c fsize-600 fweight-600 max-w-fix-360 ml-a mr-a mb-1">{translateTo('Thank you! 🙂', lang)}</h3>

              <div className="max-w-fix-360 ml-a mr-a mb-2 ta-c mb-2">
                <p className="txtText700">
                  {translateTo('Your feedback is very important and will help us make a better product.', lang)}
                </p>
              </div>
            </div>
          )
        }
      </div>
      <div className="dis-fl-col jc-c pb-2">
        <hr className="mt-5 mb-2 lighter" />
        {
          currentStep === 'success' ? (
            <div className="dis-f jc-fe a-c px-3">
              <BrixelButtonPrimary
                rounded
                label={translateTo('Close', lang)}
                onClick={() => onClose()}
              />
            </div>
          ) : (
            <div className="dis-f jc-b a-c px-2">
              <BrixelButtonText
                rounded
                label={translateTo('Skip', lang)}
                theme='text'
                onClick={() => onCloseModal()}
              />
              <BrixelButtonPrimary
                rounded
                label={translateTo('Send', lang)}
                onClick={() => onChangeStep()}
                rightIcon="send"
                isLoading={isSmallLoading.saveData}
              />
            </div>
          )
        }
      </div>
    </div>
  )
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany' , {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSaveRate: bindActionCreators(sendRate, dispatch),
  handleUpdateUser: bindActionCreators(saveActiveSingleUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(CustomerSatisfaction);
