import translateTo from '../utils/translation';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
  FactsOptions,
} from '@brixel/brixel-components';
import React, {useState} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import type {CustomerSatisfactionType} from '../@types/components/CustomerSatisfaction';
import {BrixelInputScale, BrixelTextArea} from '@brixel/brixel-components/dist/form';

const {factsOptions} = FactsOptions;

const CustomerSatisfaction = (props: CustomerSatisfactionType) => {
  const {
    lang,
    onClose,
  } = props;
  // STATE
  const [formValue, setFormValue] = useState({
    rate: -1,
    message: '',
  });
  const [currentStep, setCurrentStep] = useState('rate');

  const onSaveData = () => {
    switch (currentStep) {
      case 'message':
        // SAVE THE DATA
        return false;
        break;
      case 'rate':
        // SAVE THE DATA IF RATE > 4 or 5
        if (formValue.rate >= 4) return false
        else setCurrentStep('message');
        break;
      default:
        onClose();
    }
  }

  return (
    <>
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
        <div className="dis-f jc-b a-c px-2">
          <BrixelButtonText
            rounded
            label="Skip"
            onClick={() => onClose()}
          />
          <BrixelButtonPrimary
            rounded
            label="Send"
            onClick={() => onSaveData()}
          />
        </div>
      </div>
    </>
  )
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(CustomerSatisfaction);
