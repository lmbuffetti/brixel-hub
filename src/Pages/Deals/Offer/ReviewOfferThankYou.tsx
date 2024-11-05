import React from 'react';
import {
  BrixelButtonSecondary,
} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import get from 'lodash/get';
import PhoneIcSavingMoneyIcon from '@brixel-io/brixel-components/dist/images/IconsColored/general/SavingMoney.svg';

type ReviewOfferThankYouProps = {
  lang: string;
}

const ReviewOfferThankYou = ({
  lang,
}: ReviewOfferThankYouProps) => {

  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const propID = get(match, 'propID', null);
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
        onClick={() => history.push(`/buyer/${propID}/offer`)}
        label={translateTo('Go to offer overview', lang)}
      />
    </div>
  )
}

export default ReviewOfferThankYou;
