import React, {useEffect, useState} from 'react';
import {
  BrixelInputText,
  BrixelTextArea,
} from '@brixel-io/brixel-components/dist/form';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelTooltip,
  BrixelIcon,
  Helpers,
} from '@brixel-io/brixel-components';
import type {
  PropertyType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import {saveMakeOffer} from '../../../../../actions/DealActions';
import translateTo from '../../../../../utils/translation';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';

type MakeOfferType = {
  activeSingleOffer: OfferType;
  activeSingleProperty: PropertyType
  closeModal: () => void;
  dealID?: string;
  handleSaveMakeOffer: (data: object) => void;
  isSmallLoading?: {sendData: boolean}
  lang?: string;
}

const MakeOffer = (props: MakeOfferType) => {
  // PROPS
  const {
    activeSingleOffer,
    activeSingleProperty,
    closeModal,
    dealID,
    handleSaveMakeOffer,
    isSmallLoading,
    lang = 'en',
  } = props;
  const [formValue, setFormValue] = useState<{ amount: number, message?: string }>({amount: 0, message: ''});

  useEffect(() => {
    if (isSmallLoading?.sendData === false) {
      closeModal();
    }
  }, [isSmallLoading]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    if (dealID && formValue?.amount) {
      const data = {
        ...formValue,
        id: dealID,
        smallLoader: 'sendData',
      };
      handleSaveMakeOffer(data);
    }
  };

  return (
    <div className="flex-1 dis-fl-col px-2 px-md-4 py-2">
      <div className="bgBlue50 brdSmall brdBlue100 brdRadius dis-f a-c p-2">
        <BrixelIcon icon="info" color="blue" saturationTxt={500} />
        <p className="txtBlue500 ml-2">
          {translateTo('We\'ve kept your previous details saved, so you only need to enter your new price.', lang)}
        </p>
      </div>

      <div className="bgText25 brdRadius dis-f a-c p-3 mt-3 jc-b">
        <div className='dis-fl-col'>
          <span className="mb-small-4 txtText700 fsize-300">
            {translateTo('Listing price:', lang)}
          </span>
          {
            activeSingleProperty?.status === 'on-sale' && activeSingleProperty?.price?.total && (
              <p className="txtText800 dis-f a-c ff-mono">
                <span className="mr-1 ff-mono fsize-300 fsize-md-400">
                  {activeSingleProperty?.price?.currency}
                </span>
                <span className="ff-mono fsize-500 ff-mono fsize-md-500">
                  {Helpers.formatNumberValue(activeSingleProperty.price.total, activeSingleProperty?.price?.currency || 'CHF')}
                </span>
              </p>
            )
          }
          {
            activeSingleProperty?.status === 'on-request' && (
              <span className="txtText700 ff-mono fsize-500">{translateTo('On Request', lang)}</span>
            )
          }
          {
            activeSingleProperty?.status === 'sold' && (
              <span className="txtRed700 ff-mono fsize-500">{translateTo('Sold', lang)}</span>
            )
          }
          {
            activeSingleProperty?.status === 'reserved' && (
              <span className="txtBlue700 ff-mono fsize-500">{translateTo('Reserved', lang)}</span>
            )
          }
        </div>
        <div className="w-fix-small-1 h-fix-56 bgText200" />
        <div className='dis-fl-col'>
          <span className="mb-small-4 txtText700 fsize-300">
            {translateTo('Last offer:', lang)}
          </span>
          {
            activeSingleOffer?.amount && (
              <p className="txtGreen400 dis-f a-c ff-mono">
                <span className="mr-1 ff-mono fsize-300 fsize-md-400">
                  {activeSingleOffer?.currency || 'CHF'}
                </span>
                <span className="ff-mono fsize-500 ff-mono fsize-md-500">
                  {Helpers.formatNumberValue(activeSingleOffer?.amount, activeSingleOffer?.currency || 'CHF')}
                </span>
              </p>
            )
          }
        </div>
      </div>

      <div className="mt-3">
        <BrixelInputText
          label={translateTo('Your new offer', lang)}
          className=""
          input={{
            name: 'amount',
            type: 'text',
            onChange: (val) => setFormValue({...formValue, amount: val}),
          }}
          currency={activeSingleOffer?.currency || 'CHF'}
          formatType="price"
          unit={activeSingleOffer?.currency || 'CHF'}
          large
        />
        <BrixelTextArea
          className="mt-3"
          large
          label={translateTo('Add a comment (optional)', lang)}
          input={{
            name: 'message',
            type: 'text',
            onChange: (val) => setFormValue({...formValue, message: val}),
          }}
        />
        <div className="dis-f a-c mt-3">
          <p className="mr-1 mt-a mb-a fsize-200 txtText400">{translateTo('This is a non-binding offer.', lang)}</p>
          <BrixelTooltip
            hideIcon={false}
            description={translateTo('This offer does not create any legal obligations and serves as a preliminary proposal. Final terms may change after further discussion.', lang)}
          />
        </div>
      </div>

      <div className="dis-f mt-a jc-fe pt-md-4 pt-2">
        <BrixelButtonText
          className="mr-2"
          theme="text"
          onClick={() => closeModal()}
          label={translateTo('Cancel', lang)}
        />
        <BrixelButtonPrimary
          rounded
          label={translateTo('Submit', lang)}
          onClick={() => saveData()}
          isLoading={isSmallLoading?.sendData}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return ({
    activeSingleProperty: state?.property?.activeSingleProperty || {},
    activeSingleOffer: state?.deal?.activeSingleOffer || {},
    dealID: state?.deal?.activeSingleDeal?.id || null,
    isSmallLoading: state?.common?.isSmallLoading || {},
    lang: state?.common?.language || 'de',
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleSaveMakeOffer: bindActionCreators(saveMakeOffer, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MakeOffer);
