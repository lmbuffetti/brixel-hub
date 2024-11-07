import React from 'react';
import {
  BrixelButtonSecondary,
} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import PhoneIcSavingMoneyIcon from '@brixel-io/brixel-components/dist/images/IconsColored/general/SavingMoney.svg';

type ReviewOfferThankYouProps = {
  closeModal: () => void;
  lang: string;
}

const ReviewOfferThankYou = ({
  closeModal,
  lang,
}: ReviewOfferThankYouProps) => {
  return (
    <div className='dis-fl-col ta-c jc-c a-c my-4 my-md-8'>
      <img src={PhoneIcSavingMoneyIcon} />
      <h3 className='fweight-600 mt-2'>
        {translateTo('Thank you!', lang)}
      </h3>
      <p className='my-3'>
        {translateTo('The buyer will be notified and you will be contacted shortly to proceed with the next steps.', lang)}
      </p>

      <BrixelButtonSecondary
        rounded
        className='mt-3'
        onClick={() => closeModal()}
        label={translateTo('Go to offer overview', lang)}
      />
    </div>
  )
}

export default ReviewOfferThankYou;
