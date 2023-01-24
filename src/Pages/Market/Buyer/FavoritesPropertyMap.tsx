import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelMap} from '@brixel/brixel-components/dist/map';
import get from 'lodash/get';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import api from '../../../controllers/api/config';
import type {FavoritesPropertyMapType, TagListMapType} from '../../../@types/Pages/Market/Buyer/FavoritesPropertyMap';

const FavoritesPropertyMap = (props: FavoritesPropertyMapType) => {
  const {
    lang,
    wishlistProperties,
  } = props;
  // STATE
  const [tagsList, setTagsList] = useState<TagListMapType>();


  useEffect(() => {
    wishlistProperties.forEach((prop) => {
      api.deal.getBuyerDeal(prop.id)
        .then((res) => {
          const dealDetail = res.data;
          const offerData = get(dealDetail, 'closing.stageOffer', {});
          if (get(offerData, 'offer.status', null)) {
            const tagMessage = {
              accepted: 'Offer accepted',
              pending: 'Offer sent',
              rejected: 'Offer rejected',
            };
            const status = get(offerData, 'offer.status', null);
            setTagsList((prevState) => ({
              ...prevState,
              [prop.id]: [{
                status: get(offerData, 'offer.status', null),
                message: tagMessage[status],
                text: tagMessage[status],
                lang: lang,
                type: 'offer',
              }],
            }))
          }
        })
    })
  }, [wishlistProperties]);

  // STATE
  return (
    <>
      <BrixelMap
        baseByData={baseByData}
        className="w-perc-100 h-perc-100 min-h-fix-400"
        center={{
          lat: get(wishlistProperties[0], 'location.latitude', 0),
          lng: get(wishlistProperties[0], 'location.longitude', 0),
        }}
        tags={tagsList}
        type="roadmap"
        markers={wishlistProperties}
        gestureHandling="cooperative"
        lang={lang}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  wishlistProperties: get(state, 'market.wishlistProperties.data', []),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesPropertyMap);
