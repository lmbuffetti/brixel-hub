import React from 'react';
import BuyerBannerData from './BannerBuyerData';
import translateTo from '../../utils/translation';
import {
  BrixelButtonPrimary,
} from '@brixel-io/brixel-components';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';

export type BannerBuyerByStatusType = {
  className?: string;
  customDescription?: string,
  history: any;
  isLoading: boolean;
  lang: string;
  propID: string
  status: 'accepted' | 'cancelled' | 'pending' | 'visited' | 'default' | 'rejected';
  type: 'visit' | 'offer'
}

const BannerBuyerByStatus = ({
  className,
  customDescription,
  history,
  isLoading,
  lang,
  propID,
  type,
  status,
} : BannerBuyerByStatusType) => {
  const bannerData = BuyerBannerData(propID, customDescription)[type][status];

  return (
    <button
      className={`shadow-2dp brdRadius dis-f jc-b pt-2 pl-2 pl-sm-3 ${className} pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi ta-l ${bannerData.bg}`}
    >
      {
        (isLoading) && (
          <div className="dis-fl-col w-perc-100 pr-2 pr-sm-3">
            <div className="skeletonh4" />
            <div className="skeletonh4 mt-1" />
            <div className="skeletonSmall mt-2" />
          </div>
        )
      }
      <div
        className="cardWithBg rightPosBg"
        style={{backgroundImage: `url(${bannerData.backgroundImg})`}}
      >
        <div className="dis-fl-col max-w-perc-100">
          <h5 className="fweight-600">
            {translateTo(bannerData.title, lang)}
          </h5>
          <div className="dis-f a-c max-w-perc-80 mt-1">
            <p className="pr-2 mb-3">
              {
                bannerData.description.map((desc, index) => (
                  <span key={index} className="dis-b">
                    {translateTo(desc, lang)}
                  </span>
                ))
              }
            </p>
          </div>

          <div className="mt-a">
            {
              bannerData.buttonType === 'secondary' ? (
                <BrixelButtonSecondary
                  bgTransparent
                  label={translateTo(bannerData.buttonLabel, lang)}
                  rounded
                  leftIcon={bannerData.buttonIcon}
                  onClick={() => history.push(bannerData.buttonLink)}
                />
              ) :(
                <BrixelButtonPrimary
                  label={translateTo(bannerData.buttonLabel, lang)}
                  rounded
                  leftIcon={bannerData.buttonIcon}
                  onClick={() => history.push(bannerData.buttonLink)}
                />
              )
            }
          </div>
        </div>
      </div>

    </button>
  )
}

export default BannerBuyerByStatus;
