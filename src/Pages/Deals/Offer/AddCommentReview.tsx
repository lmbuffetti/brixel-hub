import React from 'react';
import {
  BrixelButtonIcon,
} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import {BrixelTextArea} from '@brixel-io/brixel-components/dist/form';

type AddCommentReviewType = {
  lang: string
  changeStep: (isBack: boolean) => void
  isLoadingSave: boolean
  onClick: () => void
  onChangeValue: (name: string, value: string) => void
  status: 'accepted' | 'rejected'
}

const AddCommentReview = ({
  onChangeValue,
  changeStep,
  isLoadingSave,
  lang,
  onClick,
  status,
}: AddCommentReviewType) => {

  return (
    <>
      {
        status === 'accepted' ? (
          <>
            <h2 className="ta-c fweight-600 pt-3 mb-1">
              {translateTo('Confirm acceptance', lang)}
            </h2>
            <h6 className="fweight-400 ta-c txtText600">
              {translateTo('You are about to accept the offer.', lang)}
            </h6>
          </>
        ) : (
          <>
            <h2 className="ta-c fweight-600 pt-3 mb-1">
              {translateTo('Confirm rejection', lang)}
            </h2>
            <h6 className="fweight-400 ta-c txtText600">
              {translateTo('You are about to reject the offer.', lang)}
            </h6>
          </>
        )
      }
      <h6 className="fweight-400 ta-c txtText600">
        {translateTo('Would you like to add a comment?', lang)}
      </h6>
      <div className="mt-4">
        <BrixelTextArea
          input={{
            name: 'note',
            onChange: (value: string) =>onChangeValue('note', value),
          }}
          label={translateTo('Add a comment (optional)', lang)}
        />
      </div>

      <div className="dis-f jc-c a-c my-4">
        <BrixelButtonIcon
          className="backBtn brdSmall brdGreen400 mr-small-4"
          icon="arrow-left-small"
          onClick={() => changeStep(true)}
          theme="green"
          themeSat={400}
          bgTransparent
        />
        <BrixelButtonPrimary
          rounded
          className="ml-small-4"
          label={translateTo('Submit', lang)}
          rightIcon="arrow-right-small"
          onClick={() => onClick()}
          isLoading={isLoadingSave}
        />
      </div>

    </>
  )
  ;
}

export default AddCommentReview;
