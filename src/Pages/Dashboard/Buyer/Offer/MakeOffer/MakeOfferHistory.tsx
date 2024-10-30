import React from 'react';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import translateTo from '../../../../../utils/translation';

type MessageHistoryType = {
  activeSingleOffer: OfferType;
  hanldeViewOffer: () => void;
  lang: string
}

const MakeOfferHistory = ({
  activeSingleOffer,
  hanldeViewOffer,
  lang,
}: MessageHistoryType) => {
  return (
    <div className="bgWhite brdRadius p-3">
      {activeSingleOffer.amount}

      <BrixelButtonSecondary
        label={translateTo('View', lang)}
        onClick={() => hanldeViewOffer()}
      />
    </div>
  );
}

export default MakeOfferHistory;
