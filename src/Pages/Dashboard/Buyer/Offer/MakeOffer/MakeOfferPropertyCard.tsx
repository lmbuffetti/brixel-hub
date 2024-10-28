import React from 'react';
import get from 'lodash/get';
import {connect} from 'react-redux';
import { has } from 'lodash';
import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {Helpers, FormatValue, BrixelImage} from '@brixel-io/brixel-components';
import CoverPropertyImage from '../../../../../components/CoverPropertyImage';
import translateTo from '../../../../../utils/translation';

type MakePropertyCardType = {
  activeSingleProperty: PropertyType
  lang: string
}

const MakeOfferPropertyCard = ({ activeSingleProperty, lang }: MakePropertyCardType) => {
  return (
    <>
      <div className="brdRadius dis-fl-row-sm dis-fl-col brdSmall brdText100 ov-h bgWhite">
        <BrixelImage
          className="avatar w-fix-sm-200 max-h-fix-200 pos-r cover"
          url={get(activeSingleProperty, 'coverPhoto.url', '')}
          alt="Property"
          size="L"
          isSquare
          loading="lazy"
        />
        <div className="dis-fl-col w-perc-100 py-2 px-2">
          <span className="dis-b pb-small-4 fsize-300 txtText600">
            {Helpers.formatAddress(activeSingleProperty.location)}
          </span>
          <p className={'itemTitle fweight-600 dis-b txtText900'}>{activeSingleProperty.title}</p>
          <div className="dis-fl-row mb-2 ff-mono fsize-300">
            <span className="rooms">
              {FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))} {get(activeSingleProperty, 'location.countryCode', 'CH') === 'CH' && translateTo('Rooms', lang)}
            </span>
            <span  className="px-1"> &bull; </span>
            <div className="dis-f">
              <span className="">
                {(activeSingleProperty && activeSingleProperty.properties && activeSingleProperty.properties.typology && has(activeSingleProperty.properties, 'typology') && activeSingleProperty.properties.typology.livingArea) ? activeSingleProperty.properties.typology.livingArea.value : '-'}
              </span>
              <span className="pl-small-4">m2</span>
            </div>
            <span className="px-1"> &bull; </span>
            <span>
              {(activeSingleProperty && activeSingleProperty.properties && activeSingleProperty.properties.building && has(activeSingleProperty.properties, 'building') && activeSingleProperty.properties.building.built) ? activeSingleProperty.properties.building.built : '-'}
            </span>
          </div>
          <div className="dis-fl-col mt-a">

            <h6 className="fsize-300 hide dis-b-sm fweight-300 txtText600">Listing price:</h6>
            {
              activeSingleProperty?.status === 'on-sale' && activeSingleProperty?.price?.total && (
                <p className="txtGreen400 ff-mono">
                  <span>CHF</span>
                  <span className="ff-mono fsize-500">{Helpers.formatNumberValue(activeSingleProperty.price.total, activeSingleProperty?.price?.currency || 'CHF')}
                  </span>
                </p>
              )
            }
            {
              activeSingleProperty?.status === 'on-request' && (
                <span className="txtText700 ff-mono">{translateTo('On Request', lang)}</span>
              )
            }
            {
              activeSingleProperty?.status === 'sold' && (
                <span className="txtText700 ff-mono">{translateTo('Sold', lang)}</span>
              )
            }
            {
              activeSingleProperty?.status === 'reserved' && (
                <span className="txtText700 ff-mono">{translateTo('Reserved', lang)}</span>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(MakeOfferPropertyCard);
